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
    const search = context.args.join(' ');
    const numbers = await this.client.database.getDocuments('telephone')
      .then(lines => lines
        .filter(l => l.phonebook && (l.number.includes(search || l.number) || l.phonebook.toLowerCase().includes(search.toLowerCase())))
        .sort((a, b) => a.number === 'SUPPORT' ? 1 : parseInt(a.number.replace('-', '')) - parseInt(b.number.replace('-', ''))));

    if (numbers.length === 0) return context.replyWarning(context.__('phonebook.notFound'));

    const menu = new Menu(
      context,
      numbers.map(e => `${this.dot} **${e.number}**: ${e.phonebook}`),
    );

    menu.send(context.__('phonebook.title'));
  }
}

module.exports = PhonebookCommand;
