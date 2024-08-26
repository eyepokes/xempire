import {request} from "./utils";
const dbMiningData: any = {
    energy_capacity: [1e3, 2e3, 3e3, 4e3, 5500, 7e3, 9e3, 1e4, 11500, 14e3, 14500, 16e3, 18e3, 21e3, 26e3, 33e3, 36e3, 42e3, 5e4, 55e3, 6e4, 7e4, 8e4, 105e3, 14e4, 18e4, 255e3, 37e4, 465e3, 65e4, 93e4, 1e6, 13e5, 16e5, 18e5, 21e5, 25e5, 28e5, 35e5, 45e5, 49e5, 58e5, 7e6, 82e5, 105e5, 14e6, 155e5, 185e5, 23e6, 292e5, 415e5, 6e7, 81e6, 12e7, 19e7, 25e7, 37e7, 56e7, 77e7, 118e7, 18e8, 258e7, 415e7, 65e8, 774e7, 1245e7, 195e8, 2322e7, 3735e7, 585e8, 6966e7, 11205e7, 1755e8, 20898e7, 33615e7, 5265e8, 62694e7, 100845e7, 15795e8, 188082e7, 302535e7, 47385e8],
    profit_per_tap_power: [3, 5, 9, 13, 18, 24, 35, 37, 42, 51, 55, 59, 68, 77, 95, 119, 132, 154, 189, 200, 220, 264, 308, 396, 506, 660, 946, 1364, 1716, 2200, 3300, 3740, 4400, 5500, 6600, 7700, 9900, 11e3, 13200, 17600, 19800, 22e3, 26400, 33e3, 44e3, 51e3, 62e3, 66e3, 88e3, 11e4, 154e3, 22e4, 33e4, 44e4, 66e4, 88e4, 132e4, 198e4, 286e4, 44e5, 66e5, 88e5, 154e5, 242e5, 264e5, 462e5, 726e5, 792e5, 1386e5, 2178e5, 2376e5, 4158e5, 6534e5, 7128e5, 12474e5, 19602e5, 21384e5, 37422e5, 58806e5, 64152e5, 112266e5, 176418e5],
    energy_recovery: [1, 3, 4, 6, 8, 11, 16, 17, 19, 23, 25, 27, 31, 35, 43, 54, 60, 70, 86, 91, 100, 120, 140, 180, 230, 300, 430, 620, 780, 1e3, 1500, 1700, 2e3, 2500, 3e3, 3500, 4500, 5e3, 6e3, 8e3, 9e3, 1e4, 12e3, 15e3, 2e4, 23e3, 28e3, 3e4, 4e4, 5e4, 7e4, 1e5, 15e4, 2e5, 3e5, 4e5, 6e5, 9e5, 13e5, 2e6, 3e6, 4e6, 7e6, 11e6, 12e6, 21e6, 33e6, 36e6, 63e6, 99e6, 108e6, 189e6, 297e6, 324e6, 567e6, 891e6, 972e6, 1701e6, 2673e6, 2916e6, 5103e6, 8019e6],
    bonus_chance: [4, 5, 6, 7, 8, 8.5, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8, 20, 20.2, 20.4, 20.6, 20.8, 21, 21.2, 21.4, 21.6, 21.8, 22, 22.2, 22.4, 22.6, 22.8, 23, 23.2, 23.4, 23.6, 23.8, 24],
    bonus_multiplier: [20, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176],
    enhanced_energy_capacity: [0, 2e3, 4e3, 4500, 5e3, 5500, 6e3, 7e3, 7500, 9e3, 11e3, 14e3, 15e3, 18e3, 21e3, 25e3, 28e3, 32e3, 36e3, 45e3, 6e4, 75e3, 11e4, 16e4, 2e5, 28e4, 35e4, 45e4, 6e5, 7e5, 8e5, 9e5, 11e5, 12e5, 15e5, 19e5, 21e5, 25e5, 3e6, 35e5, 45e5, 6e6, 66e5, 79e5, 99e5, 125e5, 178e5, 257e5, 35e6, 5e7, 8e7, 11e7, 16e7, 24e7, 33e7, 51e7, 771e6, 111e7, 178e7, 279e7, 333e7, 534e7, 837e7, 999e7, 1602e7, 2511e7, 2997e7, 4806e7, 7533e7, 8991e7, 14418e7, 22599e7, 26973e7, 43254e7, 67797e7, 80919e7, 129762e7, 203391e7],
    enhanced_profit_per_tap_power: [0, 11, 13, 15, 18, 22, 24, 26, 29, 33, 40, 51, 57, 66, 81, 86, 88, 110, 132, 176, 220, 286, 396, 594, 726, 880, 1320, 1760, 1980, 2420, 2860, 3300, 4180, 4400, 5500, 7700, 8800, 9900, 11e3, 13200, 19800, 22e3, 24200, 28600, 37400, 44e3, 66e3, 88e3, 132e3, 198e3, 286e3, 374e3, 55e4, 88e4, 132e4, 198e4, 22e5, 44e5, 66e5, 11e6, 132e5, 198e5, 33e6, 396e5, 594e5, 99e6, 1188e5, 1782e5, 297e6, 3564e5, 5346e5, 891e6, 10692e5, 16038e5, 2673e6, 32076e5, 48114e5, 8019e6],
    enhanced_energy_recovery: [0, 5, 6, 7, 8, 10, 11, 12, 13, 15, 18, 23, 26, 30, 37, 39, 40, 50, 60, 80, 100, 130, 180, 270, 330, 400, 600, 800, 900, 1100, 1300, 1500, 1900, 2e3, 2500, 3500, 4e3, 4500, 5e3, 6e3, 9e3, 1e4, 11e3, 13e3, 17e3, 2e4, 3e4, 4e4, 6e4, 9e4, 13e4, 17e4, 25e4, 4e5, 6e5, 9e5, 1e6, 2e6, 3e6, 5e6, 6e6, 9e6, 15e6, 18e6, 27e6, 45e6, 54e6, 81e6, 135e6, 162e6, 243e6, 405e6, 486e6, 729e6, 1215e6, 1458e6, 2187e6, 3645e6],
    enhanced_bonus_chance: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7],
    enhanced_bonus_multiplier: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 45.5, 46, 46.5, 47, 47.5, 48, 48.5, 49, 49.5, 50, 50.5, 51, 51.5, 52, 52.5, 53, 53.5, 54, 54.5, 55, 55.5, 56, 56.5, 57, 57.5, 58, 58.5, 59, 59.5, 60, 60.5, 61]
};
const headers = {
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "is-beta-server": "null",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    "Referer": "https://game.xempire.io/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "origin": "https://game.xempire.io"
}


