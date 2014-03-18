var querystring = require('querystring'),
	_ = require('underscore'),
	request = require('request');

var Duoshuo = function(config) {
    if (!config) return false;
    this.config = config;
};

/**
 * 使用code换取access_token与用户ID
 */
Duoshuo.prototype.auth = function(code, callback) {
    if (!code)
    	return callback(new Error('code required'));
    if (typeof(code) !== 'string')
    	return callback(new Error('code must be string'));
    
    request.post('http://api.duoshuo.com/oauth2/access_token', {
	    	form : {code: code},
	    	json : true
	    }, function(err, response, body){
	        if (err)
	        	return callback(err);
	        
	        if (response.body.code !== 0)
	        	return callback(new Error(response.body.errorMessage));
	        
	        return callback(err, response.body);
	    });
};


/**
 * signin middleware
 * express/connect等框架可直接使用此middleware
 */
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

Duoshuo.prototype.getClient = function(access_token){
	var client = new Duoshuo.Client(access_token);
	client.short_name = this.config.short_name;
	
	return client;
};

/**
 * 构造一个Duoshuo.Client实例
 * Duoshuo.Client用于在拥有access token的情况下访问多说接口
 */
Duoshuo.Client = function(access_token){
	this.access_token = access_token;
};

var res = function(cb){
	return function(error, response, body){ 
	    if (!error) {
	        cb(null, {
	            stat: response.statusCode,
	            response: response,
	            body: body
	        });
	    } else {
	        cb(error, {
	            response: response
	        });
	    }
	};
};

Duoshuo.Client.prototype.get = function(path, data, callback){
	var url = 'http://api.duoshuo.com/' + path + '.json';
		params = _.extend({
			short_name	: this.short_name,
			access_token: this.access_token,
		}, data);
	
	url += '?' + querystring.stringify(params);
	
	request.get(url, {json : true}, res(callback));
};

Duoshuo.Client.prototype.post = function(path, data, callback){
	var url = 'http://api.duoshuo.com/' + path + '.json',
		params = _.extend({
			short_name	: this.short_name,
			access_token: this.access_token,
		}, data);
	
	request.post(url, {json : true, form:params}, res(callback));
};

/**
 * 接口参数请参考官方文档
 * @see http://dev.duoshuo.com/docs
 */
var apiList = {
	userProfile : {method : 'get', path : 'users/profile'},
	join	: {	method : 'post', path : 'sites/join'},
	threads	: { method : 'get', path : 'threads/counts'},
	comment	: {	method : 'post', path : 'posts/create'}, 
	tops	: { method : 'get', path : 'sites/listTopThreads'},
};

_.each(apiList, function(options, key){
	Duoshuo.Client.prototype[key] = function(data, callback){
		return this[options.method](options.path, data, callback);
	}
});

module.exports = Duoshuo;
