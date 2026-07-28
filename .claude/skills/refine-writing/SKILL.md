---
name: refine-writing
description: Rephrase and refine Saidev's articles in content/writings/ — short sentences, one thought per paragraph, concrete detail, plain words. Use when drafting, editing, tightening or porting any post, or when asked to make a write-up clearer, more precise or more human.
---

# Refining Saidev's writing

Saidev writes essays for `content/writings/`. The target voice is the one used
in personal builder essays online — most clearly Farza Majeed's buildspace
letter (buildspace.so/letter) and his site (farza.com). This skill describes **how that prose is built**, measured
from those sources, so it can be applied to Saidev's own material.

You are refining **his** arguments and **his** experiences. Never add a claim,
statistic, opinion or memory that was not already in his draft or that he has
not told you. Cutting, reordering and sharpening are yours. Inventing is not.

## The measured shape of the target voice

Taken from the buildspace letter (137 sentences) and farza.com:

| Property                  | Target            | Typical bad draft |
| ------------------------- | ----------------- | ----------------- |
| Median words per sentence | **10**            | 22–30             |
| Sentences under 6 words   | **~23%**          | near zero         |
| Sentences over 25 words   | **under 10%**     | 40%+              |
| Paragraphs                | **one sentence**  | 4–6 sentences     |
| Voice                     | first person, direct address | passive, institutional |

The single most defining trait: **almost every paragraph is one sentence.**
Each thought gets its own line and its own silence around it. That vertical
rhythm is what makes the writing feel spoken rather than composed.

## How to apply it

**Break paragraphs down to one idea each.** If a paragraph contains two
thoughts, it is two paragraphs. This alone transforms most drafts.

**Cut every sentence to its load-bearing words.** Delete "I think", "it is
important to note", "basically", "in order to", "the fact that". If a sentence
survives losing a clause, it did not need the clause.

**Vary length deliberately.** Run three or four medium sentences, then drop a
three-word one. The short sentence is where the reader feels something. Use it
on the line that matters, never on filler.

**Use fragments as punctuation.** A fragment lands a point that a full sentence
would soften. Deploy sparingly — one per section, at the emotional beat.

**Prefer the concrete.** Numbers, dates, names, amounts, specific objects. "A
lot of kids" is nothing; "12.97 million" is a fact you can feel. If the draft
gestures at something vague, find the specific version or cut it.

**Address the reader as "you".** Not "one might consider" — "you already know
this". It turns an essay into a conversation.

**Keep the words plain.** Short Anglo-Saxon words over Latinate ones: *use* not
*utilise*, *show* not *demonstrate*, *start* not *commence*. Where jargon is
load-bearing, keep it and explain it once.

**Earn the emotion; do not announce it.** Write the detail that produces the
feeling instead of naming the feeling. Not "it was heartbreaking" — the fact
that made it so, stated flatly. Flat delivery of a hard fact hits harder than
adjectives.

**Let it end where it ends.** No "in conclusion", no summary of what was just
said. The last line should be the sharpest one, then stop.

## Before and after

Written for this skill, to show the transformation:

> **Before:** It is important to understand that the education system which we
> currently find ourselves operating within was not, in fact, designed with the
> intention of fostering individual creativity, but was rather constructed in
> order to produce a workforce that could be relied upon to be compliant.

> **After:** The system was not built to make you creative.
>
> It was built to make you employable.
>
> Those are different things, and nobody tells you which one you signed up for.

Three sentences, three paragraphs, one idea each. Every abstract noun replaced
with something you can picture. Fifty-two words became twenty-nine.

## House rules for this site

- **Capitalisation stays normal.** The reference voice is largely lowercase; the
  rest of this site is sentence case, and mixing the two reads as a mistake
  rather than a style. Keep the rhythm, keep the capitals.
- Frontmatter `description` is one sentence, and it appears in listings, the
  RSS feed and the social card. Make it a hook, not a summary.
- Headings are sentence case and short. They are signposts, not summaries.
- Link on the specific noun, not on "click here" or "read more".
- `.prose` styles plain markdown — no custom components are wired into MDX, so
  write standard markdown and let the stylesheet handle it.
- Long inline code and tables are already handled by the stylesheet; do not
  hand-format them.

## Checks before finishing

1. Read it aloud. Anywhere you run out of breath is a sentence to split.
2. Count paragraphs with more than one sentence. Justify each or split it.
3. Search the draft for: *very, really, actually, basically, in order to, the
   fact that, it is important to*. Delete on sight.
4. Confirm every fact traces to the source draft or to something Saidev said.
5. Check the opening line works with no context, and the closing line is the
   one you would want quoted.
