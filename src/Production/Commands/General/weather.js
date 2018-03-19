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
    const locationData = await snekfetch.get(`https://api.opencagedata.com/geocode/v1/json?key=${this.client.config.api.openCageData}&q=${query}&language=${ctx.settings.data.misc.locale.split('-')[0]}&limit=1&no_annotations=1`)
      .then(res => res.body.results[0])
      .catch(() => null);

    if (!locationData) return ctx.channel.send(ctx.__('weather.notFound', {
      errorIcon: this.client.constants.statusEmotes.error,
      location,
    }));
    // https://api.darksky.net/forecast/ec7c115a73a71008e8bf7eb1e32984ee/37.8267,-122.4233?exclude=minutely,hourly,daily,alerts,flags&lang=fr&units=si
    const weatherData = await snekfetch.get(`https://api.darksky.net/forecast/${this.client.config.api.darkSky}/${locationData.geometry.lat},${locationData.geometry.lng}?exclude=minutely,hourly,daily,alerts,flags&lang=fr&units=si`)
      .then(res => res.body)
      .catch(() => null);

    const embed = new RichEmbed()
      .addField(ctx.__('weather.embed.weather.title'), ctx.__('weather.embed.weather.value', {
        text: weatherData.currently.summary,
      }), true)
      .addField(ctx.__('weather.embed.temperatures.title'), ctx.__('weather.embed.temperatures.value', {
        realC: Math.floor(weatherData.currently.temperature),
        realF: Math.floor(weatherData.currently.temperature * 1.8 + 32),
        feelsC: Math.floor(weatherData.currently.apparentTemperature),
        feelsF: Math.floor(weatherData.currently.apparentTemperature * 1.8 + 32),
      }), true)
      .addField(ctx.__('weather.embed.wind.title'), ctx.__('weather.embed.wind.value', {
        speedKph: Math.floor(weatherData.currently.windSpeed),
        speedMph: Math.floor(weatherData.currently.windSpeed / 1.609),
        dir: this.getDirection(weatherData.currently.windBearing),
        angle: weatherData.currently.windBearing,
      }), true)
      .addField(ctx.__('weather.embed.misc.title'), ctx.__('weather.embed.misc.value', {
        humidity: weatherData.currently.humidity * 100,
        nebulosity: weatherData.currently.cloudCover * 100,
      }), true)
      .setThumbnail(`https://${this.client.config.dashboard.baseDomain}/images/services/weather_icons/${weatherData.currently.icon}.png`)
      .setFooter(ctx.__('weather.embed.footer'), `https://${this.client.config.dashboard.baseDomain}/images/services/darksky.png`)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('weather.title', {
      city: locationData.components.city,
      region: locationData.components.state || ctx.__('global.unknown'),
      country: locationData.components.country || ctx.__('global.unknown'),
    }), { embed });
  }

  /**
   * Transforms the wind direction in degrees in a human readable format
   * @param {Number} angle 
   * @returns {String} Direction
   */
  getDirection(angle) {
    const arrayIndex = Number((angle / 22.5) + 0.5)
    const windArray = ['N','NNE','NE','ENE','E','ESE', 'SE', 'SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return windArray[arrayIndex % 16];
  }
}

module.exports = Weather;
