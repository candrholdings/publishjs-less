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
                }).build(function (pipe, callback) {
                    pipe.from(path.resolve(path.dirname(module.filename), 'integration-test-files/'))
                        .less()
                        .run(callback);
                }, callback);
            },

            'should returns a compiled version': function (topic) {
                assert.equal(Object.getOwnPropertyNames(topic).length, 2);
                assert.equal(topic['default.css'].toString(), 'html body {\n  font-family: Arial;\n}\n');
                assert.equal(topic['index.html'].toString().replace(/\r/g, ''), '<!DOCTYPE html>\n<html lang="en-US">\n<head>\n    <style type="text/css">html body {\n  font-family: Arial;\n}\n</style>\n</head>\n</html>');
            }
        }
    }).export(module);
}(
    require('assert'),
    require('path')
);