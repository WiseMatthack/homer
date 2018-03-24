const Command = require('../../../Core/Structures/Command');
const { exec } = require('child_process');

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      aliases: ['bash'],
      category: 0,
      private: true,
    });
  }

  async run(ctx) {
    const code = ctx.args.join(' ');
    if (!code) return ctx.channel.send(`${this.client.constants.statusEmotes.error} You must provide a code to run.`);

    exec(code, (err, stdout, stderr) => {
      if (err) return ctx.channel.send(err, { code: 'xl' });
      ctx.channel.send(`${stdout}\n${stderr}`, { code: 'xl' })
        .catch(e => ctx.channel.send(`\`\`\`${e}\`\`\``));
    });
  }
}

module.exports = Exec;
