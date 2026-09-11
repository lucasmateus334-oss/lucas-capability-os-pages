# Capability Evidence Protocol v0.1

A minimal public protocol for recording whether an AI-agent capability has actually been demonstrated with inspectable evidence.

## Goal

Separate a capability claim from the evidence required to support it.

The protocol is intentionally model-agnostic. It can be used with coding agents, research agents, browser agents, multimodal systems, local models, hosted models, or human-in-the-loop workflows.

## Core rule

**A successful execution is not sufficient for promotion.**

A capability becomes eligible for promotion only when:

1. the task and acceptance criteria are declared before evaluation;
2. execution evidence is captured;
3. the evidence can be independently inspected;
4. evaluation is separated from the executor;
5. the resulting receipt records outcome, provenance and limitations.

## Minimal receipt

Every receipt MUST contain:

- `protocol_version`
- `receipt_id`
- `capability_id`
- `task`
- `executor`
- `acceptance_criteria`
- `evidence`
- `evaluation`
- `promotion`
- `created_at`

## Evaluation states

- `pass`: acceptance criteria were met with inspectable evidence.
- `fail`: one or more acceptance criteria were not met.
- `inconclusive`: available evidence is insufficient to determine pass/fail.

## Promotion states

- `eligible`: evaluation passed and evidence/provenance requirements are satisfied.
- `blocked`: evaluation failed or required evidence is missing.
- `review_required`: technical evidence is sufficient but owner/governance approval is still required.

## Independence rule

The executor MUST NOT be the sole authority that promotes its own output. An evaluator MAY be another model, deterministic test suite, human reviewer, or combination of these.

## Evidence principle

Evidence should be machine-readable where possible and should favor reproducibility over narrative claims. Examples:

- test output
- artifact checksum
- commit SHA
- benchmark result
- screenshot reference
- generated file reference
- API response summary
- deterministic validation result

Secrets, private prompts, credentials and sensitive source material MUST NOT be included in public receipts.

## Example workflow

```text
Capability claim
      ↓
Declared task + acceptance criteria
      ↓
Agent execution
      ↓
Evidence capture
      ↓
Independent evaluation
      ↓
Capability receipt
      ↓
Promotion decision
```

## Files

- JSON Schema: `capability-evidence-receipt.schema.json`
- Example receipt: `examples/example-receipt.json`

## Status

Experimental specification. Feedback and interoperability experiments are encouraged before a stable v1.0.

This file is publicly inspectable. No reuse license has been granted yet; licensing will be defined separately before this artifact is presented as open source.

Nota de fluxo — Este protocolo transforma uma alegação de capacidade de agente em um registro verificável, separando execução, evidência, avaliação e promoção para reduzir autoaprovação e claims sem prova.
