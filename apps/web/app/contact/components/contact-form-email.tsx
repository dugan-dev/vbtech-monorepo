import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

import { ContactFormData } from "./contact-form-schema";

type props = {
  formData: ContactFormData;
};

export function ContactFormEmail({ formData }: props) {
  // Format service interest for display
  const formattedServiceInterest =
    formData.serviceInterest.charAt(0).toUpperCase() +
    formData.serviceInterest.slice(1);

  const fullName = `${formData.firstName} ${formData.lastName}`;
  const { email, organization, phone, message } = formData;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Section style={section}>
            <Heading as="h2" style={sectionHeading}>
              Contact Information
            </Heading>

            <Text style={infoRow}>
              <strong>Name:</strong> {fullName}
            </Text>
            <Text style={infoRow}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={infoRow}>
              <strong>Organization:</strong> {organization}
            </Text>
            <Text style={infoRow}>
              <strong>Phone:</strong> {phone}
            </Text>
            <Text style={infoRow}>
              <strong>Service Interest:</strong> {formattedServiceInterest}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={sectionHeading}>
              Message
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={footerText}>
              This is an automated notification from your website contact form.
            </Text>
            <Text style={footerText}>Value Based Technologies</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email styles
const main = {
  backgroundColor: "#f8f9fa",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  maxWidth: "600px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "normal",
  marginTop: "0",
  color: "#202124",
};

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "normal",
  marginTop: "0",
  marginBottom: "16px",
  color: "#202124",
};

const section = {
  marginBottom: "24px",
};

const infoRow = {
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
  color: "#202124",
};

const messageText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#202124",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "20px 0",
};

const footerText = {
  fontSize: "14px",
  color: "#5f6368",
  margin: "8px 0",
};
