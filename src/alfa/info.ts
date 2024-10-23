import {patchFetch, prePatchedFetch} from "@/transport/fetch"

const BASE_URL = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru"

async function getCompanyInfo(accessToken: string) {
    const fetch = prePatchedFetch()
    const response = await fetch(`${BASE_URL}/api/v2/customer-info`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        }
    })
    if(response.status !== 200) {
        throw new Error(`Failed to get company info: ${response.statusText}`)
    }
    return response.json()
}

export { getCompanyInfo }