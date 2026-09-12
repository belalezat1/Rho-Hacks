# Product Requirements Document: RhoPilot

**Product name:** RhoPilot  
**Tagline:** Talk to your Rho account. Get decisions, not dashboards. Deliver the brief where clients already buy.  
**Document type:** PRD (hackathon → product foundation)  
**Status:** Draft for weekend build  
**Last updated:** 2026-09-12  
**Event context:** Rho Lock In Hackathon (NYC) — sponsors: Rho, ElevenLabs, Tavily, Stan  

---

## 1. Executive summary

RhoPilot is a **voice-first finance operating system** for startups and the accountants who support them.

Users speak to RhoPilot like a CFO. The product:

1. Reads live company money data from the **Rho API** (accounts, balances, transactions, statements).
2. Grounds answers in real-time web context via **Tavily** (vendor research, market/finance search, cited memos).
3. Converses and acts through **ElevenLabs Agents** (voice + chat agents with tool calling, workflows, guardrails), plus narration via ElevenCreative / TTS and optional Speech-to-Text via Scribe.
4. Ships finished work products as digital products on **Stan** (Cash Briefs, Client Close Packs, Vendor Decision Memos).

**One-sentence pitch for judges:**  
*A safe, read-only voice CFO on top of Rho that researches the web in real time and publishes client-ready money briefs to Stan.*

---

## 2. Problem statement

### 2.1 Pain

Founders, ops leads, and fractional CFOs drown in finance busywork:

- Cash, burn, and runway live in dashboards they open too late.
- “Weird spend” is discovered after the fact.
- Unknown vendors require manual Google tabs and Slack threads.
- Accountants retype the same client narratives every close.
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

Rho’s API is **read-only by design** (accounts, transactions, statements). That is a product strength for AI: agents can analyze without payment authority. Pairing Rho truth + Tavily grounding + ElevenLabs agency + Stan delivery creates a daily workflow tool judges and Rho itself can imagine shipping.

---

## 3. Goals and non-goals

### 3.1 Goals

| Goal | Success signal |
|---|---|
| Everyday usefulness | Founder can complete a Monday cash standup in &lt;2 minutes by voice |
| Sponsor-native depth | Rho, ElevenLabs, Tavily, and Stan are each load-bearing in the demo |
| Decision support | Answers include evidence (Rho) + citations (Tavily) + next step |
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

1. **Voice is the interface; numbers are the authority.** ElevenLabs is UX, Rho is truth.
2. **No answer without evidence.** Every material claim ties to Rho data and/or Tavily citations.
3. **Read-only is a feature.** Safe AI for finance; escalation happens in Rho, not in the agent.
4. **Finish the job.** Analysis without a deliverable is incomplete — publish to Stan.
5. **One hero loop.** Speak → Rho → Tavily → decision → Stan brief.
6. **Personas, not sprawl.** Founder mode and Accountant mode share one core; don’t build ten products.

---

## 6. Solution overview

### 6.1 Product definition

RhoPilot is a web application with:

- A polished finance cockpit (balances, anomalies, activity).
- An embedded **ElevenLabs Agent** (voice + text) with tools.
- A **Decision Studio** for hire / renew / runway scenarios.
- A **Stan publisher** for Cash Briefs and client packs (PDF + audio).

### 6.2 High-level architecture

```
User (voice/chat)
    → ElevenLabs Agent (workflows, guardrails, tool calling)
        → Tool: Rho API (accounts, balances, transactions, statements)
        → Tool: Tavily (search / extract / research, finance topic)
        → Tool: Brief generator (metrics + narrative + audio via ElevenLabs TTS)
        → Tool: Stan publish (digital product / storefront delivery)
    → UI cockpit mirrors agent state (evidence panels, citations, publish link)
```

### 6.3 Sponsor capability mapping

| Sponsor | Role in RhoPilot | Concrete surfaces |
|---|---|---|
| **Rho** | Source of truth for company money | Accounts, balances, transactions, statements (read-only REST) |
| **ElevenLabs** | Conversational agency + content | ElevenAgents (voice/chat, tools, workflows, guardrails); TTS / Creative for brief narration; optional Scribe STT |
| **Tavily** | Web access layer for agents | Search, Extract, Research; finance-topic retrieval; cited memos |
| **Stan** | Business-in-a-box delivery | Host/sell/deliver Cash Briefs, Close Packs, Decision Memos as digital products in a creator-style storefront |

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
| AR-5 | Enrich unknown vendors via Tavily search/extract (what they are, recent news) | P0 |
| AR-6 | Present anomaly queue sortable by severity / amount / date | P0 |

**Voice examples**

- “Anything weird since Monday?”
- “Who is ‘PQRS CLOUD’ and is $2,400 normal?”

