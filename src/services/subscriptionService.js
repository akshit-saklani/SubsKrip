const { SubscriptionRepository, SubscriptionBuilder } = require('../repositories/subscriptionRepository');

const subscriptionRepo = new SubscriptionRepository();

async function createSubscription(data) {
    const subscriptionObj = new SubscriptionBuilder()
        .setCustomerId(data.customer_id)
        .setPlanId(data.plan_id)
        .setStartDate(data.start_date)
        .setEndDate(data.end_date)
        .setStatus('active')
        .setAutoRenew(true)
        .setCreatedBy(data.created_by)
        .build();

    return await subscriptionRepo.create(subscriptionObj);
}

module.exports = { createSubscription };
