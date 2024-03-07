import * as React from "react";
import { Container, Heading, Section, Text, Img, Preview } from "jsx-email";
import { Wrapper, Button } from "./components";
import { baseUrl } from "./utils";
// Note: Superstruct is a fantastic validation package. It's smaller and faster than alternatives
// and uses a delightful API without chaining. docs.superstructjs.org
//
// To install `superstruct` run `pnpm add superstruct`.
// import { defaulted, object, string } from "superstruct";

export const TemplateName = "OrganizationInvitationEmail";

// export const TemplateStruct = object({
//   email: defaulted(string(), "batman@example.com"),
//   name: defaulted(string(), "Bruce Wayne"),
// });

export const Template = ({ organization = {}, invitationLink = "" }) => (
  <Wrapper title="Organization Invitation">
    <Preview>You're invited to join {organization?.name} on Ijin.</Preview>
    <Section className="container mb-20">
      <Img
        src={baseUrl("/email/images/white-text-logo.png")}
        className="w-[70px] inline-block object-contain"
      />
    </Section>

    <Section className="container text-foreground">
      {organization.thumbnail_url ? (
        <Img
          src={organization.thumbnail_url}
          className="w-[80px] h-[80px] object-cover rounded-lg"
        />
      ) : (
        <div className="w-[80px] bg-blue-300 text-foreground text-center align-middle py-7 rounded-lg">
          {organization.name?.[0] || "XY"}
        </div>
      )}
      <Heading as="h1" className="text-4xl break-all text-foreground">
        Join {organization?.name} on Ijin
      </Heading>

      <Text className="my-0 break-all whiteforeground">
        You're invited to join {organization?.name} on Ijin.
      </Text>

      <Text className="text-foreground">
        You can accept by hitting the button below to start collaborating.
      </Text>
      <Button variant="default" size="lg" href={invitationLink}>
        <span>Join now</span>
        <Img
          className="inline w-4 h-4 object-contain ml-2 mt-0.5"
          src={baseUrl("/email/images/arrow-right-white.png")}
        />
      </Button>
    </Section>

    <Container className="container mt-32">
      <Img
        src={baseUrl("/email/images/ijin-white-text-logo.png")}
        className="w-[70px] inline-block mx-auto"
      />
    </Container>
  </Wrapper>
);

export { Template as OrganizationInvitationEmail };
