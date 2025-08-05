/**
 * React Router DOM v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function sd() {
  return (
    (sd = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    sd.apply(this, arguments)
  );
}
function y2(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    a,
    s;
  for (s = 0; s < n.length; s++)
    ((a = n[s]), !(t.indexOf(a) >= 0) && (r[a] = e[a]));
  return r;
}
function b2(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function w2(e, t) {
  return e.button === 0 && (!t || t === "_self") && !b2(e);
}
const x2 = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  k2 = "6";
try {
  window.__reactRouterVersion = k2;
} catch {}
const S2 = "startTransition",
  wm = fg[S2];
function _2(e) {
  let { basename: t, children: r, future: n, window: a } = e,
    s = p.useRef();
  s.current == null && (s.current = TN({ window: a, v5Compat: !0 }));
  let o = s.current,
    [i, l] = p.useState({ action: o.action, location: o.location }),
    { v7_startTransition: u } = n || {},
    d = p.useCallback(
      (h) => {
        u && wm ? wm(() => l(h)) : l(h);
      },
      [l, u],
    );
  return (
    p.useLayoutEffect(() => o.listen(d), [o, d]),
    p.createElement(g2, {
      basename: t,
      children: r,
      location: i.location,
      navigationType: i.action,
      navigator: o,
      future: n,
    })
  );
}
const j2 =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  E2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Be = p.forwardRef(function (e, t) {
    let {
        onClick: r,
        relative: n,
        reloadDocument: a,
        replace: s,
        state: o,
        target: i,
        to: l,
        preventScrollReset: u,
        viewTransition: d,
      } = e,
      h = y2(e, x2),
      { basename: f } = p.useContext(sn),
      v,
      g = !1;
    if (typeof l == "string" && E2.test(l) && ((v = l), j2))
      try {
        let b = new URL(window.location.href),
          x = l.startsWith("//") ? new URL(b.protocol + l) : new URL(l),
          k = zh(x.pathname, f);
        x.origin === b.origin && k != null
          ? (l = k + x.search + x.hash)
          : (g = !0);
      } catch {}
    let m = t2(l, { relative: n }),
      w = N2(l, {
        replace: s,
        state: o,
        target: i,
        preventScrollReset: u,
        relative: n,
        viewTransition: d,
      });
    function y(b) {
      (r && r(b), b.defaultPrevented || w(b));
    }
    return p.createElement(
      "a",
      sd({}, h, { href: v || m, onClick: g || a ? r : y, ref: t, target: i }),
    );
  });
var xm;
(function (e) {
  ((e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState"));
})(xm || (xm = {}));
var km;
(function (e) {
  ((e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration"));
})(km || (km = {}));
function N2(e, t) {
  let {
      target: r,
      replace: n,
      state: a,
      preventScrollReset: s,
      relative: o,
      viewTransition: i,
    } = t === void 0 ? {} : t,
    l = qh(),
    u = Fn(),
    d = Kb(e, { relative: o });
  return p.useCallback(
    (h) => {
      if (w2(h, r)) {
        h.preventDefault();
        let f = n !== void 0 ? n : tl(u) === tl(d);
        l(e, {
          replace: f,
          state: a,
          preventScrollReset: s,
          relative: o,
          viewTransition: i,
        });
      }
    },
    [u, l, d, n, a, r, e, s, o, i],
  );
}
const So = function (e, t, r) {
    let n = Promise.resolve();
    function a(s) {
      const o = new Event("vite:preloadError", { cancelable: !0 });
      if (((o.payload = s), window.dispatchEvent(o), !o.defaultPrevented))
        throw s;
    }
    return n.then((s) => {
      for (const o of s || []) o.status === "rejected" && a(o.reason);
      return e().catch(a);
    });
  },
  C2 = (e) => {
    let t;
    return (
      e
        ? (t = e)
        : typeof fetch > "u"
          ? (t = (...r) =>
              So(async () => {
                const { default: n } = await Promise.resolve().then(() => Ja);
                return { default: n };
              }).then(({ default: n }) => n(...r)))
          : (t = fetch),
      (...r) => t(...r)
    );
  };
class Hh extends Error {
  constructor(t, r = "FunctionsError", n) {
    (super(t), (this.name = r), (this.context = n));
  }
}
class T2 extends Hh {
  constructor(t) {
    super(
      "Failed to send a request to the Edge Function",
      "FunctionsFetchError",
      t,
    );
  }
}
class Sm extends Hh {
  constructor(t) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", t);
  }
}
class _m extends Hh {
  constructor(t) {
    super(
      "Edge Function returned a non-2xx status code",
      "FunctionsHttpError",
      t,
    );
  }
}
var od;
(function (e) {
  ((e.Any = "any"),
    (e.ApNortheast1 = "ap-northeast-1"),
    (e.ApNortheast2 = "ap-northeast-2"),
    (e.ApSouth1 = "ap-south-1"),
    (e.ApSoutheast1 = "ap-southeast-1"),
    (e.ApSoutheast2 = "ap-southeast-2"),
    (e.CaCentral1 = "ca-central-1"),
    (e.EuCentral1 = "eu-central-1"),
    (e.EuWest1 = "eu-west-1"),
    (e.EuWest2 = "eu-west-2"),
    (e.EuWest3 = "eu-west-3"),
    (e.SaEast1 = "sa-east-1"),
    (e.UsEast1 = "us-east-1"),
    (e.UsWest1 = "us-west-1"),
    (e.UsWest2 = "us-west-2"));
})(od || (od = {}));
var P2 = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
class R2 {
  constructor(t, { headers: r = {}, customFetch: n, region: a = od.Any } = {}) {
    ((this.url = t),
      (this.headers = r),
      (this.region = a),
      (this.fetch = C2(n)));
  }
  setAuth(t) {
    this.headers.Authorization = `Bearer ${t}`;
  }
  invoke(t, r = {}) {
    var n;
    return P2(this, void 0, void 0, function* () {
      try {
        const { headers: a, method: s, body: o } = r;
        let i = {},
          { region: l } = r;
        l || (l = this.region);
        const u = new URL(`${this.url}/${t}`);
        l &&
          l !== "any" &&
          ((i["x-region"] = l), u.searchParams.set("forceFunctionRegion", l));
        let d;
        o &&
          ((a && !Object.prototype.hasOwnProperty.call(a, "Content-Type")) ||
            !a) &&
          ((typeof Blob < "u" && o instanceof Blob) || o instanceof ArrayBuffer
            ? ((i["Content-Type"] = "application/octet-stream"), (d = o))
            : typeof o == "string"
              ? ((i["Content-Type"] = "text/plain"), (d = o))
              : typeof FormData < "u" && o instanceof FormData
                ? (d = o)
                : ((i["Content-Type"] = "application/json"),
                  (d = JSON.stringify(o))));
        const h = yield this.fetch(u.toString(), {
            method: s || "POST",
            headers: Object.assign(
              Object.assign(Object.assign({}, i), this.headers),
              a,
            ),
            body: d,
          }).catch((m) => {
            throw new T2(m);
          }),
          f = h.headers.get("x-relay-error");
        if (f && f === "true") throw new Sm(h);
        if (!h.ok) throw new _m(h);
        let v = (
            (n = h.headers.get("Content-Type")) !== null && n !== void 0
              ? n
              : "text/plain"
          )
            .split(";")[0]
            .trim(),
          g;
        return (
          v === "application/json"
            ? (g = yield h.json())
            : v === "application/octet-stream"
              ? (g = yield h.blob())
              : v === "text/event-stream"
                ? (g = h)
                : v === "multipart/form-data"
                  ? (g = yield h.formData())
                  : (g = yield h.text()),
          { data: g, error: null, response: h }
        );
      } catch (a) {
        return {
          data: null,
          error: a,
          response: a instanceof _m || a instanceof Sm ? a.context : void 0,
        };
      }
    });
  }
}
var tt = {},
  Vh = {},
  $l = {},
  _o = {},
  Fl = {},
  zl = {},
  O2 = function () {
    if (typeof self < "u") return self;
    if (typeof window < "u") return window;
    if (typeof global < "u") return global;
    throw new Error("unable to locate global object");
  },
  za = O2();
const A2 = za.fetch,
  Jb = za.fetch.bind(za),
  Yb = za.Headers,
  M2 = za.Request,
  I2 = za.Response,
  Ja = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        Headers: Yb,
        Request: M2,
        Response: I2,
        default: Jb,
        fetch: A2,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  ),
  D2 = Cx(Ja);
var Ul = {};
Object.defineProperty(Ul, "__esModule", { value: !0 });
let L2 = class extends Error {
  constructor(e) {
    (super(e.message),
      (this.name = "PostgrestError"),
      (this.details = e.details),
      (this.hint = e.hint),
      (this.code = e.code));
  }
};
Ul.default = L2;
var Xb =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(zl, "__esModule", { value: !0 });
const $2 = Xb(D2),
  F2 = Xb(Ul);
let z2 = class {
  constructor(e) {
    ((this.shouldThrowOnError = !1),
      (this.method = e.method),
      (this.url = e.url),
      (this.headers = e.headers),
      (this.schema = e.schema),
      (this.body = e.body),
      (this.shouldThrowOnError = e.shouldThrowOnError),
      (this.signal = e.signal),
      (this.isMaybeSingle = e.isMaybeSingle),
      e.fetch
        ? (this.fetch = e.fetch)
        : typeof fetch > "u"
          ? (this.fetch = $2.default)
          : (this.fetch = fetch));
  }
  throwOnError() {
    return ((this.shouldThrowOnError = !0), this);
  }
  setHeader(e, t) {
    return (
      (this.headers = Object.assign({}, this.headers)),
      (this.headers[e] = t),
      this
    );
  }
  then(e, t) {
    (this.schema === void 0 ||
      (["GET", "HEAD"].includes(this.method)
        ? (this.headers["Accept-Profile"] = this.schema)
        : (this.headers["Content-Profile"] = this.schema)),
      this.method !== "GET" &&
        this.method !== "HEAD" &&
        (this.headers["Content-Type"] = "application/json"));
    const r = this.fetch;
    let n = r(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal,
    }).then(async (a) => {
      var s, o, i;
      let l = null,
        u = null,
        d = null,
        h = a.status,
        f = a.statusText;
      if (a.ok) {
        if (this.method !== "HEAD") {
          const m = await a.text();
          m === "" ||
            (this.headers.Accept === "text/csv" ||
            (this.headers.Accept &&
              this.headers.Accept.includes("application/vnd.pgrst.plan+text"))
              ? (u = m)
              : (u = JSON.parse(m)));
        }
        const v =
            (s = this.headers.Prefer) === null || s === void 0
              ? void 0
              : s.match(/count=(exact|planned|estimated)/),
          g =
            (o = a.headers.get("content-range")) === null || o === void 0
              ? void 0
              : o.split("/");
        (v && g && g.length > 1 && (d = parseInt(g[1])),
          this.isMaybeSingle &&
            this.method === "GET" &&
            Array.isArray(u) &&
            (u.length > 1
              ? ((l = {
                  code: "PGRST116",
                  details: `Results contain ${u.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message:
                    "JSON object requested, multiple (or no) rows returned",
                }),
                (u = null),
                (d = null),
                (h = 406),
                (f = "Not Acceptable"))
              : u.length === 1
                ? (u = u[0])
                : (u = null)));
      } else {
        const v = await a.text();
        try {
          ((l = JSON.parse(v)),
            Array.isArray(l) &&
              a.status === 404 &&
              ((u = []), (l = null), (h = 200), (f = "OK")));
        } catch {
          a.status === 404 && v === ""
            ? ((h = 204), (f = "No Content"))
            : (l = { message: v });
        }
        if (
          (l &&
            this.isMaybeSingle &&
            !((i = l == null ? void 0 : l.details) === null || i === void 0) &&
            i.includes("0 rows") &&
            ((l = null), (h = 200), (f = "OK")),
          l && this.shouldThrowOnError)
        )
          throw new F2.default(l);
      }
      return { error: l, data: u, count: d, status: h, statusText: f };
    });
    return (
      this.shouldThrowOnError ||
        (n = n.catch((a) => {
          var s, o, i;
          return {
            error: {
              message: `${(s = a == null ? void 0 : a.name) !== null && s !== void 0 ? s : "FetchError"}: ${a == null ? void 0 : a.message}`,
              details: `${(o = a == null ? void 0 : a.stack) !== null && o !== void 0 ? o : ""}`,
              hint: "",
              code: `${(i = a == null ? void 0 : a.code) !== null && i !== void 0 ? i : ""}`,
            },
            data: null,
            count: null,
            status: 0,
            statusText: "",
          };
        })),
      n.then(e, t)
    );
  }
  returns() {
    return this;
  }
  overrideTypes() {
    return this;
  }
};
zl.default = z2;
var U2 =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(Fl, "__esModule", { value: !0 });
const B2 = U2(zl);
let W2 = class extends B2.default {
  select(e) {
    let t = !1;
    const r = (e ?? "*")
      .split("")
      .map((n) => (/\s/.test(n) && !t ? "" : (n === '"' && (t = !t), n)))
      .join("");
    return (
      this.url.searchParams.set("select", r),
      this.headers.Prefer && (this.headers.Prefer += ","),
      (this.headers.Prefer += "return=representation"),
      this
    );
  }
  order(
    e,
    {
      ascending: t = !0,
      nullsFirst: r,
      foreignTable: n,
      referencedTable: a = n,
    } = {},
  ) {
    const s = a ? `${a}.order` : "order",
      o = this.url.searchParams.get(s);
    return (
      this.url.searchParams.set(
        s,
        `${o ? `${o},` : ""}${e}.${t ? "asc" : "desc"}${r === void 0 ? "" : r ? ".nullsfirst" : ".nullslast"}`,
      ),
      this
    );
  }
  limit(e, { foreignTable: t, referencedTable: r = t } = {}) {
    const n = typeof r > "u" ? "limit" : `${r}.limit`;
    return (this.url.searchParams.set(n, `${e}`), this);
  }
  range(e, t, { foreignTable: r, referencedTable: n = r } = {}) {
    const a = typeof n > "u" ? "offset" : `${n}.offset`,
      s = typeof n > "u" ? "limit" : `${n}.limit`;
    return (
      this.url.searchParams.set(a, `${e}`),
      this.url.searchParams.set(s, `${t - e + 1}`),
      this
    );
  }
  abortSignal(e) {
    return ((this.signal = e), this);
  }
  single() {
    return ((this.headers.Accept = "application/vnd.pgrst.object+json"), this);
  }
  maybeSingle() {
    return (
      this.method === "GET"
        ? (this.headers.Accept = "application/json")
        : (this.headers.Accept = "application/vnd.pgrst.object+json"),
      (this.isMaybeSingle = !0),
      this
    );
  }
  csv() {
    return ((this.headers.Accept = "text/csv"), this);
  }
  geojson() {
    return ((this.headers.Accept = "application/geo+json"), this);
  }
  explain({
    analyze: e = !1,
    verbose: t = !1,
    settings: r = !1,
    buffers: n = !1,
    wal: a = !1,
    format: s = "text",
  } = {}) {
    var o;
    const i = [
        e ? "analyze" : null,
        t ? "verbose" : null,
        r ? "settings" : null,
        n ? "buffers" : null,
        a ? "wal" : null,
      ]
        .filter(Boolean)
        .join("|"),
      l =
        (o = this.headers.Accept) !== null && o !== void 0
          ? o
          : "application/json";
    return (
      (this.headers.Accept = `application/vnd.pgrst.plan+${s}; for="${l}"; options=${i};`),
      s === "json" ? this : this
    );
  }
  rollback() {
    var e;
    return (
      ((e = this.headers.Prefer) !== null && e !== void 0 ? e : "").trim()
        .length > 0
        ? (this.headers.Prefer += ",tx=rollback")
        : (this.headers.Prefer = "tx=rollback"),
      this
    );
  }
  returns() {
    return this;
  }
};
Fl.default = W2;
var q2 =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(_o, "__esModule", { value: !0 });
const H2 = q2(Fl);
let V2 = class extends H2.default {
  eq(e, t) {
    return (this.url.searchParams.append(e, `eq.${t}`), this);
  }
  neq(e, t) {
    return (this.url.searchParams.append(e, `neq.${t}`), this);
  }
  gt(e, t) {
    return (this.url.searchParams.append(e, `gt.${t}`), this);
  }
  gte(e, t) {
    return (this.url.searchParams.append(e, `gte.${t}`), this);
  }
  lt(e, t) {
    return (this.url.searchParams.append(e, `lt.${t}`), this);
  }
  lte(e, t) {
    return (this.url.searchParams.append(e, `lte.${t}`), this);
  }
  like(e, t) {
    return (this.url.searchParams.append(e, `like.${t}`), this);
  }
  likeAllOf(e, t) {
    return (
      this.url.searchParams.append(e, `like(all).{${t.join(",")}}`),
      this
    );
  }
  likeAnyOf(e, t) {
    return (
      this.url.searchParams.append(e, `like(any).{${t.join(",")}}`),
      this
    );
  }
  ilike(e, t) {
    return (this.url.searchParams.append(e, `ilike.${t}`), this);
  }
  ilikeAllOf(e, t) {
    return (
      this.url.searchParams.append(e, `ilike(all).{${t.join(",")}}`),
      this
    );
  }
  ilikeAnyOf(e, t) {
    return (
      this.url.searchParams.append(e, `ilike(any).{${t.join(",")}}`),
      this
    );
  }
  is(e, t) {
    return (this.url.searchParams.append(e, `is.${t}`), this);
  }
  in(e, t) {
    const r = Array.from(new Set(t))
      .map((n) =>
        typeof n == "string" && new RegExp("[,()]").test(n) ? `"${n}"` : `${n}`,
      )
      .join(",");
    return (this.url.searchParams.append(e, `in.(${r})`), this);
  }
  contains(e, t) {
    return (
      typeof t == "string"
        ? this.url.searchParams.append(e, `cs.${t}`)
        : Array.isArray(t)
          ? this.url.searchParams.append(e, `cs.{${t.join(",")}}`)
          : this.url.searchParams.append(e, `cs.${JSON.stringify(t)}`),
      this
    );
  }
  containedBy(e, t) {
    return (
      typeof t == "string"
        ? this.url.searchParams.append(e, `cd.${t}`)
        : Array.isArray(t)
          ? this.url.searchParams.append(e, `cd.{${t.join(",")}}`)
          : this.url.searchParams.append(e, `cd.${JSON.stringify(t)}`),
      this
    );
  }
  rangeGt(e, t) {
    return (this.url.searchParams.append(e, `sr.${t}`), this);
  }
  rangeGte(e, t) {
    return (this.url.searchParams.append(e, `nxl.${t}`), this);
  }
  rangeLt(e, t) {
    return (this.url.searchParams.append(e, `sl.${t}`), this);
  }
  rangeLte(e, t) {
    return (this.url.searchParams.append(e, `nxr.${t}`), this);
  }
  rangeAdjacent(e, t) {
    return (this.url.searchParams.append(e, `adj.${t}`), this);
  }
  overlaps(e, t) {
    return (
      typeof t == "string"
        ? this.url.searchParams.append(e, `ov.${t}`)
        : this.url.searchParams.append(e, `ov.{${t.join(",")}}`),
      this
    );
  }
  textSearch(e, t, { config: r, type: n } = {}) {
    let a = "";
    n === "plain"
      ? (a = "pl")
      : n === "phrase"
        ? (a = "ph")
        : n === "websearch" && (a = "w");
    const s = r === void 0 ? "" : `(${r})`;
    return (this.url.searchParams.append(e, `${a}fts${s}.${t}`), this);
  }
  match(e) {
    return (
      Object.entries(e).forEach(([t, r]) => {
        this.url.searchParams.append(t, `eq.${r}`);
      }),
      this
    );
  }
  not(e, t, r) {
    return (this.url.searchParams.append(e, `not.${t}.${r}`), this);
  }
  or(e, { foreignTable: t, referencedTable: r = t } = {}) {
    const n = r ? `${r}.or` : "or";
    return (this.url.searchParams.append(n, `(${e})`), this);
  }
  filter(e, t, r) {
    return (this.url.searchParams.append(e, `${t}.${r}`), this);
  }
};
_o.default = V2;
var K2 =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty($l, "__esModule", { value: !0 });
const ys = K2(_o);
let G2 = class {
  constructor(e, { headers: t = {}, schema: r, fetch: n }) {
    ((this.url = e), (this.headers = t), (this.schema = r), (this.fetch = n));
  }
  select(e, { head: t = !1, count: r } = {}) {
    const n = t ? "HEAD" : "GET";
    let a = !1;
    const s = (e ?? "*")
      .split("")
      .map((o) => (/\s/.test(o) && !a ? "" : (o === '"' && (a = !a), o)))
      .join("");
    return (
      this.url.searchParams.set("select", s),
      r && (this.headers.Prefer = `count=${r}`),
      new ys.default({
        method: n,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: this.fetch,
        allowEmpty: !1,
      })
    );
  }
  insert(e, { count: t, defaultToNull: r = !0 } = {}) {
    const n = "POST",
      a = [];
    if (
      (this.headers.Prefer && a.push(this.headers.Prefer),
      t && a.push(`count=${t}`),
      r || a.push("missing=default"),
      (this.headers.Prefer = a.join(",")),
      Array.isArray(e))
    ) {
      const s = e.reduce((o, i) => o.concat(Object.keys(i)), []);
      if (s.length > 0) {
        const o = [...new Set(s)].map((i) => `"${i}"`);
        this.url.searchParams.set("columns", o.join(","));
      }
    }
    return new ys.default({
      method: n,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: e,
      fetch: this.fetch,
      allowEmpty: !1,
    });
  }
  upsert(
    e,
    {
      onConflict: t,
      ignoreDuplicates: r = !1,
      count: n,
      defaultToNull: a = !0,
    } = {},
  ) {
    const s = "POST",
      o = [`resolution=${r ? "ignore" : "merge"}-duplicates`];
    if (
      (t !== void 0 && this.url.searchParams.set("on_conflict", t),
      this.headers.Prefer && o.push(this.headers.Prefer),
      n && o.push(`count=${n}`),
      a || o.push("missing=default"),
      (this.headers.Prefer = o.join(",")),
      Array.isArray(e))
    ) {
      const i = e.reduce((l, u) => l.concat(Object.keys(u)), []);
      if (i.length > 0) {
        const l = [...new Set(i)].map((u) => `"${u}"`);
        this.url.searchParams.set("columns", l.join(","));
      }
    }
    return new ys.default({
      method: s,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: e,
      fetch: this.fetch,
      allowEmpty: !1,
    });
  }
  update(e, { count: t } = {}) {
    const r = "PATCH",
      n = [];
    return (
      this.headers.Prefer && n.push(this.headers.Prefer),
      t && n.push(`count=${t}`),
      (this.headers.Prefer = n.join(",")),
      new ys.default({
        method: r,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: e,
        fetch: this.fetch,
        allowEmpty: !1,
      })
    );
  }
  delete({ count: e } = {}) {
    const t = "DELETE",
      r = [];
    return (
      e && r.push(`count=${e}`),
      this.headers.Prefer && r.unshift(this.headers.Prefer),
      (this.headers.Prefer = r.join(",")),
      new ys.default({
        method: t,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: this.fetch,
        allowEmpty: !1,
      })
    );
  }
};
$l.default = G2;
var Bl = {},
  Wl = {};
Object.defineProperty(Wl, "__esModule", { value: !0 });
Wl.version = void 0;
Wl.version = "0.0.0-automated";
Object.defineProperty(Bl, "__esModule", { value: !0 });
Bl.DEFAULT_HEADERS = void 0;
const Q2 = Wl;
Bl.DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${Q2.version}` };
var Zb =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(Vh, "__esModule", { value: !0 });
const J2 = Zb($l),
  Y2 = Zb(_o),
  X2 = Bl;
let Z2 = class e0 {
  constructor(t, { headers: r = {}, schema: n, fetch: a } = {}) {
    ((this.url = t),
      (this.headers = Object.assign(Object.assign({}, X2.DEFAULT_HEADERS), r)),
      (this.schemaName = n),
      (this.fetch = a));
  }
  from(t) {
    const r = new URL(`${this.url}/${t}`);
    return new J2.default(r, {
      headers: Object.assign({}, this.headers),
      schema: this.schemaName,
      fetch: this.fetch,
    });
  }
  schema(t) {
    return new e0(this.url, {
      headers: this.headers,
      schema: t,
      fetch: this.fetch,
    });
  }
  rpc(t, r = {}, { head: n = !1, get: a = !1, count: s } = {}) {
    let o;
    const i = new URL(`${this.url}/rpc/${t}`);
    let l;
    n || a
      ? ((o = n ? "HEAD" : "GET"),
        Object.entries(r)
          .filter(([d, h]) => h !== void 0)
          .map(([d, h]) => [d, Array.isArray(h) ? `{${h.join(",")}}` : `${h}`])
          .forEach(([d, h]) => {
            i.searchParams.append(d, h);
          }))
      : ((o = "POST"), (l = r));
    const u = Object.assign({}, this.headers);
    return (
      s && (u.Prefer = `count=${s}`),
      new Y2.default({
        method: o,
        url: i,
        headers: u,
        schema: this.schemaName,
        body: l,
        fetch: this.fetch,
        allowEmpty: !1,
      })
    );
  }
};
Vh.default = Z2;
var Ya =
  (xt && xt.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.PostgrestError =
  tt.PostgrestBuilder =
  tt.PostgrestTransformBuilder =
  tt.PostgrestFilterBuilder =
  tt.PostgrestQueryBuilder =
  tt.PostgrestClient =
    void 0;
const t0 = Ya(Vh);
tt.PostgrestClient = t0.default;
const r0 = Ya($l);
tt.PostgrestQueryBuilder = r0.default;
const n0 = Ya(_o);
tt.PostgrestFilterBuilder = n0.default;
const a0 = Ya(Fl);
tt.PostgrestTransformBuilder = a0.default;
const s0 = Ya(zl);
tt.PostgrestBuilder = s0.default;
const o0 = Ya(Ul);
tt.PostgrestError = o0.default;
var eC = (tt.default = {
  PostgrestClient: t0.default,
  PostgrestQueryBuilder: r0.default,
  PostgrestFilterBuilder: n0.default,
  PostgrestTransformBuilder: a0.default,
  PostgrestBuilder: s0.default,
  PostgrestError: o0.default,
});
const {
  PostgrestClient: tC,
  PostgrestQueryBuilder: n4,
  PostgrestFilterBuilder: a4,
  PostgrestTransformBuilder: s4,
  PostgrestBuilder: o4,
  PostgrestError: i4,
} = eC;
function rC() {
  if (typeof WebSocket < "u") return WebSocket;
  if (typeof global.WebSocket < "u") return global.WebSocket;
  if (typeof window.WebSocket < "u") return window.WebSocket;
  if (typeof self.WebSocket < "u") return self.WebSocket;
  throw new Error("`WebSocket` is not supported in this environment");
}
const nC = rC(),
  aC = "2.11.15",
  sC = `realtime-js/${aC}`,
  oC = "1.0.0",
  i0 = 1e4,
  iC = 1e3;
var Ls;
(function (e) {
  ((e[(e.connecting = 0)] = "connecting"),
    (e[(e.open = 1)] = "open"),
    (e[(e.closing = 2)] = "closing"),
    (e[(e.closed = 3)] = "closed"));
})(Ls || (Ls = {}));
var $e;
(function (e) {
  ((e.closed = "closed"),
    (e.errored = "errored"),
    (e.joined = "joined"),
    (e.joining = "joining"),
    (e.leaving = "leaving"));
})($e || ($e = {}));
var Rt;
(function (e) {
  ((e.close = "phx_close"),
    (e.error = "phx_error"),
    (e.join = "phx_join"),
    (e.reply = "phx_reply"),
    (e.leave = "phx_leave"),
    (e.access_token = "access_token"));
})(Rt || (Rt = {}));
var id;
(function (e) {
  e.websocket = "websocket";
})(id || (id = {}));
var wn;
(function (e) {
  ((e.Connecting = "connecting"),
    (e.Open = "open"),
    (e.Closing = "closing"),
    (e.Closed = "closed"));
})(wn || (wn = {}));
class lC {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(t, r) {
    return t.constructor === ArrayBuffer
      ? r(this._binaryDecode(t))
      : r(typeof t == "string" ? JSON.parse(t) : {});
  }
  _binaryDecode(t) {
    const r = new DataView(t),
      n = new TextDecoder();
    return this._decodeBroadcast(t, r, n);
  }
  _decodeBroadcast(t, r, n) {
    const a = r.getUint8(1),
      s = r.getUint8(2);
    let o = this.HEADER_LENGTH + 2;
    const i = n.decode(t.slice(o, o + a));
    o = o + a;
    const l = n.decode(t.slice(o, o + s));
    o = o + s;
    const u = JSON.parse(n.decode(t.slice(o, t.byteLength)));
    return { ref: null, topic: i, event: l, payload: u };
  }
}
class l0 {
  constructor(t, r) {
    ((this.callback = t),
      (this.timerCalc = r),
      (this.timer = void 0),
      (this.tries = 0),
      (this.callback = t),
      (this.timerCalc = r));
  }
  reset() {
    ((this.tries = 0), clearTimeout(this.timer));
  }
  scheduleTimeout() {
    (clearTimeout(this.timer),
      (this.timer = setTimeout(
        () => {
          ((this.tries = this.tries + 1), this.callback());
        },
        this.timerCalc(this.tries + 1),
      )));
  }
}
var ce;
(function (e) {
  ((e.abstime = "abstime"),
    (e.bool = "bool"),
    (e.date = "date"),
    (e.daterange = "daterange"),
    (e.float4 = "float4"),
    (e.float8 = "float8"),
    (e.int2 = "int2"),
    (e.int4 = "int4"),
    (e.int4range = "int4range"),
    (e.int8 = "int8"),
    (e.int8range = "int8range"),
    (e.json = "json"),
    (e.jsonb = "jsonb"),
    (e.money = "money"),
    (e.numeric = "numeric"),
    (e.oid = "oid"),
    (e.reltime = "reltime"),
    (e.text = "text"),
    (e.time = "time"),
    (e.timestamp = "timestamp"),
    (e.timestamptz = "timestamptz"),
    (e.timetz = "timetz"),
    (e.tsrange = "tsrange"),
    (e.tstzrange = "tstzrange"));
})(ce || (ce = {}));
const jm = (e, t, r = {}) => {
    var n;
    const a = (n = r.skipTypes) !== null && n !== void 0 ? n : [];
    return Object.keys(t).reduce((s, o) => ((s[o] = cC(o, e, t, a)), s), {});
  },
  cC = (e, t, r, n) => {
    const a = t.find((i) => i.name === e),
      s = a == null ? void 0 : a.type,
      o = r[e];
    return s && !n.includes(s) ? c0(s, o) : ld(o);
  },
  c0 = (e, t) => {
    if (e.charAt(0) === "_") {
      const r = e.slice(1, e.length);
      return fC(t, r);
    }
    switch (e) {
      case ce.bool:
        return uC(t);
      case ce.float4:
      case ce.float8:
      case ce.int2:
      case ce.int4:
      case ce.int8:
      case ce.numeric:
      case ce.oid:
        return dC(t);
      case ce.json:
      case ce.jsonb:
        return hC(t);
      case ce.timestamp:
        return pC(t);
      case ce.abstime:
      case ce.date:
      case ce.daterange:
      case ce.int4range:
      case ce.int8range:
      case ce.money:
      case ce.reltime:
      case ce.text:
      case ce.time:
      case ce.timestamptz:
      case ce.timetz:
      case ce.tsrange:
      case ce.tstzrange:
        return ld(t);
      default:
        return ld(t);
    }
  },
  ld = (e) => e,
  uC = (e) => {
    switch (e) {
      case "t":
        return !0;
      case "f":
        return !1;
      default:
        return e;
    }
  },
  dC = (e) => {
    if (typeof e == "string") {
      const t = parseFloat(e);
      if (!Number.isNaN(t)) return t;
    }
    return e;
  },
  hC = (e) => {
    if (typeof e == "string")
      try {
        return JSON.parse(e);
      } catch (t) {
        return (console.log(`JSON parse error: ${t}`), e);
      }
    return e;
  },
  fC = (e, t) => {
    if (typeof e != "string") return e;
    const r = e.length - 1,
      n = e[r];
    if (e[0] === "{" && n === "}") {
      let a;
      const s = e.slice(1, r);
      try {
        a = JSON.parse("[" + s + "]");
      } catch {
        a = s ? s.split(",") : [];
      }
      return a.map((o) => c0(t, o));
    }
    return e;
  },
  pC = (e) => (typeof e == "string" ? e.replace(" ", "T") : e),
  u0 = (e) => {
    let t = e;
    return (
      (t = t.replace(/^ws/i, "http")),
      (t = t.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "")),
      t.replace(/\/+$/, "")
    );
  };
class Ic {
  constructor(t, r, n = {}, a = i0) {
    ((this.channel = t),
      (this.event = r),
      (this.payload = n),
      (this.timeout = a),
      (this.sent = !1),
      (this.timeoutTimer = void 0),
      (this.ref = ""),
      (this.receivedResp = null),
      (this.recHooks = []),
      (this.refEvent = null));
  }
  resend(t) {
    ((this.timeout = t),
      this._cancelRefEvent(),
      (this.ref = ""),
      (this.refEvent = null),
      (this.receivedResp = null),
      (this.sent = !1),
      this.send());
  }
  send() {
    this._hasReceived("timeout") ||
      (this.startTimeout(),
      (this.sent = !0),
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref,
        join_ref: this.channel._joinRef(),
      }));
  }
  updatePayload(t) {
    this.payload = Object.assign(Object.assign({}, this.payload), t);
  }
  receive(t, r) {
    var n;
    return (
      this._hasReceived(t) &&
        r(
          (n = this.receivedResp) === null || n === void 0
            ? void 0
            : n.response,
        ),
      this.recHooks.push({ status: t, callback: r }),
      this
    );
  }
  startTimeout() {
    if (this.timeoutTimer) return;
    ((this.ref = this.channel.socket._makeRef()),
      (this.refEvent = this.channel._replyEventName(this.ref)));
    const t = (r) => {
      (this._cancelRefEvent(),
        this._cancelTimeout(),
        (this.receivedResp = r),
        this._matchReceive(r));
    };
    (this.channel._on(this.refEvent, {}, t),
      (this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout)));
  }
  trigger(t, r) {
    this.refEvent &&
      this.channel._trigger(this.refEvent, { status: t, response: r });
  }
  destroy() {
    (this._cancelRefEvent(), this._cancelTimeout());
  }
  _cancelRefEvent() {
    this.refEvent && this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    (clearTimeout(this.timeoutTimer), (this.timeoutTimer = void 0));
  }
  _matchReceive({ status: t, response: r }) {
    this.recHooks.filter((n) => n.status === t).forEach((n) => n.callback(r));
  }
  _hasReceived(t) {
    return this.receivedResp && this.receivedResp.status === t;
  }
}
var Em;
(function (e) {
  ((e.SYNC = "sync"), (e.JOIN = "join"), (e.LEAVE = "leave"));
})(Em || (Em = {}));
class $s {
  constructor(t, r) {
    ((this.channel = t),
      (this.state = {}),
      (this.pendingDiffs = []),
      (this.joinRef = null),
      (this.caller = {
        onJoin: () => {},
        onLeave: () => {},
        onSync: () => {},
      }));
    const n = (r == null ? void 0 : r.events) || {
      state: "presence_state",
      diff: "presence_diff",
    };
    (this.channel._on(n.state, {}, (a) => {
      const { onJoin: s, onLeave: o, onSync: i } = this.caller;
      ((this.joinRef = this.channel._joinRef()),
        (this.state = $s.syncState(this.state, a, s, o)),
        this.pendingDiffs.forEach((l) => {
          this.state = $s.syncDiff(this.state, l, s, o);
        }),
        (this.pendingDiffs = []),
        i());
    }),
      this.channel._on(n.diff, {}, (a) => {
        const { onJoin: s, onLeave: o, onSync: i } = this.caller;
        this.inPendingSyncState()
          ? this.pendingDiffs.push(a)
          : ((this.state = $s.syncDiff(this.state, a, s, o)), i());
      }),
      this.onJoin((a, s, o) => {
        this.channel._trigger("presence", {
          event: "join",
          key: a,
          currentPresences: s,
          newPresences: o,
        });
      }),
      this.onLeave((a, s, o) => {
        this.channel._trigger("presence", {
          event: "leave",
          key: a,
          currentPresences: s,
          leftPresences: o,
        });
      }),
      this.onSync(() => {
        this.channel._trigger("presence", { event: "sync" });
      }));
  }
  static syncState(t, r, n, a) {
    const s = this.cloneDeep(t),
      o = this.transformState(r),
      i = {},
      l = {};
    return (
      this.map(s, (u, d) => {
        o[u] || (l[u] = d);
      }),
      this.map(o, (u, d) => {
        const h = s[u];
        if (h) {
          const f = d.map((w) => w.presence_ref),
            v = h.map((w) => w.presence_ref),
            g = d.filter((w) => v.indexOf(w.presence_ref) < 0),
            m = h.filter((w) => f.indexOf(w.presence_ref) < 0);
          (g.length > 0 && (i[u] = g), m.length > 0 && (l[u] = m));
        } else i[u] = d;
      }),
      this.syncDiff(s, { joins: i, leaves: l }, n, a)
    );
  }
  static syncDiff(t, r, n, a) {
    const { joins: s, leaves: o } = {
      joins: this.transformState(r.joins),
      leaves: this.transformState(r.leaves),
    };
    return (
      n || (n = () => {}),
      a || (a = () => {}),
      this.map(s, (i, l) => {
        var u;
        const d = (u = t[i]) !== null && u !== void 0 ? u : [];
        if (((t[i] = this.cloneDeep(l)), d.length > 0)) {
          const h = t[i].map((v) => v.presence_ref),
            f = d.filter((v) => h.indexOf(v.presence_ref) < 0);
          t[i].unshift(...f);
        }
        n(i, d, l);
      }),
      this.map(o, (i, l) => {
        let u = t[i];
        if (!u) return;
        const d = l.map((h) => h.presence_ref);
        ((u = u.filter((h) => d.indexOf(h.presence_ref) < 0)),
          (t[i] = u),
          a(i, u, l),
          u.length === 0 && delete t[i]);
      }),
      t
    );
  }
  static map(t, r) {
    return Object.getOwnPropertyNames(t).map((n) => r(n, t[n]));
  }
  static transformState(t) {
    return (
      (t = this.cloneDeep(t)),
      Object.getOwnPropertyNames(t).reduce((r, n) => {
        const a = t[n];
        return (
          "metas" in a
            ? (r[n] = a.metas.map(
                (s) => (
                  (s.presence_ref = s.phx_ref),
                  delete s.phx_ref,
                  delete s.phx_ref_prev,
                  s
                ),
              ))
            : (r[n] = a),
          r
        );
      }, {})
    );
  }
  static cloneDeep(t) {
    return JSON.parse(JSON.stringify(t));
  }
  onJoin(t) {
    this.caller.onJoin = t;
  }
  onLeave(t) {
    this.caller.onLeave = t;
  }
  onSync(t) {
    this.caller.onSync = t;
  }
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var Nm;
(function (e) {
  ((e.ALL = "*"),
    (e.INSERT = "INSERT"),
    (e.UPDATE = "UPDATE"),
    (e.DELETE = "DELETE"));
})(Nm || (Nm = {}));
var Cm;
(function (e) {
  ((e.BROADCAST = "broadcast"),
    (e.PRESENCE = "presence"),
    (e.POSTGRES_CHANGES = "postgres_changes"),
    (e.SYSTEM = "system"));
})(Cm || (Cm = {}));
var ur;
(function (e) {
  ((e.SUBSCRIBED = "SUBSCRIBED"),
    (e.TIMED_OUT = "TIMED_OUT"),
    (e.CLOSED = "CLOSED"),
    (e.CHANNEL_ERROR = "CHANNEL_ERROR"));
})(ur || (ur = {}));
class Kh {
  constructor(t, r = { config: {} }, n) {
    ((this.topic = t),
      (this.params = r),
      (this.socket = n),
      (this.bindings = {}),
      (this.state = $e.closed),
      (this.joinedOnce = !1),
      (this.pushBuffer = []),
      (this.subTopic = t.replace(/^realtime:/i, "")),
      (this.params.config = Object.assign(
        {
          broadcast: { ack: !1, self: !1 },
          presence: { key: "" },
          private: !1,
        },
        r.config,
      )),
      (this.timeout = this.socket.timeout),
      (this.joinPush = new Ic(this, Rt.join, this.params, this.timeout)),
      (this.rejoinTimer = new l0(
        () => this._rejoinUntilConnected(),
        this.socket.reconnectAfterMs,
      )),
      this.joinPush.receive("ok", () => {
        ((this.state = $e.joined),
          this.rejoinTimer.reset(),
          this.pushBuffer.forEach((a) => a.send()),
          (this.pushBuffer = []));
      }),
      this._onClose(() => {
        (this.rejoinTimer.reset(),
          this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`),
          (this.state = $e.closed),
          this.socket._remove(this));
      }),
      this._onError((a) => {
        this._isLeaving() ||
          this._isClosed() ||
          (this.socket.log("channel", `error ${this.topic}`, a),
          (this.state = $e.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this.joinPush.receive("timeout", () => {
        this._isJoining() &&
          (this.socket.log(
            "channel",
            `timeout ${this.topic}`,
            this.joinPush.timeout,
          ),
          (this.state = $e.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this._on(Rt.reply, {}, (a, s) => {
        this._trigger(this._replyEventName(s), a);
      }),
      (this.presence = new $s(this)),
      (this.broadcastEndpointURL = u0(this.socket.endPoint) + "/api/broadcast"),
      (this.private = this.params.config.private || !1));
  }
  subscribe(t, r = this.timeout) {
    var n, a;
    if (
      (this.socket.isConnected() || this.socket.connect(),
      this.state == $e.closed)
    ) {
      const {
        config: { broadcast: s, presence: o, private: i },
      } = this.params;
      (this._onError((d) => (t == null ? void 0 : t(ur.CHANNEL_ERROR, d))),
        this._onClose(() => (t == null ? void 0 : t(ur.CLOSED))));
      const l = {},
        u = {
          broadcast: s,
          presence: o,
          postgres_changes:
            (a =
              (n = this.bindings.postgres_changes) === null || n === void 0
                ? void 0
                : n.map((d) => d.filter)) !== null && a !== void 0
              ? a
              : [],
          private: i,
        };
      (this.socket.accessTokenValue &&
        (l.access_token = this.socket.accessTokenValue),
        this.updateJoinPayload(Object.assign({ config: u }, l)),
        (this.joinedOnce = !0),
        this._rejoin(r),
        this.joinPush
          .receive("ok", async ({ postgres_changes: d }) => {
            var h;
            if ((this.socket.setAuth(), d === void 0)) {
              t == null || t(ur.SUBSCRIBED);
              return;
            } else {
              const f = this.bindings.postgres_changes,
                v =
                  (h = f == null ? void 0 : f.length) !== null && h !== void 0
                    ? h
                    : 0,
                g = [];
              for (let m = 0; m < v; m++) {
                const w = f[m],
                  {
                    filter: { event: y, schema: b, table: x, filter: k },
                  } = w,
                  S = d && d[m];
                if (
                  S &&
                  S.event === y &&
                  S.schema === b &&
                  S.table === x &&
                  S.filter === k
                )
                  g.push(Object.assign(Object.assign({}, w), { id: S.id }));
                else {
                  (this.unsubscribe(),
                    (this.state = $e.errored),
                    t == null ||
                      t(
                        ur.CHANNEL_ERROR,
                        new Error(
                          "mismatch between server and client bindings for postgres changes",
                        ),
                      ));
                  return;
                }
              }
              ((this.bindings.postgres_changes = g), t && t(ur.SUBSCRIBED));
              return;
            }
          })
          .receive("error", (d) => {
            ((this.state = $e.errored),
              t == null ||
                t(
                  ur.CHANNEL_ERROR,
                  new Error(
                    JSON.stringify(Object.values(d).join(", ") || "error"),
                  ),
                ));
          })
          .receive("timeout", () => {
            t == null || t(ur.TIMED_OUT);
          }));
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(t, r = {}) {
    return await this.send(
      { type: "presence", event: "track", payload: t },
      r.timeout || this.timeout,
    );
  }
  async untrack(t = {}) {
    return await this.send({ type: "presence", event: "untrack" }, t);
  }
  on(t, r, n) {
    return this._on(t, r, n);
  }
  async send(t, r = {}) {
    var n, a;
    if (!this._canPush() && t.type === "broadcast") {
      const { event: s, payload: o } = t,
        i = {
          method: "POST",
          headers: {
            Authorization: this.socket.accessTokenValue
              ? `Bearer ${this.socket.accessTokenValue}`
              : "",
            apikey: this.socket.apiKey ? this.socket.apiKey : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                topic: this.subTopic,
                event: s,
                payload: o,
                private: this.private,
              },
            ],
          }),
        };
      try {
        const l = await this._fetchWithTimeout(
          this.broadcastEndpointURL,
          i,
          (n = r.timeout) !== null && n !== void 0 ? n : this.timeout,
        );
        return (
          await ((a = l.body) === null || a === void 0 ? void 0 : a.cancel()),
          l.ok ? "ok" : "error"
        );
      } catch (l) {
        return l.name === "AbortError" ? "timed out" : "error";
      }
    } else
      return new Promise((s) => {
        var o, i, l;
        const u = this._push(t.type, t, r.timeout || this.timeout);
        (t.type === "broadcast" &&
          !(
            !(
              (l =
                (i =
                  (o = this.params) === null || o === void 0
                    ? void 0
                    : o.config) === null || i === void 0
                  ? void 0
                  : i.broadcast) === null || l === void 0
            ) && l.ack
          ) &&
          s("ok"),
          u.receive("ok", () => s("ok")),
          u.receive("error", () => s("error")),
          u.receive("timeout", () => s("timed out")));
      });
  }
  updateJoinPayload(t) {
    this.joinPush.updatePayload(t);
  }
  unsubscribe(t = this.timeout) {
    this.state = $e.leaving;
    const r = () => {
      (this.socket.log("channel", `leave ${this.topic}`),
        this._trigger(Rt.close, "leave", this._joinRef()));
    };
    this.joinPush.destroy();
    let n = null;
    return new Promise((a) => {
      ((n = new Ic(this, Rt.leave, {}, t)),
        n
          .receive("ok", () => {
            (r(), a("ok"));
          })
          .receive("timeout", () => {
            (r(), a("timed out"));
          })
          .receive("error", () => {
            a("error");
          }),
        n.send(),
        this._canPush() || n.trigger("ok", {}));
    }).finally(() => {
      n == null || n.destroy();
    });
  }
  teardown() {
    (this.pushBuffer.forEach((t) => t.destroy()),
      this.rejoinTimer && clearTimeout(this.rejoinTimer.timer),
      this.joinPush.destroy());
  }
  async _fetchWithTimeout(t, r, n) {
    const a = new AbortController(),
      s = setTimeout(() => a.abort(), n),
      o = await this.socket.fetch(
        t,
        Object.assign(Object.assign({}, r), { signal: a.signal }),
      );
    return (clearTimeout(s), o);
  }
  _push(t, r, n = this.timeout) {
    if (!this.joinedOnce)
      throw `tried to push '${t}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    let a = new Ic(this, t, r, n);
    return (
      this._canPush() ? a.send() : (a.startTimeout(), this.pushBuffer.push(a)),
      a
    );
  }
  _onMessage(t, r, n) {
    return r;
  }
  _isMember(t) {
    return this.topic === t;
  }
  _joinRef() {
    return this.joinPush.ref;
  }
  _trigger(t, r, n) {
    var a, s;
    const o = t.toLocaleLowerCase(),
      { close: i, error: l, leave: u, join: d } = Rt;
    if (n && [i, l, u, d].indexOf(o) >= 0 && n !== this._joinRef()) return;
    let h = this._onMessage(o, r, n);
    if (r && !h)
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    ["insert", "update", "delete"].includes(o)
      ? (a = this.bindings.postgres_changes) === null ||
        a === void 0 ||
        a
          .filter((f) => {
            var v, g, m;
            return (
              ((v = f.filter) === null || v === void 0 ? void 0 : v.event) ===
                "*" ||
              ((m =
                (g = f.filter) === null || g === void 0 ? void 0 : g.event) ===
                null || m === void 0
                ? void 0
                : m.toLocaleLowerCase()) === o
            );
          })
          .map((f) => f.callback(h, n))
      : (s = this.bindings[o]) === null ||
        s === void 0 ||
        s
          .filter((f) => {
            var v, g, m, w, y, b;
            if (["broadcast", "presence", "postgres_changes"].includes(o))
              if ("id" in f) {
                const x = f.id,
                  k =
                    (v = f.filter) === null || v === void 0 ? void 0 : v.event;
                return (
                  x &&
                  ((g = r.ids) === null || g === void 0
                    ? void 0
                    : g.includes(x)) &&
                  (k === "*" ||
                    (k == null ? void 0 : k.toLocaleLowerCase()) ===
                      ((m = r.data) === null || m === void 0
                        ? void 0
                        : m.type.toLocaleLowerCase()))
                );
              } else {
                const x =
                  (y =
                    (w = f == null ? void 0 : f.filter) === null || w === void 0
                      ? void 0
                      : w.event) === null || y === void 0
                    ? void 0
                    : y.toLocaleLowerCase();
                return (
                  x === "*" ||
                  x ===
                    ((b = r == null ? void 0 : r.event) === null || b === void 0
                      ? void 0
                      : b.toLocaleLowerCase())
                );
              }
            else return f.type.toLocaleLowerCase() === o;
          })
          .map((f) => {
            if (typeof h == "object" && "ids" in h) {
              const v = h.data,
                {
                  schema: g,
                  table: m,
                  commit_timestamp: w,
                  type: y,
                  errors: b,
                } = v;
              h = Object.assign(
                Object.assign(
                  {},
                  {
                    schema: g,
                    table: m,
                    commit_timestamp: w,
                    eventType: y,
                    new: {},
                    old: {},
                    errors: b,
                  },
                ),
                this._getPayloadRecords(v),
              );
            }
            f.callback(h, n);
          });
  }
  _isClosed() {
    return this.state === $e.closed;
  }
  _isJoined() {
    return this.state === $e.joined;
  }
  _isJoining() {
    return this.state === $e.joining;
  }
  _isLeaving() {
    return this.state === $e.leaving;
  }
  _replyEventName(t) {
    return `chan_reply_${t}`;
  }
  _on(t, r, n) {
    const a = t.toLocaleLowerCase(),
      s = { type: a, filter: r, callback: n };
    return (
      this.bindings[a] ? this.bindings[a].push(s) : (this.bindings[a] = [s]),
      this
    );
  }
  _off(t, r) {
    const n = t.toLocaleLowerCase();
    return (
      (this.bindings[n] = this.bindings[n].filter((a) => {
        var s;
        return !(
          ((s = a.type) === null || s === void 0
            ? void 0
            : s.toLocaleLowerCase()) === n && Kh.isEqual(a.filter, r)
        );
      })),
      this
    );
  }
  static isEqual(t, r) {
    if (Object.keys(t).length !== Object.keys(r).length) return !1;
    for (const n in t) if (t[n] !== r[n]) return !1;
    return !0;
  }
  _rejoinUntilConnected() {
    (this.rejoinTimer.scheduleTimeout(),
      this.socket.isConnected() && this._rejoin());
  }
  _onClose(t) {
    this._on(Rt.close, {}, t);
  }
  _onError(t) {
    this._on(Rt.error, {}, (r) => t(r));
  }
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  _rejoin(t = this.timeout) {
    this._isLeaving() ||
      (this.socket._leaveOpenTopic(this.topic),
      (this.state = $e.joining),
      this.joinPush.resend(t));
  }
  _getPayloadRecords(t) {
    const r = { new: {}, old: {} };
    return (
      (t.type === "INSERT" || t.type === "UPDATE") &&
        (r.new = jm(t.columns, t.record)),
      (t.type === "UPDATE" || t.type === "DELETE") &&
        (r.old = jm(t.columns, t.old_record)),
      r
    );
  }
}
const Tm = () => {},
  mC = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
class gC {
  constructor(t, r) {
    var n;
    ((this.accessTokenValue = null),
      (this.apiKey = null),
      (this.channels = new Array()),
      (this.endPoint = ""),
      (this.httpEndpoint = ""),
      (this.headers = {}),
      (this.params = {}),
      (this.timeout = i0),
      (this.heartbeatIntervalMs = 25e3),
      (this.heartbeatTimer = void 0),
      (this.pendingHeartbeatRef = null),
      (this.heartbeatCallback = Tm),
      (this.ref = 0),
      (this.logger = Tm),
      (this.conn = null),
      (this.sendBuffer = []),
      (this.serializer = new lC()),
      (this.stateChangeCallbacks = {
        open: [],
        close: [],
        error: [],
        message: [],
      }),
      (this.accessToken = null),
      (this._resolveFetch = (s) => {
        let o;
        return (
          s
            ? (o = s)
            : typeof fetch > "u"
              ? (o = (...i) =>
                  So(async () => {
                    const { default: l } = await Promise.resolve().then(
                      () => Ja,
                    );
                    return { default: l };
                  }).then(({ default: l }) => l(...i)))
              : (o = fetch),
          (...i) => o(...i)
        );
      }),
      (this.endPoint = `${t}/${id.websocket}`),
      (this.httpEndpoint = u0(t)),
      r != null && r.transport
        ? (this.transport = r.transport)
        : (this.transport = null),
      r != null && r.params && (this.params = r.params),
      r != null && r.timeout && (this.timeout = r.timeout),
      r != null && r.logger && (this.logger = r.logger),
      ((r != null && r.logLevel) || (r != null && r.log_level)) &&
        ((this.logLevel = r.logLevel || r.log_level),
        (this.params = Object.assign(Object.assign({}, this.params), {
          log_level: this.logLevel,
        }))),
      r != null &&
        r.heartbeatIntervalMs &&
        (this.heartbeatIntervalMs = r.heartbeatIntervalMs));
    const a =
      (n = r == null ? void 0 : r.params) === null || n === void 0
        ? void 0
        : n.apikey;
    if (
      (a && ((this.accessTokenValue = a), (this.apiKey = a)),
      (this.reconnectAfterMs =
        r != null && r.reconnectAfterMs
          ? r.reconnectAfterMs
          : (s) => [1e3, 2e3, 5e3, 1e4][s - 1] || 1e4),
      (this.encode =
        r != null && r.encode ? r.encode : (s, o) => o(JSON.stringify(s))),
      (this.decode =
        r != null && r.decode
          ? r.decode
          : this.serializer.decode.bind(this.serializer)),
      (this.reconnectTimer = new l0(async () => {
        (this.disconnect(), this.connect());
      }, this.reconnectAfterMs)),
      (this.fetch = this._resolveFetch(r == null ? void 0 : r.fetch)),
      r != null && r.worker)
    ) {
      if (typeof window < "u" && !window.Worker)
        throw new Error("Web Worker is not supported");
      ((this.worker = (r == null ? void 0 : r.worker) || !1),
        (this.workerUrl = r == null ? void 0 : r.workerUrl));
    }
    this.accessToken = (r == null ? void 0 : r.accessToken) || null;
  }
  connect() {
    if (!this.conn) {
      if ((this.transport || (this.transport = nC), !this.transport))
        throw new Error("No transport provided");
      ((this.conn = new this.transport(this.endpointURL())),
        this.setupConnection());
    }
  }
  endpointURL() {
    return this._appendParams(
      this.endPoint,
      Object.assign({}, this.params, { vsn: oC }),
    );
  }
  disconnect(t, r) {
    this.conn &&
      ((this.conn.onclose = function () {}),
      t ? this.conn.close(t, r ?? "") : this.conn.close(),
      (this.conn = null),
      this.heartbeatTimer && clearInterval(this.heartbeatTimer),
      this.reconnectTimer.reset(),
      this.channels.forEach((n) => n.teardown()));
  }
  getChannels() {
    return this.channels;
  }
  async removeChannel(t) {
    const r = await t.unsubscribe();
    return (this.channels.length === 0 && this.disconnect(), r);
  }
  async removeAllChannels() {
    const t = await Promise.all(this.channels.map((r) => r.unsubscribe()));
    return ((this.channels = []), this.disconnect(), t);
  }
  log(t, r, n) {
    this.logger(t, r, n);
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case Ls.connecting:
        return wn.Connecting;
      case Ls.open:
        return wn.Open;
      case Ls.closing:
        return wn.Closing;
      default:
        return wn.Closed;
    }
  }
  isConnected() {
    return this.connectionState() === wn.Open;
  }
  channel(t, r = { config: {} }) {
    const n = `realtime:${t}`,
      a = this.getChannels().find((s) => s.topic === n);
    if (a) return a;
    {
      const s = new Kh(`realtime:${t}`, r, this);
      return (this.channels.push(s), s);
    }
  }
  push(t) {
    const { topic: r, event: n, payload: a, ref: s } = t,
      o = () => {
        this.encode(t, (i) => {
          var l;
          (l = this.conn) === null || l === void 0 || l.send(i);
        });
      };
    (this.log("push", `${r} ${n} (${s})`, a),
      this.isConnected() ? o() : this.sendBuffer.push(o));
  }
  async setAuth(t = null) {
    let r =
      t ||
      (this.accessToken && (await this.accessToken())) ||
      this.accessTokenValue;
    this.accessTokenValue != r &&
      ((this.accessTokenValue = r),
      this.channels.forEach((n) => {
        const a = { access_token: r, version: sC };
        (r && n.updateJoinPayload(a),
          n.joinedOnce &&
            n._isJoined() &&
            n._push(Rt.access_token, { access_token: r }));
      }));
  }
  async sendHeartbeat() {
    var t;
    if (!this.isConnected()) {
      this.heartbeatCallback("disconnected");
      return;
    }
    if (this.pendingHeartbeatRef) {
      ((this.pendingHeartbeatRef = null),
        this.log(
          "transport",
          "heartbeat timeout. Attempting to re-establish connection",
        ),
        this.heartbeatCallback("timeout"),
        (t = this.conn) === null ||
          t === void 0 ||
          t.close(iC, "hearbeat timeout"));
      return;
    }
    ((this.pendingHeartbeatRef = this._makeRef()),
      this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef,
      }),
      this.heartbeatCallback("sent"),
      await this.setAuth());
  }
  onHeartbeat(t) {
    this.heartbeatCallback = t;
  }
  flushSendBuffer() {
    this.isConnected() &&
      this.sendBuffer.length > 0 &&
      (this.sendBuffer.forEach((t) => t()), (this.sendBuffer = []));
  }
  _makeRef() {
    let t = this.ref + 1;
    return (
      t === this.ref ? (this.ref = 0) : (this.ref = t),
      this.ref.toString()
    );
  }
  _leaveOpenTopic(t) {
    let r = this.channels.find(
      (n) => n.topic === t && (n._isJoined() || n._isJoining()),
    );
    r &&
      (this.log("transport", `leaving duplicate topic "${t}"`),
      r.unsubscribe());
  }
  _remove(t) {
    this.channels = this.channels.filter((r) => r.topic !== t.topic);
  }
  setupConnection() {
    this.conn &&
      ((this.conn.binaryType = "arraybuffer"),
      (this.conn.onopen = () => this._onConnOpen()),
      (this.conn.onerror = (t) => this._onConnError(t)),
      (this.conn.onmessage = (t) => this._onConnMessage(t)),
      (this.conn.onclose = (t) => this._onConnClose(t)));
  }
  _onConnMessage(t) {
    this.decode(t.data, (r) => {
      let { topic: n, event: a, payload: s, ref: o } = r;
      (n === "phoenix" &&
        a === "phx_reply" &&
        this.heartbeatCallback(r.payload.status == "ok" ? "ok" : "error"),
        o &&
          o === this.pendingHeartbeatRef &&
          (this.pendingHeartbeatRef = null),
        this.log(
          "receive",
          `${s.status || ""} ${n} ${a} ${(o && "(" + o + ")") || ""}`,
          s,
        ),
        Array.from(this.channels)
          .filter((i) => i._isMember(n))
          .forEach((i) => i._trigger(a, s, o)),
        this.stateChangeCallbacks.message.forEach((i) => i(r)));
    });
  }
  _onConnOpen() {
    (this.log("transport", `connected to ${this.endpointURL()}`),
      this.flushSendBuffer(),
      this.reconnectTimer.reset(),
      this.worker
        ? this.workerRef || this._startWorkerHeartbeat()
        : this._startHeartbeat(),
      this.stateChangeCallbacks.open.forEach((t) => t()));
  }
  _startHeartbeat() {
    (this.heartbeatTimer && clearInterval(this.heartbeatTimer),
      (this.heartbeatTimer = setInterval(
        () => this.sendHeartbeat(),
        this.heartbeatIntervalMs,
      )));
  }
  _startWorkerHeartbeat() {
    this.workerUrl
      ? this.log("worker", `starting worker for from ${this.workerUrl}`)
      : this.log("worker", "starting default worker");
    const t = this._workerObjectUrl(this.workerUrl);
    ((this.workerRef = new Worker(t)),
      (this.workerRef.onerror = (r) => {
        (this.log("worker", "worker error", r.message),
          this.workerRef.terminate());
      }),
      (this.workerRef.onmessage = (r) => {
        r.data.event === "keepAlive" && this.sendHeartbeat();
      }),
      this.workerRef.postMessage({
        event: "start",
        interval: this.heartbeatIntervalMs,
      }));
  }
  _onConnClose(t) {
    (this.log("transport", "close", t),
      this._triggerChanError(),
      this.heartbeatTimer && clearInterval(this.heartbeatTimer),
      this.reconnectTimer.scheduleTimeout(),
      this.stateChangeCallbacks.close.forEach((r) => r(t)));
  }
  _onConnError(t) {
    (this.log("transport", `${t}`),
      this._triggerChanError(),
      this.stateChangeCallbacks.error.forEach((r) => r(t)));
  }
  _triggerChanError() {
    this.channels.forEach((t) => t._trigger(Rt.error));
  }
  _appendParams(t, r) {
    if (Object.keys(r).length === 0) return t;
    const n = t.match(/\?/) ? "&" : "?",
      a = new URLSearchParams(r);
    return `${t}${n}${a}`;
  }
  _workerObjectUrl(t) {
    let r;
    if (t) r = t;
    else {
      const n = new Blob([mC], { type: "application/javascript" });
      r = URL.createObjectURL(n);
    }
    return r;
  }
}
class Gh extends Error {
  constructor(t) {
    (super(t), (this.__isStorageError = !0), (this.name = "StorageError"));
  }
}
function Ce(e) {
  return typeof e == "object" && e !== null && "__isStorageError" in e;
}
class vC extends Gh {
  constructor(t, r, n) {
    (super(t),
      (this.name = "StorageApiError"),
      (this.status = r),
      (this.statusCode = n));
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}
class cd extends Gh {
  constructor(t, r) {
    (super(t), (this.name = "StorageUnknownError"), (this.originalError = r));
  }
}
var yC = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
const d0 = (e) => {
    let t;
    return (
      e
        ? (t = e)
        : typeof fetch > "u"
          ? (t = (...r) =>
              So(async () => {
                const { default: n } = await Promise.resolve().then(() => Ja);
                return { default: n };
              }).then(({ default: n }) => n(...r)))
          : (t = fetch),
      (...r) => t(...r)
    );
  },
  bC = () =>
    yC(void 0, void 0, void 0, function* () {
      return typeof Response > "u"
        ? (yield So(() => Promise.resolve().then(() => Ja))).Response
        : Response;
    }),
  ud = (e) => {
    if (Array.isArray(e)) return e.map((r) => ud(r));
    if (typeof e == "function" || e !== Object(e)) return e;
    const t = {};
    return (
      Object.entries(e).forEach(([r, n]) => {
        const a = r.replace(/([-_][a-z])/gi, (s) =>
          s.toUpperCase().replace(/[-_]/g, ""),
        );
        t[a] = ud(n);
      }),
      t
    );
  },
  wC = (e) => {
    if (typeof e != "object" || e === null) return !1;
    const t = Object.getPrototypeOf(e);
    return (
      (t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null) &&
      !(Symbol.toStringTag in e) &&
      !(Symbol.iterator in e)
    );
  };
var zn = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
const Dc = (e) =>
    e.msg || e.message || e.error_description || e.error || JSON.stringify(e),
  xC = (e, t, r) =>
    zn(void 0, void 0, void 0, function* () {
      const n = yield bC();
      e instanceof n && !(r != null && r.noResolveJson)
        ? e
            .json()
            .then((a) => {
              const s = e.status || 500,
                o = (a == null ? void 0 : a.statusCode) || s + "";
              t(new vC(Dc(a), s, o));
            })
            .catch((a) => {
              t(new cd(Dc(a), a));
            })
        : t(new cd(Dc(e), e));
    }),
  kC = (e, t, r, n) => {
    const a = { method: e, headers: (t == null ? void 0 : t.headers) || {} };
    return e === "GET" || !n
      ? a
      : (wC(n)
          ? ((a.headers = Object.assign(
              { "Content-Type": "application/json" },
              t == null ? void 0 : t.headers,
            )),
            (a.body = JSON.stringify(n)))
          : (a.body = n),
        Object.assign(Object.assign({}, a), r));
  };
function jo(e, t, r, n, a, s) {
  return zn(this, void 0, void 0, function* () {
    return new Promise((o, i) => {
      e(r, kC(t, n, a, s))
        .then((l) => {
          if (!l.ok) throw l;
          return n != null && n.noResolveJson ? l : l.json();
        })
        .then((l) => o(l))
        .catch((l) => xC(l, i, n));
    });
  });
}
function nl(e, t, r, n) {
  return zn(this, void 0, void 0, function* () {
    return jo(e, "GET", t, r, n);
  });
}
function dr(e, t, r, n, a) {
  return zn(this, void 0, void 0, function* () {
    return jo(e, "POST", t, n, a, r);
  });
}
function dd(e, t, r, n, a) {
  return zn(this, void 0, void 0, function* () {
    return jo(e, "PUT", t, n, a, r);
  });
}
function SC(e, t, r, n) {
  return zn(this, void 0, void 0, function* () {
    return jo(
      e,
      "HEAD",
      t,
      Object.assign(Object.assign({}, r), { noResolveJson: !0 }),
      n,
    );
  });
}
function h0(e, t, r, n, a) {
  return zn(this, void 0, void 0, function* () {
    return jo(e, "DELETE", t, n, a, r);
  });
}
var Ze = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
const _C = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } },
  Pm = {
    cacheControl: "3600",
    contentType: "text/plain;charset=UTF-8",
    upsert: !1,
  };
class jC {
  constructor(t, r = {}, n, a) {
    ((this.url = t),
      (this.headers = r),
      (this.bucketId = n),
      (this.fetch = d0(a)));
  }
  uploadOrUpdate(t, r, n, a) {
    return Ze(this, void 0, void 0, function* () {
      try {
        let s;
        const o = Object.assign(Object.assign({}, Pm), a);
        let i = Object.assign(
          Object.assign({}, this.headers),
          t === "POST" && { "x-upsert": String(o.upsert) },
        );
        const l = o.metadata;
        (typeof Blob < "u" && n instanceof Blob
          ? ((s = new FormData()),
            s.append("cacheControl", o.cacheControl),
            l && s.append("metadata", this.encodeMetadata(l)),
            s.append("", n))
          : typeof FormData < "u" && n instanceof FormData
            ? ((s = n),
              s.append("cacheControl", o.cacheControl),
              l && s.append("metadata", this.encodeMetadata(l)))
            : ((s = n),
              (i["cache-control"] = `max-age=${o.cacheControl}`),
              (i["content-type"] = o.contentType),
              l && (i["x-metadata"] = this.toBase64(this.encodeMetadata(l)))),
          a != null &&
            a.headers &&
            (i = Object.assign(Object.assign({}, i), a.headers)));
        const u = this._removeEmptyFolders(r),
          d = this._getFinalPath(u),
          h = yield (t == "PUT" ? dd : dr)(
            this.fetch,
            `${this.url}/object/${d}`,
            s,
            Object.assign(
              { headers: i },
              o != null && o.duplex ? { duplex: o.duplex } : {},
            ),
          );
        return { data: { path: u, id: h.Id, fullPath: h.Key }, error: null };
      } catch (s) {
        if (Ce(s)) return { data: null, error: s };
        throw s;
      }
    });
  }
  upload(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", t, r, n);
    });
  }
  uploadToSignedUrl(t, r, n, a) {
    return Ze(this, void 0, void 0, function* () {
      const s = this._removeEmptyFolders(t),
        o = this._getFinalPath(s),
        i = new URL(this.url + `/object/upload/sign/${o}`);
      i.searchParams.set("token", r);
      try {
        let l;
        const u = Object.assign({ upsert: Pm.upsert }, a),
          d = Object.assign(Object.assign({}, this.headers), {
            "x-upsert": String(u.upsert),
          });
        typeof Blob < "u" && n instanceof Blob
          ? ((l = new FormData()),
            l.append("cacheControl", u.cacheControl),
            l.append("", n))
          : typeof FormData < "u" && n instanceof FormData
            ? ((l = n), l.append("cacheControl", u.cacheControl))
            : ((l = n),
              (d["cache-control"] = `max-age=${u.cacheControl}`),
              (d["content-type"] = u.contentType));
        const h = yield dd(this.fetch, i.toString(), l, { headers: d });
        return { data: { path: s, fullPath: h.Key }, error: null };
      } catch (l) {
        if (Ce(l)) return { data: null, error: l };
        throw l;
      }
    });
  }
  createSignedUploadUrl(t, r) {
    return Ze(this, void 0, void 0, function* () {
      try {
        let n = this._getFinalPath(t);
        const a = Object.assign({}, this.headers);
        r != null && r.upsert && (a["x-upsert"] = "true");
        const s = yield dr(
            this.fetch,
            `${this.url}/object/upload/sign/${n}`,
            {},
            { headers: a },
          ),
          o = new URL(this.url + s.url),
          i = o.searchParams.get("token");
        if (!i) throw new Gh("No token returned by API");
        return {
          data: { signedUrl: o.toString(), path: t, token: i },
          error: null,
        };
      } catch (n) {
        if (Ce(n)) return { data: null, error: n };
        throw n;
      }
    });
  }
  update(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", t, r, n);
    });
  }
  move(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      try {
        return {
          data: yield dr(
            this.fetch,
            `${this.url}/object/move`,
            {
              bucketId: this.bucketId,
              sourceKey: t,
              destinationKey: r,
              destinationBucket: n == null ? void 0 : n.destinationBucket,
            },
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (a) {
        if (Ce(a)) return { data: null, error: a };
        throw a;
      }
    });
  }
  copy(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      try {
        return {
          data: {
            path: (yield dr(
              this.fetch,
              `${this.url}/object/copy`,
              {
                bucketId: this.bucketId,
                sourceKey: t,
                destinationKey: r,
                destinationBucket: n == null ? void 0 : n.destinationBucket,
              },
              { headers: this.headers },
            )).Key,
          },
          error: null,
        };
      } catch (a) {
        if (Ce(a)) return { data: null, error: a };
        throw a;
      }
    });
  }
  createSignedUrl(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      try {
        let a = this._getFinalPath(t),
          s = yield dr(
            this.fetch,
            `${this.url}/object/sign/${a}`,
            Object.assign(
              { expiresIn: r },
              n != null && n.transform ? { transform: n.transform } : {},
            ),
            { headers: this.headers },
          );
        const o =
          n != null && n.download
            ? `&download=${n.download === !0 ? "" : n.download}`
            : "";
        return (
          (s = { signedUrl: encodeURI(`${this.url}${s.signedURL}${o}`) }),
          { data: s, error: null }
        );
      } catch (a) {
        if (Ce(a)) return { data: null, error: a };
        throw a;
      }
    });
  }
  createSignedUrls(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      try {
        const a = yield dr(
            this.fetch,
            `${this.url}/object/sign/${this.bucketId}`,
            { expiresIn: r, paths: t },
            { headers: this.headers },
          ),
          s =
            n != null && n.download
              ? `&download=${n.download === !0 ? "" : n.download}`
              : "";
        return {
          data: a.map((o) =>
            Object.assign(Object.assign({}, o), {
              signedUrl: o.signedURL
                ? encodeURI(`${this.url}${o.signedURL}${s}`)
                : null,
            }),
          ),
          error: null,
        };
      } catch (a) {
        if (Ce(a)) return { data: null, error: a };
        throw a;
      }
    });
  }
  download(t, r) {
    return Ze(this, void 0, void 0, function* () {
      const n =
          typeof (r == null ? void 0 : r.transform) < "u"
            ? "render/image/authenticated"
            : "object",
        a = this.transformOptsToQueryString(
          (r == null ? void 0 : r.transform) || {},
        ),
        s = a ? `?${a}` : "";
      try {
        const o = this._getFinalPath(t);
        return {
          data: yield (yield nl(this.fetch, `${this.url}/${n}/${o}${s}`, {
            headers: this.headers,
            noResolveJson: !0,
          })).blob(),
          error: null,
        };
      } catch (o) {
        if (Ce(o)) return { data: null, error: o };
        throw o;
      }
    });
  }
  info(t) {
    return Ze(this, void 0, void 0, function* () {
      const r = this._getFinalPath(t);
      try {
        const n = yield nl(this.fetch, `${this.url}/object/info/${r}`, {
          headers: this.headers,
        });
        return { data: ud(n), error: null };
      } catch (n) {
        if (Ce(n)) return { data: null, error: n };
        throw n;
      }
    });
  }
  exists(t) {
    return Ze(this, void 0, void 0, function* () {
      const r = this._getFinalPath(t);
      try {
        return (
          yield SC(this.fetch, `${this.url}/object/${r}`, {
            headers: this.headers,
          }),
          { data: !0, error: null }
        );
      } catch (n) {
        if (Ce(n) && n instanceof cd) {
          const a = n.originalError;
          if ([400, 404].includes(a == null ? void 0 : a.status))
            return { data: !1, error: n };
        }
        throw n;
      }
    });
  }
  getPublicUrl(t, r) {
    const n = this._getFinalPath(t),
      a = [],
      s =
        r != null && r.download
          ? `download=${r.download === !0 ? "" : r.download}`
          : "";
    s !== "" && a.push(s);
    const o =
        typeof (r == null ? void 0 : r.transform) < "u"
          ? "render/image"
          : "object",
      i = this.transformOptsToQueryString(
        (r == null ? void 0 : r.transform) || {},
      );
    i !== "" && a.push(i);
    let l = a.join("&");
    return (
      l !== "" && (l = `?${l}`),
      { data: { publicUrl: encodeURI(`${this.url}/${o}/public/${n}${l}`) } }
    );
  }
  remove(t) {
    return Ze(this, void 0, void 0, function* () {
      try {
        return {
          data: yield h0(
            this.fetch,
            `${this.url}/object/${this.bucketId}`,
            { prefixes: t },
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (r) {
        if (Ce(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
  list(t, r, n) {
    return Ze(this, void 0, void 0, function* () {
      try {
        const a = Object.assign(Object.assign(Object.assign({}, _C), r), {
          prefix: t || "",
        });
        return {
          data: yield dr(
            this.fetch,
            `${this.url}/object/list/${this.bucketId}`,
            a,
            { headers: this.headers },
            n,
          ),
          error: null,
        };
      } catch (a) {
        if (Ce(a)) return { data: null, error: a };
        throw a;
      }
    });
  }
  encodeMetadata(t) {
    return JSON.stringify(t);
  }
  toBase64(t) {
    return typeof Buffer < "u" ? Buffer.from(t).toString("base64") : btoa(t);
  }
  _getFinalPath(t) {
    return `${this.bucketId}/${t.replace(/^\/+/, "")}`;
  }
  _removeEmptyFolders(t) {
    return t.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(t) {
    const r = [];
    return (
      t.width && r.push(`width=${t.width}`),
      t.height && r.push(`height=${t.height}`),
      t.resize && r.push(`resize=${t.resize}`),
      t.format && r.push(`format=${t.format}`),
      t.quality && r.push(`quality=${t.quality}`),
      r.join("&")
    );
  }
}
const EC = "2.10.4",
  NC = { "X-Client-Info": `storage-js/${EC}` };
var Xn = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
class CC {
  constructor(t, r = {}, n, a) {
    const s = new URL(t);
    (a != null &&
      a.useNewHostname &&
      /supabase\.(co|in|red)$/.test(s.hostname) &&
      !s.hostname.includes("storage.supabase.") &&
      (s.hostname = s.hostname.replace("supabase.", "storage.supabase.")),
      (this.url = s.href),
      (this.headers = Object.assign(Object.assign({}, NC), r)),
      (this.fetch = d0(n)));
  }
  listBuckets() {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield nl(this.fetch, `${this.url}/bucket`, {
            headers: this.headers,
          }),
          error: null,
        };
      } catch (t) {
        if (Ce(t)) return { data: null, error: t };
        throw t;
      }
    });
  }
  getBucket(t) {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield nl(this.fetch, `${this.url}/bucket/${t}`, {
            headers: this.headers,
          }),
          error: null,
        };
      } catch (r) {
        if (Ce(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
  createBucket(t, r = { public: !1 }) {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield dr(
            this.fetch,
            `${this.url}/bucket`,
            {
              id: t,
              name: t,
              type: r.type,
              public: r.public,
              file_size_limit: r.fileSizeLimit,
              allowed_mime_types: r.allowedMimeTypes,
            },
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (n) {
        if (Ce(n)) return { data: null, error: n };
        throw n;
      }
    });
  }
  updateBucket(t, r) {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield dd(
            this.fetch,
            `${this.url}/bucket/${t}`,
            {
              id: t,
              name: t,
              public: r.public,
              file_size_limit: r.fileSizeLimit,
              allowed_mime_types: r.allowedMimeTypes,
            },
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (n) {
        if (Ce(n)) return { data: null, error: n };
        throw n;
      }
    });
  }
  emptyBucket(t) {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield dr(
            this.fetch,
            `${this.url}/bucket/${t}/empty`,
            {},
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (r) {
        if (Ce(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
  deleteBucket(t) {
    return Xn(this, void 0, void 0, function* () {
      try {
        return {
          data: yield h0(
            this.fetch,
            `${this.url}/bucket/${t}`,
            {},
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (r) {
        if (Ce(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
}
class TC extends CC {
  constructor(t, r = {}, n, a) {
    super(t, r, n, a);
  }
  from(t) {
    return new jC(this.url, this.headers, t, this.fetch);
  }
}
const PC = "2.53.0";
let _s = "";
typeof Deno < "u"
  ? (_s = "deno")
  : typeof document < "u"
    ? (_s = "web")
    : typeof navigator < "u" && navigator.product === "ReactNative"
      ? (_s = "react-native")
      : (_s = "node");
const RC = { "X-Client-Info": `supabase-js-${_s}/${PC}` },
  OC = { headers: RC },
  AC = { schema: "public" },
  MC = {
    autoRefreshToken: !0,
    persistSession: !0,
    detectSessionInUrl: !0,
    flowType: "implicit",
  },
  IC = {};
var DC = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
const LC = (e) => {
    let t;
    return (
      e ? (t = e) : typeof fetch > "u" ? (t = Jb) : (t = fetch),
      (...r) => t(...r)
    );
  },
  $C = () => (typeof Headers > "u" ? Yb : Headers),
  FC = (e, t, r) => {
    const n = LC(r),
      a = $C();
    return (s, o) =>
      DC(void 0, void 0, void 0, function* () {
        var i;
        const l = (i = yield t()) !== null && i !== void 0 ? i : e;
        let u = new a(o == null ? void 0 : o.headers);
        return (
          u.has("apikey") || u.set("apikey", e),
          u.has("Authorization") || u.set("Authorization", `Bearer ${l}`),
          n(s, Object.assign(Object.assign({}, o), { headers: u }))
        );
      });
  };
var zC = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
function UC(e) {
  return e.endsWith("/") ? e : e + "/";
}
function BC(e, t) {
  var r, n;
  const { db: a, auth: s, realtime: o, global: i } = e,
    { db: l, auth: u, realtime: d, global: h } = t,
    f = {
      db: Object.assign(Object.assign({}, l), a),
      auth: Object.assign(Object.assign({}, u), s),
      realtime: Object.assign(Object.assign({}, d), o),
      storage: {},
      global: Object.assign(Object.assign(Object.assign({}, h), i), {
        headers: Object.assign(
          Object.assign(
            {},
            (r = h == null ? void 0 : h.headers) !== null && r !== void 0
              ? r
              : {},
          ),
          (n = i == null ? void 0 : i.headers) !== null && n !== void 0
            ? n
            : {},
        ),
      }),
      accessToken: () =>
        zC(this, void 0, void 0, function* () {
          return "";
        }),
    };
  return (
    e.accessToken ? (f.accessToken = e.accessToken) : delete f.accessToken,
    f
  );
}
const f0 = "2.71.1",
  oa = 30 * 1e3,
  hd = 3,
  Lc = hd * oa,
  WC = "http://localhost:9999",
  qC = "supabase.auth.token",
  HC = { "X-Client-Info": `gotrue-js/${f0}` },
  fd = "X-Supabase-Api-Version",
  p0 = {
    "2024-01-01": {
      timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
      name: "2024-01-01",
    },
  },
  VC = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,
  KC = 10 * 60 * 1e3;
class Qh extends Error {
  constructor(t, r, n) {
    (super(t),
      (this.__isAuthError = !0),
      (this.name = "AuthError"),
      (this.status = r),
      (this.code = n));
  }
}
function H(e) {
  return typeof e == "object" && e !== null && "__isAuthError" in e;
}
class GC extends Qh {
  constructor(t, r, n) {
    (super(t, r, n),
      (this.name = "AuthApiError"),
      (this.status = r),
      (this.code = n));
  }
}
function QC(e) {
  return H(e) && e.name === "AuthApiError";
}
class m0 extends Qh {
  constructor(t, r) {
    (super(t), (this.name = "AuthUnknownError"), (this.originalError = r));
  }
}
class ln extends Qh {
  constructor(t, r, n, a) {
    (super(t, n, a), (this.name = r), (this.status = n));
  }
}
class Pr extends ln {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
}
function JC(e) {
  return H(e) && e.name === "AuthSessionMissingError";
}
class ri extends ln {
  constructor() {
    super(
      "Auth session or user missing",
      "AuthInvalidTokenResponseError",
      500,
      void 0,
    );
  }
}
class ni extends ln {
  constructor(t) {
    super(t, "AuthInvalidCredentialsError", 400, void 0);
  }
}
class ai extends ln {
  constructor(t, r = null) {
    (super(t, "AuthImplicitGrantRedirectError", 500, void 0),
      (this.details = null),
      (this.details = r));
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
function YC(e) {
  return H(e) && e.name === "AuthImplicitGrantRedirectError";
}
class Rm extends ln {
  constructor(t, r = null) {
    (super(t, "AuthPKCEGrantCodeExchangeError", 500, void 0),
      (this.details = null),
      (this.details = r));
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}
class pd extends ln {
  constructor(t, r) {
    super(t, "AuthRetryableFetchError", r, void 0);
  }
}
function $c(e) {
  return H(e) && e.name === "AuthRetryableFetchError";
}
class Om extends ln {
  constructor(t, r, n) {
    (super(t, "AuthWeakPasswordError", r, "weak_password"), (this.reasons = n));
  }
}
class md extends ln {
  constructor(t) {
    super(t, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
}
const al =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(
      "",
    ),
  Am = ` 	
\r=`.split(""),
  XC = (() => {
    const e = new Array(128);
    for (let t = 0; t < e.length; t += 1) e[t] = -1;
    for (let t = 0; t < Am.length; t += 1) e[Am[t].charCodeAt(0)] = -2;
    for (let t = 0; t < al.length; t += 1) e[al[t].charCodeAt(0)] = t;
    return e;
  })();
function Mm(e, t, r) {
  if (e !== null)
    for (t.queue = (t.queue << 8) | e, t.queuedBits += 8; t.queuedBits >= 6; ) {
      const n = (t.queue >> (t.queuedBits - 6)) & 63;
      (r(al[n]), (t.queuedBits -= 6));
    }
  else if (t.queuedBits > 0)
    for (
      t.queue = t.queue << (6 - t.queuedBits), t.queuedBits = 6;
      t.queuedBits >= 6;

    ) {
      const n = (t.queue >> (t.queuedBits - 6)) & 63;
      (r(al[n]), (t.queuedBits -= 6));
    }
}
function g0(e, t, r) {
  const n = XC[e];
  if (n > -1)
    for (t.queue = (t.queue << 6) | n, t.queuedBits += 6; t.queuedBits >= 8; )
      (r((t.queue >> (t.queuedBits - 8)) & 255), (t.queuedBits -= 8));
  else {
    if (n === -2) return;
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`);
  }
}
function Im(e) {
  const t = [],
    r = (o) => {
      t.push(String.fromCodePoint(o));
    },
    n = { utf8seq: 0, codepoint: 0 },
    a = { queue: 0, queuedBits: 0 },
    s = (o) => {
      tT(o, n, r);
    };
  for (let o = 0; o < e.length; o += 1) g0(e.charCodeAt(o), a, s);
  return t.join("");
}
function ZC(e, t) {
  if (e <= 127) {
    t(e);
    return;
  } else if (e <= 2047) {
    (t(192 | (e >> 6)), t(128 | (e & 63)));
    return;
  } else if (e <= 65535) {
    (t(224 | (e >> 12)), t(128 | ((e >> 6) & 63)), t(128 | (e & 63)));
    return;
  } else if (e <= 1114111) {
    (t(240 | (e >> 18)),
      t(128 | ((e >> 12) & 63)),
      t(128 | ((e >> 6) & 63)),
      t(128 | (e & 63)));
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`);
}
function eT(e, t) {
  for (let r = 0; r < e.length; r += 1) {
    let n = e.charCodeAt(r);
    if (n > 55295 && n <= 56319) {
      const a = ((n - 55296) * 1024) & 65535;
      ((n = (((e.charCodeAt(r + 1) - 56320) & 65535) | a) + 65536), (r += 1));
    }
    ZC(n, t);
  }
}
function tT(e, t, r) {
  if (t.utf8seq === 0) {
    if (e <= 127) {
      r(e);
      return;
    }
    for (let n = 1; n < 6; n += 1)
      if (!((e >> (7 - n)) & 1)) {
        t.utf8seq = n;
        break;
      }
    if (t.utf8seq === 2) t.codepoint = e & 31;
    else if (t.utf8seq === 3) t.codepoint = e & 15;
    else if (t.utf8seq === 4) t.codepoint = e & 7;
    else throw new Error("Invalid UTF-8 sequence");
    t.utf8seq -= 1;
  } else if (t.utf8seq > 0) {
    if (e <= 127) throw new Error("Invalid UTF-8 sequence");
    ((t.codepoint = (t.codepoint << 6) | (e & 63)),
      (t.utf8seq -= 1),
      t.utf8seq === 0 && r(t.codepoint));
  }
}
function rT(e) {
  const t = [],
    r = { queue: 0, queuedBits: 0 },
    n = (a) => {
      t.push(a);
    };
  for (let a = 0; a < e.length; a += 1) g0(e.charCodeAt(a), r, n);
  return new Uint8Array(t);
}
function nT(e) {
  const t = [];
  return (eT(e, (r) => t.push(r)), new Uint8Array(t));
}
function aT(e) {
  const t = [],
    r = { queue: 0, queuedBits: 0 },
    n = (a) => {
      t.push(a);
    };
  return (e.forEach((a) => Mm(a, r, n)), Mm(null, r, n), t.join(""));
}
function sT(e) {
  return Math.round(Date.now() / 1e3) + e;
}
function oT() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
    const t = (Math.random() * 16) | 0;
    return (e == "x" ? t : (t & 3) | 8).toString(16);
  });
}
const Nt = () => typeof window < "u" && typeof document < "u",
  mn = { tested: !1, writable: !1 },
  v0 = () => {
    if (!Nt()) return !1;
    try {
      if (typeof globalThis.localStorage != "object") return !1;
    } catch {
      return !1;
    }
    if (mn.tested) return mn.writable;
    const e = `lswt-${Math.random()}${Math.random()}`;
    try {
      (globalThis.localStorage.setItem(e, e),
        globalThis.localStorage.removeItem(e),
        (mn.tested = !0),
        (mn.writable = !0));
    } catch {
      ((mn.tested = !0), (mn.writable = !1));
    }
    return mn.writable;
  };
function iT(e) {
  const t = {},
    r = new URL(e);
  if (r.hash && r.hash[0] === "#")
    try {
      new URLSearchParams(r.hash.substring(1)).forEach((n, a) => {
        t[a] = n;
      });
    } catch {}
  return (
    r.searchParams.forEach((n, a) => {
      t[a] = n;
    }),
    t
  );
}
const y0 = (e) => {
    let t;
    return (
      e
        ? (t = e)
        : typeof fetch > "u"
          ? (t = (...r) =>
              So(async () => {
                const { default: n } = await Promise.resolve().then(() => Ja);
                return { default: n };
              }).then(({ default: n }) => n(...r)))
          : (t = fetch),
      (...r) => t(...r)
    );
  },
  lT = (e) =>
    typeof e == "object" &&
    e !== null &&
    "status" in e &&
    "ok" in e &&
    "json" in e &&
    typeof e.json == "function",
  ia = async (e, t, r) => {
    await e.setItem(t, JSON.stringify(r));
  },
  gn = async (e, t) => {
    const r = await e.getItem(t);
    if (!r) return null;
    try {
      return JSON.parse(r);
    } catch {
      return r;
    }
  },
  Tr = async (e, t) => {
    await e.removeItem(t);
  };
class ql {
  constructor() {
    this.promise = new ql.promiseConstructor((t, r) => {
      ((this.resolve = t), (this.reject = r));
    });
  }
}
ql.promiseConstructor = Promise;
function Fc(e) {
  const t = e.split(".");
  if (t.length !== 3) throw new md("Invalid JWT structure");
  for (let r = 0; r < t.length; r++)
    if (!VC.test(t[r])) throw new md("JWT not in base64url format");
  return {
    header: JSON.parse(Im(t[0])),
    payload: JSON.parse(Im(t[1])),
    signature: rT(t[2]),
    raw: { header: t[0], payload: t[1] },
  };
}
async function cT(e) {
  return await new Promise((t) => {
    setTimeout(() => t(null), e);
  });
}
function uT(e, t) {
  return new Promise((r, n) => {
    (async () => {
      for (let a = 0; a < 1 / 0; a++)
        try {
          const s = await e(a);
          if (!t(a, null, s)) {
            r(s);
            return;
          }
        } catch (s) {
          if (!t(a, s)) {
            n(s);
            return;
          }
        }
    })();
  });
}
function dT(e) {
  return ("0" + e.toString(16)).substr(-2);
}
function hT() {
  const e = new Uint32Array(56);
  if (typeof crypto > "u") {
    const t =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",
      r = t.length;
    let n = "";
    for (let a = 0; a < 56; a++) n += t.charAt(Math.floor(Math.random() * r));
    return n;
  }
  return (crypto.getRandomValues(e), Array.from(e, dT).join(""));
}
async function fT(e) {
  const t = new TextEncoder().encode(e),
    r = await crypto.subtle.digest("SHA-256", t),
    n = new Uint8Array(r);
  return Array.from(n)
    .map((a) => String.fromCharCode(a))
    .join("");
}
async function pT(e) {
  if (
    !(
      typeof crypto < "u" &&
      typeof crypto.subtle < "u" &&
      typeof TextEncoder < "u"
    )
  )
    return (
      console.warn(
        "WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.",
      ),
      e
    );
  const t = await fT(e);
  return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function Zn(e, t, r = !1) {
  const n = hT();
  let a = n;
  (r && (a += "/PASSWORD_RECOVERY"), await ia(e, `${t}-code-verifier`, a));
  const s = await pT(n);
  return [s, n === s ? "plain" : "s256"];
}
const mT = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function gT(e) {
  const t = e.headers.get(fd);
  if (!t || !t.match(mT)) return null;
  try {
    return new Date(`${t}T00:00:00.0Z`);
  } catch {
    return null;
  }
}
function vT(e) {
  if (!e) throw new Error("Missing exp claim");
  const t = Math.floor(Date.now() / 1e3);
  if (e <= t) throw new Error("JWT has expired");
}
function yT(e) {
  switch (e) {
    case "RS256":
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case "ES256":
      return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
    default:
      throw new Error("Invalid alg claim");
  }
}
const bT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function ea(e) {
  if (!bT.test(e))
    throw new Error(
      "@supabase/auth-js: Expected parameter to be UUID but is not",
    );
}
function zc() {
  const e = {};
  return new Proxy(e, {
    get: (t, r) => {
      if (r === "__isUserNotAvailableProxy") return !0;
      if (typeof r == "symbol") {
        const n = r.toString();
        if (
          n === "Symbol(Symbol.toPrimitive)" ||
          n === "Symbol(Symbol.toStringTag)" ||
          n === "Symbol(util.inspect.custom)"
        )
          return;
      }
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`,
      );
    },
    set: (t, r) => {
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
      );
    },
    deleteProperty: (t, r) => {
      throw new Error(
        `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
      );
    },
  });
}
function Dm(e) {
  return JSON.parse(JSON.stringify(e));
}
var wT = function (e, t) {
  var r = {};
  for (var n in e)
    Object.prototype.hasOwnProperty.call(e, n) &&
      t.indexOf(n) < 0 &&
      (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
      t.indexOf(n[a]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
        (r[n[a]] = e[n[a]]);
  return r;
};
const bn = (e) =>
    e.msg || e.message || e.error_description || e.error || JSON.stringify(e),
  xT = [502, 503, 504];
async function Lm(e) {
  var t;
  if (!lT(e)) throw new pd(bn(e), 0);
  if (xT.includes(e.status)) throw new pd(bn(e), e.status);
  let r;
  try {
    r = await e.json();
  } catch (s) {
    throw new m0(bn(s), s);
  }
  let n;
  const a = gT(e);
  if (
    (a &&
    a.getTime() >= p0["2024-01-01"].timestamp &&
    typeof r == "object" &&
    r &&
    typeof r.code == "string"
      ? (n = r.code)
      : typeof r == "object" &&
        r &&
        typeof r.error_code == "string" &&
        (n = r.error_code),
    n)
  ) {
    if (n === "weak_password")
      throw new Om(
        bn(r),
        e.status,
        ((t = r.weak_password) === null || t === void 0 ? void 0 : t.reasons) ||
          [],
      );
    if (n === "session_not_found") throw new Pr();
  } else if (
    typeof r == "object" &&
    r &&
    typeof r.weak_password == "object" &&
    r.weak_password &&
    Array.isArray(r.weak_password.reasons) &&
    r.weak_password.reasons.length &&
    r.weak_password.reasons.reduce((s, o) => s && typeof o == "string", !0)
  )
    throw new Om(bn(r), e.status, r.weak_password.reasons);
  throw new GC(bn(r), e.status || 500, n);
}
const kT = (e, t, r, n) => {
  const a = { method: e, headers: (t == null ? void 0 : t.headers) || {} };
  return e === "GET"
    ? a
    : ((a.headers = Object.assign(
        { "Content-Type": "application/json;charset=UTF-8" },
        t == null ? void 0 : t.headers,
      )),
      (a.body = JSON.stringify(n)),
      Object.assign(Object.assign({}, a), r));
};
async function Y(e, t, r, n) {
  var a;
  const s = Object.assign({}, n == null ? void 0 : n.headers);
  (s[fd] || (s[fd] = p0["2024-01-01"].name),
    n != null && n.jwt && (s.Authorization = `Bearer ${n.jwt}`));
  const o =
    (a = n == null ? void 0 : n.query) !== null && a !== void 0 ? a : {};
  n != null && n.redirectTo && (o.redirect_to = n.redirectTo);
  const i = Object.keys(o).length
      ? "?" + new URLSearchParams(o).toString()
      : "",
    l = await ST(
      e,
      t,
      r + i,
      { headers: s, noResolveJson: n == null ? void 0 : n.noResolveJson },
      {},
      n == null ? void 0 : n.body,
    );
  return n != null && n.xform
    ? n == null
      ? void 0
      : n.xform(l)
    : { data: Object.assign({}, l), error: null };
}
async function ST(e, t, r, n, a, s) {
  const o = kT(t, n, a, s);
  let i;
  try {
    i = await e(r, Object.assign({}, o));
  } catch (l) {
    throw (console.error(l), new pd(bn(l), 0));
  }
  if ((i.ok || (await Lm(i)), n != null && n.noResolveJson)) return i;
  try {
    return await i.json();
  } catch (l) {
    await Lm(l);
  }
}
function lr(e) {
  var t;
  let r = null;
  NT(e) &&
    ((r = Object.assign({}, e)),
    e.expires_at || (r.expires_at = sT(e.expires_in)));
  const n = (t = e.user) !== null && t !== void 0 ? t : e;
  return { data: { session: r, user: n }, error: null };
}
function $m(e) {
  const t = lr(e);
  return (
    !t.error &&
      e.weak_password &&
      typeof e.weak_password == "object" &&
      Array.isArray(e.weak_password.reasons) &&
      e.weak_password.reasons.length &&
      e.weak_password.message &&
      typeof e.weak_password.message == "string" &&
      e.weak_password.reasons.reduce((r, n) => r && typeof n == "string", !0) &&
      (t.data.weak_password = e.weak_password),
    t
  );
}
function Dr(e) {
  var t;
  return {
    data: { user: (t = e.user) !== null && t !== void 0 ? t : e },
    error: null,
  };
}
function _T(e) {
  return { data: e, error: null };
}
function jT(e) {
  const {
      action_link: t,
      email_otp: r,
      hashed_token: n,
      redirect_to: a,
      verification_type: s,
    } = e,
    o = wT(e, [
      "action_link",
      "email_otp",
      "hashed_token",
      "redirect_to",
      "verification_type",
    ]),
    i = {
      action_link: t,
      email_otp: r,
      hashed_token: n,
      redirect_to: a,
      verification_type: s,
    },
    l = Object.assign({}, o);
  return { data: { properties: i, user: l }, error: null };
}
function ET(e) {
  return e;
}
function NT(e) {
  return e.access_token && e.refresh_token && e.expires_in;
}
const Uc = ["global", "local", "others"];
var CT = function (e, t) {
  var r = {};
  for (var n in e)
    Object.prototype.hasOwnProperty.call(e, n) &&
      t.indexOf(n) < 0 &&
      (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
      t.indexOf(n[a]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
        (r[n[a]] = e[n[a]]);
  return r;
};
class TT {
  constructor({ url: t = "", headers: r = {}, fetch: n }) {
    ((this.url = t),
      (this.headers = r),
      (this.fetch = y0(n)),
      (this.mfa = {
        listFactors: this._listFactors.bind(this),
        deleteFactor: this._deleteFactor.bind(this),
      }));
  }
  async signOut(t, r = Uc[0]) {
    if (Uc.indexOf(r) < 0)
      throw new Error(
        `@supabase/auth-js: Parameter scope must be one of ${Uc.join(", ")}`,
      );
    try {
      return (
        await Y(this.fetch, "POST", `${this.url}/logout?scope=${r}`, {
          headers: this.headers,
          jwt: t,
          noResolveJson: !0,
        }),
        { data: null, error: null }
      );
    } catch (n) {
      if (H(n)) return { data: null, error: n };
      throw n;
    }
  }
  async inviteUserByEmail(t, r = {}) {
    try {
      return await Y(this.fetch, "POST", `${this.url}/invite`, {
        body: { email: t, data: r.data },
        headers: this.headers,
        redirectTo: r.redirectTo,
        xform: Dr,
      });
    } catch (n) {
      if (H(n)) return { data: { user: null }, error: n };
      throw n;
    }
  }
  async generateLink(t) {
    try {
      const { options: r } = t,
        n = CT(t, ["options"]),
        a = Object.assign(Object.assign({}, n), r);
      return (
        "newEmail" in n &&
          ((a.new_email = n == null ? void 0 : n.newEmail), delete a.newEmail),
        await Y(this.fetch, "POST", `${this.url}/admin/generate_link`, {
          body: a,
          headers: this.headers,
          xform: jT,
          redirectTo: r == null ? void 0 : r.redirectTo,
        })
      );
    } catch (r) {
      if (H(r)) return { data: { properties: null, user: null }, error: r };
      throw r;
    }
  }
  async createUser(t) {
    try {
      return await Y(this.fetch, "POST", `${this.url}/admin/users`, {
        body: t,
        headers: this.headers,
        xform: Dr,
      });
    } catch (r) {
      if (H(r)) return { data: { user: null }, error: r };
      throw r;
    }
  }
  async listUsers(t) {
    var r, n, a, s, o, i, l;
    try {
      const u = { nextPage: null, lastPage: 0, total: 0 },
        d = await Y(this.fetch, "GET", `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page:
              (n =
                (r = t == null ? void 0 : t.page) === null || r === void 0
                  ? void 0
                  : r.toString()) !== null && n !== void 0
                ? n
                : "",
            per_page:
              (s =
                (a = t == null ? void 0 : t.perPage) === null || a === void 0
                  ? void 0
                  : a.toString()) !== null && s !== void 0
                ? s
                : "",
          },
          xform: ET,
        });
      if (d.error) throw d.error;
      const h = await d.json(),
        f =
          (o = d.headers.get("x-total-count")) !== null && o !== void 0 ? o : 0,
        v =
          (l =
            (i = d.headers.get("link")) === null || i === void 0
              ? void 0
              : i.split(",")) !== null && l !== void 0
            ? l
            : [];
      return (
        v.length > 0 &&
          (v.forEach((g) => {
            const m = parseInt(g.split(";")[0].split("=")[1].substring(0, 1)),
              w = JSON.parse(g.split(";")[1].split("=")[1]);
            u[`${w}Page`] = m;
          }),
          (u.total = parseInt(f))),
        { data: Object.assign(Object.assign({}, h), u), error: null }
      );
    } catch (u) {
      if (H(u)) return { data: { users: [] }, error: u };
      throw u;
    }
  }
  async getUserById(t) {
    ea(t);
    try {
      return await Y(this.fetch, "GET", `${this.url}/admin/users/${t}`, {
        headers: this.headers,
        xform: Dr,
      });
    } catch (r) {
      if (H(r)) return { data: { user: null }, error: r };
      throw r;
    }
  }
  async updateUserById(t, r) {
    ea(t);
    try {
      return await Y(this.fetch, "PUT", `${this.url}/admin/users/${t}`, {
        body: r,
        headers: this.headers,
        xform: Dr,
      });
    } catch (n) {
      if (H(n)) return { data: { user: null }, error: n };
      throw n;
    }
  }
  async deleteUser(t, r = !1) {
    ea(t);
    try {
      return await Y(this.fetch, "DELETE", `${this.url}/admin/users/${t}`, {
        headers: this.headers,
        body: { should_soft_delete: r },
        xform: Dr,
      });
    } catch (n) {
      if (H(n)) return { data: { user: null }, error: n };
      throw n;
    }
  }
  async _listFactors(t) {
    ea(t.userId);
    try {
      const { data: r, error: n } = await Y(
        this.fetch,
        "GET",
        `${this.url}/admin/users/${t.userId}/factors`,
        {
          headers: this.headers,
          xform: (a) => ({ data: { factors: a }, error: null }),
        },
      );
      return { data: r, error: n };
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
  async _deleteFactor(t) {
    (ea(t.userId), ea(t.id));
    try {
      return {
        data: await Y(
          this.fetch,
          "DELETE",
          `${this.url}/admin/users/${t.userId}/factors/${t.id}`,
          { headers: this.headers },
        ),
        error: null,
      };
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
}
function Fm(e = {}) {
  return {
    getItem: (t) => e[t] || null,
    setItem: (t, r) => {
      e[t] = r;
    },
    removeItem: (t) => {
      delete e[t];
    },
  };
}
function PT() {
  if (typeof globalThis != "object")
    try {
      (Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
          return this;
        },
        configurable: !0,
      }),
        (__magic__.globalThis = __magic__),
        delete Object.prototype.__magic__);
    } catch {
      typeof self < "u" && (self.globalThis = self);
    }
}
const ta = {
  debug: !!(
    globalThis &&
    v0() &&
    globalThis.localStorage &&
    globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true"
  ),
};
class b0 extends Error {
  constructor(t) {
    (super(t), (this.isAcquireTimeout = !0));
  }
}
class RT extends b0 {}
async function OT(e, t, r) {
  ta.debug &&
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", e, t);
  const n = new globalThis.AbortController();
  return (
    t > 0 &&
      setTimeout(() => {
        (n.abort(),
          ta.debug &&
            console.log(
              "@supabase/gotrue-js: navigatorLock acquire timed out",
              e,
            ));
      }, t),
    await Promise.resolve().then(() =>
      globalThis.navigator.locks.request(
        e,
        t === 0
          ? { mode: "exclusive", ifAvailable: !0 }
          : { mode: "exclusive", signal: n.signal },
        async (a) => {
          if (a) {
            ta.debug &&
              console.log(
                "@supabase/gotrue-js: navigatorLock: acquired",
                e,
                a.name,
              );
            try {
              return await r();
            } finally {
              ta.debug &&
                console.log(
                  "@supabase/gotrue-js: navigatorLock: released",
                  e,
                  a.name,
                );
            }
          } else {
            if (t === 0)
              throw (
                ta.debug &&
                  console.log(
                    "@supabase/gotrue-js: navigatorLock: not immediately available",
                    e,
                  ),
                new RT(
                  `Acquiring an exclusive Navigator LockManager lock "${e}" immediately failed`,
                )
              );
            if (ta.debug)
              try {
                const s = await globalThis.navigator.locks.query();
                console.log(
                  "@supabase/gotrue-js: Navigator LockManager state",
                  JSON.stringify(s, null, "  "),
                );
              } catch (s) {
                console.warn(
                  "@supabase/gotrue-js: Error when querying Navigator LockManager state",
                  s,
                );
              }
            return (
              console.warn(
                "@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request",
              ),
              await r()
            );
          }
        },
      ),
    )
  );
}
PT();
const AT = {
  url: WC,
  storageKey: qC,
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: HC,
  flowType: "implicit",
  debug: !1,
  hasCustomAuthorizationHeader: !1,
};
async function zm(e, t, r) {
  return await r();
}
const ra = {};
class co {
  constructor(t) {
    var r, n;
    ((this.userStorage = null),
      (this.memoryStorage = null),
      (this.stateChangeEmitters = new Map()),
      (this.autoRefreshTicker = null),
      (this.visibilityChangedCallback = null),
      (this.refreshingDeferred = null),
      (this.initializePromise = null),
      (this.detectSessionInUrl = !0),
      (this.hasCustomAuthorizationHeader = !1),
      (this.suppressGetSessionWarning = !1),
      (this.lockAcquired = !1),
      (this.pendingInLock = []),
      (this.broadcastChannel = null),
      (this.logger = console.log),
      (this.instanceID = co.nextInstanceID),
      (co.nextInstanceID += 1),
      this.instanceID > 0 &&
        Nt() &&
        console.warn(
          "Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.",
        ));
    const a = Object.assign(Object.assign({}, AT), t);
    if (
      ((this.logDebugMessages = !!a.debug),
      typeof a.debug == "function" && (this.logger = a.debug),
      (this.persistSession = a.persistSession),
      (this.storageKey = a.storageKey),
      (this.autoRefreshToken = a.autoRefreshToken),
      (this.admin = new TT({ url: a.url, headers: a.headers, fetch: a.fetch })),
      (this.url = a.url),
      (this.headers = a.headers),
      (this.fetch = y0(a.fetch)),
      (this.lock = a.lock || zm),
      (this.detectSessionInUrl = a.detectSessionInUrl),
      (this.flowType = a.flowType),
      (this.hasCustomAuthorizationHeader = a.hasCustomAuthorizationHeader),
      a.lock
        ? (this.lock = a.lock)
        : Nt() &&
            !(
              (r = globalThis == null ? void 0 : globalThis.navigator) ===
                null || r === void 0
            ) &&
            r.locks
          ? (this.lock = OT)
          : (this.lock = zm),
      this.jwks ||
        ((this.jwks = { keys: [] }),
        (this.jwks_cached_at = Number.MIN_SAFE_INTEGER)),
      (this.mfa = {
        verify: this._verify.bind(this),
        enroll: this._enroll.bind(this),
        unenroll: this._unenroll.bind(this),
        challenge: this._challenge.bind(this),
        listFactors: this._listFactors.bind(this),
        challengeAndVerify: this._challengeAndVerify.bind(this),
        getAuthenticatorAssuranceLevel:
          this._getAuthenticatorAssuranceLevel.bind(this),
      }),
      this.persistSession
        ? (a.storage
            ? (this.storage = a.storage)
            : v0()
              ? (this.storage = globalThis.localStorage)
              : ((this.memoryStorage = {}),
                (this.storage = Fm(this.memoryStorage))),
          a.userStorage && (this.userStorage = a.userStorage))
        : ((this.memoryStorage = {}), (this.storage = Fm(this.memoryStorage))),
      Nt() &&
        globalThis.BroadcastChannel &&
        this.persistSession &&
        this.storageKey)
    ) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(
          this.storageKey,
        );
      } catch (s) {
        console.error(
          "Failed to create a new BroadcastChannel, multi-tab state changes will not be available",
          s,
        );
      }
      (n = this.broadcastChannel) === null ||
        n === void 0 ||
        n.addEventListener("message", async (s) => {
          (this._debug(
            "received broadcast notification from other tab or client",
            s,
          ),
            await this._notifyAllSubscribers(s.data.event, s.data.session, !1));
        });
    }
    this.initialize();
  }
  get jwks() {
    var t, r;
    return (r =
      (t = ra[this.storageKey]) === null || t === void 0 ? void 0 : t.jwks) !==
      null && r !== void 0
      ? r
      : { keys: [] };
  }
  set jwks(t) {
    ra[this.storageKey] = Object.assign(
      Object.assign({}, ra[this.storageKey]),
      { jwks: t },
    );
  }
  get jwks_cached_at() {
    var t, r;
    return (r =
      (t = ra[this.storageKey]) === null || t === void 0
        ? void 0
        : t.cachedAt) !== null && r !== void 0
      ? r
      : Number.MIN_SAFE_INTEGER;
  }
  set jwks_cached_at(t) {
    ra[this.storageKey] = Object.assign(
      Object.assign({}, ra[this.storageKey]),
      { cachedAt: t },
    );
  }
  _debug(...t) {
    return (
      this.logDebugMessages &&
        this.logger(
          `GoTrueClient@${this.instanceID} (${f0}) ${new Date().toISOString()}`,
          ...t,
        ),
      this
    );
  }
  async initialize() {
    return this.initializePromise
      ? await this.initializePromise
      : ((this.initializePromise = (async () =>
          await this._acquireLock(-1, async () => await this._initialize()))()),
        await this.initializePromise);
  }
  async _initialize() {
    var t;
    try {
      const r = iT(window.location.href);
      let n = "none";
      if (
        (this._isImplicitGrantCallback(r)
          ? (n = "implicit")
          : (await this._isPKCECallback(r)) && (n = "pkce"),
        Nt() && this.detectSessionInUrl && n !== "none")
      ) {
        const { data: a, error: s } = await this._getSessionFromURL(r, n);
        if (s) {
          if (
            (this._debug(
              "#_initialize()",
              "error detecting session from URL",
              s,
            ),
            YC(s))
          ) {
            const l =
              (t = s.details) === null || t === void 0 ? void 0 : t.code;
            if (
              l === "identity_already_exists" ||
              l === "identity_not_found" ||
              l === "single_identity_not_deletable"
            )
              return { error: s };
          }
          return (await this._removeSession(), { error: s });
        }
        const { session: o, redirectType: i } = a;
        return (
          this._debug(
            "#_initialize()",
            "detected session in URL",
            o,
            "redirect type",
            i,
          ),
          await this._saveSession(o),
          setTimeout(async () => {
            i === "recovery"
              ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", o)
              : await this._notifyAllSubscribers("SIGNED_IN", o);
          }, 0),
          { error: null }
        );
      }
      return (await this._recoverAndRefresh(), { error: null });
    } catch (r) {
      return H(r)
        ? { error: r }
        : { error: new m0("Unexpected error during initialization", r) };
    } finally {
      (await this._handleVisibilityChange(),
        this._debug("#_initialize()", "end"));
    }
  }
  async signInAnonymously(t) {
    var r, n, a;
    try {
      const s = await Y(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data:
              (n =
                (r = t == null ? void 0 : t.options) === null || r === void 0
                  ? void 0
                  : r.data) !== null && n !== void 0
                ? n
                : {},
            gotrue_meta_security: {
              captcha_token:
                (a = t == null ? void 0 : t.options) === null || a === void 0
                  ? void 0
                  : a.captchaToken,
            },
          },
          xform: lr,
        }),
        { data: o, error: i } = s;
      if (i || !o) return { data: { user: null, session: null }, error: i };
      const l = o.session,
        u = o.user;
      return (
        o.session &&
          (await this._saveSession(o.session),
          await this._notifyAllSubscribers("SIGNED_IN", l)),
        { data: { user: u, session: l }, error: null }
      );
    } catch (s) {
      if (H(s)) return { data: { user: null, session: null }, error: s };
      throw s;
    }
  }
  async signUp(t) {
    var r, n, a;
    try {
      let s;
      if ("email" in t) {
        const { email: d, password: h, options: f } = t;
        let v = null,
          g = null;
        (this.flowType === "pkce" &&
          ([v, g] = await Zn(this.storage, this.storageKey)),
          (s = await Y(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: f == null ? void 0 : f.emailRedirectTo,
            body: {
              email: d,
              password: h,
              data:
                (r = f == null ? void 0 : f.data) !== null && r !== void 0
                  ? r
                  : {},
              gotrue_meta_security: {
                captcha_token: f == null ? void 0 : f.captchaToken,
              },
              code_challenge: v,
              code_challenge_method: g,
            },
            xform: lr,
          })));
      } else if ("phone" in t) {
        const { phone: d, password: h, options: f } = t;
        s = await Y(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone: d,
            password: h,
            data:
              (n = f == null ? void 0 : f.data) !== null && n !== void 0
                ? n
                : {},
            channel:
              (a = f == null ? void 0 : f.channel) !== null && a !== void 0
                ? a
                : "sms",
            gotrue_meta_security: {
              captcha_token: f == null ? void 0 : f.captchaToken,
            },
          },
          xform: lr,
        });
      } else
        throw new ni(
          "You must provide either an email or phone number and a password",
        );
      const { data: o, error: i } = s;
      if (i || !o) return { data: { user: null, session: null }, error: i };
      const l = o.session,
        u = o.user;
      return (
        o.session &&
          (await this._saveSession(o.session),
          await this._notifyAllSubscribers("SIGNED_IN", l)),
        { data: { user: u, session: l }, error: null }
      );
    } catch (s) {
      if (H(s)) return { data: { user: null, session: null }, error: s };
      throw s;
    }
  }
  async signInWithPassword(t) {
    try {
      let r;
      if ("email" in t) {
        const { email: s, password: o, options: i } = t;
        r = await Y(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=password`,
          {
            headers: this.headers,
            body: {
              email: s,
              password: o,
              gotrue_meta_security: {
                captcha_token: i == null ? void 0 : i.captchaToken,
              },
            },
            xform: $m,
          },
        );
      } else if ("phone" in t) {
        const { phone: s, password: o, options: i } = t;
        r = await Y(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=password`,
          {
            headers: this.headers,
            body: {
              phone: s,
              password: o,
              gotrue_meta_security: {
                captcha_token: i == null ? void 0 : i.captchaToken,
              },
            },
            xform: $m,
          },
        );
      } else
        throw new ni(
          "You must provide either an email or phone number and a password",
        );
      const { data: n, error: a } = r;
      return a
        ? { data: { user: null, session: null }, error: a }
        : !n || !n.session || !n.user
          ? { data: { user: null, session: null }, error: new ri() }
          : (n.session &&
              (await this._saveSession(n.session),
              await this._notifyAllSubscribers("SIGNED_IN", n.session)),
            {
              data: Object.assign(
                { user: n.user, session: n.session },
                n.weak_password ? { weakPassword: n.weak_password } : null,
              ),
              error: a,
            });
    } catch (r) {
      if (H(r)) return { data: { user: null, session: null }, error: r };
      throw r;
    }
  }
  async signInWithOAuth(t) {
    var r, n, a, s;
    return await this._handleProviderSignIn(t.provider, {
      redirectTo:
        (r = t.options) === null || r === void 0 ? void 0 : r.redirectTo,
      scopes: (n = t.options) === null || n === void 0 ? void 0 : n.scopes,
      queryParams:
        (a = t.options) === null || a === void 0 ? void 0 : a.queryParams,
      skipBrowserRedirect:
        (s = t.options) === null || s === void 0
          ? void 0
          : s.skipBrowserRedirect,
    });
  }
  async exchangeCodeForSession(t) {
    return (
      await this.initializePromise,
      this._acquireLock(-1, async () => this._exchangeCodeForSession(t))
    );
  }
  async signInWithWeb3(t) {
    const { chain: r } = t;
    if (r === "solana") return await this.signInWithSolana(t);
    throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`);
  }
  async signInWithSolana(t) {
    var r, n, a, s, o, i, l, u, d, h, f, v;
    let g, m;
    if ("message" in t) ((g = t.message), (m = t.signature));
    else {
      const { chain: w, wallet: y, statement: b, options: x } = t;
      let k;
      if (Nt())
        if (typeof y == "object") k = y;
        else {
          const j = window;
          if (
            "solana" in j &&
            typeof j.solana == "object" &&
            (("signIn" in j.solana && typeof j.solana.signIn == "function") ||
              ("signMessage" in j.solana &&
                typeof j.solana.signMessage == "function"))
          )
            k = j.solana;
          else
            throw new Error(
              "@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.",
            );
        }
      else {
        if (typeof y != "object" || !(x != null && x.url))
          throw new Error(
            "@supabase/auth-js: Both wallet and url must be specified in non-browser environments.",
          );
        k = y;
      }
      const S = new URL(
        (r = x == null ? void 0 : x.url) !== null && r !== void 0
          ? r
          : window.location.href,
      );
      if ("signIn" in k && k.signIn) {
        const j = await k.signIn(
          Object.assign(
            Object.assign(
              Object.assign(
                { issuedAt: new Date().toISOString() },
                x == null ? void 0 : x.signInWithSolana,
              ),
              { version: "1", domain: S.host, uri: S.href },
            ),
            b ? { statement: b } : null,
          ),
        );
        let _;
        if (Array.isArray(j) && j[0] && typeof j[0] == "object") _ = j[0];
        else if (
          j &&
          typeof j == "object" &&
          "signedMessage" in j &&
          "signature" in j
        )
          _ = j;
        else
          throw new Error(
            "@supabase/auth-js: Wallet method signIn() returned unrecognized value",
          );
        if (
          "signedMessage" in _ &&
          "signature" in _ &&
          (typeof _.signedMessage == "string" ||
            _.signedMessage instanceof Uint8Array) &&
          _.signature instanceof Uint8Array
        )
          ((g =
            typeof _.signedMessage == "string"
              ? _.signedMessage
              : new TextDecoder().decode(_.signedMessage)),
            (m = _.signature));
        else
          throw new Error(
            "@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields",
          );
      } else {
        if (
          !("signMessage" in k) ||
          typeof k.signMessage != "function" ||
          !("publicKey" in k) ||
          typeof k != "object" ||
          !k.publicKey ||
          !("toBase58" in k.publicKey) ||
          typeof k.publicKey.toBase58 != "function"
        )
          throw new Error(
            "@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API",
          );
        g = [
          `${S.host} wants you to sign in with your Solana account:`,
          k.publicKey.toBase58(),
          ...(b ? ["", b, ""] : [""]),
          "Version: 1",
          `URI: ${S.href}`,
          `Issued At: ${(a = (n = x == null ? void 0 : x.signInWithSolana) === null || n === void 0 ? void 0 : n.issuedAt) !== null && a !== void 0 ? a : new Date().toISOString()}`,
          ...(!(
            (s = x == null ? void 0 : x.signInWithSolana) === null ||
            s === void 0
          ) && s.notBefore
            ? [`Not Before: ${x.signInWithSolana.notBefore}`]
            : []),
          ...(!(
            (o = x == null ? void 0 : x.signInWithSolana) === null ||
            o === void 0
          ) && o.expirationTime
            ? [`Expiration Time: ${x.signInWithSolana.expirationTime}`]
            : []),
          ...(!(
            (i = x == null ? void 0 : x.signInWithSolana) === null ||
            i === void 0
          ) && i.chainId
            ? [`Chain ID: ${x.signInWithSolana.chainId}`]
            : []),
          ...(!(
            (l = x == null ? void 0 : x.signInWithSolana) === null ||
            l === void 0
          ) && l.nonce
            ? [`Nonce: ${x.signInWithSolana.nonce}`]
            : []),
          ...(!(
            (u = x == null ? void 0 : x.signInWithSolana) === null ||
            u === void 0
          ) && u.requestId
            ? [`Request ID: ${x.signInWithSolana.requestId}`]
            : []),
          ...(!(
            (h =
              (d = x == null ? void 0 : x.signInWithSolana) === null ||
              d === void 0
                ? void 0
                : d.resources) === null || h === void 0
          ) && h.length
            ? [
                "Resources",
                ...x.signInWithSolana.resources.map((_) => `- ${_}`),
              ]
            : []),
        ].join(`
`);
        const j = await k.signMessage(new TextEncoder().encode(g), "utf8");
        if (!j || !(j instanceof Uint8Array))
          throw new Error(
            "@supabase/auth-js: Wallet signMessage() API returned an recognized value",
          );
        m = j;
      }
    }
    try {
      const { data: w, error: y } = await Y(
        this.fetch,
        "POST",
        `${this.url}/token?grant_type=web3`,
        {
          headers: this.headers,
          body: Object.assign(
            { chain: "solana", message: g, signature: aT(m) },
            !((f = t.options) === null || f === void 0) && f.captchaToken
              ? {
                  gotrue_meta_security: {
                    captcha_token:
                      (v = t.options) === null || v === void 0
                        ? void 0
                        : v.captchaToken,
                  },
                }
              : null,
          ),
          xform: lr,
        },
      );
      if (y) throw y;
      return !w || !w.session || !w.user
        ? { data: { user: null, session: null }, error: new ri() }
        : (w.session &&
            (await this._saveSession(w.session),
            await this._notifyAllSubscribers("SIGNED_IN", w.session)),
          { data: Object.assign({}, w), error: y });
    } catch (w) {
      if (H(w)) return { data: { user: null, session: null }, error: w };
      throw w;
    }
  }
  async _exchangeCodeForSession(t) {
    const r = await gn(this.storage, `${this.storageKey}-code-verifier`),
      [n, a] = (r ?? "").split("/");
    try {
      const { data: s, error: o } = await Y(
        this.fetch,
        "POST",
        `${this.url}/token?grant_type=pkce`,
        {
          headers: this.headers,
          body: { auth_code: t, code_verifier: n },
          xform: lr,
        },
      );
      if ((await Tr(this.storage, `${this.storageKey}-code-verifier`), o))
        throw o;
      return !s || !s.session || !s.user
        ? {
            data: { user: null, session: null, redirectType: null },
            error: new ri(),
          }
        : (s.session &&
            (await this._saveSession(s.session),
            await this._notifyAllSubscribers("SIGNED_IN", s.session)),
          {
            data: Object.assign(Object.assign({}, s), {
              redirectType: a ?? null,
            }),
            error: o,
          });
    } catch (s) {
      if (H(s))
        return {
          data: { user: null, session: null, redirectType: null },
          error: s,
        };
      throw s;
    }
  }
  async signInWithIdToken(t) {
    try {
      const {
          options: r,
          provider: n,
          token: a,
          access_token: s,
          nonce: o,
        } = t,
        i = await Y(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=id_token`,
          {
            headers: this.headers,
            body: {
              provider: n,
              id_token: a,
              access_token: s,
              nonce: o,
              gotrue_meta_security: {
                captcha_token: r == null ? void 0 : r.captchaToken,
              },
            },
            xform: lr,
          },
        ),
        { data: l, error: u } = i;
      return u
        ? { data: { user: null, session: null }, error: u }
        : !l || !l.session || !l.user
          ? { data: { user: null, session: null }, error: new ri() }
          : (l.session &&
              (await this._saveSession(l.session),
              await this._notifyAllSubscribers("SIGNED_IN", l.session)),
            { data: l, error: u });
    } catch (r) {
      if (H(r)) return { data: { user: null, session: null }, error: r };
      throw r;
    }
  }
  async signInWithOtp(t) {
    var r, n, a, s, o;
    try {
      if ("email" in t) {
        const { email: i, options: l } = t;
        let u = null,
          d = null;
        this.flowType === "pkce" &&
          ([u, d] = await Zn(this.storage, this.storageKey));
        const { error: h } = await Y(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email: i,
            data:
              (r = l == null ? void 0 : l.data) !== null && r !== void 0
                ? r
                : {},
            create_user:
              (n = l == null ? void 0 : l.shouldCreateUser) !== null &&
              n !== void 0
                ? n
                : !0,
            gotrue_meta_security: {
              captcha_token: l == null ? void 0 : l.captchaToken,
            },
            code_challenge: u,
            code_challenge_method: d,
          },
          redirectTo: l == null ? void 0 : l.emailRedirectTo,
        });
        return { data: { user: null, session: null }, error: h };
      }
      if ("phone" in t) {
        const { phone: i, options: l } = t,
          { data: u, error: d } = await Y(
            this.fetch,
            "POST",
            `${this.url}/otp`,
            {
              headers: this.headers,
              body: {
                phone: i,
                data:
                  (a = l == null ? void 0 : l.data) !== null && a !== void 0
                    ? a
                    : {},
                create_user:
                  (s = l == null ? void 0 : l.shouldCreateUser) !== null &&
                  s !== void 0
                    ? s
                    : !0,
                gotrue_meta_security: {
                  captcha_token: l == null ? void 0 : l.captchaToken,
                },
                channel:
                  (o = l == null ? void 0 : l.channel) !== null && o !== void 0
                    ? o
                    : "sms",
              },
            },
          );
        return {
          data: {
            user: null,
            session: null,
            messageId: u == null ? void 0 : u.message_id,
          },
          error: d,
        };
      }
      throw new ni("You must provide either an email or phone number.");
    } catch (i) {
      if (H(i)) return { data: { user: null, session: null }, error: i };
      throw i;
    }
  }
  async verifyOtp(t) {
    var r, n;
    try {
      let a, s;
      "options" in t &&
        ((a = (r = t.options) === null || r === void 0 ? void 0 : r.redirectTo),
        (s =
          (n = t.options) === null || n === void 0 ? void 0 : n.captchaToken));
      const { data: o, error: i } = await Y(
        this.fetch,
        "POST",
        `${this.url}/verify`,
        {
          headers: this.headers,
          body: Object.assign(Object.assign({}, t), {
            gotrue_meta_security: { captcha_token: s },
          }),
          redirectTo: a,
          xform: lr,
        },
      );
      if (i) throw i;
      if (!o) throw new Error("An error occurred on token verification.");
      const l = o.session,
        u = o.user;
      return (
        l != null &&
          l.access_token &&
          (await this._saveSession(l),
          await this._notifyAllSubscribers(
            t.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN",
            l,
          )),
        { data: { user: u, session: l }, error: null }
      );
    } catch (a) {
      if (H(a)) return { data: { user: null, session: null }, error: a };
      throw a;
    }
  }
  async signInWithSSO(t) {
    var r, n, a;
    try {
      let s = null,
        o = null;
      return (
        this.flowType === "pkce" &&
          ([s, o] = await Zn(this.storage, this.storageKey)),
        await Y(this.fetch, "POST", `${this.url}/sso`, {
          body: Object.assign(
            Object.assign(
              Object.assign(
                Object.assign(
                  Object.assign(
                    {},
                    "providerId" in t ? { provider_id: t.providerId } : null,
                  ),
                  "domain" in t ? { domain: t.domain } : null,
                ),
                {
                  redirect_to:
                    (n =
                      (r = t.options) === null || r === void 0
                        ? void 0
                        : r.redirectTo) !== null && n !== void 0
                      ? n
                      : void 0,
                },
              ),
              !(
                (a = t == null ? void 0 : t.options) === null || a === void 0
              ) && a.captchaToken
                ? {
                    gotrue_meta_security: {
                      captcha_token: t.options.captchaToken,
                    },
                  }
                : null,
            ),
            {
              skip_http_redirect: !0,
              code_challenge: s,
              code_challenge_method: o,
            },
          ),
          headers: this.headers,
          xform: _T,
        })
      );
    } catch (s) {
      if (H(s)) return { data: null, error: s };
      throw s;
    }
  }
  async reauthenticate() {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => await this._reauthenticate())
    );
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (t) => {
        const {
          data: { session: r },
          error: n,
        } = t;
        if (n) throw n;
        if (!r) throw new Pr();
        const { error: a } = await Y(
          this.fetch,
          "GET",
          `${this.url}/reauthenticate`,
          { headers: this.headers, jwt: r.access_token },
        );
        return { data: { user: null, session: null }, error: a };
      });
    } catch (t) {
      if (H(t)) return { data: { user: null, session: null }, error: t };
      throw t;
    }
  }
  async resend(t) {
    try {
      const r = `${this.url}/resend`;
      if ("email" in t) {
        const { email: n, type: a, options: s } = t,
          { error: o } = await Y(this.fetch, "POST", r, {
            headers: this.headers,
            body: {
              email: n,
              type: a,
              gotrue_meta_security: {
                captcha_token: s == null ? void 0 : s.captchaToken,
              },
            },
            redirectTo: s == null ? void 0 : s.emailRedirectTo,
          });
        return { data: { user: null, session: null }, error: o };
      } else if ("phone" in t) {
        const { phone: n, type: a, options: s } = t,
          { data: o, error: i } = await Y(this.fetch, "POST", r, {
            headers: this.headers,
            body: {
              phone: n,
              type: a,
              gotrue_meta_security: {
                captcha_token: s == null ? void 0 : s.captchaToken,
              },
            },
          });
        return {
          data: {
            user: null,
            session: null,
            messageId: o == null ? void 0 : o.message_id,
          },
          error: i,
        };
      }
      throw new ni(
        "You must provide either an email or phone number and a type",
      );
    } catch (r) {
      if (H(r)) return { data: { user: null, session: null }, error: r };
      throw r;
    }
  }
  async getSession() {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => this._useSession(async (t) => t))
    );
  }
  async _acquireLock(t, r) {
    this._debug("#_acquireLock", "begin", t);
    try {
      if (this.lockAcquired) {
        const n = this.pendingInLock.length
            ? this.pendingInLock[this.pendingInLock.length - 1]
            : Promise.resolve(),
          a = (async () => (await n, await r()))();
        return (
          this.pendingInLock.push(
            (async () => {
              try {
                await a;
              } catch {}
            })(),
          ),
          a
        );
      }
      return await this.lock(`lock:${this.storageKey}`, t, async () => {
        this._debug(
          "#_acquireLock",
          "lock acquired for storage key",
          this.storageKey,
        );
        try {
          this.lockAcquired = !0;
          const n = r();
          for (
            this.pendingInLock.push(
              (async () => {
                try {
                  await n;
                } catch {}
              })(),
            ),
              await n;
            this.pendingInLock.length;

          ) {
            const a = [...this.pendingInLock];
            (await Promise.all(a), this.pendingInLock.splice(0, a.length));
          }
          return await n;
        } finally {
          (this._debug(
            "#_acquireLock",
            "lock released for storage key",
            this.storageKey,
          ),
            (this.lockAcquired = !1));
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  async _useSession(t) {
    this._debug("#_useSession", "begin");
    try {
      const r = await this.__loadSession();
      return await t(r);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  async __loadSession() {
    (this._debug("#__loadSession()", "begin"),
      this.lockAcquired ||
        this._debug(
          "#__loadSession()",
          "used outside of an acquired lock!",
          new Error().stack,
        ));
    try {
      let t = null;
      const r = await gn(this.storage, this.storageKey);
      if (
        (this._debug("#getSession()", "session from storage", r),
        r !== null &&
          (this._isValidSession(r)
            ? (t = r)
            : (this._debug(
                "#getSession()",
                "session from storage is not valid",
              ),
              await this._removeSession())),
        !t)
      )
        return { data: { session: null }, error: null };
      const n = t.expires_at ? t.expires_at * 1e3 - Date.now() < Lc : !1;
      if (
        (this._debug(
          "#__loadSession()",
          `session has${n ? "" : " not"} expired`,
          "expires_at",
          t.expires_at,
        ),
        !n)
      ) {
        if (this.userStorage) {
          const o = await gn(this.userStorage, this.storageKey + "-user");
          o != null && o.user ? (t.user = o.user) : (t.user = zc());
        }
        if (this.storage.isServer && t.user) {
          let o = this.suppressGetSessionWarning;
          t = new Proxy(t, {
            get: (i, l, u) => (
              !o &&
                l === "user" &&
                (console.warn(
                  "Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.",
                ),
                (o = !0),
                (this.suppressGetSessionWarning = !0)),
              Reflect.get(i, l, u)
            ),
          });
        }
        return { data: { session: t }, error: null };
      }
      const { session: a, error: s } = await this._callRefreshToken(
        t.refresh_token,
      );
      return s
        ? { data: { session: null }, error: s }
        : { data: { session: a }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  async getUser(t) {
    return t
      ? await this._getUser(t)
      : (await this.initializePromise,
        await this._acquireLock(-1, async () => await this._getUser()));
  }
  async _getUser(t) {
    try {
      return t
        ? await Y(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt: t,
            xform: Dr,
          })
        : await this._useSession(async (r) => {
            var n, a, s;
            const { data: o, error: i } = r;
            if (i) throw i;
            return !(
              !((n = o.session) === null || n === void 0) && n.access_token
            ) && !this.hasCustomAuthorizationHeader
              ? { data: { user: null }, error: new Pr() }
              : await Y(this.fetch, "GET", `${this.url}/user`, {
                  headers: this.headers,
                  jwt:
                    (s =
                      (a = o.session) === null || a === void 0
                        ? void 0
                        : a.access_token) !== null && s !== void 0
                      ? s
                      : void 0,
                  xform: Dr,
                });
          });
    } catch (r) {
      if (H(r))
        return (
          JC(r) &&
            (await this._removeSession(),
            await Tr(this.storage, `${this.storageKey}-code-verifier`)),
          { data: { user: null }, error: r }
        );
      throw r;
    }
  }
  async updateUser(t, r = {}) {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => await this._updateUser(t, r))
    );
  }
  async _updateUser(t, r = {}) {
    try {
      return await this._useSession(async (n) => {
        const { data: a, error: s } = n;
        if (s) throw s;
        if (!a.session) throw new Pr();
        const o = a.session;
        let i = null,
          l = null;
        this.flowType === "pkce" &&
          t.email != null &&
          ([i, l] = await Zn(this.storage, this.storageKey));
        const { data: u, error: d } = await Y(
          this.fetch,
          "PUT",
          `${this.url}/user`,
          {
            headers: this.headers,
            redirectTo: r == null ? void 0 : r.emailRedirectTo,
            body: Object.assign(Object.assign({}, t), {
              code_challenge: i,
              code_challenge_method: l,
            }),
            jwt: o.access_token,
            xform: Dr,
          },
        );
        if (d) throw d;
        return (
          (o.user = u.user),
          await this._saveSession(o),
          await this._notifyAllSubscribers("USER_UPDATED", o),
          { data: { user: o.user }, error: null }
        );
      });
    } catch (n) {
      if (H(n)) return { data: { user: null }, error: n };
      throw n;
    }
  }
  async setSession(t) {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => await this._setSession(t))
    );
  }
  async _setSession(t) {
    try {
      if (!t.access_token || !t.refresh_token) throw new Pr();
      const r = Date.now() / 1e3;
      let n = r,
        a = !0,
        s = null;
      const { payload: o } = Fc(t.access_token);
      if ((o.exp && ((n = o.exp), (a = n <= r)), a)) {
        const { session: i, error: l } = await this._callRefreshToken(
          t.refresh_token,
        );
        if (l) return { data: { user: null, session: null }, error: l };
        if (!i) return { data: { user: null, session: null }, error: null };
        s = i;
      } else {
        const { data: i, error: l } = await this._getUser(t.access_token);
        if (l) throw l;
        ((s = {
          access_token: t.access_token,
          refresh_token: t.refresh_token,
          user: i.user,
          token_type: "bearer",
          expires_in: n - r,
          expires_at: n,
        }),
          await this._saveSession(s),
          await this._notifyAllSubscribers("SIGNED_IN", s));
      }
      return { data: { user: s.user, session: s }, error: null };
    } catch (r) {
      if (H(r)) return { data: { session: null, user: null }, error: r };
      throw r;
    }
  }
  async refreshSession(t) {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => await this._refreshSession(t))
    );
  }
  async _refreshSession(t) {
    try {
      return await this._useSession(async (r) => {
        var n;
        if (!t) {
          const { data: o, error: i } = r;
          if (i) throw i;
          t = (n = o.session) !== null && n !== void 0 ? n : void 0;
        }
        if (!(t != null && t.refresh_token)) throw new Pr();
        const { session: a, error: s } = await this._callRefreshToken(
          t.refresh_token,
        );
        return s
          ? { data: { user: null, session: null }, error: s }
          : a
            ? { data: { user: a.user, session: a }, error: null }
            : { data: { user: null, session: null }, error: null };
      });
    } catch (r) {
      if (H(r)) return { data: { user: null, session: null }, error: r };
      throw r;
    }
  }
  async _getSessionFromURL(t, r) {
    try {
      if (!Nt()) throw new ai("No browser detected.");
      if (t.error || t.error_description || t.error_code)
        throw new ai(
          t.error_description ||
            "Error in URL with unspecified error_description",
          {
            error: t.error || "unspecified_error",
            code: t.error_code || "unspecified_code",
          },
        );
      switch (r) {
        case "implicit":
          if (this.flowType === "pkce")
            throw new Rm("Not a valid PKCE flow url.");
          break;
        case "pkce":
          if (this.flowType === "implicit")
            throw new ai("Not a valid implicit grant flow url.");
          break;
        default:
      }
      if (r === "pkce") {
        if (
          (this._debug("#_initialize()", "begin", "is PKCE flow", !0), !t.code)
        )
          throw new Rm("No code detected.");
        const { data: b, error: x } = await this._exchangeCodeForSession(
          t.code,
        );
        if (x) throw x;
        const k = new URL(window.location.href);
        return (
          k.searchParams.delete("code"),
          window.history.replaceState(window.history.state, "", k.toString()),
          { data: { session: b.session, redirectType: null }, error: null }
        );
      }
      const {
        provider_token: n,
        provider_refresh_token: a,
        access_token: s,
        refresh_token: o,
        expires_in: i,
        expires_at: l,
        token_type: u,
      } = t;
      if (!s || !i || !o || !u) throw new ai("No session defined in URL");
      const d = Math.round(Date.now() / 1e3),
        h = parseInt(i);
      let f = d + h;
      l && (f = parseInt(l));
      const v = f - d;
      v * 1e3 <= oa &&
        console.warn(
          `@supabase/gotrue-js: Session as retrieved from URL expires in ${v}s, should have been closer to ${h}s`,
        );
      const g = f - h;
      d - g >= 120
        ? console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",
            g,
            f,
            d,
          )
        : d - g < 0 &&
          console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",
            g,
            f,
            d,
          );
      const { data: m, error: w } = await this._getUser(s);
      if (w) throw w;
      const y = {
        provider_token: n,
        provider_refresh_token: a,
        access_token: s,
        expires_in: h,
        expires_at: f,
        refresh_token: o,
        token_type: u,
        user: m.user,
      };
      return (
        (window.location.hash = ""),
        this._debug("#_getSessionFromURL()", "clearing window.location.hash"),
        { data: { session: y, redirectType: t.type }, error: null }
      );
    } catch (n) {
      if (H(n))
        return { data: { session: null, redirectType: null }, error: n };
      throw n;
    }
  }
  _isImplicitGrantCallback(t) {
    return !!(t.access_token || t.error_description);
  }
  async _isPKCECallback(t) {
    const r = await gn(this.storage, `${this.storageKey}-code-verifier`);
    return !!(t.code && r);
  }
  async signOut(t = { scope: "global" }) {
    return (
      await this.initializePromise,
      await this._acquireLock(-1, async () => await this._signOut(t))
    );
  }
  async _signOut({ scope: t } = { scope: "global" }) {
    return await this._useSession(async (r) => {
      var n;
      const { data: a, error: s } = r;
      if (s) return { error: s };
      const o =
        (n = a.session) === null || n === void 0 ? void 0 : n.access_token;
      if (o) {
        const { error: i } = await this.admin.signOut(o, t);
        if (
          i &&
          !(QC(i) && (i.status === 404 || i.status === 401 || i.status === 403))
        )
          return { error: i };
      }
      return (
        t !== "others" &&
          (await this._removeSession(),
          await Tr(this.storage, `${this.storageKey}-code-verifier`)),
        { error: null }
      );
    });
  }
  onAuthStateChange(t) {
    const r = oT(),
      n = {
        id: r,
        callback: t,
        unsubscribe: () => {
          (this._debug(
            "#unsubscribe()",
            "state change callback with id removed",
            r,
          ),
            this.stateChangeEmitters.delete(r));
        },
      };
    return (
      this._debug("#onAuthStateChange()", "registered callback with id", r),
      this.stateChangeEmitters.set(r, n),
      (async () => (
        await this.initializePromise,
        await this._acquireLock(-1, async () => {
          this._emitInitialSession(r);
        })
      ))(),
      { data: { subscription: n } }
    );
  }
  async _emitInitialSession(t) {
    return await this._useSession(async (r) => {
      var n, a;
      try {
        const {
          data: { session: s },
          error: o,
        } = r;
        if (o) throw o;
        (await ((n = this.stateChangeEmitters.get(t)) === null || n === void 0
          ? void 0
          : n.callback("INITIAL_SESSION", s)),
          this._debug("INITIAL_SESSION", "callback id", t, "session", s));
      } catch (s) {
        (await ((a = this.stateChangeEmitters.get(t)) === null || a === void 0
          ? void 0
          : a.callback("INITIAL_SESSION", null)),
          this._debug("INITIAL_SESSION", "callback id", t, "error", s),
          console.error(s));
      }
    });
  }
  async resetPasswordForEmail(t, r = {}) {
    let n = null,
      a = null;
    this.flowType === "pkce" &&
      ([n, a] = await Zn(this.storage, this.storageKey, !0));
    try {
      return await Y(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email: t,
          code_challenge: n,
          code_challenge_method: a,
          gotrue_meta_security: { captcha_token: r.captchaToken },
        },
        headers: this.headers,
        redirectTo: r.redirectTo,
      });
    } catch (s) {
      if (H(s)) return { data: null, error: s };
      throw s;
    }
  }
  async getUserIdentities() {
    var t;
    try {
      const { data: r, error: n } = await this.getUser();
      if (n) throw n;
      return {
        data: {
          identities: (t = r.user.identities) !== null && t !== void 0 ? t : [],
        },
        error: null,
      };
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
  async linkIdentity(t) {
    var r;
    try {
      const { data: n, error: a } = await this._useSession(async (s) => {
        var o, i, l, u, d;
        const { data: h, error: f } = s;
        if (f) throw f;
        const v = await this._getUrlForProvider(
          `${this.url}/user/identities/authorize`,
          t.provider,
          {
            redirectTo:
              (o = t.options) === null || o === void 0 ? void 0 : o.redirectTo,
            scopes:
              (i = t.options) === null || i === void 0 ? void 0 : i.scopes,
            queryParams:
              (l = t.options) === null || l === void 0 ? void 0 : l.queryParams,
            skipBrowserRedirect: !0,
          },
        );
        return await Y(this.fetch, "GET", v, {
          headers: this.headers,
          jwt:
            (d =
              (u = h.session) === null || u === void 0
                ? void 0
                : u.access_token) !== null && d !== void 0
              ? d
              : void 0,
        });
      });
      if (a) throw a;
      return (
        Nt() &&
          !(
            !((r = t.options) === null || r === void 0) && r.skipBrowserRedirect
          ) &&
          window.location.assign(n == null ? void 0 : n.url),
        {
          data: { provider: t.provider, url: n == null ? void 0 : n.url },
          error: null,
        }
      );
    } catch (n) {
      if (H(n)) return { data: { provider: t.provider, url: null }, error: n };
      throw n;
    }
  }
  async unlinkIdentity(t) {
    try {
      return await this._useSession(async (r) => {
        var n, a;
        const { data: s, error: o } = r;
        if (o) throw o;
        return await Y(
          this.fetch,
          "DELETE",
          `${this.url}/user/identities/${t.identity_id}`,
          {
            headers: this.headers,
            jwt:
              (a =
                (n = s.session) === null || n === void 0
                  ? void 0
                  : n.access_token) !== null && a !== void 0
                ? a
                : void 0,
          },
        );
      });
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
  async _refreshAccessToken(t) {
    const r = `#_refreshAccessToken(${t.substring(0, 5)}...)`;
    this._debug(r, "begin");
    try {
      const n = Date.now();
      return await uT(
        async (a) => (
          a > 0 && (await cT(200 * Math.pow(2, a - 1))),
          this._debug(r, "refreshing attempt", a),
          await Y(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=refresh_token`,
            { body: { refresh_token: t }, headers: this.headers, xform: lr },
          )
        ),
        (a, s) => {
          const o = 200 * Math.pow(2, a);
          return s && $c(s) && Date.now() + o - n < oa;
        },
      );
    } catch (n) {
      if ((this._debug(r, "error", n), H(n)))
        return { data: { session: null, user: null }, error: n };
      throw n;
    } finally {
      this._debug(r, "end");
    }
  }
  _isValidSession(t) {
    return (
      typeof t == "object" &&
      t !== null &&
      "access_token" in t &&
      "refresh_token" in t &&
      "expires_at" in t
    );
  }
  async _handleProviderSignIn(t, r) {
    const n = await this._getUrlForProvider(`${this.url}/authorize`, t, {
      redirectTo: r.redirectTo,
      scopes: r.scopes,
      queryParams: r.queryParams,
    });
    return (
      this._debug(
        "#_handleProviderSignIn()",
        "provider",
        t,
        "options",
        r,
        "url",
        n,
      ),
      Nt() && !r.skipBrowserRedirect && window.location.assign(n),
      { data: { provider: t, url: n }, error: null }
    );
  }
  async _recoverAndRefresh() {
    var t, r;
    const n = "#_recoverAndRefresh()";
    this._debug(n, "begin");
    try {
      const a = await gn(this.storage, this.storageKey);
      if (a && this.userStorage) {
        let o = await gn(this.userStorage, this.storageKey + "-user");
        (!this.storage.isServer &&
          Object.is(this.storage, this.userStorage) &&
          !o &&
          ((o = { user: a.user }),
          await ia(this.userStorage, this.storageKey + "-user", o)),
          (a.user =
            (t = o == null ? void 0 : o.user) !== null && t !== void 0
              ? t
              : zc()));
      } else if (a && !a.user && !a.user) {
        const o = await gn(this.storage, this.storageKey + "-user");
        o && o != null && o.user
          ? ((a.user = o.user),
            await Tr(this.storage, this.storageKey + "-user"),
            await ia(this.storage, this.storageKey, a))
          : (a.user = zc());
      }
      if (
        (this._debug(n, "session from storage", a), !this._isValidSession(a))
      ) {
        (this._debug(n, "session is not valid"),
          a !== null && (await this._removeSession()));
        return;
      }
      const s =
        ((r = a.expires_at) !== null && r !== void 0 ? r : 1 / 0) * 1e3 -
          Date.now() <
        Lc;
      if (
        (this._debug(
          n,
          `session has${s ? "" : " not"} expired with margin of ${Lc}s`,
        ),
        s)
      ) {
        if (this.autoRefreshToken && a.refresh_token) {
          const { error: o } = await this._callRefreshToken(a.refresh_token);
          o &&
            (console.error(o),
            $c(o) ||
              (this._debug(
                n,
                "refresh failed with a non-retryable error, removing the session",
                o,
              ),
              await this._removeSession()));
        }
      } else if (a.user && a.user.__isUserNotAvailableProxy === !0)
        try {
          const { data: o, error: i } = await this._getUser(a.access_token);
          !i && o != null && o.user
            ? ((a.user = o.user),
              await this._saveSession(a),
              await this._notifyAllSubscribers("SIGNED_IN", a))
            : this._debug(
                n,
                "could not get user data, skipping SIGNED_IN notification",
              );
        } catch (o) {
          (console.error("Error getting user data:", o),
            this._debug(
              n,
              "error getting user data, skipping SIGNED_IN notification",
              o,
            ));
        }
      else await this._notifyAllSubscribers("SIGNED_IN", a);
    } catch (a) {
      (this._debug(n, "error", a), console.error(a));
      return;
    } finally {
      this._debug(n, "end");
    }
  }
  async _callRefreshToken(t) {
    var r, n;
    if (!t) throw new Pr();
    if (this.refreshingDeferred) return this.refreshingDeferred.promise;
    const a = `#_callRefreshToken(${t.substring(0, 5)}...)`;
    this._debug(a, "begin");
    try {
      this.refreshingDeferred = new ql();
      const { data: s, error: o } = await this._refreshAccessToken(t);
      if (o) throw o;
      if (!s.session) throw new Pr();
      (await this._saveSession(s.session),
        await this._notifyAllSubscribers("TOKEN_REFRESHED", s.session));
      const i = { session: s.session, error: null };
      return (this.refreshingDeferred.resolve(i), i);
    } catch (s) {
      if ((this._debug(a, "error", s), H(s))) {
        const o = { session: null, error: s };
        return (
          $c(s) || (await this._removeSession()),
          (r = this.refreshingDeferred) === null ||
            r === void 0 ||
            r.resolve(o),
          o
        );
      }
      throw (
        (n = this.refreshingDeferred) === null || n === void 0 || n.reject(s),
        s
      );
    } finally {
      ((this.refreshingDeferred = null), this._debug(a, "end"));
    }
  }
  async _notifyAllSubscribers(t, r, n = !0) {
    const a = `#_notifyAllSubscribers(${t})`;
    this._debug(a, "begin", r, `broadcast = ${n}`);
    try {
      this.broadcastChannel &&
        n &&
        this.broadcastChannel.postMessage({ event: t, session: r });
      const s = [],
        o = Array.from(this.stateChangeEmitters.values()).map(async (i) => {
          try {
            await i.callback(t, r);
          } catch (l) {
            s.push(l);
          }
        });
      if ((await Promise.all(o), s.length > 0)) {
        for (let i = 0; i < s.length; i += 1) console.error(s[i]);
        throw s[0];
      }
    } finally {
      this._debug(a, "end");
    }
  }
  async _saveSession(t) {
    (this._debug("#_saveSession()", t), (this.suppressGetSessionWarning = !0));
    const r = Object.assign({}, t),
      n = r.user && r.user.__isUserNotAvailableProxy === !0;
    if (this.userStorage) {
      !n &&
        r.user &&
        (await ia(this.userStorage, this.storageKey + "-user", {
          user: r.user,
        }));
      const a = Object.assign({}, r);
      delete a.user;
      const s = Dm(a);
      await ia(this.storage, this.storageKey, s);
    } else {
      const a = Dm(r);
      await ia(this.storage, this.storageKey, a);
    }
  }
  async _removeSession() {
    (this._debug("#_removeSession()"),
      await Tr(this.storage, this.storageKey),
      await Tr(this.storage, this.storageKey + "-code-verifier"),
      await Tr(this.storage, this.storageKey + "-user"),
      this.userStorage &&
        (await Tr(this.userStorage, this.storageKey + "-user")),
      await this._notifyAllSubscribers("SIGNED_OUT", null));
  }
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const t = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      t &&
        Nt() &&
        window != null &&
        window.removeEventListener &&
        window.removeEventListener("visibilitychange", t);
    } catch (r) {
      console.error("removing visibilitychange callback failed", r);
    }
  }
  async _startAutoRefresh() {
    (await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()"));
    const t = setInterval(() => this._autoRefreshTokenTick(), oa);
    ((this.autoRefreshTicker = t),
      t && typeof t == "object" && typeof t.unref == "function"
        ? t.unref()
        : typeof Deno < "u" &&
          typeof Deno.unrefTimer == "function" &&
          Deno.unrefTimer(t),
      setTimeout(async () => {
        (await this.initializePromise, await this._autoRefreshTokenTick());
      }, 0));
  }
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const t = this.autoRefreshTicker;
    ((this.autoRefreshTicker = null), t && clearInterval(t));
  }
  async startAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._startAutoRefresh());
  }
  async stopAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._stopAutoRefresh());
  }
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const t = Date.now();
          try {
            return await this._useSession(async (r) => {
              const {
                data: { session: n },
              } = r;
              if (!n || !n.refresh_token || !n.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const a = Math.floor((n.expires_at * 1e3 - t) / oa);
              (this._debug(
                "#_autoRefreshTokenTick()",
                `access token expires in ${a} ticks, a tick lasts ${oa}ms, refresh threshold is ${hd} ticks`,
              ),
                a <= hd && (await this._callRefreshToken(n.refresh_token)));
            });
          } catch (r) {
            console.error(
              "Auto refresh tick failed with error. This is likely a transient error.",
              r,
            );
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (t) {
      if (t.isAcquireTimeout || t instanceof b0)
        this._debug("auto refresh token tick lock not available");
      else throw t;
    }
  }
  async _handleVisibilityChange() {
    if (
      (this._debug("#_handleVisibilityChange()"),
      !Nt() || !(window != null && window.addEventListener))
    )
      return (this.autoRefreshToken && this.startAutoRefresh(), !1);
    try {
      ((this.visibilityChangedCallback = async () =>
        await this._onVisibilityChanged(!1)),
        window == null ||
          window.addEventListener(
            "visibilitychange",
            this.visibilityChangedCallback,
          ),
        await this._onVisibilityChanged(!0));
    } catch (t) {
      console.error("_handleVisibilityChange", t);
    }
  }
  async _onVisibilityChanged(t) {
    const r = `#_onVisibilityChanged(${t})`;
    (this._debug(r, "visibilityState", document.visibilityState),
      document.visibilityState === "visible"
        ? (this.autoRefreshToken && this._startAutoRefresh(),
          t ||
            (await this.initializePromise,
            await this._acquireLock(-1, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(
                  r,
                  "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting",
                );
                return;
              }
              await this._recoverAndRefresh();
            })))
        : document.visibilityState === "hidden" &&
          this.autoRefreshToken &&
          this._stopAutoRefresh());
  }
  async _getUrlForProvider(t, r, n) {
    const a = [`provider=${encodeURIComponent(r)}`];
    if (
      (n != null &&
        n.redirectTo &&
        a.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),
      n != null && n.scopes && a.push(`scopes=${encodeURIComponent(n.scopes)}`),
      this.flowType === "pkce")
    ) {
      const [s, o] = await Zn(this.storage, this.storageKey),
        i = new URLSearchParams({
          code_challenge: `${encodeURIComponent(s)}`,
          code_challenge_method: `${encodeURIComponent(o)}`,
        });
      a.push(i.toString());
    }
    if (n != null && n.queryParams) {
      const s = new URLSearchParams(n.queryParams);
      a.push(s.toString());
    }
    return (
      n != null &&
        n.skipBrowserRedirect &&
        a.push(`skip_http_redirect=${n.skipBrowserRedirect}`),
      `${t}?${a.join("&")}`
    );
  }
  async _unenroll(t) {
    try {
      return await this._useSession(async (r) => {
        var n;
        const { data: a, error: s } = r;
        return s
          ? { data: null, error: s }
          : await Y(this.fetch, "DELETE", `${this.url}/factors/${t.factorId}`, {
              headers: this.headers,
              jwt:
                (n = a == null ? void 0 : a.session) === null || n === void 0
                  ? void 0
                  : n.access_token,
            });
      });
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
  async _enroll(t) {
    try {
      return await this._useSession(async (r) => {
        var n, a;
        const { data: s, error: o } = r;
        if (o) return { data: null, error: o };
        const i = Object.assign(
            { friendly_name: t.friendlyName, factor_type: t.factorType },
            t.factorType === "phone"
              ? { phone: t.phone }
              : { issuer: t.issuer },
          ),
          { data: l, error: u } = await Y(
            this.fetch,
            "POST",
            `${this.url}/factors`,
            {
              body: i,
              headers: this.headers,
              jwt:
                (n = s == null ? void 0 : s.session) === null || n === void 0
                  ? void 0
                  : n.access_token,
            },
          );
        return u
          ? { data: null, error: u }
          : (t.factorType === "totp" &&
              !((a = l == null ? void 0 : l.totp) === null || a === void 0) &&
              a.qr_code &&
              (l.totp.qr_code = `data:image/svg+xml;utf-8,${l.totp.qr_code}`),
            { data: l, error: null });
      });
    } catch (r) {
      if (H(r)) return { data: null, error: r };
      throw r;
    }
  }
  async _verify(t) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (r) => {
          var n;
          const { data: a, error: s } = r;
          if (s) return { data: null, error: s };
          const { data: o, error: i } = await Y(
            this.fetch,
            "POST",
            `${this.url}/factors/${t.factorId}/verify`,
            {
              body: { code: t.code, challenge_id: t.challengeId },
              headers: this.headers,
              jwt:
                (n = a == null ? void 0 : a.session) === null || n === void 0
                  ? void 0
                  : n.access_token,
            },
          );
          return i
            ? { data: null, error: i }
            : (await this._saveSession(
                Object.assign(
                  { expires_at: Math.round(Date.now() / 1e3) + o.expires_in },
                  o,
                ),
              ),
              await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", o),
              { data: o, error: i });
        });
      } catch (r) {
        if (H(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
  async _challenge(t) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (r) => {
          var n;
          const { data: a, error: s } = r;
          return s
            ? { data: null, error: s }
            : await Y(
                this.fetch,
                "POST",
                `${this.url}/factors/${t.factorId}/challenge`,
                {
                  body: { channel: t.channel },
                  headers: this.headers,
                  jwt:
                    (n = a == null ? void 0 : a.session) === null ||
                    n === void 0
                      ? void 0
                      : n.access_token,
                },
              );
        });
      } catch (r) {
        if (H(r)) return { data: null, error: r };
        throw r;
      }
    });
  }
  async _challengeAndVerify(t) {
    const { data: r, error: n } = await this._challenge({
      factorId: t.factorId,
    });
    return n
      ? { data: null, error: n }
      : await this._verify({
          factorId: t.factorId,
          challengeId: r.id,
          code: t.code,
        });
  }
  async _listFactors() {
    const {
      data: { user: t },
      error: r,
    } = await this.getUser();
    if (r) return { data: null, error: r };
    const n = (t == null ? void 0 : t.factors) || [],
      a = n.filter((o) => o.factor_type === "totp" && o.status === "verified"),
      s = n.filter((o) => o.factor_type === "phone" && o.status === "verified");
    return { data: { all: n, totp: a, phone: s }, error: null };
  }
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(
      -1,
      async () =>
        await this._useSession(async (t) => {
          var r, n;
          const {
            data: { session: a },
            error: s,
          } = t;
          if (s) return { data: null, error: s };
          if (!a)
            return {
              data: {
                currentLevel: null,
                nextLevel: null,
                currentAuthenticationMethods: [],
              },
              error: null,
            };
          const { payload: o } = Fc(a.access_token);
          let i = null;
          o.aal && (i = o.aal);
          let l = i;
          ((n =
            (r = a.user.factors) === null || r === void 0
              ? void 0
              : r.filter((d) => d.status === "verified")) !== null &&
          n !== void 0
            ? n
            : []
          ).length > 0 && (l = "aal2");
          const u = o.amr || [];
          return {
            data: {
              currentLevel: i,
              nextLevel: l,
              currentAuthenticationMethods: u,
            },
            error: null,
          };
        }),
    );
  }
  async fetchJwk(t, r = { keys: [] }) {
    let n = r.keys.find((i) => i.kid === t);
    if (n) return n;
    const a = Date.now();
    if (
      ((n = this.jwks.keys.find((i) => i.kid === t)),
      n && this.jwks_cached_at + KC > a)
    )
      return n;
    const { data: s, error: o } = await Y(
      this.fetch,
      "GET",
      `${this.url}/.well-known/jwks.json`,
      { headers: this.headers },
    );
    if (o) throw o;
    return !s.keys ||
      s.keys.length === 0 ||
      ((this.jwks = s),
      (this.jwks_cached_at = a),
      (n = s.keys.find((i) => i.kid === t)),
      !n)
      ? null
      : n;
  }
  async getClaims(t, r = {}) {
    try {
      let n = t;
      if (!n) {
        const { data: f, error: v } = await this.getSession();
        if (v || !f.session) return { data: null, error: v };
        n = f.session.access_token;
      }
      const {
        header: a,
        payload: s,
        signature: o,
        raw: { header: i, payload: l },
      } = Fc(n);
      (r != null && r.allowExpired) || vT(s.exp);
      const u =
        !a.alg ||
        a.alg.startsWith("HS") ||
        !a.kid ||
        !("crypto" in globalThis && "subtle" in globalThis.crypto)
          ? null
          : await this.fetchJwk(
              a.kid,
              r != null && r.keys
                ? { keys: r.keys }
                : r == null
                  ? void 0
                  : r.jwks,
            );
      if (!u) {
        const { error: f } = await this.getUser(n);
        if (f) throw f;
        return { data: { claims: s, header: a, signature: o }, error: null };
      }
      const d = yT(a.alg),
        h = await crypto.subtle.importKey("jwk", u, d, !0, ["verify"]);
      if (!(await crypto.subtle.verify(d, h, o, nT(`${i}.${l}`))))
        throw new md("Invalid JWT signature");
      return { data: { claims: s, header: a, signature: o }, error: null };
    } catch (n) {
      if (H(n)) return { data: null, error: n };
      throw n;
    }
  }
}
co.nextInstanceID = 0;
const MT = co;
class IT extends MT {
  constructor(t) {
    super(t);
  }
}
var DT = function (e, t, r, n) {
  function a(s) {
    return s instanceof r
      ? s
      : new r(function (o) {
          o(s);
        });
  }
  return new (r || (r = Promise))(function (s, o) {
    function i(d) {
      try {
        u(n.next(d));
      } catch (h) {
        o(h);
      }
    }
    function l(d) {
      try {
        u(n.throw(d));
      } catch (h) {
        o(h);
      }
    }
    function u(d) {
      d.done ? s(d.value) : a(d.value).then(i, l);
    }
    u((n = n.apply(e, [])).next());
  });
};
class LT {
  constructor(t, r, n) {
    var a, s, o;
    if (((this.supabaseUrl = t), (this.supabaseKey = r), !t))
      throw new Error("supabaseUrl is required.");
    if (!r) throw new Error("supabaseKey is required.");
    const i = UC(t),
      l = new URL(i);
    ((this.realtimeUrl = new URL("realtime/v1", l)),
      (this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace(
        "http",
        "ws",
      )),
      (this.authUrl = new URL("auth/v1", l)),
      (this.storageUrl = new URL("storage/v1", l)),
      (this.functionsUrl = new URL("functions/v1", l)));
    const u = `sb-${l.hostname.split(".")[0]}-auth-token`,
      d = {
        db: AC,
        realtime: IC,
        auth: Object.assign(Object.assign({}, MC), { storageKey: u }),
        global: OC,
      },
      h = BC(n ?? {}, d);
    ((this.storageKey =
      (a = h.auth.storageKey) !== null && a !== void 0 ? a : ""),
      (this.headers = (s = h.global.headers) !== null && s !== void 0 ? s : {}),
      h.accessToken
        ? ((this.accessToken = h.accessToken),
          (this.auth = new Proxy(
            {},
            {
              get: (f, v) => {
                throw new Error(
                  `@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(v)} is not possible`,
                );
              },
            },
          )))
        : (this.auth = this._initSupabaseAuthClient(
            (o = h.auth) !== null && o !== void 0 ? o : {},
            this.headers,
            h.global.fetch,
          )),
      (this.fetch = FC(r, this._getAccessToken.bind(this), h.global.fetch)),
      (this.realtime = this._initRealtimeClient(
        Object.assign(
          {
            headers: this.headers,
            accessToken: this._getAccessToken.bind(this),
          },
          h.realtime,
        ),
      )),
      (this.rest = new tC(new URL("rest/v1", l).href, {
        headers: this.headers,
        schema: h.db.schema,
        fetch: this.fetch,
      })),
      (this.storage = new TC(
        this.storageUrl.href,
        this.headers,
        this.fetch,
        n == null ? void 0 : n.storage,
      )),
      h.accessToken || this._listenForAuthEvents());
  }
  get functions() {
    return new R2(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch,
    });
  }
  from(t) {
    return this.rest.from(t);
  }
  schema(t) {
    return this.rest.schema(t);
  }
  rpc(t, r = {}, n = {}) {
    return this.rest.rpc(t, r, n);
  }
  channel(t, r = { config: {} }) {
    return this.realtime.channel(t, r);
  }
  getChannels() {
    return this.realtime.getChannels();
  }
  removeChannel(t) {
    return this.realtime.removeChannel(t);
  }
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var t, r;
    return DT(this, void 0, void 0, function* () {
      if (this.accessToken) return yield this.accessToken();
      const { data: n } = yield this.auth.getSession();
      return (r =
        (t = n.session) === null || t === void 0 ? void 0 : t.access_token) !==
        null && r !== void 0
        ? r
        : null;
    });
  }
  _initSupabaseAuthClient(
    {
      autoRefreshToken: t,
      persistSession: r,
      detectSessionInUrl: n,
      storage: a,
      storageKey: s,
      flowType: o,
      lock: i,
      debug: l,
    },
    u,
    d,
  ) {
    const h = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`,
    };
    return new IT({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, h), u),
      storageKey: s,
      autoRefreshToken: t,
      persistSession: r,
      detectSessionInUrl: n,
      storage: a,
      flowType: o,
      lock: i,
      debug: l,
      fetch: d,
      hasCustomAuthorizationHeader: "Authorization" in this.headers,
    });
  }
  _initRealtimeClient(t) {
    return new gC(
      this.realtimeUrl.href,
      Object.assign(Object.assign({}, t), {
        params: Object.assign(
          { apikey: this.supabaseKey },
          t == null ? void 0 : t.params,
        ),
      }),
    );
  }
  _listenForAuthEvents() {
    return this.auth.onAuthStateChange((t, r) => {
      this._handleTokenChanged(
        t,
        "CLIENT",
        r == null ? void 0 : r.access_token,
      );
    });
  }
  _handleTokenChanged(t, r, n) {
    (t === "TOKEN_REFRESHED" || t === "SIGNED_IN") &&
    this.changedAccessToken !== n
      ? (this.changedAccessToken = n)
      : t === "SIGNED_OUT" &&
        (this.realtime.setAuth(),
        r == "STORAGE" && this.auth.signOut(),
        (this.changedAccessToken = void 0));
  }
}
const $T = (e, t, r) => new LT(e, t, r);
function FT() {
  if (
    typeof window < "u" ||
    typeof process > "u" ||
    process.version === void 0 ||
    process.version === null
  )
    return !1;
  const e = process.version.match(/^v(\d+)\./);
  return e ? parseInt(e[1], 10) <= 18 : !1;
}
FT() &&
  console.warn(
    "⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217",
  );
const zT = "https://pcptbolbmdiucrliluai.supabase.co",
  UT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcHRib2xibWRpdWNybGlsdWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTcxNjYsImV4cCI6MjA2OTU3MzE2Nn0.mmN2oG0vEIBLGrdMGTwXgOZm76WHGUX1tFLXw9Rw_CE",
  Fs = $T(zT, UT, {
    auth: { storage: localStorage, persistSession: !0, autoRefreshToken: !0 },
  }),
  w0 = p.createContext(void 0),
  BT = ({ children: e }) => {
    const [t, r] = p.useState(null),
      [n, a] = p.useState(null),
      [s, o] = p.useState(!0);
    p.useEffect(() => {
      const {
        data: { subscription: l },
      } = Fs.auth.onAuthStateChange((u, d) => {
        (a(d), r((d == null ? void 0 : d.user) ?? null), o(!1));
      });
      return (
        Fs.auth.getSession().then(({ data: { session: u } }) => {
          (a(u), r((u == null ? void 0 : u.user) ?? null), o(!1));
        }),
        () => l.unsubscribe()
      );
    }, []);
    const i = async () => {
      await Fs.auth.signOut();
    };
    return c.jsx(w0.Provider, {
      value: { user: t, session: n, loading: s, signOut: i },
      children: e,
    });
  },
  Jh = () => {
    const e = p.useContext(w0);
    if (e === void 0)
      throw new Error("useAuth must be used within an AuthProvider");
    return e;
  },
  WT = xo(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline:
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    },
  ),
  Z = p.forwardRef(
    ({ className: e, variant: t, size: r, asChild: n = !1, ...a }, s) => {
      const o = n ? Mn : "button";
      return c.jsx(o, {
        className: ee(WT({ variant: t, size: r, className: e })),
        ref: s,
        ...a,
      });
    },
  );
Z.displayName = "Button";
var qT = p.createContext(void 0);
function Yh(e) {
  const t = p.useContext(qT);
  return e || t || "ltr";
}
var Bc = 0;
function x0() {
  p.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", e[0] ?? Um()),
      document.body.insertAdjacentElement("beforeend", e[1] ?? Um()),
      Bc++,
      () => {
        (Bc === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((t) => t.remove()),
          Bc--);
      }
    );
  }, []);
}
function Um() {
  const e = document.createElement("span");
  return (
    e.setAttribute("data-radix-focus-guard", ""),
    (e.tabIndex = 0),
    (e.style.outline = "none"),
    (e.style.opacity = "0"),
    (e.style.position = "fixed"),
    (e.style.pointerEvents = "none"),
    e
  );
}
var Wc = "focusScope.autoFocusOnMount",
  qc = "focusScope.autoFocusOnUnmount",
  Bm = { bubbles: !1, cancelable: !0 },
  HT = "FocusScope",
  Xh = p.forwardRef((e, t) => {
    const {
        loop: r = !1,
        trapped: n = !1,
        onMountAutoFocus: a,
        onUnmountAutoFocus: s,
        ...o
      } = e,
      [i, l] = p.useState(null),
      u = Ke(a),
      d = Ke(s),
      h = p.useRef(null),
      f = Se(t, (m) => l(m)),
      v = p.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (p.useEffect(() => {
      if (n) {
        let m = function (x) {
            if (v.paused || !i) return;
            const k = x.target;
            i.contains(k) ? (h.current = k) : Rr(h.current, { select: !0 });
          },
          w = function (x) {
            if (v.paused || !i) return;
            const k = x.relatedTarget;
            k !== null && (i.contains(k) || Rr(h.current, { select: !0 }));
          },
          y = function (x) {
            if (document.activeElement === document.body)
              for (const k of x) k.removedNodes.length > 0 && Rr(i);
          };
        (document.addEventListener("focusin", m),
          document.addEventListener("focusout", w));
        const b = new MutationObserver(y);
        return (
          i && b.observe(i, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener("focusin", m),
              document.removeEventListener("focusout", w),
              b.disconnect());
          }
        );
      }
    }, [n, i, v.paused]),
      p.useEffect(() => {
        if (i) {
          qm.add(v);
          const m = document.activeElement;
          if (!i.contains(m)) {
            const w = new CustomEvent(Wc, Bm);
            (i.addEventListener(Wc, u),
              i.dispatchEvent(w),
              w.defaultPrevented ||
                (VT(YT(k0(i)), { select: !0 }),
                document.activeElement === m && Rr(i)));
          }
          return () => {
            (i.removeEventListener(Wc, u),
              setTimeout(() => {
                const w = new CustomEvent(qc, Bm);
                (i.addEventListener(qc, d),
                  i.dispatchEvent(w),
                  w.defaultPrevented || Rr(m ?? document.body, { select: !0 }),
                  i.removeEventListener(qc, d),
                  qm.remove(v));
              }, 0));
          };
        }
      }, [i, u, d, v]));
    const g = p.useCallback(
      (m) => {
        if ((!r && !n) || v.paused) return;
        const w = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey,
          y = document.activeElement;
        if (w && y) {
          const b = m.currentTarget,
            [x, k] = KT(b);
          x && k
            ? !m.shiftKey && y === k
              ? (m.preventDefault(), r && Rr(x, { select: !0 }))
              : m.shiftKey &&
                y === x &&
                (m.preventDefault(), r && Rr(k, { select: !0 }))
            : y === b && m.preventDefault();
        }
      },
      [r, n, v.paused],
    );
    return c.jsx(ae.div, { tabIndex: -1, ...o, ref: f, onKeyDown: g });
  });
Xh.displayName = HT;
function VT(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if ((Rr(n, { select: t }), document.activeElement !== r)) return;
}
function KT(e) {
  const t = k0(e),
    r = Wm(t, e),
    n = Wm(t.reverse(), e);
  return [r, n];
}
function k0(e) {
  const t = [],
    r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (n) => {
        const a = n.tagName === "INPUT" && n.type === "hidden";
        return n.disabled || n.hidden || a
          ? NodeFilter.FILTER_SKIP
          : n.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function Wm(e, t) {
  for (const r of e) if (!GT(r, { upTo: t })) return r;
}
function GT(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function QT(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Rr(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    (e.focus({ preventScroll: !0 }), e !== r && QT(e) && t && e.select());
  }
}
var qm = JT();
function JT() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      (t !== r && (r == null || r.pause()), (e = Hm(e, t)), e.unshift(t));
    },
    remove(t) {
      var r;
      ((e = Hm(e, t)), (r = e[0]) == null || r.resume());
    },
  };
}
function Hm(e, t) {
  const r = [...e],
    n = r.indexOf(t);
  return (n !== -1 && r.splice(n, 1), r);
}
function YT(e) {
  return e.filter((t) => t.tagName !== "A");
}
function XT(e, t = []) {
  let r = [];
  function n(s, o) {
    const i = p.createContext(o),
      l = r.length;
    r = [...r, o];
    function u(h) {
      const { scope: f, children: v, ...g } = h,
        m = (f == null ? void 0 : f[e][l]) || i,
        w = p.useMemo(() => g, Object.values(g));
      return c.jsx(m.Provider, { value: w, children: v });
    }
    function d(h, f) {
      const v = (f == null ? void 0 : f[e][l]) || i,
        g = p.useContext(v);
      if (g) return g;
      if (o !== void 0) return o;
      throw new Error(`\`${h}\` must be used within \`${s}\``);
    }
    return ((u.displayName = s + "Provider"), [u, d]);
  }
  const a = () => {
    const s = r.map((o) => p.createContext(o));
    return function (o) {
      const i = (o == null ? void 0 : o[e]) || s;
      return p.useMemo(() => ({ [`__scope${e}`]: { ...o, [e]: i } }), [o, i]);
    };
  };
  return ((a.scopeName = e), [n, ZT(a, ...t)]);
}
function ZT(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((a) => ({ useScope: a(), scopeName: a.scopeName }));
    return function (a) {
      const s = n.reduce((o, { useScope: i, scopeName: l }) => {
        const u = i(a)[`__scope${l}`];
        return { ...o, ...u };
      }, {});
      return p.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return ((r.scopeName = t.scopeName), r);
}
var Hc = "rovingFocusGroup.onEntryFocus",
  eP = { bubbles: !1, cancelable: !0 },
  Hl = "RovingFocusGroup",
  [gd, S0, tP] = wh(Hl),
  [rP, Vl] = XT(Hl, [tP]),
  [nP, aP] = rP(Hl),
  _0 = p.forwardRef((e, t) =>
    c.jsx(gd.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: c.jsx(gd.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: c.jsx(sP, { ...e, ref: t }),
      }),
    }),
  );
_0.displayName = Hl;
var sP = p.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: r,
        orientation: n,
        loop: a = !1,
        dir: s,
        currentTabStopId: o,
        defaultCurrentTabStopId: i,
        onCurrentTabStopIdChange: l,
        onEntryFocus: u,
        preventScrollOnEntryFocus: d = !1,
        ...h
      } = e,
      f = p.useRef(null),
      v = Se(t, f),
      g = Yh(s),
      [m = null, w] = wo({ prop: o, defaultProp: i, onChange: l }),
      [y, b] = p.useState(!1),
      x = Ke(u),
      k = S0(r),
      S = p.useRef(!1),
      [j, _] = p.useState(0);
    return (
      p.useEffect(() => {
        const C = f.current;
        if (C)
          return (
            C.addEventListener(Hc, x),
            () => C.removeEventListener(Hc, x)
          );
      }, [x]),
      c.jsx(nP, {
        scope: r,
        orientation: n,
        dir: g,
        loop: a,
        currentTabStopId: m,
        onItemFocus: p.useCallback((C) => w(C), [w]),
        onItemShiftTab: p.useCallback(() => b(!0), []),
        onFocusableItemAdd: p.useCallback(() => _((C) => C + 1), []),
        onFocusableItemRemove: p.useCallback(() => _((C) => C - 1), []),
        children: c.jsx(ae.div, {
          tabIndex: y || j === 0 ? -1 : 0,
          "data-orientation": n,
          ...h,
          ref: v,
          style: { outline: "none", ...e.style },
          onMouseDown: F(e.onMouseDown, () => {
            S.current = !0;
          }),
          onFocus: F(e.onFocus, (C) => {
            const D = !S.current;
            if (C.target === C.currentTarget && D && !y) {
              const O = new CustomEvent(Hc, eP);
              if ((C.currentTarget.dispatchEvent(O), !O.defaultPrevented)) {
                const U = k().filter((q) => q.focusable),
                  $ = U.find((q) => q.active),
                  G = U.find((q) => q.id === m),
                  A = [$, G, ...U].filter(Boolean).map((q) => q.ref.current);
                N0(A, d);
              }
            }
            S.current = !1;
          }),
          onBlur: F(e.onBlur, () => b(!1)),
        }),
      })
    );
  }),
  j0 = "RovingFocusGroupItem",
  E0 = p.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: r,
        focusable: n = !0,
        active: a = !1,
        tabStopId: s,
        ...o
      } = e,
      i = Nn(),
      l = s || i,
      u = aP(j0, r),
      d = u.currentTabStopId === l,
      h = S0(r),
      { onFocusableItemAdd: f, onFocusableItemRemove: v } = u;
    return (
      p.useEffect(() => {
        if (n) return (f(), () => v());
      }, [n, f, v]),
      c.jsx(gd.ItemSlot, {
        scope: r,
        id: l,
        focusable: n,
        active: a,
        children: c.jsx(ae.span, {
          tabIndex: d ? 0 : -1,
          "data-orientation": u.orientation,
          ...o,
          ref: t,
          onMouseDown: F(e.onMouseDown, (g) => {
            n ? u.onItemFocus(l) : g.preventDefault();
          }),
          onFocus: F(e.onFocus, () => u.onItemFocus(l)),
          onKeyDown: F(e.onKeyDown, (g) => {
            if (g.key === "Tab" && g.shiftKey) {
              u.onItemShiftTab();
              return;
            }
            if (g.target !== g.currentTarget) return;
            const m = lP(g, u.orientation, u.dir);
            if (m !== void 0) {
              if (g.metaKey || g.ctrlKey || g.altKey || g.shiftKey) return;
              g.preventDefault();
              let w = h()
                .filter((y) => y.focusable)
                .map((y) => y.ref.current);
              if (m === "last") w.reverse();
              else if (m === "prev" || m === "next") {
                m === "prev" && w.reverse();
                const y = w.indexOf(g.currentTarget);
                w = u.loop ? cP(w, y + 1) : w.slice(y + 1);
              }
              setTimeout(() => N0(w));
            }
          }),
        }),
      })
    );
  });
E0.displayName = j0;
var oP = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function iP(e, t) {
  return t !== "rtl"
    ? e
    : e === "ArrowLeft"
      ? "ArrowRight"
      : e === "ArrowRight"
        ? "ArrowLeft"
        : e;
}
function lP(e, t, r) {
  const n = iP(e.key, r);
  if (
    !(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) &&
    !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n))
  )
    return oP[n];
}
function N0(e, t = !1) {
  const r = document.activeElement;
  for (const n of e)
    if (
      n === r ||
      (n.focus({ preventScroll: t }), document.activeElement !== r)
    )
      return;
}
function cP(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var C0 = _0,
  T0 = E0,
  uP = function (e) {
    if (typeof document > "u") return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  na = new WeakMap(),
  si = new WeakMap(),
  oi = {},
  Vc = 0,
  P0 = function (e) {
    return e && (e.host || P0(e.parentNode));
  },
  dP = function (e, t) {
    return t
      .map(function (r) {
        if (e.contains(r)) return r;
        var n = P0(r);
        return n && e.contains(n)
          ? n
          : (console.error(
              "aria-hidden",
              r,
              "in not contained inside",
              e,
              ". Doing nothing",
            ),
            null);
      })
      .filter(function (r) {
        return !!r;
      });
  },
  hP = function (e, t, r, n) {
    var a = dP(t, Array.isArray(e) ? e : [e]);
    oi[r] || (oi[r] = new WeakMap());
    var s = oi[r],
      o = [],
      i = new Set(),
      l = new Set(a),
      u = function (h) {
        !h || i.has(h) || (i.add(h), u(h.parentNode));
      };
    a.forEach(u);
    var d = function (h) {
      !h ||
        l.has(h) ||
        Array.prototype.forEach.call(h.children, function (f) {
          if (i.has(f)) d(f);
          else
            try {
              var v = f.getAttribute(n),
                g = v !== null && v !== "false",
                m = (na.get(f) || 0) + 1,
                w = (s.get(f) || 0) + 1;
              (na.set(f, m),
                s.set(f, w),
                o.push(f),
                m === 1 && g && si.set(f, !0),
                w === 1 && f.setAttribute(r, "true"),
                g || f.setAttribute(n, "true"));
            } catch (y) {
              console.error("aria-hidden: cannot operate on ", f, y);
            }
        });
    };
    return (
      d(t),
      i.clear(),
      Vc++,
      function () {
        (o.forEach(function (h) {
          var f = na.get(h) - 1,
            v = s.get(h) - 1;
          (na.set(h, f),
            s.set(h, v),
            f || (si.has(h) || h.removeAttribute(n), si.delete(h)),
            v || h.removeAttribute(r));
        }),
          Vc--,
          Vc ||
            ((na = new WeakMap()),
            (na = new WeakMap()),
            (si = new WeakMap()),
            (oi = {})));
      }
    );
  },
  R0 = function (e, t, r) {
    r === void 0 && (r = "data-aria-hidden");
    var n = Array.from(Array.isArray(e) ? e : [e]),
      a = uP(e);
    return a
      ? (n.push.apply(n, Array.from(a.querySelectorAll("[aria-live]"))),
        hP(n, a, r, "aria-hidden"))
      : function () {
          return null;
        };
  },
  Yt = function () {
    return (
      (Yt =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++) {
            t = arguments[r];
            for (var a in t)
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          }
          return e;
        }),
      Yt.apply(this, arguments)
    );
  };
function O0(e, t) {
  var r = {};
  for (var n in e)
    Object.prototype.hasOwnProperty.call(e, n) &&
      t.indexOf(n) < 0 &&
      (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
      t.indexOf(n[a]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
        (r[n[a]] = e[n[a]]);
  return r;
}
function fP(e, t, r) {
  for (var n = 0, a = t.length, s; n < a; n++)
    (s || !(n in t)) &&
      (s || (s = Array.prototype.slice.call(t, 0, n)), (s[n] = t[n]));
  return e.concat(s || Array.prototype.slice.call(t));
}
var _i = "right-scroll-bar-position",
  ji = "width-before-scroll-bar",
  pP = "with-scroll-bars-hidden",
  mP = "--removed-body-scroll-bar-size";
function Kc(e, t) {
  return (typeof e == "function" ? e(t) : e && (e.current = t), e);
}
function gP(e, t) {
  var r = p.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var a = r.value;
          a !== n && ((r.value = n), r.callback(n, a));
        },
      },
    };
  })[0];
  return ((r.callback = t), r.facade);
}
var vP = typeof window < "u" ? p.useLayoutEffect : p.useEffect,
  Vm = new WeakMap();
function yP(e, t) {
  var r = gP(null, function (n) {
    return e.forEach(function (a) {
      return Kc(a, n);
    });
  });
  return (
    vP(
      function () {
        var n = Vm.get(r);
        if (n) {
          var a = new Set(n),
            s = new Set(e),
            o = r.current;
          (a.forEach(function (i) {
            s.has(i) || Kc(i, null);
          }),
            s.forEach(function (i) {
              a.has(i) || Kc(i, o);
            }));
        }
        Vm.set(r, e);
      },
      [e],
    ),
    r
  );
}
function bP(e) {
  return e;
}
function wP(e, t) {
  t === void 0 && (t = bP);
  var r = [],
    n = !1,
    a = {
      read: function () {
        if (n)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return r.length ? r[r.length - 1] : e;
      },
      useMedium: function (s) {
        var o = t(s, n);
        return (
          r.push(o),
          function () {
            r = r.filter(function (i) {
              return i !== o;
            });
          }
        );
      },
      assignSyncMedium: function (s) {
        for (n = !0; r.length; ) {
          var o = r;
          ((r = []), o.forEach(s));
        }
        r = {
          push: function (i) {
            return s(i);
          },
          filter: function () {
            return r;
          },
        };
      },
      assignMedium: function (s) {
        n = !0;
        var o = [];
        if (r.length) {
          var i = r;
          ((r = []), i.forEach(s), (o = r));
        }
        var l = function () {
            var d = o;
            ((o = []), d.forEach(s));
          },
          u = function () {
            return Promise.resolve().then(l);
          };
        (u(),
          (r = {
            push: function (d) {
              (o.push(d), u());
            },
            filter: function (d) {
              return ((o = o.filter(d)), r);
            },
          }));
      },
    };
  return a;
}
function xP(e) {
  e === void 0 && (e = {});
  var t = wP(null);
  return ((t.options = Yt({ async: !0, ssr: !1 }, e)), t);
}
var A0 = function (e) {
  var t = e.sideCar,
    r = O0(e, ["sideCar"]);
  if (!t)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var n = t.read();
  if (!n) throw new Error("Sidecar medium not found");
  return p.createElement(n, Yt({}, r));
};
A0.isSideCarExport = !0;
function kP(e, t) {
  return (e.useMedium(t), A0);
}
var M0 = xP(),
  Gc = function () {},
  Kl = p.forwardRef(function (e, t) {
    var r = p.useRef(null),
      n = p.useState({
        onScrollCapture: Gc,
        onWheelCapture: Gc,
        onTouchMoveCapture: Gc,
      }),
      a = n[0],
      s = n[1],
      o = e.forwardProps,
      i = e.children,
      l = e.className,
      u = e.removeScrollBar,
      d = e.enabled,
      h = e.shards,
      f = e.sideCar,
      v = e.noIsolation,
      g = e.inert,
      m = e.allowPinchZoom,
      w = e.as,
      y = w === void 0 ? "div" : w,
      b = e.gapMode,
      x = O0(e, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      k = f,
      S = yP([r, t]),
      j = Yt(Yt({}, x), a);
    return p.createElement(
      p.Fragment,
      null,
      d &&
        p.createElement(k, {
          sideCar: M0,
          removeScrollBar: u,
          shards: h,
          noIsolation: v,
          inert: g,
          setCallbacks: s,
          allowPinchZoom: !!m,
          lockRef: r,
          gapMode: b,
        }),
      o
        ? p.cloneElement(p.Children.only(i), Yt(Yt({}, j), { ref: S }))
        : p.createElement(y, Yt({}, j, { className: l, ref: S }), i),
    );
  });
Kl.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
Kl.classNames = { fullWidth: ji, zeroRight: _i };
var SP = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function _P() {
  if (!document) return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = SP();
  return (t && e.setAttribute("nonce", t), e);
}
function jP(e, t) {
  e.styleSheet
    ? (e.styleSheet.cssText = t)
    : e.appendChild(document.createTextNode(t));
}
function EP(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var NP = function () {
    var e = 0,
      t = null;
    return {
      add: function (r) {
        (e == 0 && (t = _P()) && (jP(t, r), EP(t)), e++);
      },
      remove: function () {
        (e--,
          !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  },
  CP = function () {
    var e = NP();
    return function (t, r) {
      p.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && r],
      );
    };
  },
  I0 = function () {
    var e = CP(),
      t = function (r) {
        var n = r.styles,
          a = r.dynamic;
        return (e(n, a), null);
      };
    return t;
  },
  TP = { left: 0, top: 0, right: 0, gap: 0 },
  Qc = function (e) {
    return parseInt(e || "", 10) || 0;
  },
  PP = function (e) {
    var t = window.getComputedStyle(document.body),
      r = t[e === "padding" ? "paddingLeft" : "marginLeft"],
      n = t[e === "padding" ? "paddingTop" : "marginTop"],
      a = t[e === "padding" ? "paddingRight" : "marginRight"];
    return [Qc(r), Qc(n), Qc(a)];
  },
  RP = function (e) {
    if ((e === void 0 && (e = "margin"), typeof window > "u")) return TP;
    var t = PP(e),
      r = document.documentElement.clientWidth,
      n = window.innerWidth;
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, n - r + t[2] - t[0]),
    };
  },
  OP = I0(),
  Pa = "data-scroll-locked",
  AP = function (e, t, r, n) {
    var a = e.left,
      s = e.top,
      o = e.right,
      i = e.gap;
    return (
      r === void 0 && (r = "margin"),
      `
  .`
        .concat(
          pP,
          ` {
   overflow: hidden `,
        )
        .concat(
          n,
          `;
   padding-right: `,
        )
        .concat(i, "px ")
        .concat(
          n,
          `;
  }
  body[`,
        )
        .concat(
          Pa,
          `] {
    overflow: hidden `,
        )
        .concat(
          n,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && "position: relative ".concat(n, ";"),
            r === "margin" &&
              `
    padding-left: `
                .concat(
                  a,
                  `px;
    padding-top: `,
                )
                .concat(
                  s,
                  `px;
    padding-right: `,
                )
                .concat(
                  o,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(i, "px ")
                .concat(
                  n,
                  `;
    `,
                ),
            r === "padding" &&
              "padding-right: ".concat(i, "px ").concat(n, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          _i,
          ` {
    right: `,
        )
        .concat(i, "px ")
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(
          ji,
          ` {
    margin-right: `,
        )
        .concat(i, "px ")
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(_i, " .")
        .concat(
          _i,
          ` {
    right: 0 `,
        )
        .concat(
          n,
          `;
  }
  
  .`,
        )
        .concat(ji, " .")
        .concat(
          ji,
          ` {
    margin-right: 0 `,
        )
        .concat(
          n,
          `;
  }
  
  body[`,
        )
        .concat(
          Pa,
          `] {
    `,
        )
        .concat(mP, ": ")
        .concat(
          i,
          `px;
  }
`,
        )
    );
  },
  Km = function () {
    var e = parseInt(document.body.getAttribute(Pa) || "0", 10);
    return isFinite(e) ? e : 0;
  },
  MP = function () {
    p.useEffect(function () {
      return (
        document.body.setAttribute(Pa, (Km() + 1).toString()),
        function () {
          var e = Km() - 1;
          e <= 0
            ? document.body.removeAttribute(Pa)
            : document.body.setAttribute(Pa, e.toString());
        }
      );
    }, []);
  },
  IP = function (e) {
    var t = e.noRelative,
      r = e.noImportant,
      n = e.gapMode,
      a = n === void 0 ? "margin" : n;
    MP();
    var s = p.useMemo(
      function () {
        return RP(a);
      },
      [a],
    );
    return p.createElement(OP, { styles: AP(s, !t, a, r ? "" : "!important") });
  },
  vd = !1;
if (typeof window < "u")
  try {
    var ii = Object.defineProperty({}, "passive", {
      get: function () {
        return ((vd = !0), !0);
      },
    });
    (window.addEventListener("test", ii, ii),
      window.removeEventListener("test", ii, ii));
  } catch {
    vd = !1;
  }
var aa = vd ? { passive: !1 } : !1,
  DP = function (e) {
    return e.tagName === "TEXTAREA";
  },
  D0 = function (e, t) {
    if (!(e instanceof Element)) return !1;
    var r = window.getComputedStyle(e);
    return (
      r[t] !== "hidden" &&
      !(r.overflowY === r.overflowX && !DP(e) && r[t] === "visible")
    );
  },
  LP = function (e) {
    return D0(e, "overflowY");
  },
  $P = function (e) {
    return D0(e, "overflowX");
  },
  Gm = function (e, t) {
    var r = t.ownerDocument,
      n = t;
    do {
      typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
      var a = L0(e, n);
      if (a) {
        var s = $0(e, n),
          o = s[1],
          i = s[2];
        if (o > i) return !0;
      }
      n = n.parentNode;
    } while (n && n !== r.body);
    return !1;
  },
  FP = function (e) {
    var t = e.scrollTop,
      r = e.scrollHeight,
      n = e.clientHeight;
    return [t, r, n];
  },
  zP = function (e) {
    var t = e.scrollLeft,
      r = e.scrollWidth,
      n = e.clientWidth;
    return [t, r, n];
  },
  L0 = function (e, t) {
    return e === "v" ? LP(t) : $P(t);
  },
  $0 = function (e, t) {
    return e === "v" ? FP(t) : zP(t);
  },
  UP = function (e, t) {
    return e === "h" && t === "rtl" ? -1 : 1;
  },
  BP = function (e, t, r, n, a) {
    var s = UP(e, window.getComputedStyle(t).direction),
      o = s * n,
      i = r.target,
      l = t.contains(i),
      u = !1,
      d = o > 0,
      h = 0,
      f = 0;
    do {
      var v = $0(e, i),
        g = v[0],
        m = v[1],
        w = v[2],
        y = m - w - s * g;
      ((g || y) && L0(e, i) && ((h += y), (f += g)),
        i instanceof ShadowRoot ? (i = i.host) : (i = i.parentNode));
    } while ((!l && i !== document.body) || (l && (t.contains(i) || t === i)));
    return (
      ((d && (Math.abs(h) < 1 || !a)) || (!d && (Math.abs(f) < 1 || !a))) &&
        (u = !0),
      u
    );
  },
  li = function (e) {
    return "changedTouches" in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  Qm = function (e) {
    return [e.deltaX, e.deltaY];
  },
  Jm = function (e) {
    return e && "current" in e ? e.current : e;
  },
  WP = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  qP = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      );
  },
  HP = 0,
  sa = [];
function VP(e) {
  var t = p.useRef([]),
    r = p.useRef([0, 0]),
    n = p.useRef(),
    a = p.useState(HP++)[0],
    s = p.useState(I0)[0],
    o = p.useRef(e);
  (p.useEffect(
    function () {
      o.current = e;
    },
    [e],
  ),
    p.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add("block-interactivity-".concat(a));
          var m = fP([e.lockRef.current], (e.shards || []).map(Jm)).filter(
            Boolean,
          );
          return (
            m.forEach(function (w) {
              return w.classList.add("allow-interactivity-".concat(a));
            }),
            function () {
              (document.body.classList.remove("block-interactivity-".concat(a)),
                m.forEach(function (w) {
                  return w.classList.remove("allow-interactivity-".concat(a));
                }));
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    ));
  var i = p.useCallback(function (m, w) {
      if (
        ("touches" in m && m.touches.length === 2) ||
        (m.type === "wheel" && m.ctrlKey)
      )
        return !o.current.allowPinchZoom;
      var y = li(m),
        b = r.current,
        x = "deltaX" in m ? m.deltaX : b[0] - y[0],
        k = "deltaY" in m ? m.deltaY : b[1] - y[1],
        S,
        j = m.target,
        _ = Math.abs(x) > Math.abs(k) ? "h" : "v";
      if ("touches" in m && _ === "h" && j.type === "range") return !1;
      var C = Gm(_, j);
      if (!C) return !0;
      if ((C ? (S = _) : ((S = _ === "v" ? "h" : "v"), (C = Gm(_, j))), !C))
        return !1;
      if (
        (!n.current && "changedTouches" in m && (x || k) && (n.current = S), !S)
      )
        return !0;
      var D = n.current || S;
      return BP(D, w, m, D === "h" ? x : k, !0);
    }, []),
    l = p.useCallback(function (m) {
      var w = m;
      if (!(!sa.length || sa[sa.length - 1] !== s)) {
        var y = "deltaY" in w ? Qm(w) : li(w),
          b = t.current.filter(function (S) {
            return (
              S.name === w.type &&
              (S.target === w.target || w.target === S.shadowParent) &&
              WP(S.delta, y)
            );
          })[0];
        if (b && b.should) {
          w.cancelable && w.preventDefault();
          return;
        }
        if (!b) {
          var x = (o.current.shards || [])
              .map(Jm)
              .filter(Boolean)
              .filter(function (S) {
                return S.contains(w.target);
              }),
            k = x.length > 0 ? i(w, x[0]) : !o.current.noIsolation;
          k && w.cancelable && w.preventDefault();
        }
      }
    }, []),
    u = p.useCallback(function (m, w, y, b) {
      var x = { name: m, delta: w, target: y, should: b, shadowParent: KP(y) };
      (t.current.push(x),
        setTimeout(function () {
          t.current = t.current.filter(function (k) {
            return k !== x;
          });
        }, 1));
    }, []),
    d = p.useCallback(function (m) {
      ((r.current = li(m)), (n.current = void 0));
    }, []),
    h = p.useCallback(function (m) {
      u(m.type, Qm(m), m.target, i(m, e.lockRef.current));
    }, []),
    f = p.useCallback(function (m) {
      u(m.type, li(m), m.target, i(m, e.lockRef.current));
    }, []);
  p.useEffect(function () {
    return (
      sa.push(s),
      e.setCallbacks({
        onScrollCapture: h,
        onWheelCapture: h,
        onTouchMoveCapture: f,
      }),
      document.addEventListener("wheel", l, aa),
      document.addEventListener("touchmove", l, aa),
      document.addEventListener("touchstart", d, aa),
      function () {
        ((sa = sa.filter(function (m) {
          return m !== s;
        })),
          document.removeEventListener("wheel", l, aa),
          document.removeEventListener("touchmove", l, aa),
          document.removeEventListener("touchstart", d, aa));
      }
    );
  }, []);
  var v = e.removeScrollBar,
    g = e.inert;
  return p.createElement(
    p.Fragment,
    null,
    g ? p.createElement(s, { styles: qP(a) }) : null,
    v ? p.createElement(IP, { gapMode: e.gapMode }) : null,
  );
}
function KP(e) {
  for (var t = null; e !== null; )
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)),
      (e = e.parentNode));
  return t;
}
const GP = kP(M0, VP);
var Zh = p.forwardRef(function (e, t) {
  return p.createElement(Kl, Yt({}, e, { ref: t, sideCar: GP }));
});
Zh.classNames = Kl.classNames;
var yd = ["Enter", " "],
  QP = ["ArrowDown", "PageUp", "Home"],
  F0 = ["ArrowUp", "PageDown", "End"],
  JP = [...QP, ...F0],
  YP = { ltr: [...yd, "ArrowRight"], rtl: [...yd, "ArrowLeft"] },
  XP = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
  Eo = "Menu",
  [uo, ZP, eR] = wh(Eo),
  [Un, z0] = qa(Eo, [eR, Ol, Vl]),
  Gl = Ol(),
  U0 = Vl(),
  [tR, Bn] = Un(Eo),
  [rR, No] = Un(Eo),
  B0 = (e) => {
    const {
        __scopeMenu: t,
        open: r = !1,
        children: n,
        dir: a,
        onOpenChange: s,
        modal: o = !0,
      } = e,
      i = Gl(t),
      [l, u] = p.useState(null),
      d = p.useRef(!1),
      h = Ke(s),
      f = Yh(a);
    return (
      p.useEffect(() => {
        const v = () => {
            ((d.current = !0),
              document.addEventListener("pointerdown", g, {
                capture: !0,
                once: !0,
              }),
              document.addEventListener("pointermove", g, {
                capture: !0,
                once: !0,
              }));
          },
          g = () => (d.current = !1);
        return (
          document.addEventListener("keydown", v, { capture: !0 }),
          () => {
            (document.removeEventListener("keydown", v, { capture: !0 }),
              document.removeEventListener("pointerdown", g, { capture: !0 }),
              document.removeEventListener("pointermove", g, { capture: !0 }));
          }
        );
      }, []),
      c.jsx(zE, {
        ...i,
        children: c.jsx(tR, {
          scope: t,
          open: r,
          onOpenChange: h,
          content: l,
          onContentChange: u,
          children: c.jsx(rR, {
            scope: t,
            onClose: p.useCallback(() => h(!1), [h]),
            isUsingKeyboardRef: d,
            dir: f,
            modal: o,
            children: n,
          }),
        }),
      })
    );
  };
B0.displayName = Eo;
var nR = "MenuAnchor",
  ef = p.forwardRef((e, t) => {
    const { __scopeMenu: r, ...n } = e,
      a = Gl(r);
    return c.jsx(Sb, { ...a, ...n, ref: t });
  });
ef.displayName = nR;
var tf = "MenuPortal",
  [aR, W0] = Un(tf, { forceMount: void 0 }),
  q0 = (e) => {
    const { __scopeMenu: t, forceMount: r, children: n, container: a } = e,
      s = Bn(tf, t);
    return c.jsx(aR, {
      scope: t,
      forceMount: r,
      children: c.jsx(Ut, {
        present: r || s.open,
        children: c.jsx(jl, { asChild: !0, container: a, children: n }),
      }),
    });
  };
q0.displayName = tf;
var wt = "MenuContent",
  [sR, rf] = Un(wt),
  H0 = p.forwardRef((e, t) => {
    const r = W0(wt, e.__scopeMenu),
      { forceMount: n = r.forceMount, ...a } = e,
      s = Bn(wt, e.__scopeMenu),
      o = No(wt, e.__scopeMenu);
    return c.jsx(uo.Provider, {
      scope: e.__scopeMenu,
      children: c.jsx(Ut, {
        present: n || s.open,
        children: c.jsx(uo.Slot, {
          scope: e.__scopeMenu,
          children: o.modal
            ? c.jsx(oR, { ...a, ref: t })
            : c.jsx(iR, { ...a, ref: t }),
        }),
      }),
    });
  }),
  oR = p.forwardRef((e, t) => {
    const r = Bn(wt, e.__scopeMenu),
      n = p.useRef(null),
      a = Se(t, n);
    return (
      p.useEffect(() => {
        const s = n.current;
        if (s) return R0(s);
      }, []),
      c.jsx(nf, {
        ...e,
        ref: a,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        disableOutsideScroll: !0,
        onFocusOutside: F(e.onFocusOutside, (s) => s.preventDefault(), {
          checkForDefaultPrevented: !1,
        }),
        onDismiss: () => r.onOpenChange(!1),
      })
    );
  }),
  iR = p.forwardRef((e, t) => {
    const r = Bn(wt, e.__scopeMenu);
    return c.jsx(nf, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => r.onOpenChange(!1),
    });
  }),
  nf = p.forwardRef((e, t) => {
    const {
        __scopeMenu: r,
        loop: n = !1,
        trapFocus: a,
        onOpenAutoFocus: s,
        onCloseAutoFocus: o,
        disableOutsidePointerEvents: i,
        onEntryFocus: l,
        onEscapeKeyDown: u,
        onPointerDownOutside: d,
        onFocusOutside: h,
        onInteractOutside: f,
        onDismiss: v,
        disableOutsideScroll: g,
        ...m
      } = e,
      w = Bn(wt, r),
      y = No(wt, r),
      b = Gl(r),
      x = U0(r),
      k = ZP(r),
      [S, j] = p.useState(null),
      _ = p.useRef(null),
      C = Se(t, _, w.onContentChange),
      D = p.useRef(0),
      O = p.useRef(""),
      U = p.useRef(0),
      $ = p.useRef(null),
      G = p.useRef("right"),
      A = p.useRef(0),
      q = g ? Zh : p.Fragment,
      B = g ? { as: Mn, allowPinchZoom: !0 } : void 0,
      J = (N) => {
        var M, I;
        const z = O.current + N,
          W = k().filter((Re) => !Re.disabled),
          re = document.activeElement,
          _e =
            (M = W.find((Re) => Re.ref.current === re)) == null
              ? void 0
              : M.textValue,
          se = W.map((Re) => Re.textValue),
          Ye = bR(se, z, _e),
          Wt =
            (I = W.find((Re) => Re.textValue === Ye)) == null
              ? void 0
              : I.ref.current;
        ((function Re(qt) {
          ((O.current = qt),
            window.clearTimeout(D.current),
            qt !== "" && (D.current = window.setTimeout(() => Re(""), 1e3)));
        })(z),
          Wt && setTimeout(() => Wt.focus()));
      };
    (p.useEffect(() => () => window.clearTimeout(D.current), []), x0());
    const E = p.useCallback((N) => {
      var M, I;
      return (
        G.current === ((M = $.current) == null ? void 0 : M.side) &&
        xR(N, (I = $.current) == null ? void 0 : I.area)
      );
    }, []);
    return c.jsx(sR, {
      scope: r,
      searchRef: O,
      onItemEnter: p.useCallback(
        (N) => {
          E(N) && N.preventDefault();
        },
        [E],
      ),
      onItemLeave: p.useCallback(
        (N) => {
          var M;
          E(N) || ((M = _.current) == null || M.focus(), j(null));
        },
        [E],
      ),
      onTriggerLeave: p.useCallback(
        (N) => {
          E(N) && N.preventDefault();
        },
        [E],
      ),
      pointerGraceTimerRef: U,
      onPointerGraceIntentChange: p.useCallback((N) => {
        $.current = N;
      }, []),
      children: c.jsx(q, {
        ...B,
        children: c.jsx(Xh, {
          asChild: !0,
          trapped: a,
          onMountAutoFocus: F(s, (N) => {
            var M;
            (N.preventDefault(),
              (M = _.current) == null || M.focus({ preventScroll: !0 }));
          }),
          onUnmountAutoFocus: o,
          children: c.jsx(bo, {
            asChild: !0,
            disableOutsidePointerEvents: i,
            onEscapeKeyDown: u,
            onPointerDownOutside: d,
            onFocusOutside: h,
            onInteractOutside: f,
            onDismiss: v,
            children: c.jsx(C0, {
              asChild: !0,
              ...x,
              dir: y.dir,
              orientation: "vertical",
              loop: n,
              currentTabStopId: S,
              onCurrentTabStopIdChange: j,
              onEntryFocus: F(l, (N) => {
                y.isUsingKeyboardRef.current || N.preventDefault();
              }),
              preventScrollOnEntryFocus: !0,
              children: c.jsx(_b, {
                role: "menu",
                "aria-orientation": "vertical",
                "data-state": iw(w.open),
                "data-radix-menu-content": "",
                dir: y.dir,
                ...b,
                ...m,
                ref: C,
                style: { outline: "none", ...m.style },
                onKeyDown: F(m.onKeyDown, (N) => {
                  const M =
                      N.target.closest("[data-radix-menu-content]") ===
                      N.currentTarget,
                    I = N.ctrlKey || N.altKey || N.metaKey,
                    z = N.key.length === 1;
                  M &&
                    (N.key === "Tab" && N.preventDefault(),
                    !I && z && J(N.key));
                  const W = _.current;
                  if (N.target !== W || !JP.includes(N.key)) return;
                  N.preventDefault();
                  const re = k()
                    .filter((_e) => !_e.disabled)
                    .map((_e) => _e.ref.current);
                  (F0.includes(N.key) && re.reverse(), vR(re));
                }),
                onBlur: F(e.onBlur, (N) => {
                  N.currentTarget.contains(N.target) ||
                    (window.clearTimeout(D.current), (O.current = ""));
                }),
                onPointerMove: F(
                  e.onPointerMove,
                  ho((N) => {
                    const M = N.target,
                      I = A.current !== N.clientX;
                    if (N.currentTarget.contains(M) && I) {
                      const z = N.clientX > A.current ? "right" : "left";
                      ((G.current = z), (A.current = N.clientX));
                    }
                  }),
                ),
              }),
            }),
          }),
        }),
      }),
    });
  });
H0.displayName = wt;
var lR = "MenuGroup",
  af = p.forwardRef((e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return c.jsx(ae.div, { role: "group", ...n, ref: t });
  });
af.displayName = lR;
var cR = "MenuLabel",
  V0 = p.forwardRef((e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return c.jsx(ae.div, { ...n, ref: t });
  });
V0.displayName = cR;
var sl = "MenuItem",
  Ym = "menu.itemSelect",
  Ql = p.forwardRef((e, t) => {
    const { disabled: r = !1, onSelect: n, ...a } = e,
      s = p.useRef(null),
      o = No(sl, e.__scopeMenu),
      i = rf(sl, e.__scopeMenu),
      l = Se(t, s),
      u = p.useRef(!1),
      d = () => {
        const h = s.current;
        if (!r && h) {
          const f = new CustomEvent(Ym, { bubbles: !0, cancelable: !0 });
          (h.addEventListener(Ym, (v) => (n == null ? void 0 : n(v)), {
            once: !0,
          }),
            xh(h, f),
            f.defaultPrevented ? (u.current = !1) : o.onClose());
        }
      };
    return c.jsx(K0, {
      ...a,
      ref: l,
      disabled: r,
      onClick: F(e.onClick, d),
      onPointerDown: (h) => {
        var f;
        ((f = e.onPointerDown) == null || f.call(e, h), (u.current = !0));
      },
      onPointerUp: F(e.onPointerUp, (h) => {
        var f;
        u.current || (f = h.currentTarget) == null || f.click();
      }),
      onKeyDown: F(e.onKeyDown, (h) => {
        const f = i.searchRef.current !== "";
        r ||
          (f && h.key === " ") ||
          (yd.includes(h.key) && (h.currentTarget.click(), h.preventDefault()));
      }),
    });
  });
Ql.displayName = sl;
var K0 = p.forwardRef((e, t) => {
    const { __scopeMenu: r, disabled: n = !1, textValue: a, ...s } = e,
      o = rf(sl, r),
      i = U0(r),
      l = p.useRef(null),
      u = Se(t, l),
      [d, h] = p.useState(!1),
      [f, v] = p.useState("");
    return (
      p.useEffect(() => {
        const g = l.current;
        g && v((g.textContent ?? "").trim());
      }, [s.children]),
      c.jsx(uo.ItemSlot, {
        scope: r,
        disabled: n,
        textValue: a ?? f,
        children: c.jsx(T0, {
          asChild: !0,
          ...i,
          focusable: !n,
          children: c.jsx(ae.div, {
            role: "menuitem",
            "data-highlighted": d ? "" : void 0,
            "aria-disabled": n || void 0,
            "data-disabled": n ? "" : void 0,
            ...s,
            ref: u,
            onPointerMove: F(
              e.onPointerMove,
              ho((g) => {
                n
                  ? o.onItemLeave(g)
                  : (o.onItemEnter(g),
                    g.defaultPrevented ||
                      g.currentTarget.focus({ preventScroll: !0 }));
              }),
            ),
            onPointerLeave: F(
              e.onPointerLeave,
              ho((g) => o.onItemLeave(g)),
            ),
            onFocus: F(e.onFocus, () => h(!0)),
            onBlur: F(e.onBlur, () => h(!1)),
          }),
        }),
      })
    );
  }),
  uR = "MenuCheckboxItem",
  G0 = p.forwardRef((e, t) => {
    const { checked: r = !1, onCheckedChange: n, ...a } = e;
    return c.jsx(Z0, {
      scope: e.__scopeMenu,
      checked: r,
      children: c.jsx(Ql, {
        role: "menuitemcheckbox",
        "aria-checked": ol(r) ? "mixed" : r,
        ...a,
        ref: t,
        "data-state": of(r),
        onSelect: F(
          a.onSelect,
          () => (n == null ? void 0 : n(ol(r) ? !0 : !r)),
          { checkForDefaultPrevented: !1 },
        ),
      }),
    });
  });
G0.displayName = uR;
var Q0 = "MenuRadioGroup",
  [dR, hR] = Un(Q0, { value: void 0, onValueChange: () => {} }),
  J0 = p.forwardRef((e, t) => {
    const { value: r, onValueChange: n, ...a } = e,
      s = Ke(n);
    return c.jsx(dR, {
      scope: e.__scopeMenu,
      value: r,
      onValueChange: s,
      children: c.jsx(af, { ...a, ref: t }),
    });
  });
J0.displayName = Q0;
var Y0 = "MenuRadioItem",
  X0 = p.forwardRef((e, t) => {
    const { value: r, ...n } = e,
      a = hR(Y0, e.__scopeMenu),
      s = r === a.value;
    return c.jsx(Z0, {
      scope: e.__scopeMenu,
      checked: s,
      children: c.jsx(Ql, {
        role: "menuitemradio",
        "aria-checked": s,
        ...n,
        ref: t,
        "data-state": of(s),
        onSelect: F(
          n.onSelect,
          () => {
            var o;
            return (o = a.onValueChange) == null ? void 0 : o.call(a, r);
          },
          { checkForDefaultPrevented: !1 },
        ),
      }),
    });
  });
X0.displayName = Y0;
var sf = "MenuItemIndicator",
  [Z0, fR] = Un(sf, { checked: !1 }),
  ew = p.forwardRef((e, t) => {
    const { __scopeMenu: r, forceMount: n, ...a } = e,
      s = fR(sf, r);
    return c.jsx(Ut, {
      present: n || ol(s.checked) || s.checked === !0,
      children: c.jsx(ae.span, { ...a, ref: t, "data-state": of(s.checked) }),
    });
  });
ew.displayName = sf;
var pR = "MenuSeparator",
  tw = p.forwardRef((e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return c.jsx(ae.div, {
      role: "separator",
      "aria-orientation": "horizontal",
      ...n,
      ref: t,
    });
  });
tw.displayName = pR;
var mR = "MenuArrow",
  rw = p.forwardRef((e, t) => {
    const { __scopeMenu: r, ...n } = e,
      a = Gl(r);
    return c.jsx(jb, { ...a, ...n, ref: t });
  });
rw.displayName = mR;
var gR = "MenuSub",
  [l4, nw] = Un(gR),
  js = "MenuSubTrigger",
  aw = p.forwardRef((e, t) => {
    const r = Bn(js, e.__scopeMenu),
      n = No(js, e.__scopeMenu),
      a = nw(js, e.__scopeMenu),
      s = rf(js, e.__scopeMenu),
      o = p.useRef(null),
      { pointerGraceTimerRef: i, onPointerGraceIntentChange: l } = s,
      u = { __scopeMenu: e.__scopeMenu },
      d = p.useCallback(() => {
        (o.current && window.clearTimeout(o.current), (o.current = null));
      }, []);
    return (
      p.useEffect(() => d, [d]),
      p.useEffect(() => {
        const h = i.current;
        return () => {
          (window.clearTimeout(h), l(null));
        };
      }, [i, l]),
      c.jsx(ef, {
        asChild: !0,
        ...u,
        children: c.jsx(K0, {
          id: a.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": r.open,
          "aria-controls": a.contentId,
          "data-state": iw(r.open),
          ...e,
          ref: _l(t, a.onTriggerChange),
          onClick: (h) => {
            var f;
            ((f = e.onClick) == null || f.call(e, h),
              !(e.disabled || h.defaultPrevented) &&
                (h.currentTarget.focus(), r.open || r.onOpenChange(!0)));
          },
          onPointerMove: F(
            e.onPointerMove,
            ho((h) => {
              (s.onItemEnter(h),
                !h.defaultPrevented &&
                  !e.disabled &&
                  !r.open &&
                  !o.current &&
                  (s.onPointerGraceIntentChange(null),
                  (o.current = window.setTimeout(() => {
                    (r.onOpenChange(!0), d());
                  }, 100))));
            }),
          ),
          onPointerLeave: F(
            e.onPointerLeave,
            ho((h) => {
              var f, v;
              d();
              const g =
                (f = r.content) == null ? void 0 : f.getBoundingClientRect();
              if (g) {
                const m = (v = r.content) == null ? void 0 : v.dataset.side,
                  w = m === "right",
                  y = w ? -5 : 5,
                  b = g[w ? "left" : "right"],
                  x = g[w ? "right" : "left"];
                (s.onPointerGraceIntentChange({
                  area: [
                    { x: h.clientX + y, y: h.clientY },
                    { x: b, y: g.top },
                    { x, y: g.top },
                    { x, y: g.bottom },
                    { x: b, y: g.bottom },
                  ],
                  side: m,
                }),
                  window.clearTimeout(i.current),
                  (i.current = window.setTimeout(
                    () => s.onPointerGraceIntentChange(null),
                    300,
                  )));
              } else {
                if ((s.onTriggerLeave(h), h.defaultPrevented)) return;
                s.onPointerGraceIntentChange(null);
              }
            }),
          ),
          onKeyDown: F(e.onKeyDown, (h) => {
            var f;
            const v = s.searchRef.current !== "";
            e.disabled ||
              (v && h.key === " ") ||
              (YP[n.dir].includes(h.key) &&
                (r.onOpenChange(!0),
                (f = r.content) == null || f.focus(),
                h.preventDefault()));
          }),
        }),
      })
    );
  });
aw.displayName = js;
var sw = "MenuSubContent",
  ow = p.forwardRef((e, t) => {
    const r = W0(wt, e.__scopeMenu),
      { forceMount: n = r.forceMount, ...a } = e,
      s = Bn(wt, e.__scopeMenu),
      o = No(wt, e.__scopeMenu),
      i = nw(sw, e.__scopeMenu),
      l = p.useRef(null),
      u = Se(t, l);
    return c.jsx(uo.Provider, {
      scope: e.__scopeMenu,
      children: c.jsx(Ut, {
        present: n || s.open,
        children: c.jsx(uo.Slot, {
          scope: e.__scopeMenu,
          children: c.jsx(nf, {
            id: i.contentId,
            "aria-labelledby": i.triggerId,
            ...a,
            ref: u,
            align: "start",
            side: o.dir === "rtl" ? "left" : "right",
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            trapFocus: !1,
            onOpenAutoFocus: (d) => {
              var h;
              (o.isUsingKeyboardRef.current &&
                ((h = l.current) == null || h.focus()),
                d.preventDefault());
            },
            onCloseAutoFocus: (d) => d.preventDefault(),
            onFocusOutside: F(e.onFocusOutside, (d) => {
              d.target !== i.trigger && s.onOpenChange(!1);
            }),
            onEscapeKeyDown: F(e.onEscapeKeyDown, (d) => {
              (o.onClose(), d.preventDefault());
            }),
            onKeyDown: F(e.onKeyDown, (d) => {
              var h;
              const f = d.currentTarget.contains(d.target),
                v = XP[o.dir].includes(d.key);
              f &&
                v &&
                (s.onOpenChange(!1),
                (h = i.trigger) == null || h.focus(),
                d.preventDefault());
            }),
          }),
        }),
      }),
    });
  });
ow.displayName = sw;
function iw(e) {
  return e ? "open" : "closed";
}
function ol(e) {
  return e === "indeterminate";
}
function of(e) {
  return ol(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function vR(e) {
  const t = document.activeElement;
  for (const r of e)
    if (r === t || (r.focus(), document.activeElement !== t)) return;
}
function yR(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
function bR(e, t, r) {
  const n = t.length > 1 && Array.from(t).every((i) => i === t[0]) ? t[0] : t,
    a = r ? e.indexOf(r) : -1;
  let s = yR(e, Math.max(a, 0));
  n.length === 1 && (s = s.filter((i) => i !== r));
  const o = s.find((i) => i.toLowerCase().startsWith(n.toLowerCase()));
  return o !== r ? o : void 0;
}
function wR(e, t) {
  const { x: r, y: n } = e;
  let a = !1;
  for (let s = 0, o = t.length - 1; s < t.length; o = s++) {
    const i = t[s].x,
      l = t[s].y,
      u = t[o].x,
      d = t[o].y;
    l > n != d > n && r < ((u - i) * (n - l)) / (d - l) + i && (a = !a);
  }
  return a;
}
function xR(e, t) {
  if (!t) return !1;
  const r = { x: e.clientX, y: e.clientY };
  return wR(r, t);
}
function ho(e) {
  return (t) => (t.pointerType === "mouse" ? e(t) : void 0);
}
var kR = B0,
  SR = ef,
  _R = q0,
  jR = H0,
  ER = af,
  NR = V0,
  CR = Ql,
  TR = G0,
  PR = J0,
  RR = X0,
  OR = ew,
  AR = tw,
  MR = rw,
  IR = aw,
  DR = ow,
  lf = "DropdownMenu",
  [LR, c4] = qa(lf, [z0]),
  Je = z0(),
  [$R, lw] = LR(lf),
  cw = (e) => {
    const {
        __scopeDropdownMenu: t,
        children: r,
        dir: n,
        open: a,
        defaultOpen: s,
        onOpenChange: o,
        modal: i = !0,
      } = e,
      l = Je(t),
      u = p.useRef(null),
      [d = !1, h] = wo({ prop: a, defaultProp: s, onChange: o });
    return c.jsx($R, {
      scope: t,
      triggerId: Nn(),
      triggerRef: u,
      contentId: Nn(),
      open: d,
      onOpenChange: h,
      onOpenToggle: p.useCallback(() => h((f) => !f), [h]),
      modal: i,
      children: c.jsx(kR, {
        ...l,
        open: d,
        onOpenChange: h,
        dir: n,
        modal: i,
        children: r,
      }),
    });
  };
cw.displayName = lf;
var uw = "DropdownMenuTrigger",
  dw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, disabled: n = !1, ...a } = e,
      s = lw(uw, r),
      o = Je(r);
    return c.jsx(SR, {
      asChild: !0,
      ...o,
      children: c.jsx(ae.button, {
        type: "button",
        id: s.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": s.open ? "open" : "closed",
        "data-disabled": n ? "" : void 0,
        disabled: n,
        ...a,
        ref: _l(t, s.triggerRef),
        onPointerDown: F(e.onPointerDown, (i) => {
          !n &&
            i.button === 0 &&
            i.ctrlKey === !1 &&
            (s.onOpenToggle(), s.open || i.preventDefault());
        }),
        onKeyDown: F(e.onKeyDown, (i) => {
          n ||
            (["Enter", " "].includes(i.key) && s.onOpenToggle(),
            i.key === "ArrowDown" && s.onOpenChange(!0),
            ["Enter", " ", "ArrowDown"].includes(i.key) && i.preventDefault());
        }),
      }),
    });
  });
dw.displayName = uw;
var FR = "DropdownMenuPortal",
  hw = (e) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      n = Je(t);
    return c.jsx(_R, { ...n, ...r });
  };
hw.displayName = FR;
var fw = "DropdownMenuContent",
  pw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = lw(fw, r),
      s = Je(r),
      o = p.useRef(!1);
    return c.jsx(jR, {
      id: a.contentId,
      "aria-labelledby": a.triggerId,
      ...s,
      ...n,
      ref: t,
      onCloseAutoFocus: F(e.onCloseAutoFocus, (i) => {
        var l;
        (o.current || (l = a.triggerRef.current) == null || l.focus(),
          (o.current = !1),
          i.preventDefault());
      }),
      onInteractOutside: F(e.onInteractOutside, (i) => {
        const l = i.detail.originalEvent,
          u = l.button === 0 && l.ctrlKey === !0,
          d = l.button === 2 || u;
        (!a.modal || d) && (o.current = !0);
      }),
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
pw.displayName = fw;
var zR = "DropdownMenuGroup",
  UR = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(ER, { ...a, ...n, ref: t });
  });
UR.displayName = zR;
var BR = "DropdownMenuLabel",
  mw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(NR, { ...a, ...n, ref: t });
  });
mw.displayName = BR;
var WR = "DropdownMenuItem",
  gw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(CR, { ...a, ...n, ref: t });
  });
gw.displayName = WR;
var qR = "DropdownMenuCheckboxItem",
  vw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(TR, { ...a, ...n, ref: t });
  });
vw.displayName = qR;
var HR = "DropdownMenuRadioGroup",
  VR = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(PR, { ...a, ...n, ref: t });
  });
VR.displayName = HR;
var KR = "DropdownMenuRadioItem",
  yw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(RR, { ...a, ...n, ref: t });
  });
yw.displayName = KR;
var GR = "DropdownMenuItemIndicator",
  bw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(OR, { ...a, ...n, ref: t });
  });
bw.displayName = GR;
var QR = "DropdownMenuSeparator",
  ww = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(AR, { ...a, ...n, ref: t });
  });
ww.displayName = QR;
var JR = "DropdownMenuArrow",
  YR = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(MR, { ...a, ...n, ref: t });
  });
YR.displayName = JR;
var XR = "DropdownMenuSubTrigger",
  xw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(IR, { ...a, ...n, ref: t });
  });
xw.displayName = XR;
var ZR = "DropdownMenuSubContent",
  kw = p.forwardRef((e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e,
      a = Je(r);
    return c.jsx(DR, {
      ...a,
      ...n,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
kw.displayName = ZR;
var eO = cw,
  tO = dw,
  rO = hw,
  Sw = pw,
  _w = mw,
  jw = gw,
  Ew = vw,
  Nw = yw,
  Cw = bw,
  Tw = ww,
  Pw = xw,
  Rw = kw;
const Xm = eO,
  Zm = tO,
  nO = p.forwardRef(({ className: e, inset: t, children: r, ...n }, a) =>
    c.jsxs(Pw, {
      ref: a,
      className: ee(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        t && "pl-8",
        e,
      ),
      ...n,
      children: [r, c.jsx(e_, { className: "ml-auto h-4 w-4" })],
    }),
  );
nO.displayName = Pw.displayName;
const aO = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(Rw, {
    ref: r,
    className: ee(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e,
    ),
    ...t,
  }),
);
aO.displayName = Rw.displayName;
const bd = p.forwardRef(({ className: e, sideOffset: t = 4, ...r }, n) =>
  c.jsx(rO, {
    children: c.jsx(Sw, {
      ref: n,
      sideOffset: t,
      className: ee(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        e,
      ),
      ...r,
    }),
  }),
);
bd.displayName = Sw.displayName;
const wd = p.forwardRef(({ className: e, inset: t, ...r }, n) =>
  c.jsx(jw, {
    ref: n,
    className: ee(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      t && "pl-8",
      e,
    ),
    ...r,
  }),
);
wd.displayName = jw.displayName;
const sO = p.forwardRef(({ className: e, children: t, checked: r, ...n }, a) =>
  c.jsxs(Ew, {
    ref: a,
    className: ee(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    checked: r,
    ...n,
    children: [
      c.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: c.jsx(Cw, { children: c.jsx(ZS, { className: "h-4 w-4" }) }),
      }),
      t,
    ],
  }),
);
sO.displayName = Ew.displayName;
const oO = p.forwardRef(({ className: e, children: t, ...r }, n) =>
  c.jsxs(Nw, {
    ref: n,
    className: ee(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    ...r,
    children: [
      c.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: c.jsx(Cw, {
          children: c.jsx(t_, { className: "h-2 w-2 fill-current" }),
        }),
      }),
      t,
    ],
  }),
);
oO.displayName = Nw.displayName;
const iO = p.forwardRef(({ className: e, inset: t, ...r }, n) =>
  c.jsx(_w, {
    ref: n,
    className: ee("px-2 py-1.5 text-sm font-semibold", t && "pl-8", e),
    ...r,
  }),
);
iO.displayName = _w.displayName;
const lO = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(Tw, { ref: r, className: ee("-mx-1 my-1 h-px bg-muted", e), ...t }),
);
lO.displayName = Tw.displayName;
const cO = () => {
    const [e, t] = p.useState(!1),
      [r, n] = p.useState(!1),
      [a, s] = p.useState(!1),
      o = Fn(),
      { user: i, signOut: l } = Jh(),
      u = [
        { href: "/", label: "Terminal", icon: Ky },
        { href: "/music", label: "Music Vault", icon: jh },
        { href: "/about", label: "About", icon: v_ },
        { href: "/members", label: "Members", icon: _n, auth: !0 },
      ],
      d = [
        { href: "/aliens", label: "Aliens", icon: d_ },
        { href: "/core-rule-book", label: "Core Rule Book", icon: Hy },
        { href: "/lore", label: "Lore", icon: h_ },
      ],
      h = [
        { href: "/members", label: "Member Vault", icon: _n },
        { href: "/projects", label: "Projects", icon: a_ },
      ],
      f = u.filter((g) => !g.auth || i),
      v = (g) => o.pathname === g;
    return c.jsxs(c.Fragment, {
      children: [
        c.jsx("nav", {
          className:
            "hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/20",
          children: c.jsx("div", {
            className: "container mx-auto px-6 py-4",
            children: c.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                c.jsxs(Be, {
                  to: "/",
                  className: "flex items-center space-x-2 group",
                  children: [
                    c.jsxs("div", {
                      className:
                        "terminal-text text-xl font-bold glow-text flicker",
                      children: [
                        "LORD",
                        c.jsx("span", {
                          className: "text-secondary-bright",
                          children: "TSARCASM",
                        }),
                      ],
                    }),
                    c.jsx("div", {
                      className:
                        "w-2 h-2 bg-primary rounded-full animate-glow-pulse",
                    }),
                  ],
                }),
                c.jsxs("div", {
                  className: "flex items-center space-x-1",
                  children: [
                    f.map((g) => {
                      const m = g.icon;
                      return g.href === "/members"
                        ? c.jsxs(
                            Xm,
                            {
                              children: [
                                c.jsx(Zm, {
                                  asChild: !0,
                                  children: c.jsxs(Z, {
                                    variant:
                                      v(g.href) || h.some((w) => v(w.href))
                                        ? "default"
                                        : "ghost",
                                    className: `holo-hover terminal-text ${v(g.href) || h.some((w) => v(w.href)) ? "bg-primary/20 text-primary border border-primary/50" : "hover:bg-primary/10 hover:text-primary"}`,
                                    children: [
                                      c.jsx(m, { className: "w-4 h-4" }),
                                      c.jsx("span", { children: g.label }),
                                      c.jsx(Ss, { className: "w-4 h-4" }),
                                    ],
                                  }),
                                }),
                                c.jsx(bd, {
                                  className: "terminal-text",
                                  children: h.map((w) => {
                                    const y = w.icon;
                                    return c.jsx(
                                      wd,
                                      {
                                        asChild: !0,
                                        className:
                                          "flex items-center space-x-2",
                                        children: c.jsxs(Be, {
                                          to: w.href,
                                          children: [
                                            c.jsx(y, { className: "w-4 h-4" }),
                                            c.jsx("span", {
                                              children: w.label,
                                            }),
                                          ],
                                        }),
                                      },
                                      w.href,
                                    );
                                  }),
                                }),
                              ],
                            },
                            g.href,
                          )
                        : c.jsx(
                            Z,
                            {
                              variant: v(g.href) ? "default" : "ghost",
                              asChild: !0,
                              className: `
                      holo-hover terminal-text
                      ${v(g.href) ? "bg-primary/20 text-primary border border-primary/50" : "hover:bg-primary/10 hover:text-primary"}
                    `,
                              children: c.jsxs(Be, {
                                to: g.href,
                                className: "flex items-center space-x-2",
                                children: [
                                  c.jsx(m, { className: "w-4 h-4" }),
                                  c.jsx("span", { children: g.label }),
                                ],
                              }),
                            },
                            g.href,
                          );
                    }),
                    c.jsxs(Xm, {
                      children: [
                        c.jsx(Zm, {
                          asChild: !0,
                          children: c.jsxs(Z, {
                            variant: d.some((g) => v(g.href))
                              ? "default"
                              : "ghost",
                            className: `holo-hover terminal-text ${d.some((g) => v(g.href)) ? "bg-primary/20 text-primary border border-primary/50" : "hover:bg-primary/10 hover:text-primary"}`,
                            children: [
                              c.jsx($p, { className: "w-4 h-4" }),
                              c.jsx("span", { children: "Game" }),
                              c.jsx(Ss, { className: "w-4 h-4" }),
                            ],
                          }),
                        }),
                        c.jsx(bd, {
                          className: "terminal-text",
                          children: d.map((g) => {
                            const m = g.icon;
                            return c.jsx(
                              wd,
                              {
                                asChild: !0,
                                className: "flex items-center space-x-2",
                                children: c.jsxs(Be, {
                                  to: g.href,
                                  children: [
                                    c.jsx(m, { className: "w-4 h-4" }),
                                    c.jsx("span", { children: g.label }),
                                  ],
                                }),
                              },
                              g.href,
                            );
                          }),
                        }),
                      ],
                    }),
                    i
                      ? c.jsx(Z, {
                          variant: "outline",
                          size: "icon",
                          onClick: l,
                          className:
                            "terminal-text border-destructive/50 hover:border-destructive hover:text-destructive ml-2",
                          children: c.jsx(Fp, { className: "w-4 h-4" }),
                        })
                      : c.jsx(Z, {
                          variant: "outline",
                          asChild: !0,
                          className:
                            "terminal-text border-primary/50 hover:border-primary hover:text-primary ml-2",
                          children: c.jsxs(Be, {
                            to: "/auth",
                            className: "flex items-center space-x-2",
                            children: [
                              c.jsx(_n, { className: "w-4 h-4" }),
                              c.jsx("span", { children: "Sign In" }),
                            ],
                          }),
                        }),
                  ],
                }),
              ],
            }),
          }),
        }),
        c.jsx("nav", {
          className:
            "md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20",
          children: c.jsxs("div", {
            className: "px-4 py-3",
            children: [
              c.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  c.jsxs(Be, {
                    to: "/",
                    className: "terminal-text font-bold glow-text",
                    children: [
                      "LORD",
                      c.jsx("span", {
                        className: "text-secondary-bright",
                        children: "TSARCASM",
                      }),
                    ],
                  }),
                  c.jsx(Z, {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => t(!e),
                    className: "text-primary hover:bg-primary/10",
                    children: e
                      ? c.jsx(Nh, { className: "w-5 h-5" })
                      : c.jsx(c_, { className: "w-5 h-5" }),
                  }),
                ],
              }),
              e &&
                c.jsx("div", {
                  className: "mt-4 py-4 border-t border-primary/20",
                  children: c.jsxs("div", {
                    className: "flex flex-col space-y-2",
                    children: [
                      f.map((g) => {
                        const m = g.icon;
                        return g.href === "/members"
                          ? c.jsxs(
                              "div",
                              {
                                children: [
                                  c.jsxs(Z, {
                                    variant:
                                      a || h.some((w) => v(w.href))
                                        ? "default"
                                        : "ghost",
                                    onClick: () => s(!a),
                                    className:
                                      "justify-start terminal-text hover:bg-primary/10 hover:text-primary",
                                    children: [
                                      c.jsx(m, { className: "w-4 h-4" }),
                                      c.jsx("span", { children: "Members" }),
                                      c.jsx(Ss, {
                                        className: `w-4 h-4 transform transition-transform ${a ? "rotate-180" : "rotate-0"}`,
                                      }),
                                    ],
                                  }),
                                  a &&
                                    c.jsx("div", {
                                      className: "pl-4 space-y-1",
                                      children: h.map((w) => {
                                        const y = w.icon;
                                        return c.jsx(
                                          Z,
                                          {
                                            variant: v(w.href)
                                              ? "default"
                                              : "ghost",
                                            asChild: !0,
                                            className: `justify-start terminal-text ${v(w.href) ? "bg-primary/20 text-primary" : "hover:bg-primary/10 hover:text-primary"}`,
                                            onClick: () => {
                                              (t(!1), s(!1));
                                            },
                                            children: c.jsxs(Be, {
                                              to: w.href,
                                              className:
                                                "flex items-center space-x-2",
                                              children: [
                                                c.jsx(y, {
                                                  className: "w-4 h-4",
                                                }),
                                                c.jsx("span", {
                                                  children: w.label,
                                                }),
                                              ],
                                            }),
                                          },
                                          w.href,
                                        );
                                      }),
                                    }),
                                ],
                              },
                              "members-menu",
                            )
                          : c.jsx(
                              Z,
                              {
                                variant: v(g.href) ? "default" : "ghost",
                                asChild: !0,
                                className: `
                        justify-start terminal-text
                        ${v(g.href) ? "bg-primary/20 text-primary" : "hover:bg-primary/10 hover:text-primary"}
                      `,
                                onClick: () => t(!1),
                                children: c.jsxs(Be, {
                                  to: g.href,
                                  className: "flex items-center space-x-2",
                                  children: [
                                    c.jsx(m, { className: "w-4 h-4" }),
                                    c.jsx("span", { children: g.label }),
                                  ],
                                }),
                              },
                              g.href,
                            );
                      }),
                      c.jsxs(Z, {
                        variant: r ? "default" : "ghost",
                        onClick: () => n(!r),
                        className:
                          "justify-start terminal-text hover:bg-primary/10 hover:text-primary",
                        children: [
                          c.jsx($p, { className: "w-4 h-4" }),
                          c.jsx("span", { children: "Game" }),
                          c.jsx(Ss, {
                            className: `w-4 h-4 transform transition-transform ${r ? "rotate-180" : "rotate-0"}`,
                          }),
                        ],
                      }),
                      r &&
                        c.jsx("div", {
                          className: "pl-4 space-y-1",
                          children: d.map((g) => {
                            const m = g.icon;
                            return c.jsx(
                              Z,
                              {
                                variant: v(g.href) ? "default" : "ghost",
                                asChild: !0,
                                className: `justify-start terminal-text ${v(g.href) ? "bg-primary/20 text-primary" : "hover:bg-primary/10 hover:text-primary"}`,
                                onClick: () => {
                                  (t(!1), n(!1));
                                },
                                children: c.jsxs(Be, {
                                  to: g.href,
                                  className: "flex items-center space-x-2",
                                  children: [
                                    c.jsx(m, { className: "w-4 h-4" }),
                                    c.jsx("span", { children: g.label }),
                                  ],
                                }),
                              },
                              g.href,
                            );
                          }),
                        }),
                      i
                        ? c.jsx(Z, {
                            variant: "outline",
                            size: "icon",
                            onClick: () => {
                              (l(), t(!1));
                            },
                            className:
                              "terminal-text border-destructive/50 hover:border-destructive hover:text-destructive",
                            children: c.jsx(Fp, { className: "w-4 h-4" }),
                          })
                        : c.jsx(Z, {
                            variant: "outline",
                            asChild: !0,
                            className:
                              "justify-start terminal-text border-primary/50 hover:border-primary hover:text-primary",
                            onClick: () => t(!1),
                            children: c.jsxs(Be, {
                              to: "/auth",
                              className: "flex items-center space-x-2",
                              children: [
                                c.jsx(_n, { className: "w-4 h-4" }),
                                c.jsx("span", { children: "Sign In" }),
                              ],
                            }),
                          }),
                    ],
                  }),
                }),
            ],
          }),
        }),
      ],
    });
  },
  uO = ({ children: e }) =>
    c.jsxs("div", {
      className: "min-h-screen bg-background relative overflow-x-hidden",
      children: [
        c.jsx("div", {
          className: "fixed inset-0 scan-lines pointer-events-none z-0",
        }),
        c.jsx(cO, {}),
        c.jsx("main", {
          className: "relative z-10 pt-16 md:pt-20",
          children: e,
        }),
        c.jsxs("div", {
          className: "fixed inset-0 pointer-events-none z-0",
          children: [
            c.jsx("div", {
              className:
                "absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl",
            }),
            c.jsx("div", {
              className:
                "absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl",
            }),
            c.jsx("div", {
              className:
                "absolute top-1/3 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-2xl",
            }),
          ],
        }),
      ],
    }),
  dO = () => {
    const [e, t] = p.useState(""),
      [r, n] = p.useState(!1),
      a = "ACCESSING REMNANTS DATABASE...";
    return (
      p.useEffect(() => {
        let s = 0;
        const o = setInterval(() => {
          s < a.length
            ? (t(a.slice(0, s + 1)), s++)
            : (clearInterval(o), setTimeout(() => n(!0), 500));
        }, 100);
        return () => clearInterval(o);
      }, []),
      c.jsxs("div", {
        className: "min-h-screen flex flex-col",
        children: [
          c.jsx("section", {
            className: "flex-1 flex items-center justify-center px-4 py-20",
            children: c.jsxs("div", {
              className: "max-w-4xl mx-auto text-center space-y-8",
              children: [
                c.jsxs("div", {
                  className:
                    "cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm",
                  children: [
                    c.jsxs("div", {
                      className:
                        "flex items-center justify-center space-x-2 mb-4",
                      children: [
                        c.jsx(Ky, {
                          className: "w-6 h-6 text-primary animate-flicker",
                        }),
                        c.jsx("span", {
                          className: "terminal-text text-primary text-sm",
                          children: "BARD_TERMINAL_v2.7.3",
                        }),
                      ],
                    }),
                    c.jsxs("div", {
                      className: "terminal-text text-left",
                      children: [
                        c.jsxs("div", {
                          className:
                            "text-terminal-green mb-2 w-[30ch] min-h-[1.25rem] whitespace-nowrap",
                          children: [
                            e,
                            c.jsx("span", {
                              className: "animate-flicker",
                              children: "|",
                            }),
                          ],
                        }),
                        r &&
                          c.jsx("div", {
                            className: "space-y-2 animate-fade-in",
                            children: c.jsx("div", {
                              className: "text-muted-foreground text-sm",
                              children:
                                "Welcome to the digital archives of Lord Tsarcasm",
                            }),
                          }),
                      ],
                    }),
                  ],
                }),
                c.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    c.jsx("h1", {
                      className:
                        "title-text text-4xl md:text-7xl font-black glow-text",
                      children: "LORD TSARCASM",
                    }),
                    c.jsx("div", {
                      className:
                        "text-xl md:text-2xl text-secondary-bright terminal-text",
                      children: "Chronicler of Far Haven",
                    }),
                    c.jsx("p", {
                      className:
                        "text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
                      children:
                        "In the ashes of the old world, stories survive. Music echoes through the ruins. Welcome to the digital grimoire of a post-apocalyptic bard.",
                    }),
                  ],
                }),
                r &&
                  c.jsxs("div", {
                    className:
                      "flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in",
                    children: [
                      c.jsx(Z, {
                        asChild: !0,
                        size: "lg",
                        className: `
                  bg-primary/20 hover:bg-primary/30 
                  text-primary border border-primary/50 
                  holo-hover terminal-text font-bold
                  px-8 py-3
                `,
                        children: c.jsxs(Be, {
                          to: "/music",
                          className: "flex items-center space-x-2",
                          children: [
                            c.jsx(jh, { className: "w-5 h-5" }),
                            c.jsx("span", { children: "Enter the Vault" }),
                          ],
                        }),
                      }),
                      c.jsx(Z, {
                        asChild: !0,
                        variant: "outline",
                        size: "lg",
                        className: `
                  border-secondary/50 text-secondary-bright 
                  hover:bg-secondary/10 hover:border-secondary
                  holo-hover terminal-text
                  px-8 py-3
                `,
                        children: c.jsxs(Be, {
                          to: "/about",
                          className: "flex items-center space-x-2",
                          children: [
                            c.jsx(Gy, { className: "w-5 h-5" }),
                            c.jsx("span", { children: "About the Bard" }),
                          ],
                        }),
                      }),
                    ],
                  }),
              ],
            }),
          }),
          c.jsx("section", {
            className:
              "py-8 border-t border-primary/20 bg-card/30 backdrop-blur-sm",
            children: c.jsx("div", {
              className: "container mx-auto px-4",
              children: c.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center",
                children: [
                  c.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      c.jsx(Be, {
                        to: "/aliens",
                        className:
                          "terminal-text text-primary text-lg font-bold hover:underline",
                        children: "ALIENS",
                      }),
                      c.jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: "Songs from the ruins",
                      }),
                    ],
                  }),
                  c.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      c.jsx(Be, {
                        to: "/core-rule-book",
                        className:
                          "terminal-text text-accent text-lg font-bold hover:underline",
                        children: "CORE RULE BOOK",
                      }),
                      c.jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: "Building tomorrow",
                      }),
                    ],
                  }),
                  c.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      c.jsx(Be, {
                        to: "/lore",
                        className:
                          "terminal-text text-secondary-bright text-lg font-bold hover:underline",
                        children: "REMNANTS LORE",
                      }),
                      c.jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: "Stories from the ashes",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          c.jsx("div", {
            className: "flex justify-center pb-8",
            children: c.jsx(Ss, {
              className: "w-6 h-6 text-primary animate-bounce",
            }),
          }),
        ],
      })
    );
  },
  At = p.forwardRef(({ className: e, ...t }, r) =>
    c.jsx("div", {
      ref: r,
      className: ee(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        e,
      ),
      ...t,
    }),
  );
At.displayName = "Card";
const Mt = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("div", {
    ref: r,
    className: ee("flex flex-col space-y-1.5 p-6", e),
    ...t,
  }),
);
Mt.displayName = "CardHeader";
const It = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("h3", {
    ref: r,
    className: ee("text-2xl font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
It.displayName = "CardTitle";
const hO = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("p", {
    ref: r,
    className: ee("text-sm text-muted-foreground", e),
    ...t,
  }),
);
hO.displayName = "CardDescription";
const Xt = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("div", { ref: r, className: ee("p-6 pt-0", e), ...t }),
);
Xt.displayName = "CardContent";
const fO = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("div", {
    ref: r,
    className: ee("flex items-center p-6 pt-0", e),
    ...t,
  }),
);
fO.displayName = "CardFooter";
const pO = xo(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
function Cn({ className: e, variant: t, ...r }) {
  return c.jsx("div", { className: ee(pO({ variant: t }), e), ...r });
}
const mO = () => {
    const [e, t] = p.useState([]);
    return (
      p.useEffect(() => {
        fetch("/json/songCatalog.json")
          .then((r) => r.json())
          .then(t)
          .catch((r) => console.error("Failed to load song catalog", r));
      }, []),
      e.length === 0
        ? null
        : c.jsxs("div", {
            className: "space-y-6",
            children: [
              c.jsx("h2", {
                className: "terminal-text text-2xl text-accent font-bold",
                children: "SONG CATALOG",
              }),
              c.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: e.map((r) =>
                  c.jsxs(
                    At,
                    {
                      className: "cyber-border bg-card/50 backdrop-blur-sm",
                      children: [
                        c.jsx(Mt, {
                          children: c.jsx(It, {
                            className: "terminal-text text-lg glow-text",
                            children: r.song_title,
                          }),
                        }),
                        c.jsxs(Xt, {
                          className: "flex flex-wrap gap-2",
                          children: [
                            r.spotify_url &&
                              c.jsx(Z, {
                                variant: "outline",
                                size: "sm",
                                asChild: !0,
                                className:
                                  "terminal-text text-xs hover:border-primary/50 hover:text-primary",
                                children: c.jsxs("a", {
                                  href: r.spotify_url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  children: [
                                    c.jsx(Ds, { className: "w-3 h-3 mr-1" }),
                                    "Spotify",
                                  ],
                                }),
                              }),
                            r.youtube_url &&
                              c.jsx(Z, {
                                variant: "outline",
                                size: "sm",
                                asChild: !0,
                                className:
                                  "terminal-text text-xs hover:border-primary/50 hover:text-primary",
                                children: c.jsxs("a", {
                                  href: r.youtube_url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  children: [
                                    c.jsx(Ds, { className: "w-3 h-3 mr-1" }),
                                    "YouTube",
                                  ],
                                }),
                              }),
                            r.apple_url &&
                              c.jsx(Z, {
                                variant: "outline",
                                size: "sm",
                                asChild: !0,
                                className:
                                  "terminal-text text-xs hover:border-primary/50 hover:text-primary",
                                children: c.jsxs("a", {
                                  href: r.apple_url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  children: [
                                    c.jsx(Ds, { className: "w-3 h-3 mr-1" }),
                                    "Apple",
                                  ],
                                }),
                              }),
                          ],
                        }),
                      ],
                    },
                    r.song_title,
                  ),
                ),
              }),
            ],
          })
    );
  },
  Jc = [
    {
      id: "1",
      title: "Last Signal from Far Haven",
      album: "Remnants of Destruction",
      year: 2024,
      duration: "4:32",
      lore: "Recorded the night the Shal'Rah invaded Far Haven. This was the final transmission before the communication arrays went dark.",
      tags: ["Melancholic", "Far Haven", "Shal'Rah", "Electronic"],
      waveform: "████▄▄▄███▄▄▄████████▄▄▄███",
      streams: { spotify: "#", youtube: "#", bandcamp: "#" },
    },
    {
      id: "2",
      title: "Echoes in the Undercity",
      album: "Tales from Below",
      year: 2023,
      duration: "3:47",
      lore: "Written while exploring the abandoned metro tunnels beneath New Carthage. The acoustics down there... haunting.",
      tags: ["Dark", "Underground", "Ambient", "New Carthage"],
      waveform: "▄▄▄████▄▄▄███████▄▄▄████▄▄▄█",
      streams: { spotify: "#", apple: "#", youtube: "#" },
    },
    {
      id: "3",
      title: "H.I.V.E. Anthem",
      album: "Faction Wars",
      year: 2024,
      duration: "5:12",
      lore: "A rallying cry for the Human Intelligence Verification Enclave. Born from late nights coding in bunker networks.",
      tags: ["Energetic", "H.I.V.E.", "Cyber", "Resistance"],
      waveform: "████████▄▄▄█████████▄▄▄█████",
      streams: { spotify: "#", bandcamp: "#" },
    },
  ],
  gO = () => {
    const [e, t] = p.useState(null),
      [r, n] = p.useState([]),
      a = Array.from(new Set(Jc.flatMap((l) => l.tags))),
      s =
        r.length > 0
          ? Jc.filter((l) => r.every((u) => l.tags.includes(u)))
          : Jc,
      o = (l) => {
        n((u) => (u.includes(l) ? u.filter((d) => d !== l) : [...u, l]));
      },
      i = (l) => {
        t(e === l ? null : l);
      };
    return c.jsxs("div", {
      className: "container mx-auto px-4 py-8 space-y-8",
      children: [
        c.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            c.jsx("h1", {
              className: "title-text text-4xl md:text-6xl font-black glow-text",
              children: "MUSIC VAULT",
            }),
            c.jsx("p", {
              className: "text-xl text-muted-foreground max-w-2xl mx-auto",
              children:
                "Chronicles from the wasteland, transmitted through sound waves and digital echoes",
            }),
          ],
        }),
        c.jsx("div", {
          className: "cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm",
          children: c.jsxs("div", {
            className: "space-y-3",
            children: [
              c.jsx("h3", {
                className: "terminal-text text-primary font-bold",
                children: "Filter by Tags",
              }),
              c.jsx("div", {
                className: "flex flex-wrap gap-2",
                children: a.map((l) =>
                  c.jsx(
                    Z,
                    {
                      variant: r.includes(l) ? "default" : "outline",
                      size: "sm",
                      onClick: () => o(l),
                      className: `
                  terminal-text text-xs
                  ${r.includes(l) ? "bg-primary/20 text-primary border-primary/50" : "border-muted hover:border-primary/50 hover:text-primary"}
                `,
                      children: l,
                    },
                    l,
                  ),
                ),
              }),
            ],
          }),
        }),
        c.jsx("div", {
          className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
          children: s.map((l) =>
            c.jsxs(
              At,
              {
                className:
                  "holo-hover cyber-border bg-card/50 backdrop-blur-sm overflow-hidden",
                children: [
                  c.jsx(Mt, {
                    className: "pb-4",
                    children: c.jsxs("div", {
                      className: "flex items-start justify-between",
                      children: [
                        c.jsxs("div", {
                          className: "space-y-1",
                          children: [
                            c.jsx(It, {
                              className: "terminal-text text-xl glow-text",
                              children: l.title,
                            }),
                            c.jsxs("div", {
                              className:
                                "text-muted-foreground terminal-text text-sm",
                              children: [l.album, " • ", l.year],
                            }),
                          ],
                        }),
                        c.jsx(Cn, {
                          variant: "outline",
                          className: "terminal-text text-xs border-primary/50",
                          children: l.duration,
                        }),
                      ],
                    }),
                  }),
                  c.jsxs(Xt, {
                    className:
                      "space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6",
                    children: [
                      c.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          c.jsxs("div", {
                            className:
                              "bg-background/50 p-4 rounded border border-primary/20",
                            children: [
                              c.jsxs("div", {
                                className:
                                  "flex items-center justify-between mb-2",
                                children: [
                                  c.jsx(Z, {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: () => i(l.id),
                                    className:
                                      "text-primary hover:bg-primary/10",
                                    children:
                                      e === l.id
                                        ? c.jsx(u_, { className: "w-4 h-4" })
                                        : c.jsx(Eh, { className: "w-4 h-4" }),
                                  }),
                                  c.jsxs("div", {
                                    className: "flex space-x-2",
                                    children: [
                                      c.jsx(Z, {
                                        variant: "ghost",
                                        size: "sm",
                                        className:
                                          "text-muted-foreground hover:text-primary",
                                        children: c.jsx(i_, {
                                          className: "w-4 h-4",
                                        }),
                                      }),
                                      c.jsx(Z, {
                                        variant: "ghost",
                                        size: "sm",
                                        className:
                                          "text-muted-foreground hover:text-primary",
                                        children: c.jsx(f_, {
                                          className: "w-4 h-4",
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              c.jsx("div", {
                                className:
                                  "terminal-text text-primary text-lg font-mono tracking-wider",
                                children: l.waveform,
                              }),
                            ],
                          }),
                          c.jsx("div", {
                            className: "flex flex-wrap gap-1",
                            children: l.tags.map((u) =>
                              c.jsx(
                                Cn,
                                {
                                  variant: "secondary",
                                  className: "text-xs terminal-text",
                                  children: u,
                                },
                                u,
                              ),
                            ),
                          }),
                        ],
                      }),
                      c.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          c.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              c.jsx("h4", {
                                className:
                                  "terminal-text text-sm text-accent font-bold",
                                children: "TRANSMISSION LOG:",
                              }),
                              c.jsx("p", {
                                className:
                                  "text-muted-foreground text-sm leading-relaxed",
                                children: l.lore,
                              }),
                            ],
                          }),
                          c.jsxs("div", {
                            className:
                              "flex flex-wrap gap-2 pt-2 border-t border-primary/20",
                            children: [
                              Object.entries(l.streams).map(([u, d]) =>
                                c.jsx(
                                  Z,
                                  {
                                    variant: "outline",
                                    size: "sm",
                                    asChild: !0,
                                    className:
                                      "terminal-text text-xs hover:border-primary/50 hover:text-primary",
                                    children: c.jsxs("a", {
                                      href: d,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                      children: [
                                        c.jsx(Ds, {
                                          className: "w-3 h-3 mr-1",
                                        }),
                                        u,
                                      ],
                                    }),
                                  },
                                  u,
                                ),
                              ),
                              c.jsxs(Z, {
                                variant: "outline",
                                size: "sm",
                                className:
                                  "terminal-text text-xs hover:border-secondary/50 hover:text-secondary-bright",
                                children: [
                                  c.jsx(n_, { className: "w-3 h-3 mr-1" }),
                                  "Download",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              },
              l.id,
            ),
          ),
        }),
        c.jsx(mO, {}),
        s.length === 0 &&
          c.jsxs("div", {
            className: "text-center py-12",
            children: [
              c.jsx("div", {
                className: "terminal-text text-muted-foreground",
                children: "No transmissions found matching your filters...",
              }),
              c.jsx(Z, {
                onClick: () => n([]),
                variant: "outline",
                className: "mt-4 terminal-text",
                children: "Clear Filters",
              }),
            ],
          }),
      ],
    });
  };
class vO {
  constructor(t) {
    (Vn(this, "el"),
      Vn(this, "chars", "!<>-_/[]{}—=+*^?#________"),
      Vn(this, "queue", []),
      Vn(this, "frame", 0),
      Vn(this, "frameRequest", 0),
      Vn(this, "resolve"),
      (this.el = t),
      (this.update = this.update.bind(this)));
  }
  setText(t) {
    const r = this.el.innerText,
      n = Math.max(r.length, t.length);
    this.queue = [];
    for (let s = 0; s < n; s++) {
      const o = r[s] || "",
        i = t[s] || "",
        l = Math.floor(Math.random() * 20),
        u = l + Math.floor(Math.random() * 20);
      this.queue.push({ from: o, to: i, start: l, end: u });
    }
    (cancelAnimationFrame(this.frameRequest), (this.frame = 0));
    const a = new Promise((s) => (this.resolve = s));
    return (this.update(), a);
  }
  update() {
    var t;
    let r = "",
      n = 0;
    for (const a of this.queue) {
      const { from: s, to: o, start: i, end: l } = a;
      let u = a.char;
      this.frame >= l
        ? (n++, (r += o))
        : this.frame >= i
          ? ((!u || Math.random() < 0.28) &&
              ((u = this.randomChar()), (a.char = u)),
            (r += `<span class="dud">${u}</span>`))
          : (r += s);
    }
    ((this.el.innerHTML = r),
      n === this.queue.length
        ? (t = this.resolve) == null || t.call(this)
        : ((this.frameRequest = requestAnimationFrame(this.update)),
          this.frame++));
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
const yO = (e, t, r = 30) => {
    let n = 0;
    const a = () => {
      if (n <= t.length)
        ((e.textContent = t.slice(0, n)), n++, setTimeout(a, r));
      else {
        const s = document.createElement("span");
        ((s.className = "cursor"), (s.textContent = " "), e.appendChild(s));
      }
    };
    a();
  },
  bO = () => {
    const e = p.useRef(null),
      t = p.useRef(null),
      [r, n] = p.useState(!1),
      [a, s] = p.useState(0),
      o =
        "I make stuff because I have to — songs, stories, games, whatever helps me make sense of things. Writing helps me sort the noise, singing reminds me I’m still here, and building worlds is how I stay connected when real life feels too far away. I'm constantly stuck somewhere between fixing myself and falling apart again. If you’re reading this, you probably get it. Stick around if you want — there’s room here for all the in-between.";
    return (
      p.useEffect(() => {
        (async () => {
          if (!e.current) return;
          const l = new vO(e.current);
          (await l.setText("SUBJECT: LORD TSARCASM"),
            await new Promise((u) => setTimeout(u, 600)),
            await l.setText("STATUS: DECRYPTING..."),
            await new Promise((u) => setTimeout(u, 600)),
            await l.setText("ACCESS LEVEL: CLASSIFIED"),
            await new Promise((u) => setTimeout(u, 1e3)),
            e.current.classList.add("fade-out"),
            await new Promise((u) => setTimeout(u, 1e3)),
            n(!0));
        })();
      }, []),
      p.useEffect(() => {
        r &&
          (setTimeout(() => s(1), 300),
          setTimeout(() => s(2), 800),
          setTimeout(() => s(3), 1300),
          setTimeout(() => {
            (s(4), t.current && yO(t.current, o));
          }, 1800),
          setTimeout(() => s(5), 2400),
          setTimeout(() => s(6), 3e3),
          setTimeout(() => s(7), 3600));
      }, [r]),
      c.jsxs("div", {
        className: "relative mx-auto max-w-3xl px-4 pt-8",
        children: [
          c.jsx("div", { id: "datastream", ref: e }),
          !r && c.jsx("div", { className: "progress-bar" }),
          r &&
            c.jsxs("div", {
              className: `dossier-container ${r ? "visible" : ""} space-y-6`,
              children: [
                c.jsx("h2", {
                  className: "title-text glow-text text-center mb-4",
                  children: "CLASSIFIED DOSSIER",
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 1 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-primary mb-2",
                      children: "IDENTITY ASSESSMENT",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children: "PRIMARY ALIAS: LORD TSARCASM",
                    }),
                    c.jsxs("div", {
                      className: "dossier-item",
                      children: [
                        "LEGAL NAME: ",
                        c.jsx("span", {
                          className: "redacted",
                          children: "[REDACTED]",
                        }),
                      ],
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "PSYCH PROFILE: INFJ (The Architect / The Agitator). A high-empathy core shielded by an analytical, critical shell. Prone to existential spirals and sudden bursts of creation.",
                    }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 2 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-accent mb-2",
                      children: "OPERATIONAL DIRECTIVES",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "PRIMARY FUNCTION: Narrative Weaver. Building worlds from code, chaos, and caffeine.",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "SECONDARY FUNCTION: Sonic Alchemist. Transmuting noise into anthems for the digital ghost.",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "TERTIARY FUNCTION: Community Conduit. Forging connections in the static between worlds.",
                    }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 3 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-secondary-bright mb-2",
                      children: "CORE MATRIX (INFLUENCES)",
                    }),
                    c.jsx("div", {
                      className: "dossier-item font-semibold",
                      children: "SONIC IMPRINTS",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Heavy Metal",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Industrial",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Cinematic Scores",
                    }),
                    c.jsx("div", {
                      className: "dossier-item font-semibold mt-2",
                      children: "LITERARY/VISUAL SCHEMA",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Dark Fantasy & Cyberpunk",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Dystopian Cinema",
                    }),
                    c.jsx("div", {
                      className: "dossier-item pl-4",
                      children: "- Anime (e.g., Naruto)",
                    }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section typewriter ${a >= 4 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-primary mb-2",
                      children: "PERSONAL LOG",
                    }),
                    c.jsx("div", { ref: t }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 5 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-secondary mb-2",
                      children: "ORIGIN STORY",
                    }),
                    c.jsx("p", {
                      className: "dossier-item whitespace-pre-line",
                      children: `In the digital ruins of the old world, where servers hum with forgotten algorithms and data streams carry the echoes of lost civilizations, Lord Tsarcasm emerged—a digital bard wielding code as his weapon and music as his spell.

Born from the intersection of creativity and technology, he chronicles the tales of tomorrow through soundscapes of synthetic rebellion and melodies that remember what we've lost. His domain spans the vast networks of the Remnants universe, where factions clash and stories unfold in the shadow of fallen megacorporations.

From the deep tunnels of New Carthage to the floating cities of the H.I.V.E., his music travels through quantum networks and analog radios alike, bringing hope to settlements and haunting the nightmares of those who would rebuild the mistakes of the past.`,
                    }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 6 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-secondary mb-2",
                      children: "STATUS & ANOMALIES",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "Current State: Stable, but fluctuating between focused output and system introspection.",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "Known Anomaly: 'Resting Bitch Face' (RBF) protocol is a passive default. Not indicative of internal state.",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "Central Paradox: Seeks deep connection while requiring operational solitude. A walking, talking contradiction.",
                    }),
                  ],
                }),
                c.jsxs("section", {
                  className: `dossier-section ${a >= 7 ? "visible" : ""}`,
                  children: [
                    c.jsx("h3", {
                      className: "terminal-text text-accent mb-2",
                      children: "SUPPORT",
                    }),
                    c.jsx("div", {
                      className: "dossier-item",
                      children:
                        "Contribution: Your support helps fuel the creative engine. Find contribution options on the main Support tab.",
                    }),
                    c.jsxs("div", {
                      className: "flex gap-4 mt-2",
                      children: [
                        c.jsx(Z, {
                          asChild: !0,
                          variant: "secondary",
                          children: c.jsx("a", {
                            href: "https://www.paypal.com/ncp/payment/4ZHFHWD5AA5F2",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "Donate with PayPal",
                          }),
                        }),
                        c.jsx(Z, {
                          asChild: !0,
                          variant: "secondary",
                          children: c.jsx("a", {
                            href: "https://venmo.com/u/Anton-Vasilyev-1",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "Donate with Venmo",
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
        ],
      })
    );
  };
var cf = "Dialog",
  [Ow, u4] = qa(cf),
  [wO, Bt] = Ow(cf),
  Aw = (e) => {
    const {
        __scopeDialog: t,
        children: r,
        open: n,
        defaultOpen: a,
        onOpenChange: s,
        modal: o = !0,
      } = e,
      i = p.useRef(null),
      l = p.useRef(null),
      [u = !1, d] = wo({ prop: n, defaultProp: a, onChange: s });
    return c.jsx(wO, {
      scope: t,
      triggerRef: i,
      contentRef: l,
      contentId: Nn(),
      titleId: Nn(),
      descriptionId: Nn(),
      open: u,
      onOpenChange: d,
      onOpenToggle: p.useCallback(() => d((h) => !h), [d]),
      modal: o,
      children: r,
    });
  };
Aw.displayName = cf;
var Mw = "DialogTrigger",
  xO = p.forwardRef((e, t) => {
    const { __scopeDialog: r, ...n } = e,
      a = Bt(Mw, r),
      s = Se(t, a.triggerRef);
    return c.jsx(ae.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": a.open,
      "aria-controls": a.contentId,
      "data-state": hf(a.open),
      ...n,
      ref: s,
      onClick: F(e.onClick, a.onOpenToggle),
    });
  });
xO.displayName = Mw;
var uf = "DialogPortal",
  [kO, Iw] = Ow(uf, { forceMount: void 0 }),
  Dw = (e) => {
    const { __scopeDialog: t, forceMount: r, children: n, container: a } = e,
      s = Bt(uf, t);
    return c.jsx(kO, {
      scope: t,
      forceMount: r,
      children: p.Children.map(n, (o) =>
        c.jsx(Ut, {
          present: r || s.open,
          children: c.jsx(jl, { asChild: !0, container: a, children: o }),
        }),
      ),
    });
  };
Dw.displayName = uf;
var il = "DialogOverlay",
  Lw = p.forwardRef((e, t) => {
    const r = Iw(il, e.__scopeDialog),
      { forceMount: n = r.forceMount, ...a } = e,
      s = Bt(il, e.__scopeDialog);
    return s.modal
      ? c.jsx(Ut, {
          present: n || s.open,
          children: c.jsx(SO, { ...a, ref: t }),
        })
      : null;
  });
Lw.displayName = il;
var SO = p.forwardRef((e, t) => {
    const { __scopeDialog: r, ...n } = e,
      a = Bt(il, r);
    return c.jsx(Zh, {
      as: Mn,
      allowPinchZoom: !0,
      shards: [a.contentRef],
      children: c.jsx(ae.div, {
        "data-state": hf(a.open),
        ...n,
        ref: t,
        style: { pointerEvents: "auto", ...n.style },
      }),
    });
  }),
  Dn = "DialogContent",
  $w = p.forwardRef((e, t) => {
    const r = Iw(Dn, e.__scopeDialog),
      { forceMount: n = r.forceMount, ...a } = e,
      s = Bt(Dn, e.__scopeDialog);
    return c.jsx(Ut, {
      present: n || s.open,
      children: s.modal
        ? c.jsx(_O, { ...a, ref: t })
        : c.jsx(jO, { ...a, ref: t }),
    });
  });
$w.displayName = Dn;
var _O = p.forwardRef((e, t) => {
    const r = Bt(Dn, e.__scopeDialog),
      n = p.useRef(null),
      a = Se(t, r.contentRef, n);
    return (
      p.useEffect(() => {
        const s = n.current;
        if (s) return R0(s);
      }, []),
      c.jsx(Fw, {
        ...e,
        ref: a,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: F(e.onCloseAutoFocus, (s) => {
          var o;
          (s.preventDefault(), (o = r.triggerRef.current) == null || o.focus());
        }),
        onPointerDownOutside: F(e.onPointerDownOutside, (s) => {
          const o = s.detail.originalEvent,
            i = o.button === 0 && o.ctrlKey === !0;
          (o.button === 2 || i) && s.preventDefault();
        }),
        onFocusOutside: F(e.onFocusOutside, (s) => s.preventDefault()),
      })
    );
  }),
  jO = p.forwardRef((e, t) => {
    const r = Bt(Dn, e.__scopeDialog),
      n = p.useRef(!1),
      a = p.useRef(!1);
    return c.jsx(Fw, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (s) => {
        var o, i;
        ((o = e.onCloseAutoFocus) == null || o.call(e, s),
          s.defaultPrevented ||
            (n.current || (i = r.triggerRef.current) == null || i.focus(),
            s.preventDefault()),
          (n.current = !1),
          (a.current = !1));
      },
      onInteractOutside: (s) => {
        var o, i;
        ((o = e.onInteractOutside) == null || o.call(e, s),
          s.defaultPrevented ||
            ((n.current = !0),
            s.detail.originalEvent.type === "pointerdown" && (a.current = !0)));
        const l = s.target;
        ((i = r.triggerRef.current) != null &&
          i.contains(l) &&
          s.preventDefault(),
          s.detail.originalEvent.type === "focusin" &&
            a.current &&
            s.preventDefault());
      },
    });
  }),
  Fw = p.forwardRef((e, t) => {
    const {
        __scopeDialog: r,
        trapFocus: n,
        onOpenAutoFocus: a,
        onCloseAutoFocus: s,
        ...o
      } = e,
      i = Bt(Dn, r),
      l = p.useRef(null),
      u = Se(t, l);
    return (
      x0(),
      c.jsxs(c.Fragment, {
        children: [
          c.jsx(Xh, {
            asChild: !0,
            loop: !0,
            trapped: n,
            onMountAutoFocus: a,
            onUnmountAutoFocus: s,
            children: c.jsx(bo, {
              role: "dialog",
              id: i.contentId,
              "aria-describedby": i.descriptionId,
              "aria-labelledby": i.titleId,
              "data-state": hf(i.open),
              ...o,
              ref: u,
              onDismiss: () => i.onOpenChange(!1),
            }),
          }),
          c.jsxs(c.Fragment, {
            children: [
              c.jsx(EO, { titleId: i.titleId }),
              c.jsx(CO, { contentRef: l, descriptionId: i.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  df = "DialogTitle",
  zw = p.forwardRef((e, t) => {
    const { __scopeDialog: r, ...n } = e,
      a = Bt(df, r);
    return c.jsx(ae.h2, { id: a.titleId, ...n, ref: t });
  });
zw.displayName = df;
var Uw = "DialogDescription",
  Bw = p.forwardRef((e, t) => {
    const { __scopeDialog: r, ...n } = e,
      a = Bt(Uw, r);
    return c.jsx(ae.p, { id: a.descriptionId, ...n, ref: t });
  });
Bw.displayName = Uw;
var Ww = "DialogClose",
  qw = p.forwardRef((e, t) => {
    const { __scopeDialog: r, ...n } = e,
      a = Bt(Ww, r);
    return c.jsx(ae.button, {
      type: "button",
      ...n,
      ref: t,
      onClick: F(e.onClick, () => a.onOpenChange(!1)),
    });
  });
qw.displayName = Ww;
function hf(e) {
  return e ? "open" : "closed";
}
var Hw = "DialogTitleWarning",
  [d4, Vw] = hS(Hw, { contentName: Dn, titleName: df, docsSlug: "dialog" }),
  EO = ({ titleId: e }) => {
    const t = Vw(Hw),
      r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
    return (
      p.useEffect(() => {
        e && (document.getElementById(e) || console.error(r));
      }, [r, e]),
      null
    );
  },
  NO = "DialogDescriptionWarning",
  CO = ({ contentRef: e, descriptionId: t }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Vw(NO).contentName}}.`;
    return (
      p.useEffect(() => {
        var n;
        const a =
          (n = e.current) == null ? void 0 : n.getAttribute("aria-describedby");
        t && a && (document.getElementById(t) || console.warn(r));
      }, [r, e, t]),
      null
    );
  },
  TO = Aw,
  PO = Dw,
  Kw = Lw,
  Gw = $w,
  Qw = zw,
  Jw = Bw,
  RO = qw;
const Yw = TO,
  OO = PO,
  Xw = p.forwardRef(({ className: e, ...t }, r) =>
    c.jsx(Kw, {
      ref: r,
      className: ee(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        e,
      ),
      ...t,
    }),
  );
Xw.displayName = Kw.displayName;
const ff = p.forwardRef(({ className: e, children: t, ...r }, n) =>
  c.jsxs(OO, {
    children: [
      c.jsx(Xw, {}),
      c.jsxs(Gw, {
        ref: n,
        className: ee(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          e,
        ),
        ...r,
        children: [
          t,
          c.jsxs(RO, {
            className:
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            children: [
              c.jsx(Nh, { className: "h-4 w-4" }),
              c.jsx("span", { className: "sr-only", children: "Close" }),
            ],
          }),
        ],
      }),
    ],
  }),
);
ff.displayName = Gw.displayName;
const pf = ({ className: e, ...t }) =>
  c.jsx("div", {
    className: ee("flex flex-col space-y-1.5 text-center sm:text-left", e),
    ...t,
  });
pf.displayName = "DialogHeader";
const mf = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(Qw, {
    ref: r,
    className: ee("text-lg font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
mf.displayName = Qw.displayName;
const Zw = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(Jw, {
    ref: r,
    className: ee("text-sm text-muted-foreground", e),
    ...t,
  }),
);
Zw.displayName = Jw.displayName;
const Yc = [
    {
      id: "remnants",
      title: "Remnants of Destruction",
      description:
        "A comprehensive post-apocalyptic universe spanning games, music, and interactive fiction.",
      longDescription:
        "The flagship worldbuilding project that encompasses the entire Lord Tsarcasm mythos. A living, breathing universe where every song, story, and game connects to form an epic narrative of survival, rebellion, and rebirth.",
      category: "Worldbuilding",
      tags: ["Lore", "Interactive", "Cross-Media", "Community"],
      status: "Active",
      links: { demo: "#", external: "#" },
      featured: !0,
    },
    {
      id: "far-haven-map",
      title: "3D Overworld",
      description:
        "Explore the ruined megacity through an interactive, lore-rich digital map.",
      longDescription:
        "Navigate the districts of Far Haven, from the gleaming Corporate Spires to the shadowy Undercity. Each location contains hidden stories, faction territories, and secrets waiting to be discovered.",
      category: "Web",
      tags: ["React", "WebGL", "Interactive", "Lore"],
      status: "Beta",
      links: { demo: "#", github: "#" },
      featured: !0,
    },
  ],
  ex = {
    Game: s_,
    Music: jh,
    AI: XS,
    Worldbuilding: Hy,
    Web: o_,
    Experiment: Eh,
  },
  tx = {
    Active: "text-primary border-primary/50",
    Beta: "text-accent border-accent/50",
    Completed: "text-secondary-bright border-secondary/50",
    Concept: "text-muted-foreground border-muted/50",
  },
  AO = () => {
    const [e, t] = p.useState("All"),
      [r, n] = p.useState(null),
      a = ["All", ...Array.from(new Set(Yc.map((i) => i.category)))],
      s = e === "All" ? Yc : Yc.filter((i) => i.category === e),
      o = s.filter((i) => i.featured);
    return c.jsxs("div", {
      className: "container mx-auto px-4 py-8 space-y-8",
      children: [
        c.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            c.jsx("h1", {
              className: "title-text text-4xl md:text-6xl font-black glow-text",
              children: "PROJECTS",
            }),
            c.jsx("p", {
              className: "text-xl text-muted-foreground max-w-2xl mx-auto",
              children: "Building the future from the fragments of tomorrow",
            }),
          ],
        }),
        c.jsx("div", {
          className: "cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm",
          children: c.jsxs("div", {
            className: "space-y-3",
            children: [
              c.jsx("h3", {
                className: "terminal-text text-primary font-bold",
                children: "Project Categories",
              }),
              c.jsx("div", {
                className: "flex flex-wrap gap-2",
                children: a.map((i) =>
                  c.jsx(
                    Z,
                    {
                      variant: e === i ? "default" : "outline",
                      size: "sm",
                      onClick: () => t(i),
                      className: `
                  terminal-text text-xs
                  ${e === i ? "bg-primary/20 text-primary border-primary/50" : "border-muted hover:border-primary/50 hover:text-primary"}
                `,
                      children: i,
                    },
                    i,
                  ),
                ),
              }),
            ],
          }),
        }),
        o.length > 0 &&
          c.jsxs("div", {
            className: "space-y-6",
            children: [
              c.jsx("h2", {
                className: "terminal-text text-2xl text-accent font-bold",
                children: "FEATURED PROJECTS",
              }),
              c.jsx("div", {
                className: "grid lg:grid-cols-2 xl:grid-cols-3 gap-6",
                children: o.map((i) =>
                  c.jsx(
                    MO,
                    { project: i, featured: !0, onClick: () => n(i) },
                    i.id,
                  ),
                ),
              }),
            ],
          }),
        s.length === 0 &&
          c.jsxs("div", {
            className: "text-center py-12",
            children: [
              c.jsx("div", {
                className: "terminal-text text-muted-foreground text-lg",
                children: "No projects found in this category...",
              }),
              c.jsx(Z, {
                onClick: () => t("All"),
                variant: "outline",
                className: "mt-4 terminal-text",
                children: "View All Projects",
              }),
            ],
          }),
        r &&
          c.jsx(Yw, {
            open: !!r,
            onOpenChange: (i) => {
              i || n(null);
            },
            children: c.jsx(ff, {
              className: "max-w-xl",
              children: c.jsx(IO, { project: r }),
            }),
          }),
      ],
    });
  },
  MO = ({ project: e, featured: t, onClick: r }) => {
    const n = ex[e.category];
    return c.jsxs(At, {
      onClick: r,
      className: `
      holo-hover cyber-border bg-card/50 backdrop-blur-sm overflow-hidden h-full flex flex-col cursor-pointer
      ${t ? "border-accent/50" : "border-primary/20"}
    `,
      children: [
        c.jsxs(Mt, {
          className: "pb-4",
          children: [
            c.jsxs("div", {
              className: "flex items-start justify-between",
              children: [
                c.jsxs("div", {
                  className: "flex items-center space-x-2",
                  children: [
                    c.jsx(n, { className: "w-5 h-5 text-accent" }),
                    c.jsx(Cn, {
                      variant: "outline",
                      className: `terminal-text text-xs ${tx[e.status]}`,
                      children: e.status,
                    }),
                  ],
                }),
                t &&
                  c.jsx(Cn, {
                    className:
                      "terminal-text text-xs bg-accent/20 text-accent border-accent/50",
                    children: "FEATURED",
                  }),
              ],
            }),
            c.jsx(It, {
              className: "terminal-text text-lg glow-text",
              children: e.title,
            }),
            c.jsx("p", {
              className: "text-muted-foreground text-sm leading-relaxed",
              children: e.description,
            }),
          ],
        }),
        c.jsxs(Xt, {
          className: "flex-1 flex flex-col space-y-4",
          children: [
            c.jsx("div", {
              className: "flex flex-wrap gap-1",
              children: e.tags.map((a) =>
                c.jsx(
                  Cn,
                  {
                    variant: "secondary",
                    className: "text-xs terminal-text",
                    children: a,
                  },
                  a,
                ),
              ),
            }),
            c.jsx("div", {
              className: "text-muted-foreground text-sm leading-relaxed flex-1",
              children: e.longDescription,
            }),
            c.jsx("div", {
              className: "flex flex-wrap gap-2 pt-4 border-t border-primary/20",
              children:
                e.links.github &&
                c.jsx(Z, {
                  variant: "outline",
                  size: "sm",
                  asChild: !0,
                  className:
                    "terminal-text text-xs hover:border-accent/50 hover:text-accent",
                  onClick: (a) => a.stopPropagation(),
                  children: c.jsxs("a", {
                    href: e.links.github,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: [
                      c.jsx(Vy, { className: "w-3 h-3 mr-1" }),
                      "Code",
                    ],
                  }),
                }),
            }),
          ],
        }),
      ],
    });
  },
  IO = ({ project: e }) => {
    const t = ex[e.category];
    return c.jsxs("div", {
      className: "space-y-4",
      children: [
        c.jsxs(pf, {
          children: [
            c.jsx("div", {
              className: "flex items-start justify-between",
              children: c.jsxs("div", {
                className: "flex items-center space-x-2",
                children: [
                  c.jsx(t, { className: "w-5 h-5 text-accent" }),
                  c.jsx(Cn, {
                    variant: "outline",
                    className: `terminal-text text-xs ${tx[e.status]}`,
                    children: e.status,
                  }),
                ],
              }),
            }),
            c.jsx(mf, {
              className: "terminal-text text-lg glow-text",
              children: e.title,
            }),
            c.jsx(Zw, {
              className: "text-muted-foreground text-sm",
              children: e.description,
            }),
          ],
        }),
        c.jsx("div", {
          className: "flex flex-wrap gap-1",
          children: e.tags.map((r) =>
            c.jsx(
              Cn,
              {
                variant: "secondary",
                className: "text-xs terminal-text",
                children: r,
              },
              r,
            ),
          ),
        }),
        c.jsx("div", {
          className: "text-muted-foreground text-sm leading-relaxed",
          children: e.longDescription,
        }),
        c.jsxs("div", {
          className: "flex flex-wrap gap-2 pt-4 border-t border-primary/20",
          children: [
            e.links.demo &&
              c.jsx(Z, {
                variant: "outline",
                size: "sm",
                asChild: !0,
                className:
                  "terminal-text text-xs hover:border-primary/50 hover:text-primary",
                children: c.jsxs("a", {
                  href: e.links.demo,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [c.jsx(Eh, { className: "w-3 h-3 mr-1" }), "Demo"],
                }),
              }),
            e.links.github &&
              c.jsx(Z, {
                variant: "outline",
                size: "sm",
                asChild: !0,
                className:
                  "terminal-text text-xs hover:border-accent/50 hover:text-accent",
                children: c.jsxs("a", {
                  href: e.links.github,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [c.jsx(Vy, { className: "w-3 h-3 mr-1" }), "Code"],
                }),
              }),
            e.links.external &&
              c.jsx(Z, {
                variant: "outline",
                size: "sm",
                asChild: !0,
                className:
                  "terminal-text text-xs hover:border-secondary/50 hover:text-secondary-bright",
                children: c.jsxs("a", {
                  href: e.links.external,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [c.jsx(Ds, { className: "w-3 h-3 mr-1" }), "View"],
                }),
              }),
          ],
        }),
      ],
    });
  },
  DO = () => {
    const { user: e } = Jh();
    return c.jsxs("div", {
      className: "container mx-auto px-4 py-8 space-y-8",
      children: [
        c.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            c.jsx("h1", {
              className: "title-text text-4xl md:text-6xl font-black glow-text",
              children: "MEMBER VAULT",
            }),
            c.jsxs("p", {
              className: "text-xl text-secondary-bright terminal-text",
              children: [
                "Welcome, ",
                e.email,
                " • Access Granted • Inner Circle",
              ],
            }),
          ],
        }),
        c.jsxs(At, {
          className:
            "cyber-border bg-card/50 backdrop-blur-sm max-w-2xl mx-auto",
          children: [
            c.jsx(Mt, {
              children: c.jsxs("div", {
                className: "flex items-center justify-center space-x-2 mb-4",
                children: [
                  c.jsx(p_, {
                    className: "w-8 h-8 text-primary animate-glow-pulse",
                  }),
                  c.jsx(It, {
                    className: "terminal-text text-primary text-center",
                    children: "ACCESS GRANTED",
                  }),
                ],
              }),
            }),
            c.jsxs(Xt, {
              className: "space-y-6 text-center",
              children: [
                c.jsx("div", {
                  className: "text-muted-foreground leading-relaxed",
                  children: c.jsx("p", {
                    children:
                      "Welcome to the exclusive member vault! You now have access to early music previews and special member-only features.",
                  }),
                }),
                c.jsxs("div", {
                  className:
                    "p-4 bg-background/50 rounded border border-primary/20",
                  children: [
                    c.jsx("div", {
                      className: "terminal-text text-primary text-sm mb-2",
                      children: "ACCESS_STATUS.LOG",
                    }),
                    c.jsxs("div", {
                      className: "text-muted-foreground text-sm",
                      children: [
                        "Authentication status: ",
                        c.jsx("span", {
                          className: "text-primary",
                          children: "VERIFIED",
                        }),
                        c.jsx("br", {}),
                        "Access level: ",
                        c.jsx("span", {
                          className: "text-primary",
                          children: "MEMBER",
                        }),
                        c.jsx("br", {}),
                        "Vault permissions: ",
                        c.jsx("span", {
                          className: "text-primary",
                          children: "FULL_ACCESS",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        c.jsxs("div", {
          className: "space-y-6",
          children: [
            c.jsx("h2", {
              className:
                "terminal-text text-2xl text-accent font-bold text-center",
              children: "MEMBER VAULT PREVIEW",
            }),
            c.jsxs("div", {
              className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
              children: [
                c.jsxs(At, {
                  className: "cyber-border bg-card/50 backdrop-blur-sm",
                  children: [
                    c.jsx(Mt, {
                      children: c.jsxs(It, {
                        className:
                          "terminal-text text-primary flex items-center space-x-2",
                        children: [
                          c.jsx(m_, { className: "w-5 h-5" }),
                          c.jsx("span", { children: "Early Access" }),
                        ],
                      }),
                    }),
                    c.jsxs(Xt, {
                      className: "space-y-3",
                      children: [
                        c.jsxs("div", {
                          className: "text-muted-foreground text-sm",
                          children: [
                            "• Unreleased track previews",
                            c.jsx("br", {}),
                            "• Development builds",
                          ],
                        }),
                        c.jsx("div", {
                          className: "text-primary terminal-text text-xs",
                          children: "[ACTIVE]",
                        }),
                      ],
                    }),
                  ],
                }),
                c.jsxs(At, {
                  className: "cyber-border bg-card/50 backdrop-blur-sm",
                  children: [
                    c.jsx(Mt, {
                      children: c.jsxs(It, {
                        className:
                          "terminal-text text-accent flex items-center space-x-2",
                        children: [
                          c.jsx(r_, { className: "w-5 h-5" }),
                          c.jsx("span", { children: "Exclusive Archives" }),
                        ],
                      }),
                    }),
                    c.jsxs(Xt, {
                      className: "space-y-3",
                      children: [
                        c.jsxs("div", {
                          className: "text-muted-foreground text-sm",
                          children: [
                            "• Downloadable content packs",
                            c.jsx("br", {}),
                            "• High-quality audio files",
                            c.jsx("br", {}),
                            "• Concept art and assets",
                            c.jsx("br", {}),
                            "• Extended lore documents",
                          ],
                        }),
                        c.jsx("div", {
                          className: "text-accent terminal-text text-xs",
                          children: "[LOCKED]",
                        }),
                      ],
                    }),
                  ],
                }),
                c.jsxs(At, {
                  className: "cyber-border bg-card/50 backdrop-blur-sm",
                  children: [
                    c.jsx(Mt, {
                      children: c.jsxs(It, {
                        className:
                          "terminal-text text-secondary-bright flex items-center space-x-2",
                        children: [
                          c.jsx(y_, { className: "w-5 h-5" }),
                          c.jsx("span", { children: "Community" }),
                        ],
                      }),
                    }),
                    c.jsxs(Xt, {
                      className: "space-y-3",
                      children: [
                        c.jsxs("div", {
                          className: "text-muted-foreground text-sm",
                          children: [
                            "• Join the community on ",
                            c.jsx("a", {
                              href: "https://discord.gg/qUVrPpNUNv",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "underline",
                              children: "Discord",
                            }),
                            c.jsx("br", {}),
                            "• Direct feedback channels",
                            c.jsx("br", {}),
                            "• Collaborative projects",
                            c.jsx("br", {}),
                            "• Faction alignment system",
                          ],
                        }),
                        c.jsx("div", {
                          className:
                            "text-secondary-bright terminal-text text-xs",
                          children: "[CONNECTED]",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        c.jsxs(At, {
          className: "cyber-border bg-card/50 backdrop-blur-sm",
          children: [
            c.jsx(Mt, {
              children: c.jsxs(It, {
                className:
                  "terminal-text text-primary flex items-center space-x-2",
                children: [
                  c.jsx(Gy, { className: "w-5 h-5" }),
                  c.jsx("span", { children: "PLANNED FEATURES" }),
                ],
              }),
            }),
            c.jsxs(Xt, {
              className: "space-y-4",
              children: [
                c.jsxs("div", {
                  className: "grid md:grid-cols-2 gap-6",
                  children: [
                    c.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        c.jsx("h4", {
                          className: "terminal-text text-accent font-bold",
                          children: "AI INTERACTIONS",
                        }),
                        c.jsxs("ul", {
                          className: "space-y-1 text-sm text-muted-foreground",
                          children: [
                            c.jsx("li", {
                              children: "• Chat with Lord Tsarcasm AI",
                            }),
                            c.jsx("li", {
                              children: "• Faction leader conversations",
                            }),
                            c.jsx("li", {
                              children: "• Character-driven storylines",
                            }),
                            c.jsx("li", {
                              children: "• Personalized music recommendations",
                            }),
                          ],
                        }),
                      ],
                    }),
                    c.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        c.jsx("h4", {
                          className:
                            "terminal-text text-secondary-bright font-bold",
                          children: "GAMIFICATION",
                        }),
                        c.jsxs("ul", {
                          className: "space-y-1 text-sm text-muted-foreground",
                          children: [
                            c.jsx("li", {
                              children: "• Faction alignment rewards",
                            }),
                            c.jsx("li", {
                              children: "• Collectible digital assets",
                            }),
                            c.jsx("li", { children: "• Cross-game inventory" }),
                            c.jsx("li", { children: "• Achievement systems" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                c.jsxs("div", {
                  className:
                    "mt-6 p-4 bg-background/50 rounded border border-primary/20",
                  children: [
                    c.jsx("div", {
                      className: "terminal-text text-primary text-sm mb-2",
                      children: "DEVELOPMENT_NOTE.TXT",
                    }),
                    c.jsx("div", {
                      className: "text-muted-foreground text-sm",
                      children:
                        '"The member vault represents the next evolution of fan engagement—where exclusive content meets interactive experiences in the post-apocalyptic digital realm."',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  LO = [
    "anthromorph",
    "avianos",
    "behemoth",
    "chiropteran",
    "dengar",
    "kilrathi",
    "mutants",
    "shalrah_p",
    "t_ana_rhe",
    "tal_ehn",
    "talorian",
    "vyraxus",
    "xithrian",
  ],
  $O = () => {
    var e;
    const [t, r] = p.useState([]),
      [n, a] = p.useState(null),
      [s, o] = p.useState({});
    return (
      p.useEffect(() => {
        Promise.all([
          Promise.all(
            LO.map((i) =>
              fetch(`/json/Game/${i}.json`)
                .then((l) => l.json())
                .then((l) => ({ name: i, data: l })),
            ),
          ),
          fetch("/images.json").then((i) => i.json()),
        ])
          .then(([i, l]) => {
            r(i);
            const u = {};
            (l.forEach((d) => {
              const h = d.match(/aliens\/([^/]+)/);
              if (h) {
                const f = h[1];
                (u[f] || (u[f] = [])).push(d);
              }
            }),
              o(u),
              "caches" in window &&
                caches.open("alien-images").then((d) => {
                  l.forEach((h) => {
                    const f = new Request(h, { mode: "no-cors" });
                    d.add(f).catch(() => {});
                  });
                }));
          })
          .catch((i) => console.error("Failed to load alien data", i));
      }, []),
      c.jsxs("div", {
        className: "container mx-auto px-4 py-8 space-y-8",
        children: [
          c.jsxs("div", {
            className: "space-y-4",
            children: [
              c.jsx("h1", {
                className:
                  "title-text text-4xl md:text-6xl font-black glow-text text-center",
                children: "ALIENS",
              }),
              c.jsx("p", {
                className: "text-center text-xl text-muted-foreground",
                children:
                  "A catalog of otherworldly species encountered across the wasteland.",
              }),
            ],
          }),
          c.jsx("div", {
            className:
              "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
            children: t.map((i) => {
              var l;
              return c.jsxs(
                At,
                {
                  onClick: () => a(i),
                  className:
                    "cursor-pointer cyber-border bg-card/50 backdrop-blur-sm holo-hover",
                  children: [
                    c.jsx("img", {
                      src:
                        ((l = s[i.name]) == null ? void 0 : l[0]) ||
                        "/placeholder.svg",
                      alt: i.name,
                      className:
                        "w-full h-32 object-cover border-b border-primary/20",
                    }),
                    c.jsx(Mt, {
                      children: c.jsx(It, {
                        className: "terminal-text text-center text-lg",
                        children: i.name.toUpperCase(),
                      }),
                    }),
                  ],
                },
                i.name,
              );
            }),
          }),
          n &&
            c.jsx(Yw, {
              open: !!n,
              onOpenChange: (i) => !i && a(null),
              children: c.jsxs(ff, {
                className: "w-4/5 max-w-4xl",
                children: [
                  c.jsx(pf, {
                    children: c.jsx(mf, {
                      className: "terminal-text text-lg glow-text",
                      children: n.name.toUpperCase(),
                    }),
                  }),
                  c.jsx("div", {
                    className:
                      "grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-auto p-2",
                    children:
                      (e = n.data.troops) == null
                        ? void 0
                        : e.map((i) => {
                            const l = s[n.name] || [],
                              u = `${i.name}_${i.version}`.toLowerCase(),
                              d = l.find((h) => h.toLowerCase().includes(u));
                            return c.jsxs(
                              "div",
                              {
                                className: "space-y-1 text-center",
                                children: [
                                  c.jsx("img", {
                                    src: d || "/placeholder.svg",
                                    alt: `${i.name} ${i.version}`,
                                    className:
                                      "w-full h-32 object-contain cyber-border bg-background/50",
                                  }),
                                  c.jsxs("p", {
                                    className: "text-sm",
                                    children: [i.name, " ", i.version],
                                  }),
                                ],
                              },
                              `${i.name}-${i.version}`,
                            );
                          }),
                  }),
                ],
              }),
            }),
        ],
      })
    );
  },
  FO = () =>
    c.jsxs("div", {
      className: "container mx-auto px-4 py-8 space-y-8",
      children: [
        c.jsxs("div", {
          className: "space-y-4 text-center",
          children: [
            c.jsx("h1", {
              className: "title-text text-4xl md:text-6xl font-black glow-text",
              children: "CORE RULE BOOK",
            }),
            c.jsx("p", {
              className: "text-xl text-muted-foreground",
              children:
                "The fundamental guide to surviving and thriving in the Remnants universe.",
            }),
          ],
        }),
        c.jsx("div", {
          className: "cyber-border bg-card/50 p-2 rounded-lg backdrop-blur-sm",
          children: c.jsx("iframe", {
            src: "/Remnants_of_Destruction_Core_Rulebook.pdf",
            title: "Core Rulebook",
            className: "w-full h-[80vh]",
          }),
        }),
      ],
    }),
  zO = () =>
    c.jsxs("div", {
      className: "container mx-auto px-4 py-8 space-y-4",
      children: [
        c.jsx("h1", {
          className:
            "title-text text-4xl md:text-6xl font-black glow-text text-center",
          children: "REMNANTS LORE",
        }),
        c.jsx("p", {
          className: "text-center text-xl text-muted-foreground",
          children: "Tales and records from the ashes of civilization.",
        }),
      ],
    }),
  eg = ({ children: e }) => {
    const { user: t, loading: r } = Jh();
    return r
      ? c.jsx("div", {
          className:
            "container mx-auto px-4 py-8 min-h-screen flex items-center justify-center",
          children: c.jsx("div", {
            className: "terminal-text text-primary animate-glow-pulse",
            children: "ACCESSING VAULT...",
          }),
        })
      : t
        ? c.jsx(c.Fragment, { children: e })
        : c.jsx(m2, { to: "/auth", replace: !0 });
  },
  la = p.forwardRef(({ className: e, type: t, ...r }, n) =>
    c.jsx("input", {
      type: t,
      className: ee(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        e,
      ),
      ref: n,
      ...r,
    }),
  );
la.displayName = "Input";
var UO = "Label",
  rx = p.forwardRef((e, t) =>
    c.jsx(ae.label, {
      ...e,
      ref: t,
      onMouseDown: (r) => {
        var n;
        r.target.closest("button, input, select, textarea") ||
          ((n = e.onMouseDown) == null || n.call(e, r),
          !r.defaultPrevented && r.detail > 1 && r.preventDefault());
      },
    }),
  );
rx.displayName = UO;
var nx = rx;
const BO = xo(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ),
  ca = p.forwardRef(({ className: e, ...t }, r) =>
    c.jsx(nx, { ref: r, className: ee(BO(), e), ...t }),
  );
ca.displayName = nx.displayName;
const WO = xo(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
      variants: {
        variant: {
          default: "bg-background text-foreground",
          destructive:
            "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  xd = p.forwardRef(({ className: e, variant: t, ...r }, n) =>
    c.jsx("div", {
      ref: n,
      role: "alert",
      className: ee(WO({ variant: t }), e),
      ...r,
    }),
  );
xd.displayName = "Alert";
const qO = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("h5", {
    ref: r,
    className: ee("mb-1 font-medium leading-none tracking-tight", e),
    ...t,
  }),
);
qO.displayName = "AlertTitle";
const kd = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx("div", {
    ref: r,
    className: ee("text-sm [&_p]:leading-relaxed", e),
    ...t,
  }),
);
kd.displayName = "AlertDescription";
var gf = "Tabs",
  [HO, h4] = qa(gf, [Vl]),
  ax = Vl(),
  [VO, vf] = HO(gf),
  sx = p.forwardRef((e, t) => {
    const {
        __scopeTabs: r,
        value: n,
        onValueChange: a,
        defaultValue: s,
        orientation: o = "horizontal",
        dir: i,
        activationMode: l = "automatic",
        ...u
      } = e,
      d = Yh(i),
      [h, f] = wo({ prop: n, onChange: a, defaultProp: s });
    return c.jsx(VO, {
      scope: r,
      baseId: Nn(),
      value: h,
      onValueChange: f,
      orientation: o,
      dir: d,
      activationMode: l,
      children: c.jsx(ae.div, { dir: d, "data-orientation": o, ...u, ref: t }),
    });
  });
sx.displayName = gf;
var ox = "TabsList",
  ix = p.forwardRef((e, t) => {
    const { __scopeTabs: r, loop: n = !0, ...a } = e,
      s = vf(ox, r),
      o = ax(r);
    return c.jsx(C0, {
      asChild: !0,
      ...o,
      orientation: s.orientation,
      dir: s.dir,
      loop: n,
      children: c.jsx(ae.div, {
        role: "tablist",
        "aria-orientation": s.orientation,
        ...a,
        ref: t,
      }),
    });
  });
ix.displayName = ox;
var lx = "TabsTrigger",
  cx = p.forwardRef((e, t) => {
    const { __scopeTabs: r, value: n, disabled: a = !1, ...s } = e,
      o = vf(lx, r),
      i = ax(r),
      l = hx(o.baseId, n),
      u = fx(o.baseId, n),
      d = n === o.value;
    return c.jsx(T0, {
      asChild: !0,
      ...i,
      focusable: !a,
      active: d,
      children: c.jsx(ae.button, {
        type: "button",
        role: "tab",
        "aria-selected": d,
        "aria-controls": u,
        "data-state": d ? "active" : "inactive",
        "data-disabled": a ? "" : void 0,
        disabled: a,
        id: l,
        ...s,
        ref: t,
        onMouseDown: F(e.onMouseDown, (h) => {
          !a && h.button === 0 && h.ctrlKey === !1
            ? o.onValueChange(n)
            : h.preventDefault();
        }),
        onKeyDown: F(e.onKeyDown, (h) => {
          [" ", "Enter"].includes(h.key) && o.onValueChange(n);
        }),
        onFocus: F(e.onFocus, () => {
          const h = o.activationMode !== "manual";
          !d && !a && h && o.onValueChange(n);
        }),
      }),
    });
  });
cx.displayName = lx;
var ux = "TabsContent",
  dx = p.forwardRef((e, t) => {
    const { __scopeTabs: r, value: n, forceMount: a, children: s, ...o } = e,
      i = vf(ux, r),
      l = hx(i.baseId, n),
      u = fx(i.baseId, n),
      d = n === i.value,
      h = p.useRef(d);
    return (
      p.useEffect(() => {
        const f = requestAnimationFrame(() => (h.current = !1));
        return () => cancelAnimationFrame(f);
      }, []),
      c.jsx(Ut, {
        present: a || d,
        children: ({ present: f }) =>
          c.jsx(ae.div, {
            "data-state": d ? "active" : "inactive",
            "data-orientation": i.orientation,
            role: "tabpanel",
            "aria-labelledby": l,
            hidden: !f,
            id: u,
            tabIndex: 0,
            ...o,
            ref: t,
            style: { ...e.style, animationDuration: h.current ? "0s" : void 0 },
            children: f && s,
          }),
      })
    );
  });
dx.displayName = ux;
function hx(e, t) {
  return `${e}-trigger-${t}`;
}
function fx(e, t) {
  return `${e}-content-${t}`;
}
var KO = sx,
  px = ix,
  mx = cx,
  gx = dx;
const GO = KO,
  vx = p.forwardRef(({ className: e, ...t }, r) =>
    c.jsx(px, {
      ref: r,
      className: ee(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        e,
      ),
      ...t,
    }),
  );
vx.displayName = px.displayName;
const Sd = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(mx, {
    ref: r,
    className: ee(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      e,
    ),
    ...t,
  }),
);
Sd.displayName = mx.displayName;
const _d = p.forwardRef(({ className: e, ...t }, r) =>
  c.jsx(gx, {
    ref: r,
    className: ee(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      e,
    ),
    ...t,
  }),
);
_d.displayName = gx.displayName;
