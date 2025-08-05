/**
* @license lucide-react v0.462.0 - ISC

* @license MIT
*/ function io() {
  return (
    (io = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    io.apply(this, arguments)
  );
}
var Fr;
(function (e) {
  ((e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE"));
})(Fr || (Fr = {}));
const mm = "popstate";
function TN(e) {
  e === void 0 && (e = {});
  function t(n, a) {
    let { pathname: s, search: o, hash: i } = n.location;
    return nd(
      "",
      { pathname: s, search: o, hash: i },
      (a.state && a.state.usr) || null,
      (a.state && a.state.key) || "default",
    );
  }
  function r(n, a) {
    return typeof a == "string" ? a : tl(a);
  }
  return RN(t, r, null, e);
}
function ke(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Ub(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function PN() {
  return Math.random().toString(36).substr(2, 8);
}
function gm(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function nd(e, t, r, n) {
  return (
    r === void 0 && (r = null),
    io(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? Ga(t) : t,
      { state: r, key: (t && t.key) || n || PN() },
    )
  );
}
function tl(e) {
  let { pathname: t = "/", search: r = "", hash: n = "" } = e;
  return (
    r && r !== "?" && (t += r.charAt(0) === "?" ? r : "?" + r),
    n && n !== "#" && (t += n.charAt(0) === "#" ? n : "#" + n),
    t
  );
}
function Ga(e) {
  let t = {};
  if (e) {
    let r = e.indexOf("#");
    r >= 0 && ((t.hash = e.substr(r)), (e = e.substr(0, r)));
    let n = e.indexOf("?");
    (n >= 0 && ((t.search = e.substr(n)), (e = e.substr(0, n))),
      e && (t.pathname = e));
  }
  return t;
}
function RN(e, t, r, n) {
  n === void 0 && (n = {});
  let { window: a = document.defaultView, v5Compat: s = !1 } = n,
    o = a.history,
    i = Fr.Pop,
    l = null,
    u = d();
  u == null && ((u = 0), o.replaceState(io({}, o.state, { idx: u }), ""));
  function d() {
    return (o.state || { idx: null }).idx;
  }
  function h() {
    i = Fr.Pop;
    let w = d(),
      y = w == null ? null : w - u;
    ((u = w), l && l({ action: i, location: m.location, delta: y }));
  }
  function f(w, y) {
    i = Fr.Push;
    let b = nd(m.location, w, y);
    u = d() + 1;
    let x = gm(b, u),
      k = m.createHref(b);
    try {
      o.pushState(x, "", k);
    } catch (S) {
      if (S instanceof DOMException && S.name === "DataCloneError") throw S;
      a.location.assign(k);
    }
    s && l && l({ action: i, location: m.location, delta: 1 });
  }
  function v(w, y) {
    i = Fr.Replace;
    let b = nd(m.location, w, y);
    u = d();
    let x = gm(b, u),
      k = m.createHref(b);
    (o.replaceState(x, "", k),
      s && l && l({ action: i, location: m.location, delta: 0 }));
  }
  function g(w) {
    let y = a.location.origin !== "null" ? a.location.origin : a.location.href,
      b = typeof w == "string" ? w : tl(w);
    return (
      (b = b.replace(/ $/, "%20")),
      ke(
        y,
        "No window.location.(origin|href) available to create URL for href: " +
          b,
      ),
      new URL(b, y)
    );
  }
  let m = {
    get action() {
      return i;
    },
    get location() {
      return e(a, o);
    },
    listen(w) {
      if (l) throw new Error("A history only accepts one active listener");
      return (
        a.addEventListener(mm, h),
        (l = w),
        () => {
          (a.removeEventListener(mm, h), (l = null));
        }
      );
    },
    createHref(w) {
      return t(a, w);
    },
    createURL: g,
    encodeLocation(w) {
      let y = g(w);
      return { pathname: y.pathname, search: y.search, hash: y.hash };
    },
    push: f,
    replace: v,
    go(w) {
      return o.go(w);
    },
  };
  return m;
}
var vm;
(function (e) {
  ((e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error"));
})(vm || (vm = {}));
function ON(e, t, r) {
  return (r === void 0 && (r = "/"), AN(e, t, r, !1));
}
function AN(e, t, r, n) {
  let a = typeof t == "string" ? Ga(t) : t,
    s = zh(a.pathname || "/", r);
  if (s == null) return null;
  let o = Bb(e);
  MN(o);
  let i = null;
  for (let l = 0; i == null && l < o.length; ++l) {
    let u = HN(s);
    i = WN(o[l], u, n);
  }
  return i;
}
function Bb(e, t, r, n) {
  (t === void 0 && (t = []),
    r === void 0 && (r = []),
    n === void 0 && (n = ""));
  let a = (s, o, i) => {
    let l = {
      relativePath: i === void 0 ? s.path || "" : i,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s,
    };
    l.relativePath.startsWith("/") &&
      (ke(
        l.relativePath.startsWith(n),
        'Absolute route path "' +
          l.relativePath +
          '" nested under path ' +
          ('"' + n + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (l.relativePath = l.relativePath.slice(n.length)));
    let u = Gr([n, l.relativePath]),
      d = r.concat(l);
    (s.children &&
      s.children.length > 0 &&
      (ke(
        s.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + u + '".'),
      ),
      Bb(s.children, t, d, u)),
      !(s.path == null && !s.index) &&
        t.push({ path: u, score: UN(u, s.index), routesMeta: d }));
  };
  return (
    e.forEach((s, o) => {
      var i;
      if (s.path === "" || !((i = s.path) != null && i.includes("?"))) a(s, o);
      else for (let l of Wb(s.path)) a(s, o, l);
    }),
    t
  );
}
function Wb(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [r, ...n] = t,
    a = r.endsWith("?"),
    s = r.replace(/\?$/, "");
  if (n.length === 0) return a ? [s, ""] : [s];
  let o = Wb(n.join("/")),
    i = [];
  return (
    i.push(...o.map((l) => (l === "" ? s : [s, l].join("/")))),
    a && i.push(...o),
    i.map((l) => (e.startsWith("/") && l === "" ? "/" : l))
  );
}
function MN(e) {
  e.sort((t, r) =>
    t.score !== r.score
      ? r.score - t.score
      : BN(
          t.routesMeta.map((n) => n.childrenIndex),
          r.routesMeta.map((n) => n.childrenIndex),
        ),
  );
}
const IN = /^:[\w-]+$/,
  DN = 3,
  LN = 2,
  $N = 1,
  FN = 10,
  zN = -2,
  ym = (e) => e === "*";
function UN(e, t) {
  let r = e.split("/"),
    n = r.length;
  return (
    r.some(ym) && (n += zN),
    t && (n += LN),
    r
      .filter((a) => !ym(a))
      .reduce((a, s) => a + (IN.test(s) ? DN : s === "" ? $N : FN), n)
  );
}
function BN(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, n) => r === t[n])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function WN(e, t, r) {
  let { routesMeta: n } = e,
    a = {},
    s = "/",
    o = [];
  for (let i = 0; i < n.length; ++i) {
    let l = n[i],
      u = i === n.length - 1,
      d = s === "/" ? t : t.slice(s.length) || "/",
      h = bm(
        { path: l.relativePath, caseSensitive: l.caseSensitive, end: u },
        d,
      ),
      f = l.route;
    if (
      (!h &&
        u &&
        r &&
        !n[n.length - 1].route.index &&
        (h = bm(
          { path: l.relativePath, caseSensitive: l.caseSensitive, end: !1 },
          d,
        )),
      !h)
    )
      return null;
    (Object.assign(a, h.params),
      o.push({
        params: a,
        pathname: Gr([s, h.pathname]),
        pathnameBase: QN(Gr([s, h.pathnameBase])),
        route: f,
      }),
      h.pathnameBase !== "/" && (s = Gr([s, h.pathnameBase])));
  }
  return o;
}
function bm(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [r, n] = qN(e.path, e.caseSensitive, e.end),
    a = t.match(r);
  if (!a) return null;
  let s = a[0],
    o = s.replace(/(.)\/+$/, "$1"),
    i = a.slice(1);
  return {
    params: n.reduce((l, u, d) => {
      let { paramName: h, isOptional: f } = u;
      if (h === "*") {
        let g = i[d] || "";
        o = s.slice(0, s.length - g.length).replace(/(.)\/+$/, "$1");
      }
      const v = i[d];
      return (
        f && !v ? (l[h] = void 0) : (l[h] = (v || "").replace(/%2F/g, "/")),
        l
      );
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: e,
  };
}
function qN(e, t, r) {
  (t === void 0 && (t = !1),
    r === void 0 && (r = !0),
    Ub(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'),
    ));
  let n = [],
    a =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (s, o, i) => (
            n.push({ paramName: o, isOptional: i != null }),
            i ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    e.endsWith("*")
      ? (n.push({ paramName: "*" }),
        (a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : r
        ? (a += "\\/*$")
        : e !== "" && e !== "/" && (a += "(?:(?=\\/|$))"),
    [new RegExp(a, t ? void 0 : "i"), n]
  );
}
function HN(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      Ub(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ")."),
      ),
      e
    );
  }
}
function zh(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let r = t.endsWith("/") ? t.length - 1 : t.length,
    n = e.charAt(r);
  return n && n !== "/" ? null : e.slice(r) || "/";
}
function VN(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: r,
    search: n = "",
    hash: a = "",
  } = typeof e == "string" ? Ga(e) : e;
  return {
    pathname: r ? (r.startsWith("/") ? r : KN(r, t)) : t,
    search: JN(n),
    hash: YN(a),
  };
}
function KN(e, t) {
  let r = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((n) => {
      n === ".." ? r.length > 1 && r.pop() : n !== "." && r.push(n);
    }),
    r.length > 1 ? r.join("/") : "/"
  );
}
function Mc(e, t, r, n) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(n) +
      "].  Please separate it out to the ") +
    ("`to." + r + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function GN(e) {
  return e.filter(
    (t, r) => r === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function Uh(e, t) {
  let r = GN(e);
  return t
    ? r.map((n, a) => (a === r.length - 1 ? n.pathname : n.pathnameBase))
    : r.map((n) => n.pathnameBase);
}
function Bh(e, t, r, n) {
  n === void 0 && (n = !1);
  let a;
  typeof e == "string"
    ? (a = Ga(e))
    : ((a = io({}, e)),
      ke(
        !a.pathname || !a.pathname.includes("?"),
        Mc("?", "pathname", "search", a),
      ),
      ke(
        !a.pathname || !a.pathname.includes("#"),
        Mc("#", "pathname", "hash", a),
      ),
      ke(!a.search || !a.search.includes("#"), Mc("#", "search", "hash", a)));
  let s = e === "" || a.pathname === "",
    o = s ? "/" : a.pathname,
    i;
  if (o == null) i = r;
  else {
    let h = t.length - 1;
    if (!n && o.startsWith("..")) {
      let f = o.split("/");
      for (; f[0] === ".."; ) (f.shift(), (h -= 1));
      a.pathname = f.join("/");
    }
    i = h >= 0 ? t[h] : "/";
  }
  let l = VN(a, i),
    u = o && o !== "/" && o.endsWith("/"),
    d = (s || o === ".") && r.endsWith("/");
  return (!l.pathname.endsWith("/") && (u || d) && (l.pathname += "/"), l);
}
const Gr = (e) => e.join("/").replace(/\/\/+/g, "/"),
  QN = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  JN = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  YN = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function XN(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const qb = ["post", "put", "patch", "delete"];
new Set(qb);
const ZN = ["get", ...qb];
new Set(ZN);
/**
 * React Router v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function lo() {
  return (
    (lo = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    lo.apply(this, arguments)
  );
}
const Wh = p.createContext(null),
  e2 = p.createContext(null),
  sn = p.createContext(null),
  Ll = p.createContext(null),
  on = p.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Hb = p.createContext(null);
function t2(e, t) {
  let { relative: r } = t === void 0 ? {} : t;
  Qa() || ke(!1);
  let { basename: n, navigator: a } = p.useContext(sn),
    { hash: s, pathname: o, search: i } = Kb(e, { relative: r }),
    l = o;
  return (
    n !== "/" && (l = o === "/" ? n : Gr([n, o])),
    a.createHref({ pathname: l, search: i, hash: s })
  );
}
function Qa() {
  return p.useContext(Ll) != null;
}
function Fn() {
  return (Qa() || ke(!1), p.useContext(Ll).location);
}
function Vb(e) {
  p.useContext(sn).static || p.useLayoutEffect(e);
}
function qh() {
  let { isDataRoute: e } = p.useContext(on);
  return e ? p2() : r2();
}
function r2() {
  Qa() || ke(!1);
  let e = p.useContext(Wh),
    { basename: t, future: r, navigator: n } = p.useContext(sn),
    { matches: a } = p.useContext(on),
    { pathname: s } = Fn(),
    o = JSON.stringify(Uh(a, r.v7_relativeSplatPath)),
    i = p.useRef(!1);
  return (
    Vb(() => {
      i.current = !0;
    }),
    p.useCallback(
      function (l, u) {
        if ((u === void 0 && (u = {}), !i.current)) return;
        if (typeof l == "number") {
          n.go(l);
          return;
        }
        let d = Bh(l, JSON.parse(o), s, u.relative === "path");
        (e == null &&
          t !== "/" &&
          (d.pathname = d.pathname === "/" ? t : Gr([t, d.pathname])),
          (u.replace ? n.replace : n.push)(d, u.state, u));
      },
      [t, n, o, s, e],
    )
  );
}
function Kb(e, t) {
  let { relative: r } = t === void 0 ? {} : t,
    { future: n } = p.useContext(sn),
    { matches: a } = p.useContext(on),
    { pathname: s } = Fn(),
    o = JSON.stringify(Uh(a, n.v7_relativeSplatPath));
  return p.useMemo(() => Bh(e, JSON.parse(o), s, r === "path"), [e, o, s, r]);
}
function n2(e, t) {
  return a2(e, t);
}
function a2(e, t, r, n) {
  Qa() || ke(!1);
  let { navigator: a } = p.useContext(sn),
    { matches: s } = p.useContext(on),
    o = s[s.length - 1],
    i = o ? o.params : {};
  o && o.pathname;
  let l = o ? o.pathnameBase : "/";
  o && o.route;
  let u = Fn(),
    d;
  if (t) {
    var h;
    let w = typeof t == "string" ? Ga(t) : t;
    (l === "/" || ((h = w.pathname) != null && h.startsWith(l)) || ke(!1),
      (d = w));
  } else d = u;
  let f = d.pathname || "/",
    v = f;
  if (l !== "/") {
    let w = l.replace(/^\//, "").split("/");
    v = "/" + f.replace(/^\//, "").split("/").slice(w.length).join("/");
  }
  let g = ON(e, { pathname: v }),
    m = c2(
      g &&
        g.map((w) =>
          Object.assign({}, w, {
            params: Object.assign({}, i, w.params),
            pathname: Gr([
              l,
              a.encodeLocation
                ? a.encodeLocation(w.pathname).pathname
                : w.pathname,
            ]),
            pathnameBase:
              w.pathnameBase === "/"
                ? l
                : Gr([
                    l,
                    a.encodeLocation
                      ? a.encodeLocation(w.pathnameBase).pathname
                      : w.pathnameBase,
                  ]),
          }),
        ),
      s,
      r,
      n,
    );
  return t && m
    ? p.createElement(
        Ll.Provider,
        {
          value: {
            location: lo(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              d,
            ),
            navigationType: Fr.Pop,
          },
        },
        m,
      )
    : m;
}
function s2() {
  let e = f2(),
    t = XN(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    r = e instanceof Error ? e.stack : null,
    n = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return p.createElement(
    p.Fragment,
    null,
    p.createElement("h2", null, "Unexpected Application Error!"),
    p.createElement("h3", { style: { fontStyle: "italic" } }, t),
    r ? p.createElement("pre", { style: n }, r) : null,
    null,
  );
}
const o2 = p.createElement(s2, null);
class i2 extends p.Component {
  constructor(t) {
    (super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      }));
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, r) {
    return r.location !== t.location ||
      (r.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : r.error,
          location: r.location,
          revalidation: t.revalidation || r.revalidation,
        };
  }
  componentDidCatch(t, r) {
    console.error(
      "React Router caught the following error during render",
      t,
      r,
    );
  }
  render() {
    return this.state.error !== void 0
      ? p.createElement(
          on.Provider,
          { value: this.props.routeContext },
          p.createElement(Hb.Provider, {
            value: this.state.error,
            children: this.props.component,
          }),
        )
      : this.props.children;
  }
}
function l2(e) {
  let { routeContext: t, match: r, children: n } = e,
    a = p.useContext(Wh);
  return (
    a &&
      a.static &&
      a.staticContext &&
      (r.route.errorElement || r.route.ErrorBoundary) &&
      (a.staticContext._deepestRenderedBoundaryId = r.route.id),
    p.createElement(on.Provider, { value: t }, n)
  );
}
function c2(e, t, r, n) {
  var a;
  if (
    (t === void 0 && (t = []),
    r === void 0 && (r = null),
    n === void 0 && (n = null),
    e == null)
  ) {
    var s;
    if (!r) return null;
    if (r.errors) e = r.matches;
    else if (
      (s = n) != null &&
      s.v7_partialHydration &&
      t.length === 0 &&
      !r.initialized &&
      r.matches.length > 0
    )
      e = r.matches;
    else return null;
  }
  let o = e,
    i = (a = r) == null ? void 0 : a.errors;
  if (i != null) {
    let d = o.findIndex(
      (h) => h.route.id && (i == null ? void 0 : i[h.route.id]) !== void 0,
    );
    (d >= 0 || ke(!1), (o = o.slice(0, Math.min(o.length, d + 1))));
  }
  let l = !1,
    u = -1;
  if (r && n && n.v7_partialHydration)
    for (let d = 0; d < o.length; d++) {
      let h = o[d];
      if (
        ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (u = d),
        h.route.id)
      ) {
        let { loaderData: f, errors: v } = r,
          g =
            h.route.loader &&
            f[h.route.id] === void 0 &&
            (!v || v[h.route.id] === void 0);
        if (h.route.lazy || g) {
          ((l = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]));
          break;
        }
      }
    }
  return o.reduceRight((d, h, f) => {
    let v,
      g = !1,
      m = null,
      w = null;
    r &&
      ((v = i && h.route.id ? i[h.route.id] : void 0),
      (m = h.route.errorElement || o2),
      l &&
        (u < 0 && f === 0
          ? ((g = !0), (w = null))
          : u === f &&
            ((g = !0), (w = h.route.hydrateFallbackElement || null))));
    let y = t.concat(o.slice(0, f + 1)),
      b = () => {
        let x;
        return (
          v
            ? (x = m)
            : g
              ? (x = w)
              : h.route.Component
                ? (x = p.createElement(h.route.Component, null))
                : h.route.element
                  ? (x = h.route.element)
                  : (x = d),
          p.createElement(l2, {
            match: h,
            routeContext: { outlet: d, matches: y, isDataRoute: r != null },
            children: x,
          })
        );
      };
    return r && (h.route.ErrorBoundary || h.route.errorElement || f === 0)
      ? p.createElement(i2, {
          location: r.location,
          revalidation: r.revalidation,
          component: m,
          error: v,
          children: b(),
          routeContext: { outlet: null, matches: y, isDataRoute: !0 },
        })
      : b();
  }, null);
}
var Gb = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(Gb || {}),
  rl = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(rl || {});
function u2(e) {
  let t = p.useContext(Wh);
  return (t || ke(!1), t);
}
function d2(e) {
  let t = p.useContext(e2);
  return (t || ke(!1), t);
}
function h2(e) {
  let t = p.useContext(on);
  return (t || ke(!1), t);
}
function Qb(e) {
  let t = h2(),
    r = t.matches[t.matches.length - 1];
  return (r.route.id || ke(!1), r.route.id);
}
function f2() {
  var e;
  let t = p.useContext(Hb),
    r = d2(rl.UseRouteError),
    n = Qb(rl.UseRouteError);
  return t !== void 0 ? t : (e = r.errors) == null ? void 0 : e[n];
}
function p2() {
  let { router: e } = u2(Gb.UseNavigateStable),
    t = Qb(rl.UseNavigateStable),
    r = p.useRef(!1);
  return (
    Vb(() => {
      r.current = !0;
    }),
    p.useCallback(
      function (n, a) {
        (a === void 0 && (a = {}),
          r.current &&
            (typeof n == "number"
              ? e.navigate(n)
              : e.navigate(n, lo({ fromRouteId: t }, a))));
      },
      [e, t],
    )
  );
}
function m2(e) {
  let { to: t, replace: r, state: n, relative: a } = e;
  Qa() || ke(!1);
  let { future: s, static: o } = p.useContext(sn),
    { matches: i } = p.useContext(on),
    { pathname: l } = Fn(),
    u = qh(),
    d = Bh(t, Uh(i, s.v7_relativeSplatPath), l, a === "path"),
    h = JSON.stringify(d);
  return (
    p.useEffect(
      () => u(JSON.parse(h), { replace: r, state: n, relative: a }),
      [u, h, a, r, n],
    ),
    null
  );
}
function Et(e) {
  ke(!1);
}
function g2(e) {
  let {
    basename: t = "/",
    children: r = null,
    location: n,
    navigationType: a = Fr.Pop,
    navigator: s,
    static: o = !1,
    future: i,
  } = e;
  Qa() && ke(!1);
  let l = t.replace(/^\/*/, "/"),
    u = p.useMemo(
      () => ({
        basename: l,
        navigator: s,
        static: o,
        future: lo({ v7_relativeSplatPath: !1 }, i),
      }),
      [l, i, s, o],
    );
  typeof n == "string" && (n = Ga(n));
  let {
      pathname: d = "/",
      search: h = "",
      hash: f = "",
      state: v = null,
      key: g = "default",
    } = n,
    m = p.useMemo(() => {
      let w = zh(d, l);
      return w == null
        ? null
        : {
            location: { pathname: w, search: h, hash: f, state: v, key: g },
            navigationType: a,
          };
    }, [l, d, h, f, v, g, a]);
  return m == null
    ? null
    : p.createElement(
        sn.Provider,
        { value: u },
        p.createElement(Ll.Provider, { children: r, value: m }),
      );
}
function v2(e) {
  let { children: t, location: r } = e;
  return n2(ad(t), r);
}
new Promise(() => {});
function ad(e, t) {
  t === void 0 && (t = []);
  let r = [];
  return (
    p.Children.forEach(e, (n, a) => {
      if (!p.isValidElement(n)) return;
      let s = [...t, a];
      if (n.type === p.Fragment) {
        r.push.apply(r, ad(n.props.children, s));
        return;
      }
      (n.type !== Et && ke(!1), !n.props.index || !n.props.children || ke(!1));
      let o = {
        id: n.props.id || s.join("-"),
        caseSensitive: n.props.caseSensitive,
        element: n.props.element,
        Component: n.props.Component,
        index: n.props.index,
        path: n.props.path,
        loader: n.props.loader,
        action: n.props.action,
        errorElement: n.props.errorElement,
        ErrorBoundary: n.props.ErrorBoundary,
        hasErrorBoundary:
          n.props.ErrorBoundary != null || n.props.errorElement != null,
        shouldRevalidate: n.props.shouldRevalidate,
        handle: n.props.handle,
        lazy: n.props.lazy,
      };
      (n.props.children && (o.children = ad(n.props.children, s)), r.push(o));
    }),
    r
  );
}
