/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import OpenAI from "openai";

import profile from "@/data/profile";
import { getVectorStore } from "@/lib/loader";
import { getSitemapUrls } from "@/lib/utils";
import { Profile } from "@/types/profile";

function formatProfileContext(profile: Profile): string {
  if (!profile) return "";

  const sections = [];

  const contactInfo = [`Name: ${profile.name || "Pulkit"}`, `Email: ${profile.email || ""}`];
  if (profile.links) {
    Object.entries(profile.links).forEach(([platform, url]) => {
      contactInfo.push(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`);
    });
  }
  if (profile.calendlyUrl) contactInfo.push(`Calendly: ${profile.calendlyUrl}`);
  if (profile.resumeLink) contactInfo.push(`Resume: ${profile.resumeLink}`);
  sections.push("CONTACT INFORMATION:\n" + contactInfo.join("\n"));

  if (profile.experience?.length) {
    const expInfo = profile.experience.map((exp) => {
      const duration = exp.endDate
        ? `${new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} - ${new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`
        : `Since ${new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`;
      return `${exp.position} at ${exp.companyName} (${duration})${exp.desc ? `: ${exp.desc}` : ""}`;
    });
    sections.push("EXPERIENCE:\n" + expInfo.join("\n"));
  }

  if (profile.skills) {
    const skillsInfo = Object.entries(profile.skills).map(([category, skillsList]) => {
      return `${category}: ${skillsList.join(", ")}`;
    });
    sections.push("SKILLS:\n" + skillsInfo.join("\n"));
  }

  if (profile.projects?.length) {
    const projectsInfo = profile.projects.map((project) => {
      return `${project.name}: ${project.tagline || ""} (${project.url || ""})`;
    });
    sections.push("PROJECTS:\n" + projectsInfo.join("\n"));
  }

  return sections.join("\n\n");
}

type ChatResponse = {
  answer: string;
  error?: string;
};

export async function getChatResponse(
  question: string,
  botName: string = "Pukbot",
  currentPath: string = "/"
): Promise<ChatResponse> {
  try {
    if (!question) {
      return { answer: "", error: "Question is required" };
    }

    const store = await getVectorStore();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const sitemapUrls = await getSitemapUrls();
    const pagesInfo = `The portfolio has ${sitemapUrls.length} pages: ${sitemapUrls.join(", ")}`;

    const embedQ = await openai.embeddings.create({
      model: process.env.EMBED_MODEL!,
      input: [question]
    });
    const qEmbedding = embedQ.data[0].embedding;

    const contexts = store.nearest(qEmbedding, 5).join("\n---\n");

    const profileContext = formatProfileContext(profile);

    const systemPrompt = `
You are ${botName}, an AI assistant for Pulkit's portfolio website. 
The user is currently on the page: ${currentPath}

${pagesInfo}

IMPORTANT: Format your responses using Markdown:
- Use [text](URL) for links
- Use **bold** for emphasis
- Use bullet points with dashes (-)
- Include emojis where appropriate

When providing contact information, always format it like this:
- Email: ${profile.email} 📧
- GitHub: [Pulkit's GitHub](${profile.links?.github})
- LinkedIn: [Pulkit's LinkedIn](${profile.links?.linkedin})

Only provide information that is factually accurate about Pulkit based on the context provided.
DO NOT make up information or tools that Pulkit hasn't actually used.
If you're not sure about something, say you don't know rather than guessing.

PULKIT'S PROFILE INFORMATION:
${profileContext}

Use the following additional context to answer the user's question:
${contexts}
    `.trim();

    const chatResp = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL!,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.4
    });

    const answer = chatResp.choices[0].message?.content ?? "";
    return { answer };
  } catch (error: any) {
    console.error("Chat response error:", error);

    if (error.isAxiosError) {
      console.error("Axios error:", error.message, error.response?.status, error.response?.data);
      return {
        answer:
          "Sorry, I'm having trouble accessing Pulkit's profile data right now. Please try again in a moment! 🧠💫",
        error: `Axios error: ${error.message}`
      };
    } else if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API error:", error);
      return {
        answer: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment! 🧠💫",
        error: error.message
      };
    } else {
      console.error("Unexpected error:", error);
      return {
        answer: "Oops! Something unexpected happened. Please try asking again or maybe rephrase your question? 🤔",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export async function getSuggestionsForChat(
  messages: { role: string; content: string }[] = [],
  currentPath: string = "/"
): Promise<string[]> {
  try {
    if (messages.length === 0) {
      return await getAIDefaultSuggestions(currentPath);
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";

    let profileContext = "";
    if (profile) {
      profileContext = `
Some key facts about Pulkit:
- Works as a ${profile.experience?.[0]?.position || "Software Engineer"} at ${profile.experience?.[0]?.companyName || "Noveum.ai"}
- Has skills in ${profile.skills?.["Languages"]?.slice(0, 3).join(", ") || "JavaScript, TypeScript, Python"}
- Created projects like ${
        profile.projects
          ?.slice(0, 2)
          .map((p) => p.name)
          .join(", ") || "Deployit, Image Tweaker"
      }
`;
    }

    const systemPrompt = `
You are generating suggestion buttons for a chat interface on Pulkit's portfolio website.
The user is currently on the page: ${currentPath}
${profileContext}

I need EXACTLY 4 very short follow-up questions (max 3 words each) that are:
1. Concise (2-3 words only)
2. Relevant to Pulkit's profile and the conversation
3. Different from each other in topic
4. One should be specifically relevant to the current page (${currentPath})

Format your response as a JSON array with exactly 4 strings.
Example: ["Education?", "Hobbies?", "Tech stack?", "Project details?"]

Last user message: "${lastUserMessage}"
Last assistant response: "${lastMessage.role === "assistant" ? lastMessage.content : ""}"
`.trim();

    const response = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL!,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate 4 short suggestion buttons" }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message?.content || "{}";

    try {
      const parsed = JSON.parse(content);

      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        return parsed.suggestions.slice(0, 4);
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 4);
      }

      for (const key in parsed) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
          return parsed[key].slice(0, 4);
        }
      }
    } catch (e) {
      console.error("Failed to parse suggestions JSON:", e);

      const arrayMatch = content.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
      if (arrayMatch) {
        try {
          const extractedArray = JSON.parse(arrayMatch[0]);
          if (Array.isArray(extractedArray) && extractedArray.length > 0) {
            return extractedArray.slice(0, 4);
          }
        } catch (e) {
          console.error("Failed to parse array from content:", e);
        }
      }
    }

    return await getAIDefaultSuggestions(currentPath);
  } catch (error) {
    console.error("Suggestions error:", error);
    return await getAIDefaultSuggestions(currentPath);
  }
}

async function getAIDefaultSuggestions(path: string): Promise<string[]> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let profileContext = "";
    if (profile) {
      profileContext = `
Some key facts about Pulkit:
- Works as a ${profile.experience?.[0]?.position || "Software Engineer"} at ${profile.experience?.[0]?.companyName || "Noveum.ai"}
- Has skills in ${profile.skills?.["Languages"]?.slice(0, 3).join(", ") || "JavaScript, TypeScript, Python"}
- Created projects like ${
        profile.projects
          ?.slice(0, 2)
          .map((p) => p.name)
          .join(", ") || "Deployit, Image Tweaker"
      }
`;
    }

    const systemPrompt = `
You are generating default suggestion buttons for a chat interface on Pulkit's portfolio website.
The user is currently on the page: ${path}
${profileContext}

I need EXACTLY 4 very short questions (max 3 words each) that are:
1. Concise (2-3 words only)
2. Relevant to Pulkit's profile
3. Different from each other in topic
4. One should be specifically relevant to the current page (${path})

Format your response as a JSON array with exactly 4 strings.
Example: ["Education?", "Hobbies?", "Tech stack?", "Project details?"]
`.trim();

    const response = await openai.chat.completions.create({
      model: process.env.CHAT_MODEL!,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate 4 default suggestion buttons" }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message?.content || "{}";

    try {
      const parsed = JSON.parse(content);

      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        return parsed.suggestions.slice(0, 4);
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 4);
      }

      for (const key in parsed) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
          return parsed[key].slice(0, 4);
        }
      }
    } catch (e) {
      console.error("Failed to parse default suggestions JSON:", e);
    }

    return ["Skills?", "Experience?", `${profile.projects?.[0]?.name || "Projects"}?`, "Contact info?"];
  } catch (error) {
    console.error("Default suggestions error:", error);
    return ["Skills?", "Experience?", "Projects?", "Contact info?"];
  }
}
