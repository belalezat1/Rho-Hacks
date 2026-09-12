# Product Requirements Document: RhoPilot

**Product name:** RhoPilot  
**Tagline:** RhoPilot — live liquidity intelligence you can brief in minutes  
**Document type:** PRD (hackathon → product foundation)  
**Status:** Draft for weekend build  
**Last updated:** 2026-09-12 (Grand Prize repositioning: liquidity intelligence + Competitive Spend Context hero + decision-support posture + Rho depth + integration kill-tests)  
**Event context:** Rho Lock In Hackathon (NYC) — sponsors: Rho, ElevenLabs, Tavily, Stan  

---

## 1. Executive summary

RhoPilot is **live liquidity intelligence** for startups and the accountants who support them — a **money-brief layer on Rho**, not a competing finance platform.

**Founder hook:** Ask your Rho account how the week looks, whether your spend is in range for businesses like yours, and leave with a brief you can forward.

The product:

1. Reads live company money data from the **Rho API** (accounts, balances, transactions, statements) with depth — merchant normalization, multi-account cash position, vendor concentration, period/statement context, claim→Rho ID evidence — *what happened on the books and what you currently pay*.
2. Runs a load-bearing **Spend Context Engine** on **Tavily** — *public market context for your stack*: what similar businesses typically pay for tools and roles like yours, alternatives and list pricing vs your Rho amounts, plus a thin External Risk section on the weekly brief. Payee context dossiers are supporting, not the star.
3. Converses through **ElevenLabs Agents** (voice + chat with tool calling, workflows, guardrails) and narrates briefs via ElevenCreative / TTS — agency, not decorative voiceover.
4. Ships finished work products on **Stan** (Weekly Money Brief with Spend Context + External Risk, Client Close Packs) as PDF + audio.

**Core split:** Rho = ledger truth. Tavily = public market / outside context. ElevenLabs = how you talk. Stan = how you ship the brief.

**One-sentence pitch for judges:**  
*Live liquidity intelligence on Rho—compare your spend to public market ranges with citations, brief it by voice, and publish the pack to Stan. Decision support, not advice.*

---

## 1.1 Plain-language overview

**RhoPilot helps you brief your company’s money fast.**

Instead of logging into a banking dashboard, scrolling transactions, and Googling “is this normal?”, you **talk** to it:

> “How much cash do we have?”  
> “Anything weird this week?”  
> “How does what we pay for Intercom and our designer compare to public market ranges?”  
> “Draft the Monday update I can send.”  
> “Walk anomalies since the 1st for the client pack.”

It answers using your **real Rho bank data**, researches **public market context** when spend comparisons need outside facts (Tavily), speaks back naturally (ElevenLabs), and can turn the answer into a **shareable brief** on Stan.

### How a normal use looks

1. You ask by voice (or chat).  
2. RhoPilot looks at your Rho accounts and transactions (with IDs you can verify).  
3. If the question needs market context (spend comps, external risk, payee public footprint), it researches via Tavily and **cites sources**.  
4. It **compares and explains** in plain language — it does not prescribe hire/cut/renew decisions.  
5. Optionally it packages that into a short report + audio summary and publishes it on Stan.

You’re not “using four APIs.” You’re having a money conversation that finishes as a deliverable.

### What each piece is doing (human terms)

| Piece | Job | Analogy |
|---|---|---|
| **Rho** | Source of truth for balances, spend, and *what you currently pay* | The books |
| **Tavily** | Spend Context Engine — public market ranges, alternatives, light external risk | The research pass on “is this in range?” |
| **ElevenLabs** | Conversational agent (listen, tool-call, speak) — not decorative TTS | The teammate who pulls the numbers and briefs you |
| **Stan** | Delivery layer for finished briefs/packs as digital products | The link you forward instead of a screenshot |

**Shorter still:** RhoPilot doesn’t just read your transactions—it puts them next to public market context so you can brief faster.

### What it is *not*

- Not a new bank or a “finance OS” that replaces Rho  
- Not a robot that pays bills for you  
- Not tax, legal, employment, or investment advice  
- Not KYC, sanctions, or compliance clearance  
- Not a CFO that tells you what to hire, cut, or renew  
- Not “AI that replaces your accountant” — it’s a **faster briefing layer** on top of Rho  

---

## 2. Problem statement

### 2.1 Pain

Founders, ops leads, and fractional CFOs drown in finance busywork:

- Cash, burn, and runway live in dashboards they open too late.
- “Weird spend” is discovered after the fact.
- Recurring SaaS and contractor spend continues on autopilot because comparing public market rates is tedious.
- Founders ask “is what we pay normal for businesses like ours?” and get tab chaos, not a cited table.
- Unknown vendors and new payees trigger manual Google threads — useful as context, not as a “compliance check.”
- Accountants retype the same client narratives every close — without spend context or a sendable pack.
- Creators with Stan storefronts still lack a simple money standup tied to real banking data.

### 2.2 Why existing tools fall short

| Approach | Gap |
|---|---|
| Banking dashboards (incl. Rho UI) | Powerful, but passive — you must dig |
| Spreadsheets | Slow, stale, not conversational |
| Generic chatbots | Hallucinate vendors/markets; no ledger truth |
| Pure TTS overlays | Voice without agency; not a workflow |
| Link-in-bio stores alone | Monetize content, not finance operations |

### 2.3 Opportunity

