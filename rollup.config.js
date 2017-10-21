export default {
    input: 'src/index.js',
    name: 'Kt',
    output: {
        file: 'target/ktapi-full.js',
        format: 'umd'
    },
    external: ['jssha','d3-request','pusher-js', 'xmlhttprequest', 'btoa'],
    globals: {
        'jssha': 'jsSHA',
        'd3-request': 'd3',
        'pusher-js': 'Pusher',
        'xmlhttprequest': 'XMLHttpRequest',
        'btoa':'btoa'
    }
}
