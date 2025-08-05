var jx = Object.defineProperty,
  tg = (e) => {
    throw TypeError(e);
  },
  Ex = (e, t, r) =>
    t in e
      ? jx(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  Vn = (e, t, r) => Ex(e, typeof t != "symbol" ? t + "" : t, r),
  jd = (e, t, r) => t.has(e) || tg("Cannot " + r),
  T = (e, t, r) => (
    jd(e, t, "read from private field"),
    r ? r.call(e) : t.get(e)
  ),
  oe = (e, t, r) =>
    t.has(e)
      ? tg("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, r),
  Q = (e, t, r, n) => (jd(e, t, "write to private field"), t.set(e, r), r),
  qe = (e, t, r) => (jd(e, t, "access private method"), r),
  Xc = (e, t, r, n) => ({
    set _(a) {
      Q(e, t, a);
    },
    get _() {
      return T(e, t, n);
    },
  });
function Nx(e, t) {
  for (var r = 0; r < t.length; r++) {
    const n = t[r];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const a in n)
        if (a !== "default" && !(a in e)) {
          const s = Object.getOwnPropertyDescriptor(n, a);
          s &&
            Object.defineProperty(
              e,
              a,
              s.get ? s : { enumerable: !0, get: () => n[a] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
var xt =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function rg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
function Cx(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function n() {
      return this instanceof n
        ? Reflect.construct(t, arguments, this.constructor)
        : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else r = {};
  return (
    Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.keys(e).forEach(function (n) {
      var a = Object.getOwnPropertyDescriptor(e, n);
      Object.defineProperty(
        r,
        n,
        a.get
          ? a
          : {
              enumerable: !0,
              get: function () {
                return e[n];
              },
            },
      );
    }),
    r
  );
}
var ng = { exports: {} },
  ll = {},
  ag = { exports: {} },
  X = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var fo = Symbol.for("react.element"),
  Tx = Symbol.for("react.portal"),
  Px = Symbol.for("react.fragment"),
  Rx = Symbol.for("react.strict_mode"),
  Ox = Symbol.for("react.profiler"),
  Ax = Symbol.for("react.provider"),
  Mx = Symbol.for("react.context"),
  Ix = Symbol.for("react.forward_ref"),
  Dx = Symbol.for("react.suspense"),
  Lx = Symbol.for("react.memo"),
  $x = Symbol.for("react.lazy"),
  Sf = Symbol.iterator;
function Fx(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Sf && e[Sf]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var sg = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  og = Object.assign,
  ig = {};
function Ua(e, t, r) {
  ((this.props = e),
    (this.context = t),
    (this.refs = ig),
    (this.updater = r || sg));
}
Ua.prototype.isReactComponent = {};
Ua.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Ua.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function lg() {}
lg.prototype = Ua.prototype;
function Ed(e, t, r) {
  ((this.props = e),
    (this.context = t),
    (this.refs = ig),
    (this.updater = r || sg));
}
var Nd = (Ed.prototype = new lg());
Nd.constructor = Ed;
og(Nd, Ua.prototype);
Nd.isPureReactComponent = !0;
var _f = Array.isArray,
  cg = Object.prototype.hasOwnProperty,
  Cd = { current: null },
  ug = { key: !0, ref: !0, __self: !0, __source: !0 };
function dg(e, t, r) {
  var n,
    a = {},
    s = null,
    o = null;
  if (t != null)
    for (n in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (s = "" + t.key),
    t))
      cg.call(t, n) && !ug.hasOwnProperty(n) && (a[n] = t[n]);
  var i = arguments.length - 2;
  if (i === 1) a.children = r;
  else if (1 < i) {
    for (var l = Array(i), u = 0; u < i; u++) l[u] = arguments[u + 2];
    a.children = l;
  }
  if (e && e.defaultProps)
    for (n in ((i = e.defaultProps), i)) a[n] === void 0 && (a[n] = i[n]);
  return {
    $$typeof: fo,
    type: e,
    key: s,
    ref: o,
    props: a,
    _owner: Cd.current,
  };
}
function zx(e, t) {
  return {
    $$typeof: fo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Td(e) {
  return typeof e == "object" && e !== null && e.$$typeof === fo;
}
function Ux(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (r) {
      return t[r];
    })
  );
}
var jf = /\/+/g;
function tc(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Ux("" + e.key)
    : t.toString(36);
}
function ci(e, t, r, n, a) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (s) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case fo:
          case Tx:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (a = a(o)),
      (e = n === "" ? "." + tc(o, 0) : n),
      _f(a)
        ? ((r = ""),
          e != null && (r = e.replace(jf, "$&/") + "/"),
          ci(a, t, r, "", function (u) {
            return u;
          }))
        : a != null &&
          (Td(a) &&
            (a = zx(
              a,
              r +
                (!a.key || (o && o.key === a.key)
                  ? ""
                  : ("" + a.key).replace(jf, "$&/") + "/") +
                e,
            )),
          t.push(a)),
      1
    );
  if (((o = 0), (n = n === "" ? "." : n + ":"), _f(e)))
    for (var i = 0; i < e.length; i++) {
      s = e[i];
      var l = n + tc(s, i);
      o += ci(s, t, r, l, a);
    }
  else if (((l = Fx(e)), typeof l == "function"))
    for (e = l.call(e), i = 0; !(s = e.next()).done; )
      ((s = s.value), (l = n + tc(s, i++)), (o += ci(s, t, r, l, a)));
  else if (s === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return o;
}
function Oo(e, t, r) {
  if (e == null) return e;
  var n = [],
    a = 0;
  return (
    ci(e, n, "", "", function (s) {
      return t.call(r, s, a++);
    }),
    n
  );
}
function Bx(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (r) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = r));
        },
        function (r) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = r));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ge = { current: null },
  ui = { transition: null },
  Wx = {
    ReactCurrentDispatcher: Ge,
    ReactCurrentBatchConfig: ui,
    ReactCurrentOwner: Cd,
  };
function hg() {
  throw Error("act(...) is not supported in production builds of React.");
}
X.Children = {
  map: Oo,
  forEach: function (e, t, r) {
    Oo(
      e,
      function () {
        t.apply(this, arguments);
      },
      r,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Oo(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Oo(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Td(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
X.Component = Ua;
X.Fragment = Px;
X.Profiler = Ox;
X.PureComponent = Ed;
X.StrictMode = Rx;
X.Suspense = Dx;
X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Wx;
X.act = hg;
X.cloneElement = function (e, t, r) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var n = og({}, e.props),
    a = e.key,
    s = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (o = Cd.current)),
      t.key !== void 0 && (a = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var i = e.type.defaultProps;
    for (l in t)
      cg.call(t, l) &&
        !ug.hasOwnProperty(l) &&
        (n[l] = t[l] === void 0 && i !== void 0 ? i[l] : t[l]);
  }
  var l = arguments.length - 2;
  if (l === 1) n.children = r;
  else if (1 < l) {
    i = Array(l);
    for (var u = 0; u < l; u++) i[u] = arguments[u + 2];
    n.children = i;
  }
  return { $$typeof: fo, type: e.type, key: a, ref: s, props: n, _owner: o };
};
X.createContext = function (e) {
  return (
    (e = {
      $$typeof: Mx,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Ax, _context: e }),
    (e.Consumer = e)
  );
};
X.createElement = dg;
X.createFactory = function (e) {
  var t = dg.bind(null, e);
  return ((t.type = e), t);
};
X.createRef = function () {
  return { current: null };
};
X.forwardRef = function (e) {
  return { $$typeof: Ix, render: e };
};
X.isValidElement = Td;
X.lazy = function (e) {
  return { $$typeof: $x, _payload: { _status: -1, _result: e }, _init: Bx };
};
X.memo = function (e, t) {
  return { $$typeof: Lx, type: e, compare: t === void 0 ? null : t };
};
X.startTransition = function (e) {
  var t = ui.transition;
  ui.transition = {};
  try {
    e();
  } finally {
    ui.transition = t;
  }
};
X.unstable_act = hg;
X.useCallback = function (e, t) {
  return Ge.current.useCallback(e, t);
};
X.useContext = function (e) {
  return Ge.current.useContext(e);
};
X.useDebugValue = function () {};
X.useDeferredValue = function (e) {
  return Ge.current.useDeferredValue(e);
};
X.useEffect = function (e, t) {
  return Ge.current.useEffect(e, t);
};
X.useId = function () {
  return Ge.current.useId();
};
X.useImperativeHandle = function (e, t, r) {
  return Ge.current.useImperativeHandle(e, t, r);
};
X.useInsertionEffect = function (e, t) {
  return Ge.current.useInsertionEffect(e, t);
};
X.useLayoutEffect = function (e, t) {
  return Ge.current.useLayoutEffect(e, t);
};
X.useMemo = function (e, t) {
  return Ge.current.useMemo(e, t);
};
X.useReducer = function (e, t, r) {
  return Ge.current.useReducer(e, t, r);
};
X.useRef = function (e) {
  return Ge.current.useRef(e);
};
X.useState = function (e) {
  return Ge.current.useState(e);
};
X.useSyncExternalStore = function (e, t, r) {
  return Ge.current.useSyncExternalStore(e, t, r);
};
X.useTransition = function () {
  return Ge.current.useTransition();
};
X.version = "18.3.1";
ag.exports = X;
var p = ag.exports;
const R = rg(p),
  fg = Nx({ __proto__: null, default: R }, [p]);
