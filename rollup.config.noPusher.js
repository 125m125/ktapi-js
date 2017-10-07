export default {
    input: 'src/noPusher.js',
    name: 'Kt',
    output: {
        file: 'target/ktapi-noPusher.js',
        format: 'umd',
    },
    external: ['jsSHA','d3-request','pusher'],
    globals: {
        'jsSHA': 'jsSHA',
        'd3-request': 'd3',
        'pusher': 'Pusher'
    }
}