import axios from "axios"
import { toast } from "react-toastify";

/** Returns a user-facing message from an API or unknown error. */
export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong"
): string {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        if (typeof message === "string") return message
    }
    return fallback
}

/** Standard API error toast (avoids repeated getApiErrorMessage + toast.error). */
export function toastApiError(error: unknown, fallback = "Something went wrong"): void {
    toast.error(getApiErrorMessage(error, fallback))
}
