/** Default tier for new connected accounts */
const DEFAULT_ACCOUNT_TIER = 'Free';

/** Allowed accountTier values per provider (lowercase keys) */
const ACCOUNT_TIER_BY_PROVIDER = {
    twitter: ['Free', 'Basic', 'Premium', 'Premium Plus'],
    x: ['Free', 'Basic', 'Premium', 'Premium Plus']
};

function normalizeProvider(provider) {
    const p = String(provider || '').toLowerCase();
    return p === 'x' ? 'twitter' : p;
}

function getTierOptionsForProvider(provider) {
    const key = normalizeProvider(provider);
    return ACCOUNT_TIER_BY_PROVIDER[key] || [];
}

function isValidAccountTier(provider, tier) {
    const options = getTierOptionsForProvider(provider);
    if (!options.length) {
        return tier === DEFAULT_ACCOUNT_TIER;
    }
    return options.includes(tier);
}

module.exports = {
    DEFAULT_ACCOUNT_TIER,
    ACCOUNT_TIER_BY_PROVIDER,
    getTierOptionsForProvider,
    isValidAccountTier,
    normalizeProvider
};
