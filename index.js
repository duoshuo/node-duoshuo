var api = require('./lib/api');
var _ds = {
    config: {
        short_name: '', // 站点申请的多说二级域名。
        secret: '' // 站点密钥
    }
}

// 配置多说站点
exports.config = function(params) {
    if (typeof(params) == 'object') {
        _ds._config = params;
        return _ds;
    } else {
        return false;
    }
}

// 使用code换取access_token与用户ID
export.auth = function(code,cb) {
    if (code && typeof(code) == 'string') {
        api.request('POST','http://api.duoshuo.com/oauth2/access_token?code=' + code,function(token){
            cb(token)
        })
    }
}

// 将某个通过sso登录后的用户注册到自己的网站中
exports.join = function(user,cb) {
    api.post({
        url: 'http://api.duoshuo.com/sites/join'
        form: {
            short_name: _ds.config.short_name,
            secret: _ds.config.secret,
            user: user,
            access_token: user.access_token
        }
    },function(user){
        // 在多说新建的用户
        cb(user);
    })
}

// 获取文章的评论与转发数量
// threads[array] 文章id数组
exports.threads = function(threads,cb) {
    var config = _ds.config;
    api.request('GET','http://api.duoshuo.com/threads/counts?short_name=' + config.short_name + '&threads=' + threads.josin(','),function(comments){
        cb(comments)
    });
}