const Command = require('../../structures/Command');
const Menu = require('../../structures/Menu');

class PhblacklistCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'phblacklist',
      category: 'telephone',
      dm: true,
    });
  }

  async execute(context) {
    const subscription = await this.client.database.getDocument('telephone', context.message.channel.id);
    if (!subscription) return context.replyWarning(context.__('telephone.noSubscription', { command: `${this.client.prefix}telephone subscribe` }));
    if (subscription.blacklist.length === 0) return context.replyWarning(context.__('phblacklist.noEntry'));

    const menu = new Menu(
      context,
      subscription.blacklist.map(a => `${this.dot} **${a.number}**`),
    );

    menu.send(context.__('phblacklist.title', {
      name: context.message.guild ? `**#${context.message.channel.name}**` : `**${context.__('global.dm')}**`,
    }));
  }
}

class AddSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add',
      usage: '<number>',
      category: 'telephone',
      dm: true,
    });
  }

  async execute(context) {
    const subscription = await this.client.database.getDocument('telephone', context.message.channel.id);
    if (!subscription) return context.replyWarning(context.__('telephone.noSubscription', { command: `${this.client.prefix}telephone subscribe` }));

    const number = context.args[0];
    if (!number) return context.replyError(context.__('phblacklist.add.noNumber'));

    const toSubscription = await this.client.database.findDocuments('telephone', { number }).then(a => a[0]);
    if (!toSubscription) return context.replyWarning(context.__('phblacklist.add.notFound', { number }));

  }
}

module.exports = PhblacklistCommand;
