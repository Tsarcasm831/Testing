const AuthPage = () => {
    const [e, t] = p.useState(""),
      [r, n] = p.useState(""),
      [a, s] = p.useState(""),
      [o, i] = p.useState(!1),
      [l, u] = p.useState(""),
      [d, h] = p.useState(""),
      f = qh(),
      v = async (m) => {
        (m.preventDefault(), i(!0), u(""), h(""));
        try {
          const w = `${window.location.origin}/`,
            { error: y } = await Fs.auth.signUp({
              email: e,
              password: r,
              options: { emailRedirectTo: w, data: { display_name: a } },
            });
          y
            ? y.message.includes("User already registered")
              ? u(
                  "An account with this email already exists. Please sign in instead.",
                )
              : u(y.message)
            : h(
                "Check your email for a confirmation link to complete your signup!",
              );
        } catch {
          u("An unexpected error occurred. Please try again.");
        } finally {
          i(!1);
        }
      },
      g = async (m) => {
        (m.preventDefault(), i(!0), u(""), h(""));
        try {
          const { error: w } = await Fs.auth.signInWithPassword({
            email: e,
            password: r,
          });
          w
            ? w.message.includes("Invalid login credentials")
              ? u(
                  "Invalid email or password. Please check your credentials and try again.",
                )
              : u(w.message)
            : f("/");
        } catch {
          u("An unexpected error occurred. Please try again.");
        } finally {
          i(!1);
        }
      };
    return c.jsx("div", {
      className:
        "container mx-auto px-4 py-8 min-h-screen flex items-center justify-center",
      children: c.jsxs(At, {
        className: "cyber-border bg-card/50 backdrop-blur-sm max-w-md w-full",
        children: [
          c.jsx(Mt, {
            children: c.jsxs("div", {
              className: "flex items-center justify-center space-x-2 mb-4",
              children: [
                c.jsx(_n, {
                  className: "w-8 h-8 text-primary animate-glow-pulse",
                }),
                c.jsx(It, {
                  className: "terminal-text text-primary text-center text-2xl",
                  children: "VAULT ACCESS",
                }),
              ],
            }),
          }),
          c.jsxs(Xt, {
            children: [
              c.jsxs(GO, {
                defaultValue: "signin",
                className: "space-y-6",
                children: [
                  c.jsxs(vx, {
                    className: "grid w-full grid-cols-2",
                    children: [
                      c.jsxs(Sd, {
                        value: "signin",
                        className: "terminal-text",
                        children: [
                          c.jsx(l_, { className: "w-4 h-4 mr-2" }),
                          "Sign In",
                        ],
                      }),
                      c.jsxs(Sd, {
                        value: "signup",
                        className: "terminal-text",
                        children: [
                          c.jsx(g_, { className: "w-4 h-4 mr-2" }),
                          "Sign Up",
                        ],
                      }),
                    ],
                  }),
                  l &&
                    c.jsx(xd, {
                      className: "border-destructive/50 bg-destructive/10",
                      children: c.jsx(kd, {
                        className: "text-destructive",
                        children: l,
                      }),
                    }),
                  d &&
                    c.jsx(xd, {
                      className: "border-primary/50 bg-primary/10",
                      children: c.jsx(kd, {
                        className: "text-primary",
                        children: d,
                      }),
                    }),
                  c.jsx(_d, {
                    value: "signin",
                    className: "space-y-4",
                    children: c.jsxs("form", {
                      onSubmit: g,
                      className: "space-y-4",
                      children: [
                        c.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            c.jsx(ca, {
                              htmlFor: "signin-email",
                              className: "terminal-text text-muted-foreground",
                              children: "Email Address",
                            }),
                            c.jsxs("div", {
                              className: "relative",
                              children: [
                                c.jsx(zp, {
                                  className:
                                    "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                                }),
                                c.jsx(la, {
                                  id: "signin-email",
                                  type: "email",
                                  placeholder: "Enter your email",
                                  value: e,
                                  onChange: (m) => t(m.target.value),
                                  required: !0,
                                  className: "pl-10 cyber-border",
                                }),
                              ],
                            }),
                          ],
                        }),
                        c.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            c.jsx(ca, {
                              htmlFor: "signin-password",
                              className: "terminal-text text-muted-foreground",
                              children: "Password",
                            }),
                            c.jsxs("div", {
                              className: "relative",
                              children: [
                                c.jsx(_n, {
                                  className:
                                    "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                                }),
                                c.jsx(la, {
                                  id: "signin-password",
                                  type: "password",
                                  placeholder: "Enter your password",
                                  value: r,
                                  onChange: (m) => n(m.target.value),
                                  required: !0,
                                  className: "pl-10 cyber-border",
                                }),
                              ],
                            }),
                          ],
                        }),
                        c.jsx(Z, {
                          type: "submit",
                          disabled: o,
                          className: "w-full terminal-text",
                          children: o ? "Authenticating..." : "Access Vault",
                        }),
                      ],
                    }),
                  }),
                  c.jsx(_d, {
                    value: "signup",
                    className: "space-y-4",
                    children: c.jsxs("form", {
                      onSubmit: v,
                      className: "space-y-4",
                      children: [
                        c.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            c.jsx(ca, {
                              htmlFor: "signup-name",
                              className: "terminal-text text-muted-foreground",
                              children: "Display Name",
                            }),
                            c.jsx(la, {
                              id: "signup-name",
                              type: "text",
                              placeholder: "Your display name",
                              value: a,
                              onChange: (m) => s(m.target.value),
                              className: "cyber-border",
                            }),
                          ],
                        }),
                        c.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            c.jsx(ca, {
                              htmlFor: "signup-email",
                              className: "terminal-text text-muted-foreground",
                              children: "Email Address",
                            }),
                            c.jsxs("div", {
                              className: "relative",
                              children: [
                                c.jsx(zp, {
                                  className:
                                    "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                                }),
                                c.jsx(la, {
                                  id: "signup-email",
                                  type: "email",
                                  placeholder: "Enter your email",
                                  value: e,
                                  onChange: (m) => t(m.target.value),
                                  required: !0,
                                  className: "pl-10 cyber-border",
                                }),
                              ],
                            }),
                          ],
                        }),
                        c.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            c.jsx(ca, {
                              htmlFor: "signup-password",
                              className: "terminal-text text-muted-foreground",
                              children: "Password",
                            }),
                            c.jsxs("div", {
                              className: "relative",
                              children: [
                                c.jsx(_n, {
                                  className:
                                    "absolute left-3 top-3 h-4 w-4 text-muted-foreground",
                                }),
                                c.jsx(la, {
                                  id: "signup-password",
                                  type: "password",
                                  placeholder: "Create a password",
                                  value: r,
                                  onChange: (m) => n(m.target.value),
                                  required: !0,
                                  className: "pl-10 cyber-border",
                                }),
                              ],
                            }),
                          ],
                        }),
                        c.jsx(Z, {
                          type: "submit",
                          disabled: o,
                          variant: "secondary",
                          className: "w-full terminal-text",
                          children: o
                            ? "Creating Account..."
                            : "Join the Vault",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              c.jsxs("div", {
                className:
                  "mt-6 p-4 bg-background/50 rounded border border-primary/20",
                children: [
                  c.jsx("div", {
                    className: "terminal-text text-primary text-sm mb-2",
                    children: "SECURITY_PROTOCOL.LOG",
                  }),
                  c.jsxs("div", {
                    className: "text-muted-foreground text-xs",
                    children: [
                      "Secure authentication required for member vault access.",
                      c.jsx("br", {}),
                      "All credentials encrypted using military-grade protocols.",
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
