# Product Requirements Document: RhoPilot

**Product name:** RhoPilot  
**Tagline:** Talk to your Rho account. Get decisions, not dashboards. Deliver the brief where clients already buy.  
**Document type:** PRD (hackathon → product foundation)  
**Status:** Draft for weekend build  
**Last updated:** 2026-09-12 (Tavily Outside Context Engine revision)  
**Event context:** Rho Lock In Hackathon (NYC) — sponsors: Rho, ElevenLabs, Tavily, Stan  

---

## 1. Executive summary

RhoPilot is a **voice-first finance operating system** for startups and the accountants who support them.

Users speak to RhoPilot like a CFO. The product:

1. Reads live company money data from the **Rho API** (accounts, balances, transactions, statements) — *what already happened on the books*.
2. Runs a load-bearing **Outside Context Engine** on **Tavily** (search, extract, research, finance topic) — *what those numbers mean in the world, and what to do next* (vendor risk, payee trust, renew/cut comps, hire/market rate comps, proactive external briefings).
3. Converses and acts through **ElevenLabs Agents** (voice + chat agents with tool calling, workflows, guardrails), plus narration via ElevenCreative / TTS and optional Speech-to-Text via Scribe.
4. Ships finished work products as digital products on **Stan** (Cash Briefs with External Risk sections, Client Close Packs, Vendor / Hire Decision Memos).

**Core split:** Rho = ledger truth. Tavily = outside truth. ElevenLabs = how you talk. Stan = how you ship the answer.

**One-sentence pitch for judges:**  
*A safe, read-only voice CFO on Rho that doesn’t just read your transactions—it researches the world around them, then publishes the decision brief to Stan.*

---

## 2. Problem statement

### 2.1 Pain

Founders, ops leads, and fractional CFOs drown in finance busywork:

- Cash, burn, and runway live in dashboards they open too late.
- “Weird spend” is discovered after the fact.
- Unknown vendors and new payees require manual Google tabs and Slack threads — with no trust check.
- Recurring SaaS and contractor spend continues on autopilot because comparing market rates is tedious.
- Hire / substitute decisions are made on gut feel, not “what we pay today vs what the market pays.”
- Accountants retype the same client narratives every close — without an external risk layer.
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

The winning product insight: **a talking dashboard is not enough.** Founders need judgment. Judgment requires outside context—vendor health, payee legitimacy, competitive SaaS pricing, labor/contractor market rates, and category risk. Tavily is therefore not optional lookup; it is RhoPilot’s **Outside Context Engine**. Pairing Rho truth + Tavily decisions + ElevenLabs agency + Stan delivery creates a daily workflow tool judges and Rho itself can imagine shipping.

---

## 3. Goals and non-goals

### 3.1 Goals

| Goal | Success signal |
|---|---|
| Everyday usefulness | Founder can complete a Monday cash standup in &lt;2 minutes by voice |
| Sponsor-native depth | Rho, ElevenLabs, Tavily, and Stan are each load-bearing in the demo |
| Outside-context decisions | Judgment calls (renew, hire/substitute, trust payee, weekly risk) **require** Tavily citations |
| Decision support | Answers include evidence (Rho) + citations (Tavily) + next step |
| Comp / rate intelligence | Agent can compare *what you pay* (Rho) vs *market substitutes* (Tavily) for vendors and roles |
| Shipable output | User leaves with a Stan digital product link (brief / memo / pack) |
| Safety posture | Agent never claims it can move money; reinforces read-only Rho access |
| Hackathon win posture | Contends for Grand Prize + Best Rho API + Best ElevenLabs + Best Tavily |

### 3.2 Non-goals (explicit)

- Initiating payments, wires, ACH, card issuance, or account modifications via API.
- Replacing Rho’s full banking dashboard or Rho Close.
- Providing formal tax, legal, or investment advice.
- Multi-entity enterprise consolidation in v1.
- Full accounting system of record (QuickBooks/Xero replacement).
- Building a general consumer banking app.

---

## 4. Target users and personas

### 4.1 Primary — Startup founder / ops lead

- Needs runway, burn, and spend clarity without living in spreadsheets.
- Asks: “What’s our cash?” “Any weird spend?” “Can we hire?” “Should we renew X?”

### 4.2 Primary — Fractional CFO / accountant (Rho partner audience)

- Needs faster exception review and client-ready narratives.
- Asks: “Walk anomalies since the 1st.” “Draft the client cash brief.” “Explain this wire.”

### 4.3 Secondary — Creator-operator (Stan audience)

