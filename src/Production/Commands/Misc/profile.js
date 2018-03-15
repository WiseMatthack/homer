const Command = require('../../../Core/Structures/Command');
const DataProfile = require('../../../Core/Structures/Data/DataProfile');

class Profile extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      category: 3,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'set') {
      const profile = new DataProfile(this.client, ctx.author.id);
      await profile.getData();

      const fieldName = ctx.args[1];
      const fieldContent = ctx.args.slice(2).join(' ');
      if (!fieldName || !fieldContent) return ctx.channel.send(ctx.__('profile.error.set.notEnoughParameters', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (!this.client.constants.profileFields[fieldName]) return ctx.channel.send(ctx.__('profile.error.set.unknownField', {
        errorIcon: this.client.constants.statusEmotes.error,
        field: fieldName,
      }));

      if (fieldContent.length > 120) return ctx.channel.send(ctx.__('profile.error.set.contentTooLong', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const doesFieldExists = profile.data.fields.find(field => field.name === fieldName);
      if (doesFieldExists) profile.data.fields.splice(profile.data.fields.indexOf(doesFieldExists), 1);

      profile.data.fields.push({
        name: fieldName,
        content: fieldContent,
        emote: this.client.constants.profileFields[fieldName],
      });
      await profile.saveData();

      ctx.channel.send(ctx.__('profile.set.done', {
        successIcon: this.client.constants.statusEmotes.success,
        field: this.capitalizeFirstLetter(fieldName),
      }));
    } else if (ctx.args[0] === 'clear') {
      const profile = new DataProfile(this.client, ctx.author.id);
      await profile.getData();

      const fieldName = ctx.args[1];
      if (!fieldName) return ctx.channel.send(ctx.__('profile.error.clear.noFieldName', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (!profile.data.fields.find(field => field.name === fieldName)) return ctx.channel.send(ctx.__('profile.error.clear.unknownField', {
        errorIcon: this.client.constants.statusEmotes.error,
        field: fieldName,
      }));
      
      profile.data.fields.splice(profile.data.fields.findIndex(field => field.name === fieldName), 1);
      await profile.saveData();

      ctx.channel.send(ctx.__('profile.clear.done', {
        successIcon: this.client.constants.statusEmotes.success,
        field: this.capitalizeFirstLetter(fieldName),
      }));
    } else if (ctx.args[0] === 'list') {
      ctx.channel.send(ctx.__('profile.list', {
        fields: Object.keys(this.client.constants.profileFields).map(field => `\`${field}\``).join(' - '),
      }));
    } else if (ctx.args[0] === 'locale') {
      const locale = ctx.args[1];
      if (!locale) return ctx.channel.send(ctx.__('profile.locale.noLocale', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (!ctx.getLocales().includes(locale)) return ctx.channel.send(ctx.__('profile.locale.unknownLocale', {
        errorIcon: this.client.constants.statusEmotes.error,
        locale,
      }));

      profile.data.locale = locale;
      await profile.saveData();

      ctx.channel.send(ctx.__('profile.locale.localeSet', {
        successIcon: this.client.constants.statusEmotes.success,
        locale,
      }));
    } else {
      let member = ctx.member;
      const search = ctx.args.join(' ');
      if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
      else if (search) {
        const members = this.client.finder.findMembers(search, ctx.guild.id);
        if (members.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
        else if (members.size > 1) return ctx.channel.send(this.client.finder.formatMembers(members, ctx.settings.data.misc.locale));
        member = members.first();
      }

      const profile = new DataProfile(this.client, member.id);
      await profile.getData();

      if (profile.data.fields.length === 0) return ctx.channel.send(ctx.__('profile.noProfile', {
        errorIcon: this.client.constants.statusEmotes.error,
        name: member.user.tag,
      }));

      const fields = profile.data.fields
        .sort((a, b) => a.name > b.name)
        .map(field => `${field.emote} **${this.capitalizeFirstLetter(field.name)}**: ${field.content}`)
        .join('\n');

      ctx.channel.send(ctx.__('profile.for', {
        name: member.user.tag,
        fields,
      }));
    }
  }

  /**
   * Capitalize the first letter of a string and returns it.
   * @param {String} text String to process
   * @returns {String}
   */
  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

module.exports = Profile;
