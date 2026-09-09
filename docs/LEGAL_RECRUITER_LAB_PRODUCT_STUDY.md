# Legal Recruiter Lab — Product & Launch State

## Product thesis

**Legal Recruiter Lab** converts *Thinking Like a Legal Recruiter* from a passive ebook into a practical learning system for people entering U.S.-market legal recruiting.

The source material supports a six-path progression across market context, legal work, talent evaluation, search execution, closing, ethics, AI and a first-90-days operating plan. The commercial model should therefore sell **judgment and operating readiness**, not page count.

## Product ladder

### 1. Free practice mission
Three browser-based scenario decisions with instant feedback and XP. Purpose: demonstrate the evidence-first learning method before purchase.

### 2. Field Guide — entry product
**Price configured:** R$119.99, one-time.

Includes:
- 29-chapter digital guide
- exercises with suggested reasoning
- two master cases
- 18 operator tools / reference frameworks
- first-90-days progression
- PDF delivery through Lemon Squeezy

### 3. Operator Lab — next product
Planned interactive layer: additional scenario missions, scorecards, practice cases, progress tracking and a certificate of completion. Any completion credential must not be marketed as a professional certification.

### 4. 90-Day Sprint — later product
Planned application layer: implementation path, AI practice prompts and portfolio-ready capstone work.

## Positioning

Core principle: **Do not trust the label. Test the underlying evidence.**

The learning experience should repeatedly train users to:
- distinguish résumé language from proven work ownership;
- translate vague client demand into concrete search criteria;
- separate temporary frustration from durable candidate motivation;
- reduce ambiguity before forming conclusions;
- operate with ethical and job-related evidence.

## Public brand architecture

Public-facing identity: **Recruiter Lab** umbrella brand, with **Legal Recruiter Lab** as the first product line.

The legal-recruiting route must remain isolated from the personal Capability OS identity in customer-facing navigation. Founder identity, personal social channels and personal branding are not required for the public sales experience.

Payment processors, tax providers and other regulated services may still require the operator's legal identity privately for KYC and compliance.

## Current implementation

Branch: `feat/legal-recruiter-lab-mvp`

PR: `#6 — feat: Legal Recruiter Lab playable MVP`

Implemented:
- customer-facing sales page at `/legal-recruiter-lab/`;
- three playable practice scenarios with feedback and XP;
- six-path curriculum presentation;
- Field Guide offer at R$119.99;
- Lemon Squeezy Test Mode checkout connection;
- Privacy, Terms, Refunds, Support and Copyright pages;
- support contact configured as `recruiter.lab.sales@gmail.com`;
- buyer-facing navigation separated from Capability OS;
- policy/support links exposed in the sales-page footer;
- `noindex,nofollow` retained during pre-launch.

## Checkout validation completed

- Lemon Squeezy store created under Recruiter Lab;
- Field Guide product configured as an eBook;
- storefront exposure OFF;
- Test Mode checkout connected;
- test purchase succeeded;
- order creation succeeded;
- receipt succeeded;
- invoice generation succeeded;
- PDF attached to order and shown in fulfillment;
- actual file download cannot be validated in Test Mode because the platform disables test downloads.

## Remaining launch gates

1. Complete Lemon Squeezy store activation / KYC privately.
2. Wait for merchant approval if review is required.
3. Copy the Field Guide product to Live Mode.
4. Obtain the new Live checkout URL.
5. Replace the Test Mode URL and remove all test-mode messaging from the site.
6. Run final production build/CI and review the commercial page.
7. Change robots policy from `noindex,nofollow` to launch indexing only when ready.
8. Merge PR #6 to `main`.
9. Perform one controlled real purchase and verify final PDF delivery/download.
10. Keep a launch receipt with the production checkout, deployed commit and delivery validation.

## Risk controls

- Educational product; not legal advice.
- No professional-certification claim.
- No public collection of card data by the GitHub Pages site.
- Do not publish KYC documents, tax identifiers, bank details, passwords, API keys or authentication codes.
- Refund terms must preserve mandatory consumer rights where applicable.
- Privacy language must be revised if accounts, analytics, newsletters, community features or behavioral tracking are added.

---

Flow note — This document records the commercial architecture and launch gates for Recruiter Lab so the product can move from validated Test Mode to a controlled public launch without exposing private operator credentials or conflating completion with professional certification.
