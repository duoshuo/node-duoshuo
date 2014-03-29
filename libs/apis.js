/**
 *
 * 接口参数请参考官方文档
 * http://dev.duoshuo.com/docs
 *
 **/

module.exports = {
  token: {
    method: 'post',
    url: 'oauth2/access_token'
  },
  userProfile: {
    method: 'get',
    url: 'users/profile'
  },
  join: {
    method: 'post',
    url: 'sites/join'
  },
  threads: {
    method: 'get',
    url: 'threads/counts'
  },
  comments: {
    method: 'post',
    url: 'posts/create'
  },
  tops: {
    method: 'get',
    url: 'sites/listTopThreads'
  },
};