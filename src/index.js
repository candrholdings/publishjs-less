!function (less, linq, path, util) {
    'use strict';

    var number = util.number,
        replaceMultiple = util.regexp.replaceMultiple,
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
        callback(null, text);
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