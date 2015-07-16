"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var short_name = _ref.short_name;

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
};

module.exports = exports["default"];
//# sourceMappingURL=rules.js.map