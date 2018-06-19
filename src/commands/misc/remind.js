const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class RemindCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remind',
      aliases: ['reminder', 'remindme'],
      category: 'misc',
      usage: '<duration> <text>',
      children: [new ListSubcommand(client), new DeleteSubcommand(client)],
      dm: true,
    });
  }

  async execute(context) {
    const process = Array.from(context.args);
    let time = 0;
    let text = '';

    for (let i = 0; i < process.length; i += 1) {
      const duration = this.client.time.parseDuration(process[i], context.settings.misc.locale);
      if (duration > 0) time += duration;
      else text += ` ${process[i]}`;
    }

    if (time === 0) return context.replyError(context.__('remind.noDuration'));
    else if (time < 60000) time = 60000;
    if (text.length === 0) return context.replyError(context.__('remind.noText'));
    else if (text.length > 128) return context.replyWarning(context.__('remind.textTooLong'));

    const start = Date.now();
    const end = (Date.now() + time);
    const id = (Math.random().toFixed(4).toString().substring(2));
    await this.client.database.insertDocument(
      'jobs',
      {
        id,
        start,
        duration: time,
        end,
        user: context.message.author.id,
        type: 'remind',
        text: text.trim(),
      },
    );

    context.reply(context.__('remind.set', {
      id,
      expire: this.client.time.timeSince(end, context.settings.misc.locale),
    }));
  }
}

class ListSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const jobs = await this.client.database.getDocuments('jobs')
      .then(jobs => jobs.filter(j => j.type === 'remind' && j.user === context.message.author.id));
    if (jobs.length === 0) return context.replyWarning(context.__('remind.list.noActiveRemind'));

    const listInformation = jobs.map((job) => {
      const timeExpire = this.client.time.timeSince(job.end, context.settings.misc.locale, true);
      return `${this.dot} \`${job.id}\`: ${job.text} • ${context.__('remind.list.expireIn', { time: timeExpire })}`;
    }).join('\n');

    const embed = new RichEmbed()
      .setDescription(listInformation);

    context.reply(
      context.__('remind.list.title', { name: `**${context.message.author.username}**#${context.message.author.discriminator}` }),
      { embed },
    );
  }
}

class DeleteSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delete',
      aliases: ['remove'],
      category: 'misc',
      usage: '<ID>',
      dm: true,
    });
  }

  async execute(context) {
    const id = context.args[0];
    if (!id) return context.replyError(context.__('remind.delete.noID'));

    const job = await this.client.database.getDocument('jobs', id);
    if (!job || job.type !== 'remind') return context.replyWarning(context.__('remind.delete.notFound', { id }));

    await this.client.database.deleteDocument('jobs', job.id);
    context.replySuccess(context.__('remind.delete.removed', { id }));
  }
}

module.exports = RemindCommand;
