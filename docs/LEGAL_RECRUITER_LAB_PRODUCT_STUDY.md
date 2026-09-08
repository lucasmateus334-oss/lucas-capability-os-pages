# Legal Recruiter Lab — Product Study v0.1

## Recommendation

Do not launch the source as a standalone ebook first. Use the ebook as the curriculum/IP layer of a small digital learning product with a free playable demo, a paid interactive tier, and a premium implementation tier.

## Why the source supports this

The source already contains the core components of a learning product rather than a passive book:

- six sequenced parts and twenty-nine chapters;
- chapter learning objectives, exercises, suggested answers, key takeaways and glossary links;
- two extended master case studies;
- an Operator Toolkit with eighteen reusable working tools;
- a first-90-days implementation plan;
- explicit chapters on ethics, cross-cultural evaluation and responsible AI use.

This means the highest-leverage transformation is packaging and interaction, not rewriting the content.

## Product architecture

### 1. Free — Playable Mission
Purpose: acquisition and product validation.

- 3–5 scenario decisions;
- instant feedback;
- XP/readiness score;
- email capture once a brand/support mailbox exists;
- CTA to paid product.

### 2. Entry — Field Guide
Validation price hypothesis: USD 19–29.

- polished PDF;
- operator toolkit;
- quick-reference sheets;
- printable 90-day plan.

### 3. Core — Operator Lab
Validation price hypothesis: USD 49–79.

- six interactive learning paths;
- scenario questions derived from chapter exercises;
- progress persistence;
- case-based decisions;
- downloadable working templates;
- completion record/certificate (not a professional certification).

### 4. Premium — 90-Day Sprint
Validation price hypothesis: USD 99–149.

- full Operator Lab;
- structured 90-day practice path;
- mock-search capstone;
- AI practice prompts with privacy warnings;
- portfolio-ready outputs created from fictional or public information only.

## Faceless operating model

Public brand can remain separate from the operator's personal identity in marketing. Use a product brand, product mailbox, text-based support, written tutorials and no founder video requirement.

Important limitation: payment processors, merchant-of-record providers, banking and tax systems may require the seller's legal identity privately for KYC/tax compliance. A faceless storefront is not the same as anonymous commerce.

## Suggested stack

### MVP / lowest complexity
- Frontend: Astro + GitHub Pages (already available).
- Product demo: static JavaScript, local progress state.
- Checkout/delivery: merchant-of-record or digital-download platform.
- Email: product alias/domain mailbox.
- Analytics: privacy-conscious, minimal analytics after launch.

### Interactive paid version
- Frontend: Lovable or existing Astro site.
- Auth/data: Supabase if persistent accounts/progress are needed.
- Payment: Stripe through an appropriate checkout stack or a merchant-of-record platform.
- Hosting: GitHub Pages for static surfaces or a server-capable platform for authenticated paid experiences.

## Commercial positioning

Avoid promising legal expertise, legal advice, guaranteed placement outcomes or an accredited credential. Position the product as professional learning and market-fluency training for recruiters entering U.S. legal recruiting.

Strong differentiator: evidence-first recruiter judgment. The source repeatedly teaches users to distinguish labels from evidence — e.g. job title vs actual work, resume claim vs verified ownership, stated motivation vs structural readiness. This can become the product's central mechanic: every mission asks the learner to choose the next evidence-producing action.

## Launch sequence

1. Publish free playable MVP.
2. Create product brand + support mailbox.
3. Run a factual/legal-content review for time-sensitive U.S. bar, compensation and market claims.
4. Produce the Field Guide package.
5. Connect checkout and delivery.
6. Test demand before building login-heavy features.
7. Build the six-path Operator Lab only after paid validation.

## Already implemented

Branch: `feat/legal-recruiter-lab-mvp`

Route: `/legal-recruiter-lab/`

Current MVP includes:
- dedicated product landing surface;
- learning-path framing;
- three playable scenario decisions;
- instant feedback and XP score;
- tiered product hypothesis;
- faceless-commerce boundary disclosure;
- explicit educational/not-legal-advice positioning;
- no live checkout yet, intentionally.

## Manual gates before taking money

- select product/brand name after trademark/domain screening;
- choose checkout platform and complete private KYC/tax setup;
- create Terms, Privacy, Refund and educational-disclaimer pages;
- perform current-facts review of legal-market content;
- choose final prices and refund policy;
- add support mailbox and customer-delivery workflow.

Nota de fluxo — Este documento transforma o ebook em uma hipótese de produto digital validável e registra a sequência mínima para lançar com baixo custo, mantendo a identidade pessoal fora do marketing sem confundir isso com anonimato perante plataformas de pagamento e autoridades fiscais.
