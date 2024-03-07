import { createRoom } from "@/lib/liveblocks/rooms/createRoom";
import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "pdf-lib";
import { convertApi } from "@/lib/convert";

async function GET(req, res) {
  // Create authenticated Supabase Client
  const { user, supabase, organization, error } =
    await serverGetUserFromSupabaseAuth(req, res);
  const { project_id, search, filter } = req.query;

  try {
    // First, get all the organizations that the user is part of
    const { data: userOrganizations, error: userOranizationsError } =
      await supabase
        .from("profile_organizations")
        .select("organization_id")
        .filter("profile_id", "eq", user.id);

    const userOrganizationIds = userOrganizations
      ? userOrganizations.map((p) => p.organization_id)
      : [];

    if (userOranizationsError) {
      console.error("Supabase error profile_projects:", userOranizationsError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // First, get all the projects that the user is part of
    const { data: userProjects, error: userProjectsError } = await supabase
      .from("profile_projects")
      .select("project_id")
      .filter("profile_id", "eq", user.id);

    const userProjectIds = userProjects
      ? userProjects.map((p) => p.project_id)
      : [];

    if (userProjectsError) {
      console.error("Supabase error profile_projects:", userProjectsError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Build the main query dynamically based on conditions
    let query = supabase
      .from("documents")
      .select(
        `
      *,
      profiles(
        *,
        scope:profile_documents(*)
      ),
      organization:organizations(
        *,
        profiles(
          *,
          scope:profile_organizations(*)
        )
      ),
      project:projects(
        *,
        organization:organizations(
          *,
          profiles(
            *,
            scope:profile_organizations(*)
          )
        ),
        profiles(
          *,
          scope:profile_projects(*)
        )
      )
    `
      )
      .order("order", { ascending: true });

    if (organization) {
      query = query.filter("organization_id", "eq", organization.id);
    }

    if (project_id !== undefined) {
      query = query.filter("project_id", "eq", project_id);
    }

    if (search !== undefined) {
      query = query.ilike("name", `%${search}%`);
    }

    if (filter !== undefined && filter === "shared") {
      // find documents where the user has
    }

    // Execute the main query
    const { data, error: queryError } = await query;

    if (queryError) {
      console.error("Supabase error documents:", queryError);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Filter data based on the user's access
    const filteredData = data
      .filter((doc) => {
        // If the document is not associated with any project, it should be visible to everyone
        if (!doc.project_id) {
          return true;
        }

        // Direct organization access check should override everything
        const hasOrganizationAccess = userOrganizationIds.includes(
          doc.organization_id
        );

        // Direct document access check
        const hasDirectAccess =
          doc.profiles.some((profile) => profile.id === user.id) || false;

        // Project-based document access check
        const hasProjectAccess = userProjectIds.includes(doc.project_id);

        return hasOrganizationAccess || hasDirectAccess || hasProjectAccess;
      })
      .map((doc) => {
        // Remaining transformation logic
        if (!doc.project) {
          return {
            ...doc,
            profiles: doc.profiles.map((profile) => {
              return {
                ...profile,
                scope: profile.scope.find((s) => {
                  return (
                    s.profile_id === profile.id && s.document_id === doc.id
                  );
                }),
              };
            }),
          };
        }
        return {
          ...doc,
          profiles: doc.profiles.map((profile) => {
            return {
              ...profile,
              scope: profile.scope.find((s) => {
                return s.profile_id === profile.id && s.document_id === doc.id;
              }),
            };
          }),
          project: {
            ...doc.project,
            profiles: doc.project.profiles.map((profile) => {
              return {
                ...profile,
                scope: profile.scope.find((s) => {
                  return (
                    s.profile_id === profile.id &&
                    s.project_id === doc.project.id
                  );
                }),
              };
            }),
          },
        };
      });

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function POST(req, res) {
  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  try {
    const { fileName, storageBucketKey, project_id } = req.body;

    if (!project_id) {
      throw new Error("Project_id required");
    }

    const {
      data: existingDocuments,
      error: existingDocsError,
      count,
    } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project_id);

    if (existingDocsError) {
      throw new Error(existingDocsError.message);
    }

    // Fetch the original PDF
    const originalPdfBytes = await fetchPdfFromStorage(
      storageBucketKey,
      supabase
    );

    const originalPdfDoc = await PDFDocument.load(originalPdfBytes);

    const processDocument = async (i) => {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);

      const newPdfBytes = await newPdfDoc.save();
      const generatedDocumentId = uuidv4();
      const generatedDocumentVersionId = uuidv4();
      const pdfStorageKey = `${organization.id || "all"}/${
        project_id || "no-project"
      }/${generatedDocumentId}/${generatedDocumentVersionId}.pdf`;

      await uploadPdfToStorage(newPdfBytes, pdfStorageKey, supabase);

      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(pdfStorageKey, 24 * 60 * 60);

      if (error) {
        throw new Error(`Error fetching PDF from storage: ${error.message}`);
      }

      const { response, error: convertError } = await convertApi.convert(
        "png",
        {
          File: data.signedUrl,
          ImageHeight: "720",
          ImageWidth: "1280",
        }
      );

      if (convertError || !response.Files || !response.Files.length) {
        throw new Error(`Error fetching PDF from storage: ${error.message}`);
      }
      const imageUrl = response.Files[0].Url;
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          `Error fetching the image from ConvertAPI: ${imageResponse.statusText}`
        );
      }

      // Assuming you are using node-fetch or a similar library
      const pngFile = await imageResponse.blob();

      // i now need to upload this file into supabase storage and get the url
      const imageStorageKey = `${organization.id || "all"}/${
        project_id || "no-project"
      }/${generatedDocumentId}/${generatedDocumentVersionId}.png`;

      // Assuming you have a function similar to uploadPdfToStorage for images
      await uploadImageToStorage(pngFile, imageStorageKey, supabase);

      // Generate URL for the uploaded image
      const { data: thumbnailUrl, error: imageFetchUrlerror } =
        await supabase.storage
          .from("organizations")
          .getPublicUrl(imageStorageKey);

      if (imageFetchUrlerror) {
        throw new Error(
          `Error fetching Image from storage: ${imageFetchUrlerror.message}`
        );
      }

      const order = count + (i + 1);
      if (!count && order === 1) {
        const { data: updatedProject, error: createProjectError } =
          await supabase
            .from("projects")
            .update({
              thumbnail_url: thumbnailUrl.publicUrl,
            })
            .eq("id", project_id)
            .select()
            .single();

        if (createProjectError) {
          throw new Error(createProjectError.message);
        }
      }
      // Create a document record for each page
      const pageFileName = `Page ${order}`;
      const { data: newDocument, error: createDocError } = await supabase
        .from("documents")
        .insert({
          id: generatedDocumentId,
          order: order,
          name: pageFileName,
          organization_id: organization.id,
          project_id: project_id,
          storage_bucket_key: pdfStorageKey,
          created_by: user.id,
          thumbnail_url: thumbnailUrl.publicUrl,
        })
        .select()
        .single();

      if (createDocError) {
        throw new Error(createDocError.message);
      }

      // Assuming createRoom is a function that handles room creation
      const { data: room, error: roomError } = await createRoom({
        id: generatedDocumentId,
        metadata: {
          name: pageFileName,
          type: "whiteboard",
          owner: user.id,
          draft: "no",
        },
        usersAccesses: {},
        groupsAccesses: {},
      });

      if (roomError) {
        throw new Error(roomError.message);
      }

      // Create a document_version record for each page
      const { data: newDocumentVersion, error: createDocVersionError } =
        await supabase
          .from("document_versions")
          .insert({
            id: generatedDocumentVersionId,
            storage_key: pdfStorageKey,
            name: pageFileName,
            original_name: fileName,
            document_id: generatedDocumentId,
            room_id: generatedDocumentId,
            created_by: user.id,
          })
          .single();
      if (createDocVersionError) {
        throw new Error(createDocVersionError.message);
      }
    };

    const numberOfPages = originalPdfDoc.getPageCount();
    const documentPromises = [];
    for (let i = 0; i < numberOfPages; i++) {
      documentPromises.push(processDocument(i));
    }

    const results = await Promise.all(documentPromises);

    res
      .status(200)
      .json({ message: "All pages added as documents", status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Helper functions for fetching and uploading PDFs
async function fetchPdfFromStorage(storageBucketKey, supabase) {
  const { data, error } = await supabase.storage
    .from("documents")
    .download(storageBucketKey);

  if (error) {
    throw new Error(`Error fetching PDF from storage: ${error.message}`);
  }

  return await data.arrayBuffer();
}

async function uploadPdfToStorage(pdfBytes, storageBucketKey, supabase) {
  // Create a Blob from the pdfBytes
  let dataBlob;

  // Check if running in a Node.js environment
  if (typeof Buffer !== "undefined" && pdfBytes instanceof Buffer) {
    // Convert Buffer to Blob-like object (for Node.js environment)
    dataBlob = pdfBytes;
  } else {
    // Assuming pdfBytes is an array-like object or ArrayBuffer (for Browser environment)
    dataBlob = new Blob([pdfBytes], { type: "application/pdf" });
  }

  const { error } = await supabase.storage
    .from("documents")
    .upload(storageBucketKey, dataBlob, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading PDF to storage: ${error.message}`);
  }

  return storageBucketKey;
}

// Helper function for uploading images to Supabase storage
async function uploadImageToStorage(imageBuffer, storageBucketKey, supabase) {
  // Create a Blob from the imageBuffer
  let dataBlob = new Blob([imageBuffer], { type: "image/png" });

  const { error } = await supabase.storage
    .from("organizations")
    .upload(storageBucketKey, dataBlob, {
      contentType: "image/png",
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading image to storage: ${error.message}`);
  }

  return storageBucketKey;
}

export default async function documents(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and POST is available from this API",
        },
      });
  }
}
