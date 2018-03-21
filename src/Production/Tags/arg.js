const TagFunction = require('../../Core/Structures/TagFunction');

class ArgFunction extends TagFunction {
  constructor(client, context, contextType) {
    super(client, context, contextType);
  }

  run(args) {
    if (!args[0]) throw new Error('You must provide a zero-based index (number).');
    if (isNaN(args[0])) throw new Error('The provided argument is not a number!');
    return this.context.args[args[0]];
  }
}

module.exports = ArgFunction;
