const TagFunction = require('../../Core/Structures/TagFunction');

class RandFunction extends TagFunction {
  run(args) {
    if (!args[0]) throw new Error('You must provide something to look at for (user|online)!');

    if (args[0] === 'user') {
      return this.client.users.random().username;
    } else if (args[0] === 'online') {
      return this.client.users.filter(u => u.presence.status === 'online').random().username;
    }

    throw new Error(`Unrecognized option "${args[0]}".`);
  }
}

module.exports = RandFunction;
