// Generated by CoffeeScript 1.7.1
(function() {
  module.exports = {
    properties: function(definition, context) {
      var new_context, property, required, schema, test, tests;
      if (!this.test_type("object", definition)) {
        throw new Error("The 'properties' attribute must be an object");
      }
      tests = {};
      required = [];
      for (property in definition) {
        schema = definition[property];
        new_context = context.child(property);
        test = this.compile(new_context, schema);
        tests[property] = test;
        if (schema.required === true) {
          required.push(property);
        }
      }
      return (function(_this) {
        return function(data, runtime) {
          var key, value, _i, _len;
          if (_this.test_type("object", data)) {
            for (property in data) {
              value = data[property];
              if ((test = tests[property]) != null) {
                test(value, runtime.child(property));
              }
            }
            for (_i = 0, _len = required.length; _i < _len; _i++) {
              key = required[_i];
              if (data[key] === void 0) {
                runtime.error(context.child(key).child("required"));
              }
            }
            return true;
          }
        };
      })(this);
    },
    dependencies: function(definition, context) {
      var dependency, fn, property, tests;
      if (!this.test_type("object", definition)) {
        throw new Error("Value of 'dependencies' must be an object");
      } else {
        tests = [];
        for (property in definition) {
          dependency = definition[property];
          if (this.test_type("string", dependency)) {
            tests.push((function(_this) {
              return function(data, runtime) {
                if ((data[property] != null) && (data[dependency] == null)) {
                  return runtime.child(property).error(context);
                }
              };
            })(this));
          } else if (this.test_type("array", dependency)) {
            tests.push((function(_this) {
              return function(data, runtime) {
                var item, _i, _len;
                if (data[property] != null) {
                  for (_i = 0, _len = dependency.length; _i < _len; _i++) {
                    item = dependency[_i];
                    if (data[item] == null) {
                      runtime.child(property).error(context);
                    }
                  }
                  return null;
                }
              };
            })(this));
          } else if (this.test_type("object", dependency)) {
            fn = this.compile(context, dependency);
            tests.push((function(_this) {
              return function(data, runtime) {
                if (data[property]) {
                  return fn(data, runtime);
                } else {
                  return true;
                }
              };
            })(this));
          } else {
            throw new Error("Invalid dependency");
          }
        }
      }
      return (function(_this) {
        return function(data, runtime) {
          var test, _i, _len;
          if (_this.test_type("object", data)) {
            for (_i = 0, _len = tests.length; _i < _len; _i++) {
              test = tests[_i];
              test(data, runtime);
            }
            return null;
          }
        };
      })(this);
    }
  };

}).call(this);
