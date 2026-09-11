# Capability Lab Relay — AI Handoff Contract v1

Status: EXPERIMENTAL / OWNER PILOT

## Objective

Allow ChatGPT, Gemini or another AI surface to hand a message to the Relay in one click without granting the AI authority over the WhatsApp destination.

## Canonical link

```text
https://lucas-mateus-hq.github.io/lucas-capability-os-pages/relay/#text=<percent-encoded UTF-8 message>
```

Backward-compatible packed form:

```text
https://lucas-mateus-hq.github.io/lucas-capability-os-pages/relay/#m=<base64url UTF-8 message>
```

## Authority boundary

The AI MAY provide:
- message text only.

The AI MUST NOT provide:
- phone or phoneNumber;
- number;
- recipient;
- destination;
- jid;
- chat;
- contact.

Any destination-like field in the fragment makes the handoff fail closed.

## Privacy properties

- message data is carried in the URL fragment, not in the query string;
- the browser removes the fragment immediately after the Relay reads it;
- the destination is decrypted locally only after the owner supplies the PIN;
- the final WhatsApp send remains manual;
- no plaintext phone is stored in source code or telemetry.

## Size limit

Maximum message length: 4,000 characters.

## Example

```text
/relay/#text=CAPLAB-RELAY-AI-PREFILL-TEST
```

The destination is still resolved only from the locally encrypted owner binding.

O que isso faz: define um contrato simples e auditável para levar texto de uma IA ao Relay em um clique sem permitir que a IA escolha ou substitua o destinatário do WhatsApp.
