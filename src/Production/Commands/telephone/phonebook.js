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
    } else if (ctx.args[0] === 'flag') {
      if (!ctx.member.permissions.has('MANAGE_GUILD')) return ctx.channel.send(ctx.__('command.missingPerm.user', {
        errorIcon: this.client.constants.statusEmotes.error,
        missingPermissions: ['MANAGE_GUILD'].map(perm => `\`${perm}\``).join(', '),
      }));

      const flag = ctx.args[1];
      if (!flag) return ctx.channel.send(ctx.__('phonebook.flag.noFlag', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (flag === 'clear') {
        ctx.settings.data.phone.customFlag = null;
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('phonebook.flag.clearedFlag', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      } else {
        if (!this.client.constants.flagEmotes.includes(flag)) return ctx.channel.send(ctx.__('phonebook.flag.invalidFlag', {
          errorIcon: this.client.constants.statusEmotes.error,
          emote: flag,
        }));

        ctx.settings.data.phone.customFlag = flag;
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('phonebook.flag.setFlag', {
          successIcon: this.client.constants.statusEmotes.success,
          flag,
        }));
      }
    } else if (ctx.args[0] === 'random') {
      const numbers = await this.client.database.getDocuments('guild')
        .then(settings =>
          settings.filter(s => s.phone.number && s.phone.phonebook && s.phone.channel));

      const randomChosen = numbers[Math.floor(Math.random() * numbers.length)];
      if (!randomChosen) return ctx.channel.send(ctx.__('phonebook.error.noFound', {
        errorIcon: this.client.constants.statusEmotes.error,
        search: 'random',
      }));

      const guild = this.client.guilds.get(randomChosen.id);
      ctx.channel.send(`- **${guild.name}**: ${randomChosen.phone.number} [${ctx.getCatalog(randomChosen.misc.locale)['lang.flagEmote']}]`);
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
          .map(s => ({
            id: s.id,
            number: s.phone.number,
            customFlag: s.phone.customFlag || null,
            locale: s.misc.locale,
          })));

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
        numbersArray.push(`- **${guild.name}**: ${number.number} [${number.customFlag || ctx.getCatalog(number.locale)['lang.flagEmote']}]`);
      }

      ctx.channel.send(ctx.__('phonebook.list', {
        search,
        list: numbersArray.join('\n'),
      }));
    }
  }
}

module.exports = Phonebook;
