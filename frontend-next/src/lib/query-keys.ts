export const queryKeys = {
    books: (
        search: string,
        category: string,
        language: string,
        sortBy: string,
        sortOrder: string,
        page: number
    ) => ["books", search, category, language, sortBy, sortOrder, page] as const,

    categories: ["categories"] as const,

    book: (id: string | undefined) => ["book", id] as const,

    reviews: (id: string | undefined) => ["reviews", id] as const,

    cart: ["cart"] as const,

    wishlist: ["wishlist"] as const,

    orders: (page: number) => ["orders", page] as const,
    ordersRoot: ["orders"] as const,

    order: (id: string | undefined) => ["order", id] as const,

    addresses: ["addresses"] as const,

    featuredBooks: ["featuredBooks"] as const,

    bestsellers: ["bestsellers"] as const,

    adminBooks: (search: string, page: number) =>
        ["adminBooks", search, page] as const,
    adminBooksRoot: ["adminBooks"] as const,

    adminOrders: (page: number, filterStatus: string) =>
        ["adminOrders", page, filterStatus] as const,
    adminOrdersRoot: ["adminOrders"] as const,

    adminUsers: (search: string, page: number) =>
        ["adminUsers", search, page] as const,
    adminUsersRoot: ["adminUsers"] as const,

    adminDashboard: ["adminDashboard"] as const,
} as const
