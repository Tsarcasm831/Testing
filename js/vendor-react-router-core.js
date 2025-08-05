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
