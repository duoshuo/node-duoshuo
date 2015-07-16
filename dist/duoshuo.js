'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sdk = require('sdk');

var _sdk2 = _interopRequireDefault(_sdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _apis = require('./apis');

var _apis2 = _interopRequireDefault(_apis);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var Duoshuo = (function () {
  function Duoshuo(config) {
    _classCallCheck(this, Duoshuo);

    if (!config.short_name) return;

    this.config = config;
    this.host = 'api.duoshuo.com';
    this.sdk = new _sdk2['default']('https://' + this.host, _apis2['default'], (0, _rules2['default'])(config));
  }

  _createClass(Duoshuo, [{
    key: 'auth',

    /**
     *
     * Duoshuo#auth
     * 使用code换取access_token与用户ID
     *
     **/
    value: function auth(code) {
      var _this = this;

      return new _bluebird2['default'](function (res, rej) {
        if (!code) return rej(new Error('Code is required'));

        var query = {
          form: {
            code: code,
            client_id: _this.config.short_name
          }
        };

        _this.sdk.token(query, function (err, ret) {
          if (err) return rej(err);

          return res(ret);
        });
      });
    }
  }, {
    key: 'signin',

    /**
     *
     * Duoshuo#signin()
     * Signin middleware: express/connect等框架可直接使用此middleware
     *
     **/
    value: function signin() {
      var _this2 = this;

      return function (req, res, next) {
        _this2.auth(req.query.code).then(function (result) {
          res.locals.duoshuo = result;
          return next();
        })['catch'](next);
      };
    }
  }, {
    key: 'getClient',

    /**
     *
     * Duoshuo#getClient
     * 获取一个 duoshuoClient 实例
     *
     **/
    value: function getClient(access_token) {
      if (!access_token) return;

      return new duoshuoClient(this.sdk, access_token);
    }
  }]);

  return Duoshuo;
})();

exports['default'] = Duoshuo;

/**
 *
 * duoshuoClient
 * 构造一个 duoshuoClient 实例,
 * duoshuoClient 用于在拥有 `access_token` 的情况下访问多说接口
 **/

var duoshuoClient = (function () {
  function duoshuoClient(sdk, access_token) {
    _classCallCheck(this, duoshuoClient);

    this.access_token = access_token;
    this.init(sdk);
  }

  _createClass(duoshuoClient, [{
    key: 'init',
    value: function init(sdk) {
      var _this3 = this;

      // init build-in method
      ['get', 'post', 'put', 'delete'].forEach(function (buildInMethod) {
        _this3[buildInMethod] = function (url, params, callback) {
          var data = params;

          if (buildInMethod === 'post') {
            if (!data.form) data.form = {};

            data.form.access_token = _this3.access_token;
          }

          if (buildInMethod === 'get') {
            if (!data.qs) data.qs = {};

            data.qs.access_token = _this3.access_token;
          }

          return sdk[buildInMethod](url, data, callback);
        };
      });

      // init custom api and inject `access_token`
      Object.keys(_apis2['default']).forEach(function (key) {
        if (key === 'token') return;

        _this3[key] = function (params, callback) {
          var method = _apis2['default'][key].method;
          var data = {};

          if (method === 'post') {
            data.form = params.form || params;
            data.form.access_token = _this3.access_token;
          }

          if (method === 'get') {
            data.qs = params.qs || params;
            data.qs.access_token = _this3.access_token;
          }

          return sdk[key](data, callback);
        };
      });
    }
  }]);

  return duoshuoClient;
})();

module.exports = exports['default'];
//# sourceMappingURL=duoshuo.js.map