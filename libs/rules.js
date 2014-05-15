module.exports = function(configs) {
  var short_name = config.short_name;
  return {
    get: {
      qs: {
        short_name: short_name
      }
    },
    post: {
      form: {
        short_name: short_name
      }
    }
  };
}