module.exports = [
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>getDate
]);
const getDate = (span, unit = "ms")=>{
    return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "s",
    ()=>safeJSONParse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
;
function safeJSONParse(data) {
    function reviver(_, value) {
        if (typeof value === "string") {
            const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
            if (iso8601Regex.test(value)) {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }
        return value;
    }
    try {
        if (typeof data !== "string") {
            return data;
        }
        return JSON.parse(data, reviver);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error("Error parsing JSON", {
            error: e
        });
        return null;
    }
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DR3R5wdU.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>getBaseURL,
    "b",
    ()=>getHost,
    "c",
    ()=>getProtocol,
    "g",
    ()=>getOrigin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
;
;
function checkHasPath(url) {
    try {
        const parsedUrl = new URL(url);
        const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
        return pathname !== "/";
    } catch (error) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"](`Invalid base URL: ${url}. Please provide a valid base URL.`);
    }
}
function withPath(url, path = "/api/auth") {
    const hasPath = checkHasPath(url);
    if (hasPath) {
        return url;
    }
    const trimmedUrl = url.replace(/\/+$/, "");
    if (!path || path === "/") {
        return trimmedUrl;
    }
    path = path.startsWith("/") ? path : `/${path}`;
    return `${trimmedUrl}${path}`;
}
function getBaseURL(url, path, request, loadEnv) {
    if (url) {
        return withPath(url, path);
    }
    if (loadEnv !== false) {
        const fromEnv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NUXT_PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NUXT_PUBLIC_AUTH_URL || (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BASE_URL !== "/" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BASE_URL : void 0);
        if (fromEnv) {
            return withPath(fromEnv, path);
        }
    }
    const fromRequest = request?.headers.get("x-forwarded-host");
    const fromRequestProto = request?.headers.get("x-forwarded-proto");
    if (fromRequest && fromRequestProto) {
        return withPath(`${fromRequestProto}://${fromRequest}`, path);
    }
    if (request) {
        const url2 = getOrigin(request.url);
        if (!url2) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Could not get origin from request. Please provide a valid base URL.");
        }
        return withPath(url2, path);
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return void 0;
}
function getOrigin(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.origin;
    } catch (error) {
        return null;
    }
}
function getProtocol(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol;
    } catch (error) {
        return null;
    }
}
function getHost(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.host;
    } catch (error) {
        return null;
    }
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Ih8C76Vo.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "p",
    ()=>parseSetCookieHeader,
    "s",
    ()=>setCookieToHeader
]);
function parseSetCookieHeader(setCookie) {
    const cookies = /* @__PURE__ */ new Map();
    const cookieArray = setCookie.split(", ");
    cookieArray.forEach((cookieString)=>{
        const parts = cookieString.split(";").map((part)=>part.trim());
        const [nameValue, ...attributes] = parts;
        const [name, ...valueParts] = (nameValue || "").split("=");
        const value = valueParts.join("=");
        if (!name || value === void 0) {
            return;
        }
        const attrObj = {
            value
        };
        attributes.forEach((attribute)=>{
            const [attrName, ...attrValueParts] = attribute.split("=");
            const attrValue = attrValueParts.join("=");
            const normalizedAttrName = attrName.trim().toLowerCase();
            switch(normalizedAttrName){
                case "max-age":
                    attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
                    break;
                case "expires":
                    attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
                    break;
                case "domain":
                    attrObj.domain = attrValue ? attrValue.trim() : void 0;
                    break;
                case "path":
                    attrObj.path = attrValue ? attrValue.trim() : void 0;
                    break;
                case "secure":
                    attrObj.secure = true;
                    break;
                case "httponly":
                    attrObj.httponly = true;
                    break;
                case "samesite":
                    attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
                    break;
                default:
                    attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
                    break;
            }
        });
        cookies.set(name, attrObj);
    });
    return cookies;
}
function setCookieToHeader(headers) {
    return (context)=>{
        const setCookieHeader = context.response.headers.get("set-cookie");
        if (!setCookieHeader) {
            return;
        }
        const cookieMap = /* @__PURE__ */ new Map();
        const existingCookiesHeader = headers.get("cookie") || "";
        existingCookiesHeader.split(";").forEach((cookie)=>{
            const [name, ...rest] = cookie.trim().split("=");
            if (name && rest.length > 0) {
                cookieMap.set(name, rest.join("="));
            }
        });
        const setCookieHeaders = setCookieHeader.split(",");
        setCookieHeaders.forEach((header)=>{
            const cookies = parseSetCookieHeader(header);
            cookies.forEach((value, name)=>{
                cookieMap.set(name, value.value);
            });
        });
        const updatedCookies = Array.from(cookieMap.entries()).map(([name, value])=>`${name}=${value}`).join("; ");
        headers.set("cookie", updatedCookies);
    };
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.D9_vQR83.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>setCookieCache,
    "b",
    ()=>getSessionCookie,
    "c",
    ()=>createCookieGetter,
    "d",
    ()=>deleteSessionCookie,
    "e",
    ()=>getCookieCache,
    "g",
    ()=>getCookies,
    "m",
    ()=>ms,
    "p",
    ()=>parseCookies,
    "s",
    ()=>setSessionCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DR3R5wdU.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Ih8C76Vo$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Ih8C76Vo.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
//#region src/index.ts
const s = 1e3;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
const mo = y / 12;
function ms(value, options) {
    if (typeof value === "string") return parse(value);
    else if (typeof value === "number") return format(value);
    throw new Error(`Value provided to ms() must be a string or number. value=${JSON.stringify(value)}`);
}
/**
* Parse the given string and return milliseconds.
*
* @param str - A string to parse to milliseconds
* @returns The parsed value in milliseconds, or `NaN` if the string can't be
* parsed
*/ function parse(str) {
    if (typeof str !== "string" || str.length === 0 || str.length > 100) throw new Error(`Value provided to ms.parse() must be a string with length between 1 and 99. value=${JSON.stringify(str)}`);
    const match = /^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.exec(str);
    if (!match?.groups) return NaN;
    const { value, unit = "ms" } = match.groups;
    const n = parseFloat(value);
    const matchUnit = unit.toLowerCase();
    /* istanbul ignore next - istanbul doesn't understand, but thankfully the TypeScript the exhaustiveness check in the default case keeps us type safe here */ switch(matchUnit){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return n * y;
        case "months":
        case "month":
        case "mo":
            return n * mo;
        case "weeks":
        case "week":
        case "w":
            return n * w;
        case "days":
        case "day":
        case "d":
            return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return n;
        default:
            throw new Error(`Unknown unit "${matchUnit}" provided to ms.parse(). value=${JSON.stringify(str)}`);
    }
}
/**
* Short format for `ms`.
*/ function fmtShort(ms$1) {
    const msAbs = Math.abs(ms$1);
    if (msAbs >= y) return `${Math.round(ms$1 / y)}y`;
    if (msAbs >= mo) return `${Math.round(ms$1 / mo)}mo`;
    if (msAbs >= w) return `${Math.round(ms$1 / w)}w`;
    if (msAbs >= d) return `${Math.round(ms$1 / d)}d`;
    if (msAbs >= h) return `${Math.round(ms$1 / h)}h`;
    if (msAbs >= m) return `${Math.round(ms$1 / m)}m`;
    if (msAbs >= s) return `${Math.round(ms$1 / s)}s`;
    return `${ms$1}ms`;
}
/**
* Format the given integer as a string.
*
* @param ms - milliseconds
* @param options - Options for the conversion
* @returns The formatted string
*/ function format(ms$1, options) {
    if (typeof ms$1 !== "number" || !Number.isFinite(ms$1)) throw new Error("Value provided to ms.format() must be of type number.");
    return fmtShort(ms$1);
}
function createCookieGetter(options) {
    const secure = options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : options.baseURL !== void 0 ? options.baseURL.startsWith("https://") ? true : false : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"];
    const secureCookiePrefix = secure ? "__Secure-" : "";
    const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
    const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (options.baseURL ? new URL(options.baseURL).hostname : void 0) : void 0;
    if (crossSubdomainEnabled && !domain) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("baseURL is required when crossSubdomainCookies are enabled");
    }
    function createCookie(cookieName, overrideAttributes = {}) {
        const prefix = options.advanced?.cookiePrefix || "better-auth";
        const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
        const attributes = options.advanced?.cookies?.[cookieName]?.attributes;
        return {
            name: `${secureCookiePrefix}${name}`,
            attributes: {
                secure: !!secureCookiePrefix,
                sameSite: "lax",
                path: "/",
                httpOnly: true,
                ...crossSubdomainEnabled ? {
                    domain
                } : {},
                ...options.advanced?.defaultCookieAttributes,
                ...overrideAttributes,
                ...attributes
            }
        };
    }
    return createCookie;
}
function getCookies(options) {
    const createCookie = createCookieGetter(options);
    const sessionMaxAge = options.session?.expiresIn || ms("7d") / 1e3;
    const sessionToken = createCookie("session_token", {
        maxAge: sessionMaxAge
    });
    const sessionData = createCookie("session_data", {
        maxAge: options.session?.cookieCache?.maxAge || 60 * 5
    });
    const dontRememberToken = createCookie("dont_remember");
    return {
        sessionToken: {
            name: sessionToken.name,
            options: sessionToken.attributes
        },
        /**
     * This cookie is used to store the session data in the cookie
     * This is useful for when you want to cache the session in the cookie
     */ sessionData: {
            name: sessionData.name,
            options: sessionData.attributes
        },
        dontRememberToken: {
            name: dontRememberToken.name,
            options: dontRememberToken.attributes
        }
    };
}
async function setCookieCache(ctx, session, dontRememberMe) {
    const shouldStoreSessionDataInCookie = ctx.context.options.session?.cookieCache?.enabled;
    if (shouldStoreSessionDataInCookie) {
        const filteredSession = Object.entries(session.session).reduce((acc, [key, value])=>{
            const fieldConfig = ctx.context.options.session?.additionalFields?.[key];
            if (!fieldConfig || fieldConfig.returned !== false) {
                acc[key] = value;
            }
            return acc;
        }, {});
        const sessionData = {
            session: filteredSession,
            user: session.user
        };
        const options = {
            ...ctx.context.authCookies.sessionData.options,
            maxAge: dontRememberMe ? void 0 : ctx.context.authCookies.sessionData.options.maxAge
        };
        const expiresAtDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options.maxAge || 60, "sec").getTime();
        const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].encode(JSON.stringify({
            session: sessionData,
            expiresAt: expiresAtDate,
            signature: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").sign(ctx.context.secret, JSON.stringify({
                ...sessionData,
                expiresAt: expiresAtDate
            }))
        }), {
            padding: false
        });
        if (data.length > 4093) {
            ctx.context?.logger?.error(`Session data exceeds cookie size limit (${data.length} bytes > 4093 bytes). Consider reducing session data size or disabling cookie cache. Session will not be cached in cookie.`);
            return;
        }
        ctx.setCookie(ctx.context.authCookies.sessionData.name, data, options);
    }
}
async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
    const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
    dontRememberMe = dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
    const options = ctx.context.authCookies.sessionToken.options;
    const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
    await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
        ...options,
        maxAge,
        ...overrides
    });
    if (dontRememberMe) {
        await ctx.setSignedCookie(ctx.context.authCookies.dontRememberToken.name, "true", ctx.context.secret, ctx.context.authCookies.dontRememberToken.options);
    }
    await setCookieCache(ctx, session, dontRememberMe);
    ctx.context.setNewSession(session);
    if (ctx.context.options.secondaryStorage) {
        await ctx.context.secondaryStorage?.set(session.session.token, JSON.stringify({
            user: session.user,
            session: session.session
        }), Math.floor((new Date(session.session.expiresAt).getTime() - Date.now()) / 1e3));
    }
}
function deleteSessionCookie(ctx, skipDontRememberMe) {
    ctx.setCookie(ctx.context.authCookies.sessionToken.name, "", {
        ...ctx.context.authCookies.sessionToken.options,
        maxAge: 0
    });
    ctx.setCookie(ctx.context.authCookies.sessionData.name, "", {
        ...ctx.context.authCookies.sessionData.options,
        maxAge: 0
    });
    if (!skipDontRememberMe) {
        ctx.setCookie(ctx.context.authCookies.dontRememberToken.name, "", {
            ...ctx.context.authCookies.dontRememberToken.options,
            maxAge: 0
        });
    }
}
function parseCookies(cookieHeader) {
    const cookies = cookieHeader.split("; ");
    const cookieMap = /* @__PURE__ */ new Map();
    cookies.forEach((cookie)=>{
        const [name, value] = cookie.split("=");
        cookieMap.set(name, value);
    });
    return cookieMap;
}
const getSessionCookie = (request, config)=>{
    if (config?.cookiePrefix) {
        if (config.cookieName) {
            config.cookiePrefix = `${config.cookiePrefix}-`;
        } else {
            config.cookiePrefix = `${config.cookiePrefix}.`;
        }
    }
    const headers = "headers" in request ? request.headers : request;
    const req = request instanceof Request ? request : void 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(req?.url, config?.path, req);
    const cookies = headers.get("cookie");
    if (!cookies) {
        return null;
    }
    const { cookieName = "session_token", cookiePrefix = "better-auth." } = config || {};
    const name = `${cookiePrefix}${cookieName}`;
    const secureCookieName = `__Secure-${name}`;
    const parsedCookie = parseCookies(cookies);
    const sessionToken = parsedCookie.get(name) || parsedCookie.get(secureCookieName);
    if (sessionToken) {
        return sessionToken;
    }
    return null;
};
const getCookieCache = async (request, config)=>{
    const headers = request instanceof Headers ? request : request.headers;
    const cookies = headers.get("cookie");
    if (!cookies) {
        return null;
    }
    const { cookieName = "session_data", cookiePrefix = "better-auth" } = config || {};
    const name = config?.isSecure !== void 0 ? config.isSecure ? `__Secure-${cookiePrefix}.${cookieName}` : `${cookiePrefix}.${cookieName}` : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"] ? `__Secure-${cookiePrefix}.${cookieName}` : `${cookiePrefix}.${cookieName}`;
    const parsedCookie = parseCookies(cookies);
    const sessionData = parsedCookie.get(name);
    if (sessionData) {
        const sessionDataPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["binary"].decode(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].decode(sessionData)));
        if (!sessionDataPayload) {
            return null;
        }
        const secret = config?.secret || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET;
        if (!secret) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("getCookieCache requires a secret to be provided. Either pass it as an option or set the BETTER_AUTH_SECRET environment variable");
        }
        const isValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").verify(secret, JSON.stringify({
            ...sessionDataPayload.session,
            expiresAt: sessionDataPayload.expiresAt
        }), sessionDataPayload.signature);
        if (!isValid) {
            return null;
        }
        return sessionDataPayload.session;
    }
    return null;
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DEBtROF9.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>getSession,
    "b",
    ()=>revokeSessions,
    "c",
    ()=>revokeSession,
    "d",
    ()=>getSessionQuerySchema,
    "e",
    ()=>sensitiveSessionMiddleware,
    "f",
    ()=>freshSessionMiddleware,
    "g",
    ()=>getSessionFromCtx,
    "h",
    ()=>requestOnlySessionMiddleware,
    "l",
    ()=>listSessions,
    "r",
    ()=>revokeOtherSessions,
    "s",
    ()=>sessionMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/middleware/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.D9_vQR83.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const getSessionQuerySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optional"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    /**
     * If cookie cache is enabled, it will disable the cache
     * and fetch the session from the database
     */ disableCookieCache: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].boolean().meta({
        description: "Disable cookie cache and fetch session from database"
    }).optional(),
    disableRefresh: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].boolean().meta({
        description: "Disable session refresh. Useful for checking session status, without updating the session"
    }).optional()
}));
const getSession = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/get-session", {
        method: "GET",
        query: getSessionQuerySchema,
        requireHeaders: true,
        metadata: {
            openapi: {
                description: "Get the current session",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        session: {
                                            $ref: "#/components/schemas/Session"
                                        },
                                        user: {
                                            $ref: "#/components/schemas/User"
                                        }
                                    },
                                    required: [
                                        "session",
                                        "user"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        try {
            const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
            if (!sessionCookieToken) {
                return null;
            }
            const sessionDataCookie = ctx.getCookie(ctx.context.authCookies.sessionData.name);
            const sessionDataPayload = sessionDataCookie ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["binary"].decode(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].decode(sessionDataCookie))) : null;
            if (sessionDataPayload) {
                const isValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").verify(ctx.context.secret, JSON.stringify({
                    ...sessionDataPayload.session,
                    expiresAt: sessionDataPayload.expiresAt
                }), sessionDataPayload.signature);
                if (!isValid) {
                    const dataCookie = ctx.context.authCookies.sessionData.name;
                    ctx.setCookie(dataCookie, "", {
                        maxAge: 0
                    });
                    return ctx.json(null);
                }
            }
            const dontRememberMe = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
            if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
                const session2 = sessionDataPayload.session;
                const hasExpired = sessionDataPayload.expiresAt < Date.now() || session2.session.expiresAt < /* @__PURE__ */ new Date();
                if (!hasExpired) {
                    ctx.context.session = session2;
                    return ctx.json(session2);
                } else {
                    const dataCookie = ctx.context.authCookies.sessionData.name;
                    ctx.setCookie(dataCookie, "", {
                        maxAge: 0
                    });
                }
            }
            const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
            ctx.context.session = session;
            if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["d"])(ctx);
                if (session) {
                    await ctx.context.internalAdapter.deleteSession(session.session.token);
                }
                return ctx.json(null);
            }
            if (dontRememberMe || ctx.query?.disableRefresh) {
                return ctx.json(session);
            }
            const expiresIn = ctx.context.sessionConfig.expiresIn;
            const updateAge = ctx.context.sessionConfig.updateAge;
            const sessionIsDueToBeUpdatedDate = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3;
            const shouldBeUpdated = sessionIsDueToBeUpdatedDate <= Date.now();
            if (shouldBeUpdated && (!ctx.query?.disableRefresh || !ctx.context.options.session?.disableSessionRefresh)) {
                const updatedSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
                    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx.context.sessionConfig.expiresIn, "sec"),
                    updatedAt: /* @__PURE__ */ new Date()
                });
                if (!updatedSession) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["d"])(ctx);
                    return ctx.json(null, {
                        status: 401
                    });
                }
                const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(ctx, {
                    session: updatedSession,
                    user: session.user
                }, false, {
                    maxAge
                });
                return ctx.json({
                    session: updatedSession,
                    user: session.user
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(ctx, session, !!dontRememberMe);
            return ctx.json(session);
        } catch (error) {
            ctx.context.logger.error("INTERNAL_SERVER_ERROR", error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_SESSION
            });
        }
    });
const getSessionFromCtx = async (ctx, config)=>{
    if (ctx.context.session) {
        return ctx.context.session;
    }
    const session = await getSession()({
        ...ctx,
        asResponse: false,
        headers: ctx.headers,
        returnHeaders: false,
        query: {
            ...config,
            ...ctx.query
        }
    }).catch((e)=>{
        return null;
    });
    ctx.context.session = session;
    return session;
};
const sessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    return {
        session
    };
});
const sensitiveSessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx, {
        disableCookieCache: true
    });
    if (!session?.session) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    return {
        session
    };
});
const requestOnlySessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session && (ctx.request || ctx.headers)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    return {
        session
    };
});
const freshSessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    if (ctx.context.sessionConfig.freshAge === 0) {
        return {
            session
        };
    }
    const freshAge = ctx.context.sessionConfig.freshAge;
    const lastUpdated = session.session.updatedAt?.valueOf() || session.session.createdAt.valueOf();
    const now = Date.now();
    const isFresh = now - lastUpdated < freshAge * 1e3;
    if (!isFresh) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
            message: "Session is not fresh"
        });
    }
    return {
        session
    };
});
const listSessions = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/list-sessions", {
        method: "GET",
        use: [
            sessionMiddleware
        ],
        requireHeaders: true,
        metadata: {
            openapi: {
                description: "List all active sessions for the user",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Session"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        try {
            const sessions = await ctx.context.internalAdapter.listSessions(ctx.context.session.user.id);
            const activeSessions = sessions.filter((session)=>{
                return session.expiresAt > /* @__PURE__ */ new Date();
            });
            return ctx.json(activeSessions);
        } catch (e) {
            ctx.context.logger.error(e);
            throw ctx.error("INTERNAL_SERVER_ERROR");
        }
    });
const revokeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-session", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        token: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to revoke"
        })
    }),
    use: [
        sensitiveSessionMiddleware
    ],
    requireHeaders: true,
    metadata: {
        openapi: {
            description: "Revoke a single session",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                token: {
                                    type: "string",
                                    description: "The token to revoke"
                                }
                            },
                            required: [
                                "token"
                            ]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if the session was revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const token = ctx.body.token;
    const findSession = await ctx.context.internalAdapter.findSession(token);
    if (!findSession) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
            message: "Session not found"
        });
    }
    if (findSession.session.userId !== ctx.context.session.user.id) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    try {
        await ctx.context.internalAdapter.deleteSession(token);
    } catch (error) {
        ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
        status: true
    });
});
const revokeSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-sessions", {
    method: "POST",
    use: [
        sensitiveSessionMiddleware
    ],
    requireHeaders: true,
    metadata: {
        openapi: {
            description: "Revoke all sessions for the user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if all sessions were revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    try {
        await ctx.context.internalAdapter.deleteSessions(ctx.context.session.user.id);
    } catch (error) {
        ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
        status: true
    });
});
const revokeOtherSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-other-sessions", {
    method: "POST",
    requireHeaders: true,
    use: [
        sensitiveSessionMiddleware
    ],
    metadata: {
        openapi: {
            description: "Revoke all other sessions for the user except the current one",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if all other sessions were revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const session = ctx.context.session;
    if (!session.user) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
    }
    const sessions = await ctx.context.internalAdapter.listSessions(session.user.id);
    const activeSessions = sessions.filter((session2)=>{
        return session2.expiresAt > /* @__PURE__ */ new Date();
    });
    const otherSessions = activeSessions.filter((session2)=>session2.token !== ctx.context.session.session.token);
    await Promise.all(otherSessions.map((session2)=>ctx.context.internalAdapter.deleteSession(session2.token)));
    return ctx.json({
        status: true
    });
});
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BUPPRXfK.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>generateId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
;
const generateId = (size)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRandomStringGenerator"])("a-z", "A-Z", "0-9")(size || 32);
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>generateRandomString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
;
const generateRandomString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRandomStringGenerator"])("a-z", "0-9", "A-Z", "-_");
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Cwj9dt6i.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>parseAccountOutput,
    "b",
    ()=>parseSessionOutput,
    "c",
    ()=>parseInputData,
    "d",
    ()=>parseUserInput,
    "e",
    ()=>parseAdditionalUserInput,
    "f",
    ()=>parseAccountInput,
    "g",
    ()=>parseSessionInput,
    "m",
    ()=>mergeSchema,
    "p",
    ()=>parseUserOutput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
