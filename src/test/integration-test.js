!function (assert, path) {
    'use strict';

    require('vows').describe('Integration test').addBatch({
        'When minifying a CSS file': {
            topic: function () {
                var callback = this.callback,
                    topic;

                require('publishjs')({
                    cache: false,
                    log: false,
                    processors: {
                        less: require('../index')
                    }
                }).build(function (pipe) {
                    pipe.from(path.resolve(path.dirname(module.filename), 'integration-test-files'))
                        .less()
                        .run(callback);
                }, callback);
            },

            'should returns a compiled version': function (topic) {
                assert.equal(Object.getOwnPropertyNames(topic).length, 1);
                assert.equal(topic['default.css'].buffer.toString(), 'html body {\n  font-family: Arial;\n}\n');
            }
        }
    }).export(module);
}(
    require('assert'),
    require('path')
);