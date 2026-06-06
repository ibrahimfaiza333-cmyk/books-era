// src/types/index.ts
export interface User {
    _id: string
    fullName: string
    username: string
    email: string
    phone: string
    role: "user" | "admin"
    avatar: string
    isActive: boolean
    addresses: Address[]
    wishlist: string[]
}

export interface Address {
    _id: string
    fullName: string
    phone: string
    street: string
    city: string
    province: string
    postalCode?: string
    country: string
    isDefault: boolean
}

export interface Book {
    _id: string
    title: string
    description: string
    author: string
    publisher?: string
    category: Category
    thumbnail?: string
    coverImage?: string
    images: { url: string; publicId: string }[]
    price: number
    discountPrice: number
    stock: number
    pages?: number
    language: "English" | "Urdu" | "Other"
    isbn?: string
    slug: string
    ratingsAverage: number
    ratingsCount: number
    isFeatured: boolean
    isActive: boolean
    isBestseller: boolean
    createdAt: string
}

export interface Category {
    _id: string
    name: string
    slug: string
    description?: string
    image?: string
    parentCategory?: string
    isActive?: boolean
}

export interface CartItem {
    book: Book
    quantity: number
    price: number
}

export interface Cart {
    items: CartItem[]
    totalAmount: number
    totalItems: number
    deliveryCharges: number
    finalAmount: number
    isFreeDelivery: boolean
    freeDeliveryOn: number
}

export interface Order {
    _id: string
    orderNumber: string
    user: User
    items: OrderItem[]
    shippingAddress: Address
    totalAmount: number
    deliveryCharges: number
    finalAmount: number
    discount: number
    couponCode: string
    paymentMethod: "cod"
    paymentStatus: "pending" | "paid" | "failed" | "refunded"
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
    isPaid: boolean
    isDelivered: boolean
    note?: string
    cancelReason?: string
    createdAt: string
    updatedAt: string
}

export interface OrderItem {
    book: string
    quantity: number
    price: number
    title: string
    coverImage: string
}

export interface Review {
    _id: string
    user: User
    book: string
    rating: number
    comment: string
    isVerifiedPurchase: boolean
    createdAt: string
}

export interface Coupon {
    _id: string
    code: string
    discountType: "percentage" | "fixed"
    discountValue: number
    minOrderAmount: number
    maxDiscountAmount?: number
    expiryDate: string
    isActive: boolean
}

export interface ApiResponse<T> {
    success: boolean
    statusCode: number
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    totalPages: number
}