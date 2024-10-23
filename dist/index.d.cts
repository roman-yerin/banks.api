import * as undici from 'undici';
import { RequestInfo, RequestInit } from 'undici';

declare function patchFetch(cert?: string | Buffer, key?: string | Buffer): (input: RequestInfo, init?: RequestInit) => Promise<undici.Response>;
declare function prePatchedFetch(): (input: RequestInfo, init?: RequestInit) => Promise<undici.Response>;

declare function getAuthURL$1(redirectUri: string, state: string): string;

declare function getAccessToken$1(redirectUri: string, authCode: string): Promise<string>;

declare function getCompanyInfo(accessToken: string): Promise<unknown>;

declare function createPayment(data: any): Promise<unknown>;

declare const index$1_createPayment: typeof createPayment;
declare const index$1_getCompanyInfo: typeof getCompanyInfo;
declare namespace index$1 {
  export { index$1_createPayment as createPayment, getAccessToken$1 as getAccessToken, getAuthURL$1 as getAuthURL, index$1_getCompanyInfo as getCompanyInfo };
}

declare function getAuthURL(redirectUri: string, state: string): string;

declare function getAccessToken(redirectUri: string, authCode: string): Promise<any>;

declare const index_getAccessToken: typeof getAccessToken;
declare const index_getAuthURL: typeof getAuthURL;
declare namespace index {
  export { index_getAccessToken as getAccessToken, index_getAuthURL as getAuthURL };
}

export { index$1 as Alfa, index as Modul, patchFetch, prePatchedFetch };
