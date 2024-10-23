import { patchFetch, Alfa } from "../src"
import * as http from 'http'
import puppeteer from 'puppeteer'
import { uuidv4 } from "./tools"

let accessToken: string = ""
// describe("Alfa Secret", () => {
//     it("should have a client id", () => {
//         expect(process.env.ALFA_CLIENT_ID).toBeDefined()
//     })
//     it("should create an instance", () => {
//         const secret = new AlfaSecret()
//         expect(secret).toBeInstanceOf(AlfaSecret)
//     })
//     it("should fetch a secret", async () => {
//         const secret = new AlfaSecret()
//         const response = await secret.getSecret()
//         console.log(await response.json())
//         expect(response.status).toBe(200)
//     })
// })

describe("AlfaID", () => {

    it("should be able to open an auth page", async () => {
        const url = Alfa.getAuthURL("http://localhost", uuidv4())
        const response = await (patchFetch())(url)
        expect(response.status).toBe(200)
    })

})

describe("AlfaToken", () => {

    it("should not get access token if auth code is invalid", async () => {
        let token: string
        try {
            token = await Alfa.getAccessToken("http://localhost", "invalid")
        } catch (e) {
            token = ""
        }
        expect(token).toBe("")
    })

    it("should get access token if auth code is valid", () => {

        return new Promise<void>(async (resolve, reject) => {
            const browser = await puppeteer.launch({
                headless: true,
                acceptInsecureCerts: true,
            })
            const page = await browser.newPage()

            const server = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('Done\n')
            }).listen(80)

            const url = Alfa.getAuthURL("http://localhost", uuidv4())
            await page.goto(url)

            await page.locator('input[name="login"]').fill("SomeDifficultLogin")
            await page.locator('input[name="password"]').fill("1qaz!QAZ")
            await page.evaluate(() => {
                const btn = Array.from(document.querySelectorAll('button')).find(
                    (el) => el.textContent === 'Продолжить'
                )
                if (btn) btn.click()
            })
            await page.waitForNavigation()
            const inputs = await page.$$('input');
            for (const input of inputs) {
                await page.evaluate((element) => { element.value = '0'; }, input)
                await input.focus()
                await input.type('0')
            }
            await page.waitForNavigation()
            await page.waitForNavigation()
            await page.waitForNavigation()
            await page.waitForNavigation()
            const pageUrl = new URL(page.url())
            const code = pageUrl.searchParams.get("code")?.toString() ?? ""
            const state = pageUrl.searchParams.get("state")?.toString() ?? ""
            await browser.close()

            accessToken = await Alfa.getAccessToken("http://localhost", code)
            server.close()
            return resolve()
        })

    }, 20000)

    it("should fetch company info", async () => {
        const info = await Alfa.getCompanyInfo(accessToken)
        console.log(info)
        expect(info).toBeDefined()
    })

})