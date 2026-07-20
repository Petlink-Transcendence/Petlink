const EUR_PATTERN = /\beur\b/i;
const EUR_REPLACE_PATTERN = /\beur\b/gi;
const AMOUNT_PREFIX_PATTERN = /^(\d+(?:[.,]\d+)?(?:\s*(?:-|–|to)\s*\d+(?:[.,]\d+)?)?)(.*)$/i;

export function formatAvailabilityRate(rate: string) {
  const normalizedRate = rate.trim().replace(/\s+/g, ' ');

  if (!normalizedRate) {
    return '';
  }

  if (EUR_PATTERN.test(normalizedRate)) {
    return normalizedRate.replace(EUR_REPLACE_PATTERN, 'EUR');
  }

  const amountPrefix = normalizedRate.match(AMOUNT_PREFIX_PATTERN);

  if (!amountPrefix) {
    return normalizedRate;
  }

  const [, amount, detail] = amountPrefix;
  return `${amount} EUR${detail}`.trim();
}