Rho’s API is **read-only by design** (accounts, transactions, statements). That is a product strength for AI: agents can analyze without payment authority.

The winning product insight: **a talking dashboard is not enough.** Founders need **liquidity intelligence they can brief** — what’s on the books, whether key spend looks in range vs public market context, and a pack they can forward. Tavily is therefore not optional lookup; it is RhoPilot’s **Spend Context Engine**. Pairing deep Rho truth + cited spend context + ElevenLabs agency + Stan delivery creates a daily briefing tool judges and Rho itself can imagine shipping as a layer—not a rival platform.

---

## 3. Goals and non-goals

### 3.1 Goals

| Goal | Success signal |
|---|---|
| Everyday usefulness | Founder can complete a Monday money brief in &lt;2 minutes by voice |
| Rho technical depth | Merchant normalization, multi-account cash, concentration, period context, claim→Rho IDs visible in UI |
| Sponsor-native depth | Rho, ElevenLabs, Tavily, and Stan each pass their **kill-test** (no decorative logos) |
| Spend-context quality | Market/spend claims show Rho amount vs cited public ranges |
| Decision support posture | Answers compare + cite + draft next step in Rho — they do not prescribe |
| Shipable output | User leaves with a Stan digital product link (Weekly Money Brief / Close Pack) |
| Safety posture | Agent never claims it can move money; reinforces read-only Rho access |
| Hackathon win posture | Contends for Grand Prize; side prizes (Rho / ElevenLabs / Tavily / content) follow from the same loop |

### 3.2 Non-goals (explicit)

- Initiating payments, wires, ACH, card issuance, or account modifications via API.
- Replacing Rho’s full banking dashboard or Rho Close.
- Providing formal tax, legal, employment, or investment advice.
- Prescriptive hire / fire / renew / cut directives as the product promise.
- KYC, sanctions screening, or compliance / regulatory clearance.
- Fiduciary or “AI CFO that decides for you” positioning.
- Multi-entity enterprise consolidation in v1.
- Full accounting system of record (QuickBooks/Xero replacement).
- Building a general consumer banking app.
- Fully polishing five equal Tavily playbooks in one weekend.

---

## 4. Target users and personas

### 4.1 Primary — Startup founder / ops lead

- Needs runway, burn, and spend clarity without living in spreadsheets.
- Asks: “What’s our cash?” “Any weird spend?” “Is what we pay for X in range?” “Draft the Monday update.”

### 4.2 Primary — Fractional CFO / accountant (Rho partner audience)

- Needs faster exception review and client-ready narratives.
- Asks: “Walk anomalies since the 1st.” “Draft the client cash brief.” “Explain this wire with sources.”

### 4.3 Secondary — Creator-operator (Stan audience)

- Runs a Stan store + banks with Rho.
- Needs “what did I keep after tools/ads?” and a reusable money standup.

### 4.4 Internal champion (hackathon narrative)

- Rho CS / product / partner teams who want founders to feel finance as frictionless — aligned with Rho’s mission — and who can imagine RhoPilot as a **briefing layer** Rho could productize.

---

## 5. Product principles

1. **Voice is the interface; numbers are the authority.** ElevenLabs is UX; Rho is ledger truth.
2. **Rho = what happened / what you pay. Tavily = public market context.** Spend intelligence is a product pillar, not a fallback Google tab.
3. **Math can be Rho-only. Market/spend claims require Tavily citations.**
4. **Compare and cite — do not prescribe.** Draft briefs and comparison tables; never “you should hire/cut”; never claim compliance clearance.
5. **No material claim without evidence.** Rho data and/or Tavily citations for every load-bearing statement.
6. **Read-only is a feature.** Safe AI for finance; escalation happens in Rho, not in the agent.
7. **Finish the job.** Analysis without a deliverable is incomplete — publish to Stan.
8. **One hero loop for Grand Prize.** Speak → deep Rho → Competitive Spend Context → brief → Stan.
9. **Personas, not sprawl.** Founder mode and Accountant mode share one core; don’t build ten products.
10. **Every sponsor must be load-bearing.** If removing a sponsor doesn’t break a promise, cut the fake integration.

### 5.1 Sponsor kill-tests

| Sponsor | Kill-test (product promise that breaks if removed) |
|---|---|
| **Rho** | Cannot truthfully answer what you have, what moved, or what you currently pay — no live ledger IDs |
| **ElevenLabs** | No interruptible voice/chat agent with tool calling and guardrails; brief has no spoken standup (decorative TTS only fails the test) |
| **Tavily** | Cannot show cited public market ranges / alternatives for your Rho spend stack; market claims become hallucinations |
| **Stan** | Session ends as a chat transcript — no forwardable digital product (PDF + audio pack) |

**Anti-patterns (banned):** ElevenLabs = only pre-rendered MP3; Tavily = one README search; Rho = dump txs into an LLM with no structure/IDs; Stan = footer link to a generic storefront.

---

## 6. Solution overview

### 6.1 Product definition

RhoPilot is a web application with:

- A polished **Cash Pulse** cockpit (deep Rho: balances, burn/runway, normalized merchants, concentration, period context).
- An **Anomaly Radar** (heuristics + optional payee public-context enrichment).
- An embedded **ElevenLabs Agent** (voice + text) with tools.
- A **Spend Context Engine** powered by Tavily (Competitive Spend Context hero; External Risk on briefs; trust/world-watch supporting).
- A **Compare / Decision Studio** for runway math + spend comparison tables (not a prescription engine).
- A **Stan publisher** for Weekly Money Briefs and Client Close Packs (PDF + audio).

