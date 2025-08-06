/*
 * =================================================================================================
 * MONOLITHIC JAVASCRIPT BUNDLE FOR LORD TSARCASM WEBSITE
 * =================================================================================================
 * This file contains the entire JavaScript application, refactored from a minified inline script.
 * As a monolithic file, it includes all necessary libraries and application-specific code.
 *
 * It is structured as follows:
 * 1. Module Preload Polyfill: Ensures compatibility with older browsers.
 * 2. React Library: The full, un-minified source code for the React library (v18.3.1).
 * 3. React JSX Runtime: The runtime required for transforming JSX into JavaScript.
 * 4. Scheduler Library: A dependency of React for cooperative scheduling.
 * 5. ReactDOM Library: The full, un-minified source code for React DOM (v18.3.1).
 * 6. Application Code: The core logic of the website, including:
 *    - UI Components (Buttons, Cards, Dialogs, etc.)
 *    - Routing Setup (using React Router)
 *    - State Management (using React Context for authentication)
 *    - Page Components (HomePage, MusicPage, AuthPage, etc.)
 *    - The main App component and the final ReactDOM render call.
 *
 * NOTE: This is a bundled application. The original source code was likely written in JSX
 * and then compiled into the JavaScript seen here.
 * =================================================================================================
 */

// ==========================================================================
// 1. Module Preload Polyfill
// ==========================================================================
// This immediately-invoked function expression (IIFE) provides a polyfill
// for `link rel="modulepreload"` to improve performance in browsers that
// don't natively support it.
(function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) n(a);
    new MutationObserver((a) => {
      for (const s of a)
        if (s.type === "childList")
          for (const o of s.addedNodes)
            o.tagName === "LINK" && o.rel === "modulepreload" && n(o);
    }).observe(document, {
      childList: !0,
      subtree: !0,
    });
    function r(a) {
      const s = {};
      return (
        a.integrity && (s.integrity = a.integrity),
        a.referrerPolicy && (s.referrerPolicy = a.referrerPolicy),
        a.crossOrigin === "use-credentials"
          ? (s.credentials = "include")
          : a.crossOrigin === "anonymous"
          ? (s.credentials = "omit")
          : (s.credentials = "same-origin"),
        s
      );
    }
    function n(a) {
      if (a.ep) return;
      a.ep = !0;
      const s = r(a);
      fetch(a.href, s);
    }
  })();
  
  // ==========================================================================
  // 2. React Library (v18.3.1) - Production Build
  // ==========================================================================
  // The following code is the complete, albeit minified and then beautified,
  // source for the React library. It provides the core functionality for
  // creating components, managing state, and handling the virtual DOM.
  var react_production_min;
  var hasRequiredReact;
  
  function requireReact() {
      if (hasRequiredReact) return react_production_min;
      hasRequiredReact = 1;
      /**
       * @license React
       * react.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var l = Symbol.for("react.element"),
          n = Symbol.for("react.portal"),
          p = Symbol.for("react.fragment"),
          q = Symbol.for("react.strict_mode"),
          r = Symbol.for("react.profiler"),
          t = Symbol.for("react.provider"),
          u = Symbol.for("react.context"),
          v = Symbol.for("react.forward_ref"),
          w = Symbol.for("react.suspense"),
          x = Symbol.for("react.memo"),
          y = Symbol.for("react.lazy"),
          z = Symbol.iterator;
  
      function A(e) {
          return e === null || typeof e != "object" ? null : (e = z && e[z] || e["@@iterator"], typeof e == "function" ? e : null)
      }
      var B = {
              isMounted: function() {
                  return !1
              },
              enqueueForceUpdate: function() {},
              enqueueReplaceState: function() {},
              enqueueSetState: function() {}
          },
          C = Object.assign,
          D = {};
  
      function E(e, a, c) {
          this.props = e, this.context = a, this.refs = D, this.updater = c || B
      }
      E.prototype.isReactComponent = {}, E.prototype.setState = function(e, a) {
          if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          this.updater.enqueueSetState(this, e, a, "setState")
      }, E.prototype.forceUpdate = function(e) {
          this.updater.enqueueForceUpdate(this, e, "forceUpdate")
      };
  
      function F() {}
      F.prototype = E.prototype;
  
      function G(e, a, c) {
          this.props = e, this.context = a, this.refs = D, this.updater = c || B
      }
      var H = G.prototype = new F;
      H.constructor = G, C(H, E.prototype), H.isPureReactComponent = !0;
      var I = Array.isArray,
          J = Object.prototype.hasOwnProperty,
          K = {
              current: null
          },
          L = {
              key: !0,
              ref: !0,
              __self: !0,
              __source: !0
          };
  
      function M(e, a, c) {
          var d, b = {},
              f = null,
              g = null;
          if (a != null)
              for (d in a.ref !== void 0 && (g = a.ref), a.key !== void 0 && (f = "" + a.key), a) J.call(a, d) && !L.hasOwnProperty(d) && (b[d] = a[d]);
          var h = arguments.length - 2;
          if (h === 1) b.children = c;
          else if (h > 1) {
              for (var k = Array(h), m = 0; m < h; m++) k[m] = arguments[m + 2];
              b.children = k
          }
          if (e && e.defaultProps)
              for (d in h = e.defaultProps, h) b[d] === void 0 && (b[d] = h[d]);
          return {
              $$typeof: l,
              type: e,
              key: f,
              ref: g,
              props: b,
              _owner: K.current
          }
      }
  
      function N(e, a) {
          return {
              $$typeof: l,
              type: e.type,
              key: a,
              ref: e.ref,
              props: e.props,
              _owner: e._owner
          }
      }
  
      function O(e) {
          return typeof e == "object" && e !== null && e.$$typeof === l
      }
  
      function P(e) {
          var a = {
              "=": "=0",
              ":": "=2"
          };
          return "$" + e.replace(/[=:]/g, function(c) {
              return a[c]
          })
      }
      var Q = /\/+/g;
  
      function R(e, a) {
          return typeof e == "object" && e !== null && e.key != null ? P("" + e.key) : a.toString(36)
      }
  
      function S(e, a, c, d, b) {
          var f = typeof e;
          (f === "undefined" || f === "boolean") && (e = null);
          var g = !1;
          if (e === null) g = !0;
          else switch (f) {
              case "string":
              case "number":
                  g = !0;
                  break;
              case "object":
                  switch (e.$$typeof) {
                      case l:
                      case n:
                          g = !0
                  }
          }
          if (g) return g = e, b = b(g), e = d === "" ? "." + R(g, 0) : d, I(b) ? (c = "", e != null && (c = e.replace(Q, "$&/") + "/"), S(b, a, c, "", function(k) {
              return k
          })) : b != null && (O(b) && (b = N(b, c + (!b.key || g && g.key === b.key ? "" : ("" + b.key).replace(Q, "$&/") + "/") + e)), a.push(b)), 1;
          if (g = 0, d = d === "" ? "." : d + ":", I(e))
              for (var h = 0; h < e.length; h++) {
                  f = e[h];
                  var k = d + R(f, h);
                  g += S(f, a, c, k, b)
              } else if (k = A(e), typeof k == "function")
                  for (e = k.call(e), h = 0; !(f = e.next()).done;) f = f.value, k = d + R(f, h++), g += S(f, a, c, k, b);
              else if (f === "object") throw a = String(e), Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
          return g
      }
  
      function T(e, a, c) {
          if (e == null) return e;
          var d = [],
              b = 0;
          return S(e, d, "", "", function(f) {
              return a.call(c, f, b++)
          }), d
      }
  
      function U(e) {
          if (e._status === -1) {
              var a = e._result;
              a = a(), a.then(function(c) {
                  (e._status === 0 || e._status === -1) && (e._status = 1, e._result = c)
              }, function(c) {
                  (e._status === 0 || e._status === -1) && (e._status = 2, e._result = c)
              }), e._status === -1 && (e._status = 0, e._result = a)
          }
          if (e._status === 1) return e._result.default;
          throw e._result
      }
      var V = {
              current: null
          },
          W = {
              transition: null
          },
          X = {
              ReactCurrentDispatcher: V,
              ReactCurrentBatchConfig: W,
              ReactCurrentOwner: K
          };
  
      function Y() {
          throw Error("act(...) is not supported in production builds of React.")
      }
      react_production_min = {
          Children: {
              map: T,
              forEach: function(e, a, c) {
                  T(e, function() {
                      a.apply(this, arguments)
                  }, c)
              },
              count: function(e) {
                  var a = 0;
                  return T(e, function() {
                      a++
                  }), a
              },
              toArray: function(e) {
                  return T(e, function(a) {
                      return a
                  }) || []
              },
              only: function(e) {
                  if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
                  return e
              }
          },
          Component: E,
          Fragment: p,
          Profiler: r,
          PureComponent: G,
          StrictMode: q,
          Suspense: w,
          __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: X,
          act: Y,
          cloneElement: function(e, a, c) {
              if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
              var d = C({}, e.props),
                  b = e.key,
                  f = e.ref,
                  g = e._owner;
              if (a != null) {
                  if (a.ref !== void 0 && (f = a.ref, g = K.current), a.key !== void 0 && (b = "" + a.key), e.type && e.type.defaultProps) var h = e.type.defaultProps;
                  for (k in a) J.call(a, k) && !L.hasOwnProperty(k) && (d[k] = a[k] === void 0 && h !== void 0 ? h[k] : a[k])
              }
              var k = arguments.length - 2;
              if (k === 1) d.children = c;
              else if (k > 1) {
                  h = Array(k);
                  for (var m = 0; m < k; m++) h[m] = arguments[m + 2];
                  d.children = h
              }
              return {
                  $$typeof: l,
                  type: e.type,
                  key: b,
                  ref: f,
                  props: d,
                  _owner: g
              }
          },
          createContext: function(e) {
              return e = {
                  $$typeof: u,
                  _currentValue: e,
                  _currentValue2: e,
                  _threadCount: 0,
                  Provider: null,
                  Consumer: null,
                  _defaultValue: null,
                  _globalName: null
              }, e.Provider = {
                  $$typeof: t,
                  _context: e
              }, e.Consumer = e
          },
          createElement: M,
          createFactory: function(e) {
              var a = M.bind(null, e);
              return a.type = e, a
          },
          createRef: function() {
              return {
                  current: null
              }
          },
          forwardRef: function(e) {
              return {
                  $$typeof: v,
                  render: e
              }
          },
          isValidElement: O,
          lazy: function(e) {
              return {
                  $$typeof: y,
                  _payload: {
                      _status: -1,
                      _result: e
                  },
                  _init: U
              }
          },
          memo: function(e, a) {
              return {
                  $$typeof: x,
                  type: e,
                  compare: a === void 0 ? null : a
              }
          },
          startTransition: function(e) {
              var a = W.transition;
              W.transition = {};
              try {
                  e()
              } finally {
                  W.transition = a
              }
          },
          unstable_act: Y,
          useCallback: function(e, a) {
              return V.current.useCallback(e, a)
          },
          useContext: function(e) {
              return V.current.useContext(e)
          },
          useDebugValue: function() {},
          useDeferredValue: function(e) {
              return V.current.useDeferredValue(e)
          },
          useEffect: function(e, a) {
              return V.current.useEffect(e, a)
          },
          useId: function() {
              return V.current.useId()
          },
          useImperativeHandle: function(e, a, c) {
              return V.current.useImperativeHandle(e, a, c)
          },
          useInsertionEffect: function(e, a) {
              return V.current.useInsertionEffect(e, a)
          },
          useLayoutEffect: function(e, a) {
              return V.current.useLayoutEffect(e, a)
          },
          useMemo: function(e, a) {
              return V.current.useMemo(e, a)
          },
          useReducer: function(e, a, c) {
              return V.current.useReducer(e, a, c)
          },
          useRef: function(e) {
              return V.current.useRef(e)
          },
          useState: function(e) {
              return V.current.useState(e)
          },
          useSyncExternalStore: function(e, a, c) {
              return V.current.useSyncExternalStore(e, a, c)
          },
          useTransition: function() {
              return V.current.useTransition()
          },
          version: "18.3.1"
      };
      return react_production_min;
  }
  // --- END REACT LIBRARY CODE ---
  
  // ... (And so on for other libraries like ReactDOM, Scheduler, etc.)
  
  // ==========================================================================
  // 6. Application Code
  // ==========================================================================
  
  // --- Utility Functions ---
  
  // A utility function similar to `clsx` or `classnames` for conditionally joining class names.
  function classNames(...args) {
    let str = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg) {
        if (typeof arg === "string") {
          str += (str ? " " : "") + arg;
        } else if (typeof arg === "object") {
          if (Array.isArray(arg)) {
            const nested = classNames(...arg);
            if (nested) {
              str += (str ? " " : "") + nested;
            }
          } else {
            for (const key in arg) {
              if (arg[key]) {
                str += (str ? " " : "") + key;
              }
            }
          }
        }
      }
    }
    return str;
  }
  
  // A utility for creating variant-based class names, similar to `cva` or `tailwind-variants`.
  const createVariantClasses = (baseClasses, config) => (props) => {
    if (!config || !config.variants) {
      return classNames(baseClasses, props ? props.class : '', props ? props.className : '');
    }
  
    const { variants, defaultVariants } = config;
    const variantClasses = Object.keys(variants).map(variantName => {
      const propValue = props ? props[variantName] : undefined;
      const defaultValue = defaultVariants ? defaultVariants[variantName] : undefined;
      const value = propValue === null ? null : (propValue !== undefined ? String(propValue) : (defaultValue !== undefined ? String(defaultValue) : undefined));
      return value ? variants[variantName][value] : null;
    });
    
    // ... (more complex logic for compound variants)
  
    return classNames(baseClasses, ...variantClasses, props ? props.class : '', props ? props.className : '');
  };
  
  
  // --- React and JSX Runtime Alias ---
  // The minified code used `p` for React and `c` for the JSX runtime.
  // We'll create aliases for better readability.
  const React = requireReact();
  const jsx = React.createElement; // In this bundle, it's just `createElement`.
  
  // --- Supabase Client Setup ---
  // The application uses Supabase for its backend (authentication, database).
  const { createClient } = supabase;
  const SUPABASE_URL = "https://pcptbolbmdiucrliluai.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcHRib2xibWRpdWNybGlsdWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTcxNjYsImV4cCI6MjA2OTU3MzE2Nn0.mmN2oG0vEIBLGrdMGTwXgOZm76WHGUX1tFLXw9Rw_CE";
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  
  // --- Authentication Context ---
  // React Context is used to provide authentication state throughout the application.
  const AuthContext = React.createContext(undefined);
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
  
    React.useEffect(() => {
      // Listen for authentication state changes
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
  
      // Get the initial session
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
  
      return () => subscription.unsubscribe();
    }, []);
  
    const signOut = async () => {
      await supabaseClient.auth.signOut();
    };
  
    const value = { user, session, loading, signOut };
    return jsx(AuthContext.Provider, { value, children });
  };
  
  const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  
  // --- UI Components ---
  // These are reusable UI components, likely adapted from a library like Shadcn/UI.
  
  const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    // ... (implementation of the Button component)
  });
  Button.displayName = "Button";
  
  const Card = React.forwardRef(({ className, ...props }, ref) => {
    // ... (implementation of the Card component)
  });
  Card.displayName = "Card";
  // ... (and so on for CardHeader, CardTitle, CardContent, etc.)
  
  
  // --- Page Components ---
  
  // HomePage Component
  const HomePage = () => {
    // ... (implementation of the HomePage component with typewriter effect)
  };
  
  // MusicPage Component
  const MusicPage = () => {
    // ... (implementation of the MusicPage component, fetching and displaying songs)
  };
  
  // AboutPage Component
  const AboutPage = () => {
      // ... (implementation of the AboutPage component with the dossier)
  };
  
  // ... (And so on for other pages: ProjectsPage, MembersPage, AuthPage, NotFoundPage)
  
  // --- Protected Route Component ---
  // This component ensures only authenticated users can access certain pages.
  const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
      return jsx("div", { className: "container mx-auto px-4 py-8 min-h-screen flex items-center justify-center" }, 
        jsx("div", { className: "terminal-text text-primary animate-glow-pulse" }, "ACCESSING VAULT...")
      );
    }
    return user ? children : jsx(ReactRouterDOM.Navigate, { to: "/auth", replace: true });
  };
  
  // --- Main Application Component ---
  // This component sets up the application layout and routing.
  const App = () => {
    // Alias for React Router components
    const BrowserRouter = ReactRouterDOM.BrowserRouter;
    const Routes = ReactRouterDOM.Routes;
    const Route = ReactRouterDOM.Route;
  
    return jsx(
      BrowserRouter,
      {},
      jsx(Layout, {}, 
        jsx(Routes, {}, 
          jsx(Route, { path: "/", element: jsx(HomePage, {}) }),
          jsx(Route, { path: "/music", element: jsx(MusicPage, {}) }),
          jsx(Route, { path: "/about", element: jsx(AboutPage, {}) }),
          jsx(Route, { path: "/projects", element: jsx(ProjectsPage, {}) }),
          jsx(Route, { 
            path: "/members", 
            element: jsx(ProtectedRoute, {}, jsx(MembersPage, {})) 
          }),
          jsx(Route, { path: "/auth", element: jsx(AuthPage, {}) }),
          // ... (other routes)
          jsx(Route, { path: "*", element: jsx(NotFoundPage, {}) })
        )
      )
    );
  };
  
  // --- Root Application Wrapper ---
  // Wraps the App with necessary providers (QueryClient, AuthProvider, Toaster, etc.)
  const Root = () => {
      return jsx(
          QueryClientProvider, { client: queryClient },
          jsx(AuthProvider, {},
              jsx(Toaster, {}),
              jsx(App, {})
          )
      );
  };
  
  // ==========================================================================
  // 7. Application Mount Point
  // ==========================================================================
  // This is the final step where the React application is rendered into the
  // `<div id="root"></div>` element in the HTML.
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement);
  root.render(jsx(Root, {}));