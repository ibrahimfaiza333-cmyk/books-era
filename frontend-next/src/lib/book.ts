/** Discount % from original vs sale price (0 when not on sale). */
export function getDiscountPercent(originalPrice: number, price: number): number {
    if (originalPrice <= 0 || price >= originalPrice) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
}
