const TagFunction = require('../../Core/Structures/TagFunction');

class ArgFunction extends TagFunction {
  run(args) {
    if (!args[0]) throw new Error('You must provide a zero-based index (number).');
    if (Number.isNaN(parseInt(args[0], 10))) throw new Error('The provided argument is not a number!');
    return this.context.args[args[0]];
  }
}

module.exports = ArgFunction;
