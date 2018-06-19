const Command = require('../../structures/Command');
const Menu = require('../../structures/Menu');

class PhonebookCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'phonebook',
      category: 'telephone',
      usage: '[number]',
      dm: true,
    });
  }

  async execute(context) {
    const collator = new Intl.Collator(context.settings.misc.locale, { numeric: true, sensitivity: 'base' });

    const number = context.args[0];
    const numbers = await this.client.database.getDocuments('telephone')
      .then(lines => lines
        .filter(l => l.phonebook && l.number.includes(number || l.number))
        .sort((a, b) => collator.compare(b, a)));

    if (numbers.length === 0) return context.replyWarning(context.__('phonebook.notFound'));

    const menu = new Menu(
      context,
      numbers.map(e => `${this.dot} **${e.number}**: ${e.phonebook}`),
    );

    menu.send(context.__('phonebook.title'));
  }
}

module.exports = PhonebookCommand;