export async function req(method: "GET"|"POST", url: string, payload: any | false, apiKey: string) {
    const time = Math.floor( Date.now() / 1e3);
    const hash = getHash(time, payload);
    /* let ua = (url.includes("tap") ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36": "") */

    return await request(method, url, {
        ...headers,
        "api-hash": hash,
        "api-key": apiKey,
        "api-time": time,
        /* "user-agent": ua */
    }, false, payload);
}
/*
{"data":{}}
* */
export async function all(payload: any | false, token: string) {
    return await req("POST", "https://api.xempire.io/user/data/all", payload, token);
}
/*
{"data":{"lang":"ru"}}
* */
export async function after(payload: any | false, token: string) {
    return req("POST", "https://api.xempire.io/user/data/after", payload, token);
}
/*
{}
* */
export async function claim(payload: any | false, token: string) {
    return req("POST", "https://api.xempire.io/hero/bonus/offline/claim", payload, token);
}
/*
{}
* */
export async function sync(payload: any | false, token: string) {
    return req("POST", "https://api.xempire.io/hero/balance/sync", payload, token);
}
/*
{"data":{"data":{"task":{"amount":5632,"currentEnergy":1830368}},"seconds":3}}
* */
export async function tap(payload: any | false, token: string) {
    return req("POST", "https://api.xempire.io/hero/action/tap", payload, token);
}
/*
{"data":"motivation"}
* */
export async function improve(payload: any | false, token: string) {
    return req("POST", "https://api.xempire.io/skills/improve", payload, token);
}


export function getHash(timestamp: number, payload: string) {
    return mA(encodeURIComponent(`${timestamp}_${payload}`));
}

