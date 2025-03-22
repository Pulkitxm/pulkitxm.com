import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Img } from "@react-email/components";
import * as React from "react";

import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

interface UserMailTemplateProps {
  from_name: string;
  user_message: string;
}

export function UserMailTemplate({ from_name, user_message }: UserMailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your message, {from_name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={NEXT_PUBLIC_API_URL + "/icon.png"} width="64" height="64" alt="Logo" style={logo} />
          <Heading style={h1}>Thank you for reaching out, {from_name}!</Heading>
          <Text style={text}>
            I&apos;ve received your message and I appreciate you taking the time to contact me. Here&apos;s what you
            wrote:
          </Text>
          <Section style={quoteSection}>
            <Text style={quote}>{user_message}</Text>
          </Section>
          <Text style={text}>
            I&apos;ll review your message and get back to you as soon as possible, usually within 24-48 hours.
          </Text>
          <Text style={text}>
            In the meantime, feel free to check out my latest projects and blog posts on my portfolio.
          </Text>
          <Section style={ctaSection}>
            <Link href={NEXT_PUBLIC_API_URL} style={button}>
              Visit My Portfolio
            </Link>
            <Link href={"https://blogs.pulkitxm.com"} style={button}>
              Visit My Blog
            </Link>
          </Section>
          <Text style={footer}>
            Best regards,
            <br />
            Pulkit
            <br />
            <Link href={NEXT_PUBLIC_API_URL} style={link}>
              pulkitxm.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default UserMailTemplate;

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
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
  margin: "0 auto",
  marginBottom: "20px",
  height: "60px"
};

const h1 = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0"
};

const quoteSection = {
  backgroundColor: "#e8f4fd",
  borderLeft: "4px solid #3498db",
  padding: "12px 20px",
  margin: "20px 0"
};

const quote = {
  color: "#3498db",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "0"
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "30px 0"
};

const button = {
  backgroundColor: "#3498db",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 20px",
  margin: "0 10px"
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "30px",
  textAlign: "center" as const
};

const link = {
  color: "#3498db",
  textDecoration: "underline"
};
