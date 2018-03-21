const TagFunction = require('../../Core/Structures/TagFunction');

class RandFunction extends TagFunction {
  constructor(client, context, contextType) {
    super(client, context, contextType);
  }

  run(args) {
    if (!args[0]) throw new Error('You must provide something to look at for (user|online)!');

    if (args[0] === 'user') {
      return this.client.users.random().username;
    } else if (args[0] === 'online') {
      return this.client.users.filter(u => u.presence.status === 'online').random().username;
    } else {
      throw new Error(`Unrecognized option "${args[0]}".`);
    }
  }
}

module.exports = RandFunction;
