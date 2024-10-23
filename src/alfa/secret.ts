import { patchFetch } from "@/transport/fetch"
import * as dotenv from "dotenv"
import * as assert from "node:assert"
import * as fs from "fs"

dotenv.config()

const BASE_URL = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru"

class AlfaSecret {
    fetch: Function
    clientId: string
    constructor() {
        assert(typeof(process.env.HTTP_SSL_CERT) !== 'undefined', "HTTP_SSL_CERT is not set")
        assert(typeof(process.env.HTTP_SSL_KEY) !== 'undefined', "HTTP_SSL_KEY is not set")
        assert(typeof(process.env.ALFA_CLIENT_ID) !== 'undefined', "ALFA_CLIENT_ID is not set")
        this.clientId = process.env.ALFA_CLIENT_ID!
        const cert = fs.readFileSync(process.env.HTTP_SSL_CERT!)
        const key = fs.readFileSync(process.env.HTTP_SSL_KEY!)
        this.fetch = patchFetch(cert, key)
    }

    getSecret() {
        const url = `${BASE_URL}/oidc/clients/${this.clientId}/client-secret`
        return this.fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            }
        })
    }
}

export { AlfaSecret }