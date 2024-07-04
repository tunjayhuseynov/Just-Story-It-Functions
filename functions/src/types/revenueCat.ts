export interface IPurchaseCustomer {
    entitlements: { [name: string]: IEntitlement },
}

interface IEntitlement {
    expires_date: string,
    grace_period_expires_date: null,
    product_identifier: string,
    purchase_date: string
}


export interface IPurchaseEvent {
    app_user_id: string,
    app_id: string,
    entitlement_ids: string[],
    presented_offering_id: string,
    expiration_reason?: string,
    product_id?: string
    cancel_reason?: string
    type: "CANCELLATION" | "EXPIRATION" | "INITIAL_PURCHASE" | "RENEWAL" | "PRODUCT_CHANGE" | "NON_RENEWING_PURCHASE"
}