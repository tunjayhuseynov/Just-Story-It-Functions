import { GenerateDiscoveryStory } from './requests/admin/discoveryStory';
import * as Story from "./requests/story";
import * as Sign from "./requests/sign";
import * as RC from "./requests/revenueCat";
// import * as Migration from "./requests/migration";


export const get = {
    story: Story.GetStory
}

export const sign = {
    new: {
        user: Sign.SignNewUser
    }
}
export const deletion = {
    user: Sign.DeleteUser
}

export const revenue = {
    cat: {
        subscription: {
            event: RC.subscriptionEvent
        }
    }
}

export const admin = {
    generate: {
        discovery: {
            story: GenerateDiscoveryStory
        }
    }
}

// MIGRATION IN LOCAL ONLY

// export const SubscriptionPackageMigration = Migration.SubscriptionPackageMigration