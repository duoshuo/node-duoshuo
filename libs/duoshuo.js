var SDK = require('sdk');
var apis = require('./apis');
var rules = require('./rules');

module.exports = Duoshuo;

function Duoshuo(config) {
  if (!config) return false;
  if (!config.short_name) return false;
  this.config = config;
  this.sdk = new SDK('http://api.duoshuo.com', apis, rules(config));
}

/**
 *
 * Duoshuo#auth
 * 使用code换取access_token与用户ID
 *
 **/
Duoshuo.prototype.auth = function(code, callback) {
  if (!code) return callback(new Error('code is required'));
  if (typeof(code) !== 'string') return callback(new Error('code must be string'));
  if (!callback || typeof(callback) !== 'function') return callback(new Error('callback is required'));
  var query = {};
  query.form = {}
  query.form.code = code;
  return this.sdk.token(query, callback);
}

/**
 *
 * Duoshuo#signin()
 * Signin middleware: express/connect等框架可直接使用此middleware
 *
 **/
Duoshuo.prototype.signin = function() {
  var self = this;
  return function(req, res, next) {
    self.auth(req.query.code, function(err, result) {
      if (err) return next(err);
      res.locals.duoshuo = result;
      return next();
    });
  }
}

/**
 *
 * Duoshuo#getClient
 * 获取一个Duoshuo.Client实例
 *
 **/
Duoshuo.prototype.getClient = function(access_token) {
  if (!access_token) return false;
  return new Duoshuo.Client(this.sdk, access_token);
};

/**
 *
 * Duoshuo#Client
 * 构造一个Duoshuo.Client实例,
 * Duoshuo.Client用于在拥有access token的情况下访问多说接口
 **/
Duoshuo.Client = function(sdk, access_token) {
  this.access_token = access_token;
  this.init(sdk);
};

Duoshuo.Client.prototype.init = function(sdk) {
  var self = this;
  Object.keys(apis).forEach(function(key) {
    if (key === 'token') return false;
    self[key] = function(params, callback) {
      var method = apis[key].method;
      var data = params || {};
      if (method === 'post') {
        if (!data.form) data.form = {}
        data.form.access_token = self.access_token;
      }
      if (method === 'get') {
        if (!data.qs) data.qs = {}
        data.qs.access_token = self.access_token;
      }
      return sdk[key](data, callback);
    }
  });
}