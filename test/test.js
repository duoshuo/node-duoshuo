// unit tests
// 执行各个功能点测试
var main = require('../index');

exports.auth = function(test) {
    main.auth('sample',function(token){
        test.equal(token, '123', "this assertion should pass"));
        test.done();
    });
}

exports.join = function(test) {
    main.join('sample',function(token){
        test.equal(token, '123', "this assertion should pass"));
        test.done();
    });
}

exports.threads = function(test) {
    main.threads([
            '1',
            '2',
            '3'
        ],function(token){
        test.equal(token, '123', "this assertion should pass"));
        test.done();
    });
}

exports.tops = function(test) {
    main.tops({
        range: 123,
        num_items: 10
    },function(tops){
        test.equal(tops, '123', "this assertion should pass"));
        test.done();
    });
}

exports.comment = function(test) {
    main.comment('sample',function(token){
        test.equal(token, '123', "this assertion should pass"));
        test.done();
    });
}