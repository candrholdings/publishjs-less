!function (less, linq, path, util) {
    'use strict';

    var number = util.number,
        replaceMultipleAsync = util.regexp.replaceMultipleAsync,
        time = util.time;

    module.exports = function (inputs, outputs, callback) {
        var that = this;

        inputs = inputs.newOrChanged;

        linq(inputs).async.select(function (buffer, filename, callback) {
            var startTime = Date.now(),
                original = inputs[filename];

            processFile(filename, original.toString(), function (err, css) {
                if (err) { return callback(err); }

                var compiled = new Buffer(css);

                that.log([
                    'Compiled ',
                    filename,
                    ', took ',
                    time.humanize(Date.now() - startTime),
                    ' (',
                    number.bytes(original.length),
                    ' -> ',
                    number.bytes(compiled.length),
                    ', ',
                    (((compiled.length / original.length) - 1) * 100).toFixed(1),
                    '%)'
                ].join(''));

                callback(null, compiled);
            });
        }).run(callback);
    };

    function processFile(filename, buffer, callback) {
        if ((path.extname(filename) || '').toLowerCase() === '.html') {
            processHTML(buffer.toString(), callback);
        } else  {
            renderLess(buffer.toString(), callback);
        }
    }

    function processHTML(text, callback) {
        // callback(new Error('not implemented'));
        replaceMultipleAsync(
            text,
            [
                [
                    /(<style [^>]*?type=")(?:text\/less)("[^>]*>)([\s\S]*?)(<\/style>)/gmi,
                    function (match0, match1, match2, match3, match4, index, input, callback) {
                        less.render(match3, function (err, css) {
                            callback(err, err ? null : (match1 + 'text/css' + match2 + css.css + match4));
                        });
                    }
                ]
            ],
            callback
        );
    }

    function renderLess(code, callback) {
        less.render(code, function (err, css) {
            callback(err, err ? null : css.css);
        });
    }
}(
    require('less'),
    require('async-linq'),
    require('path'),
    require('publishjs').util
);