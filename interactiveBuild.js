var fs = require('fs'),
    inquirer = require('inquirer'),
    MetaScript = require('metascript');
/**
 * the lines to search for features
 */
var lines = fs.readFileSync('./src/index.js', 'utf8').split(/[\r\n]+/),
    /**
     * the current nesting level
     */
    level = 0,
    /**
     * found features
     */
    features = [],
    /**
     * configuration state
     */
    settings = {};
lines.forEach(line => {
    var match,
        featureRegex = /NO(LIB)?_([A-Z0-9_]+)/g;
    // check if line is a metascript line
    if (!/^[\s\t]*\/\/\?/g.test(line)) {
        return;
    }
    // reduce level if line is closing a block
    if (/^\W*}/g.test(line)) {
        level--;
    }
    // find all features in the line and add them to the features
    while ((match = featureRegex.exec(line))) {
        features.push({ 'name': match[2], 'lib': match[1] === 'LIB', 'level': level });
        level += (level % 1) / 2 || 0.5;
    }
    level = Math.floor(level);
    // increase level if line is opening a new block
    if (/{\W*/g.test(line)) {
        level++;
    }
});
// console.log('found features',features);
poseQuestion(0, compile);

/**
 * poses question from a given index to the user
 * @param {number} index 
 * @param {Function} callback 
 */
function poseQuestion(index, callback) {
    var question = features[index],
        settingName = (question.lib ? 'NOLIB_' : 'NO_') + question.name,
        message = (question.lib ? 'allow usage of ' : 'include ') + question.name.toLowerCase();
    //feature is already set -> skip
    if (typeof settings[settingName] !== 'undefined') {
        return poseQuestionAfter(index, settings[question.name], question.level, callback);
    }
    inquirer.prompt({
        'type': 'confirm',
        'name': 'result',
        'message': message,
        'default': true
    }).then(result => {
        settings[settingName] = !result.result;
        poseQuestionAfter(index, result.result, question.level, callback);
    });
}
/**
 * poses questions after a given index to the user
 * @param {number} index 
 * @param {boolean} result 
 * @param {number} level 
 * @param {Function} callback 
 */
function poseQuestionAfter(index, result, level, callback) {
    index++;
    // user deselected a feature -> skip following questions in deeper levels
    if (!result) {
        while (index < features.length && features[index].level > level) {
            index++;
        }
    }
    // check if all questions were asked
    if (index < features.length) {
        return poseQuestion(index, callback);
    } else {
        callback();
    }
}

/**
 * stores the selected features
 */
function compile() {
    // var result = MetaScript.transform(file, './src/processedIndex.js', settings);
    // console.log(result);
    // fs.writeFileSync(process.argv[0] || 'src/indexProcessed.js', result);
    var result = '';
    for (var key in settings) {
        // only deselected features are interesting
        if (settings.hasOwnProperty(key) && settings[key] === true) {
            result += ' -' + key + '=' + settings[key];
        }
    }
    fs.mkdirSync('./target');
    fs.writeFileSync('./target/settings', result);
}