;
const cache = /* @__PURE__ */ new WeakMap();
function parseOutputData(data, schema) {
    const fields = schema.fields;
    const parsedData = {};
    for(const key in data){
        const field = fields[key];
        if (!field) {
            parsedData[key] = data[key];
            continue;
        }
        if (field.returned === false) {
            continue;
        }
        parsedData[key] = data[key];
    }
    return parsedData;
}
function getAllFields(options, table) {
    if (!cache.has(options)) {
        cache.set(options, /* @__PURE__ */ new Map());
    }
    const tableCache = cache.get(options);
    if (tableCache.has(table)) {
        return tableCache.get(table);
    }
    let schema = {
        ...table === "user" ? options.user?.additionalFields : {},
        ...table === "session" ? options.session?.additionalFields : {}
    };
    for (const plugin of options.plugins || []){
        if (plugin.schema && plugin.schema[table]) {
            schema = {
                ...schema,
                ...plugin.schema[table].fields
            };
        }
    }
    cache.get(options).set(table, schema);
    return schema;
}
function parseUserOutput(options, user) {
    const schema = getAllFields(options, "user");
    return parseOutputData(user, {
        fields: schema
    });
}
function parseAccountOutput(options, account) {
    const schema = getAllFields(options, "account");
    return parseOutputData(account, {
        fields: schema
    });
}
function parseSessionOutput(options, session) {
    const schema = getAllFields(options, "session");
    return parseOutputData(session, {
        fields: schema
    });
}
function parseInputData(data, schema) {
    const action = schema.action || "create";
    const fields = schema.fields;
    const parsedData = Object.assign(/* @__PURE__ */ Object.create(null), null);
    for(const key in fields){
        if (key in data) {
            if (fields[key].input === false) {
                if (fields[key].defaultValue !== void 0) {
                    if (action !== "update") {
                        parsedData[key] = fields[key].defaultValue;
                        continue;
                    }
                }
                if (data[key]) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: `${key} is not allowed to be set`
                    });
                }
                continue;
            }
            if (fields[key].validator?.input && data[key] !== void 0) {
                parsedData[key] = fields[key].validator.input.parse(data[key]);
                continue;
            }
            if (fields[key].transform?.input && data[key] !== void 0) {
                parsedData[key] = fields[key].transform?.input(data[key]);
                continue;
            }
            parsedData[key] = data[key];
            continue;
        }
        if (fields[key].defaultValue !== void 0 && action === "create") {
            parsedData[key] = fields[key].defaultValue;
            continue;
        }
        if (fields[key].required && action === "create") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                message: `${key} is required`
            });
        }
    }
    return parsedData;
}
function parseUserInput(options, user = {}, action) {
    const schema = getAllFields(options, "user");
    return parseInputData(user, {
        fields: schema,
        action
    });
}
function parseAdditionalUserInput(options, user) {
    const schema = getAllFields(options, "user");
    return parseInputData(user || {}, {
        fields: schema
    });
}
function parseAccountInput(options, account) {
    const schema = getAllFields(options, "account");
    return parseInputData(account, {
        fields: schema
    });
}
function parseSessionInput(options, session) {
    const schema = getAllFields(options, "session");
    return parseInputData(session, {
        fields: schema
    });
}
function mergeSchema(schema, newSchema) {
    if (!newSchema) {
        return schema;
    }
    for(const table in newSchema){
        const newModelName = newSchema[table]?.modelName;
        if (newModelName) {
            schema[table].modelName = newModelName;
        }
        for(const field in schema[table].fields){
            const newField = newSchema[table]?.fields?.[field];
            if (!newField) {
                continue;
            }
            schema[table].fields[field].fieldName = newField;
        }
    }
    return schema;
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.ClH5r3NH.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>getIp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
;
function getIp(req, options) {
    if (options.advanced?.ipAddress?.disableIpTracking) {
        return null;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTest"])()) {
        return "127.0.0.1";
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDevelopment"])()) {
        return "127.0.0.1";
    }
    const headers = "headers" in req ? req.headers : req;
    const defaultHeaders = [
        "x-forwarded-for"
    ];
    const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || defaultHeaders;
    for (const key of ipHeaders){
        const value = "get" in headers ? headers.get(key) : headers[key];
        if (typeof value === "string") {
            const ip = value.split(",")[0].trim();
            if (isValidIP(ip)) {
                return ip;
            }
        }
    }
    return null;
}
function isValidIP(ip) {
    const ipv4 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ipv4().safeParse(ip);
    if (ipv4.success) {
        return true;
    }
    const ipv6 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ipv6().safeParse(ip);
    if (ipv6.success) {
        return true;
    }
    return false;
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.pQjeRkzN.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>getAuthTables
]);
const getAuthTables = (options)=>{
    const pluginSchema = (options.plugins ?? []).reduce((acc, plugin)=>{
        const schema = plugin.schema;
        if (!schema) return acc;
        for (const [key, value] of Object.entries(schema)){
            acc[key] = {
                fields: {
                    ...acc[key]?.fields,
                    ...value.fields
                },
                modelName: value.modelName || key
            };
        }
        return acc;
    }, {});
    const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
    const rateLimitTable = {
        rateLimit: {
            modelName: options.rateLimit?.modelName || "rateLimit",
            fields: {
                key: {
                    type: "string",
                    fieldName: options.rateLimit?.fields?.key || "key"
                },
                count: {
                    type: "number",
                    fieldName: options.rateLimit?.fields?.count || "count"
                },
                lastRequest: {
                    type: "number",
                    bigint: true,
                    fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest"
                }
            }
        }
    };
    const { user, session, account, ...pluginTables } = pluginSchema;
    const sessionTable = {
        session: {
            modelName: options.session?.modelName || "session",
            fields: {
                expiresAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.expiresAt || "expiresAt"
                },
                token: {
                    type: "string",
                    required: true,
                    fieldName: options.session?.fields?.token || "token",
                    unique: true
                },
                createdAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.createdAt || "createdAt",
                    defaultValue: ()=>/* @__PURE__ */ new Date()
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.updatedAt || "updatedAt",
                    onUpdate: ()=>/* @__PURE__ */ new Date()
                },
                ipAddress: {
                    type: "string",
                    required: false,
                    fieldName: options.session?.fields?.ipAddress || "ipAddress"
                },
                userAgent: {
                    type: "string",
                    required: false,
                    fieldName: options.session?.fields?.userAgent || "userAgent"
                },
                userId: {
                    type: "string",
                    fieldName: options.session?.fields?.userId || "userId",
                    references: {
                        model: options.user?.modelName || "user",
                        field: "id",
                        onDelete: "cascade"
                    },
                    required: true
                },
                ...session?.fields,
                ...options.session?.additionalFields
            },
            order: 2
        }
    };
    return {
        user: {
            modelName: options.user?.modelName || "user",
            fields: {
                name: {
                    type: "string",
                    required: true,
                    fieldName: options.user?.fields?.name || "name",
                    sortable: true
                },
                email: {
                    type: "string",
                    unique: true,
                    required: true,
                    fieldName: options.user?.fields?.email || "email",
                    sortable: true
                },
                emailVerified: {
                    type: "boolean",
                    defaultValue: false,
                    required: true,
                    fieldName: options.user?.fields?.emailVerified || "emailVerified",
                    input: false
                },
                image: {
                    type: "string",
                    required: false,
                    fieldName: options.user?.fields?.image || "image"
                },
                createdAt: {
                    type: "date",
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    required: true,
                    fieldName: options.user?.fields?.createdAt || "createdAt"
                },
                updatedAt: {
                    type: "date",
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    onUpdate: ()=>/* @__PURE__ */ new Date(),
                    required: true,
                    fieldName: options.user?.fields?.updatedAt || "updatedAt"
                },
                ...user?.fields,
                ...options.user?.additionalFields
            },
            order: 1
        },
        //only add session table if it's not stored in secondary storage
        ...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
        account: {
            modelName: options.account?.modelName || "account",
            fields: {
                accountId: {
                    type: "string",
                    required: true,
                    fieldName: options.account?.fields?.accountId || "accountId"
                },
                providerId: {
                    type: "string",
                    required: true,
                    fieldName: options.account?.fields?.providerId || "providerId"
                },
                userId: {
                    type: "string",
                    references: {
                        model: options.user?.modelName || "user",
                        field: "id",
                        onDelete: "cascade"
                    },
                    required: true,
                    fieldName: options.account?.fields?.userId || "userId"
                },
                accessToken: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.accessToken || "accessToken"
                },
                refreshToken: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.refreshToken || "refreshToken"
                },
                idToken: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.idToken || "idToken"
                },
                accessTokenExpiresAt: {
                    type: "date",
                    required: false,
                    fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
                },
                refreshTokenExpiresAt: {
                    type: "date",
                    required: false,
                    fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
                },
                scope: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.scope || "scope"
                },
                password: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.password || "password"
                },
                createdAt: {
                    type: "date",
                    required: true,
                    fieldName: options.account?.fields?.createdAt || "createdAt",
                    defaultValue: ()=>/* @__PURE__ */ new Date()
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    fieldName: options.account?.fields?.updatedAt || "updatedAt",
                    onUpdate: ()=>/* @__PURE__ */ new Date()
                },
                ...account?.fields,
                ...options.account?.additionalFields
            },
            order: 3
        },
        verification: {
            modelName: options.verification?.modelName || "verification",
            fields: {
                identifier: {
                    type: "string",
                    required: true,
                    fieldName: options.verification?.fields?.identifier || "identifier"
                },
                value: {
                    type: "string",
                    required: true,
                    fieldName: options.verification?.fields?.value || "value"
                },
                expiresAt: {
                    type: "date",
                    required: true,
                    fieldName: options.verification?.fields?.expiresAt || "expiresAt"
                },
                createdAt: {
                    type: "date",
                    required: true,
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    fieldName: options.verification?.fields?.createdAt || "createdAt"
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    onUpdate: ()=>/* @__PURE__ */ new Date(),
                    fieldName: options.verification?.fields?.updatedAt || "updatedAt"
                }
            },
            order: 4
        },
        ...pluginTables,
        ...shouldAddRateLimitTable ? rateLimitTable : {}
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.EBxKeVNZ.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>createAdapterFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.pQjeRkzN.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BUPPRXfK.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function withApplyDefault(value, field, action) {
    if (action === "update") {
        if (value === void 0 && field.onUpdate !== void 0) {
            if (typeof field.onUpdate === "function") {
                return field.onUpdate();
            }
            return field.onUpdate;
        }
        return value;
    }
    if (value === void 0 || value === null) {
        if (field.defaultValue !== void 0) {
            if (typeof field.defaultValue === "function") {
                return field.defaultValue();
            }
            return field.defaultValue;
        }
    }
    return value;
}
let debugLogs = [];
let transactionId = -1;
const createAsIsTransaction = (adapter)=>(fn)=>fn(adapter);
const createAdapterFactory = ({ adapter: customAdapter, config: cfg })=>(options)=>{
        const uniqueAdapterFactoryInstanceId = Math.random().toString(36).substring(2, 15);
        const config = {
            ...cfg,
            supportsBooleans: cfg.supportsBooleans ?? true,
            supportsDates: cfg.supportsDates ?? true,
            supportsJSON: cfg.supportsJSON ?? false,
            adapterName: cfg.adapterName ?? cfg.adapterId,
            supportsNumericIds: cfg.supportsNumericIds ?? true,
            transaction: cfg.transaction ?? false,
            disableTransformInput: cfg.disableTransformInput ?? false,
            disableTransformOutput: cfg.disableTransformOutput ?? false
        };
        if (options.advanced?.database?.useNumberId === true && config.supportsNumericIds === false) {
            throw new Error(`[${config.adapterName}] Your database or database adapter does not support numeric ids. Please disable "useNumberId" in your config.`);
        }
        const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options);
        const getDefaultFieldName = ({ field, model: unsafe_model })=>{
            if (field === "id" || field === "_id") {
                return "id";
            }
            const model = getDefaultModelName(unsafe_model);
            let f = schema[model]?.fields[field];
            if (!f) {
                const result = Object.entries(schema[model].fields).find(([_, f2])=>f2.fieldName === field);
                if (result) {
                    f = result[1];
                    field = result[0];
                }
            }
            if (!f) {
                debugLog(`Field ${field} not found in model ${model}`);
                debugLog(`Schema:`, schema);
                throw new Error(`Field ${field} not found in model ${model}`);
            }
            return field;
        };
        const getDefaultModelName = (model)=>{
            if (config.usePlural && model.charAt(model.length - 1) === "s") {
                let pluralessModel = model.slice(0, -1);
                let m2 = schema[pluralessModel] ? pluralessModel : void 0;
                if (!m2) {
                    m2 = Object.entries(schema).find(([_, f])=>f.modelName === pluralessModel)?.[0];
                }
                if (m2) {
                    return m2;
                }
            }
            let m = schema[model] ? model : void 0;
            if (!m) {
                m = Object.entries(schema).find(([_, f])=>f.modelName === model)?.[0];
            }
            if (!m) {
                debugLog(`Model "${model}" not found in schema`);
                debugLog(`Schema:`, schema);
                throw new Error(`Model "${model}" not found in schema`);
            }
            return m;
        };
        const getModelName = (model)=>{
            const defaultModelKey = getDefaultModelName(model);
            const usePlural = config && config.usePlural;
            const useCustomModelName = schema && schema[defaultModelKey] && schema[defaultModelKey].modelName !== model;
            if (useCustomModelName) {
                return usePlural ? `${schema[defaultModelKey].modelName}s` : schema[defaultModelKey].modelName;
            }
            return usePlural ? `${model}s` : model;
        };
        function getFieldName({ model: model_name, field: field_name }) {
            const model = getDefaultModelName(model_name);
            const field = getDefaultFieldName({
                model,
                field: field_name
            });
            return schema[model]?.fields[field]?.fieldName || field;
        }
        const debugLog = (...args)=>{
            if (config.debugLogs === true || typeof config.debugLogs === "object") {
                if (typeof config.debugLogs === "object" && "isRunningAdapterTests" in config.debugLogs) {
                    if (config.debugLogs.isRunningAdapterTests) {
                        args.shift();
                        debugLogs.push({
                            instance: uniqueAdapterFactoryInstanceId,
                            args
                        });
                    }
                    return;
                }
                if (typeof config.debugLogs === "object" && config.debugLogs.logCondition && !config.debugLogs.logCondition?.()) {
                    return;
                }
                if (typeof args[0] === "object" && "method" in args[0]) {
                    const method = args.shift().method;
                    if (typeof config.debugLogs === "object") {
                        if (method === "create" && !config.debugLogs.create) {
                            return;
                        } else if (method === "update" && !config.debugLogs.update) {
                            return;
                        } else if (method === "updateMany" && !config.debugLogs.updateMany) {
                            return;
                        } else if (method === "findOne" && !config.debugLogs.findOne) {
                            return;
                        } else if (method === "findMany" && !config.debugLogs.findMany) {
                            return;
                        } else if (method === "delete" && !config.debugLogs.delete) {
                            return;
                        } else if (method === "deleteMany" && !config.debugLogs.deleteMany) {
                            return;
                        } else if (method === "count" && !config.debugLogs.count) {
                            return;
                        }
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`[${config.adapterName}]`, ...args);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info(`[${config.adapterName}]`, ...args);
                }
            }
        };
        const idField = ({ customModelName, forceAllowId })=>{
            const shouldGenerateId = !config.disableIdGeneration && !options.advanced?.database?.useNumberId && !forceAllowId;
            const model = getDefaultModelName(customModelName ?? "id");
            return {
                type: options.advanced?.database?.useNumberId ? "number" : "string",
                required: shouldGenerateId ? true : false,
                ...shouldGenerateId ? {
                    defaultValue () {
                        if (config.disableIdGeneration) return void 0;
                        const useNumberId = options.advanced?.database?.useNumberId;
                        let generateId$1 = options.advanced?.database?.generateId;
                        if (options.advanced?.generateId !== void 0) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Your Better Auth config includes advanced.generateId which is deprecated. Please use advanced.database.generateId instead. This will be removed in future releases.");
                            generateId$1 = options.advanced?.generateId;
                        }
                        if (generateId$1 === false || useNumberId) return void 0;
                        if (generateId$1) {
                            return generateId$1({
                                model
                            });
                        }
                        if (config.customIdGenerator) {
                            return config.customIdGenerator({
                                model
                            });
                        }
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])();
                    }
                } : {}
            };
        };
        const getFieldAttributes = ({ model, field })=>{
            const defaultModelName = getDefaultModelName(model);
            const defaultFieldName = getDefaultFieldName({
                field,
                model: defaultModelName
            });
            const fields = schema[defaultModelName].fields;
            fields.id = idField({
                customModelName: defaultModelName
            });
            return fields[defaultFieldName];
        };
        const transformInput = async (data, defaultModelName, action, forceAllowId)=>{
            const transformedData = {};
            const fields = schema[defaultModelName].fields;
            const newMappedKeys = config.mapKeysTransformInput ?? {};
            if (!config.disableIdGeneration && !options.advanced?.database?.useNumberId) {
                fields.id = idField({
                    customModelName: defaultModelName,
                    forceAllowId: forceAllowId && "id" in data
                });
            }
            for(const field in fields){
                const value = data[field];
                const fieldAttributes = fields[field];
                let newFieldName = newMappedKeys[field] || fields[field].fieldName || field;
                if (value === void 0 && (fieldAttributes.defaultValue === void 0 && !fieldAttributes.transform?.input && !(action === "update" && fieldAttributes.onUpdate) || action === "update" && !fieldAttributes.onUpdate)) {
                    continue;
                }
                let newValue = withApplyDefault(value, fieldAttributes, action);
                if (fieldAttributes.transform?.input) {
                    newValue = await fieldAttributes.transform.input(newValue);
                }
                if (fieldAttributes.references?.field === "id" && options.advanced?.database?.useNumberId) {
                    if (Array.isArray(newValue)) {
                        newValue = newValue.map((x)=>x !== null ? Number(x) : null);
                    } else {
                        newValue = newValue !== null ? Number(newValue) : null;
                    }
                } else if (config.supportsJSON === false && typeof newValue === "object" && fieldAttributes.type === "json") {
                    newValue = JSON.stringify(newValue);
                } else if (config.supportsDates === false && newValue instanceof Date && fieldAttributes.type === "date") {
                    newValue = newValue.toISOString();
                } else if (config.supportsBooleans === false && typeof newValue === "boolean") {
                    newValue = newValue ? 1 : 0;
                }
                if (config.customTransformInput) {
                    newValue = config.customTransformInput({
                        data: newValue,
                        action,
                        field: newFieldName,
                        fieldAttributes,
                        model: defaultModelName,
                        schema,
                        options
                    });
                }
                if (newValue !== void 0) {
                    transformedData[newFieldName] = newValue;
                }
            }
            return transformedData;
        };
        const transformOutput = async (data, unsafe_model, select = [])=>{
            if (!data) return null;
            const newMappedKeys = config.mapKeysTransformOutput ?? {};
            const transformedData = {};
            const tableSchema = schema[unsafe_model].fields;
            const idKey = Object.entries(newMappedKeys).find(([_, v])=>v === "id")?.[0];
            tableSchema[idKey ?? "id"] = {
                type: options.advanced?.database?.useNumberId ? "number" : "string"
            };
            for(const key in tableSchema){
                if (select.length && !select.includes(key)) {
                    continue;
                }
                const field = tableSchema[key];
                if (field) {
                    const originalKey = field.fieldName || key;
                    let newValue = data[Object.entries(newMappedKeys).find(([_, v])=>v === originalKey)?.[0] || originalKey];
                    if (field.transform?.output) {
                        newValue = await field.transform.output(newValue);
                    }
                    let newFieldName = newMappedKeys[key] || key;
                    if (originalKey === "id" || field.references?.field === "id") {
                        if (typeof newValue !== "undefined" && newValue !== null) newValue = String(newValue);
                    } else if (config.supportsJSON === false && typeof newValue === "string" && field.type === "json") {
                        newValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(newValue);
                    } else if (config.supportsDates === false && typeof newValue === "string" && field.type === "date") {
                        newValue = new Date(newValue);
                    } else if (config.supportsBooleans === false && typeof newValue === "number" && field.type === "boolean") {
                        newValue = newValue === 1;
                    }
                    if (config.customTransformOutput) {
                        newValue = config.customTransformOutput({
                            data: newValue,
                            field: newFieldName,
                            fieldAttributes: field,
                            select,
                            model: unsafe_model,
                            schema,
                            options
                        });
                    }
                    transformedData[newFieldName] = newValue;
                }
            }
            return transformedData;
        };
        const transformWhereClause = ({ model, where })=>{
            if (!where) return void 0;
            const newMappedKeys = config.mapKeysTransformInput ?? {};
            return where.map((w)=>{
                const { field: unsafe_field, value, operator = "eq", connector = "AND" } = w;
                if (operator === "in") {
                    if (!Array.isArray(value)) {
                        throw new Error("Value must be an array");
                    }
                }
                const defaultModelName = getDefaultModelName(model);
                const defaultFieldName = getDefaultFieldName({
                    field: unsafe_field,
                    model
                });
                const fieldName = newMappedKeys[defaultFieldName] || getFieldName({
                    field: defaultFieldName,
                    model: defaultModelName
                });
                const fieldAttr = getFieldAttributes({
                    field: defaultFieldName,
                    model: defaultModelName
                });
                if (defaultFieldName === "id" || fieldAttr.references?.field === "id") {
                    if (options.advanced?.database?.useNumberId) {
                        if (Array.isArray(value)) {
                            return {
                                operator,
                                connector,
                                field: fieldName,
                                value: value.map(Number)
                            };
                        }
                        return {
                            operator,
                            connector,
                            field: fieldName,
                            value: Number(value)
                        };
                    }
                }
                return {
                    operator,
                    connector,
                    field: fieldName,
                    value
                };
            });
        };
        const adapterInstance = customAdapter({
            options,
            schema,
            debugLog,
            getFieldName,
            getModelName,
            getDefaultModelName,
            getDefaultFieldName,
            getFieldAttributes,
            transformInput,
            transformOutput,
            transformWhereClause
        });
        let lazyLoadTransaction = null;
        const adapter = {
            transaction: async (cb)=>{
                if (!lazyLoadTransaction) {
                    if (!config.transaction) {
                        if (typeof config.debugLogs === "object" && "isRunningAdapterTests" in config.debugLogs && config.debugLogs.isRunningAdapterTests) ;
                        else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`[${config.adapterName}] - Transactions are not supported. Executing operations sequentially.`);
                        }
                        lazyLoadTransaction = createAsIsTransaction(adapter);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].debug(`[${config.adapterName}] - Using provided transaction implementation.`);
                        lazyLoadTransaction = config.transaction;
                    }
                }
                return lazyLoadTransaction(cb);
            },
            create: async ({ data: unsafeData, model: unsafeModel, select, forceAllowId = false })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                unsafeModel = getDefaultModelName(unsafeModel);
                if ("id" in unsafeData && !forceAllowId) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn(`[${config.adapterName}] - You are trying to create a record with an id. This is not allowed as we handle id generation for you, unless you pass in the \`forceAllowId\` parameter. The id will be ignored.`);
                    const err = new Error();
                    const stack = err.stack?.split("\n").filter((_, i)=>i !== 1).join("\n").replace("Error:", "Create method with `id` being called at:");
                    console.log(stack);
                    unsafeData.id = void 0;
                }
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("create")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) {
                    data = await transformInput(unsafeData, unsafeModel, "create", forceAllowId);
                }
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const res = await adapterInstance.create({
                    data,
                    model
                });
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("create")} ${formatAction("DB Result")}:`, {
                    model,
                    res
                });
                let transformed = res;
                if (!config.disableTransformOutput) {
                    transformed = await transformOutput(res, unsafeModel, select);
                }
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            update: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                unsafeModel = getDefaultModelName(unsafeModel);
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("update")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) {
                    data = await transformInput(unsafeData, unsafeModel, "update");
                }
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const res = await adapterInstance.update({
                    model,
                    where,
                    update: data
                });
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("update")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) {
                    transformed = await transformOutput(res, unsafeModel);
                }
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            updateMany: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("updateMany")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) {
                    data = await transformInput(unsafeData, unsafeModel, "update");
                }
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const updatedCount = await adapterInstance.updateMany({
                    model,
                    where,
                    update: data
                });
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("updateMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: updatedCount
                });
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: updatedCount
                });
                return updatedCount;
            },
            findOne: async ({ model: unsafeModel, where: unsafeWhere, select })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findOne")}:`, {
                    model,
                    where,
                    select
                });
                const res = await adapterInstance.findOne({
                    model,
                    where,
                    select
                });
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findOne")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) {
                    transformed = await transformOutput(res, unsafeModel, select);
                }
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findOne")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            findMany: async ({ model: unsafeModel, where: unsafeWhere, limit: unsafeLimit, sortBy, offset })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const limit = unsafeLimit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findMany")}:`, {
                    model,
                    where,
                    limit,
                    sortBy,
                    offset
                });
                const res = await adapterInstance.findMany({
                    model,
                    where,
                    limit,
                    sortBy,
                    offset
                });
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) {
                    transformed = await Promise.all(res.map(async (r)=>await transformOutput(r, unsafeModel)));
                }
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findMany")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            delete: async ({ model: unsafeModel, where: unsafeWhere })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "delete"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("delete")}:`, {
                    model,
                    where
                });
                await adapterInstance.delete({
                    model,
                    where
                });
                debugLog({
                    method: "delete"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("delete")} ${formatAction("DB Result")}:`, {
                    model
                });
            },
            deleteMany: async ({ model: unsafeModel, where: unsafeWhere })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "deleteMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DeleteMany")}:`, {
                    model,
                    where
                });
                const res = await adapterInstance.deleteMany({
                    model,
                    where
                });
                debugLog({
                    method: "deleteMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                return res;
            },
            count: async ({ model: unsafeModel, where: unsafeWhere })=>{
                transactionId++;
                let thisTransactionId = transactionId;
                const model = getModelName(unsafeModel);
                const where = transformWhereClause({
                    model: unsafeModel,
                    where: unsafeWhere
                });
                unsafeModel = getDefaultModelName(unsafeModel);
                debugLog({
                    method: "count"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("count")}:`, {
                    model,
                    where
                });
                const res = await adapterInstance.count({
                    model,
                    where
                });
                debugLog({
                    method: "count"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("count")}:`, {
                    model,
                    data: res
                });
                return res;
            },
            createSchema: adapterInstance.createSchema ? async (_, file)=>{
                const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options);
                if (options.secondaryStorage && !options.session?.storeSessionInDatabase) {
                    delete tables.session;
                }
                if (options.rateLimit && options.rateLimit.storage === "database" && // rate-limit will default to enabled in production,
                // and given storage is database, it will try to use the rate-limit table,
                // so we should make sure to generate rate-limit table schema
                (typeof options.rateLimit.enabled === "undefined" || // and of course if they forcefully set to true, then they want rate-limit,
                // thus we should also generate rate-limit table schema
                options.rateLimit.enabled === true)) {
                    tables.ratelimit = {
                        modelName: options.rateLimit.modelName ?? "ratelimit",
                        fields: {
                            key: {
                                type: "string",
                                unique: true,
                                required: true,
                                fieldName: options.rateLimit.fields?.key ?? "key"
                            },
                            count: {
                                type: "number",
                                required: true,
                                fieldName: options.rateLimit.fields?.count ?? "count"
                            },
                            lastRequest: {
                                type: "number",
                                required: true,
                                bigint: true,
                                defaultValue: ()=>Date.now(),
                                fieldName: options.rateLimit.fields?.lastRequest ?? "lastRequest"
                            }
                        }
                    };
                }
                return adapterInstance.createSchema({
                    file,
                    tables
                });
            } : void 0,
            options: {
                adapterConfig: config,
                ...adapterInstance.options ?? {}
            },
            id: config.adapterId,
            // Secretly export values ONLY if this adapter has enabled adapter-test-debug-logs.
            // This would then be used during our adapter-tests to help print debug logs if a test fails.
            //@ts-expect-error - ^^
            ...config.debugLogs?.isRunningAdapterTests ? {
                adapterTestDebugLogs: {
                    resetDebugLogs () {
                        debugLogs = debugLogs.filter((log)=>log.instance !== uniqueAdapterFactoryInstanceId);
                    },
                    printDebugLogs () {
                        const separator = `\u2500`.repeat(80);
                        const logs = debugLogs.filter((log2)=>log2.instance === uniqueAdapterFactoryInstanceId);
                        if (logs.length === 0) {
                            return;
                        }
                        let log = logs.reverse().map((log2)=>{
                            log2.args[0] = `
${log2.args[0]}`;
                            return [
                                ...log2.args,
                                "\n"
                            ];
                        }).reduce((prev, curr)=>{
                            return [
                                ...curr,
                                ...prev
                            ];
                        }, [
                            `
${separator}`
                        ]);
                        console.log(...log);
                    }
                }
            } : {}
        };
        return adapter;
    };
function formatTransactionId(transactionId2) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getColorDepth"])() < 8) {
        return `#${transactionId2}`;
    }
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].fg.magenta}#${transactionId2}${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatStep(step, total) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].bg.black}${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].fg.yellow}[${step}/${total}]${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatMethod(method) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].bright}${method}${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatAction(action) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].dim}(${action})${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CBTS2OzX.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>createKyselyAdapter,
    "g",
    ()=>getKyselyDatabaseType,
    "k",
    ()=>kyselyAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$mysql$2f$mysql$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$postgres$2f$postgres$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$mssql$2f$mssql$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/dialect/mssql/mssql-dialect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$kysely$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/kysely.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$EBxKeVNZ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.EBxKeVNZ.mjs [app-route] (ecmascript)");