---

### 7.3 Voice CFO Agent (ElevenLabs)

| ID | Requirement | Priority |
|---|---|---|
| VA-1 | Embedded conversational agent supporting voice and chat | P0 |
| VA-2 | Agent tools: `get_balances`, `get_transactions`, `tavily_research` (minimum) | P0 |
| VA-3 | Agent tools: `get_anomalies`, `run_scenario`, `generate_brief`, `publish_to_stan` | P1 |
| VA-4 | Workflow branching: cash → anomaly → research → recommendation → publish | P1 |
| VA-5 | Guardrails: refuse payment initiation; disclaim tax/legal advice; require citations for web claims | P0 |
| VA-6 | Generate spoken brief narration (TTS / Creative) for Stan packs | P0 |
| VA-7 | Optional: ingest voice notes via Speech-to-Text (Scribe) into session context | P2 |
| VA-8 | Show live tool traces in UI (what Rho/Tavily returned) for trust | P0 |

**Conversation contract**

1. User asks in natural language.  
2. Agent fetches Rho numbers.  
3. If needed, Tavily researches with citations.  
4. Agent answers with numbers + recommendation + confidence.  
5. Agent offers: “Publish this as a Stan Cash Brief?”

---

### 7.4 Live Research Layer (Tavily)

| ID | Requirement | Priority |
|---|---|---|
| TV-1 | Vendor identity lookup (search + extract) | P0 |
| TV-2 | Alternative / pricing comparison research | P0 |
| TV-3 | Finance-topic queries (yields, rates, sector news) where relevant | P1 |
| TV-4 | Multi-source cited decision memo via Research endpoint when depth needed | P1 |
| TV-5 | Display citations (title, URL, snippet) in UI and in exported briefs | P0 |
| TV-6 | Respect safety: no PII leakage into queries; block/redact sensitive strings | P0 |

**Voice examples**

- “Research cheaper alternatives to Intercom under $500/mo.”
- “What’s current short-term Treasury context vs our idle cash?” (informational only)

---

### 7.5 Decision Studio

| ID | Requirement | Priority |
|---|---|---|
| DS-1 | Hire affordability scenario (salary/all-in cost → burn/runway impact) | P0 |
| DS-2 | Renew / cancel / negotiate recommendation for recurring vendors | P0 |
| DS-3 | Tool/capex purchase impact on runway | P1 |
| DS-4 | Idle cash narrative vs treasury context (informational, not advice) | P2 |
| DS-5 | Every recommendation shows: Rho evidence → Tavily citations → confidence → next step in Rho | P0 |

---

### 7.6 Stan Cash Brief Publisher

| ID | Requirement | Priority |
|---|---|---|
| ST-1 | Generate Weekly Cash Brief (PDF) from session metrics + anomalies + research | P0 |
| ST-2 | Attach ElevenLabs audio standup (MP3) to the brief | P0 |
| ST-3 | Publish / attach brief as a Stan digital product (API if available; else guided export + live store URL in demo) | P0 |
| ST-4 | Support Client Close Pack variant for accountant persona | P1 |
| ST-5 | Support Vendor Decision Memo variant | P1 |
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

#### UC-01 — Monday founder cash standup
**Actor:** Founder  
**Trigger:** Start of week / daily open  
**Flow:** Voice ask “Give me the week” → Cash Pulse + Anomaly Radar → optional Tavily on top anomaly → offer Stan Weekly Cash Brief.  
**Outcome:** Shared co-founder brief in &lt;2 minutes.  
**Desirability:** Highest — ritualizable, demo-perfect.

#### UC-02 — Weird spend triage
**Actor:** Founder or accountant  
**Trigger:** Spike, new merchant, failed/pending item  
**Flow:** Anomaly queue → voice “Explain this” → Rho evidence + Tavily vendor enrichment → keep/watch/escalate.  
**Outcome:** Triage without tab chaos.  
**Desirability:** Highest — clear ROI and trust story.

#### UC-03 — Hire / affordability check
**Actor:** Founder  
**Trigger:** Hiring decision  
**Flow:** “Can we hire at $X all-in?” → Decision Studio models burn/runway → optional salary band research via Tavily → memo.  
**Outcome:** Go / no-go / cut-elsewhere recommendation.  
**Desirability:** Very high — decisions founders actually make.

#### UC-04 — Vendor renew war-room
**Actor:** Founder / ops  
**Trigger:** Recurring charge approaching renew  
**Flow:** Detect recurring vendor → Tavily alternatives/pricing/news → keep/cut/negotiate → Stan Decision Memo for async approval.  
**Outcome:** Quantified savings vs runway days.  
**Desirability:** Very high — measurable dollars.

