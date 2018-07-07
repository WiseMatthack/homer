const Command = require('../../structures/Command');

class OofCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'oof',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    context.reply("oof");
  }
}

module.exports = OofCommand;