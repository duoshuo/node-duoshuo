![duoshuo](http://ds.cdncache.org/avatar-50/205/32880.jpg) duoshuo.com apis
=========
![npm](https://badge.fury.io/js/duoshuo.png)

#### 这是什么？

这是一个多说社交评论api的包装集（node.js），简单配置后，你可以通过这个模块与多说api进行简单的通信。
这个模块在我的另外一个项目 Tesla (`npm install tesla`) 中使用到，那是一个基于社交评论的简易快速论坛系统。

#### 如何安装

使用npm安装：`npm install duoshuo`

#### 如何使用

````javascript

// 引入模块以及配置

var duoshuo = require('duoshuo');

duoshuo.config({
    short_name: 'abc', // 站点申请的多说二级域名。
    secret: 'xxx' // 站点密钥
});

// 换取sso登录的token
duoshuo.auth(code,function(token){
    console.log(token)
    // to sth with token    
});

// 将本站用户加入到我的多说评论站点中去
duoshuo.join({
    info: {},
    access_token: token // 上面换取的token
},function(user){
    console.log(user)
});

// 获取本日最多评论的文章
duoshuo.tops({
    range: 'daily' // 获取本日，详见：http://dev.duoshuo.com/docs/50398b4b8551ece011000023
    num_items: 10 // 获取10篇
},function(threads){
    console.log(threads)
});

// 发布评论到多说站点
duoshuo.comment({
    message: '我的一条新匿名评论'   
},function(comment){
    console.log(comment)
})

````