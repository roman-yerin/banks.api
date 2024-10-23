import { prePatchedFetch } from "@/transport/fetch"

const BASE_URL = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru"

async function createPayment(data: any) {
    const fetch = prePatchedFetch()
    const response = await fetch(`${BASE_URL}/api/jp/v2/payments`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: data
    })
    if(response.status !== 200) {
        throw new Error(`Failed to create payment: ${response.statusText}`)
    }
    return response.json()
}

export { createPayment }