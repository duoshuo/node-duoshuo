var api = require('beer');

var Duoshuo = function(config) {
    if (!config) return false;
    this.config = config;
};

// 使用code换取access_token与用户ID
Duoshuo.prototype.auth = function(code, callback) {
    if (!code) return callback(new Error('code required'));
    if (typeof(code) !== 'string') return callback(new Error('code must be string'));
    api.post('http://api.duoshuo.com/oauth2/access_token', {
        form: {
            code: code
        }
    }, function(err, result) {
        if (err) return callback(err);
        if (result.body.code !== 0) return callback(new Error(result.body.errorMessage));
        return callback(err, result.body);
    });
};

// signin middleware
Duoshuo.prototype.signin = function() {
    var self = this;
    return function(req, res, next) {
        self.auth(req.query.code, function(err, result) {
            if (err) return next(err);
            res.locals.duoshuo = result;
            return next();
        });
    }
};

// 将某个通过sso登录后的用户注册到自己的网站中
Duoshuo.prototype.join = function(user, callback) {
    var config = this.config;
    api.post('http://api.duoshuo.com/sites/join.json', {
        form: {
            short_name: config.short_name,
            secret: config.secret,
            user: user.info,
            access_token: user.access_token
        }
    }, callback);
}

/**
 *
 * @func : 获取文章的评论与转发数量
 * @params: threads[array] 文章id数组
 *
 **/
Duoshuo.prototype.threads = function(threads, callback) {
    var config = this.config;
    api.get('http://api.duoshuo.com/threads/counts.json', {
        query: {
            short_name: config.short_name,
            threads: threads.join(',')
        }
    }, callback);
}

/**
*
* @func : 获取热评文章，每月每周每日评论数量最多的文章
  @param: 
    - range
    - num_items
*
**/
Duoshuo.prototype.tops = function(params, callback) {
    var config = this.config;
    api.get('http://api.duoshuo.com/sites/listTopThreads.json', {
        query: {
            short_name: config.short_name,
            range: params.range,
            num_items: params.num_items
        }
    }, callback);
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
Duoshuo.prototype.comment = function(form, callback) {
    var config = this.config;
    form['short_name'] = config.short_name;
    form['secret'] = config.secret;
    api.post('http://api.duoshuo.com/posts/create.json', {
        form: form
    }, callback)
}

module.exports = Duoshuo;