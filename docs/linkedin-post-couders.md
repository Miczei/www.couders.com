# LinkedIn: "What Couders is" post + Claude Design prompt

Marketing material for the international LinkedIn audience. Every fact, number
and turn of phrase is lifted from the site's own English copy
(`src/i18n/couders.ts`, `about.ts`, `showcase.ts`, `dictionaries.ts`) — nothing
here is invented.

---

## 1. LinkedIn post — variant A (recommended)

> Structure: problem → why we exist → what we do → numbers → CTA.
> ~1,800 characters, well inside the 3,000 limit. No markdown — LinkedIn
> doesn't render it.

```text
9:42 PM, Saturday. A client asks for a quote.
9:15 AM, Monday. Your sales rep replies.

35 hours in between. By then the client had already bought from a competitor who answered faster.

This isn't a problem with your sales team. It's a problem with companies selling during business hours while clients buy outside them.

That's why we built Couders.

Couders is a team of engineers from Kraków. We build AI assistants and autonomous agents that take over customer service and the first stage of B2B sales.

Not a chatbot with buttons. An agent that:

→ knows your catalog, pricing and technical documentation by heart
→ answers with real substance in under a second — at 3 AM the same as Tuesday noon
→ filters out window-shoppers and offers serious buyers a slot in the calendar
→ generates a personalized PDF proposal 15 minutes after the meeting, in your branding
→ hands your rep a ready-to-close lead with the full conversation history

We train it on your data, not the open internet. AI agnostic across OpenAI, Anthropic, Google Gemini and Meta Llama — we pick the model for the job, not the other way around.

The numbers we show clients:

0.8s — average response time
+40% — more B2B meetings booked
24/7 — coverage on weekends, holidays and overnight

We work with manufacturing and machinery, construction material wholesalers, real estate developers and B2B services — anywhere a single unanswered inquiry is a lost contract.

If you want to see this running on your own company's data, we do a 15-minute demo. Comment "demo" below or send us a DM.

#AI #B2B #Sales #Automation #AIAgents #EnterpriseAI
```

**Put the link in the first comment** (`couders.com`), not in the post body —
LinkedIn suppresses reach on posts with an outbound link in the body.

---

## 2. LinkedIn post — variant B (short, pairs with the graphic)

> For when the graphic carries the message. ~650 characters.

```text
Your client won't wait until Monday.

Couders builds AI assistants that answer inquiries in seconds — at any hour, from your catalog, your pricing and your documentation.

An inquiry lands at 9:42 PM on a Saturday. The agent analyzes the spec from your internal database. It sends the answer, generates a PDF proposal and books a slot in the calendar. Before anyone on your team opens their inbox on Monday, the meeting is already set.

Not a chatbot with buttons. An autonomous agent trained on your data.

0.8s response time. +40% more B2B meetings. 24/7 coverage.

DM us for a demo on your own company's data.

#AI #B2B #SalesAutomation #AIAgents
```

---

## 3. LinkedIn post — variant C (founder story, best organic reach)

> Personal tone, straight from the About page. Works from a personal profile,
> not the company page.

```text
Couders started at a table in Kraków, long past midnight, in the middle of a card game.

A hand of cards turned into a whiteboard argument about why enterprise AI keeps breaking the moment it leaves the demo. By sunrise the core architecture had a name and a shape.

We were the students everyone assumed would disappear into the big research labs. We chose the harder problem instead: autonomous agents that enterprises can actually trust — wrapped in hardcoded business rules, human approval checkpoints and real full-stack engineering behind every single decision.

Today that means an assistant that knows a client's catalog and pricing by heart, answers in 0.8 seconds at three in the morning, qualifies the lead itself, and generates a PDF proposal 15 minutes after the meeting.

Same small team. Same obsession. Except now it's in production, for clients across Europe and beyond.

If your company is losing inquiries after hours — let's talk.

#AI #Startup #Krakow #B2B #AIAgents
```

---

## 4. Claude Design prompt (copy the whole block)

> Paste as the first message in Claude Design. It carries the full visual
> system taken from couders.com: palette, typography, radii, the
> single-continuous-line motif and the white-minimalism rule.