- Runs a Stan store + banks with Rho.
- Needs “what did I keep after tools/ads?” and a reusable money standup.

### 4.4 Internal champion (hackathon narrative)

- Rho CS / product / partner teams who want founders to feel finance as frictionless — aligned with Rho’s mission.

---

## 5. Product principles

1. **Voice is the interface; numbers are the authority.** ElevenLabs is UX, Rho is ledger truth.
2. **Rho = what happened. Tavily = what it means.** Outside context is a product pillar, not a fallback.
3. **Math can be Rho-only. Judgment requires Tavily.** Balance/burn questions may skip the web; renew / hire / trust / weekly risk must not.
4. **No answer without evidence.** Every material claim ties to Rho data and/or Tavily citations.
5. **Read-only is a feature.** Safe AI for finance; escalation happens in Rho, not in the agent.
6. **Finish the job.** Analysis without a deliverable is incomplete — publish to Stan.
7. **One hero loop.** Speak → Rho → Tavily Outside Context → decision → Stan brief.
8. **Personas, not sprawl.** Founder mode and Accountant mode share one core; don’t build ten products.

---

## 6. Solution overview

### 6.1 Product definition

RhoPilot is a web application with:

- A polished finance cockpit (balances, anomalies, activity).
- An embedded **ElevenLabs Agent** (voice + text) with tools.
- An **Outside Context Engine** powered by Tavily (weekly risk, payee trust, renew/cut, hire comps, proactive watch).
- A **Decision Studio** for hire / substitute / renew / runway scenarios.
- A **Stan publisher** for Cash Briefs and client packs (PDF + audio).

### 6.2 High-level architecture

```
User (voice/chat)
    → ElevenLabs Agent (workflows, guardrails, tool calling)
        → Tool: Rho API (accounts, balances, transactions, statements)
        → Tool: Outside Context Engine (Tavily search / extract / research)
            → Weekly External Risk Brief
            → Payee / counterparty trust check
            → Renew / cut competitive pricing
            → Hire / labor market comps + substitutes
            → Proactive “what changed” watch on top merchants + category
        → Tool: Brief generator (metrics + narrative + audio via ElevenLabs TTS)
        → Tool: Stan publish (digital product / storefront delivery)
    → UI cockpit mirrors agent state (evidence panels, citations, publish link)
```

### 6.3 Sponsor capability mapping

| Sponsor | Role in RhoPilot | Concrete surfaces |
|---|---|---|
| **Rho** | Source of truth for company money (*what you pay / what moved*) | Accounts, balances, transactions, statements (read-only REST) |
| **ElevenLabs** | Conversational agency + content | ElevenAgents (voice/chat, tools, workflows, guardrails); TTS / Creative for brief narration; optional Scribe STT |
| **Tavily** | **Outside Context Engine** (*what it means / market substitutes*) | Search, Extract, Research; `topic: finance` / news; cited risk, pricing, and labor-market memos |
| **Stan** | Business-in-a-box delivery | Host/sell/deliver Cash Briefs (with External Risk), Close Packs, Vendor / Hire Decision Memos |

### 6.4 Tavily capability note (hire / pricing comps)

Tavily does **not** know your payroll by itself. Competitive pricing works as a **two-tool loop**:

1. **Rho** identifies what you currently pay (e.g. recurring contractor ACH, Gusto/Deel/Upwork payouts, named vendor).
2. **Tavily** researches live market rates and substitutes (salary bands, contractor day rates, SaaS list prices) via Search → Extract → Research, with citations.
3. **ElevenLabs Agent** compares the two and recommends keep / renegotiate / substitute, including runway impact.

Tavily can surface competitive prices from public web sources; it cannot invent private employer databases. Outputs are decision support with sources—not guaranteed quotes.

---

## 7. Functional requirements

### 7.1 Cash Pulse (Rho)

| ID | Requirement | Priority |
|---|---|---|
| CP-1 | Display account list with balances (checking, savings, treasury if present) | P0 |
| CP-2 | Compute 30/60/90-day burn and approximate runway from transactions + cash | P0 |
| CP-3 | Show recent cash movements in plain English (card, ACH, wire, transfer, etc.) | P0 |
| CP-4 | Pull statement metadata / period context for close narratives | P1 |
| CP-5 | Rank top vendors / largest outflows for concentration risk | P1 |
| CP-6 | Support sandbox/demo mode with sample Rho-shaped data when no token | P0 |

**Voice examples**

- “What’s our runway if revenue is flat?”
- “Summarize cash this week vs last week.”

