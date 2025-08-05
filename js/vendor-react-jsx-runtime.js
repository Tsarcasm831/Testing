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
var c = ng.exports;
