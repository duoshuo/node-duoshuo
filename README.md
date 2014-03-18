![duoshuo](http://ww1.sinaimg.cn/large/61ff0de3gw1e78kmsw0q0j200z00z0si.jpg) duoshuo.com apis ![npm](https://badge.fury.io/js/duoshuo.png)
---

duoshuo.com apis for node.js

### How to install

````
$ npm install duoshuo
````

### Sample code

````javascript
var Duoshuo = require('duoshuo');

var duoshuo = new Duoshuo({
    short_name: 'abc', // 站点申请的多说二级域名。
    secret: 'xxx' // 站点密钥
});

// fetch token
duoshuo.auth(code, function(err,token){
    console.log(token)
    // to sth with token    
});

var access_token = 'xxxxxxxxxxxxxxxxxx';	// 通过duoshuo.auth获得的access_token
var duoshuoClient = duoshuo.getClient(access_token);

// join local user to duoshuo.com
duoshuoClient.join({
    user: {},
}, function(err,user){
    console.log(err,user)
});

// fetch top articles
duoshuoClient.tops({
    range: 'daily' // 获取本日，详见：http://dev.duoshuo.com/docs/50398b4b8551ece011000023
    num_items: 10 // 获取10篇
}, function(err, threads){
    console.log(threads)
});

// push comments to duoshuo.com
duoshuoClient.comment({
    message: '我的一条新匿名评论'   
}, function(err,comment){
    console.log(comment)
})

````

### Run Unit-test (Mocha)

````
$ git clone https://github.com/turingou/duoshuo.git
$ cd duoshuo
$ npm install
$ npm test
````