;
;
function getKyselyDatabaseType(db) {
    if (!db) {
        return null;
    }
    if ("dialect" in db) {
        return getKyselyDatabaseType(db.dialect);
    }
    if ("createDriver" in db) {
        if (db instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SqliteDialect"]) {
            return "sqlite";
        }
        if (db instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$mysql$2f$mysql$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MysqlDialect"]) {
            return "mysql";
        }
        if (db instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$postgres$2f$postgres$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostgresDialect"]) {
            return "postgres";
        }
        if (db instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$mssql$2f$mssql$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MssqlDialect"]) {
            return "mssql";
        }
    }
    if ("aggregate" in db) {
        return "sqlite";
    }
    if ("getConnection" in db) {
        return "mysql";
    }
    if ("connect" in db) {
        return "postgres";
    }
    if ("fileControl" in db) {
        return "sqlite";
    }
    if ("open" in db && "close" in db && "prepare" in db) {
        return "sqlite";
    }
    return null;
}
const createKyselyAdapter = async (config)=>{
    const db = config.database;
    if (!db) {
        return {
            kysely: null,
            databaseType: null,
            transaction: void 0
        };
    }
    if ("db" in db) {
        return {
            kysely: db.db,
            databaseType: db.type,
            transaction: db.transaction
        };
    }
    if ("dialect" in db) {
        return {
            kysely: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$kysely$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kysely"]({
                dialect: db.dialect
            }),
            databaseType: db.type,
            transaction: db.transaction
        };
    }
    let dialect = void 0;
    const databaseType = getKyselyDatabaseType(db);
    if ("createDriver" in db) {
        dialect = db;
    }
    if ("aggregate" in db && !("createSession" in db)) {
        dialect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$sqlite$2f$sqlite$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SqliteDialect"]({
            database: db
        });
    }
    if ("getConnection" in db) {
        dialect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$mysql$2f$mysql$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MysqlDialect"](db);
    }
    if ("connect" in db) {
        dialect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$dialect$2f$postgres$2f$postgres$2d$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostgresDialect"]({
            pool: db
        });
    }
    if ("fileControl" in db) {
        const { BunSqliteDialect } = await __turbopack_context__.A("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/chunks/bun-sqlite-dialect.mjs [app-route] (ecmascript, async loader)");
        dialect = new BunSqliteDialect({
            database: db
        });
    }
    if ("createSession" in db && ("TURBOPACK compile-time value", "undefined") === "undefined") {
        let DatabaseSync = void 0;
        try {
            let nodeSqlite = "node:sqlite";
            ({ DatabaseSync } = await import(/* @vite-ignore */ /* webpackIgnore: true */ nodeSqlite));
        } catch (error) {
            if (error !== null && typeof error === "object" && "code" in error && error.code !== "ERR_UNKNOWN_BUILTIN_MODULE") {
                throw error;
            }
        }
        if (DatabaseSync && db instanceof DatabaseSync) {
            const { NodeSqliteDialect } = await __turbopack_context__.A("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/chunks/node-sqlite-dialect.mjs [app-route] (ecmascript, async loader)");
            dialect = new NodeSqliteDialect({
                database: db
            });
        }
    }
    return {
        kysely: dialect ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$kysely$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kysely"]({
            dialect
        }) : null,
        databaseType,
        transaction: void 0
    };
};
const kyselyAdapter = (db, config)=>{
    let lazyOptions = null;
    const createCustomAdapter = (db2)=>{
        return ({ getFieldName, schema, getDefaultModelName })=>{
            const withReturning = async (values, builder, model, where)=>{
                let res;
                if (config?.type === "mysql") {
                    await builder.execute();
                    const field = values.id ? "id" : where.length > 0 && where[0]?.field ? where[0].field : "id";
                    if (!values.id && where.length === 0) {
                        res = await db2.selectFrom(model).selectAll().orderBy(getFieldName({
                            model,
                            field
                        }), "desc").limit(1).executeTakeFirst();
                        return res;
                    }
                    const value = values[field] || where[0]?.value;
                    res = await db2.selectFrom(model).selectAll().orderBy(getFieldName({
                        model,
                        field
                    }), "desc").where(getFieldName({
                        model,
                        field
                    }), "=", value).limit(1).executeTakeFirst();
                    return res;
                }
                if (config?.type === "mssql") {
                    res = await builder.outputAll("inserted").executeTakeFirst();
                    return res;
                }
                res = await builder.returningAll().executeTakeFirst();
                return res;
            };
            function transformValueToDB(value, model, field) {
                if (field === "id") {
                    return value;
                }
                const { type = "sqlite" } = config || {};
                let f = schema[model]?.fields[field];
                if (!f) {
                    f = Object.values(schema).find((f2)=>f2.modelName === model);
                }
                if (f.type === "boolean" && (type === "sqlite" || type === "mssql") && value !== null && value !== void 0) {
                    return value ? 1 : 0;
                }
                if (f.type === "date" && value && value instanceof Date) {
                    if (type === "sqlite") return value.toISOString();
                    return value;
                }
                return value;
            }
            function transformValueFromDB(value) {
                function transformObject(obj) {
                    for(const key in obj){
                        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                        const field = obj[key];
                        if (field instanceof Date && config?.type === "mysql") ;
                        else if (typeof field === "object" && field !== null) {
                            transformObject(field);
                        }
                    }
                }
                if (Array.isArray(value)) {
                    for(let i = 0; i < value.length; i++){
                        const item = value[i];
                        if (typeof item === "object" && item !== null) {
                            transformObject(item);
                        }
                    }
                } else if (typeof value === "object" && value !== null) {
                    transformObject(value);
                }
                return value;
            }
            function convertWhereClause(model, w) {
                if (!w) return {
                    and: null,
                    or: null
                };
                const conditions = {
                    and: [],
                    or: []
                };
                w.forEach((condition)=>{
                    let { field: _field, value, operator = "=", connector = "AND" } = condition;
                    const field = getFieldName({
                        model,
                        field: _field
                    });
                    value = transformValueToDB(value, model, _field);
                    const expr = (eb)=>{
                        if (operator.toLowerCase() === "in") {
                            return eb(field, "in", Array.isArray(value) ? value : [
                                value
                            ]);
                        }
                        if (operator.toLowerCase() === "not_in") {
                            return eb(field, "not in", Array.isArray(value) ? value : [
                                value
                            ]);
                        }
                        if (operator === "contains") {
                            return eb(field, "like", `%${value}%`);
                        }
                        if (operator === "starts_with") {
                            return eb(field, "like", `${value}%`);
                        }
                        if (operator === "ends_with") {
                            return eb(field, "like", `%${value}`);
                        }
                        if (operator === "eq") {
                            return eb(field, "=", value);
                        }
                        if (operator === "ne") {
                            return eb(field, "<>", value);
                        }
                        if (operator === "gt") {
                            return eb(field, ">", value);
                        }
                        if (operator === "gte") {
                            return eb(field, ">=", value);
                        }
                        if (operator === "lt") {
                            return eb(field, "<", value);
                        }
                        if (operator === "lte") {
                            return eb(field, "<=", value);
                        }
                        return eb(field, operator, value);
                    };
                    if (connector === "OR") {
                        conditions.or.push(expr);
                    } else {
                        conditions.and.push(expr);
                    }
                });
                return {
                    and: conditions.and.length ? conditions.and : null,
                    or: conditions.or.length ? conditions.or : null
                };
            }
            return {
                async create ({ data, model }) {
                    const builder = db2.insertInto(model).values(data);
                    const returned = await withReturning(data, builder, model, []);
                    return transformValueFromDB(returned);
                },
                async findOne ({ model, where, select }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.selectFrom(model).selectAll();
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    const res = await query.executeTakeFirst();
                    if (!res) return null;
                    return transformValueFromDB(res);
                },
                async findMany ({ model, where, limit, offset, sortBy }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.selectFrom(model);
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    if (config?.type === "mssql") {
                        if (!offset) {
                            query = query.top(limit || 100);
                        }
                    } else {
                        query = query.limit(limit || 100);
                    }
                    if (sortBy) {
                        query = query.orderBy(getFieldName({
                            model,
                            field: sortBy.field
                        }), sortBy.direction);
                    }
                    if (offset) {
                        if (config?.type === "mssql") {
                            if (!sortBy) {
                                query = query.orderBy(getFieldName({
                                    model,
                                    field: "id"
                                }));
                            }
                            query = query.offset(offset).fetch(limit || 100);
                        } else {
                            query = query.offset(offset);
                        }
                    }
                    const res = await query.selectAll().execute();
                    if (!res) return [];
                    return transformValueFromDB(res);
                },
                async update ({ model, where, update: values }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.updateTable(model).set(values);
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    return transformValueFromDB(await withReturning(values, query, model, where));
                },
                async updateMany ({ model, where, update: values }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.updateTable(model).set(values);
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    const res = await query.execute();
                    return res.length;
                },
                async count ({ model, where }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.selectFrom(model).select(db2.fn.count("id").as("count"));
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    const res = await query.execute();
                    if (typeof res[0].count === "number") {
                        return res[0].count;
                    }
                    if (typeof res[0].count === "bigint") {
                        return Number(res[0].count);
                    }
                    return parseInt(res[0].count);
                },
                async delete ({ model, where }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.deleteFrom(model);
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    await query.execute();
                },
                async deleteMany ({ model, where }) {
                    const { and, or } = convertWhereClause(model, where);
                    let query = db2.deleteFrom(model);
                    if (and) {
                        query = query.where((eb)=>eb.and(and.map((expr)=>expr(eb))));
                    }
                    if (or) {
                        query = query.where((eb)=>eb.or(or.map((expr)=>expr(eb))));
                    }
                    return (await query.execute()).length;
                },
                options: config
            };
        };
    };
    let adapterOptions = null;
    adapterOptions = {
        config: {
            adapterId: "kysely",
            adapterName: "Kysely Adapter",
            usePlural: config?.usePlural,
            debugLogs: config?.debugLogs,
            supportsBooleans: config?.type === "sqlite" || config?.type === "mssql" || config?.type === "mysql" || !config?.type ? false : true,
            supportsDates: config?.type === "sqlite" || config?.type === "mssql" || !config?.type ? false : true,
            supportsJSON: false,
            transaction: config?.transaction ?? false ? (cb)=>db.transaction().execute((trx)=>{
                    const adapter2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$EBxKeVNZ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])({
                        config: adapterOptions.config,
                        adapter: createCustomAdapter(trx)
                    })(lazyOptions);
                    return cb(adapter2);
                }) : false
        },
        adapter: createCustomAdapter(db)
    };
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$EBxKeVNZ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(adapterOptions);
    return (options)=>{
        lazyOptions = options;
        return adapter(options);
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BNpIwq4C.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "m",
    ()=>memoryAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$EBxKeVNZ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.EBxKeVNZ.mjs [app-route] (ecmascript)");
;
;
const memoryAdapter = (db, config)=>{
    let lazyOptions = null;
    let adapterCreator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$EBxKeVNZ$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])({
        config: {
            adapterId: "memory",
            adapterName: "Memory Adapter",
            usePlural: false,
            debugLogs: config?.debugLogs || false,
            customTransformInput (props) {
                if (props.options.advanced?.database?.useNumberId && props.field === "id" && props.action === "create") {
                    return db[props.model].length + 1;
                }
                return props.data;
            },
            transaction: async (cb)=>{
                let clone = structuredClone(db);
                try {
                    const r = await cb(adapterCreator(lazyOptions));
                    return r;
                } catch (error) {
                    Object.keys(db).forEach((key)=>{
                        db[key] = clone[key];
                    });
                    throw error;
                }
            }
        },
        adapter: ({ getFieldName, options, debugLog })=>{
            function convertWhereClause(where, model) {
                const table = db[model];
                if (!table) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error(`[MemoryAdapter] Model ${model} not found in the DB`, Object.keys(db));
                    throw new Error(`Model ${model} not found`);
                }
                const evalClause = (record, clause)=>{
                    const { field, value, operator } = clause;
                    switch(operator){
                        case "in":
                            if (!Array.isArray(value)) {
                                throw new Error("Value must be an array");
                            }
                            return value.includes(record[field]);
                        case "not_in":
                            if (!Array.isArray(value)) {
                                throw new Error("Value must be an array");
                            }
                            return !value.includes(record[field]);
                        case "contains":
                            return record[field].includes(value);
                        case "starts_with":
                            return record[field].startsWith(value);
                        case "ends_with":
                            return record[field].endsWith(value);
                        case "ne":
                            return record[field] !== value;
                        case "gt":
                            return value != null && Boolean(record[field] > value);
                        case "gte":
                            return value != null && Boolean(record[field] >= value);
                        case "lt":
                            return value != null && Boolean(record[field] < value);
                        case "lte":
                            return value != null && Boolean(record[field] <= value);
                        default:
                            return record[field] === value;
                    }
                };
                return table.filter((record)=>{
                    if (!where.length || where.length === 0) {
                        return true;
                    }
                    let result = evalClause(record, where[0]);
                    for (const clause of where){
                        const clauseResult = evalClause(record, clause);
                        if (clause.connector === "OR") {
                            result = result || clauseResult;
                        } else {
                            result = result && clauseResult;
                        }
                    }
                    return result;
                });
            }
            return {
                create: async ({ model, data })=>{
                    if (options.advanced?.database?.useNumberId) {
                        data.id = db[model].length + 1;
                    }
                    if (!db[model]) {
                        db[model] = [];
                    }
                    db[model].push(data);
                    return data;
                },
                findOne: async ({ model, where })=>{
                    const res = convertWhereClause(where, model);
                    const record = res[0] || null;
                    return record;
                },
                findMany: async ({ model, where, sortBy, limit, offset })=>{
                    let table = db[model];
                    if (where) {
                        table = convertWhereClause(where, model);
                    }
                    if (sortBy) {
                        table = table.sort((a, b)=>{
                            const field = getFieldName({
                                model,
                                field: sortBy.field
                            });
                            const aValue = a[field];
                            const bValue = b[field];
                            let comparison = 0;
                            if (aValue == null && bValue == null) {
                                comparison = 0;
                            } else if (aValue == null) {
                                comparison = -1;
                            } else if (bValue == null) {
                                comparison = 1;
                            } else if (typeof aValue === "string" && typeof bValue === "string") {
                                comparison = aValue.localeCompare(bValue);
                            } else if (aValue instanceof Date && bValue instanceof Date) {
                                comparison = aValue.getTime() - bValue.getTime();
                            } else if (typeof aValue === "number" && typeof bValue === "number") {
                                comparison = aValue - bValue;
                            } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
                                comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
                            } else {
                                comparison = String(aValue).localeCompare(String(bValue));
                            }
                            return sortBy.direction === "asc" ? comparison : -comparison;
                        });
                    }
                    if (offset !== void 0) {
                        table = table.slice(offset);
                    }
                    if (limit !== void 0) {
                        table = table.slice(0, limit);
                    }
                    return table || [];
                },
                count: async ({ model, where })=>{
                    if (where) {
                        const filteredRecords = convertWhereClause(where, model);
                        return filteredRecords.length;
                    }
                    return db[model].length;
                },
                update: async ({ model, where, update })=>{
                    const res = convertWhereClause(where, model);
                    res.forEach((record)=>{
                        Object.assign(record, update);
                    });
                    return res[0] || null;
                },
                delete: async ({ model, where })=>{
                    const table = db[model];
                    const res = convertWhereClause(where, model);
                    db[model] = table.filter((record)=>!res.includes(record));
                },
                deleteMany: async ({ model, where })=>{
                    const table = db[model];
                    const res = convertWhereClause(where, model);
                    let count = 0;
                    db[model] = table.filter((record)=>{
                        if (res.includes(record)) {
                            count++;
                            return false;
                        }
                        return !res.includes(record);
                    });
                    return count;
                },
                updateMany ({ model, where, update }) {
                    const res = convertWhereClause(where, model);
                    res.forEach((record)=>{
                        Object.assign(record, update);
                    });
                    return res[0] || null;
                }
            };
        }
    });
    return (options)=>{
        lazyOptions = options;
        return adapterCreator(options);
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BG42OQGC.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>getAdapter,
    "b",
    ()=>convertToDB,
    "c",
    ()=>createInternalAdapter,
    "d",
    ()=>convertFromDB,
    "e",
    ()=>getMigrations,
    "f",
    ()=>getSchema,
    "g",
    ()=>getWithHooks,
    "m",
    ()=>matchType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Cwj9dt6i.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$ClH5r3NH$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.ClH5r3NH.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BUPPRXfK.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.pQjeRkzN.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CBTS2OzX.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BNpIwq4C$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BNpIwq4C.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/kysely@0.28.8/node_modules/kysely/dist/esm/raw-builder/sql.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function getWithHooks(adapter, ctx) {
    const hooks = ctx.hooks;
    async function createWithHooks(data, model, customCreateFn, context, trxAdapter) {
        let actualData = data;
        for (const hook of hooks || []){
            const toRun = hook[model]?.create?.before;
            if (toRun) {
                const result = await toRun(actualData, context);
                if (result === false) {
                    return null;
                }
                const isObject = typeof result === "object" && "data" in result;
                if (isObject) {
                    actualData = {
                        ...actualData,
                        ...result.data
                    };
                }
            }
        }
        const customCreated = customCreateFn ? await customCreateFn.fn(actualData) : null;
        const created = !customCreateFn || customCreateFn.executeMainFn ? await (trxAdapter || adapter).create({
            model,
            data: actualData,
            forceAllowId: true
        }) : customCreated;
        for (const hook of hooks || []){
            const toRun = hook[model]?.create?.after;
            if (toRun) {
                await toRun(created, context);
            }
        }
        return created;
    }
    async function updateWithHooks(data, where, model, customUpdateFn, context, trxAdapter) {
        let actualData = data;
        for (const hook of hooks || []){
            const toRun = hook[model]?.update?.before;
            if (toRun) {
                const result = await toRun(data, context);
                if (result === false) {
                    return null;
                }
                const isObject = typeof result === "object";
                actualData = isObject ? result.data : result;
            }
        }
        const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
        const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (trxAdapter || adapter).update({
            model,
            update: actualData,
            where
        }) : customUpdated;
        for (const hook of hooks || []){
            const toRun = hook[model]?.update?.after;
            if (toRun) {
                await toRun(updated, context);
            }
        }
        return updated;
    }
    async function updateManyWithHooks(data, where, model, customUpdateFn, context, trxAdapter) {
        let actualData = data;
        for (const hook of hooks || []){
            const toRun = hook[model]?.update?.before;
            if (toRun) {
                const result = await toRun(data, context);
                if (result === false) {
                    return null;
                }
                const isObject = typeof result === "object";
                actualData = isObject ? result.data : result;
            }
        }
        const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
        const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (trxAdapter || adapter).updateMany({
            model,
            update: actualData,
            where
        }) : customUpdated;
        for (const hook of hooks || []){
            const toRun = hook[model]?.update?.after;
            if (toRun) {
                await toRun(updated, context);
            }
        }
        return updated;
    }
    return {
        createWithHooks,
        updateWithHooks,
        updateManyWithHooks
    };
}
const createInternalAdapter = (adapter, ctx)=>{
    const logger = ctx.logger;
    const options = ctx.options;
    const secondaryStorage = options.secondaryStorage;
    const sessionExpiration = options.session?.expiresIn || 60 * 60 * 24 * 7;
    const { createWithHooks, updateWithHooks, updateManyWithHooks } = getWithHooks(adapter, ctx);
    async function refreshUserSessions(user) {
        if (!secondaryStorage) return;
        const listRaw = await secondaryStorage.get(`active-sessions-${user.id}`);
        if (!listRaw) return;
        const now = Date.now();
        const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(listRaw) || [];
        const validSessions = list.filter((s)=>s.expiresAt > now);
        await Promise.all(validSessions.map(async ({ token })=>{
            const cached = await secondaryStorage.get(token);
            if (!cached) return;
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(cached);
            if (!parsed) return;
            const sessionTTL = Math.max(Math.floor(new Date(parsed.session.expiresAt).getTime() - now) / 1e3, 0);
            await secondaryStorage.set(token, JSON.stringify({
                session: parsed.session,
                user
            }), Math.floor(sessionTTL));
        }));
    }
    return {
        createOAuthUser: async (user, account, context)=>{
            return adapter.transaction(async (trxAdapter)=>{
                const createdUser = await createWithHooks({
                    // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date(),
                    ...user
                }, "user", void 0, context, trxAdapter);
                const createdAccount = await createWithHooks({
                    ...account,
                    userId: createdUser.id,
                    // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date()
                }, "account", void 0, context, trxAdapter);
                return {
                    user: createdUser,
                    account: createdAccount
                };
            });
        },
        createUser: async (user, context, trxAdapter)=>{
            const createdUser = await createWithHooks({
                // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...user,
                email: user.email?.toLowerCase()
            }, "user", void 0, context, trxAdapter);
            return createdUser;
        },
        createAccount: async (account, context, trxAdapter)=>{
            const createdAccount = await createWithHooks({
                // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...account
            }, "account", void 0, context, trxAdapter);
            return createdAccount;
        },
        listSessions: async (userId, trxAdapter)=>{
            if (secondaryStorage) {
                const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                if (!currentList) return [];
                const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(currentList) || [];
                const now = Date.now();
                const validSessions = list.filter((s)=>s.expiresAt > now);
                const sessions2 = [];
                for (const session of validSessions){
                    const sessionStringified = await secondaryStorage.get(session.token);
                    if (sessionStringified) {
                        const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(sessionStringified);
                        if (!s) return [];
                        const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["b"])(ctx.options, {
                            ...s.session,
                            expiresAt: new Date(s.session.expiresAt)
                        });
                        sessions2.push(parsedSession);
                    }
                }
                return sessions2;
            }
            const sessions = await (trxAdapter || adapter).findMany({
                model: "session",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
            return sessions;
        },
        listUsers: async (limit, offset, sortBy, where, trxAdapter)=>{
            const users = await (trxAdapter || adapter).findMany({
                model: "user",
                limit,
                offset,
                sortBy,
                where
            });
            return users;
        },
        countTotalUsers: async (where, trxAdapter)=>{
            const total = await (trxAdapter || adapter).count({
                model: "user",
                where
            });
            if (typeof total === "string") {
                return parseInt(total);
            }
            return total;
        },
        deleteUser: async (userId, trxAdapter)=>{
            if (secondaryStorage) {
                await secondaryStorage.delete(`active-sessions-${userId}`);
            }
            if (!secondaryStorage || options.session?.storeSessionInDatabase) {
                await (trxAdapter || adapter).deleteMany({
                    model: "session",
                    where: [
                        {
                            field: "userId",
                            value: userId
                        }
                    ]
                });
            }
            await (trxAdapter || adapter).deleteMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
            await (trxAdapter || adapter).delete({
                model: "user",
                where: [
                    {
                        field: "id",
                        value: userId
                    }
                ]
            });
        },
        createSession: async (userId, ctx2, dontRememberMe, override, overrideAll, trxAdapter)=>{
            const headers = ctx2.headers || ctx2.request?.headers;
            const { id: _, ...rest } = override || {};
            const data = {
                ipAddress: ctx2.request || ctx2.headers ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$ClH5r3NH$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx2.request || ctx2.headers, ctx2.context.options) || "" : "",
                userAgent: headers?.get("user-agent") || "",
                ...rest,
                /**
         * If the user doesn't want to be remembered
         * set the session to expire in 1 day.
         * The cookie will be set to expire at the end of the session
         */ expiresAt: dontRememberMe ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(60 * 60 * 24, "sec") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(sessionExpiration, "sec"),
                userId,
                token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32),
                // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...overrideAll ? rest : {}
            };
            const res = await createWithHooks(data, "session", secondaryStorage ? {
                fn: async (sessionData)=>{
                    const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                    let list = [];
                    const now = Date.now();
                    if (currentList) {
                        list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(currentList) || [];
                        list = list.filter((session)=>session.expiresAt > now);
                    }
                    const sorted = list.sort((a, b)=>a.expiresAt - b.expiresAt);
                    let furthestSessionExp = sorted.at(-1)?.expiresAt;
                    sorted.push({
                        token: data.token,
                        expiresAt: data.expiresAt.getTime()
                    });
                    if (!furthestSessionExp || furthestSessionExp < data.expiresAt.getTime()) {
                        furthestSessionExp = data.expiresAt.getTime();
                    }
                    const furthestSessionTTL = Math.max(Math.floor((furthestSessionExp - now) / 1e3), 0);
                    if (furthestSessionTTL > 0) {
                        await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(sorted), furthestSessionTTL);
                    }
                    const user = await adapter.findOne({
                        model: "user",
                        where: [
                            {
                                field: "id",
                                value: userId
                            }
                        ]
                    });
                    const sessionTTL = Math.max(Math.floor((data.expiresAt.getTime() - now) / 1e3), 0);
                    if (sessionTTL > 0) {
                        await secondaryStorage.set(data.token, JSON.stringify({
                            session: sessionData,
                            user
                        }), sessionTTL);
                    }
                    return sessionData;
                },
                executeMainFn: options.session?.storeSessionInDatabase
            } : void 0, ctx2, trxAdapter);
            return res;
        },
        findSession: async (token, trxAdapter)=>{
            if (secondaryStorage) {
                const sessionStringified = await secondaryStorage.get(token);
                if (!sessionStringified && !options.session?.storeSessionInDatabase) {
                    return null;
                }
                if (sessionStringified) {
                    const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(sessionStringified);
                    if (!s) return null;
                    const parsedSession2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["b"])(ctx.options, {
                        ...s.session,
                        expiresAt: new Date(s.session.expiresAt),
                        createdAt: new Date(s.session.createdAt),
                        updatedAt: new Date(s.session.updatedAt)
                    });
                    const parsedUser2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["p"])(ctx.options, {
                        ...s.user,
                        createdAt: new Date(s.user.createdAt),
                        updatedAt: new Date(s.user.updatedAt)
                    });
                    return {
                        session: parsedSession2,
                        user: parsedUser2
                    };
                }
            }
            const session = await (trxAdapter || adapter).findOne({
                model: "session",
                where: [
                    {
                        value: token,
                        field: "token"
                    }
                ]
            });
            if (!session) {
                return null;
            }
            const user = await (trxAdapter || adapter).findOne({
                model: "user",
                where: [
                    {
                        value: session.userId,
                        field: "id"
                    }
                ]
            });
            if (!user) {
                return null;
            }
            const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["b"])(ctx.options, session);
            const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["p"])(ctx.options, user);
            return {
                session: parsedSession,
                user: parsedUser
            };
        },
        findSessions: async (sessionTokens, trxAdapter)=>{
            if (secondaryStorage) {
                const sessions2 = [];
                for (const sessionToken of sessionTokens){
                    const sessionStringified = await secondaryStorage.get(sessionToken);
                    if (sessionStringified) {
                        const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(sessionStringified);
                        if (!s) return [];
                        const session = {
                            session: {
                                ...s.session,
                                expiresAt: new Date(s.session.expiresAt)
                            },
                            user: {
                                ...s.user,
                                createdAt: new Date(s.user.createdAt),
                                updatedAt: new Date(s.user.updatedAt)
                            }
                        };
                        sessions2.push(session);
                    }
                }
                return sessions2;
            }
            const sessions = await (trxAdapter || adapter).findMany({
                model: "session",
                where: [
                    {
                        field: "token",
                        value: sessionTokens,
                        operator: "in"
                    }
                ]
            });
            const userIds = sessions.map((session)=>{
                return session.userId;
            });
            if (!userIds.length) return [];
            const users = await (trxAdapter || adapter).findMany({
                model: "user",
                where: [
                    {
                        field: "id",
                        value: userIds,
                        operator: "in"
                    }
                ]
            });
            return sessions.map((session)=>{
                const user = users.find((u)=>u.id === session.userId);
                if (!user) return null;
                return {
                    session,
                    user
                };
            });
        },
        updateSession: async (sessionToken, session, context, trxAdapter)=>{
            const updatedSession = await updateWithHooks(session, [
                {
                    field: "token",
                    value: sessionToken
                }
            ], "session", secondaryStorage ? {
                async fn (data) {
                    const currentSession = await secondaryStorage.get(sessionToken);
                    let updatedSession2 = null;
                    if (currentSession) {
                        const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(currentSession);
                        if (!parsedSession) return null;
                        updatedSession2 = {
                            ...parsedSession.session,
                            ...data
                        };
                        return updatedSession2;
                    } else {
                        return null;
                    }
                },
                executeMainFn: options.session?.storeSessionInDatabase
            } : void 0, context, trxAdapter);
            return updatedSession;
        },
        deleteSession: async (token, trxAdapter)=>{
            if (secondaryStorage) {
                const data = await secondaryStorage.get(token);
                if (data) {
                    const { session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(data) ?? {};
                    if (!session) {
                        logger.error("Session not found in secondary storage");
                        return;
                    }
                    const userId = session.userId;
                    const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                    if (currentList) {
                        let list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(currentList) || [];
                        const now = Date.now();
                        const filtered = list.filter((session2)=>session2.expiresAt > now && session2.token !== token);
                        const sorted = filtered.sort((a, b)=>a.expiresAt - b.expiresAt);
                        const furthestSessionExp = sorted.at(-1)?.expiresAt;
                        if (filtered.length > 0 && furthestSessionExp && furthestSessionExp > Date.now()) {
                            await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(filtered), Math.floor((furthestSessionExp - now) / 1e3));
                        } else {
                            await secondaryStorage.delete(`active-sessions-${userId}`);
                        }
                    } else {
                        logger.error("Active sessions list not found in secondary storage");
                    }
                }
                await secondaryStorage.delete(token);
                if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) {
                    return;
                }
            }
            await (trxAdapter || adapter).delete({
                model: "session",
                where: [
                    {
                        field: "token",
                        value: token
                    }
                ]
            });
        },
        deleteAccounts: async (userId, trxAdapter)=>{
            await (trxAdapter || adapter).deleteMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
        },
        deleteAccount: async (accountId, trxAdapter)=>{
            await (trxAdapter || adapter).delete({
                model: "account",
                where: [
                    {
                        field: "id",
                        value: accountId
                    }
                ]
            });
        },
        deleteSessions: async (userIdOrSessionTokens, trxAdapter)=>{
            if (secondaryStorage) {
                if (typeof userIdOrSessionTokens === "string") {
                    const activeSession = await secondaryStorage.get(`active-sessions-${userIdOrSessionTokens}`);
                    const sessions = activeSession ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(activeSession) : [];
                    if (!sessions) return;
                    for (const session of sessions){
                        await secondaryStorage.delete(session.token);
                    }
                } else {
                    for (const sessionToken of userIdOrSessionTokens){
                        const session = await secondaryStorage.get(sessionToken);
                        if (session) {
                            await secondaryStorage.delete(sessionToken);
                        }
                    }
                }
                if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) {
                    return;
                }
            }
            await (trxAdapter || adapter).deleteMany({
                model: "session",
                where: [
                    {
                        field: Array.isArray(userIdOrSessionTokens) ? "token" : "userId",
                        value: userIdOrSessionTokens,
                        operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0
                    }
                ]
            });
        },
        findOAuthUser: async (email, accountId, providerId, trxAdapter)=>{
            const account = await (trxAdapter || adapter).findMany({
                model: "account",
                where: [
                    {
                        value: accountId,
                        field: "accountId"
                    }
                ]
            }).then((accounts)=>{
                return accounts.find((a)=>a.providerId === providerId);
            });
            if (account) {
                const user = await (trxAdapter || adapter).findOne({
                    model: "user",
                    where: [
                        {
                            value: account.userId,
                            field: "id"
                        }
                    ]
                });
                if (user) {
                    return {
                        user,
                        accounts: [
                            account
                        ]
                    };
                } else {
                    const user2 = await (trxAdapter || adapter).findOne({
                        model: "user",
                        where: [
                            {
                                value: email.toLowerCase(),
                                field: "email"
                            }
                        ]
                    });
                    if (user2) {
                        return {
                            user: user2,
                            accounts: [
                                account
                            ]
                        };
                    }
                    return null;
                }
            } else {
                const user = await (trxAdapter || adapter).findOne({
                    model: "user",
                    where: [
                        {
                            value: email.toLowerCase(),
                            field: "email"
                        }
                    ]
                });
                if (user) {
                    const accounts = await (trxAdapter || adapter).findMany({
                        model: "account",
                        where: [
                            {
                                value: user.id,
                                field: "userId"
                            }
                        ]
                    });
                    return {
                        user,
                        accounts: accounts || []
                    };
                } else {
                    return null;
                }
            }
        },
        findUserByEmail: async (email, options2, trxAdapter)=>{
            const user = await (trxAdapter || adapter).findOne({
                model: "user",
                where: [
                    {
                        value: email.toLowerCase(),
                        field: "email"
                    }
                ]
            });
            if (!user) return null;
            if (options2?.includeAccounts) {
                const accounts = await (trxAdapter || adapter).findMany({
                    model: "account",
                    where: [
                        {
                            value: user.id,
                            field: "userId"
                        }
                    ]
                });
                return {
                    user,
                    accounts
                };
            }
            return {
                user,
                accounts: []
            };
        },
        findUserById: async (userId, trxAdapter)=>{
            const user = await (trxAdapter || adapter).findOne({
                model: "user",
                where: [
                    {
                        field: "id",
                        value: userId
                    }
                ]
            });
            return user;
        },
        linkAccount: async (account, context, trxAdapter)=>{
            const _account = await createWithHooks({
                // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...account
            }, "account", void 0, context, trxAdapter);
            return _account;
        },
        updateUser: async (userId, data, context, trxAdapter)=>{
            const user = await updateWithHooks(data, [
                {
                    field: "id",
                    value: userId
                }
            ], "user", void 0, context, trxAdapter);
            await refreshUserSessions(user);
            await refreshUserSessions(user);
            return user;
        },
        updateUserByEmail: async (email, data, context, trxAdapter)=>{
            const user = await updateWithHooks(data, [
                {
                    field: "email",
                    value: email.toLowerCase()
                }
            ], "user", void 0, context, trxAdapter);
            await refreshUserSessions(user);
            await refreshUserSessions(user);
            return user;
        },
        updatePassword: async (userId, password, context, trxAdapter)=>{
            await updateManyWithHooks({
                password
            }, [
                {
                    field: "userId",
                    value: userId
                },
                {
                    field: "providerId",
                    value: "credential"
                }
            ], "account", void 0, context, trxAdapter);
        },
        findAccounts: async (userId, trxAdapter)=>{
            const accounts = await (trxAdapter || adapter).findMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
            return accounts;
        },
        findAccount: async (accountId, trxAdapter)=>{
            const account = await (trxAdapter || adapter).findOne({
                model: "account",
                where: [
                    {
                        field: "accountId",
                        value: accountId
                    }
                ]
            });
            return account;
        },
        findAccountByProviderId: async (accountId, providerId, trxAdapter)=>{
            const account = await (trxAdapter || adapter).findOne({
                model: "account",
                where: [
                    {
                        field: "accountId",
                        value: accountId
                    },
                    {
                        field: "providerId",
                        value: providerId
                    }
                ]
            });
            return account;
        },
        findAccountByUserId: async (userId, trxAdapter)=>{
            const account = await (trxAdapter || adapter).findMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
            return account;
        },
        updateAccount: async (id, data, context, trxAdapter)=>{
            const account = await updateWithHooks(data, [
                {
                    field: "id",
                    value: id
                }
            ], "account", void 0, context, trxAdapter);
            return account;
        },
        createVerificationValue: async (data, context, trxAdapter)=>{
            const verification = await createWithHooks({
                // todo: we should remove auto setting createdAt and updatedAt in the next major release, since the db generators already handle that
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...data
            }, "verification", void 0, context, trxAdapter);
            return verification;
        },
        findVerificationValue: async (identifier, trxAdapter)=>{
            const verification = await (trxAdapter || adapter).findMany({
                model: "verification",
                where: [
                    {
                        field: "identifier",
                        value: identifier
                    }
                ],
                sortBy: {
                    field: "createdAt",
                    direction: "desc"
                },
                limit: 1
            });
            if (!options.verification?.disableCleanup) {
                await (trxAdapter || adapter).deleteMany({
                    model: "verification",
                    where: [
                        {
                            field: "expiresAt",
                            value: /* @__PURE__ */ new Date(),
                            operator: "lt"
                        }
                    ]
                });
            }
            const lastVerification = verification[0];
            return lastVerification;
        },
        deleteVerificationValue: async (id, trxAdapter)=>{
            await (trxAdapter || adapter).delete({
                model: "verification",
                where: [
                    {
                        field: "id",
                        value: id
                    }
                ]
            });
        },
        deleteVerificationByIdentifier: async (identifier, trxAdapter)=>{
            await (trxAdapter || adapter).delete({
                model: "verification",
                where: [
                    {
                        field: "identifier",
                        value: identifier
                    }
                ]
            });
        },
        updateVerificationValue: async (id, data, context, trxAdapter)=>{
            const verification = await updateWithHooks(data, [
                {
                    field: "id",
                    value: id
                }
            ], "verification", void 0, context, trxAdapter);
            return verification;
        }
    };
};
async function getAdapter(options) {
    if (!options.database) {
        const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options);
        const memoryDB = Object.keys(tables).reduce((acc, key)=>{
            acc[key] = [];
            return acc;
        }, {});
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("No database configuration provided. Using memory adapter in development");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BNpIwq4C$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["m"])(memoryDB)(options);
    }
    if (typeof options.database === "function") {
        return options.database(options);
    }
    const { kysely, databaseType, transaction } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(options);
    if (!kysely) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Failed to initialize database adapter");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["k"])(kysely, {
        type: databaseType || "sqlite",
        debugLogs: "debugLogs" in options.database ? options.database.debugLogs : false,
        transaction
    })(options);
}
function convertToDB(fields, values) {
    let result = values.id ? {
        id: values.id
    } : {};
    for(const key in fields){
        const field = fields[key];
        const value = values[key];
        if (value === void 0) {
            continue;
        }
        result[field.fieldName || key] = value;
    }
    return result;
}
function convertFromDB(fields, values) {
    if (!values) {
        return null;
    }
    let result = {
        id: values.id
    };
    for (const [key, value] of Object.entries(fields)){
        result[key] = values[value.fieldName || key];
    }
    return result;
}
function getSchema(config) {
    const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(config);
    let schema = {};
    for(const key in tables){
        const table = tables[key];
        const fields = table.fields;
        let actualFields = {};
        Object.entries(fields).forEach(([key2, field])=>{
            actualFields[field.fieldName || key2] = field;
            if (field.references) {
                const refTable = tables[field.references.model];
                if (refTable) {
                    actualFields[field.fieldName || key2].references = {
                        ...field.references,
                        model: refTable.modelName,
                        field: field.references.field
                    };
                }
            }
        });
        if (schema[table.modelName]) {
            schema[table.modelName].fields = {
                ...schema[table.modelName].fields,
                ...actualFields
            };
            continue;
        }
        schema[table.modelName] = {
            fields: actualFields,
            order: table.order || Infinity
        };
    }
    return schema;
}
const postgresMap = {
    string: [
        "character varying",
        "varchar",
        "text"
    ],
    number: [
        "int4",
        "integer",
        "bigint",
        "smallint",
        "numeric",
        "real",
        "double precision"
    ],
    boolean: [
        "bool",
        "boolean"
    ],
    date: [
        "timestamptz",
        "timestamp",
        "date"
    ],
    json: [
        "json",
        "jsonb"
    ]
};
const mysqlMap = {
    string: [
        "varchar",
        "text"
    ],
    number: [
        "integer",
        "int",
        "bigint",
        "smallint",
        "decimal",
        "float",
        "double"
    ],
    boolean: [
        "boolean",
        "tinyint"
    ],
    date: [
        "timestamp",
        "datetime",
        "date"
    ],
    json: [
        "json"
    ]
};
const sqliteMap = {
    string: [
        "TEXT"
    ],
    number: [
        "INTEGER",
        "REAL"
    ],
    boolean: [
        "INTEGER",
        "BOOLEAN"
    ],
    // 0 or 1
    date: [
        "DATE",
        "INTEGER"
    ],
    json: [
        "TEXT"
    ]
};
const mssqlMap = {
    string: [
        "varchar",
        "nvarchar"
    ],
    number: [
        "int",
        "bigint",
        "smallint",
        "decimal",
        "float",
        "double"
    ],
    boolean: [
        "bit",
        "smallint"
    ],
    date: [
        "datetime2",
        "date",
        "datetime"
    ],
    json: [
        "varchar",
        "nvarchar"
    ]
};
const map = {
    postgres: postgresMap,
    mysql: mysqlMap,
    sqlite: sqliteMap,
    mssql: mssqlMap
};
function matchType(columnDataType, fieldType, dbType) {
    function normalize(type) {
        return type.toLowerCase().split("(")[0].trim();
    }
    if (fieldType === "string[]" || fieldType === "number[]") {
        return columnDataType.toLowerCase().includes("json");
    }
    const types = map[dbType];
    const expected = Array.isArray(fieldType) ? types["string"].map((t)=>t.toLowerCase()) : types[fieldType].map((t)=>t.toLowerCase());
    return expected.includes(normalize(columnDataType));
}
async function getPostgresSchema(db) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`SHOW search_path`.execute(db);
        if (result.rows[0]?.search_path) {
            const schemas = result.rows[0].search_path.split(",").map((s)=>s.trim()).map((s)=>s.replace(/^["']|["']$/g, "")).filter((s)=>!s.startsWith("$"));
            return schemas[0] || "public";
        }
    } catch (error) {}
    return "public";
}
async function getMigrations(config) {
    const betterAuthSchema = getSchema(config);
    const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLogger"])(config.logger);
    let { kysely: db, databaseType: dbType } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(config);
    if (!dbType) {
        logger.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
        dbType = "sqlite";
    }
    if (!db) {
        logger.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
        process.exit(1);
    }
    let currentSchema = "public";
    if (dbType === "postgres") {
        currentSchema = await getPostgresSchema(db);
        logger.debug(`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`);
        try {
            const schemaCheck = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT schema_name 
				FROM information_schema.schemata 
				WHERE schema_name = ${currentSchema}
			`.execute(db);
            if (!schemaCheck.rows[0]) {
                logger.warn(`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`);
            }
        } catch (error) {
            logger.debug(`Could not verify schema existence: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const allTableMetadata = await db.introspection.getTables();
    let tableMetadata = allTableMetadata;
    if (dbType === "postgres") {
        try {
            const tablesInSchema = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db);
            const tableNamesInSchema = new Set(tablesInSchema.rows.map((row)=>row.table_name));
            tableMetadata = allTableMetadata.filter((table)=>table.schema === currentSchema && tableNamesInSchema.has(table.name));
            logger.debug(`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t)=>t.name).join(", ") || "(none)"}`);
        } catch (error) {
            logger.warn(`Could not filter tables by schema. Using all discovered tables. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const toBeCreated = [];
    const toBeAdded = [];
    for (const [key, value] of Object.entries(betterAuthSchema)){
        const table = tableMetadata.find((t)=>t.name === key);
        if (!table) {
            const tIndex = toBeCreated.findIndex((t)=>t.table === key);
            const tableData = {
                table: key,
                fields: value.fields,
                order: value.order || Infinity
            };
            const insertIndex = toBeCreated.findIndex((t)=>(t.order || Infinity) > tableData.order);
            if (insertIndex === -1) {
                if (tIndex === -1) {
                    toBeCreated.push(tableData);
                } else {
                    toBeCreated[tIndex].fields = {
                        ...toBeCreated[tIndex].fields,
                        ...value.fields
                    };
                }
            } else {
                toBeCreated.splice(insertIndex, 0, tableData);
            }
            continue;
        }
        let toBeAddedFields = {};
        for (const [fieldName, field] of Object.entries(value.fields)){
            const column = table.columns.find((c)=>c.name === fieldName);
            if (!column) {
                toBeAddedFields[fieldName] = field;
                continue;
            }
            if (matchType(column.dataType, field.type, dbType)) {
                continue;
            } else {
                logger.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
            }
        }
        if (Object.keys(toBeAddedFields).length > 0) {
            toBeAdded.push({
                table: key,
                fields: toBeAddedFields,
                order: value.order || Infinity
            });
        }
    }
    const migrations = [];
    function getType(field, fieldName) {
        const type = field.type;
        const typeMap = {
            string: {
                sqlite: "text",
                postgres: "text",
                mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : "text",
                mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : // mssql deprecated `text`, and the alternative is `varchar(max)`.
                // Kysely type interface doesn't support `text`, so we set this to `varchar(8000)` as
                // that's the max length for `varchar`
                "varchar(8000)"
            },
            boolean: {
                sqlite: "integer",
                postgres: "boolean",
                mysql: "boolean",
                mssql: "smallint"
            },
            number: {
                sqlite: field.bigint ? "bigint" : "integer",
                postgres: field.bigint ? "bigint" : "integer",
                mysql: field.bigint ? "bigint" : "integer",
                mssql: field.bigint ? "bigint" : "integer"
            },
            date: {
                sqlite: "date",
                postgres: "timestamptz",
                mysql: "timestamp(3)",
                mssql: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`datetime2(3)`
            },
            json: {
                sqlite: "text",
                postgres: "jsonb",
                mysql: "json",
                mssql: "varchar(8000)"
            },
            id: {
                postgres: config.advanced?.database?.useNumberId ? "serial" : "text",
                mysql: config.advanced?.database?.useNumberId ? "integer" : "varchar(36)",
                mssql: config.advanced?.database?.useNumberId ? "integer" : "varchar(36)",
                sqlite: config.advanced?.database?.useNumberId ? "integer" : "text"
            },
            foreignKeyId: {
                postgres: config.advanced?.database?.useNumberId ? "integer" : "text",
                mysql: config.advanced?.database?.useNumberId ? "integer" : "varchar(36)",
                mssql: config.advanced?.database?.useNumberId ? "integer" : "varchar(36)",
                sqlite: config.advanced?.database?.useNumberId ? "integer" : "text"
            }
        };
        if (fieldName === "id" || field.references?.field === "id") {
            if (fieldName === "id") {
                return typeMap.id[dbType];
            }
            return typeMap.foreignKeyId[dbType];
        }
        if (dbType === "sqlite" && (type === "string[]" || type === "number[]")) {
            return "text";
        }
        if (type === "string[]" || type === "number[]") {
            return "jsonb";
        }
        if (Array.isArray(type)) {
            return "text";
        }
        return typeMap[type][dbType || "sqlite"];
    }
    if (toBeAdded.length) {
        for (const table of toBeAdded){
            for (const [fieldName, field] of Object.entries(table.fields)){
                const type = getType(field, fieldName);
                const exec = db.schema.alterTable(table.table).addColumn(fieldName, type, (col)=>{
                    col = field.required !== false ? col.notNull() : col;
                    if (field.references) {
                        col = col.references(`${field.references.model}.${field.references.field}`).onDelete(field.references.onDelete || "cascade");
                    }
                    if (field.unique) {
                        col = col.unique();
                    }
                    if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) {
                        if (dbType === "mysql") {
                            col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP(3)`);
                        } else {
                            col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP`);
                        }
                    }
                    return col;
                });
                migrations.push(exec);
            }
        }
    }
    if (toBeCreated.length) {
        for (const table of toBeCreated){
            let dbT = db.schema.createTable(table.table).addColumn("id", config.advanced?.database?.useNumberId ? dbType === "postgres" ? "serial" : "integer" : dbType === "mysql" || dbType === "mssql" ? "varchar(36)" : "text", (col)=>{
                if (config.advanced?.database?.useNumberId) {
                    if (dbType === "postgres" || dbType === "sqlite") {
                        return col.primaryKey().notNull();
                    } else if (dbType === "mssql") {
                        return col.identity().primaryKey().notNull();
                    }
                    return col.autoIncrement().primaryKey().notNull();
                }
                return col.primaryKey().notNull();
            });
            for (const [fieldName, field] of Object.entries(table.fields)){
                const type = getType(field, fieldName);
                dbT = dbT.addColumn(fieldName, type, (col)=>{
                    col = field.required !== false ? col.notNull() : col;
                    if (field.references) {
                        col = col.references(`${field.references.model}.${field.references.field}`).onDelete(field.references.onDelete || "cascade");
                    }
                    if (field.unique) {
                        col = col.unique();
                    }
                    if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) {
                        if (dbType === "mysql") {
                            col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP(3)`);
                        } else {
                            col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$kysely$40$0$2e$28$2e$8$2f$node_modules$2f$kysely$2f$dist$2f$esm$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP`);
                        }
                    }
                    return col;
                });
            }
            migrations.push(dbT);
        }
    }
    async function runMigrations() {
        for (const migration of migrations){
            await migration.execute();
        }
    }
    async function compileMigrations() {
        const compiled = migrations.map((m)=>m.compile().sql);
        return compiled.join(";\n\n") + ";";
    }
    return {
        toBeCreated,
        toBeAdded,
        runMigrations,
        compileMigrations
    };
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.YwDQhoPc.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>checkPassword,
    "v",
    ()=>validatePassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
;
async function validatePassword(ctx, data) {
    const accounts = await ctx.context.internalAdapter.findAccounts(data.userId);
    const credentialAccount = accounts?.find((account)=>account.providerId === "credential");
    const currentPassword = credentialAccount?.password;
    if (!credentialAccount || !currentPassword) {
        return false;
    }
    const compare = await ctx.context.password.verify({
        hash: currentPassword,
        password: data.password
    });
    return compare;
}
async function checkPassword(userId, c) {
    const accounts = await c.context.internalAdapter.findAccounts(userId);
    const credentialAccount = accounts?.find((account)=>account.providerId === "credential");
    const currentPassword = credentialAccount?.password;
    if (!credentialAccount || !currentPassword || !c.body.password) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
            message: "No password credential found"
        });
    }
    const compare = await c.context.password.verify({
        hash: currentPassword,
        password: c.body.password
    });
    if (!compare) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
            message: "Invalid password"
        });
    }
    return true;
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CDx1PoNO.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "b",
    ()=>betterAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/api/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BG42OQGC$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BG42OQGC.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.pQjeRkzN.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.D9_vQR83.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/social-providers/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BUPPRXfK.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$YwDQhoPc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.YwDQhoPc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DR3R5wdU.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$telemetry$40$1$2e$3$2e$_35b6910fccf4621fa107ba18aa01ca20$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+telemetry@1.3._35b6910fccf4621fa107ba18aa01ca20/node_modules/@better-auth/telemetry/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CBTS2OzX.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const DEFAULT_SECRET = "better-auth-secret-123456789";
function isPromise(obj) {
    return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
const init = async (options)=>{
    const adapter = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BG42OQGC$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(options);
    const plugins = options.plugins || [];
    const internalPlugins = getInternalPlugins(options);
    const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLogger"])(options.logger);
    const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(options.baseURL, options.basePath);
    const secret = options.secret || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].AUTH_SECRET || DEFAULT_SECRET;
    if (secret === DEFAULT_SECRET) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"]) {
            logger.error("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
        }
    }
    options = {
        ...options,
        secret,
        baseURL: baseURL ? new URL(baseURL).origin : "",
        basePath: options.basePath || "/api/auth",
        plugins: plugins.concat(internalPlugins)
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["checkEndpointConflicts"])(options, logger);
    const cookies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options);
    const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$pQjeRkzN$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options);
    const providers = Object.entries(options.socialProviders || {}).map(([key, config])=>{
        if (config == null) {
            return null;
        }
        if (config.enabled === false) {
            return null;
        }
        if (!config.clientId) {
            logger.warn(`Social provider ${key} is missing clientId or clientSecret`);
        }
        const provider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["socialProviders"][key](config);
        provider.disableImplicitSignUp = config.disableImplicitSignUp;
        return provider;
    }).filter((x)=>x !== null);
    const generateIdFunc = ({ model, size })=>{
        if (typeof options.advanced?.generateId === "function") {
            return options.advanced.generateId({
                model,
                size
            });
        }
        if (typeof options?.advanced?.database?.generateId === "function") {
            return options.advanced.database.generateId({
                model,
                size
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(size);
    };
    const { publish } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$telemetry$40$1$2e$3$2e$_35b6910fccf4621fa107ba18aa01ca20$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTelemetry"])(options, {
        adapter: adapter.id,
        database: typeof options.database === "function" ? "adapter" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CBTS2OzX$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options.database) || "unknown"
    });
    let ctx = {
        appName: options.appName || "Better Auth",
        socialProviders: providers,
        options,
        tables,
        trustedOrigins: getTrustedOrigins(options),
        baseURL: baseURL || "",
        sessionConfig: {
            updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 24 * 60 * 60,
            // 24 hours
            expiresIn: options.session?.expiresIn || 60 * 60 * 24 * 7,
            // 7 days
            freshAge: options.session?.freshAge === void 0 ? 60 * 60 * 24 : options.session.freshAge
        },
        secret,
        rateLimit: {
            ...options.rateLimit,
            enabled: options.rateLimit?.enabled ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"],
            window: options.rateLimit?.window || 10,
            max: options.rateLimit?.max || 100,
            storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
        },
        authCookies: cookies,
        logger,
        generateId: generateIdFunc,
        session: null,
        secondaryStorage: options.secondaryStorage,
        password: {
            hash: options.emailAndPassword?.password?.hash || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hashPassword"],
            verify: options.emailAndPassword?.password?.verify || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyPassword"],
            config: {
                minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
                maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
            },
            checkPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$YwDQhoPc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"]
        },
        setNewSession (session) {
            this.newSession = session;
        },
        newSession: null,
        adapter,
        internalAdapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BG42OQGC$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(adapter, {
            options,
            logger,
            hooks: options.databaseHooks ? [
                options.databaseHooks
            ] : []
        }),
        createAuthCookie: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(options),
        async runMigrations () {
            if (!options.database || "updateMany" in options.database) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
            }
            const { runMigrations } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BG42OQGC$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["e"])(options);
            await runMigrations();
        },
        publishTelemetry: publish,
        skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
        skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTest"])() ? true : false
    };
    const initOrPromise = runPluginInit(ctx);
    let context;
    if (isPromise(initOrPromise)) {
        ({ context } = await initOrPromise);
    } else {
        ({ context } = initOrPromise);
    }
    return context;
};
async function runPluginInit(ctx) {
    let options = ctx.options;
    const plugins = options.plugins || [];
    let context = ctx;
    const dbHooks = [];
    for (const plugin of plugins){
        if (plugin.init) {
            let initPromise = plugin.init(context);
            let result;
            if (isPromise(initPromise)) {
                result = await initPromise;
            } else {
                result = initPromise;
            }
            if (typeof result === "object") {
                if (result.options) {
                    const { databaseHooks, ...restOpts } = result.options;
                    if (databaseHooks) {
                        dbHooks.push(databaseHooks);
                    }
                    options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$defu$40$6$2e$1$2e$4$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defu"])(options, restOpts);
                }
                if (result.context) {
                    context = {
                        ...context,
                        ...result.context
                    };
                }
            }
        }
    }
    dbHooks.push(options.databaseHooks);
    context.internalAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BG42OQGC$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(ctx.adapter, {
        options,
        logger: ctx.logger,
        hooks: dbHooks.filter((u)=>u !== void 0),
        generateId: ctx.generateId
    });
    context.options = options;
    return {
        context
    };
}
function getInternalPlugins(options) {
    const plugins = [];
    if (options.advanced?.crossSubDomainCookies?.enabled) ;
    return plugins;
}
function getTrustedOrigins(options) {
    const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(options.baseURL, options.basePath);
    if (!baseURL) {
        return [];
    }
    const trustedOrigins = [
        new URL(baseURL).origin
    ];
    if (options.trustedOrigins && Array.isArray(options.trustedOrigins)) {
        trustedOrigins.push(...options.trustedOrigins);
    }
    const envTrustedOrigins = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_TRUSTED_ORIGINS;
    if (envTrustedOrigins) {
        trustedOrigins.push(...envTrustedOrigins.split(","));
    }
    if (trustedOrigins.filter((x)=>!x).length) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("A provided trusted origin is invalid, make sure your trusted origins list is properly defined.");
    }
    return trustedOrigins;
}
const betterAuth = (options)=>{
    const authContext = init(options);
    const { api } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEndpoints"])(authContext, options);
    const errorCodes = options.plugins?.reduce((acc, plugin)=>{
        if (plugin.$ERROR_CODES) {
            return {
                ...acc,
                ...plugin.$ERROR_CODES
            };
        }
        return acc;
    }, {});
    return {
        handler: async (request)=>{
            const ctx = await authContext;
            const basePath = ctx.options.basePath || "/api/auth";
            if (!ctx.options.baseURL) {
                const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"])(void 0, basePath, request);
                if (baseURL) {
                    ctx.baseURL = baseURL;
                    ctx.options.baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DR3R5wdU$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx.baseURL) || void 0;
                } else {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Could not get base URL from request. Please provide a valid base URL.");
                }
            }
            ctx.trustedOrigins = [
                ...options.trustedOrigins ? Array.isArray(options.trustedOrigins) ? options.trustedOrigins : await options.trustedOrigins(request) : [],
                ctx.options.baseURL
            ];
            const { handler } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["router"])(ctx, options);
            return handler(request);
        },
        api,
        options,
        $context: authContext,
        $Infer: {},
        $ERROR_CODES: {
            ...errorCodes,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"]
        }
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.D-2CmEwz.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>capitalizeFirstLetter
]);
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CDx1PoNO.mjs [app-route] (ecmascript) <export b as betterAuth>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "betterAuth",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["b"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CDx1PoNO.mjs [app-route] (ecmascript)");
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.msGOU0m9.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "p",
    ()=>parseJSON
]);
const PROTO_POLLUTION_PATTERNS = {
    proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
    constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
    protoShort: /"__proto__"\s*:/,
    constructorShort: /"constructor"\s*:/
};
const JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
const SPECIAL_VALUES = {
    true: true,
    false: false,
    null: null,
    undefined: void 0,
    nan: Number.NaN,
    infinity: Number.POSITIVE_INFINITY,
    "-infinity": Number.NEGATIVE_INFINITY
};
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
    const match = ISO_DATE_REGEX.exec(value);
    if (!match) return null;
    const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
    let date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
    if (offsetSign) {
        const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
        date.setUTCMinutes(date.getUTCMinutes() + offset);
    }
    return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
    const { strict = false, warnings = false, reviver, parseDates = true } = options;
    if (typeof value !== "string") {
        return value;
    }
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed[0] === '"' && trimmed.endsWith('"') && !trimmed.slice(1, -1).includes('"')) {
        return trimmed.slice(1, -1);
    }
    const lowerValue = trimmed.toLowerCase();
    if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) {
        return SPECIAL_VALUES[lowerValue];
    }
    if (!JSON_SIGNATURE.test(trimmed)) {
        if (strict) {
            throw new SyntaxError("[better-json] Invalid JSON");
        }
        return value;
    }
    const hasProtoPattern = Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern])=>{
        const matches = pattern.test(trimmed);
        if (matches && warnings) {
            console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
        }
        return matches;
    });
    if (hasProtoPattern && strict) {
        throw new Error("[better-json] Potential prototype pollution attempt detected");
    }
    try {
        const secureReviver = (key, value2)=>{
            if (key === "__proto__" || key === "constructor" && value2 && typeof value2 === "object" && "prototype" in value2) {
                if (warnings) {
                    console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
                }
                return void 0;
            }
            if (parseDates && typeof value2 === "string") {
                const date = parseISODate(value2);
                if (date) {
                    return date;
                }
            }
            return reviver ? reviver(key, value2) : value2;
        };
        return JSON.parse(trimmed, secureReviver);
    } catch (error) {
        if (strict) {
            throw error;
        }
        return value;
    }
}
function parseJSON(value, options = {
    strict: true
}) {
    return betterJSONParse(value, options);
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BIQhnWWW.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "O",
    ()=>ORGANIZATION_ERROR_CODES,
    "a",
    ()=>orgSessionMiddleware,
    "o",
    ()=>orgMiddleware,
    "t",
    ()=>teamSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/middleware/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BX9UB8EP$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BX9UB8EP.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DEBtROF9.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/utils/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BUPPRXfK.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const orgMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async ()=>{
    return {};
});
const orgSessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])({
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
    ]
}, async (ctx)=>{
    const session = ctx.context.session;
    return {
        session
    };
});
const ORGANIZATION_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
    YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
    ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
    ORGANIZATION_NOT_FOUND: "Organization not found",
    USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
    NO_ACTIVE_ORGANIZATION: "No active organization",
    USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
    MEMBER_NOT_FOUND: "Member not found",
    ROLE_NOT_FOUND: "Role not found",
    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
    TEAM_ALREADY_EXISTS: "Team already exists",
    TEAM_NOT_FOUND: "Team not found",
    YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
    YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: "You cannot leave the organization without an owner",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
    YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
    USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
    INVITATION_NOT_FOUND: "Invitation not found",
    YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
    EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: "Email verification required before accepting or rejecting invitation",
    YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
    INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
    YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "You are not allowed to invite a user with this role",
    FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
    YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
    UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
    ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
    YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
    INVITATION_LIMIT_REACHED: "Invitation limit reached",
    TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached",
    USER_IS_NOT_A_MEMBER_OF_THE_TEAM: "User is not a member of the team",
    YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: "You are not allowed to list the members of this team",
    YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: "You do not have an active team",
    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: "You are not allowed to create a new member",
    YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: "You are not allowed to remove a team member",
    YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: "You are not allowed to access this organization as an owner",
    YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: "You are not a member of this organization",
    MISSING_AC_INSTANCE: "Dynamic Access Control requires a pre-defined ac instance on the server auth plugin. Read server logs for more information",
    YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: "You must be in an organization to create a role",
    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: "You are not allowed to create a role",
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: "You are not allowed to update a role",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: "You are not allowed to delete a role",
    YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: "You are not allowed to read a role",
    YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: "You are not allowed to list a role",
    YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: "You are not allowed to get a role",
    TOO_MANY_ROLES: "This organization has too many roles",
    INVALID_RESOURCE: "The provided permission includes an invalid resource",
    ROLE_NAME_IS_ALREADY_TAKEN: "That role name is already taken",
    CANNOT_DELETE_A_PRE_DEFINED_ROLE: "Cannot delete a pre-defined role"
});
const role = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]();
const invitationStatus = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
    "pending",
    "accepted",
    "rejected",
    "canceled"
]).default("pending");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    logo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().nullish().optional(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unknown"]()).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().transform((v)=>JSON.parse(v))).optional(),
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]()
});
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    organizationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string(),
    role,
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]().default(()=>/* @__PURE__ */ new Date())
});
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    organizationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    role,
    status: invitationStatus,
    teamId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().nullish(),
    inviterId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]()
});
const teamSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().min(1),
    organizationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"](),
    updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]().optional()
});
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    teamId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]().default(()=>/* @__PURE__ */ new Date())
});
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BUPPRXfK$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"]),
    organizationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    permission: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]())),
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]().default(()=>/* @__PURE__ */ new Date()),
    updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]().optional()
});
const defaultRoles = [
    "admin",
    "member",
    "owner"
];
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"](defaultRoles),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"](defaultRoles))
]);
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BxexnJiR.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>toZodSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/index.js [app-route] (ecmascript)");
;
function toZodSchema({ fields, isClientSide }) {
    const zodFields = Object.keys(fields).reduce((acc, key)=>{
        const field = fields[key];
        if (!field) {
            return acc;
        }
        if (isClientSide && field.input === false) {
            return acc;
        }
        let schema2;
        if (field.type === "json") {
            schema2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.json ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.json() : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.any();
        } else if (field.type === "string[]" || field.type === "number[]") {
            schema2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.array(field.type === "string[]" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.string() : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.number());
        } else if (Array.isArray(field.type)) {
            schema2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.any();
        } else {
            schema2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__[field.type]();
        }
        if (field?.required === false) {
            schema2 = schema2.optional();
        }
        if (field?.returned === false) {
            return acc;
        }
        return {
            ...acc,
            [key]: schema2
        };
    }, {});
    const schema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.object(zodFields);
    return schema;
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BLxPPg5G.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>createAccessControl,
    "r",
    ()=>role
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
;
function role(statements) {
    return {
        authorize (request, connector = "AND") {
            let success = false;
            for (const [requestedResource, requestedActions] of Object.entries(request)){
                const allowedActions = statements[requestedResource];
                if (!allowedActions) {
                    return {
                        success: false,
                        error: `You are not allowed to access resource: ${requestedResource}`
                    };
                }
                if (Array.isArray(requestedActions)) {
                    success = requestedActions.every((requestedAction)=>allowedActions.includes(requestedAction));
                } else {
                    if (typeof requestedActions === "object") {
                        const actions = requestedActions;
                        if (actions.connector === "OR") {
                            success = actions.actions.some((requestedAction)=>allowedActions.includes(requestedAction));
                        } else {
                            success = actions.actions.every((requestedAction)=>allowedActions.includes(requestedAction));
                        }
                    } else {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Invalid access control request");
                    }
                }
                if (success && connector === "OR") {
                    return {
                        success
                    };
                }
                if (!success && connector === "AND") {
                    return {
                        success: false,
                        error: `unauthorized to access resource "${requestedResource}"`
                    };
                }
            }
            if (success) {
                return {
                    success
                };
            }
            return {
                success: false,
                error: "Not authorized"
            };
        },
        statements
    };
}
function createAccessControl(s) {
    return {
        newRole (statements) {
            return role(statements);
        },
        statements: s
    };
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DevHHPLH.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>defaultAc,
    "b",
    ()=>adminAc,
    "c",
    ()=>defaultRoles,
    "d",
    ()=>defaultStatements,
    "m",
    ()=>memberAc,
    "o",
    ()=>ownerAc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BLxPPg5G.mjs [app-route] (ecmascript)");
;
const defaultStatements = {
    organization: [
        "update",
        "delete"
    ],
    member: [
        "create",
        "update",
        "delete"
    ],
    invitation: [
        "create",
        "cancel"
    ],
    team: [
        "create",
        "update",
        "delete"
    ],
    ac: [
        "create",
        "read",
        "update",
        "delete"
    ]
};
const defaultAc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(defaultStatements);
const adminAc = defaultAc.newRole({
    organization: [
        "update"
    ],
    invitation: [
        "create",
        "cancel"
    ],
    member: [
        "create",
        "update",
        "delete"
    ],
    team: [
        "create",
        "update",
        "delete"
    ],
    ac: [
        "create",
        "read",
        "update",
        "delete"
    ]
});
const ownerAc = defaultAc.newRole({
    organization: [
        "update",
        "delete"
    ],
    member: [
        "create",
        "update",
        "delete"
    ],
    invitation: [
        "create",
        "cancel"
    ],
    team: [
        "create",
        "update",
        "delete"
    ],
    ac: [
        "create",
        "read",
        "update",
        "delete"
    ]
});
const memberAc = defaultAc.newRole({
    organization: [],
    member: [],
    invitation: [],
    team: [],
    ac: [
        "read"
    ]
});
const defaultRoles = {
    admin: adminAc,
    owner: ownerAc,
    member: memberAc
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DaEBQJp_.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>cacheAllRoles,
    "h",
    ()=>hasPermissionFn
]);
const hasPermissionFn = (input, acRoles)=>{
    if (!input.permissions && !input.permission) return false;
    const roles = input.role.split(",");
    const creatorRole = input.options.creatorRole || "owner";
    const isCreator = roles.includes(creatorRole);
    const allowCreatorsAllPermissions = input.allowCreatorAllPermissions || false;
    if (isCreator && allowCreatorsAllPermissions) return true;
    for (const role of roles){
        const _role = acRoles[role];
        const result = _role?.authorize(input.permissions ?? input.permission);
        if (result?.success) {
            return true;
        }
    }
    return false;
};
let cacheAllRoles = /* @__PURE__ */ new Map();
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Ddw8bVyV.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>twoFactorClient
]);
const twoFactorClient = (options)=>{
    return {
        id: "two-factor",
        $InferServerPlugin: {},
        atomListeners: [
            {
                matcher: (path)=>path.startsWith("/two-factor/"),
                signal: "$sessionSignal"
            }
        ],
        pathMethods: {
            "/two-factor/disable": "POST",
            "/two-factor/enable": "POST",
            "/two-factor/send-otp": "POST",
            "/two-factor/generate-backup-codes": "POST"
        },
        fetchPlugins: [
            {
                id: "two-factor",
                name: "two-factor",
                hooks: {
                    async onSuccess (context) {
                        if (context.data?.twoFactorRedirect) {
                            if (options?.onTwoFactorRedirect) {
                                await options.onTwoFactorRedirect();
                            }
                        }
                    }
                }
            }
        ]
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CP1SBr-a.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "U",
    ()=>USERNAME_ERROR_CODES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/utils/index.mjs [app-route] (ecmascript)");
;
const USERNAME_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    INVALID_USERNAME_OR_PASSWORD: "Invalid username or password",
    EMAIL_NOT_VERIFIED: "Email not verified",
    UNEXPECTED_ERROR: "Unexpected error",
    USERNAME_IS_ALREADY_TAKEN: "Username is already taken. Please try another.",
    USERNAME_TOO_SHORT: "Username is too short",
    USERNAME_TOO_LONG: "Username is too long",
    INVALID_USERNAME: "Username is invalid",
    INVALID_DISPLAY_USERNAME: "Display username is invalid"
});
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DQI8AD7d.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "g",
    ()=>getEndpointResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
;
const getEndpointResponse = async (ctx)=>{
    const returned = ctx.context.returned;
    if (!returned) {
        return null;
    }
    if (returned instanceof Response) {
        if (returned.status !== 200) {
            return null;
        }
        return await returned.clone().json();
    }
    if (returned instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]) {
        return null;
    }
    return returned;
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.C4MGirLD.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "A",
    ()=>ADMIN_ERROR_CODES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/utils/index.mjs [app-route] (ecmascript)");
;
const ADMIN_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    FAILED_TO_CREATE_USER: "Failed to create user",
    USER_ALREADY_EXISTS: "User already exists.",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
    YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself",
    YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role",
    YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users",
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users",
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions",
    YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users",
    YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users",
    YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions",
    YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users",
    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password",
    BANNED_USER: "You have been banned from this application",
    YOU_ARE_NOT_ALLOWED_TO_GET_USER: "You are not allowed to get user",
    NO_DATA_TO_UPDATE: "No data to update",
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: "You are not allowed to update users",
    YOU_CANNOT_REMOVE_YOURSELF: "You cannot remove yourself",
    YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: "You are not allowed to set a non-existent role value"
});
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CP-SWMbr.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>defaultAc,
    "b",
    ()=>adminAc,
    "c",
    ()=>defaultRoles,
    "d",
    ()=>defaultStatements,
    "u",
    ()=>userAc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BLxPPg5G.mjs [app-route] (ecmascript)");
;
const defaultStatements = {
    user: [
        "create",
        "list",
        "set-role",
        "ban",
        "impersonate",
        "delete",
        "set-password",
        "get",
        "update"
    ],
    session: [
        "list",
        "revoke",
        "delete"
    ]
};
const defaultAc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"])(defaultStatements);
const adminAc = defaultAc.newRole({
    user: [
        "create",
        "list",
        "set-role",
        "ban",
        "impersonate",
        "delete",
        "set-password",
        "get",
        "update"
    ],
    session: [
        "list",
        "revoke",
        "delete"
    ]
});
const userAc = defaultAc.newRole({
    user: [],
    session: []
});
const defaultRoles = {
    admin: adminAc,
    user: userAc
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BjOWrlEY.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "h",
    ()=>hasPermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CP$2d$SWMbr$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CP-SWMbr.mjs [app-route] (ecmascript)");
;
const hasPermission = (input)=>{
    if (input.userId && input.options?.adminUserIds?.includes(input.userId)) {
        return true;
    }
    if (!input.permissions && !input.permission) {
        return false;
    }
    const roles = (input.role || input.options?.defaultRole || "user").split(",");
    const acRoles = input.options?.roles || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CP$2d$SWMbr$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["c"];
    for (const role of roles){
        const _role = acRoles[role];
        const result = _role?.authorize(input.permission ?? input.permissions);
        if (result?.success) {
            return true;
        }
    }
    return false;
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Bz5l8J5E.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>admin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BX9UB8EP$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BX9UB8EP.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DEBtROF9.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/middleware/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.D9_vQR83.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Cwj9dt6i.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DQI8AD7d$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DQI8AD7d.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.C4MGirLD.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BjOWrlEY.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const schema = {
    user: {
        fields: {
            role: {
                type: "string",
                required: false,
                input: false
            },
            banned: {
                type: "boolean",
                defaultValue: false,
                required: false,
                input: false
            },
            banReason: {
                type: "string",
                required: false,
                input: false
            },
            banExpires: {
                type: "date",
                required: false,
                input: false
            }
        }
    },
    session: {
        fields: {
            impersonatedBy: {
                type: "string",
                required: false
            }
        }
    }
};
function parseRoles(roles) {
    return Array.isArray(roles) ? roles.join(",") : roles;
}
const admin = (options)=>{
    const opts = {
        defaultRole: options?.defaultRole ?? "user",
        adminRoles: options?.adminRoles ?? [
            "admin"
        ],
        bannedUserMessage: options?.bannedUserMessage ?? "You have been banned from this application. Please contact support if you believe this is an error.",
        ...options
    };
    const adminMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
        }
        return {
            session
        };
    });
    return {
        id: "admin",
        init () {
            return {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                async before (user) {
                                    return {
                                        data: {
                                            role: options?.defaultRole ?? "user",
                                            ...user
                                        }
                                    };
                                }
                            }
                        },
                        session: {
                            create: {
                                async before (session, ctx) {
                                    if (!ctx) {
                                        return;
                                    }
                                    const user = await ctx.context.internalAdapter.findUserById(session.userId);
                                    if (user.banned) {
                                        if (user.banExpires && new Date(user.banExpires).getTime() < Date.now()) {
                                            await ctx.context.internalAdapter.updateUser(session.userId, {
                                                banned: false,
                                                banReason: null,
                                                banExpires: null
                                            });
                                            return;
                                        }
                                        if (ctx && (ctx.path.startsWith("/callback") || ctx.path.startsWith("/oauth2/callback"))) {
                                            const redirectURI = ctx.context.options.onAPIError?.errorURL || `${ctx.context.baseURL}/error`;
                                            throw ctx.redirect(`${redirectURI}?error=banned&error_description=${opts.bannedUserMessage}`);
                                        }
                                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                                            message: opts.bannedUserMessage,
                                            code: "BANNED_USER"
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },
        hooks: {
            after: [
                {
                    matcher (context) {
                        return context.path === "/list-sessions";
                    },
                    handler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DQI8AD7d$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
                        if (!response) {
                            return;
                        }
                        const newJson = response.filter((session)=>{
                            return !session.impersonatedBy;
                        });
                        return ctx.json(newJson);
                    })
                }
            ]
        },
        endpoints: {
            /**
       * ### Endpoint
       *
       * POST `/admin/set-role`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.setRole`
       *
       * **client:**
       * `authClient.admin.setRole`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-set-role)
       */ setRole: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/set-role", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    }),
                    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                            description: "The role to set. `admin` or `user` by default"
                        }),
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                            description: "The roles to set. `admin` or `user` by default"
                        }))
                    ]).meta({
                        description: "The role to set, this can be a string or an array of strings. Eg: `admin` or `[admin, user]`"
                    })
                }),
                requireHeaders: true,
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "setRole",
                        summary: "Set the role of a user",
                        description: "Set the role of a user",
                        responses: {
                            200: {
                                description: "User role updated",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    $Infer: {
                        body: {}
                    }
                }
            }, async (ctx)=>{
                const canSetRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: ctx.context.session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "set-role"
                        ]
                    }
                });
                if (!canSetRole) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE
                    });
                }
                const roles = opts.roles;
                if (roles) {
                    const inputRoles = Array.isArray(ctx.body.role) ? ctx.body.role : [
                        ctx.body.role
                    ];
                    for (const role of inputRoles){
                        if (!roles[role]) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                                message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE
                            });
                        }
                    }
                }
                const updatedUser = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
                    role: parseRoles(ctx.body.role)
                }, ctx);
                return ctx.json({
                    user: updatedUser
                });
            }),
            getUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/get-user", {
                method: "GET",
                query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The id of the User"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "getUser",
                        summary: "Get an existing user",
                        description: "Get an existing user",
                        responses: {
                            200: {
                                description: "User",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const { id } = ctx.query;
                const canGetUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: ctx.context.session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "get"
                        ]
                    }
                });
                if (!canGetUser) {
                    throw ctx.error("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_GET_USER,
                        code: "YOU_ARE_NOT_ALLOWED_TO_GET_USER"
                    });
                }
                const user = await ctx.context.internalAdapter.findUserById(id);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_NOT_FOUND
                    });
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["p"])(ctx.context.options, user);
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/create-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.createUser`
       *
       * **client:**
       * `authClient.admin.createUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-create-user)
       */ createUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/create-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The email of the user"
                    }),
                    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The password of the user"
                    }),
                    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The name of the user"
                    }),
                    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                            description: "The role of the user"
                        }),
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                            description: "The roles of user"
                        }))
                    ]).optional().meta({
                        description: `A string or array of strings representing the roles to apply to the new user. Eg: "user"`
                    }),
                    /**
             * extra fields for user
             */ data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).optional().meta({
                        description: "Extra fields for the user. Including custom additional fields."
                    })
                }),
                metadata: {
                    openapi: {
                        operationId: "createUser",
                        summary: "Create a new user",
                        description: "Create a new user",
                        responses: {
                            200: {
                                description: "User created",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    $Infer: {
                        body: {}
                    }
                }
            }, async (ctx)=>{
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
                if (!session && (ctx.request || ctx.headers)) {
                    throw ctx.error("UNAUTHORIZED");
                }
                if (session) {
                    const canCreateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                        userId: session.user.id,
                        role: session.user.role,
                        options: opts,
                        permissions: {
                            user: [
                                "create"
                            ]
                        }
                    });
                    if (!canCreateUser) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                            message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS
                        });
                    }
                }
                const existUser = await ctx.context.internalAdapter.findUserByEmail(ctx.body.email);
                if (existUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
                    });
                }
                const user = await ctx.context.internalAdapter.createUser({
                    email: ctx.body.email,
                    name: ctx.body.name,
                    role: (ctx.body.role && parseRoles(ctx.body.role)) ?? options?.defaultRole ?? "user",
                    ...ctx.body.data
                }, ctx);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].FAILED_TO_CREATE_USER
                    });
                }
                const hashedPassword = await ctx.context.password.hash(ctx.body.password);
                await ctx.context.internalAdapter.linkAccount({
                    accountId: user.id,
                    providerId: "credential",
                    password: hashedPassword,
                    userId: user.id
                }, ctx);
                return ctx.json({
                    user
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/update-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.adminUpdateUser`
       *
       * **client:**
       * `authClient.admin.updateUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-update-user)
       */ adminUpdateUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/update-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    }),
                    data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).meta({
                        description: "The user data to update"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "updateUser",
                        summary: "Update a user",
                        description: "Update a user's details",
                        responses: {
                            200: {
                                description: "User updated",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const canUpdateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: ctx.context.session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "update"
                        ]
                    }
                });
                if (!canUpdateUser) {
                    throw ctx.error("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS,
                        code: "YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS"
                    });
                }
                if (Object.keys(ctx.body.data).length === 0) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].NO_DATA_TO_UPDATE
                    });
                }
                if (ctx.body.data?.role) {
                    ctx.body.data.role = parseRoles(ctx.body.data.role);
                }
                const updatedUser = await ctx.context.internalAdapter.updateUser(ctx.body.userId, ctx.body.data, ctx);
                return ctx.json(updatedUser);
            }),
            listUsers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/list-users", {
                method: "GET",
                use: [
                    adminMiddleware
                ],
                query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    searchValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional().meta({
                        description: 'The value to search for. Eg: "some name"'
                    }),
                    searchField: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "email",
                        "name"
                    ]).meta({
                        description: 'The field to search in, defaults to email. Can be `email` or `name`. Eg: "name"'
                    }).optional(),
                    searchOperator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "contains",
                        "starts_with",
                        "ends_with"
                    ]).meta({
                        description: 'The operator to use for the search. Can be `contains`, `starts_with` or `ends_with`. Eg: "contains"'
                    }).optional(),
                    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The number of users to return"
                    }).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]()).optional(),
                    offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The offset to start from"
                    }).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]()).optional(),
                    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The field to sort by"
                    }).optional(),
                    sortDirection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "asc",
                        "desc"
                    ]).meta({
                        description: "The direction to sort by"
                    }).optional(),
                    filterField: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The field to filter by"
                    }).optional(),
                    filterValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The value to filter by"
                    }).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]()).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]()).optional(),
                    filterOperator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "eq",
                        "ne",
                        "lt",
                        "lte",
                        "gt",
                        "gte",
                        "contains"
                    ]).meta({
                        description: "The operator to use for the filter"
                    }).optional()
                }),
                metadata: {
                    openapi: {
                        operationId: "listUsers",
                        summary: "List users",
                        description: "List users",
                        responses: {
                            200: {
                                description: "List of users",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                users: {
                                                    type: "array",
                                                    items: {
                                                        $ref: "#/components/schemas/User"
                                                    }
                                                },
                                                total: {
                                                    type: "number"
                                                },
                                                limit: {
                                                    type: "number"
                                                },
                                                offset: {
                                                    type: "number"
                                                }
                                            },
                                            required: [
                                                "users",
                                                "total"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canListUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "list"
                        ]
                    }
                });
                if (!canListUsers) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_LIST_USERS
                    });
                }
                const where = [];
                if (ctx.query?.searchValue) {
                    where.push({
                        field: ctx.query.searchField || "email",
                        operator: ctx.query.searchOperator || "contains",
                        value: ctx.query.searchValue
                    });
                }
                if (ctx.query?.filterValue) {
                    where.push({
                        field: ctx.query.filterField || "email",
                        operator: ctx.query.filterOperator || "eq",
                        value: ctx.query.filterValue
                    });
                }
                try {
                    const users = await ctx.context.internalAdapter.listUsers(Number(ctx.query?.limit) || void 0, Number(ctx.query?.offset) || void 0, ctx.query?.sortBy ? {
                        field: ctx.query.sortBy,
                        direction: ctx.query.sortDirection || "asc"
                    } : void 0, where.length ? where : void 0);
                    const total = await ctx.context.internalAdapter.countTotalUsers(where.length ? where : void 0);
                    return ctx.json({
                        users,
                        total,
                        limit: Number(ctx.query?.limit) || void 0,
                        offset: Number(ctx.query?.offset) || void 0
                    });
                } catch (e) {
                    return ctx.json({
                        users: [],
                        total: 0
                    });
                }
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/list-user-sessions`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.listUserSessions`
       *
       * **client:**
       * `authClient.admin.listUserSessions`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-list-user-sessions)
       */ listUserSessions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/list-user-sessions", {
                method: "POST",
                use: [
                    adminMiddleware
                ],
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                metadata: {
                    openapi: {
                        operationId: "listUserSessions",
                        summary: "List user sessions",
                        description: "List user sessions",
                        responses: {
                            200: {
                                description: "List of user sessions",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                sessions: {
                                                    type: "array",
                                                    items: {
                                                        $ref: "#/components/schemas/Session"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canListSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        session: [
                            "list"
                        ]
                    }
                });
                if (!canListSessions) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS
                    });
                }
                const sessions = await ctx.context.internalAdapter.listSessions(ctx.body.userId);
                return {
                    sessions
                };
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/unban-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.unbanUser`
       *
       * **client:**
       * `authClient.admin.unbanUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-unban-user)
       */ unbanUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/unban-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "unbanUser",
                        summary: "Unban a user",
                        description: "Unban a user",
                        responses: {
                            200: {
                                description: "User unbanned",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canBanUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "ban"
                        ]
                    }
                });
                if (!canBanUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_BAN_USERS
                    });
                }
                const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
                    banned: false,
                    banExpires: null,
                    banReason: null,
                    updatedAt: /* @__PURE__ */ new Date()
                });
                return ctx.json({
                    user
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/ban-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.banUser`
       *
       * **client:**
       * `authClient.admin.banUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-ban-user)
       */ banUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/ban-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    }),
                    /**
             * Reason for the ban
             */ banReason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The reason for the ban"
                    }).optional(),
                    /**
             * Number of seconds until the ban expires
             */ banExpiresIn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                        description: "The number of seconds until the ban expires"
                    }).optional()
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "banUser",
                        summary: "Ban a user",
                        description: "Ban a user",
                        responses: {
                            200: {
                                description: "User banned",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canBanUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "ban"
                        ]
                    }
                });
                if (!canBanUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_BAN_USERS
                    });
                }
                const foundUser = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
                if (!foundUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_NOT_FOUND
                    });
                }
                if (ctx.body.userId === ctx.context.session.user.id) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_CANNOT_BAN_YOURSELF
                    });
                }
                const user = await ctx.context.internalAdapter.updateUser(ctx.body.userId, {
                    banned: true,
                    banReason: ctx.body.banReason || options?.defaultBanReason || "No reason",
                    banExpires: ctx.body.banExpiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx.body.banExpiresIn, "sec") : options?.defaultBanExpiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options.defaultBanExpiresIn, "sec") : void 0,
                    updatedAt: /* @__PURE__ */ new Date()
                }, ctx);
                await ctx.context.internalAdapter.deleteSessions(ctx.body.userId);
                return ctx.json({
                    user
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/impersonate-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.impersonateUser`
       *
       * **client:**
       * `authClient.admin.impersonateUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-impersonate-user)
       */ impersonateUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/impersonate-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "impersonateUser",
                        summary: "Impersonate a user",
                        description: "Impersonate a user",
                        responses: {
                            200: {
                                description: "Impersonation session created",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                session: {
                                                    $ref: "#/components/schemas/Session"
                                                },
                                                user: {
                                                    $ref: "#/components/schemas/User"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const canImpersonateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: ctx.context.session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "impersonate"
                        ]
                    }
                });
                if (!canImpersonateUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS
                    });
                }
                const targetUser = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
                if (!targetUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                        message: "User not found"
                    });
                }
                const session = await ctx.context.internalAdapter.createSession(targetUser.id, ctx, true, {
                    impersonatedBy: ctx.context.session.user.id,
                    expiresAt: options?.impersonationSessionDuration ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(options.impersonationSessionDuration, "sec") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(60 * 60, "sec")
                }, true);
                if (!session) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].FAILED_TO_CREATE_USER
                    });
                }
                const authCookies = ctx.context.authCookies;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["d"])(ctx);
                const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
                const adminCookieProp = ctx.context.createAuthCookie("admin_session");
                await ctx.setSignedCookie(adminCookieProp.name, `${ctx.context.session.session.token}:${dontRememberMeCookie || ""}`, ctx.context.secret, authCookies.sessionToken.options);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(ctx, {
                    session,
                    user: targetUser
                }, true);
                return ctx.json({
                    session,
                    user: targetUser
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/stop-impersonating`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.stopImpersonating`
       *
       * **client:**
       * `authClient.admin.stopImpersonating`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-stop-impersonating)
       */ stopImpersonating: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/stop-impersonating", {
                method: "POST",
                requireHeaders: true
            }, async (ctx)=>{
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
                if (!session) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
                }
                if (!session.session.impersonatedBy) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: "You are not impersonating anyone"
                    });
                }
                const user = await ctx.context.internalAdapter.findUserById(session.session.impersonatedBy);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                        message: "Failed to find user"
                    });
                }
                const adminCookieName = ctx.context.createAuthCookie("admin_session").name;
                const adminCookie = await ctx.getSignedCookie(adminCookieName, ctx.context.secret);
                if (!adminCookie) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                        message: "Failed to find admin session"
                    });
                }
                const [adminSessionToken, dontRememberMeCookie] = adminCookie?.split(":");
                const adminSession = await ctx.context.internalAdapter.findSession(adminSessionToken);
                if (!adminSession || adminSession.session.userId !== user.id) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                        message: "Failed to find admin session"
                    });
                }
                await ctx.context.internalAdapter.deleteSession(session.session.token);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$D9_vQR83$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(ctx, adminSession, !!dontRememberMeCookie);
                return ctx.json(adminSession);
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/revoke-user-session`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.revokeUserSession`
       *
       * **client:**
       * `authClient.admin.revokeUserSession`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-revoke-user-session)
       */ revokeUserSession: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/revoke-user-session", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    sessionToken: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The session token"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "revokeUserSession",
                        summary: "Revoke a user session",
                        description: "Revoke a user session",
                        responses: {
                            200: {
                                description: "Session revoked",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canRevokeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        session: [
                            "revoke"
                        ]
                    }
                });
                if (!canRevokeSession) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS
                    });
                }
                await ctx.context.internalAdapter.deleteSession(ctx.body.sessionToken);
                return ctx.json({
                    success: true
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/revoke-user-sessions`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.revokeUserSessions`
       *
       * **client:**
       * `authClient.admin.revokeUserSessions`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-revoke-user-sessions)
       */ revokeUserSessions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/revoke-user-sessions", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "revokeUserSessions",
                        summary: "Revoke all user sessions",
                        description: "Revoke all user sessions",
                        responses: {
                            200: {
                                description: "Sessions revoked",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canRevokeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        session: [
                            "revoke"
                        ]
                    }
                });
                if (!canRevokeSession) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS
                    });
                }
                await ctx.context.internalAdapter.deleteSessions(ctx.body.userId);
                return ctx.json({
                    success: true
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/remove-user`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.removeUser`
       *
       * **client:**
       * `authClient.admin.removeUser`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-remove-user)
       */ removeUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/remove-user", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "removeUser",
                        summary: "Remove a user",
                        description: "Delete a user and all their sessions and accounts. Cannot be undone.",
                        responses: {
                            200: {
                                description: "User removed",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const session = ctx.context.session;
                const canDeleteUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "delete"
                        ]
                    }
                });
                if (!canDeleteUser) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS
                    });
                }
                if (ctx.body.userId === ctx.context.session.user.id) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_CANNOT_REMOVE_YOURSELF
                    });
                }
                const user = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                        message: "User not found"
                    });
                }
                await ctx.context.internalAdapter.deleteUser(ctx.body.userId);
                return ctx.json({
                    success: true
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/set-user-password`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.setUserPassword`
       *
       * **client:**
       * `authClient.admin.setUserPassword`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-set-user-password)
       */ setUserPassword: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/set-user-password", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The new password"
                    }),
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                        description: "The user id"
                    })
                }),
                use: [
                    adminMiddleware
                ],
                metadata: {
                    openapi: {
                        operationId: "setUserPassword",
                        summary: "Set a user's password",
                        description: "Set a user's password",
                        responses: {
                            200: {
                                description: "Password set",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                status: {
                                                    type: "boolean"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const canSetUserPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: ctx.context.session.user.id,
                    role: ctx.context.session.user.role,
                    options: opts,
                    permissions: {
                        user: [
                            "set-password"
                        ]
                    }
                });
                if (!canSetUserPassword) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"].YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD
                    });
                }
                const hashedPassword = await ctx.context.password.hash(ctx.body.newPassword);
                await ctx.context.internalAdapter.updatePassword(ctx.body.userId, hashedPassword);
                return ctx.json({
                    status: true
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/admin/has-permission`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.userHasPermission`
       *
       * **client:**
       * `authClient.admin.hasPermission`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/admin#api-method-admin-has-permission)
       */ userHasPermission: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/admin/has-permission", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().optional().meta({
                        description: `The user id. Eg: "user-id"`
                    }),
                    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional().meta({
                        description: `The role to check permission for. Eg: "admin"`
                    })
                }).and(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                        permission: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]())),
                        permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["undefined"]()
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                        permission: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["undefined"](),
                        permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()))
                    })
                ])),
                metadata: {
                    openapi: {
                        description: "Check if the user has permission",
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            permission: {
                                                type: "object",
                                                description: "The permission to check",
                                                deprecated: true
                                            },
                                            permissions: {
                                                type: "object",
                                                description: "The permission to check"
                                            }
                                        },
                                        required: [
                                            "permissions"
                                        ]
                                    }
                                }
                            }
                        },
                        responses: {
                            "200": {
                                description: "Success",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: {
                                                    type: "string"
                                                },
                                                success: {
                                                    type: "boolean"
                                                }
                                            },
                                            required: [
                                                "success"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    $Infer: {
                        body: {}
                    }
                }
            }, async (ctx)=>{
                if (!ctx.body?.permission && !ctx.body?.permissions) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: "invalid permission check. no permission(s) were passed."
                    });
                }
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
                if (!session && (ctx.request || ctx.headers)) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED");
                }
                if (!session && !ctx.body.userId && !ctx.body.role) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: "user id or role is required"
                    });
                }
                const user = session?.user || (ctx.body.role ? {
                    id: ctx.body.userId || "",
                    role: ctx.body.role
                } : null) || await ctx.context.internalAdapter.findUserById(ctx.body.userId);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: "user not found"
                    });
                }
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BjOWrlEY$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["h"])({
                    userId: user.id,
                    role: user.role,
                    options,
                    permissions: ctx.body.permissions ?? ctx.body.permission
                });
                return ctx.json({
                    error: null,
                    success: result
                });
            })
        },
        $ERROR_CODES: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["A"],
        schema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["m"])(schema, opts.schema),
        options
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.iy-Q9EM9.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>getJwksAdapter,
    "b",
    ()=>generateExportedKeyPair,
    "c",
    ()=>createJwk,
    "g",
    ()=>getJwtToken,
    "s",
    ()=>signJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$generate_key_pair$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/key/generate_key_pair.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/key/export.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/key/import.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