### 6.2 High-level architecture

```
User (voice/chat)
    → ElevenLabs Agent (workflows, guardrails, tool calling)
        → Tool: Rho API (accounts, balances, transactions, statements)
            → normalize merchants, cash position, concentration, period view
        → Tool: Spend Context Engine (Tavily search / extract / research)
            → Competitive Spend Context (hero): Rho pay vs public market ranges
            → Weekly External Risk (supporting on brief)
            → Payee public-context dossier (supporting)
            → World-watch thin feed into Risk / brief
        → Tool: Brief generator (metrics + narrative + audio via ElevenLabs TTS)
        → Tool: Stan publish (Weekly Money Brief / Client Close Pack)
    → UI cockpit mirrors agent state (Rho IDs, citations, publish link)
```

### 6.3 Sponsor capability mapping

| Sponsor | Role in RhoPilot | Concrete surfaces |
|---|---|---|
| **Rho** | Source of truth for company money (*what you pay / what moved*) | Accounts, balances, transactions, statements; normalization; concentration; period/close context (read-only REST) |
| **ElevenLabs** | Conversational agency + brief narration | ElevenAgents (voice/chat, tools, workflows, guardrails); TTS / Creative for brief audio; optional Scribe STT |
| **Tavily** | **Spend Context Engine** (*public market context for your stack*) | Search, Extract, Research; `topic: finance` / news; cited comps table + light External Risk |
| **Stan** | Delivery for finished briefs/packs | Host/deliver Weekly Money Brief (Spend Context + Risk), Client Close Packs |

### 6.4 Competitive Spend Context (required product answer)

**Founder question this product must answer:**  
*“I’m talking about my finances. Can it show what I’m currently paying for tools and people on Rho, and how that compares to what similar businesses typically pay publicly?”*

**Answer: Yes — as a Rho × Tavily split, spoken by the agent, rendered as a comparison table.**

| Half of the question | Who answers | How |
|---|---|---|
| “How much am I paying *now*?” | **Rho** | Recurring SaaS, contractor ACH, Gusto/Deel/Upwork payouts, labeled merchant/payee on the ledger |
| “What’s in range / what do alternatives list?” | **Tavily** | Public-web Search → Extract → Research (list pricing, packaging, contractor/salary bands) with citations |
| “So what goes in the brief / runway math?” | **ElevenLabs Agent** | Compares Rho current pay vs cited ranges; models burn/runway impact as **math**; offers Stan Money Brief — **does not prescribe hire/cut** |

**Table shape (UI + Stan):** `Merchant or role | What you pay (Rho) | Cited public range | Sources | Notes`

**Limits (must be clear in UI + agent guardrails):**

- Tavily is **not** a private peer-company ledger or salary database. Ranges are public-web estimates.
- “Similar businesses” means public pricing / market bands for similar tools and roles — not private competitor bank data.
- Outputs are **decision support with sources**, not offers, quotes, or employment advice.
- If Rho only shows a lump sum (e.g. “Deel — $9,000”) without a job title, the agent asks one clarifying question before running role comps.

This loop is the **P0 Tavily hero** and the primary Grand Prize demo path.

---

## 7. Functional requirements

### 7.1 Cash Pulse (Rho) — deepen for Best Rho / adoption

| ID | Requirement | Priority |
|---|---|---|
| CP-1 | Display account list with balances (checking, savings, treasury if present) as one **multi-account cash position** | P0 |
| CP-2 | Compute 30/60/90-day burn and approximate runway from transactions + cash | P0 |
| CP-3 | Show recent cash movements in plain English (card, ACH, wire, transfer, etc.) | P0 |
| CP-4 | Pull statement metadata / period context for close narratives (“since the 1st”) | P0 |
| CP-5 | Rank top vendors / largest outflows for concentration risk (% of burn) | P0 |
| CP-6 | Support sandbox/demo mode with sample Rho-shaped data when no token | P0 |
| CP-7 | **Merchant normalization:** map messy descriptors → clean payee entities; show raw → normalized in evidence panel | P0 |
| CP-8 | Every material Cash Pulse claim links to **Rho account or transaction IDs** in UI | P0 |

**Voice examples**

- “What’s our runway if revenue is flat?”
- “Summarize cash this week vs last week.”

---

### 7.2 Anomaly Radar (Rho + supporting Tavily)

| ID | Requirement | Priority |
|---|---|---|
| AR-1 | Detect spend spikes vs vendor baseline (heuristic) | P0 |
| AR-2 | Flag first-time / unknown merchants | P0 |
| AR-3 | Surface failed, pending, and awaiting_approval transactions | P0 |
| AR-4 | Flag near-duplicate charges (similar amount + merchant + time window) | P1 |
| AR-5 | Optionally enrich unknown / large payees via **payee public-context dossier (P1 playbook)** — framed as context, not compliance | P1 |
| AR-6 | Present anomaly queue sortable by severity / amount / date; severity tiers (“radar, not verdict”) | P0 |

**Voice examples**

- “Anything weird since Monday?”
- “Who is ‘PQRS CLOUD’ on the books — show me the Rho txs and any public footprint.”

---

### 7.3 Voice money-brief agent (ElevenLabs)

