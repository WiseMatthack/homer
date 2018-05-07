const TagFunction = require('../../Core/Structures/TagFunction');

class HashFunction extends TagFunction {
  run(args) {
    const algorithm = args[0];
    const text = args[1];
    if (!algorithm || !text) return 'Missing algorithm or text! Correct syntax: {hash:algorithm|text}';

    try {
      const hasherModule = require(`crypto-js/${algorithm}`);
      return hasherModule(text);
    } catch (e) {
      return 'Unrecognized algorithm! Please choose one in this list: <https://github.com/brix/crypto-js#list-of-modules> (2nd part)';
    }
  }
}

module.exports = HashFunction;