;
;
;
;
;
const getJwksAdapter = (adapter)=>{
    return {
        getAllKeys: async ()=>{
            return await adapter.findMany({
                model: "jwks"
            });
        },
        getLatestKey: async ()=>{
            const key = await adapter.findMany({
                model: "jwks",
                sortBy: {
                    field: "createdAt",
                    direction: "desc"
                },
                limit: 1
            });
            return key[0];
        },
        createJwk: async (webKey)=>{
            const jwk = await adapter.create({
                model: "jwks",
                data: {
                    ...webKey,
                    createdAt: /* @__PURE__ */ new Date()
                }
            });
            return jwk;
        }
    };
};
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function joseSecs(str) {
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
        throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch(unit){
        case "sec":
        case "secs":
        case "second":
        case "seconds":
        case "s":
            numericDate = Math.round(value);
            break;
        case "minute":
        case "minutes":
        case "min":
        case "mins":
        case "m":
            numericDate = Math.round(value * minute);
            break;
        case "hour":
        case "hours":
        case "hr":
        case "hrs":
        case "h":
            numericDate = Math.round(value * hour);
            break;
        case "day":
        case "days":
        case "d":
            numericDate = Math.round(value * day);
            break;
        case "week":
        case "weeks":
        case "w":
            numericDate = Math.round(value * week);
            break;
        // years matched
        default:
            numericDate = Math.round(value * year);
            break;
    }
    if (matched[1] === "-" || matched[4] === "ago") {
        return -numericDate;
    }
    return numericDate;
}
function toExpJWT(expirationTime, iat) {
    if (typeof expirationTime === "number") {
        return expirationTime;
    } else if (expirationTime instanceof Date) {
        return Math.floor(expirationTime.getTime() / 1e3);
    } else {
        return iat + joseSecs(expirationTime);
    }
}
async function generateExportedKeyPair(options) {
    const { alg, ...cfg } = options?.jwks?.keyPairConfig ?? {
        alg: "EdDSA",
        crv: "Ed25519"
    };
    const { publicKey, privateKey } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$generate_key_pair$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateKeyPair"])(alg, {
        ...cfg,
        extractable: true
    });
    const publicWebKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["exportJWK"])(publicKey);
    const privateWebKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["exportJWK"])(privateKey);
    return {
        publicWebKey,
        privateWebKey,
        alg,
        cfg
    };
}
async function createJwk(ctx, options) {
    const { publicWebKey, privateWebKey, alg, cfg } = await generateExportedKeyPair(options);
    const stringifiedPrivateWebKey = JSON.stringify(privateWebKey);
    const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
    let jwk = {
        alg,
        ...cfg && "crv" in cfg ? {
            crv: cfg.crv
        } : {},
        publicKey: JSON.stringify(publicWebKey),
        privateKey: privateKeyEncryptionEnabled ? JSON.stringify(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricEncrypt"])({
            key: ctx.context.secret,
            data: stringifiedPrivateWebKey
        })) : stringifiedPrivateWebKey,
        createdAt: /* @__PURE__ */ new Date()
    };
    const adapter = getJwksAdapter(ctx.context.adapter);
    const key = await adapter.createJwk(jwk);
    return key;
}
async function signJWT(ctx, config) {
    const { options, payload } = config;
    const nowSeconds = Math.floor(Date.now() / 1e3);
    const iat = payload.iat;
    let exp = payload.exp;
    const defaultExp = toExpJWT(options?.jwt?.expirationTime ?? "15m", iat ?? nowSeconds);
    exp = exp ?? defaultExp;
    const nbf = payload.nbf;
    const iss = payload.iss;
    const defaultIss = options?.jwt?.issuer ?? ctx.context.options.baseURL;
    const aud = payload.aud;
    const defaultAud = options?.jwt?.audience ?? ctx.context.options.baseURL;
    if (options?.jwt?.sign) {
        const jwtPayload = {
            ...payload,
            iat,
            exp,
            nbf,
            iss: iss ?? defaultIss,
            aud: aud ?? defaultAud
        };
        return options.jwt.sign(jwtPayload);
    }
    const adapter = getJwksAdapter(ctx.context.adapter);
    let key = await adapter.getLatestKey();
    const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
    if (key === void 0) {
        key = await createJwk(ctx, options);
    }
    let privateWebKey = privateKeyEncryptionEnabled ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricDecrypt"])({
        key: ctx.context.secret,
        data: JSON.parse(key.privateKey)
    }).catch(()=>{
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BetterAuthError"]("Failed to decrypt private key. Make sure the secret currently in use is the same as the one used to encrypt the private key. If you are using a different secret, either clean up your JWKS or disable private key encryption.");
    }) : key.privateKey;
    const alg = key.alg ?? options?.jwks?.keyPairConfig?.alg ?? "EdDSA";
    const privateKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["importJWK"])(JSON.parse(privateWebKey), alg);
    const jwt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg,
        kid: key.id
    }).setExpirationTime(exp).setIssuer(iss ?? defaultIss).setAudience(aud ?? defaultAud);
    if (iat) jwt.setIssuedAt(iat);
    if (payload.sub) jwt.setSubject(payload.sub);
    if (payload.nbf) jwt.setNotBefore(payload.nbf);
    if (payload.jti) jwt.setJti(payload.jti);
    return await jwt.sign(privateKey);
}
async function getJwtToken(ctx, options) {
    const payload = !options?.jwt?.definePayload ? ctx.context.session.user : await options?.jwt.definePayload(ctx.context.session);
    return await signJWT(ctx, {
        options,
        payload: {
            iat: Math.floor(Date.now() / 1e3),
            ...payload,
            sub: await options?.jwt?.getSubject?.(ctx.context.session) ?? ctx.context.session.user.id
        }
    });
}
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Dzn6KLfq.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>getMetadata,
    "g",
    ()=>getClient,
    "o",
    ()=>oidcProvider,
    "s",
    ()=>schema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BX9UB8EP$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BX9UB8EP.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DEBtROF9.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/middleware/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Ih8C76Vo$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Ih8C76Vo.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Cwj9dt6i.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$iy$2d$Q9EM9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.iy-Q9EM9.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const schema = {
    oauthApplication: {
        modelName: "oauthApplication",
        fields: {
            name: {
                type: "string"
            },
            icon: {
                type: "string",
                required: false
            },
            metadata: {
                type: "string",
                required: false
            },
            clientId: {
                type: "string",
                unique: true
            },
            clientSecret: {
                type: "string",
                required: false
            },
            redirectURLs: {
                type: "string"
            },
            type: {
                type: "string"
            },
            disabled: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            userId: {
                type: "string",
                required: false,
                references: {
                    model: "user",
                    field: "id",
                    onDelete: "cascade"
                }
            },
            createdAt: {
                type: "date"
            },
            updatedAt: {
                type: "date"
            }
        }
    },
    oauthAccessToken: {
        modelName: "oauthAccessToken",
        fields: {
            accessToken: {
                type: "string",
                unique: true
            },
            refreshToken: {
                type: "string",
                unique: true
            },
            accessTokenExpiresAt: {
                type: "date"
            },
            refreshTokenExpiresAt: {
                type: "date"
            },
            clientId: {
                type: "string",
                references: {
                    model: "oauthApplication",
                    field: "clientId",
                    onDelete: "cascade"
                }
            },
            userId: {
                type: "string",
                required: false,
                references: {
                    model: "user",
                    field: "id",
                    onDelete: "cascade"
                }
            },
            scopes: {
                type: "string"
            },
            createdAt: {
                type: "date"
            },
            updatedAt: {
                type: "date"
            }
        }
    },
    oauthConsent: {
        modelName: "oauthConsent",
        fields: {
            clientId: {
                type: "string",
                references: {
                    model: "oauthApplication",
                    field: "clientId",
                    onDelete: "cascade"
                }
            },
            userId: {
                type: "string",
                references: {
                    model: "user",
                    field: "id",
                    onDelete: "cascade"
                }
            },
            scopes: {
                type: "string"
            },
            createdAt: {
                type: "date"
            },
            updatedAt: {
                type: "date"
            },
            consentGiven: {
                type: "boolean"
            }
        }
    }
};
function formatErrorURL(url, error, description) {
    return `${url.includes("?") ? "&" : "?"}error=${error}&error_description=${description}`;
}
function getErrorURL(ctx, error, description) {
    const baseURL = ctx.context.options.onAPIError?.errorURL || `${ctx.context.baseURL}/error`;
    const formattedURL = formatErrorURL(baseURL, error, description);
    return formattedURL;
}
async function authorize(ctx, options) {
    const handleRedirect = (url)=>{
        const fromFetch = ctx.request?.headers.get("sec-fetch-mode") === "cors";
        if (fromFetch) {
            return ctx.json({
                redirect: true,
                url
            });
        } else {
            throw ctx.redirect(url);
        }
    };
    const opts = {
        codeExpiresIn: 600,
        defaultScope: "openid",
        ...options,
        scopes: [
            "openid",
            "profile",
            "email",
            "offline_access",
            ...options?.scopes || []
        ]
    };
    if (!ctx.request) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            error_description: "request not found",
            error: "invalid_request"
        });
    }
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
    if (!session) {
        await ctx.setSignedCookie("oidc_login_prompt", JSON.stringify(ctx.query), ctx.context.secret, {
            maxAge: 600,
            path: "/",
            sameSite: "lax"
        });
        const queryFromURL = ctx.request.url?.split("?")[1];
        return handleRedirect(`${options.loginPage}?${queryFromURL}`);
    }
    const query = ctx.query;
    if (!query.client_id) {
        const errorURL = getErrorURL(ctx, "invalid_client", "client_id is required");
        throw ctx.redirect(errorURL);
    }
    if (!query.response_type) {
        getErrorURL(ctx, "invalid_request", "response_type is required");
        throw ctx.redirect(getErrorURL(ctx, "invalid_request", "response_type is required"));
    }
    const client = await getClient(ctx.query.client_id, ctx.context.adapter, options.trustedClients || []);
    if (!client) {
        const errorURL = getErrorURL(ctx, "invalid_client", "client_id is required");
        throw ctx.redirect(errorURL);
    }
    const redirectURI = client.redirectURLs.find((url)=>url === ctx.query.redirect_uri);
    if (!redirectURI || !query.redirect_uri) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
            message: "Invalid redirect URI"
        });
    }
    if (client.disabled) {
        const errorURL = getErrorURL(ctx, "client_disabled", "client is disabled");
        throw ctx.redirect(errorURL);
    }
    if (query.response_type !== "code") {
        const errorURL = getErrorURL(ctx, "unsupported_response_type", "unsupported response type");
        throw ctx.redirect(errorURL);
    }
    const requestScope = query.scope?.split(" ").filter((s)=>s) || opts.defaultScope.split(" ");
    const invalidScopes = requestScope.filter((scope)=>{
        return !opts.scopes.includes(scope);
    });
    if (invalidScopes.length) {
        return handleRedirect(formatErrorURL(query.redirect_uri, "invalid_scope", `The following scopes are invalid: ${invalidScopes.join(", ")}`));
    }
    if ((!query.code_challenge || !query.code_challenge_method) && options.requirePKCE) {
        return handleRedirect(formatErrorURL(query.redirect_uri, "invalid_request", "pkce is required"));
    }
    if (!query.code_challenge_method) {
        query.code_challenge_method = "plain";
    }
    if (![
        "s256",
        options.allowPlainCodeChallengeMethod ? "plain" : "s256"
    ].includes(query.code_challenge_method?.toLowerCase() || "")) {
        return handleRedirect(formatErrorURL(query.redirect_uri, "invalid_request", "invalid code_challenge method"));
    }
    const code = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z", "0-9");
    const codeExpiresInMs = opts.codeExpiresIn * 1e3;
    const expiresAt = new Date(Date.now() + codeExpiresInMs);
    const skipConsentForTrustedClient = client.skipConsent;
    const hasAlreadyConsented = await ctx.context.adapter.findOne({
        model: "oauthConsent",
        where: [
            {
                field: "clientId",
                value: client.clientId
            },
            {
                field: "userId",
                value: session.user.id
            }
        ]
    }).then((res)=>!!res?.consentGiven);
    const requireConsent = !skipConsentForTrustedClient && (!hasAlreadyConsented || query.prompt === "consent");
    try {
        await ctx.context.internalAdapter.createVerificationValue({
            value: JSON.stringify({
                clientId: client.clientId,
                redirectURI: query.redirect_uri,
                scope: requestScope,
                userId: session.user.id,
                authTime: new Date(session.session.createdAt).getTime(),
                /**
           * Consent is required per OIDC spec unless:
           * 1. Client is trusted (skipConsent = true)
           * 2. User has already consented (and prompt is not "consent")
           *
           * When consent is required, the code needs to be treated as a
           * consent request. Once the user consents, the code will be
           * updated with the actual authorization code.
           */ requireConsent,
                state: requireConsent ? query.state : null,
                codeChallenge: query.code_challenge,
                codeChallengeMethod: query.code_challenge_method,
                nonce: query.nonce
            }),
            identifier: code,
            expiresAt
        }, ctx);
    } catch (e) {
        return handleRedirect(formatErrorURL(query.redirect_uri, "server_error", "An error occurred while processing the request"));
    }
    if (!requireConsent) {
        const redirectURIWithCode = new URL(redirectURI);
        redirectURIWithCode.searchParams.set("code", code);
        redirectURIWithCode.searchParams.set("state", ctx.query.state);
        return handleRedirect(redirectURIWithCode.toString());
    }
    if (options?.consentPage) {
        await ctx.setSignedCookie("oidc_consent_prompt", code, ctx.context.secret, {
            maxAge: 600,
            path: "/",
            sameSite: "lax"
        });
        const urlParams = new URLSearchParams();
        urlParams.set("consent_code", code);
        urlParams.set("client_id", client.clientId);
        urlParams.set("scope", requestScope.join(" "));
        const consentURI = `${options.consentPage}?${urlParams.toString()}`;
        return handleRedirect(consentURI);
    }
    const htmlFn = options?.getConsentHTML;
    if (!htmlFn) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
            message: "No consent page provided"
        });
    }
    return new Response(htmlFn({
        scopes: requestScope,
        clientMetadata: client.metadata,
        clientIcon: client?.icon,
        clientId: client.clientId,
        clientName: client.name,
        code
    }), {
        headers: {
            "content-type": "text/html"
        }
    });
}
const defaultClientSecretHasher = async (clientSecret)=>{
    const hash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(new TextEncoder().encode(clientSecret));
    const hashed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].encode(new Uint8Array(hash), {
        padding: false
    });
    return hashed;
};
const getJwtPlugin = (ctx)=>{
    return ctx.context.options.plugins?.find((plugin)=>plugin.id === "jwt");
};
async function getClient(clientId, adapter, trustedClients = []) {
    const trustedClient = trustedClients.find((client)=>client.clientId === clientId);
    if (trustedClient) {
        return trustedClient;
    }
    const dbClient = await adapter.findOne({
        model: "oauthApplication",
        where: [
            {
                field: "clientId",
                value: clientId
            }
        ]
    }).then((res)=>{
        if (!res) {
            return null;
        }
        return {
            ...res,
            redirectURLs: (res.redirectURLs ?? "").split(","),
            metadata: res.metadata ? JSON.parse(res.metadata) : {}
        };
    });
    return dbClient;
}
const getMetadata = (ctx, options)=>{
    const jwtPlugin = getJwtPlugin(ctx);
    const issuer = jwtPlugin && jwtPlugin.options?.jwt && jwtPlugin.options.jwt.issuer ? jwtPlugin.options.jwt.issuer : ctx.context.options.baseURL;
    const baseURL = ctx.context.baseURL;
    const supportedAlgs = options?.useJWTPlugin ? [
        "RS256",
        "EdDSA",
        "none"
    ] : [
        "HS256",
        "none"
    ];
    return {
        issuer,
        authorization_endpoint: `${baseURL}/oauth2/authorize`,
        token_endpoint: `${baseURL}/oauth2/token`,
        userinfo_endpoint: `${baseURL}/oauth2/userinfo`,
        jwks_uri: `${baseURL}/jwks`,
        registration_endpoint: `${baseURL}/oauth2/register`,
        scopes_supported: [
            "openid",
            "profile",
            "email",
            "offline_access"
        ],
        response_types_supported: [
            "code"
        ],
        response_modes_supported: [
            "query"
        ],
        grant_types_supported: [
            "authorization_code",
            "refresh_token"
        ],
        acr_values_supported: [
            "urn:mace:incommon:iap:silver",
            "urn:mace:incommon:iap:bronze"
        ],
        subject_types_supported: [
            "public"
        ],
        id_token_signing_alg_values_supported: supportedAlgs,
        token_endpoint_auth_methods_supported: [
            "client_secret_basic",
            "client_secret_post",
            "none"
        ],
        code_challenge_methods_supported: [
            "S256"
        ],
        claims_supported: [
            "sub",
            "iss",
            "aud",
            "exp",
            "nbf",
            "iat",
            "jti",
            "email",
            "email_verified",
            "name"
        ],
        ...options?.metadata
    };
};
const oidcProvider = (options)=>{
    const modelName = {
        oauthClient: "oauthApplication",
        oauthAccessToken: "oauthAccessToken",
        oauthConsent: "oauthConsent"
    };
    const opts = {
        codeExpiresIn: 600,
        defaultScope: "openid",
        accessTokenExpiresIn: 3600,
        refreshTokenExpiresIn: 604800,
        allowPlainCodeChallengeMethod: true,
        storeClientSecret: "plain",
        ...options,
        scopes: [
            "openid",
            "profile",
            "email",
            "offline_access",
            ...options?.scopes || []
        ]
    };
    const trustedClients = options.trustedClients || [];
    async function storeClientSecret(ctx, clientSecret) {
        if (opts.storeClientSecret === "encrypted") {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricEncrypt"])({
                key: ctx.context.secret,
                data: clientSecret
            });
        }
        if (opts.storeClientSecret === "hashed") {
            return await defaultClientSecretHasher(clientSecret);
        }
        if (typeof opts.storeClientSecret === "object" && "hash" in opts.storeClientSecret) {
            return await opts.storeClientSecret.hash(clientSecret);
        }
        if (typeof opts.storeClientSecret === "object" && "encrypt" in opts.storeClientSecret) {
            return await opts.storeClientSecret.encrypt(clientSecret);
        }
        return clientSecret;
    }
    async function verifyStoredClientSecret(ctx, storedClientSecret, clientSecret) {
        if (opts.storeClientSecret === "encrypted") {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricDecrypt"])({
                key: ctx.context.secret,
                data: storedClientSecret
            }) === clientSecret;
        }
        if (opts.storeClientSecret === "hashed") {
            const hashedClientSecret = await defaultClientSecretHasher(clientSecret);
            return hashedClientSecret === storedClientSecret;
        }
        if (typeof opts.storeClientSecret === "object" && "hash" in opts.storeClientSecret) {
            const hashedClientSecret = await opts.storeClientSecret.hash(clientSecret);
            return hashedClientSecret === storedClientSecret;
        }
        if (typeof opts.storeClientSecret === "object" && "decrypt" in opts.storeClientSecret) {
            const decryptedClientSecret = await opts.storeClientSecret.decrypt(storedClientSecret);
            return decryptedClientSecret === clientSecret;
        }
        return clientSecret === storedClientSecret;
    }
    return {
        id: "oidc",
        hooks: {
            after: [
                {
                    matcher () {
                        return true;
                    },
                    handler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
                        const cookie = await ctx.getSignedCookie("oidc_login_prompt", ctx.context.secret);
                        const cookieName = ctx.context.authCookies.sessionToken.name;
                        const parsedSetCookieHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Ih8C76Vo$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["p"])(ctx.context.responseHeaders?.get("set-cookie") || "");
                        const hasSessionToken = parsedSetCookieHeader.has(cookieName);
                        if (!cookie || !hasSessionToken) {
                            return;
                        }
                        ctx.setCookie("oidc_login_prompt", "", {
                            maxAge: 0
                        });
                        const sessionCookie = parsedSetCookieHeader.get(cookieName)?.value;
                        const sessionToken = sessionCookie?.split(".")[0];
                        if (!sessionToken) {
                            return;
                        }
                        const session = await ctx.context.internalAdapter.findSession(sessionToken);
                        if (!session) {
                            return;
                        }
                        ctx.query = JSON.parse(cookie);
                        ctx.context.session = session;
                        const response = await authorize(ctx, opts);
                        return response;
                    })
                }
            ]
        },
        endpoints: {
            getOpenIdConfig: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/.well-known/openid-configuration", {
                method: "GET",
                metadata: {
                    isAction: false
                }
            }, async (ctx)=>{
                const metadata = getMetadata(ctx, options);
                return ctx.json(metadata);
            }),
            oAuth2authorize: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/authorize", {
                method: "GET",
                query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()),
                metadata: {
                    openapi: {
                        description: "Authorize an OAuth2 request",
                        responses: {
                            "200": {
                                description: "Authorization response generated successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            additionalProperties: true,
                                            description: "Authorization response, contents depend on the authorize function implementation"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                return authorize(ctx, opts);
            }),
            oAuthConsent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/consent", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    accept: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"](),
                    consent_code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional().nullish()
                }),
                use: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
                ],
                metadata: {
                    openapi: {
                        description: "Handle OAuth2 consent. Supports both URL parameter-based flows (consent_code in body) and cookie-based flows (signed cookie).",
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accept: {
                                                type: "boolean",
                                                description: "Whether the user accepts or denies the consent request"
                                            },
                                            consent_code: {
                                                type: "string",
                                                description: "The consent code from the authorization request. Optional if using cookie-based flow."
                                            }
                                        },
                                        required: [
                                            "accept"
                                        ]
                                    }
                                }
                            }
                        },
                        responses: {
                            "200": {
                                description: "Consent processed successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                redirectURI: {
                                                    type: "string",
                                                    format: "uri",
                                                    description: "The URI to redirect to, either with an authorization code or an error"
                                                }
                                            },
                                            required: [
                                                "redirectURI"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                let consentCode = ctx.body.consent_code || null;
                if (!consentCode) {
                    consentCode = await ctx.getSignedCookie("oidc_consent_prompt", ctx.context.secret);
                }
                if (!consentCode) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "consent_code is required (either in body or cookie)",
                        error: "invalid_request"
                    });
                }
                const verification = await ctx.context.internalAdapter.findVerificationValue(consentCode);
                if (!verification) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "Invalid code",
                        error: "invalid_request"
                    });
                }
                if (verification.expiresAt < /* @__PURE__ */ new Date()) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "Code expired",
                        error: "invalid_request"
                    });
                }
                ctx.setCookie("oidc_consent_prompt", "", {
                    maxAge: 0
                });
                const value = JSON.parse(verification.value);
                if (!value.requireConsent) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "Consent not required",
                        error: "invalid_request"
                    });
                }
                if (!ctx.body.accept) {
                    await ctx.context.internalAdapter.deleteVerificationValue(verification.id);
                    return ctx.json({
                        redirectURI: `${value.redirectURI}?error=access_denied&error_description=User denied access`
                    });
                }
                const code = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z", "0-9");
                const codeExpiresInMs = opts.codeExpiresIn * 1e3;
                const expiresAt = new Date(Date.now() + codeExpiresInMs);
                await ctx.context.internalAdapter.updateVerificationValue(verification.id, {
                    value: JSON.stringify({
                        ...value,
                        requireConsent: false
                    }),
                    identifier: code,
                    expiresAt
                });
                await ctx.context.adapter.create({
                    model: modelName.oauthConsent,
                    data: {
                        clientId: value.clientId,
                        userId: value.userId,
                        scopes: value.scope.join(" "),
                        consentGiven: true,
                        createdAt: /* @__PURE__ */ new Date(),
                        updatedAt: /* @__PURE__ */ new Date()
                    }
                });
                const redirectURI = new URL(value.redirectURI);
                redirectURI.searchParams.set("code", code);
                if (value.state) redirectURI.searchParams.set("state", value.state);
                return ctx.json({
                    redirectURI: redirectURI.toString()
                });
            }),
            oAuth2token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/token", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()),
                metadata: {
                    isAction: false
                }
            }, async (ctx)=>{
                let { body } = ctx;
                if (!body) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "request body not found",
                        error: "invalid_request"
                    });
                }
                if (body instanceof FormData) {
                    body = Object.fromEntries(body.entries());
                }
                if (!(body instanceof Object)) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "request body is not an object",
                        error: "invalid_request"
                    });
                }
                let { client_id, client_secret } = body;
                const authorization = ctx.request?.headers.get("authorization") || null;
                if (authorization && !client_id && !client_secret && authorization.startsWith("Basic ")) {
                    try {
                        const encoded = authorization.replace("Basic ", "");
                        const decoded = new TextDecoder().decode(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64"].decode(encoded));
                        if (!decoded.includes(":")) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                                error_description: "invalid authorization header format",
                                error: "invalid_client"
                            });
                        }
                        const [id, secret] = decoded.split(":");
                        if (!id || !secret) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                                error_description: "invalid authorization header format",
                                error: "invalid_client"
                            });
                        }
                        client_id = id;
                        client_secret = secret;
                    } catch (error) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "invalid authorization header format",
                            error: "invalid_client"
                        });
                    }
                }
                const now = Date.now();
                const iat = Math.floor(now / 1e3);
                const exp = iat + (opts.accessTokenExpiresIn ?? 3600);
                const accessTokenExpiresAt = new Date(exp * 1e3);
                const refreshTokenExpiresAt = new Date((iat + (opts.refreshTokenExpiresIn ?? 604800)) * 1e3);
                const { grant_type, code, redirect_uri, refresh_token, code_verifier } = body;
                if (grant_type === "refresh_token") {
                    if (!refresh_token) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                            error_description: "refresh_token is required",
                            error: "invalid_request"
                        });
                    }
                    const token = await ctx.context.adapter.findOne({
                        model: modelName.oauthAccessToken,
                        where: [
                            {
                                field: "refreshToken",
                                value: refresh_token.toString()
                            }
                        ]
                    });
                    if (!token) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "invalid refresh token",
                            error: "invalid_grant"
                        });
                    }
                    if (token.clientId !== client_id?.toString()) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "invalid client_id",
                            error: "invalid_client"
                        });
                    }
                    if (token.refreshTokenExpiresAt < /* @__PURE__ */ new Date()) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "refresh token expired",
                            error: "invalid_grant"
                        });
                    }
                    const accessToken2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z");
                    const newRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z");
                    await ctx.context.adapter.create({
                        model: modelName.oauthAccessToken,
                        data: {
                            accessToken: accessToken2,
                            refreshToken: newRefreshToken,
                            accessTokenExpiresAt,
                            refreshTokenExpiresAt,
                            clientId: client_id.toString(),
                            userId: token.userId,
                            scopes: token.scopes,
                            createdAt: new Date(iat * 1e3),
                            updatedAt: new Date(iat * 1e3)
                        }
                    });
                    return ctx.json({
                        access_token: accessToken2,
                        token_type: "bearer",
                        expires_in: opts.accessTokenExpiresIn,
                        refresh_token: newRefreshToken,
                        scope: token.scopes
                    });
                }
                if (!code) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "code is required",
                        error: "invalid_request"
                    });
                }
                if (options.requirePKCE && !code_verifier) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "code verifier is missing",
                        error: "invalid_request"
                    });
                }
                const verificationValue = await ctx.context.internalAdapter.findVerificationValue(code.toString());
                if (!verificationValue) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "invalid code",
                        error: "invalid_grant"
                    });
                }
                if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "code expired",
                        error: "invalid_grant"
                    });
                }
                await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
                if (!client_id) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "client_id is required",
                        error: "invalid_client"
                    });
                }
                if (!grant_type) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "grant_type is required",
                        error: "invalid_request"
                    });
                }
                if (grant_type !== "authorization_code") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "grant_type must be 'authorization_code'",
                        error: "unsupported_grant_type"
                    });
                }
                if (!redirect_uri) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "redirect_uri is required",
                        error: "invalid_request"
                    });
                }
                const client = await getClient(client_id.toString(), ctx.context.adapter, trustedClients);
                if (!client) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "invalid client_id",
                        error: "invalid_client"
                    });
                }
                if (client.disabled) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "client is disabled",
                        error: "invalid_client"
                    });
                }
                const value = JSON.parse(verificationValue.value);
                if (value.clientId !== client_id.toString()) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "invalid client_id",
                        error: "invalid_client"
                    });
                }
                if (value.redirectURI !== redirect_uri.toString()) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "invalid redirect_uri",
                        error: "invalid_client"
                    });
                }
                if (value.codeChallenge && !code_verifier) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error_description: "code verifier is missing",
                        error: "invalid_request"
                    });
                }
                if (client.type === "public") {
                    if (!code_verifier) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                            error_description: "code verifier is required for public clients",
                            error: "invalid_request"
                        });
                    }
                } else {
                    if (!client.clientSecret || !client_secret) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "client_secret is required for confidential clients",
                            error: "invalid_client"
                        });
                    }
                    const isValidSecret = await verifyStoredClientSecret(ctx, client.clientSecret, client_secret.toString());
                    if (!isValidSecret) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                            error_description: "invalid client_secret",
                            error: "invalid_client"
                        });
                    }
                }
                const challenge = value.codeChallengeMethod === "plain" ? code_verifier : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256", "base64urlnopad").digest(code_verifier);
                if (challenge !== value.codeChallenge) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "code verification failed",
                        error: "invalid_request"
                    });
                }
                const requestedScopes = value.scope;
                await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
                const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z");
                const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "A-Z", "a-z");
                await ctx.context.adapter.create({
                    model: modelName.oauthAccessToken,
                    data: {
                        accessToken,
                        refreshToken,
                        accessTokenExpiresAt,
                        refreshTokenExpiresAt,
                        clientId: client_id.toString(),
                        userId: value.userId,
                        scopes: requestedScopes.join(" "),
                        createdAt: new Date(iat * 1e3),
                        updatedAt: new Date(iat * 1e3)
                    }
                });
                const user = await ctx.context.internalAdapter.findUserById(value.userId);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "user not found",
                        error: "invalid_grant"
                    });
                }
                const profile = {
                    given_name: user.name.split(" ")[0],
                    family_name: user.name.split(" ")[1],
                    name: user.name,
                    profile: user.image,
                    updated_at: new Date(user.updatedAt).toISOString()
                };
                const email = {
                    email: user.email,
                    email_verified: user.emailVerified
                };
                const userClaims = {
                    ...requestedScopes.includes("profile") ? profile : {},
                    ...requestedScopes.includes("email") ? email : {}
                };
                const additionalUserClaims = options.getAdditionalUserInfoClaim ? await options.getAdditionalUserInfoClaim(user, requestedScopes, client) : {};
                const payload = {
                    sub: user.id,
                    aud: client_id.toString(),
                    iat,
                    auth_time: ctx.context.session ? new Date(ctx.context.session.session.createdAt).getTime() : void 0,
                    nonce: value.nonce,
                    acr: "urn:mace:incommon:iap:silver",
                    // default to silver - ⚠︎ this should be configurable and should be validated against the client's metadata
                    ...userClaims,
                    ...additionalUserClaims
                };
                const expirationTime = Math.floor(Date.now() / 1e3) + opts.accessTokenExpiresIn;
                let idToken;
                if (options.useJWTPlugin) {
                    const jwtPlugin = getJwtPlugin(ctx);
                    if (!jwtPlugin) {
                        ctx.context.logger.error("OIDC: `useJWTPlugin` is enabled but the JWT plugin is not available. Make sure you have the JWT Plugin in your plugins array or set `useJWTPlugin` to false.");
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                            error_description: "JWT plugin is not enabled",
                            error: "internal_server_error"
                        });
                    }
                    idToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$iy$2d$Q9EM9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])({
                        ...ctx,
                        context: {
                            ...ctx.context,
                            session: {
                                session: {
                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z"),
                                    createdAt: new Date(iat * 1e3),
                                    updatedAt: new Date(iat * 1e3),
                                    userId: user.id,
                                    expiresAt: accessTokenExpiresAt,
                                    token: accessToken,
                                    ipAddress: ctx.request?.headers.get("x-forwarded-for")
                                },
                                user
                            }
                        }
                    }, {
                        ...jwtPlugin.options,
                        jwt: {
                            ...jwtPlugin.options?.jwt,
                            getSubject: ()=>user.id,
                            audience: client_id.toString(),
                            issuer: jwtPlugin.options?.jwt?.issuer ?? ctx.context.options.baseURL,
                            expirationTime,
                            definePayload: ()=>payload
                        }
                    });
                } else {
                    idToken = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
                        alg: "HS256"
                    }).setIssuedAt(iat).setExpirationTime(accessTokenExpiresAt).sign(new TextEncoder().encode(client.clientSecret));
                }
                return ctx.json({
                    access_token: accessToken,
                    token_type: "Bearer",
                    expires_in: opts.accessTokenExpiresIn,
                    refresh_token: requestedScopes.includes("offline_access") ? refreshToken : void 0,
                    scope: requestedScopes.join(" "),
                    id_token: requestedScopes.includes("openid") ? idToken : void 0
                }, {
                    headers: {
                        "Cache-Control": "no-store",
                        Pragma: "no-cache"
                    }
                });
            }),
            oAuth2userInfo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/userinfo", {
                method: "GET",
                metadata: {
                    isAction: false,
                    openapi: {
                        description: "Get OAuth2 user information",
                        responses: {
                            "200": {
                                description: "User information retrieved successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                sub: {
                                                    type: "string",
                                                    description: "Subject identifier (user ID)"
                                                },
                                                email: {
                                                    type: "string",
                                                    format: "email",
                                                    nullable: true,
                                                    description: "User's email address, included if 'email' scope is granted"
                                                },
                                                name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's full name, included if 'profile' scope is granted"
                                                },
                                                picture: {
                                                    type: "string",
                                                    format: "uri",
                                                    nullable: true,
                                                    description: "User's profile picture URL, included if 'profile' scope is granted"
                                                },
                                                given_name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's given name, included if 'profile' scope is granted"
                                                },
                                                family_name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's family name, included if 'profile' scope is granted"
                                                },
                                                email_verified: {
                                                    type: "boolean",
                                                    nullable: true,
                                                    description: "Whether the email is verified, included if 'email' scope is granted"
                                                }
                                            },
                                            required: [
                                                "sub"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                if (!ctx.request) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "request not found",
                        error: "invalid_request"
                    });
                }
                const authorization = ctx.request.headers.get("authorization");
                if (!authorization) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "authorization header not found",
                        error: "invalid_request"
                    });
                }
                const token = authorization.replace("Bearer ", "");
                const accessToken = await ctx.context.adapter.findOne({
                    model: modelName.oauthAccessToken,
                    where: [
                        {
                            field: "accessToken",
                            value: token
                        }
                    ]
                });
                if (!accessToken) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "invalid access token",
                        error: "invalid_token"
                    });
                }
                if (accessToken.accessTokenExpiresAt < /* @__PURE__ */ new Date()) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "The Access Token expired",
                        error: "invalid_token"
                    });
                }
                const client = await getClient(accessToken.clientId, ctx.context.adapter, trustedClients);
                if (!client) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "client not found",
                        error: "invalid_token"
                    });
                }
                const user = await ctx.context.internalAdapter.findUserById(accessToken.userId);
                if (!user) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error_description: "user not found",
                        error: "invalid_token"
                    });
                }
                const requestedScopes = accessToken.scopes.split(" ");
                const baseUserClaims = {
                    sub: user.id,
                    email: requestedScopes.includes("email") ? user.email : void 0,
                    name: requestedScopes.includes("profile") ? user.name : void 0,
                    picture: requestedScopes.includes("profile") ? user.image : void 0,
                    given_name: requestedScopes.includes("profile") ? user.name.split(" ")[0] : void 0,
                    family_name: requestedScopes.includes("profile") ? user.name.split(" ")[1] : void 0,
                    email_verified: requestedScopes.includes("email") ? user.emailVerified : void 0
                };
                const userClaims = options.getAdditionalUserInfoClaim ? await options.getAdditionalUserInfoClaim(user, requestedScopes, client) : baseUserClaims;
                return ctx.json({
                    ...baseUserClaims,
                    ...userClaims
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/oauth2/register`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.registerOAuthApplication`
       *
       * **client:**
       * `authClient.oauth2.register`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/oidc-provider#api-method-oauth2-register)
       */ registerOAuthApplication: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/register", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    redirect_uris: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()).meta({
                        description: 'A list of redirect URIs. Eg: ["https://client.example.com/callback"]'
                    }),
                    token_endpoint_auth_method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "none",
                        "client_secret_basic",
                        "client_secret_post"
                    ]).meta({
                        description: 'The authentication method for the token endpoint. Eg: "client_secret_basic"'
                    }).default("client_secret_basic").optional(),
                    grant_types: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "authorization_code",
                        "implicit",
                        "password",
                        "client_credentials",
                        "refresh_token",
                        "urn:ietf:params:oauth:grant-type:jwt-bearer",
                        "urn:ietf:params:oauth:grant-type:saml2-bearer"
                    ])).meta({
                        description: 'The grant types supported by the application. Eg: ["authorization_code"]'
                    }).default([
                        "authorization_code"
                    ]).optional(),
                    response_types: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enum"]([
                        "code",
                        "token"
                    ])).meta({
                        description: 'The response types supported by the application. Eg: ["code"]'
                    }).default([
                        "code"
                    ]).optional(),
                    client_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The name of the application. Eg: "My App"'
                    }).optional(),
                    client_uri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The URI of the application. Eg: "https://client.example.com"'
                    }).optional(),
                    logo_uri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The URI of the application logo. Eg: "https://client.example.com/logo.png"'
                    }).optional(),
                    scope: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The scopes supported by the application. Separated by spaces. Eg: "profile email"'
                    }).optional(),
                    contacts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()).meta({
                        description: 'The contact information for the application. Eg: ["admin@example.com"]'
                    }).optional(),
                    tos_uri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The URI of the application terms of service. Eg: "https://client.example.com/tos"'
                    }).optional(),
                    policy_uri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The URI of the application privacy policy. Eg: "https://client.example.com/policy"'
                    }).optional(),
                    jwks_uri: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The URI of the application JWKS. Eg: "https://client.example.com/jwks"'
                    }).optional(),
                    jwks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).meta({
                        description: 'The JWKS of the application. Eg: {"keys": [{"kty": "RSA", "alg": "RS256", "use": "sig", "n": "...", "e": "..."}]}'
                    }).optional(),
                    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).meta({
                        description: 'The metadata of the application. Eg: {"key": "value"}'
                    }).optional(),
                    software_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The software ID of the application. Eg: "my-software"'
                    }).optional(),
                    software_version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The software version of the application. Eg: "1.0.0"'
                    }).optional(),
                    software_statement: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: "The software statement of the application."
                    }).optional()
                }),
                metadata: {
                    openapi: {
                        description: "Register an OAuth2 application",
                        responses: {
                            "200": {
                                description: "OAuth2 application registered successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                name: {
                                                    type: "string",
                                                    description: "Name of the OAuth2 application"
                                                },
                                                icon: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "Icon URL for the application"
                                                },
                                                metadata: {
                                                    type: "object",
                                                    additionalProperties: true,
                                                    nullable: true,
                                                    description: "Additional metadata for the application"
                                                },
                                                clientId: {
                                                    type: "string",
                                                    description: "Unique identifier for the client"
                                                },
                                                clientSecret: {
                                                    type: "string",
                                                    description: "Secret key for the client"
                                                },
                                                redirectURLs: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        format: "uri"
                                                    },
                                                    description: "List of allowed redirect URLs"
                                                },
                                                type: {
                                                    type: "string",
                                                    description: "Type of the client",
                                                    enum: [
                                                        "web"
                                                    ]
                                                },
                                                authenticationScheme: {
                                                    type: "string",
                                                    description: "Authentication scheme used by the client",
                                                    enum: [
                                                        "client_secret"
                                                    ]
                                                },
                                                disabled: {
                                                    type: "boolean",
                                                    description: "Whether the client is disabled",
                                                    enum: [
                                                        false
                                                    ]
                                                },
                                                userId: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "ID of the user who registered the client, null if registered anonymously"
                                                },
                                                createdAt: {
                                                    type: "string",
                                                    format: "date-time",
                                                    description: "Creation timestamp"
                                                },
                                                updatedAt: {
                                                    type: "string",
                                                    format: "date-time",
                                                    description: "Last update timestamp"
                                                }
                                            },
                                            required: [
                                                "name",
                                                "clientId",
                                                "clientSecret",
                                                "redirectURLs",
                                                "type",
                                                "authenticationScheme",
                                                "disabled",
                                                "createdAt",
                                                "updatedAt"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const body = ctx.body;
                const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
                if (!session && !options.allowDynamicClientRegistration) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                        error: "invalid_token",
                        error_description: "Authentication required for client registration"
                    });
                }
                if ((!body.grant_types || body.grant_types.includes("authorization_code") || body.grant_types.includes("implicit")) && (!body.redirect_uris || body.redirect_uris.length === 0)) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        error: "invalid_redirect_uri",
                        error_description: "Redirect URIs are required for authorization_code and implicit grant types"
                    });
                }
                if (body.grant_types && body.response_types) {
                    if (body.grant_types.includes("authorization_code") && !body.response_types.includes("code")) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "When 'authorization_code' grant type is used, 'code' response type must be included"
                        });
                    }
                    if (body.grant_types.includes("implicit") && !body.response_types.includes("token")) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "When 'implicit' grant type is used, 'token' response type must be included"
                        });
                    }
                }
                const clientId = options.generateClientId?.() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z");
                const clientSecret = options.generateClientSecret?.() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32, "a-z", "A-Z");
                const storedClientSecret = await storeClientSecret(ctx, clientSecret);
                const client = await ctx.context.adapter.create({
                    model: modelName.oauthClient,
                    data: {
                        name: body.client_name,
                        icon: body.logo_uri,
                        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
                        clientId,
                        clientSecret: storedClientSecret,
                        redirectURLs: body.redirect_uris.join(","),
                        type: "web",
                        authenticationScheme: body.token_endpoint_auth_method || "client_secret_basic",
                        disabled: false,
                        userId: session?.session.userId,
                        createdAt: /* @__PURE__ */ new Date(),
                        updatedAt: /* @__PURE__ */ new Date()
                    }
                });
                return ctx.json({
                    client_id: clientId,
                    ...client.type !== "public" ? {
                        client_secret: clientSecret,
                        client_secret_expires_at: 0
                    } : {},
                    client_id_issued_at: Math.floor(Date.now() / 1e3),
                    client_secret_expires_at: 0,
                    // 0 means it doesn't expire
                    redirect_uris: body.redirect_uris,
                    token_endpoint_auth_method: body.token_endpoint_auth_method || "client_secret_basic",
                    grant_types: body.grant_types || [
                        "authorization_code"
                    ],
                    response_types: body.response_types || [
                        "code"
                    ],
                    client_name: body.client_name,
                    client_uri: body.client_uri,
                    logo_uri: body.logo_uri,
                    scope: body.scope,
                    contacts: body.contacts,
                    tos_uri: body.tos_uri,
                    policy_uri: body.policy_uri,
                    jwks_uri: body.jwks_uri,
                    jwks: body.jwks,
                    software_id: body.software_id,
                    software_version: body.software_version,
                    software_statement: body.software_statement,
                    metadata: body.metadata
                }, {
                    status: 201,
                    headers: {
                        "Cache-Control": "no-store",
                        Pragma: "no-cache"
                    }
                });
            }),
            getOAuthClient: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/oauth2/client/:id", {
                method: "GET",
                use: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
                ],
                metadata: {
                    openapi: {
                        description: "Get OAuth2 client details",
                        responses: {
                            "200": {
                                description: "OAuth2 client retrieved successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                clientId: {
                                                    type: "string",
                                                    description: "Unique identifier for the client"
                                                },
                                                name: {
                                                    type: "string",
                                                    description: "Name of the OAuth2 application"
                                                },
                                                icon: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "Icon URL for the application"
                                                }
                                            },
                                            required: [
                                                "clientId",
                                                "name"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, async (ctx)=>{
                const client = await getClient(ctx.params.id, ctx.context.adapter, trustedClients);
                if (!client) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                        error_description: "client not found",
                        error: "not_found"
                    });
                }
                return ctx.json({
                    clientId: client.clientId,
                    name: client.name,
                    icon: client.icon
                });
            })
        },
        schema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["m"])(schema, options?.schema)
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.cK9aJBRe.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "E",
    ()=>EXTERNAL_ERROR_CODES,
    "I",
    ()=>INTERNAL_ERROR_CODES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/utils/index.mjs [app-route] (ecmascript)");