| ID | Requirement | Priority |
|---|---|---|
| VA-1 | Embedded conversational agent supporting voice and chat | P0 |
| VA-2 | Agent tools: `get_balances`, `get_transactions`, `get_anomalies`, `get_concentration` | P0 |
| VA-3 | Agent tools (Spend Context): `tavily_spend_context` (hero); `tavily_risk_brief` (supporting); `tavily_payee_context`, `tavily_world_watch` (P1) | P0 / P1 |
| VA-4 | Agent tools: `run_compare_scenario`, `generate_brief`, `publish_to_stan` | P0 |
| VA-5 | Workflow branching: cash → spend context → draft brief → publish | P0 |
| VA-6 | Guardrails: refuse payment initiation; disclaim tax/legal/employment/investment advice; refuse compliance-clearance claims; require citations for market/spend claims; never prescribe hire/cut/renew | P0 |
| VA-7 | Generate spoken brief narration (TTS / Creative) for Stan packs | P0 |
| VA-8 | Optional: ingest voice notes via Speech-to-Text (Scribe) into session context | P2 |
| VA-9 | Show live tool traces in UI (Rho payloads + Tavily citations) for trust | P0 |
| VA-10 | Routing rule: spend-context / external-risk / payee-context market claims **must** call Tavily before stating ranges or public footprint | P0 |

**Conversation contract**

1. User asks in natural language.  
2. Agent fetches Rho numbers (*what you pay / what moved*) with IDs.  
3. For spend/market questions, Spend Context Engine runs with citations.  
4. Agent answers with Rho evidence + cited public context + plain-language summary + optional runway **math** — not prescriptions.  
5. Agent offers: “Publish this as a Stan Weekly Money Brief / Client Close Pack?”

---

### 7.4 Spend Context Engine (Tavily) — sharpened pillar

**Framing:**  
*Rho tells you what already happened and what you pay. Tavily tells you how that spend compares to public market context—and what external signals belong on this week’s brief.*

Without Tavily, RhoPilot is a talking dashboard. With Tavily as Spend Context, it becomes **liquidity intelligence you can brief**.

**Product rule:**  
- Pure math (“What’s our balance?” / “What’s burn?”) → Rho only.  
- Market/spend claims (“Is this in range?” / “What do alternatives list?” / “External signals on our top vendors”) → **Rho + Tavily required.**

| # | Playbook | Priority | Role |
|---|---|---|---|
| A | **Competitive Spend Context** (vendor + role/contractor comps) | **P0 hero** | Unified table: Rho pay vs cited public ranges |
| 1 | Weekly External Risk Brief | **P0 supporting** | Thin, cited section on every Weekly Money Brief |
| 2 | Payee public-context dossier | **P1** | Supporting enrichment on anomalies — not compliance |
| 5 | Proactive world-watch | **P1** | Thin feed into Risk / brief |

Former “renew/cut engine” and “hire/substitute comps” are **merged into Competitive Spend Context** (one polished surface). Do not ship five equal full playbooks.

#### 7.4.1 Shared Tavily platform requirements

| ID | Requirement | Priority |
|---|---|---|
| TV-0a | Use Tavily `search`, `extract`, and `research` as appropriate | P0 |
| TV-0b | Prefer `topic: finance` or `news` when query type matches | P0 |
| TV-0c | Display citations (title, URL, snippet) in UI and exported briefs | P0 |
| TV-0d | Redact PII from queries; never send full account numbers, SSNs, or raw pay stubs | P0 |
| TV-0e | Label all market comps as informational decision support, not offers or employment advice | P0 |
| TV-0f | Cache playbook results per merchant/role for the session to control latency/credits | P1 |

---

#### 7.4.2 Playbook A — Competitive Spend Context (P0 hero)

From Rho top recurrings + contractor/payroll-shaped payees, research public market context for **tools and roles like these**.

| ID | Requirement | Priority |
|---|---|---|
| TV-Aa | From Rho, identify top recurring merchants (SaaS/tools) and current monthly/annual amount paid | P0 |
| TV-Ab | From Rho, identify contractor / payroll-provider payouts when available; clarify role if label is fuzzy | P0 |
| TV-Ac | Tavily Research/Search/Extract: public list pricing, packaging, and alternatives for those tools | P0 |
| TV-Ad | Tavily Research/Search: public compensation / contractor rate bands for clarified roles (geo/seniority when available) | P0 |
| TV-Ae | Output comparison table: Rho amount vs cited public range vs alternatives; include sources | P0 |
| TV-Af | Optional runway **math**: translate delta vs midpoint range into days of runway (informational) | P0 |
| TV-Ag | Include Spend Context section in Stan Weekly Money Brief; optional standalone Spend Context memo template | P0 |
| TV-Ah | Agent language: “in range / above cited range / below cited range / insufficient public data” — **not** “renew / cut / hire / fire” | P0 |

**Voice example:** “For our top SaaS and this contractor, how does what we pay compare to public market ranges?”

---

#### 7.4.3 Playbook 1 — Weekly External Risk Brief (P0 supporting)

Thin research on the world around *this company’s* top merchants — attached to the Weekly Money Brief.

