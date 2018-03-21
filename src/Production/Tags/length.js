const TagFunction = require('../../Core/Structures/TagFunction');

class LengthFunction extends TagFunction {
  constructor(client, context, contextType) {
    super(client, context, contextType);
  }

  run(args) {
    return args.join(' ').length;
  }
}

module.exports = LengthFunction;
