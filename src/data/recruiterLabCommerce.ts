export type CheckoutMode = 'test' | 'live' | 'disabled';

export const recruiterLabCommerce = {
  provider: 'lemonsqueezy',
  mode: 'test' as CheckoutMode,
  checkoutUrl: 'https://recruitinglab.lemonsqueezy.com/checkout/buy/024bd629-dc0b-4d14-969a-cabbcdcca960',
  productName: 'Legal Recruiter Lab — Field Guide',
  priceLabel: 'R$119,99',
  deliveryLabel: 'Digital PDF delivery through the configured checkout provider',
  supportEmail: 'recruiter.lab.sales@gmail.com',
  liveSalesEnabled: false,
} as const;

export const checkoutCopy = recruiterLabCommerce.mode === 'live'
  ? {
      cta: 'Get the Field Guide ↗',
      status: 'LIVE CHECKOUT',
      note: 'Secure digital checkout.',
    }
  : recruiterLabCommerce.mode === 'test'
    ? {
        cta: 'Preview test checkout ↗',
        status: 'PRE-LAUNCH TEST MODE',
        note: 'Live purchases are not enabled.',
      }
    : {
        cta: 'Checkout unavailable',
        status: 'CHECKOUT PAUSED',
        note: 'Purchases are temporarily unavailable.',
      };

// Flow note — Switching payment providers should require changing this commerce configuration, not rewriting the customer-facing Recruiter Lab experience.
