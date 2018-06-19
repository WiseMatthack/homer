const Method = require('../structures/Method');
const mtz = require('moment-timezone');

module.exports = [
  // now
  new Method(
    'now',
    (env) => mtz()
      .locale(env.settings.misc.locale)
      .tz(env.settings.misc.timezone)
      .format(`${env.settings.misc.dateFormat} ${env.settings.misc.timeFormat}`),
    (env, params) => mtz()
      .locale(env.settings.misc.locale)
      .tz(env.settings.misc.timezone)
      .format(params[0]),
  ),

  // time
  new Method(
    'time',
    null,
    (env, params) => {
      const time = parseInt(params[0]) || Date.now();
      const format = params[1] || `${env.settings.misc.dateFormat} ${env.settings.misc.timeFormat}`;
      return mtz(time)
        .locale(env.settings.misc.locale)
        .tz(env.settings.misc.timezone)
        .format(format);
    },
  ),
];
