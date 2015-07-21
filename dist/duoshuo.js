'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sdk = require('sdk');

var _sdk2 = _interopRequireDefault(_sdk);

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
     * 使用 `code` 换取 `access_token` 与用户 ID
     *
     **/
    value: function auth(code) {
      var query = {
        form: {
          code: code,
          client_id: this.config.short_name
        }
      };

      return this.sdk.token(query);
    }
  }, {
    key: 'signin',

    /**
     *
     * Duoshuo#signin()
     * Signin middleware: `Express/Connect` 等框架可直接使用此 middleware
     *
     **/
    value: function signin() {
      var _this = this;

      return function (req, res, next) {
        _this.auth(req.query.code).then(function (result) {
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
      var _this2 = this;

      // Init build-in method
      ['get', 'post', 'put', 'delete'].forEach(function (method) {
        _this2[method] = function (url, params) {
          var data = params;
          var key = ({
            'get': 'qs',
            'post': 'form'
          })[method];

          if (!key) key = {};

          key.access_token = _this2.access_token;

          // Todo: rewrited to return a Promise
          return sdk[method](url, data);
        };
      });

      // Init custom api and inject `access_token`
      Object.keys(_apis2['default']).forEach(function (key) {
        if (key === 'token') return;

        _this2[key] = function (params) {
          var method = _apis2['default'][key].method;
          var data = {};
          var qsKey = ({
            'get': 'qs',
            'post': 'form'
          })[method];

          data[qsKey] = params[qsKey] || params;
          data[qsKey].access_token = _this2.access_token;

          return sdk[key](data);
        };
      });
    }
  }]);

  return duoshuoClient;
})();

module.exports = exports['default'];
//# sourceMappingURL=duoshuo.js.map