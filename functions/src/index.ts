import * as Story from "./requests/story";
import * as Sign from "./requests/sign";
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


// MIGRATION IN LOCAL ONLY

// export const SubscriptionPackageMigration = Migration.SubscriptionPackageMigration