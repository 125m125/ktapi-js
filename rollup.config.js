import rollupPluginSpl from "rollup-plugin-spl";

// eslint-disable-next-line no-undef
var custom = process.env.CUSTOM;
// eslint-disable-next-line no-undef
var config = process.env.CONFIG;

export default {
    input: 'src/index.js',
    output: {
        name: 'Kt',
        file: (custom || config) ? 'target/ktapi-custom.js' : 'target/ktapi-full.js',
        format: 'umd',
        globals: {
            'jssha': 'jsSHA',
            'd3-request': 'd3',
            'pusher-js': 'Pusher',
            'xmlhttprequest': 'XMLHttpRequest',
            'btoa': 'btoa'
        },
    },
    external: ['jssha', 'd3-request', 'pusher-js', 'xmlhttprequest', 'btoa'],
    plugins: [rollupPluginSpl({
        model: "model.json",
        config: config ? config : (custom ? false : "fullConfig.json"),
        interactive: custom,
        autocomplete: {
            preference: true,
        },
    }), ],
};