export default {
    input: 'src/index.js',
    output: {
        name: 'Kt',
        file: 'target/ktapi-full.js',
        format: 'umd',
        globals: {
            'jssha': 'jsSHA',
            'd3-request': 'd3',
            'pusher-js': 'Pusher',
            'xmlhttprequest': 'XMLHttpRequest',
            'btoa':'btoa'
        },
    },
    external: ['jssha','d3-request','pusher-js', 'xmlhttprequest', 'btoa'],
}
