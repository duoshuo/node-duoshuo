/**
 *
 * 接口参数请参考官方文档
 * http://dev.duoshuo.com/docs
 *
 **/

module.exports = {
  userProfile: {
    method: 'get',
    path: 'users/profile'
  },
  join: {
    method: 'post',
    path: 'sites/join'
  },
  threads: {
    method: 'get',
    path: 'threads/counts'
  },
  comment: {
    method: 'post',
    path: 'posts/create'
  },
  tops: {
    method: 'get',
    path: 'sites/listTopThreads'
  },
};