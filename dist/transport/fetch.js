"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchFetch = patchFetch;
const https_1 = require("https");
const fs = require("fs");
const rootCA = process.env.HTTP_SSL_CA ?? "./transport/root_ca.crt";
const subCA = process.env.HTTP_SSL_SUB_CA ?? "./transport/sub_ca.crt";
function patchFetch(cert, key) {
    const ca = fs.readFileSync(rootCA);
    const sub = fs.readFileSync(subCA);
    return (input, init) => {
        const agent = new https_1.Agent({
            ca: ca,
            cert: cert,
            key: key,
        });
        const newInit = { ...init, ...{
                agent
            } };
        return fetch(input, init);
    };
}
