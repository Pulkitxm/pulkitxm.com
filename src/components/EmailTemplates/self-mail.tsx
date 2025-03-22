import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Img } from "@react-email/components";
import * as React from "react";

import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

interface EmailTemplateProps {
  from_name: string;
  message: string;
  sender_email: string;
}

export function SelfMailTemplate({ from_name, message, sender_email }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {from_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={NEXT_PUBLIC_API_URL + "/icon.png"} width="64" height="64" alt="Logo" style={logo} />
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Section style={section}>
            <Text style={label}>From</Text>
            <Text style={value}>{from_name}</Text>

            <Text style={label}>Email</Text>
            <Link
              href={`mailto:${sender_email}`}
              style={{
                ...value,
                color: "#0084ff",
                textDecoration: "underline"
              }}
            >
              {sender_email}
            </Link>

            <Text style={label}>Message</Text>
            <Text style={value}>{message}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Link href={`mailto:${sender_email}`} style={button}>
              Reply to {from_name}
            </Link>
          </Section>

          <Text style={footer}>
            This message was sent from the contact form on{" "}
            <Link href={NEXT_PUBLIC_API_URL} style={link}>
              {NEXT_PUBLIC_API_URL.replace("https://", "")}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "20px 0"
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "32px",
  width: "100%",
  maxWidth: "560px"
};

const logo = {
  display: "block",
  margin: "0 auto 24px",
  width: "64px",
  height: "64px"
};

const heading = {
  color: "#111111",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
  textAlign: "center" as const
};

const section = {
  margin: "0"
};

const label = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "500",
  lineHeight: "1.5",
  margin: 0,
  marginTop: "12px",
  textTransform: "uppercase" as const
};

const value = {
  color: "#111111",
  fontSize: "16px",
  fontWeight: "400",
  lineHeight: "1.5",
  margin: "0"
};

const buttonContainer = {
  margin: "24px 0",
  textAlign: "center" as const
};

const button = {
  backgroundColor: "#0084ff",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "1",
  padding: "12px 20px",
  textDecoration: "none",
  textAlign: "center" as const,
  WebkitTextSize: "14px"
};

const footer = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "24px 0 0",
  textAlign: "center" as const
};

const link = {
  color: "#0084ff",
  textDecoration: "underline"
};
