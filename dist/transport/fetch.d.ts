declare function patchFetch(cert: string | Buffer, key: string | Buffer): (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
export { patchFetch };
