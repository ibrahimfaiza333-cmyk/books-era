import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query"
import {
    login as loginApi,
    register as registerApi,
    forgotPassword as forgotPasswordApi,
    resetPassword as resetPasswordApi,
    type LoginPayload,
    type RegisterPayload,
    type ForgotPasswordPayload,
    type ResetPasswordPayload,
} from "../api/auth.api"
import { useAppDispatch } from "../store/hooks"
import { setCredentials, logout as logoutAction } from "../store/slices/authSlice"
export function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useRouter()
    const queryClient = useQueryClient()

    const login = async (payload: LoginPayload) => {
        const result = await loginApi(payload)
        dispatch(setCredentials({
            user:  result.user,
            token: result.accessToken,
        }))
        return result
    }

    const register = async (payload: RegisterPayload) => {
        await registerApi(payload)
    }

    const forgotPassword = async (payload: ForgotPasswordPayload) => {
        await forgotPasswordApi(payload)
    }

    const resetPassword = async (token: string, payload: ResetPasswordPayload) => {
        await resetPasswordApi(token, payload)
    }

    const logout = () => {
        dispatch(logoutAction())
        queryClient.clear()
        navigate.push("/login")
    }

    return {
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
    }
}