---

### 7.2 Anomaly Radar (Rho + Tavily)

| ID | Requirement | Priority |
|---|---|---|
| AR-1 | Detect spend spikes vs vendor baseline (heuristic) | P0 |
| AR-2 | Flag first-time / unknown merchants | P0 |
| AR-3 | Surface failed, pending, and awaiting_approval transactions | P0 |
| AR-4 | Flag near-duplicate charges (similar amount + merchant + time window) | P1 |
| AR-5 | Enrich unknown / large payees via **Tavily payee trust check (playbook 2)** | P0 |
| AR-6 | Present anomaly queue sortable by severity / amount / date | P0 |

**Voice examples**

- “Anything weird since Monday?”
- “Who is ‘PQRS CLOUD’ and is $2,400 normal?”

---

### 7.3 Voice CFO Agent (ElevenLabs)

| ID | Requirement | Priority |
|---|---|---|
| VA-1 | Embedded conversational agent supporting voice and chat | P0 |
| VA-2 | Agent tools: `get_balances`, `get_transactions`, `get_anomalies` | P0 |
| VA-3 | Agent tools (Outside Context): `tavily_risk_brief`, `tavily_payee_trust`, `tavily_renew_comps`, `tavily_hire_comps`, `tavily_world_watch` | P0 |
| VA-4 | Agent tools: `run_scenario`, `generate_brief`, `publish_to_stan` | P0 |
| VA-5 | Workflow branching: cash → outside context → recommendation → publish | P0 |
| VA-6 | Guardrails: refuse payment initiation; disclaim tax/legal/employment advice; require citations for web/comp claims | P0 |
| VA-7 | Generate spoken brief narration (TTS / Creative) for Stan packs | P0 |
| VA-8 | Optional: ingest voice notes via Speech-to-Text (Scribe) into session context | P2 |
| VA-9 | Show live tool traces in UI (what Rho/Tavily returned) for trust | P0 |
| VA-10 | Judgment routing rule: renew / hire-substitute / payee-trust / weekly-risk **must** call Tavily before recommending | P0 |

**Conversation contract**

1. User asks in natural language.  
2. Agent fetches Rho numbers (*what you pay / what moved*).  
3. For judgment questions, Outside Context Engine runs the matching Tavily playbook with citations.  
4. Agent answers with Rho evidence + market/outside context + recommendation + confidence.  
5. Agent offers: “Publish this as a Stan Cash Brief / Decision Memo?”

---

### 7.4 Outside Context Engine (Tavily) — P0 product pillar

Tavily is **not** “search when stuck.” It is the engine that turns ledger events into forward-looking decisions.

**Product rule:**  
- Pure math (“What’s our balance?” / “What’s burn?”) → Rho only.  
- Judgment (“Should we renew?” / “Is this payee safe?” / “What does the world mean for our books?” / “Are we overpaying this hire?”) → **Rho + Tavily required.**

#### 7.4.1 Shared Tavily platform requirements

| ID | Requirement | Priority |
|---|---|---|
| TV-0a | Use Tavily `search`, `extract`, and `research` as appropriate per playbook | P0 |
| TV-0b | Prefer `topic: finance` or `news` when query type matches | P0 |
| TV-0c | Display citations (title, URL, snippet) in UI and exported briefs | P0 |
| TV-0d | Redact PII from queries; never send full account numbers, SSNs, or raw pay stubs | P0 |
| TV-0e | Label all market comps as informational decision support, not offers or employment advice | P0 |
| TV-0f | Cache playbook results per merchant/role for the session to control latency/credits | P1 |

---

#### 7.4.2 Playbook 1 — Weekly External Risk Brief (P0)

Automatically research the world around *this company’s* books and attach it to every Weekly Cash Brief.

| ID | Requirement | Priority |
|---|---|---|
| TV-1a | From Rho, identify top N merchants by spend (default 10) + primary industry/category tags | P0 |
| TV-1b | Tavily Research/Search each top merchant for outages, breaches, price changes, shutdown/lawsuit signals | P0 |
| TV-1c | Tavily Research category / customer-segment demand signals relevant to the business | P0 |
| TV-1d | Tavily finance-topic context for idle-cash / short-term yield environment (informational) | P0 |
| TV-1e | Produce a structured **External Risk** section: vendor risks, category signals, cash-context bullets, citations | P0 |
| TV-1f | Include External Risk in Stan Weekly Cash Brief PDF + spoken standup | P0 |

**Voice example:** “Give me the week — including anything outside our books I should worry about.”

