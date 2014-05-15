/**
 *
 * 接口参数请参考官方文档
 * http://dev.duoshuo.com/docs
 *
 **/
 
module.exports = {
  token: {
    method: 'post',
    url: 'oauth2/access_token',
    callback: defaultCallback
  },
  userProfile: {
    method: 'get',
    url: 'users/profile',
    callback: defaultCallback
  },
  join: {
    method: 'post',
    url: 'sites/join',
    callback: defaultCallback
  },
  threads: {
    method: 'get',
    url: 'threads/counts',
    callback: defaultCallback
  },
  comments: {
    method: 'post',
    url: 'posts/create',
    callback: defaultCallback
  },
  tops: {
    method: 'get',
    url: 'sites/listTopThreads',
    callback: defaultCallback
  }
}

function defaultCallback = function(err, res, body, next) {
  if (err) return next(err);
  if (res.statusCode !== 200) return next(new Error(res.statusCode), res);
  if (body.code !== 0) return next(new Error(body.errorMessage), res);
  return next(err, body);
}