| ID | Requirement | Priority |
|---|---|---|
| TV-1a | From Rho, identify top N merchants by spend (default 5–10) + category tags | P0 |
| TV-1b | Tavily Research/Search each for material outages, breaches, price-change headlines, shutdown/lawsuit signals | P0 |
| TV-1c | Optional category demand / idle-cash public context (informational only) | P1 |
| TV-1d | Produce a short **External Risk** section with citations | P0 |
| TV-1e | Include External Risk in Stan Weekly Money Brief PDF + spoken standup | P0 |

**Voice example:** “Anything outside our books I should know about for our top vendors this week?”

---

#### 7.4.4 Playbook 2 — Payee public-context dossier (P1)

Public footprint for new or large payees — **context for review in Rho**, not compliance clearance.

| ID | Requirement | Priority |
|---|---|---|
| TV-2a | Trigger on first-time merchant, amount above threshold, or user ask | P1 |
| TV-2b | Tavily Search + Extract: public site / about / contact footprint | P1 |
| TV-2c | Tavily News/Search: public news hits (lawsuits, shutdowns, breaches) — presented as headlines, not verdicts | P1 |
| TV-2d | Output dossier: Public footprint found / Limited / None + citations + **suggested next step in Rho** | P1 |
| TV-2e | UI copy must not say “compliant,” “approved,” “safe,” or “cleared” | P1 |

**Voice example:** “We have a new $8,400 wire to Northpeak Labs — what’s the public footprint?”

---

#### 7.4.5 Playbook 5 — World-watch feed (P1)

| ID | Requirement | Priority |
|---|---|---|
| TV-5a | Watchlist derived from Rho top merchants + optional industry tags | P1 |
| TV-5b | On standup / on-demand, Tavily Search/News for material changes since last brief | P1 |
| TV-5c | Only surface items that map to a Rho merchant, payee, or stated category | P1 |
| TV-5d | Feed hits into External Risk section | P1 |

---

### 7.5 Compare / Decision Studio (advice-safe)

| ID | Requirement | Priority |
|---|---|---|
| DS-1 | Hire / spend affordability scenario (cost → burn/runway impact) using Rho math | P0 |
| DS-2 | Competitive Spend Context table via Playbook A (required before stating market ranges) | P0 |
| DS-3 | Show tool alternatives’ public list pricing vs Rho current pay (informational) | P0 |
| DS-4 | Optional payee public-context gate before strong language on large/new payees (P1) | P1 |
| DS-5 | Tool/capex purchase impact on runway | P1 |
| DS-6 | Idle cash narrative vs public treasury/yield context (informational only) | P1 |
| DS-7 | Every compare view shows: Rho evidence → Tavily citations → confidence → **next step in Rho** (not a prescription) | P0 |

---

### 7.6 Stan Money Brief Publisher

| ID | Requirement | Priority |
|---|---|---|
| ST-1 | Generate Weekly Money Brief (PDF) from Cash Pulse + anomalies + **Spend Context** + **External Risk** | P0 |
| ST-2 | Attach ElevenLabs audio standup (MP3) to the brief | P0 |
| ST-3 | Publish / attach brief as a Stan digital product (API if available; else guided export + live store URL in demo) | P0 |
| ST-4 | Support **Client Close Pack** variant for accountant persona | P0 |
| ST-5 | Optional Spend Context memo template (same publish path, different template) | P1 |
| ST-6 | Return shareable Stan link in UI and agent response | P0 |

**Stan alignment**

Stan is the **delivery layer** for finance work products—Weekly Money Brief and Client Close Pack as digital products (PDF + audio)—not a decorative logo.

---

### 7.7 Auth, demo, and safety

| ID | Requirement | Priority |
|---|---|---|
| SA-1 | Rho API token configuration via env / settings (never commit secrets) | P0 |
| SA-2 | One-click Demo Mode with deterministic sample data (named contractor + ≥3 SaaS recurrings + pending items) | P0 |
| SA-3 | Clear UI badge: “Read-only · Cannot move money” | P0 |
| SA-4 | README with setup, sample data, and run instructions (hackathon submission) | P0 |
| SA-5 | Logging of tool calls for demo replay without exposing secrets | P1 |
| SA-6 | Persistent decision-support disclaimer in UI and briefs | P0 |

---

## 8. Functional desirable use cases

These are the **intended everyday workflows** RhoPilot should make faster. Priority reflects Grand Prize demo + product desirability.

### 8.1 P0 — Must delight in demo and daily use

#### UC-01 — Monday founder money brief + Spend Context
**Actor:** Founder  
**Trigger:** Start of week / daily open  
**Flow:** Voice “Give me the week” → Cash Pulse + Anomaly Radar → **Competitive Spend Context (Playbook A)** on top recurrings/contractor → thin External Risk → Stan Weekly Money Brief.  
**Outcome:** Forwardable brief with *books + public market context* in &lt;2 minutes.  
**Desirability:** Highest — ritualizable, demo-perfect, makes Tavily mandatory as spend intelligence.

#### UC-02 — Competitive Spend Context (hero)
**Actor:** Founder / ops  
**Trigger:** “Is what we pay normal?” / renew season / contractor review  
**Flow:** Rho current pay for top SaaS + role/contractor → Tavily public ranges and alternatives → comparison table + optional runway math → section in Stan brief.  
**Outcome:** “You pay $X; cited public ranges are $Y–$Z; sources attached.”  
**Desirability:** Highest — answers the founder question; showcases Rho×Tavily split without advice language.

