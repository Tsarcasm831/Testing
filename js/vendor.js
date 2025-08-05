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