---

#### 7.4.3 Playbook 2 — Counterparty / payee trust check (P0)

Protect company cash when Rho shows a new or large payee.

| ID | Requirement | Priority |
|---|---|---|
| TV-2a | Trigger on first-time merchant, amount above threshold, or user ask (“Can I trust this payee?”) | P0 |
| TV-2b | Tavily Search + Extract: does the company appear real (site, about, contact footprint)? | P0 |
| TV-2c | Tavily News/Search: scam reports, lawsuits, shutdowns, breach headlines | P0 |
| TV-2d | Compare charged amount vs public pricing pages when discoverable (Extract) | P1 |
| TV-2e | Output trust dossier: Real / Needs review / High caution + citations + suggested next step in Rho | P0 |

**Voice example:** “We have a new $8,400 wire to Northpeak Labs — is that legitimate?”

---

#### 7.4.4 Playbook 3 — Renew / cut competitive pricing engine (P0)

For recurring vendors, Tavily is why the feature exists—not enrichment.

| ID | Requirement | Priority |
|---|---|---|
| TV-3a | Detect recurring Rho merchants (SaaS/tools) and current monthly/annual amount paid | P0 |
| TV-3b | Tavily Research alternatives + list pricing / packaging | P0 |
| TV-3c | Tavily Search recent incidents, pricing changes, and switching signals | P0 |
| TV-3d | Structured memo: **keep / negotiate / replace** + estimated monthly savings | P0 |
| TV-3e | Translate savings into **runway days saved** using Rho burn | P0 |
| TV-3f | Publish as Stan Vendor Decision Memo | P0 |

**Voice example:** “Should we renew Intercom, and what’s the competitive price to switch?”

---

#### 7.4.5 Playbook 4 — Decision stress tests + hire / substitute comps (P0)

Rho answers affordability. Tavily answers whether the *price of the person or substitute* is competitive.

| ID | Requirement | Priority |
|---|---|---|
| TV-4a | Hire affordability: model all-in cost impact on burn/runway from Rho cash + burn | P0 |
| TV-4b | Identify current pay for a person/role/contractor from Rho transactions (payroll provider, contractor ACH, labeled merchant) when available | P0 |
| TV-4c | Tavily Search/Research market compensation bands for role, seniority, geo, and employment type (FT / contractor) | P0 |
| TV-4d | Tavily Research substitute options (contractor vs FT, agency vs individual, nearshore bands) with cited ranges | P0 |
| TV-4e | Compare **current Rho pay vs market band vs substitute band**; flag over/under-pay vs citations | P0 |
| TV-4f | Layer optional macro context (hiring freezes, cooling/tightening signals) via Tavily News/Research | P1 |
| TV-4g | Output Hire / Substitute Decision Memo → optional Stan publish | P0 |

**Example founder conversation**

1. “How much are we paying Jordan / our freelance designer right now?” → **Rho** (recurring payouts).  
2. “What would a competitive substitute cost?” → **Tavily** (market rate research + citations).  
3. “If we switched to the midpoint substitute, what happens to runway?” → **Rho math + Tavily rate**.  

**Voice examples**

- “We’re paying $9k/mo for a contractor designer—what’s the competitive rate for a substitute?”  
- “Can we hire a senior eng, and what does the market actually pay vs our offer?”

---

#### 7.4.6 Playbook 5 — Proactive “what changed in the world?” watch (P0)

Always-on outside intelligence mapped back to *this* ledger—not user-initiated Google.

| ID | Requirement | Priority |
|---|---|---|
| TV-5a | Maintain a watchlist derived from Rho top merchants + user industry tags | P0 |
| TV-5b | On standup / on-demand, Tavily Search/News for material changes since last brief | P0 |
| TV-5c | Only surface items that map to a Rho merchant, payee, or stated category decision | P0 |
| TV-5d | Present as “External changes affecting your books” with severity + citations | P0 |
| TV-5e | Feed watch hits into Weekly External Risk Brief and anomaly enrichment | P0 |

**Voice example:** “What changed in the world this week that affects our vendors or category?”

---

### 7.5 Decision Studio

| ID | Requirement | Priority |
|---|---|---|
| DS-1 | Hire affordability scenario (salary/all-in cost → burn/runway impact) using Rho | P0 |
| DS-2 | Hire / substitute **market comps** via Tavily playbook 4 (required before final recommendation) | P0 |
| DS-3 | Renew / cancel / negotiate recommendation for recurring vendors via Tavily playbook 3 | P0 |
| DS-4 | Payee trust gate via Tavily playbook 2 before “looks fine” on large/new payees | P0 |
| DS-5 | Tool/capex purchase impact on runway | P1 |
| DS-6 | Idle cash narrative vs treasury context via Tavily finance topic (informational) | P1 |
| DS-7 | Every recommendation shows: Rho evidence → Tavily citations → confidence → next step in Rho | P0 |

