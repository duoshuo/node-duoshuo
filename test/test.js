// 执行各个功能点测试
var main = require('../index'),
    should = require("should");

// var fetch = function(type, params, cb) {
//     main[type](params, cb)
// }

// describe('Auth', function() {
//     describe('#token', function() {
//         it('无效的 code 必须被忽略', function(done) {
//             fetch('auth', 'fakecode', function(token) {
//                 var code = token.code,
//                     error = token.errorMessage;
//                 code.should.equal(2);
//                 error.should.equal('Code不存在');
//                 done();
//             });
//         });
//     })
// });