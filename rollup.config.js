export default {
    input: 'src/index.js',
    name: 'Kt',
    output: {
        file: 'target/ktapi-full.js',
        format: 'umd'
    },
    external: ['jsSHA','d3-request','pusher'],
    globals: {
        'jsSHA': 'jsSHA',
        'd3-request': 'd3',
        'pusher': 'Pusher'
    }
}