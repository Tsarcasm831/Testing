const queryClient = new EN();

const App = () =>
  c.jsx(CN, {
    client: queryClient,
    children: c.jsx(BT, {
      children: c.jsxs(nN, {
        children: [
          c.jsx(ej, {}),
          c.jsx(Tj, {}),
          c.jsx(_2, {
            children: c.jsx(uO, {
              children: c.jsxs(v2, {
                children: [
                  c.jsx(Et, { path: "/", element: c.jsx(dO, {}) }),
                  c.jsx(Et, { path: "/music", element: c.jsx(gO, {}) }),
                  c.jsx(Et, { path: "/about", element: c.jsx(bO, {}) }),
                  c.jsx(Et, {
                    path: "/projects",
                    element: c.jsx(eg, { children: c.jsx(AO, {}) }),
                  }),
                  c.jsx(Et, {
                    path: "/members",
                    aelement: c.jsx(eg, { children: c.jsx(DO, {}) }),
                  }),
                  c.jsx(Et, { path: "/auth", element: c.jsx(AuthPage, {}) }),
                  c.jsx(Et, { path: "/aliens", element: c.jsx($O, {}) }),
                  c.jsx(Et, {
                    path: "/core-rule-book",
                    element: c.jsx(FO, {}),
                  }),
                  c.jsx(Et, { path: "/lore", element: c.jsx(zO, {}) }),
                  c.jsx(Et, { path: "*", element: c.jsx(NotFoundPage, {}) }),
                ],
              }),
            }),
          }),
        ],
      }),
    }),
  });

yy(document.getElementById("root")).render(c.jsx(App, {}));
