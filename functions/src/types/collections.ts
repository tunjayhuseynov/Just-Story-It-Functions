

export type CollectionNames = "FunctionErrors" | "Characters" | "SubscriptionPackages" | "Environments" | "UserStoryHistories" | "UserSubscriptionHistory" | "Stories" | "Users" | "General"

export const Collections: { [name in CollectionNames]: CollectionNames } = {
    Characters: "Characters",
    Environments: "Environments",
    Stories: "Stories",
    UserStoryHistories: "UserStoryHistories",
    UserSubscriptionHistory: "UserSubscriptionHistory",
    Users: "Users",
    SubscriptionPackages: "SubscriptionPackages",
    General: "General",
    FunctionErrors: "FunctionErrors"
}