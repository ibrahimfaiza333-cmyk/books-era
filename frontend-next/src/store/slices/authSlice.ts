import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../../types"

interface AuthState {
    user:      User | null
    token:     string | null
    isLoggedIn: boolean
}

// Safe localStorage helper — returns null during SSR
const getStoredToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
}

const getStoredUser = (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

const initialState: AuthState = {
    user:      getStoredUser(),
    token:     getStoredToken(),
    isLoggedIn: !!getStoredToken()
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user       = action.payload.user
            state.token      = action.payload.token
            state.isLoggedIn = true
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", action.payload.token)
                localStorage.setItem("user", JSON.stringify(action.payload.user))
            }
        },
        logout: (state) => {
            state.user       = null
            state.token      = null
            state.isLoggedIn = false
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken")
                localStorage.removeItem("user")
            }
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer