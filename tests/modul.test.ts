import { uuidv4 } from "./tools"
import { patchFetch, Modul } from "../src"
import * as http from "http"

describe("Modulbank OAuth", () => {

        it("should be able to open an auth page", async () => {
            const server = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('Done\n')
            }).listen(80)

            const url = Modul.getAuthURL("http://localhost", uuidv4())
            const response = await fetch(url)

            server.close()
            expect(response.status).toBe(200)
        })

        it("should not get access token if auth code is invalid", async () => {
            let token: string
            try {
                token = await Modul.getAccessToken("http://localhost", "invalid")
            } catch (e) {
                token = ""
            }
            expect(token).toBe("")
        })

        it("should get access token if auth code is valid", async () => {
            const authCode = "sandboxtempcode"
            const token = await Modul.getAccessToken("http://localhost", authCode)
            expect(token).not.toBe("")
        })
})