```text
Design a set of LinkedIn graphics for a company called Couders. One canvas, three artboards at 1200 × 1200 px (square, LinkedIn feed). I'll pick one and refine it by hand.

WHO COUDERS IS
Couders is an engineering studio from Kraków, Poland. It builds AI assistants and autonomous agents for B2B companies — agents that take over customer service and the first stage of sales. The agent is trained on the company's private data (catalog, pricing, technical documentation), answers in seconds 24/7, qualifies leads and generates PDF proposals. AI agnostic across OpenAI, Anthropic, Google Gemini and Meta Llama. Brand tone: precise, engineering-led, calm, zero hype. The audience is a CEO or sales director at a manufacturer, a construction materials wholesaler, a real estate developer or a B2B consultancy — not a startup founder. All copy on the graphics must be in English.

VISUAL SYSTEM (taken directly from couders.com — follow it literally)
- Background: pure white #FFFFFF. No dark theme, no full-bleed gradient background.
- Primary text (ink): #0B0B0C. Headlines #0F172A (slate-900).
- Secondary text: #64748B. Muted: #A2A5AC.
- One accent only: sky-500 #0EA5E9. Use it sparingly — one number, one line, one badge. Glow: radial blur rgba(14,165,233,0.12–0.20) behind the focal point.
- Rules: 1 px hairlines in rgba(0,0,0,0.10) or #E2E8F0. Never heavy borders.
- Typography: headlines in Space Grotesk Bold, tracking −0.03em, leading 1.02–1.1. Body in Inter Regular/Medium. Eyebrow labels in monospace, UPPERCASE, 11 px, tracking 0.22em, color #94A3B8.
- The "Couders" wordmark: handwritten, in Schoolbell (Google Fonts), weight 400, color #0B0B0C. Never set it in caps and never bold it — the contrast between the handwritten wordmark and the geometric Space Grotesk is the core of this brand.
- Cards: white or translucent (rgba(255,255,255,0.65)) with a light blur, 32 px radius (40 px on large cards), shadow 0 8px 30px rgba(0,0,0,0.05). Buttons are pills (full radius).
- Signature motif: a single continuous thin line (2–3 px stroke, #0B0B0C) running through the composition — on the site this line morphs from an abstract face into the wordmark. Use it as a structural graphic element, not as decoration.
- Very generous whitespace. The composition should read editorial and unhurried, closer to a report cover than an ad.

ARTBOARD 1 — "Saturday, 9:42 PM" (the main one, tells the problem)
Portrait composition, two columns split by a hairline.
Eyebrow labels at the top: TRADITIONAL MODEL / AI AGENT (monospace, uppercase).
Left column, muted gray: "9:42 PM, Sat — client asks for a quote" → "9:15 AM, Mon — sales rep replies" → column footer: "35 hours. The client bought from a competitor."
Right column, sky #0EA5E9 accent: "9:42:00 PM — client asks for a quote" → "9:42:01 PM — AI analyzes the spec from the company database" → "9:42:02 PM — reply sent, PDF proposal generated, meeting booked" → column footer: "2 seconds. Demo booked for Tuesday, 10:00 AM."
Timestamps in monospace, descriptions in Inter. Timeline dots joined by a thin vertical line — on the right side that line glows sky.
Bottom, centered: the handwritten Couders wordmark plus a micro caption "couders.com".

ARTBOARD 2 — "What Couders is" (the explainer)
Top: monospace eyebrow "AI ASSISTANTS FOR B2B COMPANIES".
Headline in Space Grotesk, max 3 lines: "Not a chatbot with buttons. An agent that knows your catalog, pricing and documentation."
Below it, a row of three hairline cards at 32 px radius, each with a small line icon (1.5 px stroke, no fills):
1) Sales Assistant 24/7 — "Knows your catalog and pricing. Collects leads while you sleep."
2) Instant Lead Qualifier — "Reaches ad leads within a minute. Filters out window-shoppers."
3) B2B Proposal Generator — "A branded PDF proposal in the client's inbox 15 minutes after the meeting."
Footer: handwritten Couders wordmark on the left, a muted line "Kraków · couders.com" on the right.

ARTBOARD 3 — "The numbers" (proof, the simplest one)
One huge figure centered, Space Grotesk, ~200 px, in sky #0EA5E9: "0.8s", caption underneath: "average response time".
Below, in a single row separated by a hairline, two smaller metrics in dark ink: "+40% more B2B meetings" and "24/7 full coverage".
A soft radial sky glow behind the big figure (blur ~100 px, opacity 0.15).
Handwritten Couders wordmark at the bottom.

WHAT NOT TO DO
- No stock photography, robots, brains, humanoids, neural-network meshes or chip-style "AI" icons.
- No purple-to-pink "AI" gradient, no dark cosmic background, no neon beyond the single sky accent.
- No 3D effects, drop shadows, outlined frames, emoji or clipart.
- At most two text sizes per artboard beyond the headline — do not crowd it.
- Never set the Couders wordmark in caps and never bold it.
- English copy throughout, no placeholder or lorem text.

TECHNICAL REQUIREMENTS
- Everything legible as a phone thumbnail: smallest text no less than 24 px at 1200 × 1200 scale.
- 80 px safe margin on every edge.
- High contrast: no informational text lighter than #64748B on white.
- Export to PNG.
```

### Format variant

For a landscape version (link preview / carousel), append to the prompt:

```text
Also: duplicate the chosen artboard at 1200 × 627 px, recomposed horizontally —
headline on the left, graphic element on the right, same visual system.
```

---

## 5. Publishing notes

- **`0.8s` and `+40%`** are already published claims on couders.com (the
  `metrics` section of `src/i18n/couders.ts`). Have the backing data ready —
  it's the first thing anyone will ask in the comments.
- **Best posting window** for international B2B: Tuesday–Thursday, 8:00–10:00
  in the *audience's* time zone. For a US audience that means posting in the
  early afternoon CET; for Western Europe, post at 8:00 CET.
- **First comment**: the `couders.com` link plus one CTA sentence.
- **Kraków angle**: for an international audience it reads as European
  engineering credibility, so keep it — it's a differentiator, not local
  detail.
- **Image alt text** (accessibility + reach):
  "Couders graphic: a traditional inquiry handled in 35 hours compared with an
  AI agent that replies in 2 seconds, generates a PDF proposal and books the
  meeting."