function mA(e: string): string {
    const t = function (g: any) {
        var S = n(i(r(o(g), 8 * g.length)));
        return S.toLowerCase()
    };

    function n(g: any) {
        for (var S, p = "0123456789ABCDEF", y = "", v = 0; v < g.length; v++)
            S = g.charCodeAt(v),
                y += p.charAt(S >>> 4 & 15) + p.charAt(15 & S);
        return y
    }

    function o(g: any) {
        for (var S = Array(g.length >> 2), p = 0; p < S.length; p++)
            S[p] = 0;
        for (p = 0; p < 8 * g.length; p += 8)
            S[p >> 5] |= (255 & g.charCodeAt(p / 8)) << p % 32;
        return S
    }

    function i(g: any) {
        for (var S = "", p = 0; p < 32 * g.length; p += 8)
            S += String.fromCharCode(g[p >> 5] >>> p % 32 & 255);
        return S
    }

    function r(g: any, S: any) {
        g[S >> 5] |= 128 << S % 32,
            g[14 + (S + 64 >>> 9 << 4)] = S;
        for (var p = 1732584193, y = -271733879, v = -1732584194, m = 271733878, b = 0; b < g.length; b += 16) {
            var w = p
                , C = y
                , k = v
                , I = m;
            y = u(y = u(y = u(y = u(y = c(y = c(y = c(y = c(y = l(y = l(y = l(y = l(y = s(y = s(y = s(y = s(y, v = s(v, m = s(m, p = s(p, y, v, m, g[b + 0], 7, -680876936), y, v, g[b + 1], 12, -389564586), p, y, g[b + 2], 17, 606105819), m, p, g[b + 3], 22, -1044525330), v = s(v, m = s(m, p = s(p, y, v, m, g[b + 4], 7, -176418897), y, v, g[b + 5], 12, 1200080426), p, y, g[b + 6], 17, -1473231341), m, p, g[b + 7], 22, -45705983), v = s(v, m = s(m, p = s(p, y, v, m, g[b + 8], 7, 1770035416), y, v, g[b + 9], 12, -1958414417), p, y, g[b + 10], 17, -42063), m, p, g[b + 11], 22, -1990404162), v = s(v, m = s(m, p = s(p, y, v, m, g[b + 12], 7, 1804603682), y, v, g[b + 13], 12, -40341101), p, y, g[b + 14], 17, -1502002290), m, p, g[b + 15], 22, 1236535329), v = l(v, m = l(m, p = l(p, y, v, m, g[b + 1], 5, -165796510), y, v, g[b + 6], 9, -1069501632), p, y, g[b + 11], 14, 643717713), m, p, g[b + 0], 20, -373897302), v = l(v, m = l(m, p = l(p, y, v, m, g[b + 5], 5, -701558691), y, v, g[b + 10], 9, 38016083), p, y, g[b + 15], 14, -660478335), m, p, g[b + 4], 20, -405537848), v = l(v, m = l(m, p = l(p, y, v, m, g[b + 9], 5, 568446438), y, v, g[b + 14], 9, -1019803690), p, y, g[b + 3], 14, -187363961), m, p, g[b + 8], 20, 1163531501), v = l(v, m = l(m, p = l(p, y, v, m, g[b + 13], 5, -1444681467), y, v, g[b + 2], 9, -51403784), p, y, g[b + 7], 14, 1735328473), m, p, g[b + 12], 20, -1926607734), v = c(v, m = c(m, p = c(p, y, v, m, g[b + 5], 4, -378558), y, v, g[b + 8], 11, -2022574463), p, y, g[b + 11], 16, 1839030562), m, p, g[b + 14], 23, -35309556), v = c(v, m = c(m, p = c(p, y, v, m, g[b + 1], 4, -1530992060), y, v, g[b + 4], 11, 1272893353), p, y, g[b + 7], 16, -155497632), m, p, g[b + 10], 23, -1094730640), v = c(v, m = c(m, p = c(p, y, v, m, g[b + 13], 4, 681279174), y, v, g[b + 0], 11, -358537222), p, y, g[b + 3], 16, -722521979), m, p, g[b + 6], 23, 76029189), v = c(v, m = c(m, p = c(p, y, v, m, g[b + 9], 4, -640364487), y, v, g[b + 12], 11, -421815835), p, y, g[b + 15], 16, 530742520), m, p, g[b + 2], 23, -995338651), v = u(v, m = u(m, p = u(p, y, v, m, g[b + 0], 6, -198630844), y, v, g[b + 7], 10, 1126891415), p, y, g[b + 14], 15, -1416354905), m, p, g[b + 5], 21, -57434055), v = u(v, m = u(m, p = u(p, y, v, m, g[b + 12], 6, 1700485571), y, v, g[b + 3], 10, -1894986606), p, y, g[b + 10], 15, -1051523), m, p, g[b + 1], 21, -2054922799), v = u(v, m = u(m, p = u(p, y, v, m, g[b + 8], 6, 1873313359), y, v, g[b + 15], 10, -30611744), p, y, g[b + 6], 15, -1560198380), m, p, g[b + 13], 21, 1309151649), v = u(v, m = u(m, p = u(p, y, v, m, g[b + 4], 6, -145523070), y, v, g[b + 11], 10, -1120210379), p, y, g[b + 2], 15, 718787259), m, p, g[b + 9], 21, -343485551),
                p = f(p, w),
                y = f(y, C),
                v = f(v, k),
                m = f(m, I)
        }
        return Array(p, y, v, m)
    }

    function a(g: any, S: any, p: any, y: any, v: any, m: any) {
        return f(h(f(f(S, g), f(y, m)), v), p)
    }

    function s(g: any, S: any, p: any, y: any, v: any, m: any, b: any) {
        return a(S & p | ~S & y, g, S, v, m, b)
    }

    function l(g: any, S: any, p: any, y: any, v: any, m: any, b: any) {
        return a(S & y | p & ~y, g, S, v, m, b)
    }

    function c(g: any, S: any, p: any, y: any, v: any, m: any, b: any) {
        return a(S ^ p ^ y, g, S, v, m, b)
    }

    function u(g: any, S: any, p: any, y: any, v: any, m: any, b: any) {
        return a(p ^ (S | ~y), g, S, v, m, b)
    }

    function f(g: any, S: any) {
        var p = (65535 & g) + (65535 & S);
        return (g >> 16) + (S >> 16) + (p >> 16) << 16 | 65535 & p
    }

    function h(g: any, S: any) {
        return g << S | g >>> 32 - S
    }

    return t(e)
}