;
const EXTERNAL_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    VERIFICATION_FAILED: "Captcha verification failed",
    MISSING_RESPONSE: "Missing CAPTCHA response",
    UNKNOWN_ERROR: "Something went wrong"
});
const INTERNAL_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    MISSING_SECRET_KEY: "Missing secret key",
    SERVICE_UNAVAILABLE: "CAPTCHA service unavailable"
});
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BpA03GIs.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "d",
    ()=>deviceAuthorizationClient
]);
const deviceAuthorizationClient = ()=>{
    return {
        id: "device-authorization",
        $InferServerPlugin: {},
        pathMethods: {
            "/device/code": "POST",
            "/device/token": "POST",
            "/device": "GET",
            "/device/approve": "POST",
            "/device/deny": "POST"
        }
    };
};
;
}),
"[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DdryoYyv.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "A",
    ()=>API_KEY_TABLE_NAME,
    "E",
    ()=>ERROR_CODES,
    "a",
    ()=>apiKey,
    "d",
    ()=>defaultKeyHasher,
    "o",
    ()=>oneTimeToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-call@1.0.19/node_modules/better-call/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/middleware/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BX9UB8EP$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BX9UB8EP.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DEBtROF9.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/env/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/hex.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.B4Qoxdgc.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/db/adapter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BIQhnWWW$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BIQhnWWW.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DevHHPLH$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.DevHHPLH.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$otp$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/otp.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CP1SBr$2d$a$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CP1SBr-a.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$C4MGirLD$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.C4MGirLD.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CP$2d$SWMbr$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CP-SWMbr.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$fetch$2b$fetch$40$1$2e$1$2e$18$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-fetch+fetch@1.1.18/node_modules/@better-fetch/fetch/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+core@1.3.34_@b_7f4677f056d5bb26519a91d140066d9e/node_modules/@better-auth/core/dist/oauth2/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@better-auth+utils@0.3.0/node_modules/@better-auth/utils/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$custom$2d$session$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/plugins/custom-session/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$cK9aJBRe$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.cK9aJBRe.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.CW6D9eSx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.Cwj9dt6i.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$ClH5r3NH$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.ClH5r3NH.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$msGOU0m9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.msGOU0m9.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BKEtEpt0.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/shared/better-auth.BLxPPg5G.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$device$2d$authorization$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/better-auth@1.3.34_next@16._717015041dc7a9593f744ce9b7082596/node_modules/better-auth/dist/plugins/device-authorization/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const apiKeySchema = ({ timeWindow, rateLimitMax })=>({
        apikey: {
            fields: {
                /**
       * The name of the key.
       */ name: {
                    type: "string",
                    required: false,
                    input: false
                },
                /**
       * Shows the first few characters of the API key
       * This allows you to show those few characters in the UI to make it easier for users to identify the API key.
       */ start: {
                    type: "string",
                    required: false,
                    input: false
                },
                /**
       * The prefix of the key.
       */ prefix: {
                    type: "string",
                    required: false,
                    input: false
                },
                /**
       * The hashed key value.
       */ key: {
                    type: "string",
                    required: true,
                    input: false
                },
                /**
       * The user id of the user who created the key.
       */ userId: {
                    type: "string",
                    references: {
                        model: "user",
                        field: "id",
                        onDelete: "cascade"
                    },
                    required: true,
                    input: false
                },
                /**
       * The interval to refill the key in milliseconds.
       */ refillInterval: {
                    type: "number",
                    required: false,
                    input: false
                },
                /**
       * The amount to refill the remaining count of the key.
       */ refillAmount: {
                    type: "number",
                    required: false,
                    input: false
                },
                /**
       * The date and time when the key was last refilled.
       */ lastRefillAt: {
                    type: "date",
                    required: false,
                    input: false
                },
                /**
       * Whether the key is enabled.
       */ enabled: {
                    type: "boolean",
                    required: false,
                    input: false,
                    defaultValue: true
                },
                /**
       * Whether the key has rate limiting enabled.
       */ rateLimitEnabled: {
                    type: "boolean",
                    required: false,
                    input: false,
                    defaultValue: true
                },
                /**
       * The time window in milliseconds for the rate limit.
       */ rateLimitTimeWindow: {
                    type: "number",
                    required: false,
                    input: false,
                    defaultValue: timeWindow
                },
                /**
       * The maximum number of requests allowed within the `rateLimitTimeWindow`.
       */ rateLimitMax: {
                    type: "number",
                    required: false,
                    input: false,
                    defaultValue: rateLimitMax
                },
                /**
       * The number of requests made within the rate limit time window
       */ requestCount: {
                    type: "number",
                    required: false,
                    input: false,
                    defaultValue: 0
                },
                /**
       * The remaining number of requests before the key is revoked.
       *
       * If this is null, then the key is not revoked.
       *
       * If `refillInterval` & `refillAmount` are provided, than this will refill accordingly.
       */ remaining: {
                    type: "number",
                    required: false,
                    input: false
                },
                /**
       * The date and time of the last request made to the key.
       */ lastRequest: {
                    type: "date",
                    required: false,
                    input: false
                },
                /**
       * The date and time when the key will expire.
       */ expiresAt: {
                    type: "date",
                    required: false,
                    input: false
                },
                /**
       * The date and time when the key was created.
       */ createdAt: {
                    type: "date",
                    required: true,
                    input: false
                },
                /**
       * The date and time when the key was last updated.
       */ updatedAt: {
                    type: "date",
                    required: true,
                    input: false
                },
                /**
       * The permissions of the key.
       */ permissions: {
                    type: "string",
                    required: false,
                    input: false
                },
                /**
       * Any additional metadata you want to store with the key.
       */ metadata: {
                    type: "string",
                    required: false,
                    input: true,
                    transform: {
                        input (value) {
                            return JSON.stringify(value);
                        },
                        output (value) {
                            if (!value) return null;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$msGOU0m9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["p"])(value);
                        }
                    }
                }
            }
        }
    });
