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
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var qx = p,
  Hx = Symbol.for("react.element"),
  Vx = Symbol.for("react.fragment"),
  Kx = Object.prototype.hasOwnProperty,
  Gx = qx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Qx = { key: !0, ref: !0, __self: !0, __source: !0 };
function pg(e, t, r) {
  var n,
    a = {},
    s = null,
    o = null;
  (r !== void 0 && (s = "" + r),
    t.key !== void 0 && (s = "" + t.key),
    t.ref !== void 0 && (o = t.ref));
  for (n in t) Kx.call(t, n) && !Qx.hasOwnProperty(n) && (a[n] = t[n]);
  if (e && e.defaultProps)
    for (n in ((t = e.defaultProps), t)) a[n] === void 0 && (a[n] = t[n]);
  return {
    $$typeof: Hx,
    type: e,
    key: s,
    ref: o,
    props: a,
    _owner: Gx.current,
  };
}
ll.Fragment = Vx;
ll.jsx = pg;
ll.jsxs = pg;
ng.exports = ll;
var c = ng.exports,
  mg = { exports: {} },
  ft = {},
  gg = { exports: {} },
  vg = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(E, N) {
    var M = E.length;
    E.push(N);
    e: for (; 0 < M; ) {
      var I = (M - 1) >>> 1,
        z = E[I];
      if (0 < a(z, N)) ((E[I] = N), (E[M] = z), (M = I));
      else break e;
    }
  }
  function r(E) {
    return E.length === 0 ? null : E[0];
  }
  function n(E) {
    if (E.length === 0) return null;
    var N = E[0],
      M = E.pop();
    if (M !== N) {
      E[0] = M;
      e: for (var I = 0, z = E.length, W = z >>> 1; I < W; ) {
        var re = 2 * (I + 1) - 1,
          _e = E[re],
          se = re + 1,
          Ye = E[se];
        if (0 > a(_e, M))
          se < z && 0 > a(Ye, _e)
            ? ((E[I] = Ye), (E[se] = M), (I = se))
            : ((E[I] = _e), (E[re] = M), (I = re));
        else if (se < z && 0 > a(Ye, M)) ((E[I] = Ye), (E[se] = M), (I = se));
        else break e;
      }
    }
    return N;
  }
  function a(E, N) {
    var M = E.sortIndex - N.sortIndex;
    return M !== 0 ? M : E.id - N.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function () {
      return s.now();
    };
  } else {
    var o = Date,
      i = o.now();
    e.unstable_now = function () {
      return o.now() - i;
    };
  }
  var l = [],
    u = [],
    d = 1,
    h = null,
    f = 3,
    v = !1,
    g = !1,
    m = !1,
    w = typeof setTimeout == "function" ? setTimeout : null,
    y = typeof clearTimeout == "function" ? clearTimeout : null,
    b = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function x(E) {
    for (var N = r(u); N !== null; ) {
      if (N.callback === null) n(u);
      else if (N.startTime <= E)
        (n(u), (N.sortIndex = N.expirationTime), t(l, N));
      else break;
      N = r(u);
    }
  }
  function k(E) {
    if (((m = !1), x(E), !g))
      if (r(l) !== null) ((g = !0), B(S));
      else {
        var N = r(u);
        N !== null && J(k, N.startTime - E);
      }
  }
  function S(E, N) {
    ((g = !1), m && ((m = !1), y(C), (C = -1)), (v = !0));
    var M = f;
    try {
      for (
        x(N), h = r(l);
        h !== null && (!(h.expirationTime > N) || (E && !U()));

      ) {
        var I = h.callback;
        if (typeof I == "function") {
          ((h.callback = null), (f = h.priorityLevel));
          var z = I(h.expirationTime <= N);
          ((N = e.unstable_now()),
            typeof z == "function" ? (h.callback = z) : h === r(l) && n(l),
            x(N));
        } else n(l);
        h = r(l);
      }
      if (h !== null) var W = !0;
      else {
        var re = r(u);
        (re !== null && J(k, re.startTime - N), (W = !1));
      }
      return W;
    } finally {
      ((h = null), (f = M), (v = !1));
    }
  }
  var j = !1,
    _ = null,
    C = -1,
    D = 5,
    O = -1;
  function U() {
    return !(e.unstable_now() - O < D);
  }
  function $() {
    if (_ !== null) {
      var E = e.unstable_now();
      O = E;
      var N = !0;
      try {
        N = _(!0, E);
      } finally {
        N ? G() : ((j = !1), (_ = null));
      }
    } else j = !1;
  }
  var G;
  if (typeof b == "function")
    G = function () {
      b($);
    };
  else if (typeof MessageChannel < "u") {
    var A = new MessageChannel(),
      q = A.port2;
    ((A.port1.onmessage = $),
      (G = function () {
        q.postMessage(null);
      }));
  } else
    G = function () {
      w($, 0);
    };
  function B(E) {
    ((_ = E), j || ((j = !0), G()));
  }
  function J(E, N) {
    C = w(function () {
      E(e.unstable_now());
    }, N);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (E) {
      E.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      g || v || ((g = !0), B(S));
    }),
    (e.unstable_forceFrameRate = function (E) {
      0 > E || 125 < E
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (D = 0 < E ? Math.floor(1e3 / E) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return f;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return r(l);
    }),
    (e.unstable_next = function (E) {
      switch (f) {
        case 1:
        case 2:
        case 3:
          var N = 3;
          break;
        default:
          N = f;
      }
      var M = f;
      f = N;
      try {
        return E();
      } finally {
        f = M;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (E, N) {
      switch (E) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          E = 3;
      }
      var M = f;
      f = E;
      try {
        return N();
      } finally {
        f = M;
      }
    }),
    (e.unstable_scheduleCallback = function (E, N, M) {
      var I = e.unstable_now();
      switch (
        (typeof M == "object" && M !== null
          ? ((M = M.delay), (M = typeof M == "number" && 0 < M ? I + M : I))
          : (M = I),
        E)
      ) {
        case 1:
          var z = -1;
          break;
        case 2:
          z = 250;
          break;
        case 5:
          z = 1073741823;
          break;
        case 4:
          z = 1e4;
          break;
        default:
          z = 5e3;
      }
      return (
        (z = M + z),
        (E = {
          id: d++,
          callback: N,
          priorityLevel: E,
          startTime: M,
          expirationTime: z,
          sortIndex: -1,
        }),
        M > I
          ? ((E.sortIndex = M),
            t(u, E),
            r(l) === null &&
              E === r(u) &&
              (m ? (y(C), (C = -1)) : (m = !0), J(k, M - I)))
          : ((E.sortIndex = z), t(l, E), g || v || ((g = !0), B(S))),
        E
      );
    }),
    (e.unstable_shouldYield = U),
    (e.unstable_wrapCallback = function (E) {
      var N = f;
      return function () {
        var M = f;
        f = N;
        try {
          return E.apply(this, arguments);
        } finally {
          f = M;
        }
      };
    }));
})(vg);
gg.exports = vg;
var Jx = gg.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Yx = p,
  ht = Jx;