---

### 7.6 Stan Cash Brief Publisher

| ID | Requirement | Priority |
|---|---|---|
| ST-1 | Generate Weekly Cash Brief (PDF) from Cash Pulse + anomalies + **External Risk Brief (Tavily playbook 1)** | P0 |
| ST-2 | Attach ElevenLabs audio standup (MP3) to the brief | P0 |
| ST-3 | Publish / attach brief as a Stan digital product (API if available; else guided export + live store URL in demo) | P0 |
| ST-4 | Support Client Close Pack variant for accountant persona | P1 |
| ST-5 | Support Vendor Decision Memo (playbook 3) and Hire / Substitute Memo (playbook 4) | P0 |
| ST-6 | Return shareable Stan link in UI and agent response | P0 |

**Stan alignment**

Stan positions itself as the all-in-one creator store (courses, digital products, bookings, link-in-bio, 1-tap checkout, 0% transaction fees messaging). RhoPilot uses Stan as the **delivery and monetization layer** for finance work products—not as a decorative logo.

---

### 7.7 Auth, demo, and safety

| ID | Requirement | Priority |
|---|---|---|
| SA-1 | Rho API token configuration via env / settings (never commit secrets) | P0 |
| SA-2 | One-click Demo Mode with deterministic sample data | P0 |
| SA-3 | Clear UI badge: “Read-only · Cannot move money” | P0 |
| SA-4 | README with setup, sample data, and run instructions (hackathon submission) | P0 |
| SA-5 | Logging of tool calls for demo replay without exposing secrets | P1 |

---

## 8. Functional desirable use cases

These are the **intended everyday workflows** RhoPilot should make faster. Priority reflects hackathon + product desirability.

### 8.1 P0 — Must delight in demo and daily use

#### UC-01 — Monday founder cash standup + External Risk Brief
**Actor:** Founder  
**Trigger:** Start of week / daily open  
**Flow:** Voice “Give me the week” → Cash Pulse + Anomaly Radar → **Tavily Weekly External Risk Brief (playbook 1)** on top merchants/category → Stan Weekly Cash Brief (includes External Risk).  
**Outcome:** Shared co-founder brief with *books + world* in &lt;2 minutes.  
**Desirability:** Highest — ritualizable, demo-perfect, makes Tavily mandatory.

#### UC-02 — Payee / weird spend trust triage
**Actor:** Founder or accountant  
**Trigger:** Spike, new merchant, large payee, failed/pending item  
**Flow:** Anomaly queue → voice “Explain / can I trust this?” → Rho evidence + **Tavily payee trust check (playbook 2)** → keep/watch/escalate.  
**Outcome:** Cash-protection triage without tab chaos.  
**Desirability:** Highest — high-stakes, clearly not decorative Tavily.

#### UC-03 — Hire / substitute competitive pricing
**Actor:** Founder  
**Trigger:** Hiring, contractor renew, or “are we overpaying?”  
**Flow:**  
1. Rho: current pay to person/role/contractor (if present on ledger).  
2. Decision Studio: affordability vs runway.  
3. **Tavily hire comps (playbook 4):** market band + substitute options with citations.  
4. Compare current vs market vs substitute; optional Stan Hire Memo.  
**Outcome:** “You’re paying $X; competitive substitutes are $Y–$Z; runway impact if you switch is N days.”  
**Desirability:** Very high — answers the exact founder question; showcases Rho×Tavily split.

#### UC-04 — Vendor renew / cut war-room
**Actor:** Founder / ops  
**Trigger:** Recurring charge / renew ask  
**Flow:** Rho recurring amount → **Tavily renew engine (playbook 3)** alternatives/pricing/news → keep/cut/negotiate → savings → runway days → Stan Vendor Decision Memo.  
**Outcome:** Quantified savings with citations.  
**Desirability:** Very high — measurable dollars; Tavily is the feature.

#### UC-05 — Proactive world-watch on your books
**Actor:** Founder / accountant  
**Trigger:** Standup, on-demand, or after Cash Brief generation  
**Flow:** Watchlist from Rho top merchants + category → **Tavily playbook 5** → only ledger-relevant changes → feed into brief/anomalies.  
**Outcome:** “Here’s what changed outside that affects *your* vendors.”  
**Desirability:** Highest for “Tavily isn’t bolted on” narrative.

