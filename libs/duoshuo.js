import SDK from 'sdk'
import Promise from 'bluebird'
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
   * 使用code换取access_token与用户ID
   *
   **/
  auth(code) {
    return new Promise((res, rej) => {
      if (!code)
        return rej(new Error('Code is required'))

      const query = {
        form: {
          code,
          client_id: this.config.short_name
        }
      }

      this.sdk.token(query, (err, ret) => {
        if (err)
          return rej(err)

        return res(ret)
      })
    })
  }

  /**
   *
   * Duoshuo#signin()
   * Signin middleware: express/connect等框架可直接使用此middleware
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
    // init build-in method
    ['get','post','put','delete'].forEach((buildInMethod) => {
      this[buildInMethod] = (url, params, callback) => {
        let data = params

        if (buildInMethod === 'post') {
          if (!data.form) 
            data.form = {}

          data.form.access_token = this.access_token
        }

        if (buildInMethod === 'get') {
          if (!data.qs) 
            data.qs = {}

          data.qs.access_token = this.access_token
        }

        return sdk[buildInMethod](url, data, callback)
      }
    })

    // init custom api and inject `access_token`
    Object.keys(apis).forEach(key => {
      if (key === 'token') 
        return

      this[key] = (params, callback) => {
        let method = apis[key].method
        let data = {}

        if (method === 'post') {
          data.form = params.form || params
          data.form.access_token = this.access_token
        }

        if (method === 'get') {
          data.qs = params.qs || params
          data.qs.access_token = this.access_token
        }

        return sdk[key](data, callback)
      }
    })
  }
}
