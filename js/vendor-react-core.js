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
