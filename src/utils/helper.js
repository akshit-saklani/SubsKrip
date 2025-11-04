exports.getCurrentUserInfo = async (req) => {
    if (req.user && req.user.id && req.user.orgId) {
        return {
            userId: req.user.id,
            organizationId: req.user.orgId
        };
    }

    // This case should be rare if 'protect' runs first, but acts as a safeguard
    return null;
};