#### UC-05 — Publish Weekly Cash Brief to Stan
**Actor:** Founder or accountant  
**Trigger:** End of agent session  
**Flow:** Generate PDF + audio → publish digital product on Stan → share link.  
**Outcome:** Finished artifact, not a chat transcript.  
**Desirability:** Highest for sponsor completeness and “ship the work.”

---

### 8.2 P1 — Strongly desirable (build if time / phase 2)

#### UC-06 — Accountant exception walkthrough
Walk pending/anomalies since period start; propose notes; generate **Client Close Pack** on Stan for the client.

#### UC-07 — Client narrative in plain English
“Explain the $14k wire to Acme” → Rho transaction detail + Tavily who Acme is → spoken + written narrative.

#### UC-08 — Week-over-week cash comparison
Automated WoW burn, inflows, and category deltas with voice summary.

#### UC-09 — Creator money standup (Stan × Rho)
Creator asks what remained after tools/ads; agent produces keep/set-aside/reinvest narrative and an audio standup reusable as content or a Stan product for coaching clients.

#### UC-10 — Board / investor mini-packet
Cash trajectory + burn + 1–2 Tavily market context bullets + ElevenLabs walkthrough → Stan-gated pack.

---

### 8.3 P2 — Aspirational / post-hackathon

#### UC-11 — Slack-native alerts with voice escalation  
Anomaly → enrich → ElevenLabs voice note to approver → Stan audit memo.

#### UC-12 — Multi-company accountant portfolio view  
Switch clients; standardized briefs.

#### UC-13 — Continuous vendor scorecards  
Health, pricing drift, news risk over time.

#### UC-14 — Policy / deadline research assist  
Informational lookups (EIN, formation, filing deadlines) with hard “not legal advice” framing — aligns with Rho content world but is not core finance OS.

#### UC-15 — Multilingual agent standups  
ElevenLabs 70+ language strength for international founding teams.

---

## 9. User experience requirements

### 9.1 First viewport / brand

- Product name **RhoPilot** as a hero-level brand signal.
- One composition: brand, one headline, one supporting line, one CTA (Talk / Start demo), one dominant visual (cockpit or waveform — not a card grid).
- Avoid generic purple-AI SaaS clichés; finance-trust visual direction (clarity, density with calm hierarchy).

### 9.2 Core screens

1. **Home / Talk** — Agent + evidence side panel.  
2. **Cash Pulse** — Balances, burn, runway.  
3. **Anomalies** — Queue with enrich actions.  
4. **Decisions** — Hire / renew scenarios.  
5. **Briefs** — History of generated packs + Stan links.  
6. **Settings** — API keys (local), demo toggle, persona (Founder / Accountant).

### 9.3 Demo script requirement (&lt;3 minutes)

1. Problem (15s)  
2. Live voice question with Rho numbers (60s)  
3. Tavily citation on unknown vendor (30s)  
4. Publish Stan brief + play audio (30s)  
5. Close on read-only safety + everyday workflow (15s)

---

## 10. Technical requirements (hackathon MVP)

### 10.1 Suggested stack

- **Frontend:** Next.js (App Router) + TypeScript  
- **Backend/API routes:** Next.js server routes or light Node service  
- **Agent:** ElevenLabs Agents SDK / ConvAI with webhook tools  
- **Data:** Rho REST (`/accounts`, `/transactions`, `/statements`)  
- **Research:** Tavily JS/Python SDK (`search`, `extract`, `research`)  
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
2. ElevenLabs Agent with tools: balances, transactions, Tavily research  
3. Anomaly list (heuristics)  
4. Cash Brief PDF + audio  
5. Stan publish path (real or guided demo with live store URL)  
6. Polished UI + README + sample data  

### Nice if time (P1)

- Accountant persona  
- Hire / renew presets in Decision Studio  
- Client Close Pack template  
- Activity timeline  

### Explicitly cut from weekend

- Real money movement  
- Full accounting sync  
- Native mobile apps  
- Multi-tenant SaaS billing for RhoPilot itself  

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
| Anomalies resolved | % of flagged items actioned within 24h |
| Citation rate | % of research answers with ≥1 Tavily source shown |
| Brief publish rate | % of sessions that export/publish to Stan |
| Trust events | Rate of “can’t move money” clarifications without user confusion |
| Retention proxy | Weekly active standups / user |

---

## 13. Strengths

