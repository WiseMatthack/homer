const Command = require('../../../Core/Structures/Command');

class Weather extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      aliases: ['forecast'],
      category: 2,
    });
  }

  async run(ctx) {
    /* Wait until I find a REALLY nice weather/forecast service, Wunderground is so shit */
  }
}

module.exports = Weather;
