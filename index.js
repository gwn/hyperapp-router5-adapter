var h = require('hyperapp').h

var subscribedRouters = { /* [name]: { actions: <routerActionsHash> }, ... */ }

var makeRouterAdapter = function(router) {
    return {
        state: router.getState(),

        actions: {
            update: function(route) { return route },
            navigate: function(args) {
                router.navigate(args.to, args.params, args.opts)
            },
        },

        fx: {
            'hyperapp-router5.navigate': function (args) {
                return router.navigate(args.to, args.params, args.opts)
            },
        },
    }
}

var subscribeRouter = function(router, routerActions, routerName) {
    routerName = routerName || Object.keys(subscribedRouters).length

    subscribedRouters[routerName] = { actions: routerActions }

    routerActions.update(router.getState())

    return router.subscribe(function(e) { routerActions.update(e.route) })
}

var Link = function(props, children) {
    var finalProps = {}
    var propName

    for (propName in props)
        if (['to', 'params', 'opts', 'router'].indexOf(propName) === -1)
            finalProps[propName] = props[propName]

    finalProps.href = props.to
    finalProps.onclick = function(e) {
        e.preventDefault()

        var routerName = props.router || Object.keys(subscribedRouters)[0]

        subscribedRouters[routerName].actions.navigate({
            to: props.to,
            params: props.params,
            opts: props.opts,
        })
    }

    return h('a', finalProps, children)
}

var navigate = function(to, params, opts) {
    return ['hyperapp-router5.navigate', {
        to: to,
        params: params,
        opts: opts,
    }]
}

module.exports = {
    makeRouterAdapter: makeRouterAdapter,
    subscribeRouter: subscribeRouter,
    navigate: navigate,
    Link: Link,
}
