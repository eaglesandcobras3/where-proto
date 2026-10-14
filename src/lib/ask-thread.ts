import { commentsFor, userBySlug } from "../data/catalog";
import type { Answer, Question } from "../data/types";
import { href } from "./href";
import { formatDate, userHandle } from "./labels";

export type AskAnswerKind = Answer["kind"];

export interface AskAnswerView {
  kind: AskAnswerKind;
  badge: string;
  when: string;
  author: string;
  authorHref?: string;
  initial: string;
  body: string;
}

const KIND_META: Record<
  AskAnswerKind,
  { badge: string; when: string; author: string; initial: string }
> = {
  ai_instant: { badge: "AI", when: "Instant", author: "WhereTo30A AI", initial: "AI" },
  ai_followup: { badge: "AI follow-up", when: "A few minutes later", author: "WhereTo30A AI", initial: "AI" },
  local_guide: { badge: "Local guide", when: "From the desk", author: "Local Guide", initial: "LG" },
  community: { badge: "Community", when: "", author: "A visitor", initial: "C" },
};

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.?!]+[.?!]/);
  return (match?.[0] ?? trimmed).trim();
}

function topicLabel(question: string) {
  const trimmed = question.replace(/[?!.]+$/, "").trim();
  return trimmed.length > 72 ? `${trimmed.slice(0, 69).trim()}…` : trimmed;
}

export function generatedAskAnswers(question: string, tip?: string, placeName?: string): AskAnswerView[] {
  const topic = topicLabel(question);
  const place = placeName ? ` at ${placeName}` : "";
  const lead = tip
    ? firstSentence(tip)
    : placeName
      ? `Start with posted hours, parking, and host guidance${place} — not a guest-only path.`
      : "Start with a public access or a posted town rule, not a guest-only path.";
  return [
    {
      kind: "ai_instant",
      ...KIND_META.ai_instant,
      body: `Quick take on “${topic}”: ${lead} This is an instant AI answer — a follow-up and locals may add more.`,
    },
    {
      kind: "ai_followup",
      ...KIND_META.ai_followup,
      body: tip
        ? `Checked a bit more${place}: the local-guide note below is the one to trust if it disagrees with this. Recheck posted signs, seasonal hours, and cart rules the day you go.`
        : `Checked a bit more on “${topic}”${place}. Corridor rules shift by town and season — confirm posted signs, parking, and LSV guidance the day you go.`,
    },
    {
      kind: "local_guide",
      ...KIND_META.local_guide,
      body: tip ?? `A local guide can confirm the latest detail on “${topic}”${place} before you lock the day.`,
    },
  ];
}

function viewFromAnswer(item: Answer): AskAnswerView {
  if (item.kind === "community") {
    const user = item.authorUserSlug ? userBySlug(item.authorUserSlug) : undefined;
    return {
      kind: "community",
      badge: KIND_META.community.badge,
      when: formatDate(item.createdAt),
      author: user ? userHandle(user.slug) : "A visitor",
      authorHref: user ? href(`/u/${user.slug}`) : undefined,
      initial: (user?.name ?? "C").charAt(0).toUpperCase(),
      body: item.body,
    };
  }
  const meta = KIND_META[item.kind];
  return { kind: item.kind, ...meta, body: item.body };
}

function viewFromComment(
  item: { body: string; authorUserSlug: string },
  when?: string,
): AskAnswerView {
  const user = userBySlug(item.authorUserSlug);
  return {
    kind: "community",
    badge: KIND_META.community.badge,
    when: when ?? "",
    author: user ? userHandle(user.slug) : "A visitor",
    authorHref: user ? href(`/u/${user.slug}`) : undefined,
    initial: (user?.name ?? "C").charAt(0).toUpperCase(),
    body: item.body,
  };
}

export function threadFromAnswers(
  seeded: Answer[],
  question: string,
  tip?: string,
  community: AskAnswerView[] = [],
): AskAnswerView[] {
  const byKind = new Map(seeded.map((item) => [item.kind, item]));
  const generated = generatedAskAnswers(question, tip);
  const core = generated.map((item) => {
    const seed = byKind.get(item.kind);
    return seed ? viewFromAnswer(seed) : item;
  });
  const extraCommunity = seeded
    .filter((item) => item.kind === "community")
    .map(viewFromAnswer);
  return [...core, ...extraCommunity, ...community];
}

export function threadForQuestion(question: Question, seeded: Answer[] = []): AskAnswerView[] {
  const community = commentsFor("question", question.slug).map((item) =>
    viewFromComment(item, formatDate(question.createdAt)),
  );
  return threadFromAnswers(seeded, question.title, question.body, community);
}
