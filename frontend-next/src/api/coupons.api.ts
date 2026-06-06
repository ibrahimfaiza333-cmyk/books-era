import client from "./client"

export const validateCoupon = async (code: string, orderAmount: number) => {
    const response = await client.post("/coupons/validate", { code, orderAmount })
    return response.data.data
}

export const getAdminCoupons = async () => {
    const response = await client.get("/coupons")
    return response.data.data
}

export const createCoupon = async (data: any) => {
    const response = await client.post("/coupons", data)
    return response.data.data
}

export const updateCoupon = async (id: string, data: any) => {
    const response = await client.patch(`/coupons/${id}`, data)
    return response.data.data
}

export const deleteCoupon = async (id: string) => {
    const response = await client.delete(`/coupons/${id}`)
    return response.data.data
}

export const toggleCouponStatus = async (id: string) => {
    const response = await client.patch(`/coupons/${id}/toggle`)
    return response.data.data
}
