var mg = { exports: {} },
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
