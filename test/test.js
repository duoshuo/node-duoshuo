// 执行各个功能点测试
var Duoshuo = require('../index');
var should = require("should");
var duoshuo = new Duoshuo({
  short_name: 'demo-shortname' // 这里必须是一个真实的token.
})

describe('API', function() {
  describe('#auth', function() {
    it('无效的 code 必须被忽略', function(done) {
      duoshuo.auth('fakecode', function(token) {
        var code = token.code;
        var error = token.errorMessage;
        code.should.equal(2);
        error.should.equal('Code不存在');
        done();
      });
    });
  });
  describe('#userProfile', function() {
    it('获取用户信息逻辑', function(done) {
      duoshuo.auth('fakecode', function(token) {
      });
    });
  })
  describe('#join', function() {
    it('将本地用户同步到远程数据库', function(done) {
      duoshuo.auth('fakecode', function(token) {
      });
    });
  });
  describe('#threads', function() {
    it('将帖子数据同步到远程数据库', function(done) {
      duoshuo.auth('fakecode', function(token) {
      });
    });
  });
  describe('#comments', function() {
    it('将评论同步到数据库', function(done) {
      duoshuo.auth('fakecode', function(token) {
      });
    });
  });
  describe('#tops', function() {
    it('获取热点数据', function(done) {
      duoshuo.auth('fakecode', function(token) {
      });
    });
  });
});