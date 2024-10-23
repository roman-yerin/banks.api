import { Agent, fetch } from "undici"
import { type RequestInfo, RequestInit } from "undici"
import * as fs from "fs"
import * as assert from "node:assert"

const rootCA = process.env.HTTP_SSL_CA ?? "./src/transport/root_ca.crt"
const subCA = process.env.HTTP_SSL_SUB_CA ?? "./src/transport/sub_ca.crt"

function patchFetch(cert?: string|Buffer, key?: string|Buffer) {
    const ca = fs.readFileSync(rootCA)
    const sub = fs.readFileSync(subCA)
    return (input: RequestInfo, init?: RequestInit) => {
        const caString = ca.toString() + "\n" + sub.toString()
        const agent = new Agent({
            connect: {
                ca: caString,
                cert: cert,
                key: key,
            }
        })
        const newInit = {...init, ...{
            dispatcher: agent
        }}
        return fetch(input, newInit)
    }
}

function prePatchedFetch() {
    assert(typeof(process.env.HTTP_SSL_CERT) !== 'undefined', "HTTP_SSL_CERT is not set")
    assert(typeof(process.env.HTTP_SSL_KEY) !== 'undefined', "HTTP_SSL_KEY is not set")
    const cert = fs.readFileSync(process.env.HTTP_SSL_CERT!)
    const key = fs.readFileSync(process.env.HTTP_SSL_KEY!)

    return patchFetch(cert, key)
}

export { patchFetch, prePatchedFetch }