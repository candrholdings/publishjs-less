!function (less, linq, util) {
    'use strict';

    var number = util.number,
        time = util.time;

    module.exports = function (inputs, outputs, callback) {
        var that = this;

        inputs = inputs.newOrChanged;

        linq(inputs).async.select(function (buffer, filename, callback) {
            var startTime = Date.now(),
                original = inputs[filename];

            renderLess(original, function (err, css) {
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

    function renderLess(content, callback) {
        less.render(content.toString(), function (err, css) {
            callback(err, err ? null : css.css);
        });
    }
}(
    require('less'),
    require('async-linq'),
    require('publishjs').util
);