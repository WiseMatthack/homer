const TagFunction = require('../../Core/Structures/TagFunction');

class RangeFunction extends TagFunction {
  constructor(client, context, contextType) {
    super(client, context, contextType);
  }

  run(args) {
    if (args.length !== 2) throw new Error('You must provide 2 numbers.');
    if (isNaN(args[0]) || isNaN(args[1])) throw new Error('The 2 arguments must be numbers.');
    if ((args[0] > args[1]) || args[0] < -1000000000 || args[1] > 1000000000) throw new Error('The first number must be less than the second one and they must not exceed (-)10^^8.');
    
    return Math.floor(Math.random() * (args[1] - args[0] + 1) + args[0]);
  }
}

module.exports = RangeFunction;
