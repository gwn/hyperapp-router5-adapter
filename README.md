## Router5 adapter for Hyperapp

### Quick example:

```javascript
const {
    makeRouterAdapter, subscribeRouter, Link,
} = require('hyperapp-router5-adapter')

const routerAdapter = makeRouterAdapter(router5Router)

const state = {
    router: routerAdapter.state,
}

const actions = {
    router: routerAdapter.actions,
}

const view = state => div([
    Link({ to: 'some-route' }, 'Click me'),
    Link({ to: 'some-other-route' }, 'No, click me'),

    p([
        'Current route is: ' + state.router.route.name,
    ]),
])

const wiredActions = app(state, actions, view, document.body)

router5Router.start(() => {
    subscribeRouter(router5Router, wiredActions.router)
})
```

You can also set the app as a dependency to the router if you plan
to use it in router middleware:

    ...

    const wiredActions = app(state, actions, view, document.body)

    router5Router.setDependency('router', wiredActions)

    ...

### Install

```sh
npm install hyperapp-router5-adapter
```


### Demo

Check out the "demo" folder for a full demonstration.


### API

- `makeRouterAdapter(router5Router): { state, actions, fx }`

  Create an adapter for the given router.
  
  Accepts a Router5 router instance. Returns an object of router
  state, actions and fx. Compose them with your own initial state,
  actions and fx before creating the app.

- `subscribeRouter(router5Router, routerActions [, routerName]): fn`

  Subscribe the app to route changes. This needs to be called
  after the app is created as it needs to use the wired router
  actions. Call this after both the app and the router is started.

  Naming the router subscription via an optional `routerName`
  parameter is supported in case you would have multiple routers
  and would like to have Link components for both routers (An
  unlikely scenario but supported nonetheless).

  Returns an unsubscribe function.

- `Link(props, children): vnode`

  A link "component". Accepted props are `to`, `params`, `opts`
  and `router`. `to`, `params` and `opts` directly correspond to
  the first three parameters of the
  [`router.navigate`](https://router5.js.org/api-reference#navigate)
  method of Router5.

  `router` is an optional prop that can be used if you gave your
  router subscription a name when you invoked the
  `subscribeRouter` function. If you have multiple router
  subscriptions, you may need to pass the router subscription name
  to the Link component in order for it to use the correct router.
  If you only have a single router subscription, don't worry about
  this one.

- `navigate({ to, params, opts }): array`

  A navigate effect for the users of [Hyperapp
  FX](https://github.com/hyperapp/fx).

  Accepts an object with the keys `to`, `props` and `opts` which
  directly correspond to the first three parameters of the
  [`router.navigate`](https://router5.js.org/api-reference#navigate)
  method of Router5.

  Returns an effect complying with the Hyperapp FX effect format.