export function convertSkillsToArray(skills: any): any[] {
    return Object.entries(skills).map(([name, details]) => ({
        name,
        details
    }));
}

function fnLinear(e: number, t: number) {
    return t * e
}

function fnQuadratic(e: number, t: number) {
    return t * e * e
}

function fnCubic(e: number, t: number) {
    return t * e * e * e
}

function fnExponential(e: number, t: number, a: number) {
    return t * Math.pow(a / 10, e)
}

function fnLogarithmic(e: number, t: number) {
    return t * Math.log2(e + 1)
}

function fnCompound(e: number, t: number, a: number) {
    let c = a / 100;
    return t * Math.pow(1 + c, e - 1)
}

function fnPayback(e: number, t: any) {
    let a = [0];
    for (let c = 1; c <= e; c++) {
        const i = a[c - 1]
            , r = getPrice(t, c)
            , S = t.profitBasic + t.profitFormulaK * (c - 1)
            , L = smartRound(i + r / S);
        a.push(L)
    }
    return a[e]
}

function smartRound(e: number) {
    function t(a: number, c=100) {
        return Math.round(a / c) * c
    }
    return e < 50 ? Math.round(e) : e < 100 ? t(e, 5) : e < 500 ? t(e, 25) : e < 1e3 ? t(e, 50) : e < 5e3 ? t(e, 100) : e < 1e4 ? t(e, 200) : e < 1e5 ? t(e, 500) : e < 5e5 ? t(e, 1e3) : e < 1e6 ? t(e, 5e3) : e < 5e7 ? t(e, 1e4) : e < 1e8 ? t(e, 5e4) : t(e, 1e5)
}

export function getPrice(e: any, t: any) {
    return t ? calcFormula(e.priceFormula, t, e.priceBasic, e.priceFormulaK) : 0
}
export function getProfit(e: any, t: any) {
    return e.category !== "mining" ? t ? calcFormula(e.profitFormula, t, e.profitBasic, e.profitFormulaK, e) : 0 : dbMiningData[e.key][t]
}

function calcFormula(e: any, t: any, a: any, c: any, i: any | undefined = undefined) {
    let r = a;
    return e === "fnCompound" && (r = fnCompound(t, a, c)),
    e === "fnLogarithmic" && (r = fnLogarithmic(t, a)),
    e === "fnLinear" && (r = fnLinear(t, a)),
    e === "fnQuadratic" && (r = fnQuadratic(t, a)),
    e === "fnCubic" && (r = fnCubic(t, a)),
    e === "fnExponential" && (r = fnExponential(t, a, c)),
    e === "fnPayback" && (r = fnPayback(t, i)),
        smartRound(r)
}
