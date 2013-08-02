var api = require('beer'),
    pkg = require('./pkg');

// 配置多说站点
exports.config = function(params) {
    if (params) {
        pkg.set('/config.json', params);
    } else {
        return pkg.fetch('/config.json');
    }
}

// 使用code换取access_token与用户ID
exports.auth = function(code, cb) {
    if (code && typeof(code) == 'string') {
        api.post('http://api.duoshuo.com/oauth2/access_token', {
            code: code
        }, function(err, result) {
            if (!err) {
                cb(result.body);
            } else {
                cb('error');
            }
        });
    }
}

// 将某个通过sso登录后的用户注册到自己的网站中
exports.join = function(user, cb) {
    var config = exports.config();
    api.post('http://api.duoshuo.com/sites/join', {
        short_name: config.short_name,
        secret: config.secret,
        user: user.info,
        access_token: user.access_token
    }, function(err, result) {
        // 在多说新建的用户
        if (!err) {
            cb(result.body);
        } else {
            cb('error');
        }
    })
}

/**
 *
 * @func : 获取文章的评论与转发数量
 * @params: threads[array] 文章id数组
 *
 **/
exports.threads = function(threads, cb) {
    var config = exports.config();
    api.get('http://api.duoshuo.com/threads/counts', {
        short_name: config.short_name,
        threads: threads.join(',')
    }, function(err, comments) {
        if (!err) {
            cb(comments.body);
        } else {
            cb('error');
        }
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
exports.tops = function(params, cb) {
    var config = exports.config();
    api.get('http://api.duoshuo.com/sites/listTopThreads.json', {
        short_name: config.short_name,
        range: params.range,
        num_items: params.num_items
    }, function(err, tops) {
        if (!err) {
            cb(tops.body);
        } else {
            cb('error');
        }
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
exports.comment = function(form) {
    var config = exports.config();
    form['short_name'] = config.short_name;
    form['secret'] = config.secret;
    api.post('http://api.duoshuo.com/posts/create', form, function(err, comment) {
        if (!err) {
            cb(comment.body);
        } else {
            cb('error');
        }
    })
}