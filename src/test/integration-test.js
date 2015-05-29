!function (assert, async, linq, path) {
    'use strict';

    require('vows').describe('Integration test').addBatch({
        'When compiling a LESS file': {
            topic: function () {
                var callback = this.callback,
                    topic;

                async.parallel({
                    input: function (callback) {
                        require('publishjs')({
                            cache: false,
                            log: false,
                            processors: {
                                less: require('../index')
                            }
                        }).build(function (pipe, callback) {
                            pipe.from(path.resolve(path.dirname(module.filename), 'integration-test-files/input'))
                                .less()
                                .run(callback);
                        }, callback);
                    },
                    baseline: function (callback) {
                        require('publishjs')({
                            cache: false,
                            log: false
                        }).build(function (pipe, callback) {
                            pipe.from(path.resolve(path.dirname(module.filename), 'integration-test-files/baseline'))
                                .run(callback);
                        }, callback);
                    }
                }, callback);
            },

            'should returns a compiled version': function (topic) {
                var input = linq(topic.input.all).select(function (buffer) {
                        return buffer.toString().replace(/\r/g, '');
                    }).run(),
                    baseline = linq(topic.baseline.all).select(function (buffer) {
                        return buffer.toString().replace(/\r/g, '');
                    }).run();

                assert.deepEqual(input, baseline);
            }
        }
    }).export(module);
}(
    require('assert'),
    require('async'),
    require('async-linq'),
    require('path')
);