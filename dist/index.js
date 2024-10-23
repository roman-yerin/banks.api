var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/transport/fetch.ts
import { Agent, fetch as fetch2 } from "undici";
import * as fs from "fs";
var rootCA = process.env.HTTP_SSL_CA ?? "./src/transport/root_ca.crt";
var subCA = process.env.HTTP_SSL_SUB_CA ?? "./src/transport/sub_ca.crt";
function patchFetch(cert, key) {
  const ca = fs.readFileSync(rootCA);
  const sub = fs.readFileSync(subCA);
  return (input, init) => {
    const caString = ca.toString() + "\n" + sub.toString();
    const agent = new Agent({
      connect: {
        ca: caString,
        cert,
        key
      }
    });
    const newInit = { ...init, ...{
      dispatcher: agent
    } };
    return fetch2(input, newInit);
  };
}
function prePatchedFetch() {
  if (typeof process.env.HTTP_SSL_CERT === "undefined") {
    throw new Error("HTTP_SSL_CERT is not set");
  }
  if (typeof process.env.HTTP_SSL_KEY === "undefined") {
    throw new Error("HTTP_SSL_KEY is not set");
  }
  const cert = fs.readFileSync(process.env.HTTP_SSL_CERT);
  const key = fs.readFileSync(process.env.HTTP_SSL_KEY);
  return patchFetch(cert, key);
}

// src/alfa/index.ts
var alfa_exports = {};
__export(alfa_exports, {
  createPayment: () => createPayment,
  getAccessToken: () => getAccessToken,
  getAuthURL: () => getAuthURL,
  getCompanyInfo: () => getCompanyInfo
});

// src/alfa/id.ts
import * as dotenv from "dotenv";
dotenv.config();
var BASE_URL = process.env.ENV === "sandbox" ? "https://id-sandbox.alfabank.ru" : "https://id.alfabank.ru";
function getAuthURL(redirectUri, state) {
  if (typeof process.env.ALFA_CLIENT_ID === "undefined") {
    throw new Error("ALFA_CLIENT_ID is not set");
  }
  if (typeof process.env.ALFA_SCOPE === "undefined") {
    throw new Error("ALFA_SCOPE is not set");
  }
  let scope = process.env.ALFA_SCOPE.replaceAll(" ", "%20");
  let clientId = process.env.ALFA_CLIENT_ID;
  return `${BASE_URL}/oidc/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
}

// src/alfa/token.ts
import * as dotenv2 from "dotenv";
dotenv2.config();
var BASE_URL2 = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru";
var AlfaToken = class {
  fetch;
  clientId;
  clientSecret;
  tokenData;
  redirectUri;
  constructor(redirectUri) {
    if (typeof process.env.ALFA_CLIENT_ID === "undefined") {
      throw new Error("ALFA_CLIENT_ID is not set");
    }
    if (typeof process.env.ALFA_CLIENT_SECRET === "undefined") {
      throw new Error("ALFA_CLIENT_SECRET is not set");
    }
    this.clientId = process.env.ALFA_CLIENT_ID;
    this.clientSecret = process.env.ALFA_CLIENT_SECRET;
    this.fetch = prePatchedFetch();
    this.tokenData = {};
    this.redirectUri = redirectUri;
  }
  async get(authCode) {
    const url = `${BASE_URL2}/oidc/token`;
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: this.redirectUri
      })
    });
    if (response.status !== 200) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
    this.tokenData = await response.json();
    return;
  }
  get accessToken() {
    return this.tokenData.access_token ?? "";
  }
  get refreshToken() {
    return this.tokenData.refresh_token ?? "";
  }
};
async function getAccessToken(redirectUri, authCode) {
  const factory = new AlfaToken(redirectUri);
  await factory.get(authCode);
  return factory.tokenData.access_token;
}

// src/alfa/info.ts
var BASE_URL3 = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru";
async function getCompanyInfo(accessToken) {
  const fetch3 = prePatchedFetch();
  const response = await fetch3(`${BASE_URL3}/api/v2/customer-info`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  });
  if (response.status !== 200) {
    throw new Error(`Failed to get company info: ${response.statusText}`);
  }
  return response.json();
}

// src/alfa/payments.ts
var BASE_URL4 = process.env.ENV === "sandbox" ? "https://sandbox.alfabank.ru" : "https://baas.alfabank.ru";
async function createPayment(data) {
  const fetch3 = prePatchedFetch();
  const response = await fetch3(`${BASE_URL4}/api/jp/v2/payments`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: data
  });
  if (response.status !== 200) {
    throw new Error(`Failed to create payment: ${response.statusText}`);
  }
  return response.json();
}

// src/modul/index.ts
var modul_exports = {};
__export(modul_exports, {
  getAccessToken: () => getAccessToken2,
  getAuthURL: () => getAuthURL2
});

// src/modul/id.ts
import * as dotenv3 from "dotenv";
dotenv3.config();
var BASE_URL5 = "https://api.modulbank.ru/v1";
function getAuthURL2(redirectUri, state) {
  if (typeof process.env.MODUL_CLIENT_ID === "undefined") {
    throw new Error("MODUL_CLIENT_ID is not set");
  }
  if (typeof process.env.MODUL_SCOPE === "undefined") {
    throw new Error("MODUL_SCOPE is not set");
  }
  let scope = process.env.MODUL_SCOPE.replaceAll(" ", "%20");
  let clientId = process.env.MODUL_CLIENT_ID;
  return `${BASE_URL5}/oauth/authorize?clientId=${clientId}&redirectUri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}` + (process.env.ENV === "sandbox" ? "&sandbox=on" : "");
}

// src/modul/token.ts
async function getAccessToken2(redirectUri, authCode) {
  if (typeof process.env.MODUL_CLIENT_ID === "undefined") {
    throw new Error("MODUL_CLIENT_ID is not set");
  }
  if (typeof process.env.MODUL_CLIENT_SECRET === "undefined") {
    throw new Error("MODUL_CLIENT_SECRET is not set");
  }
  const clientId = process.env.MODUL_CLIENT_ID;
  const clientSecret = process.env.MODUL_CLIENT_SECRET;
  const url = "https://api.modulbank.ru/v1/oauth/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  };
  if (process.env.ENV === "sandbox") {
    headers["sandbox"] = "on";
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: new URLSearchParams({
      clientId,
      clientSecret,
      code: authCode
    })
  });
  if (response.status !== 200) {
    throw new Error(`Failed to get token: ${response.statusText}`);
  }
  const tokenData = await response.json();
  return tokenData.accessToken ?? "";
}
export {
  alfa_exports as Alfa,
  modul_exports as Modul,
  patchFetch,
  prePatchedFetch
};
