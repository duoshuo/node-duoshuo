import SDK from 'sdk'
import apis from './apis'
import rules from './rules'

export default class Duoshuo {
  constructor(config) {
    if (!config.short_name) 
      return

    this.config = config
    this.host = 'api.duoshuo.com'
    this.sdk = new SDK(`https://${ this.host }`, apis, rules(config))
  }

  /**
   *
   * Duoshuo#auth
   * 使用 `code` 换取 `access_token` 与用户 ID
   *
   **/
  auth(code) {
    const query = {
      form: {
        code,
        client_id: this.config.short_name
      }
    }

    return this.sdk.token(query)
  }

  /**
   *
   * Duoshuo#signin()
   * Signin middleware: `Express/Connect` 等框架可直接使用此 middleware
   *
   **/
  signin() {
    return (req, res, next) => {
      this
        .auth(req.query.code)
        .then(result => {
          res.locals.duoshuo = result
          return next()
        })
        .catch(next)
    }
  }

  /**
   *
   * Duoshuo#getClient
   * 获取一个 duoshuoClient 实例
   *
   **/
  getClient(access_token) {
    if (!access_token) 
      return

    return new duoshuoClient(this.sdk, access_token)
  }
}

/**
 *
 * duoshuoClient
 * 构造一个 duoshuoClient 实例,
 * duoshuoClient 用于在拥有 `access_token` 的情况下访问多说接口
 **/
class duoshuoClient {
  constructor(sdk, access_token) {
    this.access_token = access_token
    this.init(sdk)
  }

  init(sdk) {
    // Init build-in method
    ['get','post','put','delete'].forEach(method => {
      this[method] = (url, params) => {
        let data = params
        let key = {
          'get': 'qs',
          'post': 'form'
        }[method]

        if (!key)
          key = {}

        key.access_token = this.access_token

        // Todo: rewrited to return a Promise
        return sdk[method](url, data)
      }
    })

    // Init custom api and inject `access_token`
    Object.keys(apis).forEach(key => {
      if (key === 'token') 
        return

      this[key] = params => {
        let method = apis[key].method
        let data = {}
        let qsKey = {
          'get': 'qs',
          'post': 'form'
        }[method]

        data[qsKey] = params[qsKey] || params
        data[qsKey].access_token = this.access_token

        return sdk[key](data)
      }
    })
  }
}