#### UC-06 — Publish Weekly Cash Brief / Decision Memo to Stan
**Actor:** Founder or accountant  
**Trigger:** End of agent session  
**Flow:** Generate PDF + audio (including External Risk / comps) → publish digital product on Stan → share link.  
**Outcome:** Finished artifact, not a chat transcript.  
**Desirability:** Highest for sponsor completeness and “ship the work.”

---

### 8.2 P1 — Strongly desirable (build if time / phase 2)

#### UC-07 — Accountant exception walkthrough
Walk pending/anomalies since period start; run payee trust on unknowns; generate **Client Close Pack** on Stan.

#### UC-08 — Client narrative in plain English
“Explain the $14k wire to Acme” → Rho detail + Tavily trust/identity → spoken + written narrative.

#### UC-09 — Week-over-week cash comparison
Automated WoW burn, inflows, and category deltas with voice summary (+ world-watch delta).

#### UC-10 — Creator money standup (Stan × Rho)
Creator asks what remained after tools/ads; agent produces keep/set-aside/reinvest narrative and an audio standup reusable as content or a Stan product.

#### UC-11 — Board / investor mini-packet
Cash trajectory + burn + External Risk bullets + ElevenLabs walkthrough → Stan-gated pack.

---

### 8.3 P2 — Aspirational / post-hackathon

#### UC-12 — Slack-native alerts with voice escalation  
Anomaly → payee trust → ElevenLabs voice note to approver → Stan audit memo.

#### UC-13 — Multi-company accountant portfolio view  
Switch clients; standardized briefs + external risk.

#### UC-14 — Continuous vendor scorecards  
Health, pricing drift, news risk over time (persistent playbook 3/5).

#### UC-15 — Policy / deadline research assist  
Informational lookups with hard “not legal advice” framing.

#### UC-16 — Multilingual agent standups  
ElevenLabs 70+ language strength for international founding teams.

---

## 9. User experience requirements

### 9.1 First viewport / brand

- Product name **RhoPilot** as a hero-level brand signal.
- One composition: brand, one headline, one supporting line, one CTA (Talk / Start demo), one dominant visual (cockpit or waveform — not a card grid).
- Avoid generic purple-AI SaaS clichés; finance-trust visual direction (clarity, density with calm hierarchy).

### 9.2 Core screens

1. **Home / Talk** — Agent + evidence side panel (Rho + Tavily citations).  
2. **Cash Pulse** — Balances, burn, runway.  
3. **Anomalies** — Queue with payee-trust actions.  
4. **Outside Context** — External Risk, world-watch, renew/hire comps panels.  
5. **Decisions** — Hire / substitute / renew scenarios.  
6. **Briefs** — History of generated packs + Stan links.  
7. **Settings** — API keys (local), demo toggle, persona (Founder / Accountant).

### 9.3 Demo script requirement (&lt;3 minutes)

1. Problem (10s): Dashboards show what happened—not what it means.  
2. Voice cash standup with Rho numbers (40s).  
3. **Tavily External Risk / payee trust or hire-comps moment with on-screen citations (50s).**  
4. Publish Stan brief including Outside Context section + play audio (30s).  
5. Close: read-only safety + “Rho truth, Tavily context, voice in, Stan out” (15s).

---

## 10. Technical requirements (hackathon MVP)

### 10.1 Suggested stack

- **Frontend:** Next.js (App Router) + TypeScript  
- **Backend/API routes:** Next.js server routes or light Node service  
- **Agent:** ElevenLabs Agents SDK / ConvAI with webhook tools  
- **Data:** Rho REST (`/accounts`, `/transactions`, `/statements`)  
- **Research / Outside Context:** Tavily JS SDK — `search`, `extract`, `research` (playbooks 1–5)  
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
| Observability | Tool trace panel for judges |

---

## 11. MVP scope (weekend ship list)

### Must ship (P0)

1. Rho connect or Demo Mode → Cash Pulse  
2. ElevenLabs Agent with Rho tools + Outside Context tools  
3. Anomaly list + **Payee trust check (playbook 2)**  
4. **Weekly External Risk Brief (playbook 1)** attached to Cash Brief  
5. **Renew/cut comps (playbook 3)** OR **Hire/substitute comps (playbook 4)** as hero Decision Studio path (ship both if possible; at least one fully polished + the other stubbed with live Tavily)  
6. **World-watch (playbook 5)** feeding standup  
7. Cash Brief PDF + audio including External Risk  
8. Stan publish path (real or guided demo with live store URL)  
9. Polished UI + README + sample data (include sample contractor pay + SaaS recurrings for comps demos)

