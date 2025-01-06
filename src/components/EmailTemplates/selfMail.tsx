import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Img } from "@react-email/components";
import * as React from "react";

import { BASE_URL } from "@/lib/constants";

interface SelfMailTemplateProps {
  from_name: string;
  message: string;
  sender_email: string;
}

export function SelfMailTemplate({ from_name, message, sender_email }: SelfMailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {from_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={BASE_URL + "/icon.png"} width="80" height="80" alt="Pulkit's Logo" style={logo} />
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{from_name}</Text>
            <Text style={label}>Email:</Text>
            <Link href={`mailto:${sender_email}`} style={link}>
              {sender_email}
            </Link>
          </Section>
          <Section style={messageSection}>
            <Text style={label}>Message:</Text>
            <Text style={messageStyles}>{message}</Text>
          </Section>
          <Section style={ctaSection}>
            <Link href={`mailto:${sender_email}`} style={button}>
              Reply to {from_name}
            </Link>
          </Section>
          <Text style={footer}>
            This message was sent from the contact form on{" "}
            <Link href={BASE_URL} style={link}>
              devpulkit.in
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SelfMailTemplate;

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};

const logo = {
  display: "block",
  margin: "0 auto 30px",
  width: "80px",
  height: "auto"
};

const h1 = {
  fontColor: "#ffffff",
  background: "linear-gradient(135deg, #3498db, #2980b9)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "-0.5px",
  margin: "0 0 30px",
  padding: "0",
  textAlign: "center" as const
};

const infoSection = {
  margin: "0 0 30px",
  padding: "20px",
  backgroundColor: "#f8fafc",
  borderRadius: "6px"
};

const messageSection = {
  backgroundColor: "#e8f4fd",
  borderLeft: "4px solid #3498db",
  borderRadius: "6px",
  padding: "20px",
  margin: "0 0 30px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
};

const label = {
  color: "#3498db",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "8px"
};

const value = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "15px"
};

const messageStyles = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.6"
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "0 0 30px"
};

const button = {
  backgroundColor: "#3498db",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
  display: "inline-block",
  boxShadow: "0 4px 6px rgba(52, 152, 219, 0.25)",
  transition: "all 0.3s ease"
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  marginTop: "30px",
  textAlign: "center" as const
};

const link = {
  color: "#3498db",
  textDecoration: "none",
  fontWeight: "500",
  borderBottom: "1px solid #3498db"
};
