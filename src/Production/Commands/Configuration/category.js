const Command = require('../../../Core/Structures/Command');

class Category extends Command {
  constructor(client) {
    super(client, {
      name: 'category',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'list') {
      const list = ctx.settings.data.disabledCategories.map(c => `\`${c}\``).join(' - ') || ctx.__('global.none');
      ctx.channel.send(ctx.__('category.list', {
        list,
      }));
    } else {
      const category = ctx.args[1];
      if (!category) return ctx.channel.send(ctx.__('category.noCategory', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (category === 'Bot' || category === 'Configuration' || category === 'Owner') return ctx.channel.send(ctx.__('category.criticCat', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const index = ctx.settings.data.disabledCategories.findIndex(c => c === category);
      if (index > -1) {
        ctx.settings.data.disabledCategories.splice(index, 1);
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('category.disabled', {
          successIcon: this.client.constants.statusEmotes.success,
          category,
        }));
      } else {
        ctx.settings.data.disabledCategories.push(category);
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('category.enabled', {
          successIcon: this.client.constants.statusEmotes.success,
          category,
        }));
      }
    }
  }
}

module.exports = Category;
