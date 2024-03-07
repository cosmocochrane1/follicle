// Helper function to compare access levels
export const compareAccessLevels = (access1, access2) => {
  const priority = { admin: 3, write: 2, read: 1 };

  // Default to no access if both are undefined
  if (!access1 && !access2) return undefined;

  // If one of the accesses is undefined, return the other
  if (!access1 || !access2) return access1 || access2;

  // Compare and return the higher priority access
  return priority[access1] > priority[access2] ? access1 : access2;
};

export const hasOrganizationAccess = (organization, userId) => {
  let accessLevel =
    organization.profiles.find((profile) => profile.id === userId)?.scope
      ?.scope_access ||
    organization.profiles
      .find((profile) => profile.id === userId)
      ?.scope?.find((scope) => scope.organization_id === organization.id)
      ?.scope_access;
  return accessLevel;
};

export const hasProjectAccess = (project, userId) => {
  let orgAccess = project.organization
    ? hasOrganizationAccess(project.organization, userId)
    : undefined;
  let projectAccess =
    project.profiles.find((profile) => profile.id === userId)?.scope
      ?.scope_access ||
    project.profiles
      .find((profile) => profile.id === userId)
      ?.scope?.find((scope) => scope.project_id === project.id)?.scope_access;

  return compareAccessLevels(orgAccess, projectAccess);
};

export const hasDocumentAccess = (document, userId) => {
  let orgAccess = document.organization
    ? hasOrganizationAccess(document.organization, userId)
    : undefined;
  let projectAccess = document.project
    ? hasProjectAccess(document.project, userId)
    : undefined;
  let documentAccess = document.profiles.find(
    (profile) => profile.id === userId
  )?.scope?.scope_access;

  // Compare organization and project access first, then with document access
  return compareAccessLevels(
    compareAccessLevels(orgAccess, projectAccess),
    documentAccess
  );
};
