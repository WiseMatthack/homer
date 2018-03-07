const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

class Weather extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      aliases: ['forecast'],
      category: 2,
    });
  }

  async run(ctx) {
    const location = ctx.args.join(' ');
    if (!location || location.length > 64) return ctx.channel.send(ctx.__('weather.invalidLocation', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const query = encodeURIComponent(location);
    snekfetch
      .get(`https://api.apixu.com/v1/current.json?key=${this.client.config.api.weather}&q=${query}&lang=${ctx.settings.data.misc.locale.split('-')[0]}`)
      .then((response) => {
        const parsed = response.body;

        const embed = new RichEmbed()
          .addField(ctx.__('weather.embed.weather.title'), ctx.__('weather.embed.weather.value', {
            text: parsed.current.condition.text,
          }), true)
          .addField(ctx.__('weather.embed.temperatures.title'), ctx.__('weather.embed.temperatures.value', {
            realC: parsed.current.temp_c,
            realF: parsed.current.temp_f,
            feelsC: parsed.current.feelslike_c,
            feelsF: parsed.current.feelslike_f,
          }), true)
          .addField(ctx.__('weather.embed.wind.title'), ctx.__('weather.embed.wind.value', {
            speedKph: parsed.current.wind_kph,
            speedMph: parsed.current.wind_mph,
            dir: parsed.current.wind_dir,
            angle: parsed.current.wind_degree,
          }), true)
          .addField(ctx.__('weather.embed.misc.title'), ctx.__('weather.embed.misc.value', {
            precipMm: parsed.current.precip_mm,
            precipIn: parsed.current.precip_in,
            humidity: parsed.current.humidity,
            nebulosity: parsed.current.cloud,
          }), true)
          .setThumbnail(`https:${parsed.current.condition.icon}`)
          .setFooter(ctx.__('weather.embed.footer'), `http://${this.client.config.dashboard.baseDomain}/images/services/apixu.png`)
          .setTimestamp(new Date(Number(`${parsed.current.last_updated_epoch}000`)))
          .setColor(ctx.guild.me.displayHexColor);

        ctx.channel.send(ctx.__('weather.title', {
          city: parsed.location.name,
          region: parsed.location.region || ctx.__('global.unknown'),
          country: parsed.location.country || ctx.__('global.unknown'),
        }), { embed });
      })
      .catch((response) => {
        const parsed = response.body;

        if (parsed.error.code === 1006) {
          ctx.channel.send(ctx.__('weather.notFound', {
            errorIcon: this.client.constants.statusEmotes.error,
            location,
          }));
        } else {
          ctx.channel.send(ctx.__('weather.error', {
            errorIcon: this.client.constants.statusEmotes.error,
            code: parsed.error.code,
            message: parsed.error.message,
          }));
          
          console.error(`[Weather] An error has occured! Code: ${parsed.error.code} - Message: ${parsed.error.message}`);
        }
      });
  }
}

module.exports = Weather;
