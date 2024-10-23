import { type RequestInfo, RequestInit } from "undici";
declare function patchFetch(cert?: string | Buffer, key?: string | Buffer): (input: RequestInfo, init?: RequestInit) => Promise<import("undici").Response>;
declare function prePatchedFetch(): (input: RequestInfo, init?: RequestInit) => Promise<import("undici").Response>;
export { patchFetch, prePatchedFetch };