### Nice if time (P1)

- Accountant persona  
- Both renew **and** hire comps fully polished  
- Client Close Pack template  
- Activity timeline  

### Explicitly cut from weekend

- Real money movement  
- Full accounting sync  
- Native mobile apps  
- Multi-tenant SaaS billing for RhoPilot itself  
- Guaranteeing private salary-database accuracy (public web comps + citations only)  

---

## 12. Success metrics

### 12.1 Hackathon judging proxies

- Judges complete the hero loop without explanation.  
- Each sponsor is verbally named with a visible artifact.  
- Demo video &lt;3 minutes with working product + tech stack narration.  
- Social post published (LinkedIn/X).  
- README enables third-party run.

### 12.2 Product metrics (post-hackathon)

| Metric | Definition |
|---|---|
| Time-to-standup | Median seconds from open → brief generated |
| External Risk coverage | % of Weekly Briefs that include ≥3 cited Tavily findings |
| Judgment citation rate | % of renew/hire/trust answers with ≥1 Tavily source |
| Comp compare rate | % of hire/substitute sessions that show Rho pay vs Tavily market band |
| Anomalies resolved | % of flagged items actioned within 24h |
| Brief publish rate | % of sessions that export/publish to Stan |
| Trust events | Rate of “can’t move money” clarifications without user confusion |
| Retention proxy | Weekly active standups / user |

---

## 13. Strengths

1. **Rho-native and interview-track aligned** — Deep use of the host company’s API and partner narrative (founders + accountants).  
2. **Read-only safety story** — Matches Rho’s API positioning; reduces catastrophic agent risk vs payment-capable banks APIs.  
3. **ElevenLabs is the product, not a bolt-on** — Agents with tools/workflows/guardrails vs decorative TTS.  
4. **Tavily is a named pillar (Outside Context Engine)** — Weekly risk, payee trust, renew comps, hire/substitute comps, and world-watch are required for judgment—not optional Google.  
5. **Clean Rho×Tavily split for comps** — Rho shows what you pay; Tavily shows competitive substitute rates with citations.  
6. **Stan completes the job** — Turns chat into a digital product / client deliverable; unique vs “yet another AI dashboard.”  
7. **Everyday ritual** — Monday standup with External Risk is habitual, not a one-off gimmick.  
8. **Dual persona leverage** — Founder + accountant modes double demo paths without two codebases.  
9. **Prize stacking** — Architecture intentionally contends for Grand Prize + Rho + ElevenLabs + Best Tavily (+ content via Stan/story).  
10. **Demo clarity** — Judges can retell: speak → Rho truth → Tavily meaning → Stan out.  

---

## 14. Weaknesses and risks

1. **Rho API surface is narrow today** — Read-only accounts/transactions/statements only; no payment actions, limited “wow” of executing finance.  
2. **Stan integration uncertainty** — Public API depth for programmatic product publish may be limited; weekend may need a guided/manual publish path that feels slightly demo-staged.  
3. **Heuristic anomalies ≠ ML fraud** — Spike/new-vendor rules will false-positive; credibility risk if not framed as “radar, not verdict.”  
4. **Voice in noisy hackathon halls** — Mic UX can fail live; chat fallback is mandatory.  
5. **Latency stacking** — Rho + LLM + multiple Tavily playbooks + TTS can feel slow if not streamed/statused/cached well.  
6. **Compliance sensitivity** — Investment/tax/employment framing can alarm fintech judges; comps must stay informational.  
7. **Key/credit dependency** — ElevenLabs + Tavily + Rho sandbox access required for full live demo; Demo Mode mitigates but live path is stronger.  
8. **Scope creep magnet** — Five Tavily playbooks can blow the weekend; must still polish the hero path.  
9. **Market comps are public-web approximate** — Tavily cannot access private salary DBs; bands may be incomplete or stale vs reality.  
10. **Role inference from ledger is fuzzy** — Rho may show “Deel — $9,000” without job title; user/agent must confirm role for good comps.  
11. **Differentiation risk** — Other teams may also build “AI + Rho”; without Outside Context + Stan deliverable, it blends in.  
12. **Data realism** — Sandbox/sample data may look toy-like if not carefully designed (include recurrings + contractor pay).

### 14.1 Mitigations

