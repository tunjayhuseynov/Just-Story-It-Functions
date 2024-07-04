

export type CollectionNames = "FunctionErrors" | "Playlist" | "Characters" | "SubscriptionPackages" | "Environments" | "StoryHistories" | "UserSubscriptionHistory" | "Stories" | "Users" | "General" | AdminCollections
export type AdminCollections = "DiscoveryStories"

export const Collections: { [name in CollectionNames]: CollectionNames } = {
    Characters: "Characters",
    Environments: "Environments",
    Stories: "Stories",
    StoryHistories: "StoryHistories",
    UserSubscriptionHistory: "UserSubscriptionHistory",
    Users: "Users",
    SubscriptionPackages: "SubscriptionPackages",
    General: "General",
    FunctionErrors: "FunctionErrors",
    DiscoveryStories: "DiscoveryStories",
    Playlist: "Playlist",
}