import * as dotenv from "dotenv"
import * as assert from "node:assert"

dotenv.config()

const BASE_URL = process.env.ENV === "sandbox" ? "https://id-sandbox.alfabank.ru" : "https://id.alfabank.ru"

function getAuthURL(redirectUri: string, state: string) {
    assert(typeof(process.env.ALFA_CLIENT_ID) !== 'undefined', "ALFA_CLIENT_ID is not set")
    assert(typeof(process.env.ALFA_SCOPE) !== 'undefined', "ALFA_SCOPE is not set")
    let scope = process.env.ALFA_SCOPE!.replaceAll(" ", "%20")
    let clientId = process.env.ALFA_CLIENT_ID!

    return `${BASE_URL}/oidc/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
}


export { getAuthURL }