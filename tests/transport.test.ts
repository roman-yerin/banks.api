import { patchFetch } from "../src/transport/fetch"
import { Response } from "undici"

describe("fetch", () => {
    it("should return a function", () => {
        expect(patchFetch("", "")).toBeInstanceOf(Function)
    })

    it("should be able to call bank endpoint", async () => {
        const fetch = patchFetch("", "")
        const response = await fetch("https://id-sandbox.alfabank.ru")
        expect(response.status).toBe(404)
    })
})

