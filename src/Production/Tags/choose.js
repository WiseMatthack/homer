const TagFunction = require('../../Core/Structures/TagFunction');

class ChooseFunction extends TagFunction {
  constructor(client, context, contextType) {
    super(client, context, contextType);
  }

  run(args) {
    if (args.length < 2) throw new Error('You must provide at least 2 arguments to run the "choose" function.');
    return args[Math.floor(Math.random() * args.length)];
  }
}

module.exports = ChooseFunction;
