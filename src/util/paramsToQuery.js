export default function paramsToQuery(params) {
    if (!params) {
        return params;
    }
    var result = "",
        sorted_keys = Object.keys(params).sort();
    sorted_keys.forEach(function (entry) {
        result += entry + "=" + params[entry] + "&";
    });
    if (result.length) {
        return result.slice(0, -1);
    }
    return result;
}