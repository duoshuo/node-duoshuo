var Duoshuo = require('../index')
var duoshuo = new Duoshuo({
  short_name: 'abc', // 站点申请的多说二级域名。
  secret: 'xxx' // 站点密钥
})

// 通过 duoshuo.auth 获得的 access_token
var access_token = 'xxxxxxxxxxxxxxxxxx'

duoshuo
  .getClient(access_token)
  .get('abc/def.json')
  .then(function({ body }){
    console.log(body)
  })