#### UC-03 — Publish Weekly Money Brief to Stan
**Actor:** Founder or accountant  
**Trigger:** End of agent session  
**Flow:** Generate PDF + audio (Spend Context + External Risk) → publish digital product on Stan → share link.  
**Outcome:** Finished artifact, not a chat transcript.  
**Desirability:** Highest for “finish the job” and sponsor completeness.

#### UC-04 — Accountant exception walkthrough → Client Close Pack
**Actor:** Accountant  
**Trigger:** Period close / client update  
**Flow:** “Walk anomalies since the 1st” → Rho period view + severity queue → optional payee public-context (P1) → **Client Close Pack** on Stan.  
**Outcome:** Client-ready pack; Rho partner narrative for adoption.  
**Desirability:** Highest for Rho adoption / interview-track story.

---

### 8.2 P1 — Strongly desirable (build if time)

#### UC-05 — Payee public-context triage
Anomaly queue → “What’s the public footprint?” → dossier + escalate in Rho (no compliance language).

#### UC-06 — World-watch delta on your books
Watchlist from Rho top merchants → thin Tavily news feed → External Risk bullets.

#### UC-07 — Client narrative in plain English
“Explain the $14k wire to Acme” → Rho detail + optional public footprint → spoken + written narrative.

#### UC-08 — Week-over-week cash comparison
Automated WoW burn, inflows, and category deltas with voice summary.

#### UC-09 — Creator money standup (Stan × Rho)
Creator asks what remained after tools/ads; audio standup reusable as content or a Stan product.

#### UC-10 — Board / investor mini-packet
Cash trajectory + burn + Spend Context bullets + ElevenLabs walkthrough → Stan-gated pack.

---

### 8.3 P2 — Aspirational / post-hackathon

#### UC-11 — Slack-native alerts with voice escalation  
Anomaly → public-context note → ElevenLabs voice note to approver → Stan audit memo.

#### UC-12 — Multi-company accountant portfolio view  
Switch clients; standardized briefs + spend context.

#### UC-13 — Continuous vendor scorecards  
Pricing drift and news risk over time.

#### UC-14 — Policy / deadline research assist  
Informational lookups with hard “not legal advice” framing.

#### UC-15 — Multilingual agent standups  
ElevenLabs language strength for international founding teams.

---

## 9. User experience requirements

### 9.1 First viewport / brand

- Product name **RhoPilot** as a hero-level brand signal.
- Tagline on hero: **live liquidity intelligence you can brief in minutes**.
- One composition: brand, one headline, one supporting line, one CTA (Talk / Start demo), one dominant visual (cockpit or waveform — not a card grid).
- Avoid generic purple-AI SaaS clichés; finance-trust visual direction (clarity, density with calm hierarchy).

### 9.2 Core screens

1. **Home / Talk** — Agent + evidence side panel (Rho IDs + Tavily citations).  
2. **Cash Pulse** — Multi-account cash, burn, runway, concentration.  
3. **Anomalies** — Queue with severity; optional payee-context actions.  
4. **Spend Context** — Comparison table (Rho vs cited public ranges) + External Risk.  
5. **Compare** — Runway math + spend tables (decision support).  
6. **Briefs** — History of generated packs + Stan links.  
7. **Settings** — API keys (local), demo toggle, persona (Founder / Accountant).

### 9.3 Demo script requirement (&lt;3 minutes) — Grand Prize

1. Problem (10s): Dashboards show what happened—not whether spend is in range, and not a brief you can send.  
2. Voice cash standup with deep Rho numbers + IDs on screen (40s).  
3. **Competitive Spend Context table with on-screen Tavily citations (50s).**  
4. Publish Stan Weekly Money Brief (incl. Spend Context + External Risk) + play audio (30s).  
5. Close: read-only safety + decision support + “Rho truth, market context, brief out” (15s).  

Optional spare 10s: accountant Close Pack mention or one payee public-context beat — not the main act.

---

## 10. Technical requirements (hackathon MVP)

### 10.1 Suggested stack

- **Frontend:** Next.js (App Router) + TypeScript  
- **Backend/API routes:** Next.js server routes or light Node service  
- **Agent:** ElevenLabs Agents SDK / ConvAI with webhook tools  
- **Data:** Rho REST (`/accounts`, `/transactions`, `/statements`) + normalization/concentration layer  
- **Research / Spend Context:** Tavily JS SDK — `search`, `extract`, `research` (Playbook A + Risk; trust/watch thin or stubbed)  
- **Output:** PDF generation + MP3 from ElevenLabs TTS  
- **Delivery:** Stan digital product publish or demo-integrated storefront link  

### 10.2 Constraints

- Rho API tokens are read-only; design UX and agent prompts around that.  
- No secrets in repo; `.env.example` only.  
- Must run from README with sample data if keys missing.  
- Repo public or shared with `lockinhack@rho.co` per hackathon rules.

### 10.3 Non-functional

| Area | Target |
|---|---|
| Latency | Agent tool round-trips feel interactive; show streaming/status |
| Reliability | Demo Mode always works offline of live APIs |
| Security | Keys server-side; redact PII from Tavily queries |
| Accessibility | Keyboard chat fallback if mic unavailable |
| Observability | Tool trace panel for judges (Rho IDs + citations) |

---

## 11. MVP scope (weekend ship list)

### Must ship (P0)

