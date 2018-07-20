const Command = require('../../structures/Command');

class RebootCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      category: 'owner',
      private: true,
      dm: true,
    });
  }

  async execute(context) {
  }
}

module.exports = RebootCommand;
