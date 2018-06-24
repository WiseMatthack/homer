const Command = require('../../structures/Command');
const { exec } = require('child_process');

class ExecCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      aliases: ['bash'],
      category: 'owner',
      private: true,
      dm: true,
    });
  }

  async execute(context) {
    const code = context.args.join(' ');
    if (!code) return context.replyError('You must provide a code to execute.');

    exec(code, (error, stdout, stderr) => {
      if (error) return context.replyError(`An error occured during execution!\n\`\`\`js\n${error}\`\`\``);

      let message = '';
      if (stderr) message += stderr;
      if (stdout) message += stdout;
      context.reply(message, { code: true });
    });
  }
}

module.exports = ExecCommand;
