"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchFetch = patchFetch;
exports.prePatchedFetch = prePatchedFetch;
const undici_1 = require("undici");
const fs = require("fs");
const assert = require("node:assert");
const rootCA = process.env.HTTP_SSL_CA ?? "./src/transport/root_ca.crt";
const subCA = process.env.HTTP_SSL_SUB_CA ?? "./src/transport/sub_ca.crt";
function patchFetch(cert, key) {
    const ca = fs.readFileSync(rootCA);
    const sub = fs.readFileSync(subCA);
    return (input, init) => {
        const caString = ca.toString() + "\n" + sub.toString();
        const agent = new undici_1.Agent({
            connect: {
                ca: caString,
                cert: cert,
                key: key,
            }
        });
        const newInit = { ...init, ...{
                dispatcher: agent
            } };
        return (0, undici_1.fetch)(input, newInit);
    };
}
function prePatchedFetch() {
    assert(typeof (process.env.HTTP_SSL_CERT) !== 'undefined', "HTTP_SSL_CERT is not set");
    assert(typeof (process.env.HTTP_SSL_KEY) !== 'undefined', "HTTP_SSL_KEY is not set");
    const cert = fs.readFileSync(process.env.HTTP_SSL_CERT);
    const key = fs.readFileSync(process.env.HTTP_SSL_KEY);
    return patchFetch(cert, key);
}
