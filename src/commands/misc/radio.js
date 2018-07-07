const Command = require('../../structures/Command');
const Menu = require('../../structures/Menu');

class RadioCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'radio',
      category: 'misc',
      children: [new ListSubcommand(client)],
    });
  }

  async execute(context) {
    context.reply(context.__('radio.hub', { prefix: this.client.prefix }));
  }
}

class ListSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list',
      category: 'misc',
    });
  }

  async execute(context) {
    const radios = await this.client.database.getDocuments('radios');
    if (radios.length === 0) return context.replyWarning(context.__('radio.list.noRadio'));

    const menu = new Menu(
      context,
      radios.map(r => `\`${r.id}\`: ${r.emote} **[${r.name}](${r.website})** - ${r.language} (${r.country}) - ${context.__(`radio.types.${r.type}`)}`),
    );

    menu.send(context.__('radio.list.title', { name: this.client.user.username }));
  }
}

module.exports = RadioCommand;
