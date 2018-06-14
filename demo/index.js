const { app } = require('hyperapp')
const { div, ul, li, p, strong, pre, button } = require('@hyperapp/html')
const { withFx } = require('@hyperapp/fx')
const { default: createRouter, loggerPlugin } = require('router5')
const { default: browserPlugin } = require('router5/plugins/browser')
const { makeRouterAdapter, subscribeRouter, Link, navigate } = require('..')

const routes = [
    { name: 'home', path: '/' },
    { name: 'profile', path: '/profile' },
    { name: 'help', path: '/help/:subpage' },
    { name: 'custom1', path: '/custom1' },
    { name: 'custom2', path: '/custom2' },
]

const router =
    createRouter(routes)
        .usePlugin(browserPlugin())
        .usePlugin(loggerPlugin)

const routerAdapter = makeRouterAdapter(router)

const state = {
    router: routerAdapter.state,
};

const actions = {
    router: routerAdapter.actions,

    // Action using the router object to trigger a route change side effect:
    handleButton1Click: () => router.navigate('custom1'),

    // Action using the pure "navigate" effect to trigger a route change:
    handleButton2Click: () => navigate('custom2'),
};

const fx = {
    ...routerAdapter.fx,
}

const view = (state, actions) => div([
    ul([
        li([
            Link({ to: 'home', opts: { reload: true } }, 'home')
        ]),

        li([
            Link({ to: 'profile' }, 'profile')
        ]),

        li([
            Link({ to: 'help', params: { subpage: 'guides' } }, 'guides')
        ]),

        li([
            Link({ to: 'help', params: { subpage: 'faq' } }, 'faq')
        ]),
    ]),

    p([
        button({
            onclick: actions.handleButton1Click,
        }, 'Custom link 1'),

        button({
            onclick: actions.handleButton2Click,
        }, 'Custom link 2'),
    ]),

    p([
        'Current route is: ',
        strong(state.router.route.name),
        pre(JSON.stringify(state.router.route, null, 4)),
    ])
])

const wiredActions = withFx(fx)(app)(state, actions, view, document.body)

router.start(() => subscribeRouter(router, wiredActions.router))
