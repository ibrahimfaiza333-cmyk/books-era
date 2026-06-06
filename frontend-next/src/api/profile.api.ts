import api, { unwrapData } from "./client"
import type { Address, User } from "../types"

export interface UpdateProfilePayload {
    fullName: string
    phone: string
    username: string
}

export interface ChangePasswordPayload {
    oldPassword: string
    newPassword: string
}

export interface AddAddressPayload {
    fullName: string
    phone: string
    street: string
    city: string
    province: string
    postalCode: string
    isDefault: boolean
    country: string
}

export async function getAddresses(): Promise<Address[]> {
    return unwrapData(api.get("/users/addresses"))
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
    return unwrapData(api.patch("/users/update-profile", payload))
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    await unwrapData(api.post("/users/change-password", payload))
}

export async function addAddress(payload: AddAddressPayload): Promise<void> {
    await unwrapData(api.post("/users/addresses", payload))
}

export async function deleteAddress(addressId: string): Promise<void> {
    await unwrapData(api.delete(`/users/addresses/${addressId}`))
}

export async function setDefaultAddress(addressId: string): Promise<void> {
    await unwrapData(api.patch(`/users/addresses/${addressId}/set-default`))
}
