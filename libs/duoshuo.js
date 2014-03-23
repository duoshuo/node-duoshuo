var querystring = require('querystring');
var request = require('request');
var _ = require('underscore');
var apis = require('./apis');

module.exports = Duoshuo;

function Duoshuo(config) {
  if (!config) return false;
  this.config = config;
}

/**
 *
 * Duoshuo#auth
 * 使用code换取access_token与用户ID
 *
 **/
Duoshuo.prototype.auth = function(code, callback) {
  if (!code) return callback(new Error('code required'));
  if (typeof(code) !== 'string') return callback(new Error('code must be string'));
  var query = {}
  query.json = true
  query.form = {}
  query.form.code = code
  request.post(
    'http://api.duoshuo.com/oauth2/access_token',
    query,
    function(err, response, body) {
      if (err) return callback(err);
      if (response.body.code !== 0) return callback(new Error(response.body.errorMessage));
      return callback(err, response.body);
    });
};

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
};

/**
 *
 * Duoshuo#Client
 * 构造一个Duoshuo.Client实例,
 * Duoshuo.Client用于在拥有access token的情况下访问多说接口
 **/

function res(callback) {
  return function(error, response, body) {
    if (!error) {
      callback(null, {
        stat: response.statusCode,
        response: response,
        body: body
      })
    } else {
      callback(error, {
        response: response
      })
    }
  }
}

Duoshuo.prototype.getClient = function(access_token) {
  var client = new Duoshuo.Client(access_token);
  client.short_name = this.config.short_name;
  return client;
};

Duoshuo.Client = function(access_token) {
  this.access_token = access_token;
};

Duoshuo.Client.prototype.get = function(path, data, callback) {
  var url = 'http://api.duoshuo.com/' + path + '.json';
  var params = _.extend({
    short_name: this.short_name,
    access_token: this.access_token,
  }, data);

  url += '?' + querystring.stringify(params);

  request.get(url, {
    json: true
  }, res(callback));
};

Duoshuo.Client.prototype.post = function(path, data, callback) {
  var url = 'http://api.duoshuo.com/' + path + '.json',
  var params = _.extend({
    short_name: this.short_name,
    access_token: this.access_token,
  }, data);

  request.post(url, {
    json: true,
    form: params
  }, res(callback));
};

_.each(apis, function(options, key) {
  Duoshuo.Client.prototype[key] = function(data, callback) {
    return this[options.method](options.path, data, callback);
  }
});