function P(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1;
    r < arguments.length;
    r++
  )
    t += "&args[]=" + encodeURIComponent(arguments[r]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var yg = new Set(),
  zs = {};
function Ln(e, t) {
  (Ra(e, t), Ra(e + "Capture", t));
}
function Ra(e, t) {
  for (zs[e] = t, e = 0; e < t.length; e++) yg.add(t[e]);
}
var gr = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Zc = Object.prototype.hasOwnProperty,
  Xx =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Ef = {},
  Nf = {};
function Zx(e) {
  return Zc.call(Nf, e)
    ? !0
    : Zc.call(Ef, e)
      ? !1
      : Xx.test(e)
        ? (Nf[e] = !0)
        : ((Ef[e] = !0), !1);
}
function e1(e, t, r, n) {
  if (r !== null && r.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return n
        ? !1
        : r !== null
          ? !r.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function t1(e, t, r, n) {
  if (t === null || typeof t > "u" || e1(e, t, r, n)) return !0;
  if (n) return !1;
  if (r !== null)
    switch (r.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Qe(e, t, r, n, a, s, o) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = n),
    (this.attributeNamespace = a),
    (this.mustUseProperty = r),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = o));
}
var Ie = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Ie[e] = new Qe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Ie[t] = new Qe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Ie[e] = new Qe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Ie[e] = new Qe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Ie[e] = new Qe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Ie[e] = new Qe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Ie[e] = new Qe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Ie[e] = new Qe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Ie[e] = new Qe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Pd = /[\-:]([a-z])/g;
function Rd(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Pd, Rd);
    Ie[t] = new Qe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Pd, Rd);
    Ie[t] = new Qe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Pd, Rd);
  Ie[t] = new Qe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Ie[e] = new Qe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ie.xlinkHref = new Qe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Ie[e] = new Qe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Od(e, t, r, n) {
  var a = Ie.hasOwnProperty(t) ? Ie[t] : null;
  (a !== null
    ? a.type !== 0
    : n ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (t1(t, r, a, n) && (r = null),
    n || a === null
      ? Zx(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r))
      : a.mustUseProperty
        ? (e[a.propertyName] = r === null ? (a.type === 3 ? !1 : "") : r)
        : ((t = a.attributeName),
          (n = a.attributeNamespace),
          r === null
            ? e.removeAttribute(t)
            : ((a = a.type),
              (r = a === 3 || (a === 4 && r === !0) ? "" : "" + r),
              n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
}
var kr = Yx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Ao = Symbol.for("react.element"),
  ua = Symbol.for("react.portal"),
  da = Symbol.for("react.fragment"),
  Ad = Symbol.for("react.strict_mode"),
  eu = Symbol.for("react.profiler"),
  bg = Symbol.for("react.provider"),
  wg = Symbol.for("react.context"),
  Md = Symbol.for("react.forward_ref"),
  tu = Symbol.for("react.suspense"),
  ru = Symbol.for("react.suspense_list"),
  Id = Symbol.for("react.memo"),
  Or = Symbol.for("react.lazy"),
  xg = Symbol.for("react.offscreen"),
  Cf = Symbol.iterator;
function Za(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Cf && e[Cf]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ye = Object.assign,
  rc;
function bs(e) {
  if (rc === void 0)
    try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      rc = (t && t[1]) || "";
    }
  return (
    `
` +
    rc +
    e
  );
}
var nc = !1;
function ac(e, t) {
  if (!e || nc) return "";
  nc = !0;
  var r = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var n = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          n = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        n = u;
      }
      e();
    }
  } catch (u) {
    if (u && n && typeof u.stack == "string") {
      for (
        var a = u.stack.split(`
`),
          s = n.stack.split(`
`),
          o = a.length - 1,
          i = s.length - 1;
        1 <= o && 0 <= i && a[o] !== s[i];

      )
        i--;
      for (; 1 <= o && 0 <= i; o--, i--)
        if (a[o] !== s[i]) {
          if (o !== 1 || i !== 1)
            do
              if ((o--, i--, 0 > i || a[o] !== s[i])) {
                var l =
                  `
` + a[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    l.includes("<anonymous>") &&
                    (l = l.replace("<anonymous>", e.displayName)),
                  l
                );
              }
            while (1 <= o && 0 <= i);
          break;
        }
    }
  } finally {
    ((nc = !1), (Error.prepareStackTrace = r));
  }
  return (e = e ? e.displayName || e.name : "") ? bs(e) : "";
}
function r1(e) {
  switch (e.tag) {
    case 5:
      return bs(e.type);
    case 16:
      return bs("Lazy");
    case 13:
      return bs("Suspense");
    case 19:
      return bs("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = ac(e.type, !1)), e);
    case 11:
      return ((e = ac(e.type.render, !1)), e);
    case 1:
      return ((e = ac(e.type, !0)), e);
    default:
      return "";
  }
}
function nu(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case da:
      return "Fragment";
    case ua:
      return "Portal";
    case eu:
      return "Profiler";
    case Ad:
      return "StrictMode";
    case tu:
      return "Suspense";
    case ru:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case wg:
        return (e.displayName || "Context") + ".Consumer";
      case bg:
        return (e._context.displayName || "Context") + ".Provider";
      case Md:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Id:
        return (
          (t = e.displayName || null),
          t !== null ? t : nu(e.type) || "Memo"
        );
      case Or:
        ((t = e._payload), (e = e._init));
        try {
          return nu(e(t));
        } catch {}
    }
  return null;
}
function n1(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return nu(t);
    case 8:
      return t === Ad ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Qr(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function kg(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function a1(e) {
  var t = kg(e) ? "checked" : "value",
    r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    n = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof r < "u" &&
    typeof r.get == "function" &&
    typeof r.set == "function"
  ) {
    var a = r.get,
      s = r.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return a.call(this);
        },
        set: function (o) {
          ((n = "" + o), s.call(this, o));
        },
      }),
      Object.defineProperty(e, t, { enumerable: r.enumerable }),
      {
        getValue: function () {
          return n;
        },
        setValue: function (o) {
          n = "" + o;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function Mo(e) {
  e._valueTracker || (e._valueTracker = a1(e));
}
function Sg(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var r = t.getValue(),
    n = "";
  return (
    e && (n = kg(e) ? (e.checked ? "true" : "false") : e.value),
    (e = n),
    e !== r ? (t.setValue(e), !0) : !1
  );
}
function Ei(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function au(e, t) {
  var r = t.checked;
  return ye({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: r ?? e._wrapperState.initialChecked,
  });
}
function Tf(e, t) {
  var r = t.defaultValue == null ? "" : t.defaultValue,
    n = t.checked != null ? t.checked : t.defaultChecked;
  ((r = Qr(t.value != null ? t.value : r)),
    (e._wrapperState = {
      initialChecked: n,
      initialValue: r,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function _g(e, t) {
  ((t = t.checked), t != null && Od(e, "checked", t, !1));
}
function su(e, t) {
  _g(e, t);
  var r = Qr(t.value),
    n = t.type;
  if (r != null)
    n === "number"
      ? ((r === 0 && e.value === "") || e.value != r) && (e.value = "" + r)
      : e.value !== "" + r && (e.value = "" + r);
  else if (n === "submit" || n === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? ou(e, t.type, r)
    : t.hasOwnProperty("defaultValue") && ou(e, t.type, Qr(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function Pf(e, t, r) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var n = t.type;
    if (
      !(
        (n !== "submit" && n !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = "" + e._wrapperState.initialValue),
      r || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((r = e.name),
    r !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    r !== "" && (e.name = r));
}
function ou(e, t, r) {
  (t !== "number" || Ei(e.ownerDocument) !== e) &&
    (r == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
}
var ws = Array.isArray;
function ka(e, t, r, n) {
  if (((e = e.options), t)) {
    t = {};
    for (var a = 0; a < r.length; a++) t["$" + r[a]] = !0;
    for (r = 0; r < e.length; r++)
      ((a = t.hasOwnProperty("$" + e[r].value)),
        e[r].selected !== a && (e[r].selected = a),
        a && n && (e[r].defaultSelected = !0));
  } else {
    for (r = "" + Qr(r), t = null, a = 0; a < e.length; a++) {
      if (e[a].value === r) {
        ((e[a].selected = !0), n && (e[a].defaultSelected = !0));
        return;
      }
      t !== null || e[a].disabled || (t = e[a]);
    }
    t !== null && (t.selected = !0);
  }
}
function iu(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(P(91));
  return ye({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Rf(e, t) {
  var r = t.value;
  if (r == null) {
    if (((r = t.children), (t = t.defaultValue), r != null)) {
      if (t != null) throw Error(P(92));
      if (ws(r)) {
        if (1 < r.length) throw Error(P(93));
        r = r[0];
      }
      t = r;
    }
    (t == null && (t = ""), (r = t));
  }
  e._wrapperState = { initialValue: Qr(r) };
}
function jg(e, t) {
  var r = Qr(t.value),
    n = Qr(t.defaultValue);
  (r != null &&
    ((r = "" + r),
    r !== e.value && (e.value = r),
    t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)),
    n != null && (e.defaultValue = "" + n));
}
function Of(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Eg(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lu(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Eg(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Io,
  Ng = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, r, n, a) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, r, n, a);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Io = Io || document.createElement("div"),
          Io.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Io.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Us(e, t) {
  if (t) {
    var r = e.firstChild;
    if (r && r === e.lastChild && r.nodeType === 3) {
      r.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Es = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  s1 = ["Webkit", "ms", "Moz", "O"];
Object.keys(Es).forEach(function (e) {
  s1.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Es[t] = Es[e]));
  });
});
function Cg(e, t, r) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : r || typeof t != "number" || t === 0 || (Es.hasOwnProperty(e) && Es[e])
      ? ("" + t).trim()
      : t + "px";
}
function Tg(e, t) {
  e = e.style;
  for (var r in t)
    if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0,
        a = Cg(r, t[r], n);
      (r === "float" && (r = "cssFloat"), n ? e.setProperty(r, a) : (e[r] = a));
    }
}
var o1 = ye(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function cu(e, t) {
  if (t) {
    if (o1[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(P(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(P(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(P(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(P(62));
  }
}
function uu(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var du = null;
function Dd(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var hu = null,
  Sa = null,
  _a = null;
function Af(e) {
  if ((e = go(e))) {
    if (typeof hu != "function") throw Error(P(280));
    var t = e.stateNode;
    t && ((t = fl(t)), hu(e.stateNode, e.type, t));
  }
}
function Pg(e) {
  Sa ? (_a ? _a.push(e) : (_a = [e])) : (Sa = e);
}
function Rg() {
  if (Sa) {
    var e = Sa,
      t = _a;
    if (((_a = Sa = null), Af(e), t)) for (e = 0; e < t.length; e++) Af(t[e]);
  }
}
function Og(e, t) {
  return e(t);
}
function Ag() {}
var sc = !1;
function Mg(e, t, r) {
  if (sc) return e(t, r);
  sc = !0;
  try {
    return Og(e, t, r);
  } finally {
    ((sc = !1), (Sa !== null || _a !== null) && (Ag(), Rg()));
  }
}
function Bs(e, t) {
  var r = e.stateNode;
  if (r === null) return null;
  var n = fl(r);
  if (n === null) return null;
  r = n[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((n = !n.disabled) ||
        ((e = e.type),
        (n = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !n));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (r && typeof r != "function") throw Error(P(231, t, typeof r));
  return r;
}
var fu = !1;
if (gr)
  try {
    var es = {};
    (Object.defineProperty(es, "passive", {
      get: function () {
        fu = !0;
      },
    }),
      window.addEventListener("test", es, es),
      window.removeEventListener("test", es, es));
  } catch {
    fu = !1;
  }
function i1(e, t, r, n, a, s, o, i, l) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(r, u);
  } catch (d) {
    this.onError(d);
  }
}
var Ns = !1,
  Ni = null,
  Ci = !1,
  pu = null,
  l1 = {
    onError: function (e) {
      ((Ns = !0), (Ni = e));
    },
  };
function c1(e, t, r, n, a, s, o, i, l) {
  ((Ns = !1), (Ni = null), i1.apply(l1, arguments));
}
function u1(e, t, r, n, a, s, o, i, l) {
  if ((c1.apply(this, arguments), Ns)) {
    if (Ns) {
      var u = Ni;
      ((Ns = !1), (Ni = null));
    } else throw Error(P(198));
    Ci || ((Ci = !0), (pu = u));
  }
}
function $n(e) {
  var t = e,
    r = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (r = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? r : null;
}
function Ig(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Mf(e) {
  if ($n(e) !== e) throw Error(P(188));
}
function d1(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = $n(e)), t === null)) throw Error(P(188));
    return t !== e ? null : e;
  }
  for (var r = e, n = t; ; ) {
    var a = r.return;
    if (a === null) break;
    var s = a.alternate;
    if (s === null) {
      if (((n = a.return), n !== null)) {
        r = n;
        continue;
      }
      break;
    }
    if (a.child === s.child) {
      for (s = a.child; s; ) {
        if (s === r) return (Mf(a), e);
        if (s === n) return (Mf(a), t);
        s = s.sibling;
      }
      throw Error(P(188));
    }
    if (r.return !== n.return) ((r = a), (n = s));
    else {
      for (var o = !1, i = a.child; i; ) {
        if (i === r) {
          ((o = !0), (r = a), (n = s));
          break;
        }
        if (i === n) {
          ((o = !0), (n = a), (r = s));
          break;
        }
        i = i.sibling;
      }
      if (!o) {
        for (i = s.child; i; ) {
          if (i === r) {
            ((o = !0), (r = s), (n = a));
            break;
          }
          if (i === n) {
            ((o = !0), (n = s), (r = a));
            break;
          }
          i = i.sibling;
        }
        if (!o) throw Error(P(189));
      }
    }
    if (r.alternate !== n) throw Error(P(190));
  }
  if (r.tag !== 3) throw Error(P(188));
  return r.stateNode.current === r ? e : t;
}
function Dg(e) {
  return ((e = d1(e)), e !== null ? Lg(e) : null);
}
function Lg(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Lg(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var $g = ht.unstable_scheduleCallback,
  If = ht.unstable_cancelCallback,
  h1 = ht.unstable_shouldYield,
  f1 = ht.unstable_requestPaint,
  xe = ht.unstable_now,
  p1 = ht.unstable_getCurrentPriorityLevel,
  Ld = ht.unstable_ImmediatePriority,
  Fg = ht.unstable_UserBlockingPriority,
  Ti = ht.unstable_NormalPriority,
  m1 = ht.unstable_LowPriority,
  zg = ht.unstable_IdlePriority,
  cl = null,
  Zt = null;
function g1(e) {
  if (Zt && typeof Zt.onCommitFiberRoot == "function")
    try {
      Zt.onCommitFiberRoot(cl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Dt = Math.clz32 ? Math.clz32 : b1,
  v1 = Math.log,
  y1 = Math.LN2;
function b1(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((v1(e) / y1) | 0)) | 0);
}
var Do = 64,
  Lo = 4194304;
function xs(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Pi(e, t) {
  var r = e.pendingLanes;
  if (r === 0) return 0;
  var n = 0,
    a = e.suspendedLanes,
    s = e.pingedLanes,
    o = r & 268435455;
  if (o !== 0) {
    var i = o & ~a;
    i !== 0 ? (n = xs(i)) : ((s &= o), s !== 0 && (n = xs(s)));
  } else ((o = r & ~a), o !== 0 ? (n = xs(o)) : s !== 0 && (n = xs(s)));
  if (n === 0) return 0;
  if (
    t !== 0 &&
    t !== n &&
    !(t & a) &&
    ((a = n & -n), (s = t & -t), a >= s || (a === 16 && (s & 4194240) !== 0))
  )
    return t;
  if ((n & 4 && (n |= r & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= n; 0 < t; )
      ((r = 31 - Dt(t)), (a = 1 << r), (n |= e[r]), (t &= ~a));
  return n;
}
function w1(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function x1(e, t) {
  for (
    var r = e.suspendedLanes,
      n = e.pingedLanes,
      a = e.expirationTimes,
      s = e.pendingLanes;
    0 < s;

  ) {
    var o = 31 - Dt(s),
      i = 1 << o,
      l = a[o];
    (l === -1
      ? (!(i & r) || i & n) && (a[o] = w1(i, t))
      : l <= t && (e.expiredLanes |= i),
      (s &= ~i));
  }
}
function mu(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Ug() {
  var e = Do;
  return ((Do <<= 1), !(Do & 4194240) && (Do = 64), e);
}
function oc(e) {
  for (var t = [], r = 0; 31 > r; r++) t.push(e);
  return t;
}
function po(e, t, r) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Dt(t)),
    (e[t] = r));
}
function k1(e, t) {
  var r = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var n = e.eventTimes;
  for (e = e.expirationTimes; 0 < r; ) {
    var a = 31 - Dt(r),
      s = 1 << a;
    ((t[a] = 0), (n[a] = -1), (e[a] = -1), (r &= ~s));
  }
}
function $d(e, t) {
  var r = (e.entangledLanes |= t);
  for (e = e.entanglements; r; ) {
    var n = 31 - Dt(r),
      a = 1 << n;
    ((a & t) | (e[n] & t) && (e[n] |= t), (r &= ~a));
  }
}
var ie = 0;
function Bg(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var Wg,
  Fd,
  qg,
  Hg,
  Vg,
  gu = !1,
  $o = [],
  zr = null,
  Ur = null,
  Br = null,
  Ws = new Map(),
  qs = new Map(),
  Mr = [],
  S1 =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Df(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      zr = null;
      break;
    case "dragenter":
    case "dragleave":
      Ur = null;
      break;
    case "mouseover":
    case "mouseout":
      Br = null;
      break;
    case "pointerover":
    case "pointerout":
      Ws.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      qs.delete(t.pointerId);
  }
}
function ts(e, t, r, n, a, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = {
        blockedOn: t,
        domEventName: r,
        eventSystemFlags: n,
        nativeEvent: s,
        targetContainers: [a],
      }),
      t !== null && ((t = go(t)), t !== null && Fd(t)),
      e)
    : ((e.eventSystemFlags |= n),
      (t = e.targetContainers),
      a !== null && t.indexOf(a) === -1 && t.push(a),
      e);
}
function _1(e, t, r, n, a) {
  switch (t) {
    case "focusin":
      return ((zr = ts(zr, e, t, r, n, a)), !0);
    case "dragenter":
      return ((Ur = ts(Ur, e, t, r, n, a)), !0);
    case "mouseover":
      return ((Br = ts(Br, e, t, r, n, a)), !0);
    case "pointerover":
      var s = a.pointerId;
      return (Ws.set(s, ts(Ws.get(s) || null, e, t, r, n, a)), !0);
    case "gotpointercapture":
      return (
        (s = a.pointerId),
        qs.set(s, ts(qs.get(s) || null, e, t, r, n, a)),
        !0
      );
  }
  return !1;
}
function Kg(e) {
  var t = xn(e.target);
  if (t !== null) {
    var r = $n(t);
    if (r !== null) {
      if (((t = r.tag), t === 13)) {
        if (((t = Ig(r)), t !== null)) {
          ((e.blockedOn = t),
            Vg(e.priority, function () {
              qg(r);
            }));
          return;
        }
      } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function di(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var r = vu(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (r === null) {
      r = e.nativeEvent;
      var n = new r.constructor(r.type, r);
      ((du = n), r.target.dispatchEvent(n), (du = null));
    } else return ((t = go(r)), t !== null && Fd(t), (e.blockedOn = r), !1);
    t.shift();
  }
  return !0;
}
function Lf(e, t, r) {
  di(e) && r.delete(t);
}
function j1() {
  ((gu = !1),
    zr !== null && di(zr) && (zr = null),
    Ur !== null && di(Ur) && (Ur = null),
    Br !== null && di(Br) && (Br = null),
    Ws.forEach(Lf),
    qs.forEach(Lf));
}
function rs(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    gu ||
      ((gu = !0),
      ht.unstable_scheduleCallback(ht.unstable_NormalPriority, j1)));
}
function Hs(e) {
  function t(a) {
    return rs(a, e);
  }
  if (0 < $o.length) {
    rs($o[0], e);
    for (var r = 1; r < $o.length; r++) {
      var n = $o[r];
      n.blockedOn === e && (n.blockedOn = null);
    }
  }
  for (
    zr !== null && rs(zr, e),
      Ur !== null && rs(Ur, e),
      Br !== null && rs(Br, e),
      Ws.forEach(t),
      qs.forEach(t),
      r = 0;
    r < Mr.length;
    r++
  )
    ((n = Mr[r]), n.blockedOn === e && (n.blockedOn = null));
  for (; 0 < Mr.length && ((r = Mr[0]), r.blockedOn === null); )
    (Kg(r), r.blockedOn === null && Mr.shift());
}
var ja = kr.ReactCurrentBatchConfig,
  Ri = !0;
function E1(e, t, r, n) {
  var a = ie,
    s = ja.transition;
  ja.transition = null;
  try {
    ((ie = 1), zd(e, t, r, n));
  } finally {
    ((ie = a), (ja.transition = s));
  }
}
function N1(e, t, r, n) {
  var a = ie,
    s = ja.transition;
  ja.transition = null;
  try {
    ((ie = 4), zd(e, t, r, n));
  } finally {
    ((ie = a), (ja.transition = s));
  }
}
function zd(e, t, r, n) {
  if (Ri) {
    var a = vu(e, t, r, n);
    if (a === null) (gc(e, t, n, Oi, r), Df(e, n));
    else if (_1(a, e, t, r, n)) n.stopPropagation();
    else if ((Df(e, n), t & 4 && -1 < S1.indexOf(e))) {
      for (; a !== null; ) {
        var s = go(a);
        if (
          (s !== null && Wg(s),
          (s = vu(e, t, r, n)),
          s === null && gc(e, t, n, Oi, r),
          s === a)
        )
          break;
        a = s;
      }
      a !== null && n.stopPropagation();
    } else gc(e, t, n, null, r);
  }
}
var Oi = null;
function vu(e, t, r, n) {
  if (((Oi = null), (e = Dd(n)), (e = xn(e)), e !== null))
    if (((t = $n(e)), t === null)) e = null;
    else if (((r = t.tag), r === 13)) {
      if (((e = Ig(t)), e !== null)) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((Oi = e), null);
}
function Gg(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (p1()) {
        case Ld:
          return 1;
        case Fg:
          return 4;
        case Ti:
        case m1:
          return 16;
        case zg:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Lr = null,
  Ud = null,
  hi = null;
function Qg() {
  if (hi) return hi;
  var e,
    t = Ud,
    r = t.length,
    n,
    a = "value" in Lr ? Lr.value : Lr.textContent,
    s = a.length;
  for (e = 0; e < r && t[e] === a[e]; e++);
  var o = r - e;
  for (n = 1; n <= o && t[r - n] === a[s - n]; n++);
  return (hi = a.slice(e, 1 < n ? 1 - n : void 0));
}
function fi(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Fo() {
  return !0;
}
function $f() {
  return !1;
}
function pt(e) {
  function t(r, n, a, s, o) {
    ((this._reactName = r),
      (this._targetInst = a),
      (this.type = n),
      (this.nativeEvent = s),
      (this.target = o),
      (this.currentTarget = null));
    for (var i in e)
      e.hasOwnProperty(i) && ((r = e[i]), (this[i] = r ? r(s) : s[i]));
    return (
      (this.isDefaultPrevented = (
        s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
      )
        ? Fo
        : $f),
      (this.isPropagationStopped = $f),
      this
    );
  }
  return (
    ye(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var r = this.nativeEvent;
        r &&
          (r.preventDefault
            ? r.preventDefault()
            : typeof r.returnValue != "unknown" && (r.returnValue = !1),
          (this.isDefaultPrevented = Fo));
      },
      stopPropagation: function () {
        var r = this.nativeEvent;
        r &&
          (r.stopPropagation
            ? r.stopPropagation()
            : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0),
          (this.isPropagationStopped = Fo));
      },
      persist: function () {},
      isPersistent: Fo,
    }),
    t
  );
}
var Ba = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Bd = pt(Ba),
  mo = ye({}, Ba, { view: 0, detail: 0 }),
  C1 = pt(mo),
  ic,
  lc,
  ns,
  ul = ye({}, mo, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Wd,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== ns &&
            (ns && e.type === "mousemove"
              ? ((ic = e.screenX - ns.screenX), (lc = e.screenY - ns.screenY))
              : (lc = ic = 0),
            (ns = e)),
          ic);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : lc;
    },
  }),
  Ff = pt(ul),
  T1 = ye({}, ul, { dataTransfer: 0 }),
  P1 = pt(T1),
  R1 = ye({}, mo, { relatedTarget: 0 }),
  cc = pt(R1),
  O1 = ye({}, Ba, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  A1 = pt(O1),
  M1 = ye({}, Ba, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  I1 = pt(M1),
  D1 = ye({}, Ba, { data: 0 }),
  zf = pt(D1),
  L1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  $1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  F1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function z1(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = F1[e]) ? !!t[e] : !1;
}
function Wd() {
  return z1;
}
var U1 = ye({}, mo, {
    key: function (e) {
      if (e.key) {
        var t = L1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = fi(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? $1[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Wd,
    charCode: function (e) {
      return e.type === "keypress" ? fi(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? fi(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  B1 = pt(U1),
  W1 = ye({}, ul, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Uf = pt(W1),
  q1 = ye({}, mo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Wd,
  }),
  H1 = pt(q1),
  V1 = ye({}, Ba, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  K1 = pt(V1),
  G1 = ye({}, ul, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Q1 = pt(G1),
  J1 = [9, 13, 27, 32],
  qd = gr && "CompositionEvent" in window,
  Cs = null;
gr && "documentMode" in document && (Cs = document.documentMode);
var Y1 = gr && "TextEvent" in window && !Cs,
  Jg = gr && (!qd || (Cs && 8 < Cs && 11 >= Cs)),
  Bf = " ",
  Wf = !1;
function Yg(e, t) {
  switch (e) {
    case "keyup":
      return J1.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Xg(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var ha = !1;
function X1(e, t) {
  switch (e) {
    case "compositionend":
      return Xg(t);
    case "keypress":
      return t.which !== 32 ? null : ((Wf = !0), Bf);
    case "textInput":
      return ((e = t.data), e === Bf && Wf ? null : e);
    default:
      return null;
  }
}
function Z1(e, t) {
  if (ha)
    return e === "compositionend" || (!qd && Yg(e, t))
      ? ((e = Qg()), (hi = Ud = Lr = null), (ha = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Jg && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var ek = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function qf(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!ek[e.type] : t === "textarea";
}
function Zg(e, t, r, n) {
  (Pg(n),
    (t = Ai(t, "onChange")),
    0 < t.length &&
      ((r = new Bd("onChange", "change", null, r, n)),
      e.push({ event: r, listeners: t })));
}
var Ts = null,
  Vs = null;
function tk(e) {
  uv(e, 0);
}
function dl(e) {
  var t = ma(e);
  if (Sg(t)) return e;
}
function rk(e, t) {
  if (e === "change") return t;
}
var ev = !1;
if (gr) {
  var uc;
  if (gr) {
    var dc = "oninput" in document;
    if (!dc) {
      var Hf = document.createElement("div");
      (Hf.setAttribute("oninput", "return;"),
        (dc = typeof Hf.oninput == "function"));
    }
    uc = dc;
  } else uc = !1;
  ev = uc && (!document.documentMode || 9 < document.documentMode);
}
function Vf() {
  Ts && (Ts.detachEvent("onpropertychange", tv), (Vs = Ts = null));
}
function tv(e) {
  if (e.propertyName === "value" && dl(Vs)) {
    var t = [];
    (Zg(t, Vs, e, Dd(e)), Mg(tk, t));
  }
}
function nk(e, t, r) {
  e === "focusin"
    ? (Vf(), (Ts = t), (Vs = r), Ts.attachEvent("onpropertychange", tv))
    : e === "focusout" && Vf();
}
function ak(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return dl(Vs);
}
function sk(e, t) {
  if (e === "click") return dl(t);
}
function ok(e, t) {
  if (e === "input" || e === "change") return dl(t);
}
function ik(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var $t = typeof Object.is == "function" ? Object.is : ik;
function Ks(e, t) {
  if ($t(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var r = Object.keys(e),
    n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (n = 0; n < r.length; n++) {
    var a = r[n];
    if (!Zc.call(t, a) || !$t(e[a], t[a])) return !1;
  }
  return !0;
}
function Kf(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Gf(e, t) {
  var r = Kf(e);
  e = 0;
  for (var n; r; ) {
    if (r.nodeType === 3) {
      if (((n = e + r.textContent.length), e <= t && n >= t))
        return { node: r, offset: t - e };
      e = n;
    }
    e: {
      for (; r; ) {
        if (r.nextSibling) {
          r = r.nextSibling;
          break e;
        }
        r = r.parentNode;
      }
      r = void 0;
    }
    r = Kf(r);
  }
}
function rv(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? rv(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function nv() {
  for (var e = window, t = Ei(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var r = typeof t.contentWindow.location.href == "string";
    } catch {
      r = !1;
    }
    if (r) e = t.contentWindow;
    else break;
    t = Ei(e.document);
  }
  return t;
}
function Hd(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function lk(e) {
  var t = nv(),
    r = e.focusedElem,
    n = e.selectionRange;
  if (
    t !== r &&
    r &&
    r.ownerDocument &&
    rv(r.ownerDocument.documentElement, r)
  ) {
    if (n !== null && Hd(r)) {
      if (
        ((t = n.start),
        (e = n.end),
        e === void 0 && (e = t),
        "selectionStart" in r)
      )
        ((r.selectionStart = t),
          (r.selectionEnd = Math.min(e, r.value.length)));
      else if (
        ((e = ((t = r.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var a = r.textContent.length,
          s = Math.min(n.start, a);
        ((n = n.end === void 0 ? s : Math.min(n.end, a)),
          !e.extend && s > n && ((a = n), (n = s), (s = a)),
          (a = Gf(r, s)));
        var o = Gf(r, n);
        a &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== a.node ||
            e.anchorOffset !== a.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(a.node, a.offset),
          e.removeAllRanges(),
          s > n
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = r; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++)
      ((e = t[r]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var ck = gr && "documentMode" in document && 11 >= document.documentMode,
  fa = null,
  yu = null,
  Ps = null,
  bu = !1;
function Qf(e, t, r) {
  var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
  bu ||
    fa == null ||
    fa !== Ei(n) ||
    ((n = fa),
    "selectionStart" in n && Hd(n)
      ? (n = { start: n.selectionStart, end: n.selectionEnd })
      : ((n = (
          (n.ownerDocument && n.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (n = {
          anchorNode: n.anchorNode,
          anchorOffset: n.anchorOffset,
          focusNode: n.focusNode,
          focusOffset: n.focusOffset,
        })),
    (Ps && Ks(Ps, n)) ||
      ((Ps = n),
      (n = Ai(yu, "onSelect")),
      0 < n.length &&
        ((t = new Bd("onSelect", "select", null, t, r)),
        e.push({ event: t, listeners: n }),
        (t.target = fa))));
}
function zo(e, t) {
  var r = {};
  return (
    (r[e.toLowerCase()] = t.toLowerCase()),
    (r["Webkit" + e] = "webkit" + t),
    (r["Moz" + e] = "moz" + t),
    r
  );
}
var pa = {
    animationend: zo("Animation", "AnimationEnd"),
    animationiteration: zo("Animation", "AnimationIteration"),
    animationstart: zo("Animation", "AnimationStart"),
    transitionend: zo("Transition", "TransitionEnd"),
  },
  hc = {},
  av = {};
gr &&
  ((av = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete pa.animationend.animation,
    delete pa.animationiteration.animation,
    delete pa.animationstart.animation),
  "TransitionEvent" in window || delete pa.transitionend.transition);
function hl(e) {
  if (hc[e]) return hc[e];
  if (!pa[e]) return e;
  var t = pa[e],
    r;
  for (r in t) if (t.hasOwnProperty(r) && r in av) return (hc[e] = t[r]);
  return e;
}
var sv = hl("animationend"),
  ov = hl("animationiteration"),
  iv = hl("animationstart"),
  lv = hl("transitionend"),
  cv = new Map(),
  Jf =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function rn(e, t) {
  (cv.set(e, t), Ln(t, [e]));
}
for (var fc = 0; fc < Jf.length; fc++) {
  var pc = Jf[fc],
    uk = pc.toLowerCase(),
    dk = pc[0].toUpperCase() + pc.slice(1);
  rn(uk, "on" + dk);
}
rn(sv, "onAnimationEnd");
rn(ov, "onAnimationIteration");
rn(iv, "onAnimationStart");
rn("dblclick", "onDoubleClick");
rn("focusin", "onFocus");
rn("focusout", "onBlur");
rn(lv, "onTransitionEnd");
Ra("onMouseEnter", ["mouseout", "mouseover"]);
Ra("onMouseLeave", ["mouseout", "mouseover"]);
Ra("onPointerEnter", ["pointerout", "pointerover"]);
Ra("onPointerLeave", ["pointerout", "pointerover"]);
Ln(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Ln(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Ln("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Ln(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Ln(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Ln(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var ks =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  hk = new Set("cancel close invalid load scroll toggle".split(" ").concat(ks));
function Yf(e, t, r) {
  var n = e.type || "unknown-event";
  ((e.currentTarget = r), u1(n, t, void 0, e), (e.currentTarget = null));
}
function uv(e, t) {
  t = (t & 4) !== 0;
  for (var r = 0; r < e.length; r++) {
    var n = e[r],
      a = n.event;
    n = n.listeners;
    e: {
      var s = void 0;
      if (t)
        for (var o = n.length - 1; 0 <= o; o--) {
          var i = n[o],
            l = i.instance,
            u = i.currentTarget;
          if (((i = i.listener), l !== s && a.isPropagationStopped())) break e;
          (Yf(a, i, u), (s = l));
        }
      else
        for (o = 0; o < n.length; o++) {
          if (
            ((i = n[o]),
            (l = i.instance),
            (u = i.currentTarget),
            (i = i.listener),
            l !== s && a.isPropagationStopped())
          )
            break e;
          (Yf(a, i, u), (s = l));
        }
    }
  }
  if (Ci) throw ((e = pu), (Ci = !1), (pu = null), e);
}
function fe(e, t) {
  var r = t[_u];
  r === void 0 && (r = t[_u] = new Set());
  var n = e + "__bubble";
  r.has(n) || (dv(t, e, 2, !1), r.add(n));
}
function mc(e, t, r) {
  var n = 0;
  (t && (n |= 4), dv(r, e, n, t));
}
var Uo = "_reactListening" + Math.random().toString(36).slice(2);
function Gs(e) {
  if (!e[Uo]) {
    ((e[Uo] = !0),
      yg.forEach(function (r) {
        r !== "selectionchange" && (hk.has(r) || mc(r, !1, e), mc(r, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Uo] || ((t[Uo] = !0), mc("selectionchange", !1, t));
  }
}
function dv(e, t, r, n) {
  switch (Gg(t)) {
    case 1:
      var a = E1;
      break;
    case 4:
      a = N1;
      break;
    default:
      a = zd;
  }
  ((r = a.bind(null, t, r, e)),
    (a = void 0),
    !fu ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (a = !0),
    n
      ? a !== void 0
        ? e.addEventListener(t, r, { capture: !0, passive: a })
        : e.addEventListener(t, r, !0)
      : a !== void 0
        ? e.addEventListener(t, r, { passive: a })
        : e.addEventListener(t, r, !1));
}
function gc(e, t, r, n, a) {
  var s = n;
  if (!(t & 1) && !(t & 2) && n !== null)
    e: for (;;) {
      if (n === null) return;
      var o = n.tag;
      if (o === 3 || o === 4) {
        var i = n.stateNode.containerInfo;
        if (i === a || (i.nodeType === 8 && i.parentNode === a)) break;
        if (o === 4)
          for (o = n.return; o !== null; ) {
            var l = o.tag;
            if (
              (l === 3 || l === 4) &&
              ((l = o.stateNode.containerInfo),
              l === a || (l.nodeType === 8 && l.parentNode === a))
            )
              return;
            o = o.return;
          }
        for (; i !== null; ) {
          if (((o = xn(i)), o === null)) return;
          if (((l = o.tag), l === 5 || l === 6)) {
            n = s = o;
            continue e;
          }
          i = i.parentNode;
        }
      }
      n = n.return;
    }
  Mg(function () {
    var u = s,
      d = Dd(r),
      h = [];
    e: {
      var f = cv.get(e);
      if (f !== void 0) {
        var v = Bd,
          g = e;
        switch (e) {
          case "keypress":
            if (fi(r) === 0) break e;
          case "keydown":
          case "keyup":
            v = B1;
            break;
          case "focusin":
            ((g = "focus"), (v = cc));
            break;
          case "focusout":
            ((g = "blur"), (v = cc));
            break;
          case "beforeblur":
          case "afterblur":
            v = cc;
            break;
          case "click":
            if (r.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Ff;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = P1;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = H1;
            break;
          case sv:
          case ov:
          case iv:
            v = A1;
            break;
          case lv:
            v = K1;
            break;
          case "scroll":
            v = C1;
            break;
          case "wheel":
            v = Q1;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = I1;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = Uf;
        }
        var m = (t & 4) !== 0,
          w = !m && e === "scroll",
          y = m ? (f !== null ? f + "Capture" : null) : f;
        m = [];
        for (var b = u, x; b !== null; ) {
          x = b;
          var k = x.stateNode;
          if (
            (x.tag === 5 &&
              k !== null &&
              ((x = k),
              y !== null && ((k = Bs(b, y)), k != null && m.push(Qs(b, k, x)))),
            w)
          )
            break;
          b = b.return;
        }
        0 < m.length &&
          ((f = new v(f, g, null, r, d)), h.push({ event: f, listeners: m }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((f = e === "mouseover" || e === "pointerover"),
          (v = e === "mouseout" || e === "pointerout"),
          f &&
            r !== du &&
            (g = r.relatedTarget || r.fromElement) &&
            (xn(g) || g[vr]))
        )
          break e;
        if (
          (v || f) &&
          ((f =
            d.window === d
              ? d
              : (f = d.ownerDocument)
                ? f.defaultView || f.parentWindow
                : window),
          v
            ? ((g = r.relatedTarget || r.toElement),
              (v = u),
              (g = g ? xn(g) : null),
              g !== null &&
                ((w = $n(g)), g !== w || (g.tag !== 5 && g.tag !== 6)) &&
                (g = null))
            : ((v = null), (g = u)),
          v !== g)
        ) {
          if (
            ((m = Ff),
            (k = "onMouseLeave"),
            (y = "onMouseEnter"),
            (b = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((m = Uf),
              (k = "onPointerLeave"),
              (y = "onPointerEnter"),
              (b = "pointer")),
            (w = v == null ? f : ma(v)),
            (x = g == null ? f : ma(g)),
            (f = new m(k, b + "leave", v, r, d)),
            (f.target = w),
            (f.relatedTarget = x),
            (k = null),
            xn(d) === u &&
              ((m = new m(y, b + "enter", g, r, d)),
              (m.target = x),
              (m.relatedTarget = w),
              (k = m)),
            (w = k),
            v && g)
          )
            t: {
              for (m = v, y = g, b = 0, x = m; x; x = Kn(x)) b++;
              for (x = 0, k = y; k; k = Kn(k)) x++;
              for (; 0 < b - x; ) ((m = Kn(m)), b--);
              for (; 0 < x - b; ) ((y = Kn(y)), x--);
              for (; b--; ) {
                if (m === y || (y !== null && m === y.alternate)) break t;
                ((m = Kn(m)), (y = Kn(y)));
              }
              m = null;
            }
          else m = null;
          (v !== null && Xf(h, f, v, m, !1),
            g !== null && w !== null && Xf(h, w, g, m, !0));
        }
      }
      e: {
        if (
          ((f = u ? ma(u) : window),
          (v = f.nodeName && f.nodeName.toLowerCase()),
          v === "select" || (v === "input" && f.type === "file"))
        )
          var S = rk;
        else if (qf(f))
          if (ev) S = ok;
          else {
            S = ak;
            var j = nk;
          }
        else
          (v = f.nodeName) &&
            v.toLowerCase() === "input" &&
            (f.type === "checkbox" || f.type === "radio") &&
            (S = sk);
        if (S && (S = S(e, u))) {
          Zg(h, S, r, d);
          break e;
        }
        (j && j(e, f, u),
          e === "focusout" &&
            (j = f._wrapperState) &&
            j.controlled &&
            f.type === "number" &&
            ou(f, "number", f.value));
      }
      switch (((j = u ? ma(u) : window), e)) {
        case "focusin":
          (qf(j) || j.contentEditable === "true") &&
            ((fa = j), (yu = u), (Ps = null));
          break;
        case "focusout":
          Ps = yu = fa = null;
          break;
        case "mousedown":
          bu = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((bu = !1), Qf(h, r, d));
          break;
        case "selectionchange":
          if (ck) break;
        case "keydown":
        case "keyup":
          Qf(h, r, d);
      }
      var _;
      if (qd)
        e: {
          switch (e) {
            case "compositionstart":
              var C = "onCompositionStart";
              break e;
            case "compositionend":
              C = "onCompositionEnd";
              break e;
            case "compositionupdate":
              C = "onCompositionUpdate";
              break e;
          }
          C = void 0;
        }
      else
        ha
          ? Yg(e, r) && (C = "onCompositionEnd")
          : e === "keydown" && r.keyCode === 229 && (C = "onCompositionStart");
      (C &&
        (Jg &&
          r.locale !== "ko" &&
          (ha || C !== "onCompositionStart"
            ? C === "onCompositionEnd" && ha && (_ = Qg())
            : ((Lr = d),
              (Ud = "value" in Lr ? Lr.value : Lr.textContent),
              (ha = !0))),
        (j = Ai(u, C)),
        0 < j.length &&
          ((C = new zf(C, e, null, r, d)),
          h.push({ event: C, listeners: j }),
          _ ? (C.data = _) : ((_ = Xg(r)), _ !== null && (C.data = _)))),
        (_ = Y1 ? X1(e, r) : Z1(e, r)) &&
          ((u = Ai(u, "onBeforeInput")),
          0 < u.length &&
            ((d = new zf("onBeforeInput", "beforeinput", null, r, d)),
            h.push({ event: d, listeners: u }),
            (d.data = _))));
    }
    uv(h, t);
  });
}
function Qs(e, t, r) {
  return { instance: e, listener: t, currentTarget: r };
}
function Ai(e, t) {
  for (var r = t + "Capture", n = []; e !== null; ) {
    var a = e,
      s = a.stateNode;
    (a.tag === 5 &&
      s !== null &&
      ((a = s),
      (s = Bs(e, r)),
      s != null && n.unshift(Qs(e, s, a)),
      (s = Bs(e, t)),
      s != null && n.push(Qs(e, s, a))),
      (e = e.return));
  }
  return n;
}
function Kn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Xf(e, t, r, n, a) {
  for (var s = t._reactName, o = []; r !== null && r !== n; ) {
    var i = r,
      l = i.alternate,
      u = i.stateNode;
    if (l !== null && l === n) break;
    (i.tag === 5 &&
      u !== null &&
      ((i = u),
      a
        ? ((l = Bs(r, s)), l != null && o.unshift(Qs(r, l, i)))
        : a || ((l = Bs(r, s)), l != null && o.push(Qs(r, l, i)))),
      (r = r.return));
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var fk = /\r\n?/g,
  pk = /\u0000|\uFFFD/g;
function Zf(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      fk,
      `
`,
    )
    .replace(pk, "");
}
function Bo(e, t, r) {
  if (((t = Zf(t)), Zf(e) !== t && r)) throw Error(P(425));
}
function Mi() {}
var wu = null,
  xu = null;
function ku(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Su = typeof setTimeout == "function" ? setTimeout : void 0,
  mk = typeof clearTimeout == "function" ? clearTimeout : void 0,
  ep = typeof Promise == "function" ? Promise : void 0,
  gk =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof ep < "u"
        ? function (e) {
            return ep.resolve(null).then(e).catch(vk);
          }
        : Su;
function vk(e) {
  setTimeout(function () {
    throw e;
  });
}
function vc(e, t) {
  var r = t,
    n = 0;
  do {
    var a = r.nextSibling;
    if ((e.removeChild(r), a && a.nodeType === 8))
      if (((r = a.data), r === "/$")) {
        if (n === 0) {
          (e.removeChild(a), Hs(t));
          return;
        }
        n--;
      } else (r !== "$" && r !== "$?" && r !== "$!") || n++;
    r = a;
  } while (r);
  Hs(t);
}
function Wr(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function tp(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var r = e.data;
      if (r === "$" || r === "$!" || r === "$?") {
        if (t === 0) return e;
        t--;
      } else r === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Wa = Math.random().toString(36).slice(2),
  Jt = "__reactFiber$" + Wa,
  Js = "__reactProps$" + Wa,
  vr = "__reactContainer$" + Wa,
  _u = "__reactEvents$" + Wa,
  yk = "__reactListeners$" + Wa,
  bk = "__reactHandles$" + Wa;
function xn(e) {
  var t = e[Jt];
  if (t) return t;
  for (var r = e.parentNode; r; ) {
    if ((t = r[vr] || r[Jt])) {
      if (
        ((r = t.alternate),
        t.child !== null || (r !== null && r.child !== null))
      )
        for (e = tp(e); e !== null; ) {
          if ((r = e[Jt])) return r;
          e = tp(e);
        }
      return t;
    }
    ((e = r), (r = e.parentNode));
  }
  return null;
}
function go(e) {
  return (
    (e = e[Jt] || e[vr]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function ma(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(P(33));
}
function fl(e) {
  return e[Js] || null;
}
var ju = [],
  ga = -1;
function nn(e) {
  return { current: e };
}
function pe(e) {
  0 > ga || ((e.current = ju[ga]), (ju[ga] = null), ga--);
}
function ue(e, t) {
  (ga++, (ju[ga] = e.current), (e.current = t));
}
var Jr = {},
  ze = nn(Jr),
  nt = nn(!1),
  Tn = Jr;
function Oa(e, t) {
  var r = e.type.contextTypes;
  if (!r) return Jr;
  var n = e.stateNode;
  if (n && n.__reactInternalMemoizedUnmaskedChildContext === t)
    return n.__reactInternalMemoizedMaskedChildContext;
  var a = {},
    s;
  for (s in r) a[s] = t[s];
  return (
    n &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = a)),
    a
  );
}
function at(e) {
  return ((e = e.childContextTypes), e != null);
}
function Ii() {
  (pe(nt), pe(ze));
}
function rp(e, t, r) {
  if (ze.current !== Jr) throw Error(P(168));
  (ue(ze, t), ue(nt, r));
}
function hv(e, t, r) {
  var n = e.stateNode;
  if (((t = t.childContextTypes), typeof n.getChildContext != "function"))
    return r;
  n = n.getChildContext();
  for (var a in n) if (!(a in t)) throw Error(P(108, n1(e) || "Unknown", a));
  return ye({}, r, n);
}
function Di(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Jr),
    (Tn = ze.current),
    ue(ze, e),
    ue(nt, nt.current),
    !0
  );
}
function np(e, t, r) {
  var n = e.stateNode;
  if (!n) throw Error(P(169));
  (r
    ? ((e = hv(e, t, Tn)),
      (n.__reactInternalMemoizedMergedChildContext = e),
      pe(nt),
      pe(ze),
      ue(ze, e))
    : pe(nt),
    ue(nt, r));
}
var hr = null,
  pl = !1,
  yc = !1;
function fv(e) {
  hr === null ? (hr = [e]) : hr.push(e);
}
function wk(e) {
  ((pl = !0), fv(e));
}
function an() {
  if (!yc && hr !== null) {
    yc = !0;
    var e = 0,
      t = ie;
    try {
      var r = hr;
      for (ie = 1; e < r.length; e++) {
        var n = r[e];
        do n = n(!0);
        while (n !== null);
      }
      ((hr = null), (pl = !1));
    } catch (a) {
      throw (hr !== null && (hr = hr.slice(e + 1)), $g(Ld, an), a);
    } finally {
      ((ie = t), (yc = !1));
    }
  }
  return null;
}
var va = [],
  ya = 0,
  Li = null,
  $i = 0,
  gt = [],
  vt = 0,
  Pn = null,
  fr = 1,
  pr = "";
function vn(e, t) {
  ((va[ya++] = $i), (va[ya++] = Li), (Li = e), ($i = t));
}
function pv(e, t, r) {
  ((gt[vt++] = fr), (gt[vt++] = pr), (gt[vt++] = Pn), (Pn = e));
  var n = fr;
  e = pr;
  var a = 32 - Dt(n) - 1;
  ((n &= ~(1 << a)), (r += 1));
  var s = 32 - Dt(t) + a;
  if (30 < s) {
    var o = a - (a % 5);
    ((s = (n & ((1 << o) - 1)).toString(32)),
      (n >>= o),
      (a -= o),
      (fr = (1 << (32 - Dt(t) + a)) | (r << a) | n),
      (pr = s + e));
  } else ((fr = (1 << s) | (r << a) | n), (pr = e));
}
function Vd(e) {
  e.return !== null && (vn(e, 1), pv(e, 1, 0));
}
function Kd(e) {
  for (; e === Li; )
    ((Li = va[--ya]), (va[ya] = null), ($i = va[--ya]), (va[ya] = null));
  for (; e === Pn; )
    ((Pn = gt[--vt]),
      (gt[vt] = null),
      (pr = gt[--vt]),
      (gt[vt] = null),
      (fr = gt[--vt]),
      (gt[vt] = null));
}
var ut = null,
  ct = null,
  me = !1,
  Ot = null;
function mv(e, t) {
  var r = yt(5, null, null, 0);
  ((r.elementType = "DELETED"),
    (r.stateNode = t),
    (r.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [r]), (e.flags |= 16)) : t.push(r));
}
function ap(e, t) {
  switch (e.tag) {
    case 5:
      var r = e.type;
      return (
        (t =
          t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (ut = e), (ct = Wr(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (ut = e), (ct = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((r = Pn !== null ? { id: fr, overflow: pr } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: r,
              retryLane: 1073741824,
            }),
            (r = yt(18, null, null, 0)),
            (r.stateNode = t),
            (r.return = e),
            (e.child = r),
            (ut = e),
            (ct = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Eu(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Nu(e) {
  if (me) {
    var t = ct;
    if (t) {
      var r = t;
      if (!ap(e, t)) {
        if (Eu(e)) throw Error(P(418));
        t = Wr(r.nextSibling);
        var n = ut;
        t && ap(e, t)
          ? mv(n, r)
          : ((e.flags = (e.flags & -4097) | 2), (me = !1), (ut = e));
      }
    } else {
      if (Eu(e)) throw Error(P(418));
      ((e.flags = (e.flags & -4097) | 2), (me = !1), (ut = e));
    }
  }
}
function sp(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  ut = e;
}
function Wo(e) {
  if (e !== ut) return !1;
  if (!me) return (sp(e), (me = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !ku(e.type, e.memoizedProps))),
    t && (t = ct))
  ) {
    if (Eu(e)) throw (gv(), Error(P(418)));
    for (; t; ) (mv(e, t), (t = Wr(t.nextSibling)));
  }
  if ((sp(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(P(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "/$") {
            if (t === 0) {
              ct = Wr(e.nextSibling);
              break e;
            }
            t--;
          } else (r !== "$" && r !== "$!" && r !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      ct = null;
    }
  } else ct = ut ? Wr(e.stateNode.nextSibling) : null;
  return !0;
}
function gv() {
  for (var e = ct; e; ) e = Wr(e.nextSibling);
}
function Aa() {
  ((ct = ut = null), (me = !1));
}
function Gd(e) {
  Ot === null ? (Ot = [e]) : Ot.push(e);
}
var xk = kr.ReactCurrentBatchConfig;
function as(e, t, r) {
  if (
    ((e = r.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (r._owner) {
      if (((r = r._owner), r)) {
        if (r.tag !== 1) throw Error(P(309));
        var n = r.stateNode;
      }
      if (!n) throw Error(P(147, e));
      var a = n,
        s = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === s
        ? t.ref
        : ((t = function (o) {
            var i = a.refs;
            o === null ? delete i[s] : (i[s] = o);
          }),
          (t._stringRef = s),
          t);
    }
    if (typeof e != "string") throw Error(P(284));
    if (!r._owner) throw Error(P(290, e));
  }
  return e;
}
function qo(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      P(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function op(e) {
  var t = e._init;
  return t(e._payload);
}
function vv(e) {
  function t(y, b) {
    if (e) {
      var x = y.deletions;
      x === null ? ((y.deletions = [b]), (y.flags |= 16)) : x.push(b);
    }
  }
  function r(y, b) {
    if (!e) return null;
    for (; b !== null; ) (t(y, b), (b = b.sibling));
    return null;
  }
  function n(y, b) {
    for (y = new Map(); b !== null; )
      (b.key !== null ? y.set(b.key, b) : y.set(b.index, b), (b = b.sibling));
    return y;
  }
  function a(y, b) {
    return ((y = Kr(y, b)), (y.index = 0), (y.sibling = null), y);
  }
  function s(y, b, x) {
    return (
      (y.index = x),
      e
        ? ((x = y.alternate),
          x !== null
            ? ((x = x.index), x < b ? ((y.flags |= 2), b) : x)
            : ((y.flags |= 2), b))
        : ((y.flags |= 1048576), b)
    );
  }
  function o(y) {
    return (e && y.alternate === null && (y.flags |= 2), y);
  }
  function i(y, b, x, k) {
    return b === null || b.tag !== 6
      ? ((b = jc(x, y.mode, k)), (b.return = y), b)
      : ((b = a(b, x)), (b.return = y), b);
  }
  function l(y, b, x, k) {
    var S = x.type;
    return S === da
      ? d(y, b, x.props.children, k, x.key)
      : b !== null &&
          (b.elementType === S ||
            (typeof S == "object" &&
              S !== null &&
              S.$$typeof === Or &&
              op(S) === b.type))
        ? ((k = a(b, x.props)), (k.ref = as(y, b, x)), (k.return = y), k)
        : ((k = wi(x.type, x.key, x.props, null, y.mode, k)),
          (k.ref = as(y, b, x)),
          (k.return = y),
          k);
  }
  function u(y, b, x, k) {
    return b === null ||
      b.tag !== 4 ||
      b.stateNode.containerInfo !== x.containerInfo ||
      b.stateNode.implementation !== x.implementation
      ? ((b = Ec(x, y.mode, k)), (b.return = y), b)
      : ((b = a(b, x.children || [])), (b.return = y), b);
  }
  function d(y, b, x, k, S) {
    return b === null || b.tag !== 7
      ? ((b = En(x, y.mode, k, S)), (b.return = y), b)
      : ((b = a(b, x)), (b.return = y), b);
  }
  function h(y, b, x) {
    if ((typeof b == "string" && b !== "") || typeof b == "number")
      return ((b = jc("" + b, y.mode, x)), (b.return = y), b);
    if (typeof b == "object" && b !== null) {
      switch (b.$$typeof) {
        case Ao:
          return (
            (x = wi(b.type, b.key, b.props, null, y.mode, x)),
            (x.ref = as(y, null, b)),
            (x.return = y),
            x
          );
        case ua:
          return ((b = Ec(b, y.mode, x)), (b.return = y), b);
        case Or:
          var k = b._init;
          return h(y, k(b._payload), x);
      }
      if (ws(b) || Za(b))
        return ((b = En(b, y.mode, x, null)), (b.return = y), b);
      qo(y, b);
    }
    return null;
  }
  function f(y, b, x, k) {
    var S = b !== null ? b.key : null;
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return S !== null ? null : i(y, b, "" + x, k);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case Ao:
          return x.key === S ? l(y, b, x, k) : null;
        case ua:
          return x.key === S ? u(y, b, x, k) : null;
        case Or:
          return ((S = x._init), f(y, b, S(x._payload), k));
      }
      if (ws(x) || Za(x)) return S !== null ? null : d(y, b, x, k, null);
      qo(y, x);
    }
    return null;
  }
  function v(y, b, x, k, S) {
    if ((typeof k == "string" && k !== "") || typeof k == "number")
      return ((y = y.get(x) || null), i(b, y, "" + k, S));
    if (typeof k == "object" && k !== null) {
      switch (k.$$typeof) {
        case Ao:
          return (
            (y = y.get(k.key === null ? x : k.key) || null),
            l(b, y, k, S)
          );
        case ua:
          return (
            (y = y.get(k.key === null ? x : k.key) || null),
            u(b, y, k, S)
          );
        case Or:
          var j = k._init;
          return v(y, b, x, j(k._payload), S);
      }
      if (ws(k) || Za(k)) return ((y = y.get(x) || null), d(b, y, k, S, null));
      qo(b, k);
    }
    return null;
  }
  function g(y, b, x, k) {
    for (
      var S = null, j = null, _ = b, C = (b = 0), D = null;
      _ !== null && C < x.length;
      C++
    ) {
      _.index > C ? ((D = _), (_ = null)) : (D = _.sibling);
      var O = f(y, _, x[C], k);
      if (O === null) {
        _ === null && (_ = D);
        break;
      }
      (e && _ && O.alternate === null && t(y, _),
        (b = s(O, b, C)),
        j === null ? (S = O) : (j.sibling = O),
        (j = O),
        (_ = D));
    }
    if (C === x.length) return (r(y, _), me && vn(y, C), S);
    if (_ === null) {
      for (; C < x.length; C++)
        ((_ = h(y, x[C], k)),
          _ !== null &&
            ((b = s(_, b, C)),
            j === null ? (S = _) : (j.sibling = _),
            (j = _)));
      return (me && vn(y, C), S);
    }
    for (_ = n(y, _); C < x.length; C++)
      ((D = v(_, y, C, x[C], k)),
        D !== null &&
          (e && D.alternate !== null && _.delete(D.key === null ? C : D.key),
          (b = s(D, b, C)),
          j === null ? (S = D) : (j.sibling = D),
          (j = D)));
    return (
      e &&
        _.forEach(function (U) {
          return t(y, U);
        }),
      me && vn(y, C),
      S
    );
  }
  function m(y, b, x, k) {
    var S = Za(x);
    if (typeof S != "function") throw Error(P(150));
    if (((x = S.call(x)), x == null)) throw Error(P(151));
    for (
      var j = (S = null), _ = b, C = (b = 0), D = null, O = x.next();
      _ !== null && !O.done;
      C++, O = x.next()
    ) {
      _.index > C ? ((D = _), (_ = null)) : (D = _.sibling);
      var U = f(y, _, O.value, k);
      if (U === null) {
        _ === null && (_ = D);
        break;
      }
      (e && _ && U.alternate === null && t(y, _),
        (b = s(U, b, C)),
        j === null ? (S = U) : (j.sibling = U),
        (j = U),
        (_ = D));
    }
    if (O.done) return (r(y, _), me && vn(y, C), S);
    if (_ === null) {
      for (; !O.done; C++, O = x.next())
        ((O = h(y, O.value, k)),
          O !== null &&
            ((b = s(O, b, C)),
            j === null ? (S = O) : (j.sibling = O),
            (j = O)));
      return (me && vn(y, C), S);
    }
    for (_ = n(y, _); !O.done; C++, O = x.next())
      ((O = v(_, y, C, O.value, k)),
        O !== null &&
          (e && O.alternate !== null && _.delete(O.key === null ? C : O.key),
          (b = s(O, b, C)),
          j === null ? (S = O) : (j.sibling = O),
          (j = O)));
    return (
      e &&
        _.forEach(function ($) {
          return t(y, $);
        }),
      me && vn(y, C),
      S
    );
  }
  function w(y, b, x, k) {
    if (
      (typeof x == "object" &&
        x !== null &&
        x.type === da &&
        x.key === null &&
        (x = x.props.children),
      typeof x == "object" && x !== null)
    ) {
      switch (x.$$typeof) {
        case Ao:
          e: {
            for (var S = x.key, j = b; j !== null; ) {
              if (j.key === S) {
                if (((S = x.type), S === da)) {
                  if (j.tag === 7) {
                    (r(y, j.sibling),
                      (b = a(j, x.props.children)),
                      (b.return = y),
                      (y = b));
                    break e;
                  }
                } else if (
                  j.elementType === S ||
                  (typeof S == "object" &&
                    S !== null &&
                    S.$$typeof === Or &&
                    op(S) === j.type)
                ) {
                  (r(y, j.sibling),
                    (b = a(j, x.props)),
                    (b.ref = as(y, j, x)),
                    (b.return = y),
                    (y = b));
                  break e;
                }
                r(y, j);
                break;
              } else t(y, j);
              j = j.sibling;
            }
            x.type === da
              ? ((b = En(x.props.children, y.mode, k, x.key)),
                (b.return = y),
                (y = b))
              : ((k = wi(x.type, x.key, x.props, null, y.mode, k)),
                (k.ref = as(y, b, x)),
                (k.return = y),
                (y = k));
          }
          return o(y);
        case ua:
          e: {
            for (j = x.key; b !== null; ) {
              if (b.key === j)
                if (
                  b.tag === 4 &&
                  b.stateNode.containerInfo === x.containerInfo &&
                  b.stateNode.implementation === x.implementation
                ) {
                  (r(y, b.sibling),
                    (b = a(b, x.children || [])),
                    (b.return = y),
                    (y = b));
                  break e;
                } else {
                  r(y, b);
                  break;
                }
              else t(y, b);
              b = b.sibling;
            }
            ((b = Ec(x, y.mode, k)), (b.return = y), (y = b));
          }
          return o(y);
        case Or:
          return ((j = x._init), w(y, b, j(x._payload), k));
      }
      if (ws(x)) return g(y, b, x, k);
      if (Za(x)) return m(y, b, x, k);
      qo(y, x);
    }
    return (typeof x == "string" && x !== "") || typeof x == "number"
      ? ((x = "" + x),
        b !== null && b.tag === 6
          ? (r(y, b.sibling), (b = a(b, x)), (b.return = y), (y = b))
          : (r(y, b), (b = jc(x, y.mode, k)), (b.return = y), (y = b)),
        o(y))
      : r(y, b);
  }
  return w;
}
var Ma = vv(!0),
  yv = vv(!1),
  Fi = nn(null),
  zi = null,
  ba = null,
  Qd = null;
function Jd() {
  Qd = ba = zi = null;
}
function Yd(e) {
  var t = Fi.current;
  (pe(Fi), (e._currentValue = t));
}
function Cu(e, t, r) {
  for (; e !== null; ) {
    var n = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), n !== null && (n.childLanes |= t))
        : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t),
      e === r)
    )
      break;
    e = e.return;
  }
}
function Ea(e, t) {
  ((zi = e),
    (Qd = ba = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (rt = !0), (e.firstContext = null)));
}
function kt(e) {
  var t = e._currentValue;
  if (Qd !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), ba === null)) {
      if (zi === null) throw Error(P(308));
      ((ba = e), (zi.dependencies = { lanes: 0, firstContext: e }));
    } else ba = ba.next = e;
  return t;
}
var kn = null;
function Xd(e) {
  kn === null ? (kn = [e]) : kn.push(e);
}
function bv(e, t, r, n) {
  var a = t.interleaved;
  return (
    a === null ? ((r.next = r), Xd(t)) : ((r.next = a.next), (a.next = r)),
    (t.interleaved = r),
    yr(e, n)
  );
}
function yr(e, t) {
  e.lanes |= t;
  var r = e.alternate;
  for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (r = e.alternate),
      r !== null && (r.childLanes |= t),
      (r = e),
      (e = e.return));
  return r.tag === 3 ? r.stateNode : null;
}
var Ar = !1;
function Zd(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function wv(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function mr(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function qr(e, t, r) {
  var n = e.updateQueue;
  if (n === null) return null;
  if (((n = n.shared), ne & 2)) {
    var a = n.pending;
    return (
      a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)),
      (n.pending = t),
      yr(e, r)
    );
  }
  return (
    (a = n.interleaved),
    a === null ? ((t.next = t), Xd(n)) : ((t.next = a.next), (a.next = t)),
    (n.interleaved = t),
    yr(e, r)
  );
}
function pi(e, t, r) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (r & 4194240) !== 0))
  ) {
    var n = t.lanes;
    ((n &= e.pendingLanes), (r |= n), (t.lanes = r), $d(e, r));
  }
}
function ip(e, t) {
  var r = e.updateQueue,
    n = e.alternate;
  if (n !== null && ((n = n.updateQueue), r === n)) {
    var a = null,
      s = null;
    if (((r = r.firstBaseUpdate), r !== null)) {
      do {
        var o = {
          eventTime: r.eventTime,
          lane: r.lane,
          tag: r.tag,
          payload: r.payload,
          callback: r.callback,
          next: null,
        };
        (s === null ? (a = s = o) : (s = s.next = o), (r = r.next));
      } while (r !== null);
      s === null ? (a = s = t) : (s = s.next = t);
    } else a = s = t;
    ((r = {
      baseState: n.baseState,
      firstBaseUpdate: a,
      lastBaseUpdate: s,
      shared: n.shared,
      effects: n.effects,
    }),
      (e.updateQueue = r));
    return;
  }
  ((e = r.lastBaseUpdate),
    e === null ? (r.firstBaseUpdate = t) : (e.next = t),
    (r.lastBaseUpdate = t));
}
function Ui(e, t, r, n) {
  var a = e.updateQueue;
  Ar = !1;
  var s = a.firstBaseUpdate,
    o = a.lastBaseUpdate,
    i = a.shared.pending;
  if (i !== null) {
    a.shared.pending = null;
    var l = i,
      u = l.next;
    ((l.next = null), o === null ? (s = u) : (o.next = u), (o = l));
    var d = e.alternate;
    d !== null &&
      ((d = d.updateQueue),
      (i = d.lastBaseUpdate),
      i !== o &&
        (i === null ? (d.firstBaseUpdate = u) : (i.next = u),
        (d.lastBaseUpdate = l)));
  }
  if (s !== null) {
    var h = a.baseState;
    ((o = 0), (d = u = l = null), (i = s));
    do {
      var f = i.lane,
        v = i.eventTime;
      if ((n & f) === f) {
        d !== null &&
          (d = d.next =
            {
              eventTime: v,
              lane: 0,
              tag: i.tag,
              payload: i.payload,
              callback: i.callback,
              next: null,
            });
        e: {
          var g = e,
            m = i;
          switch (((f = t), (v = r), m.tag)) {
            case 1:
              if (((g = m.payload), typeof g == "function")) {
                h = g.call(v, h, f);
                break e;
              }
              h = g;
              break e;
            case 3:
              g.flags = (g.flags & -65537) | 128;
            case 0:
              if (
                ((g = m.payload),
                (f = typeof g == "function" ? g.call(v, h, f) : g),
                f == null)
              )
                break e;
              h = ye({}, h, f);
              break e;
            case 2:
              Ar = !0;
          }
        }
        i.callback !== null &&
          i.lane !== 0 &&
          ((e.flags |= 64),
          (f = a.effects),
          f === null ? (a.effects = [i]) : f.push(i));
      } else
        ((v = {
          eventTime: v,
          lane: f,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null,
        }),
          d === null ? ((u = d = v), (l = h)) : (d = d.next = v),
          (o |= f));
      if (((i = i.next), i === null)) {
        if (((i = a.shared.pending), i === null)) break;
        ((f = i),
          (i = f.next),
          (f.next = null),
          (a.lastBaseUpdate = f),
          (a.shared.pending = null));
      }
    } while (!0);
    if (
      (d === null && (l = h),
      (a.baseState = l),
      (a.firstBaseUpdate = u),
      (a.lastBaseUpdate = d),
      (t = a.shared.interleaved),
      t !== null)
    ) {
      a = t;
      do ((o |= a.lane), (a = a.next));
      while (a !== t);
    } else s === null && (a.shared.lanes = 0);
    ((On |= o), (e.lanes = o), (e.memoizedState = h));
  }
}
function lp(e, t, r) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var n = e[t],
        a = n.callback;
      if (a !== null) {
        if (((n.callback = null), (n = r), typeof a != "function"))
          throw Error(P(191, a));
        a.call(n);
      }
    }
}
var vo = {},
  er = nn(vo),
  Ys = nn(vo),
  Xs = nn(vo);
function Sn(e) {
  if (e === vo) throw Error(P(174));
  return e;
}
function eh(e, t) {
  switch ((ue(Xs, t), ue(Ys, e), ue(er, vo), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : lu(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = lu(t, e)));
  }
  (pe(er), ue(er, t));
}
function Ia() {
  (pe(er), pe(Ys), pe(Xs));
}
function xv(e) {
  Sn(Xs.current);
  var t = Sn(er.current),
    r = lu(t, e.type);
  t !== r && (ue(Ys, e), ue(er, r));
}
function th(e) {
  Ys.current === e && (pe(er), pe(Ys));
}
var ge = nn(0);
function Bi(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var r = t.memoizedState;
      if (
        r !== null &&
        ((r = r.dehydrated), r === null || r.data === "$?" || r.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var bc = [];
function rh() {
  for (var e = 0; e < bc.length; e++)
    bc[e]._workInProgressVersionPrimary = null;
  bc.length = 0;
}
var mi = kr.ReactCurrentDispatcher,
  wc = kr.ReactCurrentBatchConfig,
  Rn = 0,
  ve = null,
  Ee = null,
  Te = null,
  Wi = !1,
  Rs = !1,
  Zs = 0,
  kk = 0;
function De() {
  throw Error(P(321));
}
function nh(e, t) {
  if (t === null) return !1;
  for (var r = 0; r < t.length && r < e.length; r++)
    if (!$t(e[r], t[r])) return !1;
  return !0;
}
function ah(e, t, r, n, a, s) {
  if (
    ((Rn = s),
    (ve = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (mi.current = e === null || e.memoizedState === null ? Ek : Nk),
    (e = r(n, a)),
    Rs)
  ) {
    s = 0;
    do {
      if (((Rs = !1), (Zs = 0), 25 <= s)) throw Error(P(301));
      ((s += 1),
        (Te = Ee = null),
        (t.updateQueue = null),
        (mi.current = Ck),
        (e = r(n, a)));
    } while (Rs);
  }
  if (
    ((mi.current = qi),
    (t = Ee !== null && Ee.next !== null),
    (Rn = 0),
    (Te = Ee = ve = null),
    (Wi = !1),
    t)
  )
    throw Error(P(300));
  return e;
}
function sh() {
  var e = Zs !== 0;
  return ((Zs = 0), e);
}
function Qt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (Te === null ? (ve.memoizedState = Te = e) : (Te = Te.next = e), Te);
}
function St() {
  if (Ee === null) {
    var e = ve.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Ee.next;
  var t = Te === null ? ve.memoizedState : Te.next;
  if (t !== null) ((Te = t), (Ee = e));
  else {
    if (e === null) throw Error(P(310));
    ((Ee = e),
      (e = {
        memoizedState: Ee.memoizedState,
        baseState: Ee.baseState,
        baseQueue: Ee.baseQueue,
        queue: Ee.queue,
        next: null,
      }),
      Te === null ? (ve.memoizedState = Te = e) : (Te = Te.next = e));
  }
  return Te;
}
function eo(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function xc(e) {
  var t = St(),
    r = t.queue;
  if (r === null) throw Error(P(311));
  r.lastRenderedReducer = e;
  var n = Ee,
    a = n.baseQueue,
    s = r.pending;
  if (s !== null) {
    if (a !== null) {
      var o = a.next;
      ((a.next = s.next), (s.next = o));
    }
    ((n.baseQueue = a = s), (r.pending = null));
  }
  if (a !== null) {
    ((s = a.next), (n = n.baseState));
    var i = (o = null),
      l = null,
      u = s;
    do {
      var d = u.lane;
      if ((Rn & d) === d)
        (l !== null &&
          (l = l.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (n = u.hasEagerState ? u.eagerState : e(n, u.action)));
      else {
        var h = {
          lane: d,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        (l === null ? ((i = l = h), (o = n)) : (l = l.next = h),
          (ve.lanes |= d),
          (On |= d));
      }
      u = u.next;
    } while (u !== null && u !== s);
    (l === null ? (o = n) : (l.next = i),
      $t(n, t.memoizedState) || (rt = !0),
      (t.memoizedState = n),
      (t.baseState = o),
      (t.baseQueue = l),
      (r.lastRenderedState = n));
  }
  if (((e = r.interleaved), e !== null)) {
    a = e;
    do ((s = a.lane), (ve.lanes |= s), (On |= s), (a = a.next));
    while (a !== e);
  } else a === null && (r.lanes = 0);
  return [t.memoizedState, r.dispatch];
}
function kc(e) {
  var t = St(),
    r = t.queue;
  if (r === null) throw Error(P(311));
  r.lastRenderedReducer = e;
  var n = r.dispatch,
    a = r.pending,
    s = t.memoizedState;
  if (a !== null) {
    r.pending = null;
    var o = (a = a.next);
    do ((s = e(s, o.action)), (o = o.next));
    while (o !== a);
    ($t(s, t.memoizedState) || (rt = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (r.lastRenderedState = s));
  }
  return [s, n];
}
function kv() {}
function Sv(e, t) {
  var r = ve,
    n = St(),
    a = t(),
    s = !$t(n.memoizedState, a);
  if (
    (s && ((n.memoizedState = a), (rt = !0)),
    (n = n.queue),
    oh(Ev.bind(null, r, n, e), [e]),
    n.getSnapshot !== t || s || (Te !== null && Te.memoizedState.tag & 1))
  ) {
    if (
      ((r.flags |= 2048),
      to(9, jv.bind(null, r, n, a, t), void 0, null),
      Pe === null)
    )
      throw Error(P(349));
    Rn & 30 || _v(r, t, a);
  }
  return a;
}
function _v(e, t, r) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: r }),
    (t = ve.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ve.updateQueue = t),
        (t.stores = [e]))
      : ((r = t.stores), r === null ? (t.stores = [e]) : r.push(e)));
}
function jv(e, t, r, n) {
  ((t.value = r), (t.getSnapshot = n), Nv(t) && Cv(e));
}
function Ev(e, t, r) {
  return r(function () {
    Nv(t) && Cv(e);
  });
}
function Nv(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var r = t();
    return !$t(e, r);
  } catch {
    return !0;
  }
}
function Cv(e) {
  var t = yr(e, 1);
  t !== null && Lt(t, e, 1, -1);
}
function cp(e) {
  var t = Qt();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: eo,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = jk.bind(null, ve, e)),
    [t.memoizedState, e]
  );
}
function to(e, t, r, n) {
  return (
    (e = { tag: e, create: t, destroy: r, deps: n, next: null }),
    (t = ve.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ve.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((r = t.lastEffect),
        r === null
          ? (t.lastEffect = e.next = e)
          : ((n = r.next), (r.next = e), (e.next = n), (t.lastEffect = e))),
    e
  );
}
function Tv() {
  return St().memoizedState;
}
function gi(e, t, r, n) {
  var a = Qt();
  ((ve.flags |= e),
    (a.memoizedState = to(1 | t, r, void 0, n === void 0 ? null : n)));
}
function ml(e, t, r, n) {
  var a = St();
  n = n === void 0 ? null : n;
  var s = void 0;
  if (Ee !== null) {
    var o = Ee.memoizedState;
    if (((s = o.destroy), n !== null && nh(n, o.deps))) {
      a.memoizedState = to(t, r, s, n);
      return;
    }
  }
  ((ve.flags |= e), (a.memoizedState = to(1 | t, r, s, n)));
}
function up(e, t) {
  return gi(8390656, 8, e, t);
}
function oh(e, t) {
  return ml(2048, 8, e, t);
}
function Pv(e, t) {
  return ml(4, 2, e, t);
}
function Rv(e, t) {
  return ml(4, 4, e, t);
}
function Ov(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Av(e, t, r) {
  return (
    (r = r != null ? r.concat([e]) : null),
    ml(4, 4, Ov.bind(null, t, e), r)
  );
}
function ih() {}
function Mv(e, t) {
  var r = St();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && nh(t, n[1])
    ? n[0]
    : ((r.memoizedState = [e, t]), e);
}
function Iv(e, t) {
  var r = St();
  t = t === void 0 ? null : t;
  var n = r.memoizedState;
  return n !== null && t !== null && nh(t, n[1])
    ? n[0]
    : ((e = e()), (r.memoizedState = [e, t]), e);
}
function Dv(e, t, r) {
  return Rn & 21
    ? ($t(r, t) || ((r = Ug()), (ve.lanes |= r), (On |= r), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (rt = !0)), (e.memoizedState = r));
}
function Sk(e, t) {
  var r = ie;
  ((ie = r !== 0 && 4 > r ? r : 4), e(!0));
  var n = wc.transition;
  wc.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((ie = r), (wc.transition = n));
  }
}
function Lv() {
  return St().memoizedState;
}
function _k(e, t, r) {
  var n = Vr(e);
  if (
    ((r = {
      lane: n,
      action: r,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    $v(e))
  )
    Fv(t, r);
  else if (((r = bv(e, t, r, n)), r !== null)) {
    var a = Ve();
    (Lt(r, e, n, a), zv(r, t, n));
  }
}
function jk(e, t, r) {
  var n = Vr(e),
    a = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
  if ($v(e)) Fv(t, a);
  else {
    var s = e.alternate;
    if (
      e.lanes === 0 &&
      (s === null || s.lanes === 0) &&
      ((s = t.lastRenderedReducer), s !== null)
    )
      try {
        var o = t.lastRenderedState,
          i = s(o, r);
        if (((a.hasEagerState = !0), (a.eagerState = i), $t(i, o))) {
          var l = t.interleaved;
          (l === null
            ? ((a.next = a), Xd(t))
            : ((a.next = l.next), (l.next = a)),
            (t.interleaved = a));
          return;
        }
      } catch {
      } finally {
      }
    ((r = bv(e, t, a, n)),
      r !== null && ((a = Ve()), Lt(r, e, n, a), zv(r, t, n)));
  }
}
function $v(e) {
  var t = e.alternate;
  return e === ve || (t !== null && t === ve);
}
function Fv(e, t) {
  Rs = Wi = !0;
  var r = e.pending;
  (r === null ? (t.next = t) : ((t.next = r.next), (r.next = t)),
    (e.pending = t));
}
function zv(e, t, r) {
  if (r & 4194240) {
    var n = t.lanes;
    ((n &= e.pendingLanes), (r |= n), (t.lanes = r), $d(e, r));
  }
}
var qi = {
    readContext: kt,
    useCallback: De,
    useContext: De,
    useEffect: De,
    useImperativeHandle: De,
    useInsertionEffect: De,
    useLayoutEffect: De,
    useMemo: De,
    useReducer: De,
    useRef: De,
    useState: De,
    useDebugValue: De,
    useDeferredValue: De,
    useTransition: De,
    useMutableSource: De,
    useSyncExternalStore: De,
    useId: De,
    unstable_isNewReconciler: !1,
  },
  Ek = {
    readContext: kt,
    useCallback: function (e, t) {
      return ((Qt().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: kt,
    useEffect: up,
    useImperativeHandle: function (e, t, r) {
      return (
        (r = r != null ? r.concat([e]) : null),
        gi(4194308, 4, Ov.bind(null, t, e), r)
      );
    },
    useLayoutEffect: function (e, t) {
      return gi(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return gi(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var r = Qt();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (r.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, r) {
      var n = Qt();
      return (
        (t = r !== void 0 ? r(t) : t),
        (n.memoizedState = n.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (n.queue = e),
        (e = e.dispatch = _k.bind(null, ve, e)),
        [n.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Qt();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: cp,
    useDebugValue: ih,
    useDeferredValue: function (e) {
      return (Qt().memoizedState = e);
    },
    useTransition: function () {
      var e = cp(!1),
        t = e[0];
      return ((e = Sk.bind(null, e[1])), (Qt().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, r) {
      var n = ve,
        a = Qt();
      if (me) {
        if (r === void 0) throw Error(P(407));
        r = r();
      } else {
        if (((r = t()), Pe === null)) throw Error(P(349));
        Rn & 30 || _v(n, t, r);
      }
      a.memoizedState = r;
      var s = { value: r, getSnapshot: t };
      return (
        (a.queue = s),
        up(Ev.bind(null, n, s, e), [e]),
        (n.flags |= 2048),
        to(9, jv.bind(null, n, s, r, t), void 0, null),
        r
      );
    },
    useId: function () {
      var e = Qt(),
        t = Pe.identifierPrefix;
      if (me) {
        var r = pr,
          n = fr;
        ((r = (n & ~(1 << (32 - Dt(n) - 1))).toString(32) + r),
          (t = ":" + t + "R" + r),
          (r = Zs++),
          0 < r && (t += "H" + r.toString(32)),
          (t += ":"));
      } else ((r = kk++), (t = ":" + t + "r" + r.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Nk = {
    readContext: kt,
    useCallback: Mv,
    useContext: kt,
    useEffect: oh,
    useImperativeHandle: Av,
    useInsertionEffect: Pv,
    useLayoutEffect: Rv,
    useMemo: Iv,
    useReducer: xc,
    useRef: Tv,
    useState: function () {
      return xc(eo);
    },
    useDebugValue: ih,
    useDeferredValue: function (e) {
      var t = St();
      return Dv(t, Ee.memoizedState, e);
    },
    useTransition: function () {
      var e = xc(eo)[0],
        t = St().memoizedState;
      return [e, t];
    },
    useMutableSource: kv,
    useSyncExternalStore: Sv,
    useId: Lv,
    unstable_isNewReconciler: !1,
  },
  Ck = {
    readContext: kt,
    useCallback: Mv,
    useContext: kt,
    useEffect: oh,
    useImperativeHandle: Av,
    useInsertionEffect: Pv,
    useLayoutEffect: Rv,
    useMemo: Iv,
    useReducer: kc,
    useRef: Tv,
    useState: function () {
      return kc(eo);
    },
    useDebugValue: ih,
    useDeferredValue: function (e) {
      var t = St();
      return Ee === null ? (t.memoizedState = e) : Dv(t, Ee.memoizedState, e);
    },
    useTransition: function () {
      var e = kc(eo)[0],
        t = St().memoizedState;
      return [e, t];
    },
    useMutableSource: kv,
    useSyncExternalStore: Sv,
    useId: Lv,
    unstable_isNewReconciler: !1,
  };
function Ct(e, t) {
  if (e && e.defaultProps) {
    ((t = ye({}, t)), (e = e.defaultProps));
    for (var r in e) t[r] === void 0 && (t[r] = e[r]);
    return t;
  }
  return t;
}
function Tu(e, t, r, n) {
  ((t = e.memoizedState),
    (r = r(n, t)),
    (r = r == null ? t : ye({}, t, r)),
    (e.memoizedState = r),
    e.lanes === 0 && (e.updateQueue.baseState = r));
}
var gl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? $n(e) === e : !1;
  },
  enqueueSetState: function (e, t, r) {
    e = e._reactInternals;
    var n = Ve(),
      a = Vr(e),
      s = mr(n, a);
    ((s.payload = t),
      r != null && (s.callback = r),
      (t = qr(e, s, a)),
      t !== null && (Lt(t, e, a, n), pi(t, e, a)));
  },
  enqueueReplaceState: function (e, t, r) {
    e = e._reactInternals;
    var n = Ve(),
      a = Vr(e),
      s = mr(n, a);
    ((s.tag = 1),
      (s.payload = t),
      r != null && (s.callback = r),
      (t = qr(e, s, a)),
      t !== null && (Lt(t, e, a, n), pi(t, e, a)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var r = Ve(),
      n = Vr(e),
      a = mr(r, n);
    ((a.tag = 2),
      t != null && (a.callback = t),
      (t = qr(e, a, n)),
      t !== null && (Lt(t, e, n, r), pi(t, e, n)));
  },
};
function dp(e, t, r, n, a, s, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(n, s, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !Ks(r, n) || !Ks(a, s)
        : !0
  );
}
function Uv(e, t, r) {
  var n = !1,
    a = Jr,
    s = t.contextType;
  return (
    typeof s == "object" && s !== null
      ? (s = kt(s))
      : ((a = at(t) ? Tn : ze.current),
        (n = t.contextTypes),
        (s = (n = n != null) ? Oa(e, a) : Jr)),
    (t = new t(r, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = gl),
    (e.stateNode = t),
    (t._reactInternals = e),
    n &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = a),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  );
}
function hp(e, t, r, n) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(r, n),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(r, n),
    t.state !== e && gl.enqueueReplaceState(t, t.state, null));
}
function Pu(e, t, r, n) {
  var a = e.stateNode;
  ((a.props = r), (a.state = e.memoizedState), (a.refs = {}), Zd(e));
  var s = t.contextType;
  (typeof s == "object" && s !== null
    ? (a.context = kt(s))
    : ((s = at(t) ? Tn : ze.current), (a.context = Oa(e, s))),
    (a.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == "function" && (Tu(e, t, s, r), (a.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof a.getSnapshotBeforeUpdate == "function" ||
      (typeof a.UNSAFE_componentWillMount != "function" &&
        typeof a.componentWillMount != "function") ||
      ((t = a.state),
      typeof a.componentWillMount == "function" && a.componentWillMount(),
      typeof a.UNSAFE_componentWillMount == "function" &&
        a.UNSAFE_componentWillMount(),
      t !== a.state && gl.enqueueReplaceState(a, a.state, null),
      Ui(e, r, a, n),
      (a.state = e.memoizedState)),
    typeof a.componentDidMount == "function" && (e.flags |= 4194308));
}
function Da(e, t) {
  try {
    var r = "",
      n = t;
    do ((r += r1(n)), (n = n.return));
    while (n);
    var a = r;
  } catch (s) {
    a =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack;
  }
  return { value: e, source: t, stack: a, digest: null };
}
function Sc(e, t, r) {
  return { value: e, source: null, stack: r ?? null, digest: t ?? null };
}
function Ru(e, t) {
  try {
    console.error(t.value);
  } catch (r) {
    setTimeout(function () {
      throw r;
    });
  }
}
var Tk = typeof WeakMap == "function" ? WeakMap : Map;
function Bv(e, t, r) {
  ((r = mr(-1, r)), (r.tag = 3), (r.payload = { element: null }));
  var n = t.value;
  return (
    (r.callback = function () {
      (Vi || ((Vi = !0), (zu = n)), Ru(e, t));
    }),
    r
  );
}
function Wv(e, t, r) {
  ((r = mr(-1, r)), (r.tag = 3));
  var n = e.type.getDerivedStateFromError;
  if (typeof n == "function") {
    var a = t.value;
    ((r.payload = function () {
      return n(a);
    }),
      (r.callback = function () {
        Ru(e, t);
      }));
  }
  var s = e.stateNode;
  return (
    s !== null &&
      typeof s.componentDidCatch == "function" &&
      (r.callback = function () {
        (Ru(e, t),
          typeof n != "function" &&
            (Hr === null ? (Hr = new Set([this])) : Hr.add(this)));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    r
  );
}
function fp(e, t, r) {
  var n = e.pingCache;
  if (n === null) {
    n = e.pingCache = new Tk();
    var a = new Set();
    n.set(t, a);
  } else ((a = n.get(t)), a === void 0 && ((a = new Set()), n.set(t, a)));
  a.has(r) || (a.add(r), (e = Wk.bind(null, e, t, r)), t.then(e, e));
}
function pp(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function mp(e, t, r, n, a) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = a), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (r.flags |= 131072),
          (r.flags &= -52805),
          r.tag === 1 &&
            (r.alternate === null
              ? (r.tag = 17)
              : ((t = mr(-1, 1)), (t.tag = 2), qr(r, t, 1))),
          (r.lanes |= 1)),
      e);
}
var Pk = kr.ReactCurrentOwner,
  rt = !1;
function We(e, t, r, n) {
  t.child = e === null ? yv(t, null, r, n) : Ma(t, e.child, r, n);
}
function gp(e, t, r, n, a) {
  r = r.render;
  var s = t.ref;
  return (
    Ea(t, a),
    (n = ah(e, t, r, n, s, a)),
    (r = sh()),
    e !== null && !rt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~a),
        br(e, t, a))
      : (me && r && Vd(t), (t.flags |= 1), We(e, t, n, a), t.child)
  );
}
function vp(e, t, r, n, a) {
  if (e === null) {
    var s = r.type;
    return typeof s == "function" &&
      !mh(s) &&
      s.defaultProps === void 0 &&
      r.compare === null &&
      r.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), qv(e, t, s, n, a))
      : ((e = wi(r.type, null, n, t, t.mode, a)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((s = e.child), !(e.lanes & a))) {
    var o = s.memoizedProps;
    if (
      ((r = r.compare), (r = r !== null ? r : Ks), r(o, n) && e.ref === t.ref)
    )
      return br(e, t, a);
  }
  return (
    (t.flags |= 1),
    (e = Kr(s, n)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function qv(e, t, r, n, a) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (Ks(s, n) && e.ref === t.ref)
      if (((rt = !1), (t.pendingProps = n = s), (e.lanes & a) !== 0))
        e.flags & 131072 && (rt = !0);
      else return ((t.lanes = e.lanes), br(e, t, a));
  }
  return Ou(e, t, r, n, a);
}
function Hv(e, t, r) {
  var n = t.pendingProps,
    a = n.children,
    s = e !== null ? e.memoizedState : null;
  if (n.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ue(xa, it),
        (it |= r));
    else {
      if (!(r & 1073741824))
        return (
          (e = s !== null ? s.baseLanes | r : r),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          ue(xa, it),
          (it |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (n = s !== null ? s.baseLanes : r),
        ue(xa, it),
        (it |= n));
    }
  else
    (s !== null ? ((n = s.baseLanes | r), (t.memoizedState = null)) : (n = r),
      ue(xa, it),
      (it |= n));
  return (We(e, t, a, r), t.child);
}
function Vv(e, t) {
  var r = t.ref;
  ((e === null && r !== null) || (e !== null && e.ref !== r)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Ou(e, t, r, n, a) {
  var s = at(r) ? Tn : ze.current;
  return (
    (s = Oa(t, s)),
    Ea(t, a),
    (r = ah(e, t, r, n, s, a)),
    (n = sh()),
    e !== null && !rt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~a),
        br(e, t, a))
      : (me && n && Vd(t), (t.flags |= 1), We(e, t, r, a), t.child)
  );
}
function yp(e, t, r, n, a) {
  if (at(r)) {
    var s = !0;
    Di(t);
  } else s = !1;
  if ((Ea(t, a), t.stateNode === null))
    (vi(e, t), Uv(t, r, n), Pu(t, r, n, a), (n = !0));
  else if (e === null) {
    var o = t.stateNode,
      i = t.memoizedProps;
    o.props = i;
    var l = o.context,
      u = r.contextType;
    typeof u == "object" && u !== null
      ? (u = kt(u))
      : ((u = at(r) ? Tn : ze.current), (u = Oa(t, u)));
    var d = r.getDerivedStateFromProps,
      h =
        typeof d == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    (h ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((i !== n || l !== u) && hp(t, o, n, u)),
      (Ar = !1));
    var f = t.memoizedState;
    ((o.state = f),
      Ui(t, n, o, a),
      (l = t.memoizedState),
      i !== n || f !== l || nt.current || Ar
        ? (typeof d == "function" && (Tu(t, r, d, n), (l = t.memoizedState)),
          (i = Ar || dp(t, r, i, n, f, l, u))
            ? (h ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = n),
              (t.memoizedState = l)),
          (o.props = n),
          (o.state = l),
          (o.context = u),
          (n = i))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (n = !1)));
  } else {
    ((o = t.stateNode),
      wv(e, t),
      (i = t.memoizedProps),
      (u = t.type === t.elementType ? i : Ct(t.type, i)),
      (o.props = u),
      (h = t.pendingProps),
      (f = o.context),
      (l = r.contextType),
      typeof l == "object" && l !== null
        ? (l = kt(l))
        : ((l = at(r) ? Tn : ze.current), (l = Oa(t, l))));
    var v = r.getDerivedStateFromProps;
    ((d =
      typeof v == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((i !== h || f !== l) && hp(t, o, n, l)),
      (Ar = !1),
      (f = t.memoizedState),
      (o.state = f),
      Ui(t, n, o, a));
    var g = t.memoizedState;
    i !== h || f !== g || nt.current || Ar
      ? (typeof v == "function" && (Tu(t, r, v, n), (g = t.memoizedState)),
        (u = Ar || dp(t, r, u, n, f, g, l) || !1)
          ? (d ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(n, g, l),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(n, g, l)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (i === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (i === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = n),
            (t.memoizedState = g)),
        (o.props = n),
        (o.state = g),
        (o.context = l),
        (n = u))
      : (typeof o.componentDidUpdate != "function" ||
          (i === e.memoizedProps && f === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (i === e.memoizedProps && f === e.memoizedState) ||
          (t.flags |= 1024),
        (n = !1));
  }
  return Au(e, t, r, n, s, a);
}
function Au(e, t, r, n, a, s) {
  Vv(e, t);
  var o = (t.flags & 128) !== 0;
  if (!n && !o) return (a && np(t, r, !1), br(e, t, s));
  ((n = t.stateNode), (Pk.current = t));
  var i =
    o && typeof r.getDerivedStateFromError != "function" ? null : n.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Ma(t, e.child, null, s)), (t.child = Ma(t, null, i, s)))
      : We(e, t, i, s),
    (t.memoizedState = n.state),
    a && np(t, r, !0),
    t.child
  );
}
function Kv(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? rp(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && rp(e, t.context, !1),
    eh(e, t.containerInfo));
}
function bp(e, t, r, n, a) {
  return (Aa(), Gd(a), (t.flags |= 256), We(e, t, r, n), t.child);
}
var Mu = { dehydrated: null, treeContext: null, retryLane: 0 };
function Iu(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Gv(e, t, r) {
  var n = t.pendingProps,
    a = ge.current,
    s = !1,
    o = (t.flags & 128) !== 0,
    i;
  if (
    ((i = o) ||
      (i = e !== null && e.memoizedState === null ? !1 : (a & 2) !== 0),
    i
      ? ((s = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (a |= 1),
    ue(ge, a & 1),
    e === null)
  )
    return (
      Nu(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = n.children),
          (e = n.fallback),
          s
            ? ((n = t.mode),
              (s = t.child),
              (o = { mode: "hidden", children: o }),
              !(n & 1) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = o))
                : (s = bl(o, n, 0, null)),
              (e = En(e, n, r, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = Iu(r)),
              (t.memoizedState = Mu),
              e)
            : lh(t, o))
    );
  if (((a = e.memoizedState), a !== null && ((i = a.dehydrated), i !== null)))
    return Rk(e, t, o, n, i, a, r);
  if (s) {
    ((s = n.fallback), (o = t.mode), (a = e.child), (i = a.sibling));
    var l = { mode: "hidden", children: n.children };
    return (
      !(o & 1) && t.child !== a
        ? ((n = t.child),
          (n.childLanes = 0),
          (n.pendingProps = l),
          (t.deletions = null))
        : ((n = Kr(a, l)), (n.subtreeFlags = a.subtreeFlags & 14680064)),
      i !== null ? (s = Kr(i, s)) : ((s = En(s, o, r, null)), (s.flags |= 2)),
      (s.return = t),
      (n.return = t),
      (n.sibling = s),
      (t.child = n),
      (n = s),
      (s = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Iu(r)
          : {
              baseLanes: o.baseLanes | r,
              cachePool: null,
              transitions: o.transitions,
            }),
      (s.memoizedState = o),
      (s.childLanes = e.childLanes & ~r),
      (t.memoizedState = Mu),
      n
    );
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (n = Kr(s, { mode: "visible", children: n.children })),
    !(t.mode & 1) && (n.lanes = r),
    (n.return = t),
    (n.sibling = null),
    e !== null &&
      ((r = t.deletions),
      r === null ? ((t.deletions = [e]), (t.flags |= 16)) : r.push(e)),
    (t.child = n),
    (t.memoizedState = null),
    n
  );
}
function lh(e, t) {
  return (
    (t = bl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Ho(e, t, r, n) {
  return (
    n !== null && Gd(n),
    Ma(t, e.child, null, r),
    (e = lh(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Rk(e, t, r, n, a, s, o) {
  if (r)
    return t.flags & 256
      ? ((t.flags &= -257), (n = Sc(Error(P(422)))), Ho(e, t, o, n))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((s = n.fallback),
          (a = t.mode),
          (n = bl({ mode: "visible", children: n.children }, a, 0, null)),
          (s = En(s, a, o, null)),
          (s.flags |= 2),
          (n.return = t),
          (s.return = t),
          (n.sibling = s),
          (t.child = n),
          t.mode & 1 && Ma(t, e.child, null, o),
          (t.child.memoizedState = Iu(o)),
          (t.memoizedState = Mu),
          s);
  if (!(t.mode & 1)) return Ho(e, t, o, null);
  if (a.data === "$!") {
    if (((n = a.nextSibling && a.nextSibling.dataset), n)) var i = n.dgst;
    return (
      (n = i),
      (s = Error(P(419))),
      (n = Sc(s, n, void 0)),
      Ho(e, t, o, n)
    );
  }
  if (((i = (o & e.childLanes) !== 0), rt || i)) {
    if (((n = Pe), n !== null)) {
      switch (o & -o) {
        case 4:
          a = 2;
          break;
        case 16:
          a = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          a = 32;
          break;
        case 536870912:
          a = 268435456;
          break;
        default:
          a = 0;
      }
      ((a = a & (n.suspendedLanes | o) ? 0 : a),
        a !== 0 &&
          a !== s.retryLane &&
          ((s.retryLane = a), yr(e, a), Lt(n, e, a, -1)));
    }
    return (ph(), (n = Sc(Error(P(421)))), Ho(e, t, o, n));
  }
  return a.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = qk.bind(null, e)),
      (a._reactRetry = t),
      null)
    : ((e = s.treeContext),
      (ct = Wr(a.nextSibling)),
      (ut = t),
      (me = !0),
      (Ot = null),
      e !== null &&
        ((gt[vt++] = fr),
        (gt[vt++] = pr),
        (gt[vt++] = Pn),
        (fr = e.id),
        (pr = e.overflow),
        (Pn = t)),
      (t = lh(t, n.children)),
      (t.flags |= 4096),
      t);
}
function wp(e, t, r) {
  e.lanes |= t;
  var n = e.alternate;
  (n !== null && (n.lanes |= t), Cu(e.return, t, r));
}
function _c(e, t, r, n, a) {
  var s = e.memoizedState;
  s === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: n,
        tail: r,
        tailMode: a,
      })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = n),
      (s.tail = r),
      (s.tailMode = a));
}
function Qv(e, t, r) {
  var n = t.pendingProps,
    a = n.revealOrder,
    s = n.tail;
  if ((We(e, t, n.children, r), (n = ge.current), n & 2))
    ((n = (n & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && wp(e, r, t);
        else if (e.tag === 19) wp(e, r, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    n &= 1;
  }
  if ((ue(ge, n), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (a) {
      case "forwards":
        for (r = t.child, a = null; r !== null; )
          ((e = r.alternate),
            e !== null && Bi(e) === null && (a = r),
            (r = r.sibling));
        ((r = a),
          r === null
            ? ((a = t.child), (t.child = null))
            : ((a = r.sibling), (r.sibling = null)),
          _c(t, !1, a, r, s));
        break;
      case "backwards":
        for (r = null, a = t.child, t.child = null; a !== null; ) {
          if (((e = a.alternate), e !== null && Bi(e) === null)) {
            t.child = a;
            break;
          }
          ((e = a.sibling), (a.sibling = r), (r = a), (a = e));
        }
        _c(t, !0, r, null, s);
        break;
      case "together":
        _c(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function vi(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function br(e, t, r) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (On |= t.lanes),
    !(r & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(P(153));
  if (t.child !== null) {
    for (
      e = t.child, r = Kr(e, e.pendingProps), t.child = r, r.return = t;
      e.sibling !== null;

    )
      ((e = e.sibling),
        (r = r.sibling = Kr(e, e.pendingProps)),
        (r.return = t));
    r.sibling = null;
  }
  return t.child;
}
function Ok(e, t, r) {
  switch (t.tag) {
    case 3:
      (Kv(t), Aa());
      break;
    case 5:
      xv(t);
      break;
    case 1:
      at(t.type) && Di(t);
      break;
    case 4:
      eh(t, t.stateNode.containerInfo);
      break;
    case 10:
      var n = t.type._context,
        a = t.memoizedProps.value;
      (ue(Fi, n._currentValue), (n._currentValue = a));
      break;
    case 13:
      if (((n = t.memoizedState), n !== null))
        return n.dehydrated !== null
          ? (ue(ge, ge.current & 1), (t.flags |= 128), null)
          : r & t.child.childLanes
            ? Gv(e, t, r)
            : (ue(ge, ge.current & 1),
              (e = br(e, t, r)),
              e !== null ? e.sibling : null);
      ue(ge, ge.current & 1);
      break;
    case 19:
      if (((n = (r & t.childLanes) !== 0), e.flags & 128)) {
        if (n) return Qv(e, t, r);
        t.flags |= 128;
      }
      if (
        ((a = t.memoizedState),
        a !== null &&
          ((a.rendering = null), (a.tail = null), (a.lastEffect = null)),
        ue(ge, ge.current),
        n)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), Hv(e, t, r));
  }
  return br(e, t, r);
}
var Jv, Du, Yv, Xv;
Jv = function (e, t) {
  for (var r = t.child; r !== null; ) {
    if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode);
    else if (r.tag !== 4 && r.child !== null) {
      ((r.child.return = r), (r = r.child));
      continue;
    }
    if (r === t) break;
    for (; r.sibling === null; ) {
      if (r.return === null || r.return === t) return;
      r = r.return;
    }
    ((r.sibling.return = r.return), (r = r.sibling));
  }
};
Du = function () {};
Yv = function (e, t, r, n) {
  var a = e.memoizedProps;
  if (a !== n) {
    ((e = t.stateNode), Sn(er.current));
    var s = null;
    switch (r) {
      case "input":
        ((a = au(e, a)), (n = au(e, n)), (s = []));
        break;
      case "select":
        ((a = ye({}, a, { value: void 0 })),
          (n = ye({}, n, { value: void 0 })),
          (s = []));
        break;
      case "textarea":
        ((a = iu(e, a)), (n = iu(e, n)), (s = []));
        break;
      default:
        typeof a.onClick != "function" &&
          typeof n.onClick == "function" &&
          (e.onclick = Mi);
    }
    cu(r, n);
    var o;
    r = null;
    for (u in a)
      if (!n.hasOwnProperty(u) && a.hasOwnProperty(u) && a[u] != null)
        if (u === "style") {
          var i = a[u];
          for (o in i) i.hasOwnProperty(o) && (r || (r = {}), (r[o] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (zs.hasOwnProperty(u)
              ? s || (s = [])
              : (s = s || []).push(u, null));
    for (u in n) {
      var l = n[u];
      if (
        ((i = a != null ? a[u] : void 0),
        n.hasOwnProperty(u) && l !== i && (l != null || i != null))
      )
        if (u === "style")
          if (i) {
            for (o in i)
              !i.hasOwnProperty(o) ||
                (l && l.hasOwnProperty(o)) ||
                (r || (r = {}), (r[o] = ""));
            for (o in l)
              l.hasOwnProperty(o) &&
                i[o] !== l[o] &&
                (r || (r = {}), (r[o] = l[o]));
          } else (r || (s || (s = []), s.push(u, r)), (r = l));
        else
          u === "dangerouslySetInnerHTML"
            ? ((l = l ? l.__html : void 0),
              (i = i ? i.__html : void 0),
              l != null && i !== l && (s = s || []).push(u, l))
            : u === "children"
              ? (typeof l != "string" && typeof l != "number") ||
                (s = s || []).push(u, "" + l)
              : u !== "suppressContentEditableWarning" &&
                u !== "suppressHydrationWarning" &&
                (zs.hasOwnProperty(u)
                  ? (l != null && u === "onScroll" && fe("scroll", e),
                    s || i === l || (s = []))
                  : (s = s || []).push(u, l));
    }
    r && (s = s || []).push("style", r);
    var u = s;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
Xv = function (e, t, r, n) {
  r !== n && (t.flags |= 4);
};
function ss(e, t) {
  if (!me)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var r = null; t !== null; )
          (t.alternate !== null && (r = t), (t = t.sibling));
        r === null ? (e.tail = null) : (r.sibling = null);
        break;
      case "collapsed":
        r = e.tail;
        for (var n = null; r !== null; )
          (r.alternate !== null && (n = r), (r = r.sibling));
        n === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (n.sibling = null);
    }
}
function Le(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    r = 0,
    n = 0;
  if (t)
    for (var a = e.child; a !== null; )
      ((r |= a.lanes | a.childLanes),
        (n |= a.subtreeFlags & 14680064),
        (n |= a.flags & 14680064),
        (a.return = e),
        (a = a.sibling));
  else
    for (a = e.child; a !== null; )
      ((r |= a.lanes | a.childLanes),
        (n |= a.subtreeFlags),
        (n |= a.flags),
        (a.return = e),
        (a = a.sibling));
  return ((e.subtreeFlags |= n), (e.childLanes = r), t);
}
function Ak(e, t, r) {
  var n = t.pendingProps;
  switch ((Kd(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (Le(t), null);
    case 1:
      return (at(t.type) && Ii(), Le(t), null);
    case 3:
      return (
        (n = t.stateNode),
        Ia(),
        pe(nt),
        pe(ze),
        rh(),
        n.pendingContext &&
          ((n.context = n.pendingContext), (n.pendingContext = null)),
        (e === null || e.child === null) &&
          (Wo(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ot !== null && (Wu(Ot), (Ot = null)))),
        Du(e, t),
        Le(t),
        null
      );
    case 5:
      th(t);
      var a = Sn(Xs.current);
      if (((r = t.type), e !== null && t.stateNode != null))
        (Yv(e, t, r, n, a),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!n) {
          if (t.stateNode === null) throw Error(P(166));
          return (Le(t), null);
        }
        if (((e = Sn(er.current)), Wo(t))) {
          ((n = t.stateNode), (r = t.type));
          var s = t.memoizedProps;
          switch (((n[Jt] = t), (n[Js] = s), (e = (t.mode & 1) !== 0), r)) {
            case "dialog":
              (fe("cancel", n), fe("close", n));
              break;
            case "iframe":
            case "object":
            case "embed":
              fe("load", n);
              break;
            case "video":
            case "audio":
              for (a = 0; a < ks.length; a++) fe(ks[a], n);
              break;
            case "source":
              fe("error", n);
              break;
            case "img":
            case "image":
            case "link":
              (fe("error", n), fe("load", n));
              break;
            case "details":
              fe("toggle", n);
              break;
            case "input":
              (Tf(n, s), fe("invalid", n));
              break;
            case "select":
              ((n._wrapperState = { wasMultiple: !!s.multiple }),
                fe("invalid", n));
              break;
            case "textarea":
              (Rf(n, s), fe("invalid", n));
          }
          (cu(r, s), (a = null));
          for (var o in s)
            if (s.hasOwnProperty(o)) {
              var i = s[o];
              o === "children"
                ? typeof i == "string"
                  ? n.textContent !== i &&
                    (s.suppressHydrationWarning !== !0 &&
                      Bo(n.textContent, i, e),
                    (a = ["children", i]))
                  : typeof i == "number" &&
                    n.textContent !== "" + i &&
                    (s.suppressHydrationWarning !== !0 &&
                      Bo(n.textContent, i, e),
                    (a = ["children", "" + i]))
                : zs.hasOwnProperty(o) &&
                  i != null &&
                  o === "onScroll" &&
                  fe("scroll", n);
            }
          switch (r) {
            case "input":
              (Mo(n), Pf(n, s, !0));
              break;
            case "textarea":
              (Mo(n), Of(n));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (n.onclick = Mi);
          }
          ((n = a), (t.updateQueue = n), n !== null && (t.flags |= 4));
        } else {
          ((o = a.nodeType === 9 ? a : a.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Eg(r)),
            e === "http://www.w3.org/1999/xhtml"
              ? r === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof n.is == "string"
                  ? (e = o.createElement(r, { is: n.is }))
                  : ((e = o.createElement(r)),
                    r === "select" &&
                      ((o = e),
                      n.multiple
                        ? (o.multiple = !0)
                        : n.size && (o.size = n.size)))
              : (e = o.createElementNS(e, r)),
            (e[Jt] = t),
            (e[Js] = n),
            Jv(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((o = uu(r, n)), r)) {
              case "dialog":
                (fe("cancel", e), fe("close", e), (a = n));
                break;
              case "iframe":
              case "object":
              case "embed":
                (fe("load", e), (a = n));
                break;
              case "video":
              case "audio":
                for (a = 0; a < ks.length; a++) fe(ks[a], e);
                a = n;
                break;
              case "source":
                (fe("error", e), (a = n));
                break;
              case "img":
              case "image":
              case "link":
                (fe("error", e), fe("load", e), (a = n));
                break;
              case "details":
                (fe("toggle", e), (a = n));
                break;
              case "input":
                (Tf(e, n), (a = au(e, n)), fe("invalid", e));
                break;
              case "option":
                a = n;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!n.multiple }),
                  (a = ye({}, n, { value: void 0 })),
                  fe("invalid", e));
                break;
              case "textarea":
                (Rf(e, n), (a = iu(e, n)), fe("invalid", e));
                break;
              default:
                a = n;
            }
            (cu(r, a), (i = a));
            for (s in i)
              if (i.hasOwnProperty(s)) {
                var l = i[s];
                s === "style"
                  ? Tg(e, l)
                  : s === "dangerouslySetInnerHTML"
                    ? ((l = l ? l.__html : void 0), l != null && Ng(e, l))
                    : s === "children"
                      ? typeof l == "string"
                        ? (r !== "textarea" || l !== "") && Us(e, l)
                        : typeof l == "number" && Us(e, "" + l)
                      : s !== "suppressContentEditableWarning" &&
                        s !== "suppressHydrationWarning" &&
                        s !== "autoFocus" &&
                        (zs.hasOwnProperty(s)
                          ? l != null && s === "onScroll" && fe("scroll", e)
                          : l != null && Od(e, s, l, o));
              }
            switch (r) {
              case "input":
                (Mo(e), Pf(e, n, !1));
                break;
              case "textarea":
                (Mo(e), Of(e));
                break;
              case "option":
                n.value != null && e.setAttribute("value", "" + Qr(n.value));
                break;
              case "select":
                ((e.multiple = !!n.multiple),
                  (s = n.value),
                  s != null
                    ? ka(e, !!n.multiple, s, !1)
                    : n.defaultValue != null &&
                      ka(e, !!n.multiple, n.defaultValue, !0));
                break;
              default:
                typeof a.onClick == "function" && (e.onclick = Mi);
            }
            switch (r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                n = !!n.autoFocus;
                break e;
              case "img":
                n = !0;
                break e;
              default:
                n = !1;
            }
          }
          n && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (Le(t), null);
    case 6:
      if (e && t.stateNode != null) Xv(e, t, e.memoizedProps, n);
      else {
        if (typeof n != "string" && t.stateNode === null) throw Error(P(166));
        if (((r = Sn(Xs.current)), Sn(er.current), Wo(t))) {
          if (
            ((n = t.stateNode),
            (r = t.memoizedProps),
            (n[Jt] = t),
            (s = n.nodeValue !== r) && ((e = ut), e !== null))
          )
            switch (e.tag) {
              case 3:
                Bo(n.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Bo(n.nodeValue, r, (e.mode & 1) !== 0);
            }
          s && (t.flags |= 4);
        } else
          ((n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n)),
            (n[Jt] = t),
            (t.stateNode = n));
      }
      return (Le(t), null);
    case 13:
      if (
        (pe(ge),
        (n = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (me && ct !== null && t.mode & 1 && !(t.flags & 128))
          (gv(), Aa(), (t.flags |= 98560), (s = !1));
        else if (((s = Wo(t)), n !== null && n.dehydrated !== null)) {
          if (e === null) {
            if (!s) throw Error(P(318));
            if (
              ((s = t.memoizedState),
              (s = s !== null ? s.dehydrated : null),
              !s)
            )
              throw Error(P(317));
            s[Jt] = t;
          } else
            (Aa(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (Le(t), (s = !1));
        } else (Ot !== null && (Wu(Ot), (Ot = null)), (s = !0));
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = r), t)
        : ((n = n !== null),
          n !== (e !== null && e.memoizedState !== null) &&
            n &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || ge.current & 1 ? Ne === 0 && (Ne = 3) : ph())),
          t.updateQueue !== null && (t.flags |= 4),
          Le(t),
          null);
    case 4:
      return (
        Ia(),
        Du(e, t),
        e === null && Gs(t.stateNode.containerInfo),
        Le(t),
        null
      );
    case 10:
      return (Yd(t.type._context), Le(t), null);
    case 17:
      return (at(t.type) && Ii(), Le(t), null);
    case 19:
      if ((pe(ge), (s = t.memoizedState), s === null)) return (Le(t), null);
      if (((n = (t.flags & 128) !== 0), (o = s.rendering), o === null))
        if (n) ss(s, !1);
        else {
          if (Ne !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = Bi(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    ss(s, !1),
                    n = o.updateQueue,
                    n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    n = r,
                    r = t.child;
                  r !== null;

                )
                  ((s = r),
                    (e = n),
                    (s.flags &= 14680066),
                    (o = s.alternate),
                    o === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = o.childLanes),
                        (s.lanes = o.lanes),
                        (s.child = o.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = o.memoizedProps),
                        (s.memoizedState = o.memoizedState),
                        (s.updateQueue = o.updateQueue),
                        (s.type = o.type),
                        (e = o.dependencies),
                        (s.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (r = r.sibling));
                return (ue(ge, (ge.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          s.tail !== null &&
            xe() > La &&
            ((t.flags |= 128), (n = !0), ss(s, !1), (t.lanes = 4194304));
        }
      else {
        if (!n)
          if (((e = Bi(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (n = !0),
              (r = e.updateQueue),
              r !== null && ((t.updateQueue = r), (t.flags |= 4)),
              ss(s, !0),
              s.tail === null && s.tailMode === "hidden" && !o.alternate && !me)
            )
              return (Le(t), null);
          } else
            2 * xe() - s.renderingStartTime > La &&
              r !== 1073741824 &&
              ((t.flags |= 128), (n = !0), ss(s, !1), (t.lanes = 4194304));
        s.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((r = s.last),
            r !== null ? (r.sibling = o) : (t.child = o),
            (s.last = o));
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = xe()),
          (t.sibling = null),
          (r = ge.current),
          ue(ge, n ? (r & 1) | 2 : r & 1),
          t)
        : (Le(t), null);
    case 22:
    case 23:
      return (
        fh(),
        (n = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== n && (t.flags |= 8192),
        n && t.mode & 1
          ? it & 1073741824 && (Le(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Le(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(P(156, t.tag));
}
function Mk(e, t) {
  switch ((Kd(t), t.tag)) {
    case 1:
      return (
        at(t.type) && Ii(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Ia(),
        pe(nt),
        pe(ze),
        rh(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (th(t), null);
    case 13:
      if (
        (pe(ge), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(P(340));
        Aa();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (pe(ge), null);
    case 4:
      return (Ia(), null);
    case 10:
      return (Yd(t.type._context), null);
    case 22:
    case 23:
      return (fh(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Vo = !1,
  Fe = !1,
  Ik = typeof WeakSet == "function" ? WeakSet : Set,
  L = null;
function wa(e, t) {
  var r = e.ref;
  if (r !== null)
    if (typeof r == "function")
      try {
        r(null);
      } catch (n) {
        be(e, t, n);
      }
    else r.current = null;
}
function Zv(e, t, r) {
  try {
    r();
  } catch (n) {
    be(e, t, n);
  }
}
var xp = !1;
function Dk(e, t) {
  if (((wu = Ri), (e = nv()), Hd(e))) {
    if ("selectionStart" in e)
      var r = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        r = ((r = e.ownerDocument) && r.defaultView) || window;
        var n = r.getSelection && r.getSelection();
        if (n && n.rangeCount !== 0) {
          r = n.anchorNode;
          var a = n.anchorOffset,
            s = n.focusNode;
          n = n.focusOffset;
          try {
            (r.nodeType, s.nodeType);
          } catch {
            r = null;
            break e;
          }
          var o = 0,
            i = -1,
            l = -1,
            u = 0,
            d = 0,
            h = e,
            f = null;
          t: for (;;) {
            for (
              var v;
              h !== r || (a !== 0 && h.nodeType !== 3) || (i = o + a),
                h !== s || (n !== 0 && h.nodeType !== 3) || (l = o + n),
                h.nodeType === 3 && (o += h.nodeValue.length),
                (v = h.firstChild) !== null;

            )
              ((f = h), (h = v));
            for (;;) {
              if (h === e) break t;
              if (
                (f === r && ++u === a && (i = o),
                f === s && ++d === n && (l = o),
                (v = h.nextSibling) !== null)
              )
                break;
              ((h = f), (f = h.parentNode));
            }
            h = v;
          }
          r = i === -1 || l === -1 ? null : { start: i, end: l };
        } else r = null;
      }
    r = r || { start: 0, end: 0 };
  } else r = null;
  for (xu = { focusedElem: e, selectionRange: r }, Ri = !1, L = t; L !== null; )
    if (((t = L), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (L = e));
    else
      for (; L !== null; ) {
        t = L;
        try {
          var g = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (g !== null) {
                  var m = g.memoizedProps,
                    w = g.memoizedState,
                    y = t.stateNode,
                    b = y.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? m : Ct(t.type, m),
                      w,
                    );
                  y.__reactInternalSnapshotBeforeUpdate = b;
                }
                break;
              case 3:
                var x = t.stateNode.containerInfo;
                x.nodeType === 1
                  ? (x.textContent = "")
                  : x.nodeType === 9 &&
                    x.documentElement &&
                    x.removeChild(x.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(P(163));
            }
        } catch (k) {
          be(t, t.return, k);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (L = e));
          break;
        }
        L = t.return;
      }
  return ((g = xp), (xp = !1), g);
}
function Os(e, t, r) {
  var n = t.updateQueue;
  if (((n = n !== null ? n.lastEffect : null), n !== null)) {
    var a = (n = n.next);
    do {
      if ((a.tag & e) === e) {
        var s = a.destroy;
        ((a.destroy = void 0), s !== void 0 && Zv(t, r, s));
      }
      a = a.next;
    } while (a !== n);
  }
}
function vl(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var r = (t = t.next);
    do {
      if ((r.tag & e) === e) {
        var n = r.create;
        r.destroy = n();
      }
      r = r.next;
    } while (r !== t);
  }
}
function Lu(e) {
  var t = e.ref;
  if (t !== null) {
    var r = e.stateNode;
    switch (e.tag) {
      case 5:
        e = r;
        break;
      default:
        e = r;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function ey(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), ey(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Jt], delete t[Js], delete t[_u], delete t[yk], delete t[bk])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function ty(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function kp(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || ty(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function $u(e, t, r) {
  var n = e.tag;
  if (n === 5 || n === 6)
    ((e = e.stateNode),
      t
        ? r.nodeType === 8
          ? r.parentNode.insertBefore(e, t)
          : r.insertBefore(e, t)
        : (r.nodeType === 8
            ? ((t = r.parentNode), t.insertBefore(e, r))
            : ((t = r), t.appendChild(e)),
          (r = r._reactRootContainer),
          r != null || t.onclick !== null || (t.onclick = Mi)));
  else if (n !== 4 && ((e = e.child), e !== null))
    for ($u(e, t, r), e = e.sibling; e !== null; )
      ($u(e, t, r), (e = e.sibling));
}
function Fu(e, t, r) {
  var n = e.tag;
  if (n === 5 || n === 6)
    ((e = e.stateNode), t ? r.insertBefore(e, t) : r.appendChild(e));
  else if (n !== 4 && ((e = e.child), e !== null))
    for (Fu(e, t, r), e = e.sibling; e !== null; )
      (Fu(e, t, r), (e = e.sibling));
}
var Ae = null,
  Pt = !1;
function jr(e, t, r) {
  for (r = r.child; r !== null; ) (ry(e, t, r), (r = r.sibling));
}
function ry(e, t, r) {
  if (Zt && typeof Zt.onCommitFiberUnmount == "function")
    try {
      Zt.onCommitFiberUnmount(cl, r);
    } catch {}
  switch (r.tag) {
    case 5:
      Fe || wa(r, t);
    case 6:
      var n = Ae,
        a = Pt;
      ((Ae = null),
        jr(e, t, r),
        (Ae = n),
        (Pt = a),
        Ae !== null &&
          (Pt
            ? ((e = Ae),
              (r = r.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r))
            : Ae.removeChild(r.stateNode)));
      break;
    case 18:
      Ae !== null &&
        (Pt
          ? ((e = Ae),
            (r = r.stateNode),
            e.nodeType === 8
              ? vc(e.parentNode, r)
              : e.nodeType === 1 && vc(e, r),
            Hs(e))
          : vc(Ae, r.stateNode));
      break;
    case 4:
      ((n = Ae),
        (a = Pt),
        (Ae = r.stateNode.containerInfo),
        (Pt = !0),
        jr(e, t, r),
        (Ae = n),
        (Pt = a));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Fe &&
        ((n = r.updateQueue), n !== null && ((n = n.lastEffect), n !== null))
      ) {
        a = n = n.next;
        do {
          var s = a,
            o = s.destroy;
          ((s = s.tag),
            o !== void 0 && (s & 2 || s & 4) && Zv(r, t, o),
            (a = a.next));
        } while (a !== n);
      }
      jr(e, t, r);
      break;
    case 1:
      if (
        !Fe &&
        (wa(r, t),
        (n = r.stateNode),
        typeof n.componentWillUnmount == "function")
      )
        try {
          ((n.props = r.memoizedProps),
            (n.state = r.memoizedState),
            n.componentWillUnmount());
        } catch (i) {
          be(r, t, i);
        }
      jr(e, t, r);
      break;
    case 21:
      jr(e, t, r);
      break;
    case 22:
      r.mode & 1
        ? ((Fe = (n = Fe) || r.memoizedState !== null), jr(e, t, r), (Fe = n))
        : jr(e, t, r);
      break;
    default:
      jr(e, t, r);
  }
}
function Sp(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var r = e.stateNode;
    (r === null && (r = e.stateNode = new Ik()),
      t.forEach(function (n) {
        var a = Hk.bind(null, e, n);
        r.has(n) || (r.add(n), n.then(a, a));
      }));
  }
}
function _t(e, t) {
  var r = t.deletions;
  if (r !== null)
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      try {
        var s = e,
          o = t,
          i = o;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case 5:
              ((Ae = i.stateNode), (Pt = !1));
              break e;
            case 3:
              ((Ae = i.stateNode.containerInfo), (Pt = !0));
              break e;
            case 4:
              ((Ae = i.stateNode.containerInfo), (Pt = !0));
              break e;
          }
          i = i.return;
        }
        if (Ae === null) throw Error(P(160));
        (ry(s, o, a), (Ae = null), (Pt = !1));
        var l = a.alternate;
        (l !== null && (l.return = null), (a.return = null));
      } catch (u) {
        be(a, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (ny(t, e), (t = t.sibling));
}
function ny(e, t) {
  var r = e.alternate,
    n = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((_t(t, e), Kt(e), n & 4)) {
        try {
          (Os(3, e, e.return), vl(3, e));
        } catch (m) {
          be(e, e.return, m);
        }
        try {
          Os(5, e, e.return);
        } catch (m) {
          be(e, e.return, m);
        }
      }
      break;
    case 1:
      (_t(t, e), Kt(e), n & 512 && r !== null && wa(r, r.return));
      break;
    case 5:
      if (
        (_t(t, e),
        Kt(e),
        n & 512 && r !== null && wa(r, r.return),
        e.flags & 32)
      ) {
        var a = e.stateNode;
        try {
          Us(a, "");
        } catch (m) {
          be(e, e.return, m);
        }
      }
      if (n & 4 && ((a = e.stateNode), a != null)) {
        var s = e.memoizedProps,
          o = r !== null ? r.memoizedProps : s,
          i = e.type,
          l = e.updateQueue;
        if (((e.updateQueue = null), l !== null))
          try {
            (i === "input" && s.type === "radio" && s.name != null && _g(a, s),
              uu(i, o));
            var u = uu(i, s);
            for (o = 0; o < l.length; o += 2) {
              var d = l[o],
                h = l[o + 1];
              d === "style"
                ? Tg(a, h)
                : d === "dangerouslySetInnerHTML"
                  ? Ng(a, h)
                  : d === "children"
                    ? Us(a, h)
                    : Od(a, d, h, u);
            }
            switch (i) {
              case "input":
                su(a, s);
                break;
              case "textarea":
                jg(a, s);
                break;
              case "select":
                var f = a._wrapperState.wasMultiple;
                a._wrapperState.wasMultiple = !!s.multiple;
                var v = s.value;
                v != null
                  ? ka(a, !!s.multiple, v, !1)
                  : f !== !!s.multiple &&
                    (s.defaultValue != null
                      ? ka(a, !!s.multiple, s.defaultValue, !0)
                      : ka(a, !!s.multiple, s.multiple ? [] : "", !1));
            }
            a[Js] = s;
          } catch (m) {
            be(e, e.return, m);
          }
      }
      break;
    case 6:
      if ((_t(t, e), Kt(e), n & 4)) {
        if (e.stateNode === null) throw Error(P(162));
        ((a = e.stateNode), (s = e.memoizedProps));
        try {
          a.nodeValue = s;
        } catch (m) {
          be(e, e.return, m);
        }
      }
      break;
    case 3:
      if (
        (_t(t, e), Kt(e), n & 4 && r !== null && r.memoizedState.isDehydrated)
      )
        try {
          Hs(t.containerInfo);
        } catch (m) {
          be(e, e.return, m);
        }
      break;
    case 4:
      (_t(t, e), Kt(e));
      break;
    case 13:
      (_t(t, e),
        Kt(e),
        (a = e.child),
        a.flags & 8192 &&
          ((s = a.memoizedState !== null),
          (a.stateNode.isHidden = s),
          !s ||
            (a.alternate !== null && a.alternate.memoizedState !== null) ||
            (dh = xe())),
        n & 4 && Sp(e));
      break;
    case 22:
      if (
        ((d = r !== null && r.memoizedState !== null),
        e.mode & 1 ? ((Fe = (u = Fe) || d), _t(t, e), (Fe = u)) : _t(t, e),
        Kt(e),
        n & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !d && e.mode & 1)
        )
          for (L = e, d = e.child; d !== null; ) {
            for (h = L = d; L !== null; ) {
              switch (((f = L), (v = f.child), f.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, f, f.return);
                  break;
                case 1:
                  wa(f, f.return);
                  var g = f.stateNode;
                  if (typeof g.componentWillUnmount == "function") {
                    ((n = f), (r = f.return));
                    try {
                      ((t = n),
                        (g.props = t.memoizedProps),
                        (g.state = t.memoizedState),
                        g.componentWillUnmount());
                    } catch (m) {
                      be(n, r, m);
                    }
                  }
                  break;
                case 5:
                  wa(f, f.return);
                  break;
                case 22:
                  if (f.memoizedState !== null) {
                    jp(h);
                    continue;
                  }
              }
              v !== null ? ((v.return = f), (L = v)) : jp(h);
            }
            d = d.sibling;
          }
        e: for (d = null, h = e; ; ) {
          if (h.tag === 5) {
            if (d === null) {
              d = h;
              try {
                ((a = h.stateNode),
                  u
                    ? ((s = a.style),
                      typeof s.setProperty == "function"
                        ? s.setProperty("display", "none", "important")
                        : (s.display = "none"))
                    : ((i = h.stateNode),
                      (l = h.memoizedProps.style),
                      (o =
                        l != null && l.hasOwnProperty("display")
                          ? l.display
                          : null),
                      (i.style.display = Cg("display", o))));
              } catch (m) {
                be(e, e.return, m);
              }
            }
          } else if (h.tag === 6) {
            if (d === null)
              try {
                h.stateNode.nodeValue = u ? "" : h.memoizedProps;
              } catch (m) {
                be(e, e.return, m);
              }
          } else if (
            ((h.tag !== 22 && h.tag !== 23) ||
              h.memoizedState === null ||
              h === e) &&
            h.child !== null
          ) {
            ((h.child.return = h), (h = h.child));
            continue;
          }
          if (h === e) break e;
          for (; h.sibling === null; ) {
            if (h.return === null || h.return === e) break e;
            (d === h && (d = null), (h = h.return));
          }
          (d === h && (d = null),
            (h.sibling.return = h.return),
            (h = h.sibling));
        }
      }
      break;
    case 19:
      (_t(t, e), Kt(e), n & 4 && Sp(e));
      break;
    case 21:
      break;
    default:
      (_t(t, e), Kt(e));
  }
}
function Kt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var r = e.return; r !== null; ) {
          if (ty(r)) {
            var n = r;
            break e;
          }
          r = r.return;
        }
        throw Error(P(160));
      }
      switch (n.tag) {
        case 5:
          var a = n.stateNode;
          n.flags & 32 && (Us(a, ""), (n.flags &= -33));
          var s = kp(e);
          Fu(e, s, a);
          break;
        case 3:
        case 4:
          var o = n.stateNode.containerInfo,
            i = kp(e);
          $u(e, i, o);
          break;
        default:
          throw Error(P(161));
      }
    } catch (l) {
      be(e, e.return, l);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Lk(e, t, r) {
  ((L = e), ay(e));
}
function ay(e, t, r) {
  for (var n = (e.mode & 1) !== 0; L !== null; ) {
    var a = L,
      s = a.child;
    if (a.tag === 22 && n) {
      var o = a.memoizedState !== null || Vo;
      if (!o) {
        var i = a.alternate,
          l = (i !== null && i.memoizedState !== null) || Fe;
        i = Vo;
        var u = Fe;
        if (((Vo = o), (Fe = l) && !u))
          for (L = a; L !== null; )
            ((o = L),
              (l = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Ep(a)
                : l !== null
                  ? ((l.return = o), (L = l))
                  : Ep(a));
        for (; s !== null; ) ((L = s), ay(s), (s = s.sibling));
        ((L = a), (Vo = i), (Fe = u));
      }
      _p(e);
    } else
      a.subtreeFlags & 8772 && s !== null ? ((s.return = a), (L = s)) : _p(e);
  }
}
function _p(e) {
  for (; L !== null; ) {
    var t = L;
    if (t.flags & 8772) {
      var r = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Fe || vl(5, t);
              break;
            case 1:
              var n = t.stateNode;
              if (t.flags & 4 && !Fe)
                if (r === null) n.componentDidMount();
                else {
                  var a =
                    t.elementType === t.type
                      ? r.memoizedProps
                      : Ct(t.type, r.memoizedProps);
                  n.componentDidUpdate(
                    a,
                    r.memoizedState,
                    n.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var s = t.updateQueue;
              s !== null && lp(t, s, n);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((r = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      r = t.child.stateNode;
                      break;
                    case 1:
                      r = t.child.stateNode;
                  }
                lp(t, o, r);
              }
              break;
            case 5:
              var i = t.stateNode;
              if (r === null && t.flags & 4) {
                r = i;
                var l = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    l.autoFocus && r.focus();
                    break;
                  case "img":
                    l.src && (r.src = l.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var d = u.memoizedState;
                  if (d !== null) {
                    var h = d.dehydrated;
                    h !== null && Hs(h);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(P(163));
          }
        Fe || (t.flags & 512 && Lu(t));
      } catch (f) {
        be(t, t.return, f);
      }
    }
    if (t === e) {
      L = null;
      break;
    }
    if (((r = t.sibling), r !== null)) {
      ((r.return = t.return), (L = r));
      break;
    }
    L = t.return;
  }
}
function jp(e) {
  for (; L !== null; ) {
    var t = L;
    if (t === e) {
      L = null;
      break;
    }
    var r = t.sibling;
    if (r !== null) {
      ((r.return = t.return), (L = r));
      break;
    }
    L = t.return;
  }
}
function Ep(e) {
  for (; L !== null; ) {
    var t = L;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var r = t.return;
          try {
            vl(4, t);
          } catch (l) {
            be(t, r, l);
          }
          break;
        case 1:
          var n = t.stateNode;
          if (typeof n.componentDidMount == "function") {
            var a = t.return;
            try {
              n.componentDidMount();
            } catch (l) {
              be(t, a, l);
            }
          }
          var s = t.return;
          try {
            Lu(t);
          } catch (l) {
            be(t, s, l);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Lu(t);
          } catch (l) {
            be(t, o, l);
          }
      }
    } catch (l) {
      be(t, t.return, l);
    }
    if (t === e) {
      L = null;
      break;
    }
    var i = t.sibling;
    if (i !== null) {
      ((i.return = t.return), (L = i));
      break;
    }
    L = t.return;
  }
}
var $k = Math.ceil,
  Hi = kr.ReactCurrentDispatcher,
  ch = kr.ReactCurrentOwner,
  bt = kr.ReactCurrentBatchConfig,
  ne = 0,
  Pe = null,
  je = null,
  Me = 0,
  it = 0,
  xa = nn(0),
  Ne = 0,
  ro = null,
  On = 0,
  yl = 0,
  uh = 0,
  As = null,
  et = null,
  dh = 0,
  La = 1 / 0,
  cr = null,
  Vi = !1,
  zu = null,
  Hr = null,
  Ko = !1,
  $r = null,
  Ki = 0,
  Ms = 0,
  Uu = null,
  yi = -1,
  bi = 0;
function Ve() {
  return ne & 6 ? xe() : yi !== -1 ? yi : (yi = xe());
}
function Vr(e) {
  return e.mode & 1
    ? ne & 2 && Me !== 0
      ? Me & -Me
      : xk.transition !== null
        ? (bi === 0 && (bi = Ug()), bi)
        : ((e = ie),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : Gg(e.type))),
          e)
    : 1;
}
function Lt(e, t, r, n) {
  if (50 < Ms) throw ((Ms = 0), (Uu = null), Error(P(185)));
  (po(e, r, n),
    (!(ne & 2) || e !== Pe) &&
      (e === Pe && (!(ne & 2) && (yl |= r), Ne === 4 && Ir(e, Me)),
      st(e, n),
      r === 1 && ne === 0 && !(t.mode & 1) && ((La = xe() + 500), pl && an())));
}
function st(e, t) {
  var r = e.callbackNode;
  x1(e, t);
  var n = Pi(e, e === Pe ? Me : 0);
  if (n === 0)
    (r !== null && If(r), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = n & -n), e.callbackPriority !== t)) {
    if ((r != null && If(r), t === 1))
      (e.tag === 0 ? wk(Np.bind(null, e)) : fv(Np.bind(null, e)),
        gk(function () {
          !(ne & 6) && an();
        }),
        (r = null));
    else {
      switch (Bg(n)) {
        case 1:
          r = Ld;
          break;
        case 4:
          r = Fg;
          break;
        case 16:
          r = Ti;
          break;
        case 536870912:
          r = zg;
          break;
        default:
          r = Ti;
      }
      r = hy(r, sy.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = r));
  }
}
function sy(e, t) {
  if (((yi = -1), (bi = 0), ne & 6)) throw Error(P(327));
  var r = e.callbackNode;
  if (Na() && e.callbackNode !== r) return null;
  var n = Pi(e, e === Pe ? Me : 0);
  if (n === 0) return null;
  if (n & 30 || n & e.expiredLanes || t) t = Gi(e, n);
  else {
    t = n;
    var a = ne;
    ne |= 2;
    var s = iy();
    (Pe !== e || Me !== t) && ((cr = null), (La = xe() + 500), jn(e, t));
    do
      try {
        Uk();
        break;
      } catch (i) {
        oy(e, i);
      }
    while (!0);
    (Jd(),
      (Hi.current = s),
      (ne = a),
      je !== null ? (t = 0) : ((Pe = null), (Me = 0), (t = Ne)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((a = mu(e)), a !== 0 && ((n = a), (t = Bu(e, a)))), t === 1)
    )
      throw ((r = ro), jn(e, 0), Ir(e, n), st(e, xe()), r);
    if (t === 6) Ir(e, n);
    else {
      if (
        ((a = e.current.alternate),
        !(n & 30) &&
          !Fk(a) &&
          ((t = Gi(e, n)),
          t === 2 && ((s = mu(e)), s !== 0 && ((n = s), (t = Bu(e, s)))),
          t === 1))
      )
        throw ((r = ro), jn(e, 0), Ir(e, n), st(e, xe()), r);
      switch (((e.finishedWork = a), (e.finishedLanes = n), t)) {
        case 0:
        case 1:
          throw Error(P(345));
        case 2:
          yn(e, et, cr);
          break;
        case 3:
          if (
            (Ir(e, n), (n & 130023424) === n && ((t = dh + 500 - xe()), 10 < t))
          ) {
            if (Pi(e, 0) !== 0) break;
            if (((a = e.suspendedLanes), (a & n) !== n)) {
              (Ve(), (e.pingedLanes |= e.suspendedLanes & a));
              break;
            }
            e.timeoutHandle = Su(yn.bind(null, e, et, cr), t);
            break;
          }
          yn(e, et, cr);
          break;
        case 4:
          if ((Ir(e, n), (n & 4194240) === n)) break;
          for (t = e.eventTimes, a = -1; 0 < n; ) {
            var o = 31 - Dt(n);
            ((s = 1 << o), (o = t[o]), o > a && (a = o), (n &= ~s));
          }
          if (
            ((n = a),
            (n = xe() - n),
            (n =
              (120 > n
                ? 120
                : 480 > n
                  ? 480
                  : 1080 > n
                    ? 1080
                    : 1920 > n
                      ? 1920
                      : 3e3 > n
                        ? 3e3
                        : 4320 > n
                          ? 4320
                          : 1960 * $k(n / 1960)) - n),
            10 < n)
          ) {
            e.timeoutHandle = Su(yn.bind(null, e, et, cr), n);
            break;
          }
          yn(e, et, cr);
          break;
        case 5:
          yn(e, et, cr);
          break;
        default:
          throw Error(P(329));
      }
    }
  }
  return (st(e, xe()), e.callbackNode === r ? sy.bind(null, e) : null);
}
function Bu(e, t) {
  var r = As;
  return (
    e.current.memoizedState.isDehydrated && (jn(e, t).flags |= 256),
    (e = Gi(e, t)),
    e !== 2 && ((t = et), (et = r), t !== null && Wu(t)),
    e
  );
}
function Wu(e) {
  et === null ? (et = e) : et.push.apply(et, e);
}
function Fk(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var r = t.updateQueue;
      if (r !== null && ((r = r.stores), r !== null))
        for (var n = 0; n < r.length; n++) {
          var a = r[n],
            s = a.getSnapshot;
          a = a.value;
          try {
            if (!$t(s(), a)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((r = t.child), t.subtreeFlags & 16384 && r !== null))
      ((r.return = t), (t = r));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function Ir(e, t) {
  for (
    t &= ~uh,
      t &= ~yl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var r = 31 - Dt(t),
      n = 1 << r;
    ((e[r] = -1), (t &= ~n));
  }
}
function Np(e) {
  if (ne & 6) throw Error(P(327));
  Na();
  var t = Pi(e, 0);
  if (!(t & 1)) return (st(e, xe()), null);
  var r = Gi(e, t);
  if (e.tag !== 0 && r === 2) {
    var n = mu(e);
    n !== 0 && ((t = n), (r = Bu(e, n)));
  }
  if (r === 1) throw ((r = ro), jn(e, 0), Ir(e, t), st(e, xe()), r);
  if (r === 6) throw Error(P(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    yn(e, et, cr),
    st(e, xe()),
    null
  );
}
function hh(e, t) {
  var r = ne;
  ne |= 1;
  try {
    return e(t);
  } finally {
    ((ne = r), ne === 0 && ((La = xe() + 500), pl && an()));
  }
}
function An(e) {
  $r !== null && $r.tag === 0 && !(ne & 6) && Na();
  var t = ne;
  ne |= 1;
  var r = bt.transition,
    n = ie;
  try {
    if (((bt.transition = null), (ie = 1), e)) return e();
  } finally {
    ((ie = n), (bt.transition = r), (ne = t), !(ne & 6) && an());
  }
}
function fh() {
  ((it = xa.current), pe(xa));
}
function jn(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var r = e.timeoutHandle;
  if ((r !== -1 && ((e.timeoutHandle = -1), mk(r)), je !== null))
    for (r = je.return; r !== null; ) {
      var n = r;
      switch ((Kd(n), n.tag)) {
        case 1:
          ((n = n.type.childContextTypes), n != null && Ii());
          break;
        case 3:
          (Ia(), pe(nt), pe(ze), rh());
          break;
        case 5:
          th(n);
          break;
        case 4:
          Ia();
          break;
        case 13:
          pe(ge);
          break;
        case 19:
          pe(ge);
          break;
        case 10:
          Yd(n.type._context);
          break;
        case 22:
        case 23:
          fh();
      }
      r = r.return;
    }
  if (
    ((Pe = e),
    (je = e = Kr(e.current, null)),
    (Me = it = t),
    (Ne = 0),
    (ro = null),
    (uh = yl = On = 0),
    (et = As = null),
    kn !== null)
  ) {
    for (t = 0; t < kn.length; t++)
      if (((r = kn[t]), (n = r.interleaved), n !== null)) {
        r.interleaved = null;
        var a = n.next,
          s = r.pending;
        if (s !== null) {
          var o = s.next;
          ((s.next = a), (n.next = o));
        }
        r.pending = n;
      }
    kn = null;
  }
  return e;
}
function oy(e, t) {
  do {
    var r = je;
    try {
      if ((Jd(), (mi.current = qi), Wi)) {
        for (var n = ve.memoizedState; n !== null; ) {
          var a = n.queue;
          (a !== null && (a.pending = null), (n = n.next));
        }
        Wi = !1;
      }
      if (
        ((Rn = 0),
        (Te = Ee = ve = null),
        (Rs = !1),
        (Zs = 0),
        (ch.current = null),
        r === null || r.return === null)
      ) {
        ((Ne = 1), (ro = t), (je = null));
        break;
      }
      e: {
        var s = e,
          o = r.return,
          i = r,
          l = t;
        if (
          ((t = Me),
          (i.flags |= 32768),
          l !== null && typeof l == "object" && typeof l.then == "function")
        ) {
          var u = l,
            d = i,
            h = d.tag;
          if (!(d.mode & 1) && (h === 0 || h === 11 || h === 15)) {
            var f = d.alternate;
            f
              ? ((d.updateQueue = f.updateQueue),
                (d.memoizedState = f.memoizedState),
                (d.lanes = f.lanes))
              : ((d.updateQueue = null), (d.memoizedState = null));
          }
          var v = pp(o);
          if (v !== null) {
            ((v.flags &= -257),
              mp(v, o, i, s, t),
              v.mode & 1 && fp(s, u, t),
              (t = v),
              (l = u));
            var g = t.updateQueue;
            if (g === null) {
              var m = new Set();
              (m.add(l), (t.updateQueue = m));
            } else g.add(l);
            break e;
          } else {
            if (!(t & 1)) {
              (fp(s, u, t), ph());
              break e;
            }
            l = Error(P(426));
          }
        } else if (me && i.mode & 1) {
          var w = pp(o);
          if (w !== null) {
            (!(w.flags & 65536) && (w.flags |= 256),
              mp(w, o, i, s, t),
              Gd(Da(l, i)));
            break e;
          }
        }
        ((s = l = Da(l, i)),
          Ne !== 4 && (Ne = 2),
          As === null ? (As = [s]) : As.push(s),
          (s = o));
        do {
          switch (s.tag) {
            case 3:
              ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
              var y = Bv(s, l, t);
              ip(s, y);
              break e;
            case 1:
              i = l;
              var b = s.type,
                x = s.stateNode;
              if (
                !(s.flags & 128) &&
                (typeof b.getDerivedStateFromError == "function" ||
                  (x !== null &&
                    typeof x.componentDidCatch == "function" &&
                    (Hr === null || !Hr.has(x))))
              ) {
                ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
                var k = Wv(s, i, t);
                ip(s, k);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      cy(r);
    } catch (S) {
      ((t = S), je === r && r !== null && (je = r = r.return));
      continue;
    }
    break;
  } while (!0);
}
function iy() {
  var e = Hi.current;
  return ((Hi.current = qi), e === null ? qi : e);
}
function ph() {
  ((Ne === 0 || Ne === 3 || Ne === 2) && (Ne = 4),
    Pe === null || (!(On & 268435455) && !(yl & 268435455)) || Ir(Pe, Me));
}
function Gi(e, t) {
  var r = ne;
  ne |= 2;
  var n = iy();
  (Pe !== e || Me !== t) && ((cr = null), jn(e, t));
  do
    try {
      zk();
      break;
    } catch (a) {
      oy(e, a);
    }
  while (!0);
  if ((Jd(), (ne = r), (Hi.current = n), je !== null)) throw Error(P(261));
  return ((Pe = null), (Me = 0), Ne);
}
function zk() {
  for (; je !== null; ) ly(je);
}
function Uk() {
  for (; je !== null && !h1(); ) ly(je);
}
function ly(e) {
  var t = dy(e.alternate, e, it);
  ((e.memoizedProps = e.pendingProps),
    t === null ? cy(e) : (je = t),
    (ch.current = null));
}
function cy(e) {
  var t = e;
  do {
    var r = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((r = Mk(r, t)), r !== null)) {
        ((r.flags &= 32767), (je = r));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((Ne = 6), (je = null));
        return;
      }
    } else if (((r = Ak(r, t, it)), r !== null)) {
      je = r;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      je = t;
      return;
    }
    je = t = e;
  } while (t !== null);
  Ne === 0 && (Ne = 5);
}
function yn(e, t, r) {
  var n = ie,
    a = bt.transition;
  try {
    ((bt.transition = null), (ie = 1), Bk(e, t, r, n));
  } finally {
    ((bt.transition = a), (ie = n));
  }
  return null;
}
function Bk(e, t, r, n) {
  do Na();
  while ($r !== null);
  if (ne & 6) throw Error(P(327));
  r = e.finishedWork;
  var a = e.finishedLanes;
  if (r === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), r === e.current))
    throw Error(P(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var s = r.lanes | r.childLanes;
  if (
    (k1(e, s),
    e === Pe && ((je = Pe = null), (Me = 0)),
    (!(r.subtreeFlags & 2064) && !(r.flags & 2064)) ||
      Ko ||
      ((Ko = !0),
      hy(Ti, function () {
        return (Na(), null);
      })),
    (s = (r.flags & 15990) !== 0),
    r.subtreeFlags & 15990 || s)
  ) {
    ((s = bt.transition), (bt.transition = null));
    var o = ie;
    ie = 1;
    var i = ne;
    ((ne |= 4),
      (ch.current = null),
      Dk(e, r),
      ny(r, e),
      lk(xu),
      (Ri = !!wu),
      (xu = wu = null),
      (e.current = r),
      Lk(r),
      f1(),
      (ne = i),
      (ie = o),
      (bt.transition = s));
  } else e.current = r;
  if (
    (Ko && ((Ko = !1), ($r = e), (Ki = a)),
    (s = e.pendingLanes),
    s === 0 && (Hr = null),
    g1(r.stateNode),
    st(e, xe()),
    t !== null)
  )
    for (n = e.onRecoverableError, r = 0; r < t.length; r++)
      ((a = t[r]), n(a.value, { componentStack: a.stack, digest: a.digest }));
  if (Vi) throw ((Vi = !1), (e = zu), (zu = null), e);
  return (
    Ki & 1 && e.tag !== 0 && Na(),
    (s = e.pendingLanes),
    s & 1 ? (e === Uu ? Ms++ : ((Ms = 0), (Uu = e))) : (Ms = 0),
    an(),
    null
  );
}
function Na() {
  if ($r !== null) {
    var e = Bg(Ki),
      t = bt.transition,
      r = ie;
    try {
      if (((bt.transition = null), (ie = 16 > e ? 16 : e), $r === null))
        var n = !1;
      else {
        if (((e = $r), ($r = null), (Ki = 0), ne & 6)) throw Error(P(331));
        var a = ne;
        for (ne |= 4, L = e.current; L !== null; ) {
          var s = L,
            o = s.child;
          if (L.flags & 16) {
            var i = s.deletions;
            if (i !== null) {
              for (var l = 0; l < i.length; l++) {
                var u = i[l];
                for (L = u; L !== null; ) {
                  var d = L;
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Os(8, d, s);
                  }
                  var h = d.child;
                  if (h !== null) ((h.return = d), (L = h));
                  else
                    for (; L !== null; ) {
                      d = L;
                      var f = d.sibling,
                        v = d.return;
                      if ((ey(d), d === u)) {
                        L = null;
                        break;
                      }
                      if (f !== null) {
                        ((f.return = v), (L = f));
                        break;
                      }
                      L = v;
                    }
                }
              }
              var g = s.alternate;
              if (g !== null) {
                var m = g.child;
                if (m !== null) {
                  g.child = null;
                  do {
                    var w = m.sibling;
                    ((m.sibling = null), (m = w));
                  } while (m !== null);
                }
              }
              L = s;
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) ((o.return = s), (L = o));
          else
            e: for (; L !== null; ) {
              if (((s = L), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Os(9, s, s.return);
                }
              var y = s.sibling;
              if (y !== null) {
                ((y.return = s.return), (L = y));
                break e;
              }
              L = s.return;
            }
        }
        var b = e.current;
        for (L = b; L !== null; ) {
          o = L;
          var x = o.child;
          if (o.subtreeFlags & 2064 && x !== null) ((x.return = o), (L = x));
          else
            e: for (o = b; L !== null; ) {
              if (((i = L), i.flags & 2048))
                try {
                  switch (i.tag) {
                    case 0:
                    case 11:
                    case 15:
                      vl(9, i);
                  }
                } catch (S) {
                  be(i, i.return, S);
                }
              if (i === o) {
                L = null;
                break e;
              }
              var k = i.sibling;
              if (k !== null) {
                ((k.return = i.return), (L = k));
                break e;
              }
              L = i.return;
            }
        }
        if (
          ((ne = a), an(), Zt && typeof Zt.onPostCommitFiberRoot == "function")
        )
          try {
            Zt.onPostCommitFiberRoot(cl, e);
          } catch {}
        n = !0;
      }
      return n;
    } finally {
      ((ie = r), (bt.transition = t));
    }
  }
  return !1;
}
function Cp(e, t, r) {
  ((t = Da(r, t)),
    (t = Bv(e, t, 1)),
    (e = qr(e, t, 1)),
    (t = Ve()),
    e !== null && (po(e, 1, t), st(e, t)));
}
function be(e, t, r) {
  if (e.tag === 3) Cp(e, e, r);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Cp(t, e, r);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof n.componentDidCatch == "function" &&
            (Hr === null || !Hr.has(n)))
        ) {
          ((e = Da(r, e)),
            (e = Wv(t, e, 1)),
            (t = qr(t, e, 1)),
            (e = Ve()),
            t !== null && (po(t, 1, e), st(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function Wk(e, t, r) {
  var n = e.pingCache;
  (n !== null && n.delete(t),
    (t = Ve()),
    (e.pingedLanes |= e.suspendedLanes & r),
    Pe === e &&
      (Me & r) === r &&
      (Ne === 4 || (Ne === 3 && (Me & 130023424) === Me && 500 > xe() - dh)
        ? jn(e, 0)
        : (uh |= r)),
    st(e, t));
}
function uy(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Lo), (Lo <<= 1), !(Lo & 130023424) && (Lo = 4194304))
      : (t = 1));
  var r = Ve();
  ((e = yr(e, t)), e !== null && (po(e, t, r), st(e, r)));
}
function qk(e) {
  var t = e.memoizedState,
    r = 0;
  (t !== null && (r = t.retryLane), uy(e, r));
}
function Hk(e, t) {
  var r = 0;
  switch (e.tag) {
    case 13:
      var n = e.stateNode,
        a = e.memoizedState;
      a !== null && (r = a.retryLane);
      break;
    case 19:
      n = e.stateNode;
      break;
    default:
      throw Error(P(314));
  }
  (n !== null && n.delete(t), uy(e, r));
}
var dy;
dy = function (e, t, r) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || nt.current) rt = !0;
    else {
      if (!(e.lanes & r) && !(t.flags & 128)) return ((rt = !1), Ok(e, t, r));
      rt = !!(e.flags & 131072);
    }
  else ((rt = !1), me && t.flags & 1048576 && pv(t, $i, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var n = t.type;
      (vi(e, t), (e = t.pendingProps));
      var a = Oa(t, ze.current);
      (Ea(t, r), (a = ah(null, t, n, e, a, r)));
      var s = sh();
      return (
        (t.flags |= 1),
        typeof a == "object" &&
        a !== null &&
        typeof a.render == "function" &&
        a.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            at(n) ? ((s = !0), Di(t)) : (s = !1),
            (t.memoizedState =
              a.state !== null && a.state !== void 0 ? a.state : null),
            Zd(t),
            (a.updater = gl),
            (t.stateNode = a),
            (a._reactInternals = t),
            Pu(t, n, e, r),
            (t = Au(null, t, n, !0, s, r)))
          : ((t.tag = 0), me && s && Vd(t), We(null, t, a, r), (t = t.child)),
        t
      );
    case 16:
      n = t.elementType;
      e: {
        switch (
          (vi(e, t),
          (e = t.pendingProps),
          (a = n._init),
          (n = a(n._payload)),
          (t.type = n),
          (a = t.tag = Kk(n)),
          (e = Ct(n, e)),
          a)
        ) {
          case 0:
            t = Ou(null, t, n, e, r);
            break e;
          case 1:
            t = yp(null, t, n, e, r);
            break e;
          case 11:
            t = gp(null, t, n, e, r);
            break e;
          case 14:
            t = vp(null, t, n, Ct(n.type, e), r);
            break e;
        }
        throw Error(P(306, n, ""));
      }
      return t;
    case 0:
      return (
        (n = t.type),
        (a = t.pendingProps),
        (a = t.elementType === n ? a : Ct(n, a)),
        Ou(e, t, n, a, r)
      );
    case 1:
      return (
        (n = t.type),
        (a = t.pendingProps),
        (a = t.elementType === n ? a : Ct(n, a)),
        yp(e, t, n, a, r)
      );
    case 3:
      e: {
        if ((Kv(t), e === null)) throw Error(P(387));
        ((n = t.pendingProps),
          (s = t.memoizedState),
          (a = s.element),
          wv(e, t),
          Ui(t, n, null, r));
        var o = t.memoizedState;
        if (((n = o.element), s.isDehydrated))
          if (
            ((s = {
              element: n,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            ((a = Da(Error(P(423)), t)), (t = bp(e, t, n, r, a)));
            break e;
          } else if (n !== a) {
            ((a = Da(Error(P(424)), t)), (t = bp(e, t, n, r, a)));
            break e;
          } else
            for (
              ct = Wr(t.stateNode.containerInfo.firstChild),
                ut = t,
                me = !0,
                Ot = null,
                r = yv(t, null, n, r),
                t.child = r;
              r;

            )
              ((r.flags = (r.flags & -3) | 4096), (r = r.sibling));
        else {
          if ((Aa(), n === a)) {
            t = br(e, t, r);
            break e;
          }
          We(e, t, n, r);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        xv(t),
        e === null && Nu(t),
        (n = t.type),
        (a = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (o = a.children),
        ku(n, a) ? (o = null) : s !== null && ku(n, s) && (t.flags |= 32),
        Vv(e, t),
        We(e, t, o, r),
        t.child
      );
    case 6:
      return (e === null && Nu(t), null);
    case 13:
      return Gv(e, t, r);
    case 4:
      return (
        eh(t, t.stateNode.containerInfo),
        (n = t.pendingProps),
        e === null ? (t.child = Ma(t, null, n, r)) : We(e, t, n, r),
        t.child
      );
    case 11:
      return (
        (n = t.type),
        (a = t.pendingProps),
        (a = t.elementType === n ? a : Ct(n, a)),
        gp(e, t, n, a, r)
      );
    case 7:
      return (We(e, t, t.pendingProps, r), t.child);
    case 8:
      return (We(e, t, t.pendingProps.children, r), t.child);
    case 12:
      return (We(e, t, t.pendingProps.children, r), t.child);
    case 10:
      e: {
        if (
          ((n = t.type._context),
          (a = t.pendingProps),
          (s = t.memoizedProps),
          (o = a.value),
          ue(Fi, n._currentValue),
          (n._currentValue = o),
          s !== null)
        )
          if ($t(s.value, o)) {
            if (s.children === a.children && !nt.current) {
              t = br(e, t, r);
              break e;
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null; ) {
              var i = s.dependencies;
              if (i !== null) {
                o = s.child;
                for (var l = i.firstContext; l !== null; ) {
                  if (l.context === n) {
                    if (s.tag === 1) {
                      ((l = mr(-1, r & -r)), (l.tag = 2));
                      var u = s.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var d = u.pending;
                        (d === null
                          ? (l.next = l)
                          : ((l.next = d.next), (d.next = l)),
                          (u.pending = l));
                      }
                    }
                    ((s.lanes |= r),
                      (l = s.alternate),
                      l !== null && (l.lanes |= r),
                      Cu(s.return, r, t),
                      (i.lanes |= r));
                    break;
                  }
                  l = l.next;
                }
              } else if (s.tag === 10) o = s.type === t.type ? null : s.child;
              else if (s.tag === 18) {
                if (((o = s.return), o === null)) throw Error(P(341));
                ((o.lanes |= r),
                  (i = o.alternate),
                  i !== null && (i.lanes |= r),
                  Cu(o, r, t),
                  (o = s.sibling));
              } else o = s.child;
              if (o !== null) o.return = s;
              else
                for (o = s; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((s = o.sibling), s !== null)) {
                    ((s.return = o.return), (o = s));
                    break;
                  }
                  o = o.return;
                }
              s = o;
            }
        (We(e, t, a.children, r), (t = t.child));
      }
      return t;
    case 9:
      return (
        (a = t.type),
        (n = t.pendingProps.children),
        Ea(t, r),
        (a = kt(a)),
        (n = n(a)),
        (t.flags |= 1),
        We(e, t, n, r),
        t.child
      );
    case 14:
      return (
        (n = t.type),
        (a = Ct(n, t.pendingProps)),
        (a = Ct(n.type, a)),
        vp(e, t, n, a, r)
      );
    case 15:
      return qv(e, t, t.type, t.pendingProps, r);
    case 17:
      return (
        (n = t.type),
        (a = t.pendingProps),
        (a = t.elementType === n ? a : Ct(n, a)),
        vi(e, t),
        (t.tag = 1),
        at(n) ? ((e = !0), Di(t)) : (e = !1),
        Ea(t, r),
        Uv(t, n, a),
        Pu(t, n, a, r),
        Au(null, t, n, !0, e, r)
      );
    case 19:
      return Qv(e, t, r);
    case 22:
      return Hv(e, t, r);
  }
  throw Error(P(156, t.tag));
};
function hy(e, t) {
  return $g(e, t);
}
function Vk(e, t, r, n) {
  ((this.tag = e),
    (this.key = r),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = n),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function yt(e, t, r, n) {
  return new Vk(e, t, r, n);
}
function mh(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function Kk(e) {
  if (typeof e == "function") return mh(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Md)) return 11;
    if (e === Id) return 14;
  }
  return 2;
}
function Kr(e, t) {
  var r = e.alternate;
  return (
    r === null
      ? ((r = yt(e.tag, t, e.key, e.mode)),
        (r.elementType = e.elementType),
        (r.type = e.type),
        (r.stateNode = e.stateNode),
        (r.alternate = e),
        (e.alternate = r))
      : ((r.pendingProps = t),
        (r.type = e.type),
        (r.flags = 0),
        (r.subtreeFlags = 0),
        (r.deletions = null)),
    (r.flags = e.flags & 14680064),
    (r.childLanes = e.childLanes),
    (r.lanes = e.lanes),
    (r.child = e.child),
    (r.memoizedProps = e.memoizedProps),
    (r.memoizedState = e.memoizedState),
    (r.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (r.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (r.sibling = e.sibling),
    (r.index = e.index),
    (r.ref = e.ref),
    r
  );
}
function wi(e, t, r, n, a, s) {
  var o = 2;
  if (((n = e), typeof e == "function")) mh(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case da:
        return En(r.children, a, s, t);
      case Ad:
        ((o = 8), (a |= 8));
        break;
      case eu:
        return (
          (e = yt(12, r, t, a | 2)),
          (e.elementType = eu),
          (e.lanes = s),
          e
        );
      case tu:
        return ((e = yt(13, r, t, a)), (e.elementType = tu), (e.lanes = s), e);
      case ru:
        return ((e = yt(19, r, t, a)), (e.elementType = ru), (e.lanes = s), e);
      case xg:
        return bl(r, a, s, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case bg:
              o = 10;
              break e;
            case wg:
              o = 9;
              break e;
            case Md:
              o = 11;
              break e;
            case Id:
              o = 14;
              break e;
            case Or:
              ((o = 16), (n = null));
              break e;
          }
        throw Error(P(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = yt(o, r, t, a)),
    (t.elementType = e),
    (t.type = n),
    (t.lanes = s),
    t
  );
}
function En(e, t, r, n) {
  return ((e = yt(7, e, n, t)), (e.lanes = r), e);
}
function bl(e, t, r, n) {
  return (
    (e = yt(22, e, n, t)),
    (e.elementType = xg),
    (e.lanes = r),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function jc(e, t, r) {
  return ((e = yt(6, e, null, t)), (e.lanes = r), e);
}
function Ec(e, t, r) {
  return (
    (t = yt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = r),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Gk(e, t, r, n, a) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = oc(0)),
    (this.expirationTimes = oc(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = oc(0)),
    (this.identifierPrefix = n),
    (this.onRecoverableError = a),
    (this.mutableSourceEagerHydrationData = null));
}
function gh(e, t, r, n, a, s, o, i, l) {
  return (
    (e = new Gk(e, t, r, i, l)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = yt(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: n,
      isDehydrated: r,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Zd(s),
    e
  );
}
function Qk(e, t, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: ua,
    key: n == null ? null : "" + n,
    children: e,
    containerInfo: t,
    implementation: r,
  };
}
function fy(e) {
  if (!e) return Jr;
  e = e._reactInternals;
  e: {
    if ($n(e) !== e || e.tag !== 1) throw Error(P(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (at(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(P(171));
  }
  if (e.tag === 1) {
    var r = e.type;
    if (at(r)) return hv(e, r, t);
  }
  return t;
}
function py(e, t, r, n, a, s, o, i, l) {
  return (
    (e = gh(r, n, !0, e, a, s, o, i, l)),
    (e.context = fy(null)),
    (r = e.current),
    (n = Ve()),
    (a = Vr(r)),
    (s = mr(n, a)),
    (s.callback = t ?? null),
    qr(r, s, a),
    (e.current.lanes = a),
    po(e, a, n),
    st(e, n),
    e
  );
}
function wl(e, t, r, n) {
  var a = t.current,
    s = Ve(),
    o = Vr(a);
  return (
    (r = fy(r)),
    t.context === null ? (t.context = r) : (t.pendingContext = r),
    (t = mr(s, o)),
    (t.payload = { element: e }),
    (n = n === void 0 ? null : n),
    n !== null && (t.callback = n),
    (e = qr(a, t, o)),
    e !== null && (Lt(e, a, o, s), pi(e, a, o)),
    o
  );
}
function Qi(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Tp(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var r = e.retryLane;
    e.retryLane = r !== 0 && r < t ? r : t;
  }
}
function vh(e, t) {
  (Tp(e, t), (e = e.alternate) && Tp(e, t));
}
function Jk() {
  return null;
}
var my =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function yh(e) {
  this._internalRoot = e;
}
xl.prototype.render = yh.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(P(409));
  wl(e, t, null, null);
};
xl.prototype.unmount = yh.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (An(function () {
      wl(null, e, null, null);
    }),
      (t[vr] = null));
  }
};
function xl(e) {
  this._internalRoot = e;
}
xl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Hg();
    e = { blockedOn: null, target: e, priority: t };
    for (var r = 0; r < Mr.length && t !== 0 && t < Mr[r].priority; r++);
    (Mr.splice(r, 0, e), r === 0 && Kg(e));
  }
};
function bh(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function kl(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Pp() {}
function Yk(e, t, r, n, a) {
  if (a) {
    if (typeof n == "function") {
      var s = n;
      n = function () {
        var u = Qi(o);
        s.call(u);
      };
    }
    var o = py(t, n, e, 0, null, !1, !1, "", Pp);
    return (
      (e._reactRootContainer = o),
      (e[vr] = o.current),
      Gs(e.nodeType === 8 ? e.parentNode : e),
      An(),
      o
    );
  }
  for (; (a = e.lastChild); ) e.removeChild(a);
  if (typeof n == "function") {
    var i = n;
    n = function () {
      var u = Qi(l);
      i.call(u);
    };
  }
  var l = gh(e, 0, !1, null, null, !1, !1, "", Pp);
  return (
    (e._reactRootContainer = l),
    (e[vr] = l.current),
    Gs(e.nodeType === 8 ? e.parentNode : e),
    An(function () {
      wl(t, l, r, n);
    }),
    l
  );
}
function Sl(e, t, r, n, a) {
  var s = r._reactRootContainer;
  if (s) {
    var o = s;
    if (typeof a == "function") {
      var i = a;
      a = function () {
        var l = Qi(o);
        i.call(l);
      };
    }
    wl(t, o, e, a);
  } else o = Yk(r, t, e, a, n);
  return Qi(o);
}
Wg = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var r = xs(t.pendingLanes);
        r !== 0 &&
          ($d(t, r | 1), st(t, xe()), !(ne & 6) && ((La = xe() + 500), an()));
      }
      break;
    case 13:
      (An(function () {
        var n = yr(e, 1);
        if (n !== null) {
          var a = Ve();
          Lt(n, e, 1, a);
        }
      }),
        vh(e, 1));
  }
};
Fd = function (e) {
  if (e.tag === 13) {
    var t = yr(e, 134217728);
    if (t !== null) {
      var r = Ve();
      Lt(t, e, 134217728, r);
    }
    vh(e, 134217728);
  }
};
qg = function (e) {
  if (e.tag === 13) {
    var t = Vr(e),
      r = yr(e, t);
    if (r !== null) {
      var n = Ve();
      Lt(r, e, t, n);
    }
    vh(e, t);
  }
};
Hg = function () {
  return ie;
};
Vg = function (e, t) {
  var r = ie;
  try {
    return ((ie = e), t());
  } finally {
    ie = r;
  }
};
hu = function (e, t, r) {
  switch (t) {
    case "input":
      if ((su(e, r), (t = r.name), r.type === "radio" && t != null)) {
        for (r = e; r.parentNode; ) r = r.parentNode;
        for (
          r = r.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < r.length;
          t++
        ) {
          var n = r[t];
          if (n !== e && n.form === e.form) {
            var a = fl(n);
            if (!a) throw Error(P(90));
            (Sg(n), su(n, a));
          }
        }
      }
      break;
    case "textarea":
      jg(e, r);
      break;
    case "select":
      ((t = r.value), t != null && ka(e, !!r.multiple, t, !1));
  }
};
Og = hh;
Ag = An;
var Xk = { usingClientEntryPoint: !1, Events: [go, ma, fl, Pg, Rg, hh] },
  os = {
    findFiberByHostInstance: xn,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  Zk = {
    bundleType: os.bundleType,
    version: os.version,
    rendererPackageName: os.rendererPackageName,
    rendererConfig: os.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: kr.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = Dg(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: os.findFiberByHostInstance || Jk,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Go = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Go.isDisabled && Go.supportsFiber)
    try {
      ((cl = Go.inject(Zk)), (Zt = Go));
    } catch {}
}
ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Xk;
ft.createPortal = function (e, t) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!bh(t)) throw Error(P(200));
  return Qk(e, t, null, r);
};
ft.createRoot = function (e, t) {
  if (!bh(e)) throw Error(P(299));
  var r = !1,
    n = "",
    a = my;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (r = !0),
      t.identifierPrefix !== void 0 && (n = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (a = t.onRecoverableError)),
    (t = gh(e, 1, !1, null, null, r, !1, n, a)),
    (e[vr] = t.current),
    Gs(e.nodeType === 8 ? e.parentNode : e),
    new yh(t)
  );
};
ft.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(P(188))
      : ((e = Object.keys(e).join(",")), Error(P(268, e)));
  return ((e = Dg(t)), (e = e === null ? null : e.stateNode), e);
};
ft.flushSync = function (e) {
  return An(e);
};
ft.hydrate = function (e, t, r) {
  if (!kl(t)) throw Error(P(200));
  return Sl(null, e, t, !0, r);
};
ft.hydrateRoot = function (e, t, r) {
  if (!bh(e)) throw Error(P(405));
  var n = (r != null && r.hydratedSources) || null,
    a = !1,
    s = "",
    o = my;
  if (
    (r != null &&
      (r.unstable_strictMode === !0 && (a = !0),
      r.identifierPrefix !== void 0 && (s = r.identifierPrefix),
      r.onRecoverableError !== void 0 && (o = r.onRecoverableError)),
    (t = py(t, null, e, 1, r ?? null, a, !1, s, o)),
    (e[vr] = t.current),
    Gs(e),
    n)
  )
    for (e = 0; e < n.length; e++)
      ((r = n[e]),
        (a = r._getVersion),
        (a = a(r._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [r, a])
          : t.mutableSourceEagerHydrationData.push(r, a));
  return new xl(t);
};
ft.render = function (e, t, r) {
  if (!kl(t)) throw Error(P(200));
  return Sl(null, e, t, !1, r);
};
ft.unmountComponentAtNode = function (e) {
  if (!kl(e)) throw Error(P(40));
  return e._reactRootContainer
    ? (An(function () {
        Sl(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[vr] = null));
        });
      }),
      !0)
    : !1;
};
ft.unstable_batchedUpdates = hh;
ft.unstable_renderSubtreeIntoContainer = function (e, t, r, n) {
  if (!kl(r)) throw Error(P(200));
  if (e == null || e._reactInternals === void 0) throw Error(P(38));
  return Sl(e, t, r, !1, n);
};
ft.version = "18.3.1-next-f1338f8080-20240426";
function gy() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(gy);
    } catch (e) {
      console.error(e);
    }
}
(gy(), (mg.exports = ft));
var yo = mg.exports;
const vy = rg(yo);
var yy,
  Rp = yo;
((yy = Rp.createRoot), Rp.hydrateRoot);
const eS = 1,
  tS = 1e6;
let Nc = 0;
function rS() {
  return ((Nc = (Nc + 1) % Number.MAX_SAFE_INTEGER), Nc.toString());
}
const Cc = new Map(),
  Op = (e) => {
    if (Cc.has(e)) return;
    const t = setTimeout(() => {
      (Cc.delete(e), Is({ type: "REMOVE_TOAST", toastId: e }));
    }, tS);
    Cc.set(e, t);
  },
  nS = (e, t) => {
    switch (t.type) {
      case "ADD_TOAST":
        return { ...e, toasts: [t.toast, ...e.toasts].slice(0, eS) };
      case "UPDATE_TOAST":
        return {
          ...e,
          toasts: e.toasts.map((r) =>
            r.id === t.toast.id ? { ...r, ...t.toast } : r,
          ),
        };
      case "DISMISS_TOAST": {
        const { toastId: r } = t;
        return (
          r
            ? Op(r)
            : e.toasts.forEach((n) => {
                Op(n.id);
              }),
          {
            ...e,
            toasts: e.toasts.map((n) =>
              n.id === r || r === void 0 ? { ...n, open: !1 } : n,
            ),
          }
        );
      }
      case "REMOVE_TOAST":
        return t.toastId === void 0
          ? { ...e, toasts: [] }
          : { ...e, toasts: e.toasts.filter((r) => r.id !== t.toastId) };
    }
  },
  xi = [];
let ki = { toasts: [] };
function Is(e) {
  ((ki = nS(ki, e)),
    xi.forEach((t) => {
      t(ki);
    }));
}
function aS({ ...e }) {
  const t = rS(),
    r = (a) => Is({ type: "UPDATE_TOAST", toast: { ...a, id: t } }),
    n = () => Is({ type: "DISMISS_TOAST", toastId: t });
  return (
    Is({
      type: "ADD_TOAST",
      toast: {
        ...e,
        id: t,
        open: !0,
        onOpenChange: (a) => {
          a || n();
        },
      },
    }),
    { id: t, dismiss: n, update: r }
  );
}
function sS() {
  const [e, t] = p.useState(ki);
  return (
    p.useEffect(
      () => (
        xi.push(t),
        () => {
          const r = xi.indexOf(t);
          r > -1 && xi.splice(r, 1);
        }
      ),
      [e],
    ),
    {
      ...e,
      toast: aS,
      dismiss: (r) => Is({ type: "DISMISS_TOAST", toastId: r }),
    }
  );
}
function F(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return function (n) {
    if ((e == null || e(n), r === !1 || !n.defaultPrevented))
      return t == null ? void 0 : t(n);
  };
}
function oS(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function _l(...e) {
  return (t) => e.forEach((r) => oS(r, t));
}
function Se(...e) {
  return p.useCallback(_l(...e), e);
}
function iS(e, t = []) {
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
  return ((a.scopeName = e), [n, lS(a, ...t)]);
}
function lS(...e) {
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
var Mn = p.forwardRef((e, t) => {
  const { children: r, ...n } = e,
    a = p.Children.toArray(r),
    s = a.find(cS);
  if (s) {
    const o = s.props.children,
      i = a.map((l) =>
        l === s
          ? p.Children.count(o) > 1
            ? p.Children.only(null)
            : p.isValidElement(o)
              ? o.props.children
              : null
          : l,
      );
    return c.jsx(qu, {
      ...n,
      ref: t,
      children: p.isValidElement(o) ? p.cloneElement(o, void 0, i) : null,
    });
  }
  return c.jsx(qu, { ...n, ref: t, children: r });
});
Mn.displayName = "Slot";
var qu = p.forwardRef((e, t) => {
  const { children: r, ...n } = e;
  if (p.isValidElement(r)) {
    const a = dS(r);
    return p.cloneElement(r, { ...uS(n, r.props), ref: t ? _l(t, a) : a });
  }
  return p.Children.count(r) > 1 ? p.Children.only(null) : null;
});
qu.displayName = "SlotClone";
var by = ({ children: e }) => c.jsx(c.Fragment, { children: e });
function cS(e) {
  return p.isValidElement(e) && e.type === by;
}
function uS(e, t) {
  const r = { ...t };
  for (const n in t) {
    const a = e[n],
      s = t[n];
    /^on[A-Z]/.test(n)
      ? a && s
        ? (r[n] = (...o) => {
            (s(...o), a(...o));
          })
        : a && (r[n] = a)
      : n === "style"
        ? (r[n] = { ...a, ...s })
        : n === "className" && (r[n] = [a, s].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function dS(e) {
  var t, r;
  let n =
      (t = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : t.get,
    a = n && "isReactWarning" in n && n.isReactWarning;
  return a
    ? e.ref
    : ((n =
        (r = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : r.get),
      (a = n && "isReactWarning" in n && n.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
function wh(e) {
  const t = e + "CollectionProvider",
    [r, n] = iS(t),
    [a, s] = r(t, { collectionRef: { current: null }, itemMap: new Map() }),
    o = (v) => {
      const { scope: g, children: m } = v,
        w = R.useRef(null),
        y = R.useRef(new Map()).current;
      return c.jsx(a, { scope: g, itemMap: y, collectionRef: w, children: m });
    };
  o.displayName = t;
  const i = e + "CollectionSlot",
    l = R.forwardRef((v, g) => {
      const { scope: m, children: w } = v,
        y = s(i, m),
        b = Se(g, y.collectionRef);
      return c.jsx(Mn, { ref: b, children: w });
    });
  l.displayName = i;
  const u = e + "CollectionItemSlot",
    d = "data-radix-collection-item",
    h = R.forwardRef((v, g) => {
      const { scope: m, children: w, ...y } = v,
        b = R.useRef(null),
        x = Se(g, b),
        k = s(u, m);
      return (
        R.useEffect(
          () => (
            k.itemMap.set(b, { ref: b, ...y }),
            () => void k.itemMap.delete(b)
          ),
        ),
        c.jsx(Mn, { [d]: "", ref: x, children: w })
      );
    });
  h.displayName = u;
  function f(v) {
    const g = s(e + "CollectionConsumer", v);
    return R.useCallback(() => {
      const m = g.collectionRef.current;
      if (!m) return [];
      const w = Array.from(m.querySelectorAll(`[${d}]`));
      return Array.from(g.itemMap.values()).sort(
        (y, b) => w.indexOf(y.ref.current) - w.indexOf(b.ref.current),
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return [{ Provider: o, Slot: l, ItemSlot: h }, f, n];
}
function hS(e, t) {
  const r = p.createContext(t),
    n = (s) => {
      const { children: o, ...i } = s,
        l = p.useMemo(() => i, Object.values(i));
      return c.jsx(r.Provider, { value: l, children: o });
    };
  n.displayName = e + "Provider";
  function a(s) {
    const o = p.useContext(r);
    if (o) return o;
    if (t !== void 0) return t;
    throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return [n, a];
}
function qa(e, t = []) {
  let r = [];
  function n(s, o) {
    const i = p.createContext(o),
      l = r.length;
    r = [...r, o];
    const u = (h) => {
      var f;
      const { scope: v, children: g, ...m } = h,
        w = ((f = v == null ? void 0 : v[e]) == null ? void 0 : f[l]) || i,
        y = p.useMemo(() => m, Object.values(m));
      return c.jsx(w.Provider, { value: y, children: g });
    };
    u.displayName = s + "Provider";
    function d(h, f) {
      var v;
      const g = ((v = f == null ? void 0 : f[e]) == null ? void 0 : v[l]) || i,
        m = p.useContext(g);
      if (m) return m;
      if (o !== void 0) return o;
      throw new Error(`\`${h}\` must be used within \`${s}\``);
    }
    return [u, d];
  }
  const a = () => {
    const s = r.map((o) => p.createContext(o));
    return function (o) {
      const i = (o == null ? void 0 : o[e]) || s;
      return p.useMemo(() => ({ [`__scope${e}`]: { ...o, [e]: i } }), [o, i]);
    };
  };
  return ((a.scopeName = e), [n, fS(a, ...t)]);
}
function fS(...e) {
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
var pS = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul",
  ],
  ae = pS.reduce((e, t) => {
    const r = p.forwardRef((n, a) => {
      const { asChild: s, ...o } = n,
        i = s ? Mn : t;
      return (
        typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
        c.jsx(i, { ...o, ref: a })
      );
    });
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r });
  }, {});
function xh(e, t) {
  e && yo.flushSync(() => e.dispatchEvent(t));
}
function Ke(e) {
  const t = p.useRef(e);
  return (
    p.useEffect(() => {
      t.current = e;
    }),
    p.useMemo(
      () =>
        (...r) => {
          var n;
          return (n = t.current) == null ? void 0 : n.call(t, ...r);
        },
      [],
    )
  );
}
function mS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ke(e);
  p.useEffect(() => {
    const n = (a) => {
      a.key === "Escape" && r(a);
    };
    return (
      t.addEventListener("keydown", n, { capture: !0 }),
      () => t.removeEventListener("keydown", n, { capture: !0 })
    );
  }, [r, t]);
}
var gS = "DismissableLayer",
  Hu = "dismissableLayer.update",
  vS = "dismissableLayer.pointerDownOutside",
  yS = "dismissableLayer.focusOutside",
  Ap,
  wy = p.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  bo = p.forwardRef((e, t) => {
    const {
        disableOutsidePointerEvents: r = !1,
        onEscapeKeyDown: n,
        onPointerDownOutside: a,
        onFocusOutside: s,
        onInteractOutside: o,
        onDismiss: i,
        ...l
      } = e,
      u = p.useContext(wy),
      [d, h] = p.useState(null),
      f =
        (d == null ? void 0 : d.ownerDocument) ??
        (globalThis == null ? void 0 : globalThis.document),
      [, v] = p.useState({}),
      g = Se(t, (_) => h(_)),
      m = Array.from(u.layers),
      [w] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1),
      y = m.indexOf(w),
      b = d ? m.indexOf(d) : -1,
      x = u.layersWithOutsidePointerEventsDisabled.size > 0,
      k = b >= y,
      S = wS((_) => {
        const C = _.target,
          D = [...u.branches].some((O) => O.contains(C));
        !k ||
          D ||
          (a == null || a(_),
          o == null || o(_),
          _.defaultPrevented || i == null || i());
      }, f),
      j = xS((_) => {
        const C = _.target;
        [...u.branches].some((D) => D.contains(C)) ||
          (s == null || s(_),
          o == null || o(_),
          _.defaultPrevented || i == null || i());
      }, f);
    return (
      mS((_) => {
        b === u.layers.size - 1 &&
          (n == null || n(_),
          !_.defaultPrevented && i && (_.preventDefault(), i()));
      }, f),
      p.useEffect(() => {
        if (d)
          return (
            r &&
              (u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Ap = f.body.style.pointerEvents),
                (f.body.style.pointerEvents = "none")),
              u.layersWithOutsidePointerEventsDisabled.add(d)),
            u.layers.add(d),
            Mp(),
            () => {
              r &&
                u.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (f.body.style.pointerEvents = Ap);
            }
          );
      }, [d, f, r, u]),
      p.useEffect(
        () => () => {
          d &&
            (u.layers.delete(d),
            u.layersWithOutsidePointerEventsDisabled.delete(d),
            Mp());
        },
        [d, u],
      ),
      p.useEffect(() => {
        const _ = () => v({});
        return (
          document.addEventListener(Hu, _),
          () => document.removeEventListener(Hu, _)
        );
      }, []),
      c.jsx(ae.div, {
        ...l,
        ref: g,
        style: {
          pointerEvents: x ? (k ? "auto" : "none") : void 0,
          ...e.style,
        },
        onFocusCapture: F(e.onFocusCapture, j.onFocusCapture),
        onBlurCapture: F(e.onBlurCapture, j.onBlurCapture),
        onPointerDownCapture: F(e.onPointerDownCapture, S.onPointerDownCapture),
      })
    );
  });
bo.displayName = gS;
var bS = "DismissableLayerBranch",
  xy = p.forwardRef((e, t) => {
    const r = p.useContext(wy),
      n = p.useRef(null),
      a = Se(t, n);
    return (
      p.useEffect(() => {
        const s = n.current;
        if (s)
          return (
            r.branches.add(s),
            () => {
              r.branches.delete(s);
            }
          );
      }, [r.branches]),
      c.jsx(ae.div, { ...e, ref: a })
    );
  });
xy.displayName = bS;
function wS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ke(e),
    n = p.useRef(!1),
    a = p.useRef(() => {});
  return (
    p.useEffect(() => {
      const s = (i) => {
          if (i.target && !n.current) {
            let l = function () {
              ky(vS, r, u, { discrete: !0 });
            };
            const u = { originalEvent: i };
            i.pointerType === "touch"
              ? (t.removeEventListener("click", a.current),
                (a.current = l),
                t.addEventListener("click", a.current, { once: !0 }))
              : l();
          } else t.removeEventListener("click", a.current);
          n.current = !1;
        },
        o = window.setTimeout(() => {
          t.addEventListener("pointerdown", s);
        }, 0);
      return () => {
        (window.clearTimeout(o),
          t.removeEventListener("pointerdown", s),
          t.removeEventListener("click", a.current));
      };
    }, [t, r]),
    { onPointerDownCapture: () => (n.current = !0) }
  );
}
function xS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ke(e),
    n = p.useRef(!1);
  return (
    p.useEffect(() => {
      const a = (s) => {
        s.target &&
          !n.current &&
          ky(yS, r, { originalEvent: s }, { discrete: !1 });
      };
      return (
        t.addEventListener("focusin", a),
        () => t.removeEventListener("focusin", a)
      );
    }, [t, r]),
    {
      onFocusCapture: () => (n.current = !0),
      onBlurCapture: () => (n.current = !1),
    }
  );
}
function Mp() {
  const e = new CustomEvent(Hu);
  document.dispatchEvent(e);
}
function ky(e, t, r, { discrete: n }) {
  const a = r.originalEvent.target,
    s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  (t && a.addEventListener(e, t, { once: !0 }),
    n ? xh(a, s) : a.dispatchEvent(s));
}
var kS = bo,
  SS = xy,
  Yr = globalThis != null && globalThis.document ? p.useLayoutEffect : () => {},
  _S = "Portal",
  jl = p.forwardRef((e, t) => {
    var r;
    const { container: n, ...a } = e,
      [s, o] = p.useState(!1);
    Yr(() => o(!0), []);
    const i =
      n ||
      (s &&
        ((r = globalThis == null ? void 0 : globalThis.document) == null
          ? void 0
          : r.body));
    return i ? vy.createPortal(c.jsx(ae.div, { ...a, ref: t }), i) : null;
  });
jl.displayName = _S;
function jS(e, t) {
  return p.useReducer((r, n) => t[r][n] ?? r, e);
}
var Ut = (e) => {
  const { present: t, children: r } = e,
    n = ES(t),
    a =
      typeof r == "function" ? r({ present: n.isPresent }) : p.Children.only(r),
    s = Se(n.ref, NS(a));
  return typeof r == "function" || n.isPresent
    ? p.cloneElement(a, { ref: s })
    : null;
};
Ut.displayName = "Presence";
function ES(e) {
  const [t, r] = p.useState(),
    n = p.useRef({}),
    a = p.useRef(e),
    s = p.useRef("none"),
    o = e ? "mounted" : "unmounted",
    [i, l] = jS(o, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    p.useEffect(() => {
      const u = Qo(n.current);
      s.current = i === "mounted" ? u : "none";
    }, [i]),
    Yr(() => {
      const u = n.current,
        d = a.current;
      if (d !== e) {
        const h = s.current,
          f = Qo(u);
        (e
          ? l("MOUNT")
          : f === "none" || (u == null ? void 0 : u.display) === "none"
            ? l("UNMOUNT")
            : l(d && h !== f ? "ANIMATION_OUT" : "UNMOUNT"),
          (a.current = e));
      }
    }, [e, l]),
    Yr(() => {
      if (t) {
        let u;
        const d = t.ownerDocument.defaultView ?? window,
          h = (v) => {
            const g = Qo(n.current).includes(v.animationName);
            if (v.target === t && g && (l("ANIMATION_END"), !a.current)) {
              const m = t.style.animationFillMode;
              ((t.style.animationFillMode = "forwards"),
                (u = d.setTimeout(() => {
                  t.style.animationFillMode === "forwards" &&
                    (t.style.animationFillMode = m);
                })));
            }
          },
          f = (v) => {
            v.target === t && (s.current = Qo(n.current));
          };
        return (
          t.addEventListener("animationstart", f),
          t.addEventListener("animationcancel", h),
          t.addEventListener("animationend", h),
          () => {
            (d.clearTimeout(u),
              t.removeEventListener("animationstart", f),
              t.removeEventListener("animationcancel", h),
              t.removeEventListener("animationend", h));
          }
        );
      } else l("ANIMATION_END");
    }, [t, l]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(i),
      ref: p.useCallback((u) => {
        (u && (n.current = getComputedStyle(u)), r(u));
      }, []),
    }
  );
}
function Qo(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function NS(e) {
  var t, r;
  let n =
      (t = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : t.get,
    a = n && "isReactWarning" in n && n.isReactWarning;
  return a
    ? e.ref
    : ((n =
        (r = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : r.get),
      (a = n && "isReactWarning" in n && n.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
function wo({ prop: e, defaultProp: t, onChange: r = () => {} }) {
  const [n, a] = CS({ defaultProp: t, onChange: r }),
    s = e !== void 0,
    o = s ? e : n,
    i = Ke(r),
    l = p.useCallback(
      (u) => {
        if (s) {
          const d = typeof u == "function" ? u(e) : u;
          d !== e && i(d);
        } else a(u);
      },
      [s, e, a, i],
    );
  return [o, l];
}
function CS({ defaultProp: e, onChange: t }) {
  const r = p.useState(e),
    [n] = r,
    a = p.useRef(n),
    s = Ke(t);
  return (
    p.useEffect(() => {
      a.current !== n && (s(n), (a.current = n));
    }, [n, a, s]),
    r
  );
}
var TS = "VisuallyHidden",
  El = p.forwardRef((e, t) =>
    c.jsx(ae.span, {
      ...e,
      ref: t,
      style: {
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...e.style,
      },
    }),
  );
El.displayName = TS;
var PS = El,
  kh = "ToastProvider",
  [Sh, RS, OS] = wh("Toast"),
  [Sy, ZO] = qa("Toast", [OS]),
  [AS, Nl] = Sy(kh),
  _y = (e) => {
    const {
        __scopeToast: t,
        label: r = "Notification",
        duration: n = 5e3,
        swipeDirection: a = "right",
        swipeThreshold: s = 50,
        children: o,
      } = e,
      [i, l] = p.useState(null),
      [u, d] = p.useState(0),
      h = p.useRef(!1),
      f = p.useRef(!1);
    return (
      r.trim() ||
        console.error(
          `Invalid prop \`label\` supplied to \`${kh}\`. Expected non-empty \`string\`.`,
        ),
      c.jsx(Sh.Provider, {
        scope: t,
        children: c.jsx(AS, {
          scope: t,
          label: r,
          duration: n,
          swipeDirection: a,
          swipeThreshold: s,
          toastCount: u,
          viewport: i,
          onViewportChange: l,
          onToastAdd: p.useCallback(() => d((v) => v + 1), []),
          onToastRemove: p.useCallback(() => d((v) => v - 1), []),
          isFocusedToastEscapeKeyDownRef: h,
          isClosePausedRef: f,
          children: o,
        }),
      })
    );
  };
_y.displayName = kh;
var jy = "ToastViewport",
  MS = ["F8"],
  Vu = "toast.viewportPause",
  Ku = "toast.viewportResume",
  Ey = p.forwardRef((e, t) => {
    const {
        __scopeToast: r,
        hotkey: n = MS,
        label: a = "Notifications ({hotkey})",
        ...s
      } = e,
      o = Nl(jy, r),
      i = RS(r),
      l = p.useRef(null),
      u = p.useRef(null),
      d = p.useRef(null),
      h = p.useRef(null),
      f = Se(t, h, o.onViewportChange),
      v = n.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      g = o.toastCount > 0;
    (p.useEffect(() => {
      const w = (y) => {
        var b;
        n.length !== 0 &&
          n.every((x) => y[x] || y.code === x) &&
          ((b = h.current) == null || b.focus());
      };
      return (
        document.addEventListener("keydown", w),
        () => document.removeEventListener("keydown", w)
      );
    }, [n]),
      p.useEffect(() => {
        const w = l.current,
          y = h.current;
        if (g && w && y) {
          const b = () => {
              if (!o.isClosePausedRef.current) {
                const j = new CustomEvent(Vu);
                (y.dispatchEvent(j), (o.isClosePausedRef.current = !0));
              }
            },
            x = () => {
              if (o.isClosePausedRef.current) {
                const j = new CustomEvent(Ku);
                (y.dispatchEvent(j), (o.isClosePausedRef.current = !1));
              }
            },
            k = (j) => {
              !w.contains(j.relatedTarget) && x();
            },
            S = () => {
              w.contains(document.activeElement) || x();
            };
          return (
            w.addEventListener("focusin", b),
            w.addEventListener("focusout", k),
            w.addEventListener("pointermove", b),
            w.addEventListener("pointerleave", S),
            window.addEventListener("blur", b),
            window.addEventListener("focus", x),
            () => {
              (w.removeEventListener("focusin", b),
                w.removeEventListener("focusout", k),
                w.removeEventListener("pointermove", b),
                w.removeEventListener("pointerleave", S),
                window.removeEventListener("blur", b),
                window.removeEventListener("focus", x));
            }
          );
        }
      }, [g, o.isClosePausedRef]));
    const m = p.useCallback(
      ({ tabbingDirection: w }) => {
        const y = i().map((b) => {
          const x = b.ref.current,
            k = [x, ...KS(x)];
          return w === "forwards" ? k : k.reverse();
        });
        return (w === "forwards" ? y.reverse() : y).flat();
      },
      [i],
    );
    return (
      p.useEffect(() => {
        const w = h.current;
        if (w) {
          const y = (b) => {
            var x, k, S;
            const j = b.altKey || b.ctrlKey || b.metaKey;
            if (b.key === "Tab" && !j) {
              const _ = document.activeElement,
                C = b.shiftKey;
              if (b.target === w && C) {
                (x = u.current) == null || x.focus();
                return;
              }
              const D = m({ tabbingDirection: C ? "backwards" : "forwards" }),
                O = D.findIndex((U) => U === _);
              Tc(D.slice(O + 1))
                ? b.preventDefault()
                : C
                  ? (k = u.current) == null || k.focus()
                  : (S = d.current) == null || S.focus();
            }
          };
          return (
            w.addEventListener("keydown", y),
            () => w.removeEventListener("keydown", y)
          );
        }
      }, [i, m]),
      c.jsxs(SS, {
        ref: l,
        role: "region",
        "aria-label": a.replace("{hotkey}", v),
        tabIndex: -1,
        style: { pointerEvents: g ? void 0 : "none" },
        children: [
          g &&
            c.jsx(Gu, {
              ref: u,
              onFocusFromOutsideViewport: () => {
                const w = m({ tabbingDirection: "forwards" });
                Tc(w);
              },
            }),
          c.jsx(Sh.Slot, {
            scope: r,
            children: c.jsx(ae.ol, { tabIndex: -1, ...s, ref: f }),
          }),
          g &&
            c.jsx(Gu, {
              ref: d,
              onFocusFromOutsideViewport: () => {
                const w = m({ tabbingDirection: "backwards" });
                Tc(w);
              },
            }),
        ],
      })
    );
  });
Ey.displayName = jy;
var Ny = "ToastFocusProxy",
  Gu = p.forwardRef((e, t) => {
    const { __scopeToast: r, onFocusFromOutsideViewport: n, ...a } = e,
      s = Nl(Ny, r);
    return c.jsx(El, {
      "aria-hidden": !0,
      tabIndex: 0,
      ...a,
      ref: t,
      style: { position: "fixed" },
      onFocus: (o) => {
        var i;
        const l = o.relatedTarget;
        !((i = s.viewport) != null && i.contains(l)) && n();
      },
    });
  });
Gu.displayName = Ny;
var Cl = "Toast",
  IS = "toast.swipeStart",
  DS = "toast.swipeMove",
  LS = "toast.swipeCancel",
  $S = "toast.swipeEnd",
  Cy = p.forwardRef((e, t) => {
    const { forceMount: r, open: n, defaultOpen: a, onOpenChange: s, ...o } = e,
      [i = !0, l] = wo({ prop: n, defaultProp: a, onChange: s });
    return c.jsx(Ut, {
      present: r || i,
      children: c.jsx(US, {
        open: i,
        ...o,
        ref: t,
        onClose: () => l(!1),
        onPause: Ke(e.onPause),
        onResume: Ke(e.onResume),
        onSwipeStart: F(e.onSwipeStart, (u) => {
          u.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: F(e.onSwipeMove, (u) => {
          const { x: d, y: h } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "move"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-y",
              `${h}px`,
            ));
        }),
        onSwipeCancel: F(e.onSwipeCancel, (u) => {
          (u.currentTarget.setAttribute("data-swipe", "cancel"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-y"));
        }),
        onSwipeEnd: F(e.onSwipeEnd, (u) => {
          const { x: d, y: h } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "end"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-y",
              `${h}px`,
            ),
            l(!1));
        }),
      }),
    });
  });
Cy.displayName = Cl;
var [FS, zS] = Sy(Cl, { onClose() {} }),
  US = p.forwardRef((e, t) => {
    const {
        __scopeToast: r,
        type: n = "foreground",
        duration: a,
        open: s,
        onClose: o,
        onEscapeKeyDown: i,
        onPause: l,
        onResume: u,
        onSwipeStart: d,
        onSwipeMove: h,
        onSwipeCancel: f,
        onSwipeEnd: v,
        ...g
      } = e,
      m = Nl(Cl, r),
      [w, y] = p.useState(null),
      b = Se(t, (A) => y(A)),
      x = p.useRef(null),
      k = p.useRef(null),
      S = a || m.duration,
      j = p.useRef(0),
      _ = p.useRef(S),
      C = p.useRef(0),
      { onToastAdd: D, onToastRemove: O } = m,
      U = Ke(() => {
        var A;
        (w != null &&
          w.contains(document.activeElement) &&
          ((A = m.viewport) == null || A.focus()),
          o());
      }),
      $ = p.useCallback(
        (A) => {
          !A ||
            A === 1 / 0 ||
            (window.clearTimeout(C.current),
            (j.current = new Date().getTime()),
            (C.current = window.setTimeout(U, A)));
        },
        [U],
      );
    (p.useEffect(() => {
      const A = m.viewport;
      if (A) {
        const q = () => {
            ($(_.current), u == null || u());
          },
          B = () => {
            const J = new Date().getTime() - j.current;
            ((_.current = _.current - J),
              window.clearTimeout(C.current),
              l == null || l());
          };
        return (
          A.addEventListener(Vu, B),
          A.addEventListener(Ku, q),
          () => {
            (A.removeEventListener(Vu, B), A.removeEventListener(Ku, q));
          }
        );
      }
    }, [m.viewport, S, l, u, $]),
      p.useEffect(() => {
        s && !m.isClosePausedRef.current && $(S);
      }, [s, S, m.isClosePausedRef, $]),
      p.useEffect(() => (D(), () => O()), [D, O]));
    const G = p.useMemo(() => (w ? Iy(w) : null), [w]);
    return m.viewport
      ? c.jsxs(c.Fragment, {
          children: [
            G &&
              c.jsx(BS, {
                __scopeToast: r,
                role: "status",
                "aria-live": n === "foreground" ? "assertive" : "polite",
                "aria-atomic": !0,
                children: G,
              }),
            c.jsx(FS, {
              scope: r,
              onClose: U,
              children: yo.createPortal(
                c.jsx(Sh.ItemSlot, {
                  scope: r,
                  children: c.jsx(kS, {
                    asChild: !0,
                    onEscapeKeyDown: F(i, () => {
                      (m.isFocusedToastEscapeKeyDownRef.current || U(),
                        (m.isFocusedToastEscapeKeyDownRef.current = !1));
                    }),
                    children: c.jsx(ae.li, {
                      role: "status",
                      "aria-live": "off",
                      "aria-atomic": !0,
                      tabIndex: 0,
                      "data-state": s ? "open" : "closed",
                      "data-swipe-direction": m.swipeDirection,
                      ...g,
                      ref: b,
                      style: {
                        userSelect: "none",
                        touchAction: "none",
                        ...e.style,
                      },
                      onKeyDown: F(e.onKeyDown, (A) => {
                        A.key === "Escape" &&
                          (i == null || i(A.nativeEvent),
                          A.nativeEvent.defaultPrevented ||
                            ((m.isFocusedToastEscapeKeyDownRef.current = !0),
                            U()));
                      }),
                      onPointerDown: F(e.onPointerDown, (A) => {
                        A.button === 0 &&
                          (x.current = { x: A.clientX, y: A.clientY });
                      }),
                      onPointerMove: F(e.onPointerMove, (A) => {
                        if (!x.current) return;
                        const q = A.clientX - x.current.x,
                          B = A.clientY - x.current.y,
                          J = !!k.current,
                          E = ["left", "right"].includes(m.swipeDirection),
                          N = ["left", "up"].includes(m.swipeDirection)
                            ? Math.min
                            : Math.max,
                          M = E ? N(0, q) : 0,
                          I = E ? 0 : N(0, B),
                          z = A.pointerType === "touch" ? 10 : 2,
                          W = { x: M, y: I },
                          re = { originalEvent: A, delta: W };
                        J
                          ? ((k.current = W), Jo(DS, h, re, { discrete: !1 }))
                          : Ip(W, m.swipeDirection, z)
                            ? ((k.current = W),
                              Jo(IS, d, re, { discrete: !1 }),
                              A.target.setPointerCapture(A.pointerId))
                            : (Math.abs(q) > z || Math.abs(B) > z) &&
                              (x.current = null);
                      }),
                      onPointerUp: F(e.onPointerUp, (A) => {
                        const q = k.current,
                          B = A.target;
                        if (
                          (B.hasPointerCapture(A.pointerId) &&
                            B.releasePointerCapture(A.pointerId),
                          (k.current = null),
                          (x.current = null),
                          q)
                        ) {
                          const J = A.currentTarget,
                            E = { originalEvent: A, delta: q };
                          (Ip(q, m.swipeDirection, m.swipeThreshold)
                            ? Jo($S, v, E, { discrete: !0 })
                            : Jo(LS, f, E, { discrete: !0 }),
                            J.addEventListener(
                              "click",
                              (N) => N.preventDefault(),
                              { once: !0 },
                            ));
                        }
                      }),
                    }),
                  }),
                }),
                m.viewport,
              ),
            }),
          ],
        })
      : null;
  }),
  BS = (e) => {
    const { __scopeToast: t, children: r, ...n } = e,
      a = Nl(Cl, t),
      [s, o] = p.useState(!1),
      [i, l] = p.useState(!1);
    return (
      HS(() => o(!0)),
      p.useEffect(() => {
        const u = window.setTimeout(() => l(!0), 1e3);
        return () => window.clearTimeout(u);
      }, []),
      i
        ? null
        : c.jsx(jl, {
            asChild: !0,
            children: c.jsx(El, {
              ...n,
              children:
                s && c.jsxs(c.Fragment, { children: [a.label, " ", r] }),
            }),
          })
    );
  },
  WS = "ToastTitle",
  Ty = p.forwardRef((e, t) => {
    const { __scopeToast: r, ...n } = e;
    return c.jsx(ae.div, { ...n, ref: t });
  });
Ty.displayName = WS;
var qS = "ToastDescription",
  Py = p.forwardRef((e, t) => {
    const { __scopeToast: r, ...n } = e;
    return c.jsx(ae.div, { ...n, ref: t });
  });
Py.displayName = qS;
var Ry = "ToastAction",
  Oy = p.forwardRef((e, t) => {
    const { altText: r, ...n } = e;
    return r.trim()
      ? c.jsx(My, {
          altText: r,
          asChild: !0,
          children: c.jsx(_h, { ...n, ref: t }),
        })
      : (console.error(
          `Invalid prop \`altText\` supplied to \`${Ry}\`. Expected non-empty \`string\`.`,
        ),
        null);
  });
Oy.displayName = Ry;
var Ay = "ToastClose",
  _h = p.forwardRef((e, t) => {
    const { __scopeToast: r, ...n } = e,
      a = zS(Ay, r);
    return c.jsx(My, {
      asChild: !0,
      children: c.jsx(ae.button, {
        type: "button",
        ...n,
        ref: t,
        onClick: F(e.onClick, a.onClose),
      }),
    });
  });
_h.displayName = Ay;
var My = p.forwardRef((e, t) => {
  const { __scopeToast: r, altText: n, ...a } = e;
  return c.jsx(ae.div, {
    "data-radix-toast-announce-exclude": "",
    "data-radix-toast-announce-alt": n || void 0,
    ...a,
    ref: t,
  });
});
function Iy(e) {
  const t = [];
  return (
    Array.from(e.childNodes).forEach((r) => {
      if (
        (r.nodeType === r.TEXT_NODE && r.textContent && t.push(r.textContent),
        VS(r))
      ) {
        const n = r.ariaHidden || r.hidden || r.style.display === "none",
          a = r.dataset.radixToastAnnounceExclude === "";
        if (!n)
          if (a) {
            const s = r.dataset.radixToastAnnounceAlt;
            s && t.push(s);
          } else t.push(...Iy(r));
      }
    }),
    t
  );
}
function Jo(e, t, r, { discrete: n }) {
  const a = r.originalEvent.currentTarget,
    s = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: r });
  (t && a.addEventListener(e, t, { once: !0 }),
    n ? xh(a, s) : a.dispatchEvent(s));
}
var Ip = (e, t, r = 0) => {
  const n = Math.abs(e.x),
    a = Math.abs(e.y),
    s = n > a;
  return t === "left" || t === "right" ? s && n > r : !s && a > r;
};
function HS(e = () => {}) {
  const t = Ke(e);
  Yr(() => {
    let r = 0,
      n = 0;
    return (
      (r = window.requestAnimationFrame(
        () => (n = window.requestAnimationFrame(t)),
      )),
      () => {
        (window.cancelAnimationFrame(r), window.cancelAnimationFrame(n));
      }
    );
  }, [t]);
}
function VS(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function KS(e) {
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
function Tc(e) {
  const t = document.activeElement;
  return e.some((r) =>
    r === t ? !0 : (r.focus(), document.activeElement !== t),
  );
}
var GS = _y,
  Dy = Ey,
  Ly = Cy,
  $y = Ty,
  Fy = Py,
  zy = Oy,
  Uy = _h;
function By(e) {
  var t,
    r,
    n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var a = e.length;
      for (t = 0; t < a; t++)
        e[t] && (r = By(e[t])) && (n && (n += " "), (n += r));
    } else for (r in e) e[r] && (n && (n += " "), (n += r));
  return n;
}
function Wy() {
  for (var e, t, r = 0, n = "", a = arguments.length; r < a; r++)
    (e = arguments[r]) && (t = By(e)) && (n && (n += " "), (n += t));
  return n;
}
const Dp = (e) => (typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e),
  Lp = Wy,
  xo = (e, t) => (r) => {
    var n;
    if ((t == null ? void 0 : t.variants) == null)
      return Lp(
        e,
        r == null ? void 0 : r.class,
        r == null ? void 0 : r.className,
      );
    const { variants: a, defaultVariants: s } = t,
      o = Object.keys(a).map((u) => {
        const d = r == null ? void 0 : r[u],
          h = s == null ? void 0 : s[u];
        if (d === null) return null;
        const f = Dp(d) || Dp(h);
        return a[u][f];
      }),
      i =
        r &&
        Object.entries(r).reduce((u, d) => {
          let [h, f] = d;
          return (f === void 0 || (u[h] = f), u);
        }, {}),
      l =
        t == null || (n = t.compoundVariants) === null || n === void 0
          ? void 0
          : n.reduce((u, d) => {
              let { class: h, className: f, ...v } = d;
              return Object.entries(v).every((g) => {
                let [m, w] = g;
                return Array.isArray(w)
                  ? w.includes({ ...s, ...i }[m])
                  : { ...s, ...i }[m] === w;
              })
                ? [...u, h, f]
                : u;
            }, []);
    return Lp(
      e,
      o,
      l,
      r == null ? void 0 : r.class,
      r == null ? void 0 : r.className,
    );
  };
