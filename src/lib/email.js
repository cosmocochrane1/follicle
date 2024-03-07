// TODO : change into Ijin email

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  from = "",
  to = "",
  subject = "",
  html = "",
}) => {
  if (!from) {
    from = "Archade <info@archade.dev>";
  }

  if (!to) {
    throw new Error("Missing recepient email address");
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw error;
  }

  return data;
};
