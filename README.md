![duoshuo](http://ww1.sinaimg.cn/large/61ff0de3gw1e78kmsw0q0j200z00z0si.jpg) duoshuo.com apis ![npm](https://badge.fury.io/js/duoshuo.png)
---

duoshuo.com apis for node.js

### How to install

````
$ npm install duoshuo
````

### Sample code

````javascript
var duoshuo = require('duoshuo');

// configs
duoshuo.config({
    short_name: 'abc', // 站点申请的多说二级域名。
    secret: 'xxx' // 站点密钥
});

// read configs
var config = duoshuo.config();

// fetch token
duoshuo.auth(code,function(token){
    console.log(token)
    // to sth with token    
});

// join local user to duoshuo.com
duoshuo.join({
    info: {},
    access_token: token // user token
},function(user){
    console.log(user)
});

// fetch top articles
duoshuo.tops({
    range: 'daily' // 获取本日，详见：http://dev.duoshuo.com/docs/50398b4b8551ece011000023
    num_items: 10 // 获取10篇
},function(threads){
    console.log(threads)
});

// push comments to duoshuo.com
duoshuo.comment({
    message: '我的一条新匿名评论'   
},function(comment){
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