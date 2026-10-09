export type CardRatio = "2/3" | "4/3";

export function cardImageSrc(label: string, ratio: CardRatio = "2/3") {
  const [width, height] = ratio === "2/3" ? [112, 168] : [400, 300];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><rect width="100%" height="100%" fill="#d7ebe6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#2a6b63" font-size="${Math.round(width / 3)}" font-family="Georgia, serif">${escapeXml(label)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const listingSizes = "(min-width: 768px) 9rem, 7rem";
export const listingWideSizes = "(min-width: 768px) 11rem, 7rem";
export const featuredSizes = "(min-width: 768px) 25vw, 150px";
export const staySizes = "(max-width: 768px) 100vw, 33vw";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
