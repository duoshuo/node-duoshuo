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

/**
*
* @func : 获取文章的评论与转发数量
* @params: threads[array] 文章id数组
*
**/
exports.threads = function(threads,cb) {
    var config = _ds.config;
    api.request('GET','http://api.duoshuo.com/threads/counts?short_name=' + config.short_name + '&threads=' + threads.josin(','),function(comments){
        cb(comments)
    });
}

/**
*
* @func : 获取热评文章，每月每周每日评论数量最多的文章
    @param: 
        - range
        - num_items
*
**/
exports.tops = function(params,cb) {
    var config = _ds.config;
    api.request('GET','http://api.duoshuo.com/sites/listTopThreads.json?short_name=' + config.short_name + '&range=' + params.range + '&num_items=' + params.num_items,function(tops){
        cb(tops)
    })
}

/**
*
* @func : 发布评论，意味着可以自己包装评论的形式
* @params: form[object]
    - message *
    - thread_key
    - thread_id
    - parent_id
    - author_name
    - author_email
    - author_url
**/
exports.comment = function(form) {
    var config = _ds.config;
    form['short_name'] = config.short_name;
    form['secret'] = config.secret;
    api.post({
        url: 'http://api.duoshuo.com/posts/create',
        form: form
    },function(comment){
        cb(comment)
    })
}