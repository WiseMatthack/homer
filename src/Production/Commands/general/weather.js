const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const mtz = require('moment-timezone');

class Weather extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      aliases: ['forecast'],
      category: 'general',
    });
  }

  async run(ctx) {
    const location = ctx.args.join(' ');
    if (!location || location.length > 64) return ctx.channel.send(ctx.__('weather.invalidLocation', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const query = encodeURIComponent(location);
    const locationData = await snekfetch.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.client.config.api.googleGeocode}&address=${query}&language=${ctx.settings.data.misc.locale.split('-')[0]}`)
      .then((res) => {
        const parsed = res.body;
        if (parsed.results.length === 0) return null;

        const foundLoc = parsed.results[0];
        return ({
          city: foundLoc.address_components.find(c => c.types.includes('locality')) || null,
          department: foundLoc.address_components.find(c => c.types.includes('administrative_area_level_2')) || null,
          region: foundLoc.address_components.find(c => c.types.includes('administrative_area_level_1')) || null,
          country: foundLoc.address_components.find(c => c.types.includes('country')) || null,
          postalcode: foundLoc.address_components.find(c => c.types.includes('postal_code')) || null,
          geometry: `${foundLoc.geometry.location.lat},${foundLoc.geometry.location.lng}`,
        });
      })
      .catch(() => null);

    if (!locationData) return ctx.channel.send(ctx.__('weather.notFound', {
      errorIcon: this.client.constants.statusEmotes.error,
      location,
    }));

    const weatherData = await snekfetch.get(`https://api.darksky.net/forecast/${this.client.config.api.darkSky}/${locationData.geometry}?exclude=minutely,hourly,daily,alerts,flags&lang=${ctx.settings.data.misc.locale.split('-')[0]}&units=si`)
      .then(res => res.body)
      .catch(() => null);

    const embed = new RichEmbed()
      .addField(ctx.__('weather.embed.weather.title'), ctx.__('weather.embed.weather.value', {
        text: weatherData.currently.summary,
      }), true)
      .addField(ctx.__('weather.embed.temperatures.title'), ctx.__('weather.embed.temperatures.value', {
        realC: Math.floor(weatherData.currently.temperature),
        realF: Math.floor((weatherData.currently.temperature * 1.8) + 32),
        feelsC: Math.floor(weatherData.currently.apparentTemperature),
        feelsF: Math.floor((weatherData.currently.apparentTemperature * 1.8) + 32),
      }), true)
      .addField(ctx.__('weather.embed.wind.title'), ctx.__('weather.embed.wind.value', {
        speedKph: Math.floor(weatherData.currently.windSpeed),
        speedMph: Math.floor(weatherData.currently.windSpeed / 1.609),
        dir: this.getDirection(weatherData.currently.windBearing),
        angle: weatherData.currently.windBearing,
      }), true)
      .addField(ctx.__('weather.embed.misc.title'), ctx.__('weather.embed.misc.value', {
        humidity: Math.floor(weatherData.currently.humidity * 100),
        nebulosity: Math.floor(weatherData.currently.cloudCover * 100),
      }), true)
      .setThumbnail(`https://${this.client.config.dashboard.baseDomain}/images/services/weather_icons/${weatherData.currently.icon}.png`)
      .setFooter(ctx.__('weather.embed.footer'), `https://${this.client.config.dashboard.baseDomain}/images/services/darksky.png`)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('weather.title', {
      city: locationData.city ? locationData.city.long_name : ctx.__('global.unknown'),
      region: locationData.region ? locationData.region.long_name : ctx.__('global.unknown'),
      country: locationData.country ? locationData.country.long_name : ctx.__('global.unknown'),
    }), { embed });

    if (locationData.country && locationData.country.short_name === 'FR' && locationData.postalcode) {
      const alertData = await snekfetch.get('http://api.meteofrance.com/files/vigilance/vigilance.json')
        .then(res => res.body);

      const meta = alertData.meta.find(m => m.zone === 'FR');
      const dept = alertData.data
        .find(d => locationData.postalcode.short_name.startsWith(d.department));
      if (!dept || dept.level < 2) return;

      const embedColors = {
        2: 0xFFFF00,
        3: 0xFF8000,
        4: 0xFF0000,
      };

      const alerts = dept.risk
        .map((level, index) => (level >= 2 ? meta.riskNames[index] : null))
        .filter(a => a)
        .join(' - ');

      const alertEmbed = new RichEmbed()
        .setDescription(`**ALERTE ${meta.colLevels[dept.level - 1]}**\nPhénomènes dangereux en cours dans le département **${locationData.department ? locationData.department.long_name : ctx.__('global.unknown')}**.\n${alerts}\n\nPour plus d'informations consultez la carte de vigilance.`)
        .setThumbnail(`http://api.meteofrance.com/files/vigilance/${meta.vignette}?anticache=${Date.now()}`)
        .setFooter(`Émission: ${mtz(meta.dates.dateInsertion).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)} - Début: ${mtz(meta.dates.dateRun).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)} - Fin: ${mtz(meta.dates.datePrevue).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)}`, `https://${this.client.config.dashboard.baseDomain}/images/services/meteofrance.png`)
        .setColor(embedColors[dept.level]);

      ctx.channel.send({ embed: alertEmbed });
    }
  }

  /**
   * Transforms the wind direction in degrees in a human readable format
   * @param {Number} angle
   * @returns {String} Direction
   */
  getDirection(angle) {
    const arrayIndex = Number((angle / 22.5) + 0.5);
    const windArray = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return windArray[Math.round(arrayIndex % 16)];
  }
}

module.exports = Weather;
