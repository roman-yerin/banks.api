import { prePatchedFetch } from "@/transport/fetch"
import * as dotenv from "dotenv"

dotenv.config()

const BASE_URL = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru"

class AlfaToken {
    fetch: Function
    clientId: string
    clientSecret: string
    tokenData: { access_token: string, refresh_token: string, expires_in: number, token_type: string, id_token: string }
    redirectUri: string
    constructor(redirectUri: string) {
        if(typeof(process.env.ALFA_CLIENT_ID) !== 'undefined'){ throw new Error("ALFA_CLIENT_ID is not set")}
        if(typeof(process.env.ALFA_CLIENT_SECRET) !== 'undefined'){ throw new Error("ALFA_CLIENT_SECRET is not set")}
        this.clientId = process.env.ALFA_CLIENT_ID!
        this.clientSecret = process.env.ALFA_CLIENT_SECRET!
        this.fetch = prePatchedFetch()
        this.tokenData = {} as { access_token: string, refresh_token: string, expires_in: number, token_type: string, id_token: string }
        this.redirectUri = redirectUri
    }

    async get(authCode: string) {
        const url = `${BASE_URL}/oidc/token`
        const response = await this.fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type:"authorization_code",
                code: authCode,
                redirect_uri: this.redirectUri
            })
        })
        if(response.status !== 200) {
            throw new Error(`Failed to get token: ${response.statusText}`)
        }
        this.tokenData = await response.json()
        return
    }
    get accessToken(){
        return this.tokenData.access_token ?? ""
    }

    get refreshToken(){
        return this.tokenData.refresh_token ?? ""
    }

}

async function getAccessToken(redirectUri: string, authCode: string) {
    const factory = new AlfaToken(redirectUri)
    await factory.get(authCode)
    return factory.tokenData.access_token
}

export { AlfaToken, getAccessToken }