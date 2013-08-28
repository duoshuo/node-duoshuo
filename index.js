var api = require('beer');

var Duoshuo = function(config) {
    this.params = config;
}

Duoshuo.prototype.config = function(params) {
    if (params) {
        this.params = params;
    } else {
        return this.params;
    }
};

// 使用code换取access_token与用户ID
Duoshuo.prototype.auth = function(code, cb) {
    if (code && typeof(code) == 'string') {
        api.post('http://api.duoshuo.com/oauth2/access_token', {
            form: {
                code: code
            }
        }, function(err, result) {
            cb(err, result);
        });
    }
}

// 将某个通过sso登录后的用户注册到自己的网站中
Duoshuo.prototype.join = function(user, cb) {
    var config = this.config();
    api.post('http://api.duoshuo.com/sites/join', {
        form: {
            short_name: config.short_name,
            secret: config.secret,
            user: user.info,
            access_token: user.access_token
        }
    }, function(err, result) {
        cb(err, result);
    })
}

/**
 *
 * @func : 获取文章的评论与转发数量
 * @params: threads[array] 文章id数组
 *
 **/
Duoshuo.prototype.threads = function(threads, cb) {
    var config = this.config();
    api.get('http://api.duoshuo.com/threads/counts', {
        short_name: config.short_name,
        threads: threads.join(',')
    }, function(err, result) {
        cb(err, result);
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
Duoshuo.prototype.tops = function(params, cb) {
    var config = this.config();
    api.get('http://api.duoshuo.com/sites/listTopThreads.json', {
        short_name: config.short_name,
        range: params.range,
        num_items: params.num_items
    }, function(err, result) {
        cb(err, result);
    });
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
Duoshuo.prototype.comment = function(form) {
    var config = this.config();
    form['short_name'] = config.short_name;
    form['secret'] = config.secret;
    api.post('http://api.duoshuo.com/posts/create', {
        form: form
    }, function(err, result) {
        cb(err, result);
    })
}

module.exports = Duoshuo;