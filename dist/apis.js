/**
 *
 * 接口参数请参考官方文档
 * http://dev.duoshuo.com/docs
 *
 **/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  token: {
    method: 'post',
    url: 'oauth2/access_token',
    callback: defaultCallback
  },
  userProfile: {
    method: 'get',
    url: 'users/profile.json',
    callback: defaultCallback
  },
  join: {
    method: 'post',
    url: 'sites/join.json',
    callback: defaultCallback
  },
  threads: {
    method: 'get',
    url: 'threads/counts.json',
    callback: defaultCallback
  },
  comments: {
    method: 'post',
    url: 'posts/create.json',
    callback: defaultCallback
  },
  tops: {
    method: 'get',
    url: 'sites/listTopThreads.json',
    callback: defaultCallback
  }
};

function defaultCallback(err, res, body, next) {
  if (err) return next(err);

  if (res.statusCode !== 200) return next(new Error(res.statusCode), res);

  if (body.code !== 0) return next(new Error(body.errorMessage), res);

  return next(err, body);
}
module.exports = exports['default'];
//# sourceMappingURL=apis.js.map