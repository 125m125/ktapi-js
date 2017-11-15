/**
 * inserts path parameters into an url with placeholders
 * @example
 * // returns "/user/1/items/4"
 * // params will be {unused:"notUsed"}
 * replacePathParameters("/user/{user}/items/{item}", {item:4, unused:"notUsed"}, {uid:1, tid:2, tkn:3})
 * @param {string} url - the url with path parameters ({<name>})
 * @param {object} params - parameters that can be used to replace path parameters. Used parameters will be removed from the map
 * @param {object} [user] - the user whose id can be used for {user}
 * @returns {string} - the url with inserted path parameters
 */
export default function replacePathParameters(url, params, user) {
    return url.replace(/\{[a-zA-Z0-9]+?\}/g, function (key) {
        if (user && key === "{user}") {
            return user.uid;
        }
        var key2 = key.substring(1, key.length - 1),
            result;
        if (params.hasOwnProperty(key2) && params[key2] !== undefined) {
            result = params[key2];
            delete params[key2];
            return result;
        }
        return key;
    });
}