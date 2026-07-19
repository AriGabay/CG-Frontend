# patches/

Applied automatically by the `postinstall` script (`patch-package`). Do not delete
without reading below.

## `react-scripts+5.0.1.patch`

Adds `new webpack.HotModuleReplacementPlugin()` to the development `plugins` array.

**Without it, `npm start` serves a blank page.** The bundle throws
`Uncaught Error: [HMR] Hot Module Replacement is disabled.` before `src/index.js`
ever runs, and nothing renders.

Why it happens:

- `webpack/hot/dev-server.js` (injected by webpack-dev-server) is `if (module.hot) {...} else { throw }`.
- `webpack/lib/dependencies/CommonJsPlugin.js` taps `parser.hooks.evaluateIdentifier.for("module.hot")`
  and evaluates it to a nullish identifier.
- `HotModuleReplacementPlugin` taps the same hook with `{ before: "NodeStuffPlugin" }`, but that
  evaluator now lives in `CommonJsPlugin`, not `NodeStuffPlugin`. Tapable *appends* a tap whose
  `before` target does not exist, so `CommonJsPlugin` wins the `SyncBailHook`, `module.hot` folds
  to `false`, and the `else` branch throws.
- This only bites when the plugin is applied **after** the compiler is created — which is exactly
  what webpack-dev-server does. Putting it in the config array means it is applied during
  `webpack(config)`, ahead of webpack's internal plugins, so its tap registers first and wins.

Not caused by the pinned `webpack-dev-server@4.15.2` override, and not a webpack-version
regression — reproduced identically on webpack 5.75.0, 5.88.2 and 5.105.4.

This patch can be dropped once the project moves off `react-scripts` (CRA is unmaintained), or if
webpack fixes the stale `before:` ordering hint upstream.
