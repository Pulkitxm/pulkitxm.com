import DOMPurify from "dompurify";
import parse from "html-react-parser";

export const formatMessage = (message: string): string => {
  return message
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n");
};

export const isSameDomain = (url: string): boolean => {
  try {
    if (url.startsWith("/")) return true;

    const urlObj = new URL(url);
    const currentHostname = window.location.hostname;
    return urlObj.hostname === currentHostname;
  } catch (e) {
    if (e) return false;
  }
  return false;
};

export const getRandomLoadingText = (): string => {
  const loadingPhrases = [
    "Brewing chaos...",
    "Loading brilliance...",
    "Cooking up ideas...",
    "Stirring up a storm...",
    "Mixing magic..."
  ];
  return loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
};

export const addRandomEmoji = (text: string): string => {
  const crazyEmojis = ["🤪", "💥", "🔥", "🤯", "💀", "😈", "👹", "👽", "🤡", "🙃"];
  const emoji = crazyEmojis[Math.floor(Math.random() * crazyEmojis.length)];
  return text + " " + emoji;
};

export const renderMessage = (content: string, isSameDomainFn: (url: string) => boolean) => {
  const isLinksList =
    content.includes("Portfolio Home") || content.includes("Experience") || content.includes("Events");

  if (isLinksList) {
    return renderLinksList(content, isSameDomainFn);
  }

  let html = content
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const targetAttr = isSameDomainFn(url) ? "" : " target='_blank' rel='noopener noreferrer'";
      return `<a href='${url}'${targetAttr} class='text-green-300 underline hover:text-green-200'>${text}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong class='font-bold text-green-200'>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em class='italic text-green-200'>$1</em>")
    .replace(/^# (.+)$/gm, "<h1 class='mb-2 text-lg font-bold text-green-200'>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2 class='mb-2 text-base font-bold text-green-200'>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3 class='mb-1 text-sm font-bold text-green-200'>$1</h3>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 mb-1'>$1</li>")
    .replace(/^• (.+)$/gm, "<li class='ml-4 mb-1'>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li class='ml-4 mb-1'>$2</li>")
    .replace(/(<li[^>]*>.*<\/li>)\n(<li[^>]*>)/g, "$1$2")
    .replace(/\n/g, "<br>");

  const listItemRegex = /<li[^>]*>.*<\/li>/g;
  const listItems = html.match(listItemRegex);

  if (listItems) {
    html = html.replace(listItemRegex, "<ul class='mb-2 list-disc pl-4 space-y-1'>$&</ul>");
    html = html.replace(/<\/ul><ul[^>]*>/g, "");
  }

  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"]
  });

  return parse(cleanHtml);
};

export const renderLinksList = (content: string, isSameDomainFn: (url: string) => boolean) => {
  const lines = content.split("\n").filter((line) => line.trim());

  const categories: { name: string; items: { text: string; url: string | null }[] }[] = [];
  let currentCategory: string | null = null;
  let currentItems: { text: string; url: string | null }[] = [];

  lines.forEach((line) => {
    line = line.trim();

    if (!line) return;

    if (line.endsWith(":")) {
      if (currentCategory) {
        categories.push({
          name: currentCategory,
          items: [...currentItems]
        });
      }

      currentCategory = line.slice(0, -1);
      currentItems = [];
    } else if (line.startsWith("•") || line.startsWith("-")) {
      const itemContent = line.slice(1).trim();
      const linkMatch = itemContent.match(/\[([^\]]+)\]\(([^)]+)\)/);

      if (linkMatch) {
        currentItems.push({
          text: linkMatch[1],
          url: linkMatch[2]
        });
      } else {
        currentItems.push({
          text: itemContent,
          url: null
        });
      }
    } else {
      currentItems.push({
        text: line,
        url: null
      });
    }
  });

  if (currentCategory) {
    categories.push({
      name: currentCategory,
      items: [...currentItems]
    });
  }

  return (
    <div className="links-list">
      {categories.map((category, i) => (
        <div key={i} className="mb-2">
          <div className="mb-1 font-bold text-green-200">{category.name}</div>
          <ul className="space-y-0.5 pl-4">
            {category.items.map((item, j) => (
              <li key={j} className="list-disc">
                {item.url ? (
                  <a
                    href={item.url}
                    target={isSameDomainFn(item.url) ? "_self" : "_blank"}
                    rel={isSameDomainFn(item.url) ? "" : "noopener noreferrer"}
                    className="text-green-300 underline hover:text-green-200"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
