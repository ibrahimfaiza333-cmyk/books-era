import api, { unwrapData } from "./client"
import type { User } from "../types"

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    user: User
    accessToken: string
}

export interface RegisterPayload {
    fullName: string
    username: string
    email: string
    phone: string
    password: string
    address: {
        street: string
        city: string
        province: string
        postalCode: string
        country: string
    }
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    newPassword: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    return unwrapData(api.post("/users/login", payload))
}

export async function register(payload: RegisterPayload): Promise<void> {
    await api.post("/users/register", payload)
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post("/users/forgot-password", payload)
}

export async function resetPassword(
    token: string,
    payload: ResetPasswordPayload
): Promise<void> {
    await api.post(`/users/reset-password/${token}`, payload)
}