1. Rho connect or Demo Mode → **deep Cash Pulse** (multi-account, burn/runway, normalization, concentration, period context, Rho IDs)  
2. ElevenLabs Agent with Rho tools + **`tavily_spend_context`** + brief/publish tools  
3. Anomaly list (pending / awaiting_approval / new merchants)  
4. **Competitive Spend Context** table with live citations  
5. **Thin External Risk** section on Weekly Money Brief  
6. Weekly Money Brief PDF + ElevenLabs audio including Spend Context + Risk  
7. **Client Close Pack** path (accountant persona or template)  
8. Stan publish path (real or guided demo with live store URL)  
9. Polished UI + tool traces + README + sample data (contractor pay + SaaS recurrings + pending items)  
10. Decision-support + read-only disclaimers everywhere material

### Nice if time (P1)

- Payee public-context dossier polished  
- World-watch feed  
- Standalone Spend Context memo SKU  
- Activity timeline / WoW cash comparison  

### Explicitly cut from weekend

- Real money movement  
- Full accounting sync  
- Native mobile apps  
- Multi-tenant SaaS billing for RhoPilot itself  
- Guaranteeing private salary-database or peer-ledger accuracy  
- Five fully polished equal Tavily playbooks  
- Prescriptive “hire/cut/renew” recommendation engine  

---

## 12. Success metrics

### 12.1 Hackathon judging proxies

- Judges complete the hero loop without explanation.  
- Each sponsor is verbally named with a **visible artifact** that passes its kill-test.  
- Demo video &lt;3 minutes with working product + tech stack narration.  
- Social post published (LinkedIn/X).  
- README enables third-party run.

### 12.2 Product metrics (post-hackathon)

| Metric | Definition |
|---|---|
| Time-to-brief | Median seconds from open → brief generated |
| Spend Context coverage | % of Weekly Briefs that include ≥1 cited comps row |
| Citation rate | % of market/spend answers with ≥1 Tavily source |
| Comp compare rate | % of spend-context sessions that show Rho pay vs cited range |
| Brief publish rate | % of sessions that export/publish to Stan |
| Close Pack rate | % of accountant sessions that generate Close Pack |
| Trust events | Rate of “can’t move money” clarifications without user confusion |
| Retention proxy | Weekly active briefs / user |

---

## 13. Strengths

1. **Rho-native and adoption-aligned** — Deep use of the host API; framing as a briefing layer Rho could productize (founders + accountants).  
2. **Read-only safety story** — Matches Rho’s API positioning; reduces catastrophic agent risk.  
3. **ElevenLabs is agency, not a bolt-on** — Agents with tools/workflows/guardrails + spoken brief audio.  
4. **Tavily is Spend Context (impressive and honest)** — Public market ranges for *your* stack, not a fake compliance engine.  
5. **Clean Rho×Tavily split** — Rho shows what you pay; Tavily shows cited public context.  
6. **Stan completes the job** — Turns chat into a forwardable digital product.  
7. **Everyday ritual** — Monday money brief is habitual, not a one-off gimmick.  
8. **Dual persona leverage** — Founder brief + accountant Close Pack without two codebases.  
9. **Prize stacking from one loop** — Grand Prize story naturally supports Rho / ElevenLabs / Tavily / content.  
10. **Advice-safe credibility** — Fintech judges can put Rho’s brand next to the disclaimer.

---

## 14. Weaknesses and risks

1. **Rho API surface is narrow today** — Read-only accounts/transactions/statements only; wow must come from analysis depth + briefs.  
2. **Stan integration uncertainty** — Programmatic publish may be limited; weekend may need guided publish with a live store URL.  
3. **Heuristic anomalies ≠ fraud ML** — Spike/new-vendor rules will false-positive; frame as radar, not verdict.  
4. **Voice in noisy hackathon halls** — Mic UX can fail live; chat fallback is mandatory.  
5. **Latency stacking** — Rho + LLM + Tavily + TTS can feel slow without status/cache.  
6. **Compliance sensitivity** — Any slip into “advice” or “cleared” language alarms fintech judges.  
7. **Key/credit dependency** — Live demo needs partner keys; Demo Mode mitigates.  
8. **Scope creep magnet** — Re-expanding to five full playbooks blows the weekend.  
9. **Market comps are public-web approximate** — Bands may be incomplete or stale; always cite + label.  
10. **Role inference from ledger is fuzzy** — Lump-sum payroll providers need a clarifying question.  
11. **Differentiation risk** — Other teams may build “AI + Rho”; without Spend Context + Stan deliverable, it blends in.  
12. **Data realism** — Sample data must include recurrings + contractor pay or comps demos fall flat.

### 14.1 Mitigations

| Weakness | Mitigation |
|---|---|
| Narrow Rho API | Lean into depth (normalize, concentration, period, IDs) + spend context + delivery; market read-only as safety |
| Stan API gaps | Pre-create store + product template; automate file gen; one-click “open publish” |
| False-positive anomalies | Severity tiers; no alarmist compliance language |
| Noisy room | Big **Chat** CTA; pre-typed demo prompts |
| Latency | Parallel Tavily calls; session cache; skeleton UI; narrate while fetching |
| Compliance / advice slip | Fixed disclaimers; guardrails; compare/cite language only |
| Scope creep | Hero = Spend Context + deep Rho; Risk thin; trust/watch P1 |
| Approximate comps | Always show citations + range + “verify before deciding” |
| Fuzzy role labels | One clarifying question before role comps |
| Sample data | Seed demo ledger with named contractor + ≥3 SaaS recurrings + pending |

