const Command = require('../../../Core/Structures/Command');

class Phonebook extends Command {
  constructor(client) {
    super(client, {
      name: 'phonebook',
      aliases: ['numbers'],
      category: 'telephone',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'switch') {
      if (!ctx.member.permissions.has('MANAGE_GUILD')) return ctx.channel.send(ctx.__('command.missingPerm.user', {
        errorIcon: this.client.constants.statusEmotes.error,
        missingPermissions: ['MANAGE_GUILD'].map(perm => `\`${perm}\``).join(', '),
      }));

      if (ctx.settings.data.phone.phonebook) {
        ctx.settings.data.phone.phonebook = false;
        await ctx.settings.saveData();
        ctx.channel.send(ctx.__('phonebook.switch.disabled'));
      } else {
        ctx.settings.data.phone.phonebook = true;
        await ctx.settings.saveData();
        ctx.channel.send(ctx.__('phonebook.switch.enabled'));
      }
    } else if (ctx.args[0] === 'blacklist') {
      const number = ctx.args[1];
      if (!number) return ctx.channel.send(ctx.__('phonebook.blacklist.error.noNumber', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const foundGuild = await this.client.database.getDocuments('guild')
        .then(res => res.find(s => s.phone.number === number));
      if (!foundGuild) return ctx.channel.send(ctx.__('phonebook.blacklist.error.noGuild', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (ctx.settings.data.phone.blacklist.includes(foundGuild.id)) {
        ctx.settings.data.phone.blacklist.splice(
          ctx.settings.data.phone.blacklist.indexOf(foundGuild.id),
          1,
        );
        await ctx.settings.saveData();
        ctx.channel.send(ctx.__('phonebook.blacklist.removed', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      } else {
        ctx.settings.data.phone.blacklist.push(foundGuild.id);
        await ctx.settings.saveData();
        ctx.channel.send(ctx.__('phonebook.blacklist.added', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      }
    } else {
      const search = ctx.args.join(' ');
      if (!search) return ctx.channel.send(ctx.__('phonebook.error.noSearch', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const numbers = await this.client.database.getDocuments('guild')
        .then(settings => settings
          .filter(s => s.phone.number && s.phone.phonebook &&
            (s.phone.number.includes(search) ||
            this.client.guilds.get(s.id).name.toLowerCase().includes(search.toLowerCase())))
          .map(s => ({ id: s.id, number: s.phone.number })));

      if (numbers.length === 0) return ctx.channel.send(ctx.__('phonebook.error.noFound', {
        errorIcon: this.client.constants.statusEmotes.error,
        search,
      }));

      const numbersArray = [];
      for (let i = 0; i < numbers.length; i += 1) {
        if (i > 9) {
          numbersArray.push(ctx.__('phonebook.moreEntries', {
            count: (numbers.length - i) + 1,
          }));
          break;
        }

        const number = numbers[i];
        const guild = this.client.guilds.get(number.id);
        const guildLocale = await this.client.database.getDocument('guild', guild.id).then(g => g.misc.locale);
        numbersArray.push(`- **${guild.name}**: ${number.number} [${ctx.getCatalog(guildLocale)['lang.flagEmote']}]`);
      }

      ctx.channel.send(ctx.__('phonebook.list', {
        search,
        list: numbersArray.join('\n'),
      }));
    }
  }
}

module.exports = Phonebook;
