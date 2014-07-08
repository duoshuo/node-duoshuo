var duoshuo = require('../index');

var duoshuo = new Duoshuo({
  short_name: 'abc', // 站点申请的多说二级域名。
  secret: 'xxx' // 站点密钥
});

var access_token = 'xxxxxxxxxxxxxxxxxx';  // 通过duoshuo.auth获得的access_token
var duoshuoClient = duoshuo.getClient(access_token);

duoshuoClient.get('abc/def.json', {}, function(err, res, body){
  
});