function createApiKey({ keyGenerator, opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/create", {
        method: "POST",
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "Name of the Api Key"
            }).optional(),
            expiresIn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Expiration time of the Api Key in seconds"
            }).min(1).optional().nullable().default(null),
            userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                description: 'User Id of the user that the Api Key belongs to. server-only. Eg: "user-id"'
            }).optional(),
            prefix: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "Prefix of the Api Key"
            }).regex(/^[a-zA-Z0-9_-]+$/, {
                message: "Invalid prefix format, must be alphanumeric and contain only underscores and hyphens."
            }).optional(),
            remaining: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Remaining number of requests. Server side only"
            }).min(0).optional().nullable().default(null),
            metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]().optional(),
            refillAmount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Amount to refill the remaining count of the Api Key. server-only. Eg: 100"
            }).min(1).optional(),
            refillInterval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Interval to refill the Api Key in milliseconds. server-only. Eg: 1000"
            }).optional(),
            rateLimitTimeWindow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "The duration in milliseconds where each request is counted. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 1000"
            }).optional(),
            rateLimitMax: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100"
            }).optional(),
            rateLimitEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
                description: "Whether the key has rate limiting enabled. server-only. Eg: true"
            }).optional(),
            permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]())).meta({
                description: "Permissions of the Api Key."
            }).optional()
        }),
        metadata: {
            openapi: {
                description: "Create a new API key for a user",
                responses: {
                    "200": {
                        description: "API key created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            description: "Unique identifier of the API key"
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Creation timestamp"
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Last update timestamp"
                                        },
                                        name: {
                                            type: "string",
                                            nullable: true,
                                            description: "Name of the API key"
                                        },
                                        prefix: {
                                            type: "string",
                                            nullable: true,
                                            description: "Prefix of the API key"
                                        },
                                        start: {
                                            type: "string",
                                            nullable: true,
                                            description: "Starting characters of the key (if configured)"
                                        },
                                        key: {
                                            type: "string",
                                            description: "The full API key (only returned on creation)"
                                        },
                                        enabled: {
                                            type: "boolean",
                                            description: "Whether the key is enabled"
                                        },
                                        expiresAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "Expiration timestamp"
                                        },
                                        userId: {
                                            type: "string",
                                            description: "ID of the user owning the key"
                                        },
                                        lastRefillAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "Last refill timestamp"
                                        },
                                        lastRequest: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "Last request timestamp"
                                        },
                                        metadata: {
                                            type: "object",
                                            nullable: true,
                                            additionalProperties: true,
                                            description: "Metadata associated with the key"
                                        },
                                        rateLimitMax: {
                                            type: "number",
                                            nullable: true,
                                            description: "Maximum requests in time window"
                                        },
                                        rateLimitTimeWindow: {
                                            type: "number",
                                            nullable: true,
                                            description: "Rate limit time window in milliseconds"
                                        },
                                        remaining: {
                                            type: "number",
                                            nullable: true,
                                            description: "Remaining requests"
                                        },
                                        refillAmount: {
                                            type: "number",
                                            nullable: true,
                                            description: "Amount to refill"
                                        },
                                        refillInterval: {
                                            type: "number",
                                            nullable: true,
                                            description: "Refill interval in milliseconds"
                                        },
                                        rateLimitEnabled: {
                                            type: "boolean",
                                            description: "Whether rate limiting is enabled"
                                        },
                                        requestCount: {
                                            type: "number",
                                            description: "Current request count in window"
                                        },
                                        permissions: {
                                            type: "object",
                                            nullable: true,
                                            additionalProperties: {
                                                type: "array",
                                                items: {
                                                    type: "string"
                                                }
                                            },
                                            description: "Permissions associated with the key"
                                        }
                                    },
                                    required: [
                                        "id",
                                        "createdAt",
                                        "updatedAt",
                                        "key",
                                        "enabled",
                                        "userId",
                                        "rateLimitEnabled",
                                        "requestCount"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const { name, expiresIn, prefix, remaining, metadata, refillAmount, refillInterval, permissions, rateLimitMax, rateLimitTimeWindow, rateLimitEnabled } = ctx.body;
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
        const authRequired = ctx.request || ctx.headers;
        const user = authRequired && !session ? null : session?.user || {
            id: ctx.body.userId
        };
        if (!user?.id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.UNAUTHORIZED_SESSION
            });
        }
        if (session && ctx.body.userId && session?.user.id !== ctx.body.userId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.UNAUTHORIZED_SESSION
            });
        }
        if (authRequired) {
            if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || permissions !== void 0 || remaining !== null) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.SERVER_ONLY_PROPERTY
                });
            }
        }
        if (metadata) {
            if (opts.enableMetadata === false) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.METADATA_DISABLED
                });
            }
            if (typeof metadata !== "object") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_METADATA_TYPE
                });
            }
        }
        if (refillAmount && !refillInterval) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
            });
        }
        if (refillInterval && !refillAmount) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                message: ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED
            });
        }
        if (expiresIn) {
            if (opts.keyExpiration.disableCustomExpiresTime === true) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.KEY_DISABLED_EXPIRATION
                });
            }
            const expiresIn_in_days = expiresIn / (60 * 60 * 24);
            if (opts.keyExpiration.minExpiresIn > expiresIn_in_days) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
                });
            } else if (opts.keyExpiration.maxExpiresIn < expiresIn_in_days) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
                });
            }
        }
        if (prefix) {
            if (prefix.length < opts.minimumPrefixLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_PREFIX_LENGTH
                });
            }
            if (prefix.length > opts.maximumPrefixLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_PREFIX_LENGTH
                });
            }
        }
        if (name) {
            if (name.length < opts.minimumNameLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_NAME_LENGTH
                });
            }
            if (name.length > opts.maximumNameLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_NAME_LENGTH
                });
            }
        } else if (opts.requireName) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                message: ERROR_CODES.NAME_REQUIRED
            });
        }
        deleteAllExpiredApiKeys(ctx.context);
        const key = await keyGenerator({
            length: opts.defaultKeyLength,
            prefix: prefix || opts.defaultPrefix
        });
        const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
        let start = null;
        if (opts.startingCharactersConfig.shouldStore) {
            start = key.substring(0, opts.startingCharactersConfig.charactersLength);
        }
        const defaultPermissions = opts.permissions?.defaultPermissions ? typeof opts.permissions.defaultPermissions === "function" ? await opts.permissions.defaultPermissions(user.id, ctx) : opts.permissions.defaultPermissions : void 0;
        const permissionsToApply = permissions ? JSON.stringify(permissions) : defaultPermissions ? JSON.stringify(defaultPermissions) : void 0;
        let data = {
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date(),
            name: name ?? null,
            prefix: prefix ?? opts.defaultPrefix ?? null,
            start,
            key: hashed,
            enabled: true,
            expiresAt: expiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(expiresIn, "sec") : opts.keyExpiration.defaultExpiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(opts.keyExpiration.defaultExpiresIn, "sec") : null,
            userId: user.id,
            lastRefillAt: null,
            lastRequest: null,
            metadata: null,
            rateLimitMax: rateLimitMax ?? opts.rateLimit.maxRequests ?? null,
            rateLimitTimeWindow: rateLimitTimeWindow ?? opts.rateLimit.timeWindow ?? null,
            remaining: remaining === null ? remaining : remaining ?? refillAmount ?? null,
            refillAmount: refillAmount ?? null,
            refillInterval: refillInterval ?? null,
            rateLimitEnabled: rateLimitEnabled === void 0 ? opts.rateLimit.enabled ?? true : rateLimitEnabled,
            requestCount: 0,
            //@ts-expect-error - we intentionally save the permissions as string on DB.
            permissions: permissionsToApply
        };
        if (metadata) {
            data.metadata = schema.apikey.fields.metadata.transform.input(metadata);
        }
        const apiKey = await ctx.context.adapter.create({
            model: API_KEY_TABLE_NAME,
            data
        });
        return ctx.json({
            ...apiKey,
            key,
            metadata: metadata ?? null,
            permissions: apiKey.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(apiKey.permissions) : null
        });
    });
}
function deleteApiKey({ opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/delete", {
        method: "POST",
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            keyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "The id of the Api Key"
            })
        }),
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
        ],
        metadata: {
            openapi: {
                description: "Delete an existing API key",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    keyId: {
                                        type: "string",
                                        description: "The id of the API key to delete"
                                    }
                                },
                                required: [
                                    "keyId"
                                ]
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "API key deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            description: "Indicates if the API key was successfully deleted"
                                        }
                                    },
                                    required: [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const { keyId } = ctx.body;
        const session = ctx.context.session;
        if (session.user.banned === true) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.USER_BANNED
            });
        }
        const apiKey = await ctx.context.adapter.findOne({
            model: API_KEY_TABLE_NAME,
            where: [
                {
                    field: "id",
                    value: keyId
                }
            ]
        });
        if (!apiKey || apiKey.userId !== session.user.id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                message: ERROR_CODES.KEY_NOT_FOUND
            });
        }
        try {
            await ctx.context.adapter.delete({
                model: API_KEY_TABLE_NAME,
                where: [
                    {
                        field: "id",
                        value: apiKey.id
                    }
                ]
            });
        } catch (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                message: error?.message
            });
        }
        deleteAllExpiredApiKeys(ctx.context);
        return ctx.json({
            success: true
        });
    });
}
function getApiKey({ opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/get", {
        method: "GET",
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "The id of the Api Key"
            })
        }),
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
        ],
        metadata: {
            openapi: {
                description: "Retrieve an existing API key by ID",
                responses: {
                    "200": {
                        description: "API key retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            description: "ID"
                                        },
                                        name: {
                                            type: "string",
                                            nullable: true,
                                            description: "The name of the key"
                                        },
                                        start: {
                                            type: "string",
                                            nullable: true,
                                            description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                                        },
                                        prefix: {
                                            type: "string",
                                            nullable: true,
                                            description: "The API Key prefix. Stored as plain text."
                                        },
                                        userId: {
                                            type: "string",
                                            description: "The owner of the user id"
                                        },
                                        refillInterval: {
                                            type: "number",
                                            nullable: true,
                                            description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
                                        },
                                        refillAmount: {
                                            type: "number",
                                            nullable: true,
                                            description: "The amount to refill"
                                        },
                                        lastRefillAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "The last refill date"
                                        },
                                        enabled: {
                                            type: "boolean",
                                            description: "Sets if key is enabled or disabled",
                                            default: true
                                        },
                                        rateLimitEnabled: {
                                            type: "boolean",
                                            description: "Whether the key has rate limiting enabled"
                                        },
                                        rateLimitTimeWindow: {
                                            type: "number",
                                            nullable: true,
                                            description: "The duration in milliseconds"
                                        },
                                        rateLimitMax: {
                                            type: "number",
                                            nullable: true,
                                            description: "Maximum amount of requests allowed within a window"
                                        },
                                        requestCount: {
                                            type: "number",
                                            description: "The number of requests made within the rate limit time window"
                                        },
                                        remaining: {
                                            type: "number",
                                            nullable: true,
                                            description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                                        },
                                        lastRequest: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "When last request occurred"
                                        },
                                        expiresAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "Expiry date of a key"
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "created at"
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "updated at"
                                        },
                                        metadata: {
                                            type: "object",
                                            nullable: true,
                                            additionalProperties: true,
                                            description: "Extra metadata about the apiKey"
                                        },
                                        permissions: {
                                            type: "string",
                                            nullable: true,
                                            description: "Permissions for the api key (stored as JSON string)"
                                        }
                                    },
                                    required: [
                                        "id",
                                        "userId",
                                        "enabled",
                                        "rateLimitEnabled",
                                        "requestCount",
                                        "createdAt",
                                        "updatedAt"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const { id } = ctx.query;
        const session = ctx.context.session;
        let apiKey = await ctx.context.adapter.findOne({
            model: API_KEY_TABLE_NAME,
            where: [
                {
                    field: "id",
                    value: id
                },
                {
                    field: "userId",
                    value: session.user.id
                }
            ]
        });
        if (!apiKey) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                message: ERROR_CODES.KEY_NOT_FOUND
            });
        }
        deleteAllExpiredApiKeys(ctx.context);
        apiKey.metadata = schema.apikey.fields.metadata.transform.output(apiKey.metadata);
        const { key, ...returningApiKey } = apiKey;
        return ctx.json({
            ...returningApiKey,
            permissions: returningApiKey.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(returningApiKey.permissions) : null
        });
    });
}
function updateApiKey({ opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/update", {
        method: "POST",
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            keyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "The id of the Api Key"
            }),
            userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["coerce"].string().meta({
                description: 'The id of the user which the api key belongs to. server-only. Eg: "some-user-id"'
            }).optional(),
            name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "The name of the key"
            }).optional(),
            enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
                description: "Whether the Api Key is enabled or not"
            }).optional(),
            remaining: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "The number of remaining requests"
            }).min(1).optional(),
            refillAmount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "The refill amount"
            }).optional(),
            refillInterval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "The refill interval"
            }).optional(),
            metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]().optional(),
            expiresIn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Expiration time of the Api Key in seconds"
            }).min(1).optional().nullable(),
            rateLimitEnabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
                description: "Whether the key has rate limiting enabled."
            }).optional(),
            rateLimitTimeWindow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "The duration in milliseconds where each request is counted. server-only. Eg: 1000"
            }).optional(),
            rateLimitMax: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
                description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100"
            }).optional(),
            permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]())).meta({
                description: "Update the permissions on the API Key. server-only."
            }).optional().nullable()
        }),
        metadata: {
            openapi: {
                description: "Update an existing API key by ID",
                responses: {
                    "200": {
                        description: "API key updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string",
                                            description: "ID"
                                        },
                                        name: {
                                            type: "string",
                                            nullable: true,
                                            description: "The name of the key"
                                        },
                                        start: {
                                            type: "string",
                                            nullable: true,
                                            description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                                        },
                                        prefix: {
                                            type: "string",
                                            nullable: true,
                                            description: "The API Key prefix. Stored as plain text."
                                        },
                                        userId: {
                                            type: "string",
                                            description: "The owner of the user id"
                                        },
                                        refillInterval: {
                                            type: "number",
                                            nullable: true,
                                            description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
                                        },
                                        refillAmount: {
                                            type: "number",
                                            nullable: true,
                                            description: "The amount to refill"
                                        },
                                        lastRefillAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "The last refill date"
                                        },
                                        enabled: {
                                            type: "boolean",
                                            description: "Sets if key is enabled or disabled",
                                            default: true
                                        },
                                        rateLimitEnabled: {
                                            type: "boolean",
                                            description: "Whether the key has rate limiting enabled"
                                        },
                                        rateLimitTimeWindow: {
                                            type: "number",
                                            nullable: true,
                                            description: "The duration in milliseconds"
                                        },
                                        rateLimitMax: {
                                            type: "number",
                                            nullable: true,
                                            description: "Maximum amount of requests allowed within a window"
                                        },
                                        requestCount: {
                                            type: "number",
                                            description: "The number of requests made within the rate limit time window"
                                        },
                                        remaining: {
                                            type: "number",
                                            nullable: true,
                                            description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                                        },
                                        lastRequest: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "When last request occurred"
                                        },
                                        expiresAt: {
                                            type: "string",
                                            format: "date-time",
                                            nullable: true,
                                            description: "Expiry date of a key"
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "created at"
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time",
                                            description: "updated at"
                                        },
                                        metadata: {
                                            type: "object",
                                            nullable: true,
                                            additionalProperties: true,
                                            description: "Extra metadata about the apiKey"
                                        },
                                        permissions: {
                                            type: "string",
                                            nullable: true,
                                            description: "Permissions for the api key (stored as JSON string)"
                                        }
                                    },
                                    required: [
                                        "id",
                                        "userId",
                                        "enabled",
                                        "rateLimitEnabled",
                                        "requestCount",
                                        "createdAt",
                                        "updatedAt"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const { keyId, expiresIn, enabled, metadata, refillAmount, refillInterval, remaining, name, permissions, rateLimitEnabled, rateLimitTimeWindow, rateLimitMax } = ctx.body;
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx);
        const authRequired = (ctx.request || ctx.headers) && !ctx.body.userId;
        const user = session?.user ?? (authRequired ? null : {
            id: ctx.body.userId
        });
        if (!user?.id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.UNAUTHORIZED_SESSION
            });
        }
        if (authRequired) {
            if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || remaining !== void 0 || permissions !== void 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.SERVER_ONLY_PROPERTY
                });
            }
        }
        const apiKey = await ctx.context.adapter.findOne({
            model: API_KEY_TABLE_NAME,
            where: [
                {
                    field: "id",
                    value: keyId
                },
                {
                    field: "userId",
                    value: user.id
                }
            ]
        });
        if (!apiKey) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("NOT_FOUND", {
                message: ERROR_CODES.KEY_NOT_FOUND
            });
        }
        let newValues = {};
        if (name !== void 0) {
            if (name.length < opts.minimumNameLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_NAME_LENGTH
                });
            } else if (name.length > opts.maximumNameLength) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_NAME_LENGTH
                });
            }
            newValues.name = name;
        }
        if (enabled !== void 0) {
            newValues.enabled = enabled;
        }
        if (expiresIn !== void 0) {
            if (opts.keyExpiration.disableCustomExpiresTime === true) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.KEY_DISABLED_EXPIRATION
                });
            }
            if (expiresIn !== null) {
                const expiresIn_in_days = expiresIn / (60 * 60 * 24);
                if (expiresIn_in_days < opts.keyExpiration.minExpiresIn) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
                    });
                } else if (expiresIn_in_days > opts.keyExpiration.maxExpiresIn) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                        message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
                    });
                }
            }
            newValues.expiresAt = expiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(expiresIn, "sec") : null;
        }
        if (metadata !== void 0) {
            if (typeof metadata !== "object") {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.INVALID_METADATA_TYPE
                });
            }
            newValues.metadata = schema.apikey.fields.metadata.transform.input(metadata);
        }
        if (remaining !== void 0) {
            newValues.remaining = remaining;
        }
        if (refillAmount !== void 0 || refillInterval !== void 0) {
            if (refillAmount !== void 0 && refillInterval === void 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
                });
            } else if (refillInterval !== void 0 && refillAmount === void 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                    message: ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED
                });
            }
            newValues.refillAmount = refillAmount;
            newValues.refillInterval = refillInterval;
        }
        if (rateLimitEnabled !== void 0) {
            newValues.rateLimitEnabled = rateLimitEnabled;
        }
        if (rateLimitTimeWindow !== void 0) {
            newValues.rateLimitTimeWindow = rateLimitTimeWindow;
        }
        if (rateLimitMax !== void 0) {
            newValues.rateLimitMax = rateLimitMax;
        }
        if (permissions !== void 0) {
            newValues.permissions = JSON.stringify(permissions);
        }
        if (Object.keys(newValues).length === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                message: ERROR_CODES.NO_VALUES_TO_UPDATE
            });
        }
        let newApiKey = apiKey;
        try {
            let result = await ctx.context.adapter.update({
                model: API_KEY_TABLE_NAME,
                where: [
                    {
                        field: "id",
                        value: apiKey.id
                    }
                ],
                update: {
                    lastRequest: /* @__PURE__ */ new Date(),
                    remaining: apiKey.remaining === null ? null : apiKey.remaining - 1,
                    ...newValues
                }
            });
            if (result) newApiKey = result;
        } catch (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
                message: error?.message
            });
        }
        deleteAllExpiredApiKeys(ctx.context);
        newApiKey.metadata = schema.apikey.fields.metadata.transform.output(newApiKey.metadata);
        const { key, ...returningApiKey } = newApiKey;
        return ctx.json({
            ...returningApiKey,
            permissions: returningApiKey.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(returningApiKey.permissions) : null
        });
    });
}
function isRateLimited(apiKey, opts) {
    const now = /* @__PURE__ */ new Date();
    const lastRequest = apiKey.lastRequest;
    const rateLimitTimeWindow = apiKey.rateLimitTimeWindow;
    const rateLimitMax = apiKey.rateLimitMax;
    let requestCount = apiKey.requestCount;
    if (opts.rateLimit.enabled === false) return {
        success: true,
        message: null,
        update: {
            lastRequest: now
        },
        tryAgainIn: null
    };
    if (apiKey.rateLimitEnabled === false) return {
        success: true,
        message: null,
        update: {
            lastRequest: now
        },
        tryAgainIn: null
    };
    if (rateLimitTimeWindow === null || rateLimitMax === null) {
        return {
            success: true,
            message: null,
            update: null,
            tryAgainIn: null
        };
    }
    if (lastRequest === null) {
        return {
            success: true,
            message: null,
            update: {
                lastRequest: now,
                requestCount: 1
            },
            tryAgainIn: null
        };
    }
    const timeSinceLastRequest = now.getTime() - new Date(lastRequest).getTime();
    if (timeSinceLastRequest > rateLimitTimeWindow) {
        return {
            success: true,
            message: null,
            update: {
                lastRequest: now,
                requestCount: 1
            },
            tryAgainIn: null
        };
    }
    if (requestCount >= rateLimitMax) {
        return {
            success: false,
            message: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            update: null,
            tryAgainIn: Math.ceil(rateLimitTimeWindow - timeSinceLastRequest)
        };
    }
    requestCount++;
    return {
        success: true,
        message: null,
        tryAgainIn: null,
        update: {
            lastRequest: now,
            requestCount
        }
    };
}
async function validateApiKey({ hashedKey, ctx, opts, schema, permissions }) {
    const apiKey = await ctx.context.adapter.findOne({
        model: API_KEY_TABLE_NAME,
        where: [
            {
                field: "key",
                value: hashedKey
            }
        ]
    });
    if (!apiKey) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            message: ERROR_CODES.INVALID_API_KEY
        });
    }
    if (apiKey.enabled === false) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            message: ERROR_CODES.KEY_DISABLED,
            code: "KEY_DISABLED"
        });
    }
    if (apiKey.expiresAt) {
        const now = /* @__PURE__ */ new Date().getTime();
        const expiresAt = new Date(apiKey.expiresAt).getTime();
        if (now > expiresAt) {
            try {
                ctx.context.adapter.delete({
                    model: API_KEY_TABLE_NAME,
                    where: [
                        {
                            field: "id",
                            value: apiKey.id
                        }
                    ]
                });
            } catch (error) {
                ctx.context.logger.error(`Failed to delete expired API keys:`, error);
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.KEY_EXPIRED,
                code: "KEY_EXPIRED"
            });
        }
    }
    if (permissions) {
        const apiKeyPermissions = apiKey.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(apiKey.permissions) : null;
        if (!apiKeyPermissions) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.KEY_NOT_FOUND,
                code: "KEY_NOT_FOUND"
            });
        }
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BLxPPg5G$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["r"])(apiKeyPermissions);
        const result = r.authorize(permissions);
        if (!result.success) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: ERROR_CODES.KEY_NOT_FOUND,
                code: "KEY_NOT_FOUND"
            });
        }
    }
    let remaining = apiKey.remaining;
    let lastRefillAt = apiKey.lastRefillAt;
    if (apiKey.remaining === 0 && apiKey.refillAmount === null) {
        try {
            ctx.context.adapter.delete({
                model: API_KEY_TABLE_NAME,
                where: [
                    {
                        field: "id",
                        value: apiKey.id
                    }
                ]
            });
        } catch (error) {
            ctx.context.logger.error(`Failed to delete expired API keys:`, error);
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("TOO_MANY_REQUESTS", {
            message: ERROR_CODES.USAGE_EXCEEDED,
            code: "USAGE_EXCEEDED"
        });
    } else if (remaining !== null) {
        let now = /* @__PURE__ */ new Date().getTime();
        const refillInterval = apiKey.refillInterval;
        const refillAmount = apiKey.refillAmount;
        let lastTime = new Date(lastRefillAt ?? apiKey.createdAt).getTime();
        if (refillInterval && refillAmount) {
            const timeSinceLastRequest = now - lastTime;
            if (timeSinceLastRequest > refillInterval) {
                remaining = refillAmount;
                lastRefillAt = /* @__PURE__ */ new Date();
            }
        }
        if (remaining === 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("TOO_MANY_REQUESTS", {
                message: ERROR_CODES.USAGE_EXCEEDED,
                code: "USAGE_EXCEEDED"
            });
        } else {
            remaining--;
        }
    }
    const { message, success, update, tryAgainIn } = isRateLimited(apiKey, opts);
    const newApiKey = await ctx.context.adapter.update({
        model: API_KEY_TABLE_NAME,
        where: [
            {
                field: "id",
                value: apiKey.id
            }
        ],
        update: {
            ...update,
            remaining,
            lastRefillAt
        }
    });
    if (!newApiKey) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
            message: ERROR_CODES.FAILED_TO_UPDATE_API_KEY,
            code: "INTERNAL_SERVER_ERROR"
        });
    }
    if (success === false) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            message: message ?? void 0,
            code: "RATE_LIMITED",
            details: {
                tryAgainIn
            }
        });
    }
    return newApiKey;
}
function verifyApiKey({ opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/verify", {
        method: "POST",
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "The key to verify"
            }),
            permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]())).meta({
                description: "The permissions to verify."
            }).optional()
        }),
        metadata: {
            SERVER_ONLY: true
        }
    }, async (ctx)=>{
        const { key } = ctx.body;
        if (key.length < opts.defaultKeyLength) {
            return ctx.json({
                valid: false,
                error: {
                    message: ERROR_CODES.INVALID_API_KEY,
                    code: "KEY_NOT_FOUND"
                },
                key: null
            });
        }
        if (opts.customAPIKeyValidator) {
            const isValid = await opts.customAPIKeyValidator({
                ctx,
                key
            });
            if (!isValid) {
                return ctx.json({
                    valid: false,
                    error: {
                        message: ERROR_CODES.INVALID_API_KEY,
                        code: "KEY_NOT_FOUND"
                    },
                    key: null
                });
            }
        }
        const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
        let apiKey = null;
        try {
            apiKey = await validateApiKey({
                hashedKey: hashed,
                permissions: ctx.body.permissions,
                ctx,
                opts,
                schema
            });
            await deleteAllExpiredApiKeys(ctx.context);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]) {
                return ctx.json({
                    valid: false,
                    error: {
                        message: error.body?.message,
                        code: error.body?.code
                    },
                    key: null
                });
            }
            return ctx.json({
                valid: false,
                error: {
                    message: ERROR_CODES.INVALID_API_KEY,
                    code: "INVALID_API_KEY"
                },
                key: null
            });
        }
        const { key: _, ...returningApiKey } = apiKey ?? {
            key: 1,
            permissions: void 0
        };
        if ("metadata" in returningApiKey) {
            returningApiKey.metadata = schema.apikey.fields.metadata.transform.output(returningApiKey.metadata);
        }
        returningApiKey.permissions = returningApiKey.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(returningApiKey.permissions) : null;
        return ctx.json({
            valid: true,
            error: null,
            key: apiKey === null ? null : returningApiKey
        });
    });
}
function listApiKeys({ opts, schema, deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/list", {
        method: "GET",
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
        ],
        metadata: {
            openapi: {
                description: "List all API keys for the authenticated user",
                responses: {
                    "200": {
                        description: "API keys retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                description: "ID"
                                            },
                                            name: {
                                                type: "string",
                                                nullable: true,
                                                description: "The name of the key"
                                            },
                                            start: {
                                                type: "string",
                                                nullable: true,
                                                description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                                            },
                                            prefix: {
                                                type: "string",
                                                nullable: true,
                                                description: "The API Key prefix. Stored as plain text."
                                            },
                                            userId: {
                                                type: "string",
                                                description: "The owner of the user id"
                                            },
                                            refillInterval: {
                                                type: "number",
                                                nullable: true,
                                                description: "The interval in milliseconds between refills of the `remaining` count. Example: 3600000 // refill every hour (3600000ms = 1h)"
                                            },
                                            refillAmount: {
                                                type: "number",
                                                nullable: true,
                                                description: "The amount to refill"
                                            },
                                            lastRefillAt: {
                                                type: "string",
                                                format: "date-time",
                                                nullable: true,
                                                description: "The last refill date"
                                            },
                                            enabled: {
                                                type: "boolean",
                                                description: "Sets if key is enabled or disabled",
                                                default: true
                                            },
                                            rateLimitEnabled: {
                                                type: "boolean",
                                                description: "Whether the key has rate limiting enabled"
                                            },
                                            rateLimitTimeWindow: {
                                                type: "number",
                                                nullable: true,
                                                description: "The duration in milliseconds"
                                            },
                                            rateLimitMax: {
                                                type: "number",
                                                nullable: true,
                                                description: "Maximum amount of requests allowed within a window"
                                            },
                                            requestCount: {
                                                type: "number",
                                                description: "The number of requests made within the rate limit time window"
                                            },
                                            remaining: {
                                                type: "number",
                                                nullable: true,
                                                description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                                            },
                                            lastRequest: {
                                                type: "string",
                                                format: "date-time",
                                                nullable: true,
                                                description: "When last request occurred"
                                            },
                                            expiresAt: {
                                                type: "string",
                                                format: "date-time",
                                                nullable: true,
                                                description: "Expiry date of a key"
                                            },
                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "created at"
                                            },
                                            updatedAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "updated at"
                                            },
                                            metadata: {
                                                type: "object",
                                                nullable: true,
                                                additionalProperties: true,
                                                description: "Extra metadata about the apiKey"
                                            },
                                            permissions: {
                                                type: "string",
                                                nullable: true,
                                                description: "Permissions for the api key (stored as JSON string)"
                                            }
                                        },
                                        required: [
                                            "id",
                                            "userId",
                                            "enabled",
                                            "rateLimitEnabled",
                                            "requestCount",
                                            "createdAt",
                                            "updatedAt"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const session = ctx.context.session;
        let apiKeys = await ctx.context.adapter.findMany({
            model: API_KEY_TABLE_NAME,
            where: [
                {
                    field: "userId",
                    value: session.user.id
                }
            ]
        });
        deleteAllExpiredApiKeys(ctx.context);
        apiKeys = apiKeys.map((apiKey)=>{
            return {
                ...apiKey,
                metadata: schema.apikey.fields.metadata.transform.output(apiKey.metadata)
            };
        });
        let returningApiKey = apiKeys.map((x)=>{
            const { key, ...returningApiKey2 } = x;
            return {
                ...returningApiKey2,
                permissions: returningApiKey2.permissions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$BKEtEpt0$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"])(returningApiKey2.permissions) : null
            };
        });
        return ctx.json(returningApiKey);
    });
}
function deleteAllExpiredApiKeysEndpoint({ deleteAllExpiredApiKeys }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/api-key/delete-all-expired-api-keys", {
        method: "POST",
        metadata: {
            SERVER_ONLY: true,
            client: false
        }
    }, async (ctx)=>{
        try {
            await deleteAllExpiredApiKeys(ctx.context, true);
        } catch (error) {
            ctx.context.logger.error("[API KEY PLUGIN] Failed to delete expired API keys:", error);
            return ctx.json({
                success: false,
                error
            });
        }
        return ctx.json({
            success: true,
            error: null
        });
    });
}
let lastChecked = null;
async function deleteAllExpiredApiKeys(ctx, byPassLastCheckTime = false) {
    if (lastChecked && !byPassLastCheckTime) {
        const now = /* @__PURE__ */ new Date();
        const diff = now.getTime() - lastChecked.getTime();
        if (diff < 1e4) {
            return;
        }
    }
    lastChecked = /* @__PURE__ */ new Date();
    await ctx.adapter.deleteMany({
        model: API_KEY_TABLE_NAME,
        where: [
            {
                field: "expiresAt",
                operator: "lt",
                value: /* @__PURE__ */ new Date()
            },
            {
                field: "expiresAt",
                operator: "ne",
                value: null
            }
        ]
    }).catch((error)=>{
        ctx.logger.error(`Failed to delete expired API keys:`, error);
    });
}
function createApiKeyRoutes({ keyGenerator, opts, schema }) {
    return {
        createApiKey: createApiKey({
            keyGenerator,
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        verifyApiKey: verifyApiKey({
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        getApiKey: getApiKey({
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        updateApiKey: updateApiKey({
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        deleteApiKey: deleteApiKey({
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        listApiKeys: listApiKeys({
            opts,
            schema,
            deleteAllExpiredApiKeys
        }),
        deleteAllExpiredApiKeys: deleteAllExpiredApiKeysEndpoint({
            deleteAllExpiredApiKeys
        })
    };
}
const defaultKeyHasher = async (key)=>{
    const hash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(new TextEncoder().encode(key));
    const hashed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$utils$40$0$2e$3$2e$0$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].encode(new Uint8Array(hash), {
        padding: false
    });
    return hashed;
};
const ERROR_CODES = {
    INVALID_METADATA_TYPE: "metadata must be an object or undefined",
    REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
    REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
    USER_BANNED: "User is banned",
    UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
    KEY_NOT_FOUND: "API Key not found",
    KEY_DISABLED: "API Key is disabled",
    KEY_EXPIRED: "API Key has expired",
    USAGE_EXCEEDED: "API Key has reached its usage limit",
    KEY_NOT_RECOVERABLE: "API Key is not recoverable",
    EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
    EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
    INVALID_REMAINING: "The remaining count is either too large or too small.",
    INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
    INVALID_NAME_LENGTH: "The name length is either too large or too small.",
    METADATA_DISABLED: "Metadata is disabled.",
    RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
    NO_VALUES_TO_UPDATE: "No values to update.",
    KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
    INVALID_API_KEY: "Invalid API key.",
    INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
    INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
    SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only.",
    FAILED_TO_UPDATE_API_KEY: "Failed to update API key",
    NAME_REQUIRED: "API Key name is required."
};
const API_KEY_TABLE_NAME = "apikey";
const apiKey = (options)=>{
    const opts = {
        ...options,
        apiKeyHeaders: options?.apiKeyHeaders ?? "x-api-key",
        defaultKeyLength: options?.defaultKeyLength || 64,
        maximumPrefixLength: options?.maximumPrefixLength ?? 32,
        minimumPrefixLength: options?.minimumPrefixLength ?? 1,
        maximumNameLength: options?.maximumNameLength ?? 32,
        minimumNameLength: options?.minimumNameLength ?? 1,
        enableMetadata: options?.enableMetadata ?? false,
        disableKeyHashing: options?.disableKeyHashing ?? false,
        requireName: options?.requireName ?? false,
        rateLimit: {
            enabled: options?.rateLimit?.enabled === void 0 ? true : options?.rateLimit?.enabled,
            timeWindow: options?.rateLimit?.timeWindow ?? 1e3 * 60 * 60 * 24,
            maxRequests: options?.rateLimit?.maxRequests ?? 10
        },
        keyExpiration: {
            defaultExpiresIn: options?.keyExpiration?.defaultExpiresIn ?? null,
            disableCustomExpiresTime: options?.keyExpiration?.disableCustomExpiresTime ?? false,
            maxExpiresIn: options?.keyExpiration?.maxExpiresIn ?? 365,
            minExpiresIn: options?.keyExpiration?.minExpiresIn ?? 1
        },
        startingCharactersConfig: {
            shouldStore: options?.startingCharactersConfig?.shouldStore ?? true,
            charactersLength: options?.startingCharactersConfig?.charactersLength ?? 6
        },
        enableSessionForAPIKeys: options?.enableSessionForAPIKeys ?? false
    };
    const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Cwj9dt6i$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["m"])(apiKeySchema({
        rateLimitMax: opts.rateLimit.maxRequests,
        timeWindow: opts.rateLimit.timeWindow
    }), opts.schema);
    const getter = opts.customAPIKeyGetter || ((ctx)=>{
        if (Array.isArray(opts.apiKeyHeaders)) {
            for (const header of opts.apiKeyHeaders){
                const value = ctx.headers?.get(header);
                if (value) {
                    return value;
                }
            }
        } else {
            return ctx.headers?.get(opts.apiKeyHeaders);
        }
    });
    const keyGenerator = opts.customKeyGenerator || (async (options2)=>{
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let apiKey2 = `${options2.prefix || ""}`;
        for(let i = 0; i < options2.length; i++){
            const randomIndex = Math.floor(Math.random() * characters.length);
            apiKey2 += characters[randomIndex];
        }
        return apiKey2;
    });
    const routes = createApiKeyRoutes({
        keyGenerator,
        opts,
        schema
    });
    return {
        id: "api-key",
        $ERROR_CODES: ERROR_CODES,
        hooks: {
            before: [
                {
                    matcher: (ctx)=>!!getter(ctx) && opts.enableSessionForAPIKeys,
                    handler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
                        const key = getter(ctx);
                        if (typeof key !== "string") {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("BAD_REQUEST", {
                                message: ERROR_CODES.INVALID_API_KEY_GETTER_RETURN_TYPE
                            });
                        }
                        if (key.length < opts.defaultKeyLength) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                                message: ERROR_CODES.INVALID_API_KEY
                            });
                        }
                        if (opts.customAPIKeyValidator) {
                            const isValid = await opts.customAPIKeyValidator({
                                ctx,
                                key
                            });
                            if (!isValid) {
                                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
                                    message: ERROR_CODES.INVALID_API_KEY
                                });
                            }
                        }
                        const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
                        const apiKey2 = await validateApiKey({
                            hashedKey: hashed,
                            ctx,
                            opts,
                            schema
                        });
                        deleteAllExpiredApiKeys(ctx.context).catch((err)=>{
                            ctx.context.logger.error("Failed to delete expired API keys:", err);
                        });
                        const user = await ctx.context.internalAdapter.findUserById(apiKey2.userId);
                        if (!user) {
                            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$call$40$1$2e$0$2e$19$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                                message: ERROR_CODES.INVALID_USER_ID_FROM_API_KEY
                            });
                        }
                        const session = {
                            user,
                            session: {
                                id: apiKey2.id,
                                token: key,
                                userId: apiKey2.userId,
                                userAgent: ctx.request?.headers.get("user-agent") ?? null,
                                ipAddress: ctx.request ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$ClH5r3NH$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx.request, ctx.context.options) : null,
                                createdAt: /* @__PURE__ */ new Date(),
                                updatedAt: /* @__PURE__ */ new Date(),
                                expiresAt: apiKey2.expiresAt || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CW6D9eSx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(ctx.context.options.session?.expiresIn || 60 * 60 * 24 * 7, // 7 days
                                "ms")
                            }
                        };
                        ctx.context.session = session;
                        if (ctx.path === "/get-session") {
                            return session;
                        } else {
                            return {
                                context: ctx
                            };
                        }
                    })
                }
            ]
        },
        endpoints: {
            /**
       * ### Endpoint
       *
       * POST `/api-key/create`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.createApiKey`
       *
       * **client:**
       * `authClient.apiKey.create`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-create)
       */ createApiKey: routes.createApiKey,
            /**
       * ### Endpoint
       *
       * POST `/api-key/verify`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.verifyApiKey`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-verify)
       */ verifyApiKey: routes.verifyApiKey,
            /**
       * ### Endpoint
       *
       * GET `/api-key/get`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.getApiKey`
       *
       * **client:**
       * `authClient.apiKey.get`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-get)
       */ getApiKey: routes.getApiKey,
            /**
       * ### Endpoint
       *
       * POST `/api-key/update`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.updateApiKey`
       *
       * **client:**
       * `authClient.apiKey.update`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-update)
       */ updateApiKey: routes.updateApiKey,
            /**
       * ### Endpoint
       *
       * POST `/api-key/delete`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.deleteApiKey`
       *
       * **client:**
       * `authClient.apiKey.delete`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-delete)
       */ deleteApiKey: routes.deleteApiKey,
            /**
       * ### Endpoint
       *
       * GET `/api-key/list`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.listApiKeys`
       *
       * **client:**
       * `authClient.apiKey.list`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-list)
       */ listApiKeys: routes.listApiKeys,
            /**
       * ### Endpoint
       *
       * POST `/api-key/delete-all-expired-api-keys`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.deleteAllExpiredApiKeys`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/api-key#api-method-api-key-delete-all-expired-api-keys)
       */ deleteAllExpiredApiKeys: routes.deleteAllExpiredApiKeys
        },
        schema
    };
};
const oneTimeToken = (options)=>{
    const opts = {
        storeToken: "plain",
        ...options
    };
    async function storeToken(ctx, token) {
        if (opts.storeToken === "hashed") {
            return await defaultKeyHasher(token);
        }
        if (typeof opts.storeToken === "object" && "type" in opts.storeToken && opts.storeToken.type === "custom-hasher") {
            return await opts.storeToken.hash(token);
        }
        return token;
    }
    return {
        id: "one-time-token",
        endpoints: {
            /**
       * ### Endpoint
       *
       * GET `/one-time-token/generate`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.generateOneTimeToken`
       *
       * **client:**
       * `authClient.oneTimeToken.generate`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/one-time-token#api-method-one-time-token-generate)
       */ generateOneTimeToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/one-time-token/generate", {
                method: "GET",
                use: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$DEBtROF9$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["s"]
                ]
            }, async (c)=>{
                if (opts?.disableClientRequest && c.request) {
                    throw c.error("BAD_REQUEST", {
                        message: "Client requests are disabled"
                    });
                }
                const session = c.context.session;
                const token = opts?.generateToken ? await opts.generateToken(session, c) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$better$2d$auth$40$1$2e$3$2e$34_next$40$16$2e$_717015041dc7a9593f744ce9b7082596$2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$B4Qoxdgc$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["g"])(32);
                const expiresAt = new Date(Date.now() + (opts?.expiresIn ?? 3) * 60 * 1e3);
                const storedToken = await storeToken(c, token);
                await c.context.internalAdapter.createVerificationValue({
                    value: session.session.token,
                    identifier: `one-time-token:${storedToken}`,
                    expiresAt
                });
                return c.json({
                    token
                });
            }),
            /**
       * ### Endpoint
       *
       * POST `/one-time-token/verify`
       *
       * ### API Methods
       *
       * **server:**
       * `auth.api.verifyOneTimeToken`
       *
       * **client:**
       * `authClient.oneTimeToken.verify`
       *
       * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/one-time-token#api-method-one-time-token-verify)
       */ verifyOneTimeToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$better$2d$auth$2b$core$40$1$2e$3$2e$34_$40$b_7f4677f056d5bb26519a91d140066d9e$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$middleware$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/one-time-token/verify", {
                method: "POST",
                body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                    token: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                        description: 'The token to verify. Eg: "some-token"'
                    })
                })
            }, async (c)=>{
                const { token } = c.body;
                const storedToken = await storeToken(c, token);
                const verificationValue = await c.context.internalAdapter.findVerificationValue(`one-time-token:${storedToken}`);
                if (!verificationValue) {
                    throw c.error("BAD_REQUEST", {
                        message: "Invalid token"
                    });
                }
                await c.context.internalAdapter.deleteVerificationValue(verificationValue.id);
                if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
                    throw c.error("BAD_REQUEST", {
                        message: "Token expired"
                    });
                }
                const session = await c.context.internalAdapter.findSession(verificationValue.value);
                if (!session) {
                    throw c.error("BAD_REQUEST", {
                        message: "Session not found"
                    });
                }
                return c.json(session);
            })
        }
    };
};
;
}),
];

//# sourceMappingURL=71f9c_better-auth_dist_shared_d66c75a4._.js.map