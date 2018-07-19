const Command = require('../../structures/Command');

class MaintenanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'maintenance',
      category: 'owner',
      private: true,
      dm: true,
    });
  }

  async execute(context) {
    if (this.client.maintenance) {
      this.client.maintenance = false;
      context.replySuccess('Maintenance mode disabled successfully!');
    } else {
      this.client.maintenance = true;
      context.replySuccess('Maintenance mode enabled successfully!');
    }
  }
}

module.exports = ExecCommand;
