import * as dotenv from "dotenv"
import * as assert from "node:assert"

dotenv.config()

const BASE_URL = "https://api.modulbank.ru/v1"

function getAuthURL(redirectUri: string, state: string) {
    assert(typeof(process.env.MODUL_CLIENT_ID) !== 'undefined', "MODUL_CLIENT_ID is not set")
    assert(typeof(process.env.MODUL_SCOPE) !== 'undefined', "MODUL_SCOPE is not set")
    let scope = process.env.MODUL_SCOPE!.replaceAll(" ", "%20")
    let clientId = process.env.MODUL_CLIENT_ID!

    return `${BASE_URL}/oauth/authorize?clientId=${clientId}&redirectUri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
    + (process.env.ENV === "sandbox" ? "&sandbox=on" : "")
}

export { getAuthURL }