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
      let message = '';
      if (error) message += error;
      if (stdout) message += stdout;
      if (stderr) message += stderr;
      context.reply(message, { code: true });
    });
  }
}

module.exports = ExecCommand;
