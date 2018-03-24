const TagFunction = require('../../Core/Structures/TagFunction');

class LengthFunction extends TagFunction {
  run(args) {
    return args.join(' ').length;
  }
}

module.exports = LengthFunction;
