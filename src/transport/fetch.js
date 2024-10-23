"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchFetch = patchFetch;
var https_1 = require("https");
var fs = require("fs");
var rootCA = (_a = process.env.HTTP_SSL_CA) !== null && _a !== void 0 ? _a : "./transport/root_ca.crt";
var subCA = (_b = process.env.HTTP_SSL_SUB_CA) !== null && _b !== void 0 ? _b : "./transport/sub_ca.crt";
function patchFetch(cert, key) {
    var ca = fs.readFileSync(rootCA);
    var sub = fs.readFileSync(subCA);
    return function (input, init) {
        var agent = new https_1.Agent({
            ca: ca,
            cert: cert,
            key: key,
        });
        var newInit = __assign(__assign({}, init), {
            agent: agent
        });
        return fetch(input, init);
    };
}
