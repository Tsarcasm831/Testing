const NotFoundPage = () => {
  const e = Fn();
  return (
    p.useEffect(() => {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        e.pathname,
      );
    }, [e.pathname]),
    c.jsx("div", {
      className: "min-h-screen flex items-center justify-center bg-gray-100",
      children: c.jsxs("div", {
        className: "text-center",
        children: [
          c.jsx("h1", {
            className: "text-4xl font-bold mb-4",
            children: "404",
          }),
          c.jsx("p", {
            className: "text-xl text-gray-600 mb-4",
            children: "Oops! Page not found",
          }),
          c.jsx("a", {
            href: "/",
            className: "text-blue-500 hover:text-blue-700 underline",
            children: "Return to Home",
          }),
        ],
      }),
    })
  );
};
