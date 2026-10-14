<script lang="ts">
  import AskAnswerThread from "./AskAnswerThread.svelte";
  import AskComposer from "./AskComposer.svelte";
  import { generatedAskAnswers, type AskAnswerView } from "../../lib/ask-thread";

  let {
    placeName,
    placeKind = "business",
    tip = "",
    sampleQuestion = "",
    sampleAnswers = [],
    askHref = "/ask",
  }: {
    placeName: string;
    placeKind?: "business" | "stay" | "town";
    tip?: string;
    sampleQuestion?: string;
    sampleAnswers?: AskAnswerView[];
    askHref?: string;
  } = $props();

  const noun = $derived(placeKind === "stay" ? "stay" : placeKind === "town" ? "town" : "place");
  const question = $derived(sampleQuestion || `What should first-timers know before visiting ${placeName}?`);
  const shownSample = $derived(sampleAnswers.length > 0 ? sampleAnswers : generatedAskAnswers(question, tip, placeName));
</script>

<section class="panel">
  <div class="head">
    <h2>Ask the Locals</h2>
    <a href={askHref}>Open Ask</a>
  </div>
  <p class="lede">
    Ask about this {noun}. You get an instant AI answer, an AI follow-up a few minutes later, a local-guide note, then any community replies.
  </p>
  <AskComposer
    placeName={placeName}
    tip={tip}
    placeholder={`Ask anything about ${placeName}…`}
    bare
  />
  <article class="sample">
    <p class="sample__label">Recent thread</p>
    <p class="sample__q">{question}</p>
    <AskAnswerThread answers={shownSample} />
  </article>
</section>

<style>
  .panel {
    display: grid;
    gap: var(--size-4);
    background: white;
    border: 1px solid var(--brand-line);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-card);
    padding: var(--size-5);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    align-items: baseline;
  }
  h2 {
    margin: 0;
    font-size: var(--font-size-3);
  }
  .head a {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: var(--brand-teal);
  }
  .lede {
    margin: 0;
    font-size: var(--font-size-1);
    color: var(--brand-ink-soft);
  }
  .sample {
    display: grid;
    gap: var(--size-3);
    padding-top: var(--size-4);
    border-top: 1px solid var(--brand-line);
  }
  .sample__label {
    margin: 0;
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-8);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-ink-soft);
  }
  .sample__q {
    margin: 0;
    font-weight: var(--font-weight-7);
  }
</style>
