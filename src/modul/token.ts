
async function getAccessToken(redirectUri: string, authCode: string) {
    if(typeof(process.env.MODUL_CLIENT_ID) === 'undefined'){ throw new Error("MODUL_CLIENT_ID is not set")}
    if(typeof(process.env.MODUL_CLIENT_SECRET) === 'undefined'){ throw new Error("MODUL_CLIENT_SECRET is not set")}

    const clientId = process.env.MODUL_CLIENT_ID!
    const clientSecret = process.env.MODUL_CLIENT_SECRET!
    const url = "https://api.modulbank.ru/v1/oauth/token"

    const headers: any = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    }
    if(process.env.ENV === "sandbox") {
        headers["sandbox"] = "on"
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: new URLSearchParams({
            clientId: clientId,
            clientSecret: clientSecret,
            code: authCode,
        })
    })
    if(response.status !== 200) {
        throw new Error(`Failed to get token: ${response.statusText}`)
    }
    const tokenData = await response.json()
    return tokenData.accessToken ?? ""
}

export { getAccessToken }