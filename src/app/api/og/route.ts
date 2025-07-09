import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const PROBLEMATIC_DOMAINS = ["x.com", "twitter.com"];

const FALLBACK_DATA = {
  "x.com": {
    title: "X (formerly Twitter)",
    description: "Social media platform",
    image: "",
    siteName: "X",
    favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
    type: "website"
  },
  "twitter.com": {
    title: "Twitter",
    description: "Social media platform",
    image: "",
    siteName: "Twitter",
    favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
    type: "website"
  }
};

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function getFallbackData(url: string) {
  const domain = getDomainFromUrl(url);

  if (FALLBACK_DATA[domain as keyof typeof FALLBACK_DATA]) {
    return {
      ...FALLBACK_DATA[domain as keyof typeof FALLBACK_DATA],
      url
    };
  }

  for (const [fallbackDomain, data] of Object.entries(FALLBACK_DATA)) {
    if (domain.includes(fallbackDomain)) {
      return {
        ...data,
        url
      };
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    let validatedUrl: URL;
    try {
      validatedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cached.data });
    }

    const domain = validatedUrl.hostname.toLowerCase();

    const isProblematicDomain = PROBLEMATIC_DOMAINS.some((problematicDomain) => domain.includes(problematicDomain));

    if (isProblematicDomain) {
      const fallbackData = getFallbackData(url);
      if (fallbackData) {
        cache.set(url, { data: fallbackData, timestamp: Date.now() });
        return NextResponse.json({ success: true, data: fallbackData });
      }
    }

    const options = {
      url,
      timeout: 15000,
      followRedirect: true,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0"
      }
    };

    const { error, result } = await ogs(options);

    if (error) {
      console.error("OGS Error for", url, ":", error);

      const fallbackData = getFallbackData(url);
      if (fallbackData) {
        cache.set(url, { data: fallbackData, timestamp: Date.now() });
        return NextResponse.json({ success: true, data: fallbackData });
      }

      const genericFallback = {
        title: validatedUrl.hostname,
        description: `Visit ${validatedUrl.hostname}`,
        image: "",
        url,
        siteName: validatedUrl.hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${validatedUrl.hostname}`,
        type: "website"
      };

      cache.set(url, { data: genericFallback, timestamp: Date.now() });
      return NextResponse.json({ success: true, data: genericFallback });
    }

    const ogData = {
      title: result.ogTitle || result.twitterTitle || result.dcTitle || validatedUrl.hostname,
      description:
        result.ogDescription || result.twitterDescription || result.dcDescription || `Visit ${validatedUrl.hostname}`,
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "",
      url: result.ogUrl || result.requestUrl || url,
      siteName: result.ogSiteName || validatedUrl.hostname,
      favicon: result.favicon || `https://www.google.com/s2/favicons?domain=${validatedUrl.hostname}`,
      type: result.ogType || "website"
    };

    cache.set(url, { data: ogData, timestamp: Date.now() });

    return NextResponse.json({ success: true, data: ogData });
  } catch (error) {
    console.error("API Error:", error);

    const url = new URL(request.url).searchParams.get("url");
    if (url) {
      try {
        const validatedUrl = new URL(url);
        const fallbackData = getFallbackData(url) || {
          title: validatedUrl.hostname,
          description: `Visit ${validatedUrl.hostname}`,
          image: "",
          url,
          siteName: validatedUrl.hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${validatedUrl.hostname}`,
          type: "website"
        };

        return NextResponse.json({ success: true, data: fallbackData });
      } catch (err) {
        console.error("Error in fallback:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
