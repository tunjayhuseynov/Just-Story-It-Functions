import { GetStoryV2 } from './requests/story-v2';
import { DeleteDiscoveryStory, GenerateDiscoveryStory } from './requests/admin/discoveryStory';
import * as Story from "./requests/story";
// import * as TestStory from "./requests/test/story-v3-opensource";
import * as Sign from "./requests/sign";
import * as RC from "./requests/revenueCat";
import { deleteTriggerPlaylist, updateTriggerPlaylistToStory, updateTriggerStoryToPlaylist } from './requests/playlist';
import { SendVerificationLink, SendVerificationLinkOnSignup, SendVerificationLinkOnSignupWhenCreated } from './requests/email/verifyLink';
import { SendWelcomeCron } from './requests/email/welcome';
import { SendResetPassword } from './requests/email/resetPassword';
import { GetStoryV3 } from './requests/story-v3';
// import * as Migration from "./requests/migration";


// export const test = {
//     get: {
//         story: TestStory.GetStoryV3OpenSource
//     }
// }

export const get = {
    story: Story.GetStory,
    v2: {
        story: GetStoryV2
    },
    v3: {
        story: GetStoryV3,
    }
}

export const playlist = {
    trigger: {
        update: {
            story: updateTriggerPlaylistToStory,
            storyInPlaylist: updateTriggerStoryToPlaylist
        },
        delete: deleteTriggerPlaylist
    }
}

export const sign = {
    new: {
        user: Sign.SignNewUser
    }
}

export const convert = {
    new: {
        anonym: Sign.ConvertNewUserFromAnonym
    }
}

export const deletion = {
    user: Sign.DeleteUser
}

export const revenueCatSubscriptionEvent = RC.subscriptionEvent


export const admin = {
    generate: {
        discovery: {
            story: GenerateDiscoveryStory
        }
    },
    delete: {
        discovery: {
            story: DeleteDiscoveryStory
        }
    }
}

export const automated = {
    email: {
        verification: {
            call: SendVerificationLink,
            registration: SendVerificationLinkOnSignup,
            signupWithEmail: SendVerificationLinkOnSignupWhenCreated
        },
        reset: {
            password: SendResetPassword
        }
    }
}

export const SendWelcomeSchedule = SendWelcomeCron

// MIGRATION IN LOCAL ONLY

// export const SubscriptionPackageMigration = Migration.SubscriptionPackageMigration