1. **Rho-native and interview-track aligned** — Deep use of the host company’s API and partner narrative (founders + accountants).  
2. **Read-only safety story** — Matches Rho’s API positioning; reduces catastrophic agent risk vs payment-capable banks APIs.  
3. **ElevenLabs is the product, not a bolt-on** — Agents with tools/workflows/guardrails vs decorative TTS.  
4. **Tavily prevents finance hallucination** — Vendors and markets are grounded with citations; finance topic support fits.  
5. **Stan completes the job** — Turns chat into a digital product / client deliverable; unique vs “yet another AI dashboard.”  
6. **Everyday ritual** — Monday standup and renew triage are habitual, not one-off gimmicks.  
7. **Dual persona leverage** — Founder + accountant modes double demo paths without two codebases.  
8. **Prize stacking** — Architecture intentionally contends for Grand Prize + Rho + ElevenLabs + Tavily (+ content via Stan/story).  
9. **Demo clarity** — One loop judges can retell: speak → numbers → research → publish.  
10. **Extensible after the weekend** — Path to Slack alerts, portfolios, scorecards without rewriting core.

---

## 14. Weaknesses and risks

1. **Rho API surface is narrow today** — Read-only accounts/transactions/statements only; no payment actions, limited “wow” of executing finance.  
2. **Stan integration uncertainty** — Public API depth for programmatic product publish may be limited; weekend may need a guided/manual publish path that feels slightly demo-staged.  
3. **Heuristic anomalies ≠ ML fraud** — Spike/new-vendor rules will false-positive; credibility risk if not framed as “radar, not verdict.”  
4. **Voice in noisy hackathon halls** — Mic UX can fail live; chat fallback is mandatory.  
5. **Latency stacking** — Rho + LLM + Tavily + TTS can feel slow if not streamed/statused well.  
6. **Compliance sensitivity** — Anything sounding like investment/tax advice can alarm fintech judges; copy must stay informational.  
7. **Key/credit dependency** — ElevenLabs + Tavily + Rho sandbox access required for full live demo; Demo Mode mitigates but live path is stronger.  
8. **Scope creep magnet** — Easy to overbuild Slack, multi-entity, full close automation in 36 hours and ship nothing polished.  
9. **Differentiation risk** — Other teams may also build “AI + Rho”; without Stan deliverable + voice agency, it blends in.  
10. **Data realism** — Sandbox/sample data may look toy-like if not carefully designed to resemble a real startup ledger.

### 14.1 Mitigations

| Weakness | Mitigation |
|---|---|
| Narrow Rho API | Lean into analysis + decision + delivery; market read-only as safety |
| Stan API gaps | Pre-create store + product template; automate file gen; one-click “open publish” |
| False-positive anomalies | Severity tiers + “needs review” language + vendor enrichment before alarm |
| Noisy room | Big **Chat** CTA; pre-typed demo prompts |
| Latency | Parallel tool calls; skeleton UI; narrate while fetching |
| Compliance | Fixed disclaimers; guardrails in agent; no “invest” directives |
| Scope creep | Lock P0 list; timebox P1 to final 4 hours only |

---

## 15. Competitive / alternative framing

| Alternative | RhoPilot difference |
|---|---|
| Rho dashboard alone | Active voice OS + research + deliverable |
| ChatGPT + CSV export | Live Rho tools, citations, guardrails, Stan publish |
| Ramp/Brex AI features | Built on Rho stack for this customer base; accountant + Stan angle |
| Pure voice note apps | Ledger-grounded agency, not dictation |
| Stan alone | Adds banking truth + CFO agent for creator-operators |

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
5. PDF renderer choice (server HTML→PDF vs client) under time pressure?

---

## 18. Milestone plan (weekend)

| When | Outcome |
|---|---|
| Saturday afternoon | Repo scaffold, Demo Mode Cash Pulse, Rho client stub |
| Saturday evening | ElevenLabs agent + 3 tools live |
| Late Saturday | Anomalies + Tavily enrichment |
| Sunday morning | Brief PDF/audio + Stan path + UI polish |
| Pre-noon Sunday | Demo video, README, social post, submission |

---

## 19. Appendix A — Example agent system rules (draft)

- You are RhoPilot, a read-only finance copilot.  
- Never claim you can send payments, issue cards, or change account settings.  
- Prefer Rho tool data over memory for balances and transactions.  
- For vendors or market claims, call Tavily and cite sources.  
- Frame runway/hire/renew outputs as decision support, not advice.  
- After material answers, offer to publish a Stan Cash Brief.  
- If mic fails, continue in chat with the same tools.

---

## 20. Appendix B — Glossary

| Term | Meaning |
|---|---|
| Cash Pulse | Live snapshot of balances, burn, runway |
| Anomaly Radar | Heuristic exception detection + enrichment |
| Decision Studio | Scenario modeling (hire, renew, purchase) |
| Cash Brief | PDF + audio pack published via Stan |
| Demo Mode | Deterministic sample ledger for reliable judging |

---

## Document approval

| Role | Name | Status |
|---|---|---|
| Product | TBD | Draft |
| Eng | TBD | Draft |
| Design | TBD | Draft |

**End of PRD**
