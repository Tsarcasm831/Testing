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
