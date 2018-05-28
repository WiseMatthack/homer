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
    const locationData = await snekfetch.get(`https://dev.virtualearth.net/REST/v1/Locations?query=${location}&maxResults=1&culture=${ctx.settings.data.misc.locale}&key=${this.client.config.api.bingGeocode}`)
      .then((res) => {
        const parsed = res.body;
        if (parsed.resourceSets[0].estimatedTotal === 0) return null;

        const foundLoc = parsed.resourceSets[0].resources[0];
        return ({
          city: foundLoc.address.locality || null,
          department: foundLoc.address.adminDistrict2 || null,
          region: foundLoc.address.adminDistrict || null,
          country: foundLoc.address.countryRegion || null,
          postalcode: this.franceDepartments[foundLoc.address.adminDistrict2] || null,
          geometry: foundLoc.point.coordinates.join(','),
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
        dir: ctx.__(`weather.winDir.${this.getDirection(weatherData.currently.windBearing)}`),
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
      city: locationData.city || ctx.__('global.unknown'),
      region: locationData.region || ctx.__('global.unknown'),
      country: locationData.country || ctx.__('global.unknown'),
    }), { embed });

    if (locationData.country === 'France' && locationData.postalcode) {
      const alertData = await snekfetch.get('http://api.meteofrance.com/files/vigilance/vigilance.json')
        .then(res => res.body);

      const meta = alertData.meta.find(m => m.zone === 'FR');
      const dept = alertData.data
        .find(d => locationData.postalcode === d.department);
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
        .setDescription(`**ALERTE ${meta.colLevels[dept.level - 1]}**\nPhénomènes dangereux en cours dans le département **${locationData.department || ctx.__('global.unknown')}**.\n${alerts}\n\nPour plus d'informations consultez la [carte de vigilance](http://vigilance.meteofrance.com).`)
        .setThumbnail(`http://api.meteofrance.com/files/vigilance/${meta.vignette}?anticache=${Date.now()}`)
        .setFooter(`Émission: ${mtz(meta.dates.dateInsertion).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)} - Début: ${mtz(meta.dates.dateRun).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)} - Fin: ${mtz(meta.dates.datePrevue).tz(ctx.settings.data.misc.timezone).locale(ctx.settings.data.misc.locale).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)}`, `https://${this.client.config.dashboard.baseDomain}/images/services/meteofrance.png`)
        .setColor(embedColors[dept.level]);

      ctx.channel.send({ embed: alertEmbed });
    }
  }

  /**
   * Transforms the wind direction in degrees in a number (translation module will use it)
   * @param {Number} angle
   * @returns {String} Direction
   */
  getDirection(angle) {
    const arrayIndex = Number((angle / 22.5) + 0.5);
    return Math.round(arrayIndex % 16);
  }

  /**
   * France postal codes mapped by their names
   * @type {Object}
   */
  get franceDepartments() {
    return ({
      'Aube': '10',
      'Aude': '11',
      'Aveyron': '12',
      'Bouches-du-Rhône': '13',
      'Calvados': '14',
      'Cantal': '15',
      'Charente': '16',
      'Charente-Maritime': '17',
      'Cher': '18',
      'Corrèze': '19',
      'Côte-d\'Or': '21',
      'Côtes-d\'Armor': '22',
      'Creuse': '23',
      'Dordogne': '24',
      'Doubs': '25',
      'Drôme': '26',
      'Eure': '27',
      'Eure-et-Loir': '28',
      'Finistère': '29',
      'Gard': '30',
      'Haute-Garonne': '31',
      'Gers': '32',
      'Gironde': '33',
      'Hérault': '34',
      'Ille-et-Vilaine': '35',
      'Indre': '36',
      'Indre-et-Loire': '37',
      'Isère': '38',
      'Jura': '39',
      'Landes': '40',
      'Loir-et-Cher': '41',
      'Loire': '42',
      'Haute-Loire': '43',
      'Loire-Atlantique': '44',
      'Loiret': '45',
      'Lot': '46',
      'Lot-et-Garonne': '47',
      'Lozère': '48',
      'Maine-et-Loire': '49',
      'Manche': '50',
      'Marne': '51',
      'Haute-Marne': '52',
      'Mayenne': '53',
      'Meurthe-et-Moselle': '54',
      'Meuse': '55',
      'Morbihan': '56',
      'Moselle': '57',
      'Nièvre': '58',
      'Nord': '59',
      'Oise': '60',
      'Orne': '61',
      'Pas-de-Calais': '62',
      'Puy-de-Dôme': '63',
      'Pyrénées Atlantiques': '64',
      'Hautes-Pyrénées': '65',
      'Pyrénées-Orientales': '66',
      'Bas Rhin': '67',
      'Haut Rhin': '68',
      'Rhône': '69',
      'Haute-Saône': '70',
      'Saône-et-Loire': '71',
      'Sarthe': '72',
      'Savoie': '73',
      'Haute-Savoie': '74',
      'Paris': '75',
      'Seine-Maritime': '76',
      'Seine-et-Marne': '77',
      'Yvelines': '78',
      'Deux-Sèvres': '79',
      'Somme': '80',
      'Tarn': '81',
      'Tarn-et-Garonne': '82',
      'Var': '83',
      'Vaucluse': '84',
      'Vendée': '85',
      'Vienne': '86',
      'Haute-Vienne': '87',
      'Vosges': '88',
      'Yonne': '89',
      'Territoire de Belfort': '90',
      'Essonne': '91',
      'Hauts-de-Seine': '92',
      'Seine-Saint-Denis': '93',
      'Val-de Marne': '94',
      'Val-d\'Oise': '95',
      'Guadeloupe': '971',
      'Martinique': '972',
      'Guyane': '973',
      'Réunion': '974',
      'Saint Pierre et Miquelon': '975',
      'Mayotte': '976',
      'Ain': '01',
      'Aisne': '02',
      'Allier': '03',
      'Alpes de Haute Provence': '04',
      'Hautes Alpes': '05',
      'Alpes Maritimes': '06',
      'Ardèche': '07',
      'Ardennes': '08',
      'Ariège': '09',
      'Corse du Sud': '2A',
      'Haute-Corse': '2B',
    });
  }
}

module.exports = Weather;