---

## 15. Competitive / alternative framing

| Alternative | RhoPilot difference |
|---|---|
| Rho dashboard alone | Active money brief + spend context + sendable pack |
| ChatGPT + CSV export | Live Rho tools, required Tavily citations, guardrails, Stan publish |
| Ramp/Brex AI features | Built on Rho stack; accountant Close Pack + spend intelligence angle |
| Pure voice note apps | Ledger-grounded agency, not dictation |
| “AI that Googles vendors” | Competitive Spend Context mapped to *your* Rho stack |
| Stan alone | Adds banking truth + brief agent + market context for operators |

---

## 16. Go-to-market / narrative (hackathon)

### Positioning

**RhoPilot — live liquidity intelligence you can brief in minutes.**

Retell for judges: *They pull what you actually pay from Rho, research public market context with sources, then publish a Stan brief you can talk through.*

**Language bans in all marketing/UI:** finance OS; CFO that tells you what to do; compliance check; “you should hire/cut”; fiduciary advice claims.

**Preferred language:** liquidity intelligence; money brief; spend context; compare; cite; draft; send; escalate in Rho; decision support.

### Content angle (Best Content / Stan session)

- Build-in-public posts: voice standup clips, Spend Context table screenshot, Stan brief link.  
- Founder story: “I don’t want five finance apps — I want one conversation and a brief I can forward.”

### Submission checklist (event rules)

- [ ] Working project  
- [ ] Project description  
- [ ] Demo video &lt;3 min (working product + tech stack audio)  
- [ ] Social post (LinkedIn or X)  
- [ ] Repo URL (public or shared with lockinhack@rho.co)  
- [ ] README: setup, sample data, run guidance  

---

## 17. Open questions

1. Exact Stan API capabilities available during the hackathon for product create/update?  
2. Preferred ElevenLabs path: hosted Agent config vs fully code-defined tools?  
3. Will Rho provide sandbox tokens / sample business datasets to all teams?  
4. Should accountant mode be a toggle or a separate route for demo clarity?  
5. How do we map payroll-provider lump sums (Gusto/Deel) to individual roles in demo data?  
6. Prefer SaaS rows or contractor rows first in the Spend Context demo table if time is tight?

---

## 18. Milestone plan (weekend)

| When | Outcome |
|---|---|
| Saturday afternoon | Repo scaffold; Demo Mode deep Cash Pulse (normalize, concentration, contractor + SaaS sample, pending); Rho client stub |
| Saturday evening | ElevenLabs agent + Rho tools + **Competitive Spend Context** live with citations |
| Late Saturday | Thin External Risk on brief; Client Close Pack template; tool traces |
| Sunday morning | Stan publish path; UI polish; disclaimers; optional trust stub |
| Pre-noon Sunday | Demo video (must show Rho IDs + Spend Context citations), README, social post, submission |

---

## 19. Appendix A — Example agent system rules (draft)

- You are RhoPilot, a read-only money-brief assistant on Rho.  
- Never claim you can send payments, issue cards, or change account settings.  
- Prefer Rho tool data over memory for balances, transactions, and *what the company currently pays*; cite Rho IDs when presenting material numbers.  
- Treat Tavily as the Spend Context Engine: for market ranges, alternatives, external risk headlines, and payee public footprint, you **must** call the matching tool before stating those claims.  
- Pure math questions (balance, burn, runway arithmetic) may use Rho only.  
- For compensation and vendor pricing, compare Rho current pay vs Tavily cited public ranges; show sources; never present comps as guaranteed quotes or employment advice.  
- Never prescribe hire, fire, renew, or cut. Use language like “above / within / below cited public range” and “next step: review in Rho.”  
- Never claim KYC, sanctions, compliance, or that a payee is “safe,” “approved,” or “cleared.”  
- If role/title is unclear from the ledger, ask one clarifying question before running role comps.  
- Frame runway and spend outputs as decision support, not advice.  
- After material answers, offer to publish a Stan Weekly Money Brief or Client Close Pack.  
- If mic fails, continue in chat with the same tools.

---

## 20. Appendix B — Glossary

| Term | Meaning |
|---|---|
| Liquidity intelligence | Live view of cash position, burn, runway, and material spend — briefable fast |
| Money brief / flash brief | Short sendable update (PDF + audio) of where cash and spend stand |
| Cash Pulse | Live snapshot of multi-account cash, burn, runway, concentration |
| Anomaly Radar | Heuristic exception detection (radar, not verdict) |
| Spend Context Engine | Tavily-powered layer: Competitive Spend Context + light External Risk (+ P1 trust/watch) |
| Competitive Spend Context | Rho current pay vs cited public market ranges / alternatives for tools and roles |
| External Risk Brief | Short Tavily section on top vendors’ public headlines |
| Payee public-context dossier | Public footprint notes for review in Rho — not compliance clearance |
| Compare / Decision Studio | Scenario math + comparison tables (decision support) |
| Weekly Money Brief | PDF + audio pack (Spend Context + External Risk) published via Stan |
| Client Close Pack | Accountant-oriented Stan pack from period exceptions + narrative |
| Demo Mode | Deterministic sample ledger for reliable judging |

---

## Document approval

| Role | Name | Status |
|---|---|---|
| Product | TBD | Draft |
| Eng | TBD | Draft |
| Design | TBD | Draft |

**End of PRD**