| Weakness | Mitigation |
|---|---|
| Narrow Rho API | Lean into analysis + outside context + delivery; market read-only as safety |
| Stan API gaps | Pre-create store + product template; automate file gen; one-click “open publish” |
| False-positive anomalies | Severity tiers + payee trust before alarm language |
| Noisy room | Big **Chat** CTA; pre-typed demo prompts |
| Latency | Parallel Tavily calls; session cache; skeleton UI; narrate while fetching |
| Compliance | Fixed disclaimers; guardrails; no “fire/hire legally” directives; comps ≠ offers |
| Scope creep | Ship all 5 playbooks at thin-slice depth; polish Risk + (Hire comps **or** Renew) as hero |
| Approximate comps | Always show citations + range + “verify before deciding” |
| Fuzzy role labels | Agent asks one clarifying question (“Is this a senior product designer?”) before Tavily |
| Sample data | Seed demo ledger with named contractor + 3 SaaS recurrings |

---

## 15. Competitive / alternative framing

| Alternative | RhoPilot difference |
|---|---|
| Rho dashboard alone | Active voice OS + Outside Context + deliverable |
| ChatGPT + CSV export | Live Rho tools, required Tavily playbooks, guardrails, Stan publish |
| Ramp/Brex AI features | Built on Rho stack; accountant + Stan + hire/renew comps angle |
| Pure voice note apps | Ledger-grounded agency, not dictation |
| “AI that Googles vendors” | Five named playbooks mapped to ledger decisions |
| Stan alone | Adds banking truth + CFO agent + external risk for creator-operators |

---

## 16. Go-to-market / narrative (hackathon)

### Positioning

“Finance frictionless” extension of Rho: the daily layer you talk to, not another login you dread.

### Content angle (Best Content / Stan session)

- Build-in-public posts: voice standup clips, before/after of anomaly triage, Stan brief link.  
- Founder story: “I don’t want five finance apps — I want one conversation and a client-ready pack.”

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
5. Should hire-comps or renew-comps be the primary Sunday demo hero if time forces a choice?  
6. How do we map payroll-provider lump sums (Gusto/Deel) to individual roles in demo data?

---

## 18. Milestone plan (weekend)

| When | Outcome |
|---|---|
| Saturday afternoon | Repo scaffold, Demo Mode Cash Pulse (with contractor + SaaS sample pay), Rho client stub |
| Saturday evening | ElevenLabs agent + Rho tools + first two Tavily playbooks live |
| Late Saturday | Remaining playbooks thin-slice; External Risk on brief |
| Sunday morning | Hire **or** Renew comps hero polish; Stan path; UI polish |
| Pre-noon Sunday | Demo video (must show Tavily citations), README, social post, submission |

---

## 19. Appendix A — Example agent system rules (draft)

- You are RhoPilot, a read-only finance copilot.  
- Never claim you can send payments, issue cards, or change account settings.  
- Prefer Rho tool data over memory for balances, transactions, and *what the company currently pays*.  
- Treat Tavily as the Outside Context Engine: for renew, hire/substitute, payee trust, weekly risk, and world-watch, you **must** call the matching playbook before recommending.  
- Pure math questions (balance, burn) may use Rho only.  
- For compensation and vendor pricing, compare Rho current pay vs Tavily cited market ranges; show sources; never present comps as guaranteed quotes or employment advice.  
- If role/title is unclear from the ledger, ask one clarifying question before running hire comps.  
- Frame runway/hire/renew outputs as decision support, not advice.  
- After material answers, offer to publish a Stan Cash Brief or Decision Memo.  
- If mic fails, continue in chat with the same tools.

---

## 20. Appendix B — Glossary

| Term | Meaning |
|---|---|
| Cash Pulse | Live snapshot of balances, burn, runway |
| Anomaly Radar | Heuristic exception detection + payee trust enrichment |
| Outside Context Engine | Tavily-powered layer: risk brief, trust, renew comps, hire comps, world-watch |
| External Risk Brief | Weekly Tavily section on top vendors + category + cash context |
| Hire / substitute comps | Rho current pay vs Tavily researched market/substitute rates |
| Decision Studio | Scenario modeling (hire, substitute, renew, purchase) |
| Cash Brief | PDF + audio pack (incl. External Risk) published via Stan |
| Demo Mode | Deterministic sample ledger for reliable judging |

---

## Document approval

| Role | Name | Status |
|---|---|---|
| Product | TBD | Draft |
| Eng | TBD | Draft |
| Design | TBD | Draft |

**End of PRD**
