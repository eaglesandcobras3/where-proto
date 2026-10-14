const ID = /^[A-Za-z0-9_-]{11}$/;

export function youtubeId(url: string) {
  const raw = url.trim();
  if (ID.test(raw)) return raw;
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && ID.test(id) ? id : undefined;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const queryId = parsed.searchParams.get("v");
      if (queryId && ID.test(queryId)) return queryId;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") &&
        parts[1] &&
        ID.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function youtubeEmbedSrc(url: string) {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : undefined;
}
