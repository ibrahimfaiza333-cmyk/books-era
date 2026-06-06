import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getAddresses as getAddressesApi,
    updateProfile as updateProfileApi,
    changePassword as changePasswordApi,
    addAddress as addAddressApi,
    deleteAddress as deleteAddressApi,
    setDefaultAddress as setDefaultAddressApi,
    type UpdateProfilePayload,
    type ChangePasswordPayload,
    type AddAddressPayload,
} from "../api/profile.api"
import { queryKeys } from "../lib/query-keys"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setCredentials } from "../store/slices/authSlice"

export function useProfile() {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const profile = useAppSelector((state) => state.auth.user)

    const addressesQuery = useQuery({
        queryKey: queryKeys.addresses,
        queryFn: getAddressesApi,
    })

    const invalidateAddresses = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.addresses })

    const updateProfile = async (payload: UpdateProfilePayload) => {
        const user = await updateProfileApi(payload)
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""
        dispatch(setCredentials({ user, token }))
        return user
    }

    const changePassword = async (payload: ChangePasswordPayload) => {
        await changePasswordApi(payload)
    }

    const addAddress = async (payload: AddAddressPayload) => {
        await addAddressApi(payload)
        await invalidateAddresses()
    }

    const deleteAddress = async (addressId: string) => {
        await deleteAddressApi(addressId)
        await invalidateAddresses()
    }

    const setDefaultAddress = async (addressId: string) => {
        await setDefaultAddressApi(addressId)
        await invalidateAddresses()
    }

    return {
        profile,
        addresses: addressesQuery.data,
        isLoadingAddresses: addressesQuery.isLoading,
        updateProfile,
        changePassword,
        addAddress,
        deleteAddress,
        setDefaultAddress,
    }
}
