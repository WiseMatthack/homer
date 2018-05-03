const TagFunction = require('../../Core/Structures/TagFunction');
const moment = require('moment-timezone');

class MomentFunction extends TagFunction {
  run(args, context, contextType, settings) {
    const format = args[0];
    const timezone = args[1] || 'UTC';

    return moment()
      .locale(settings.misc.locale)
      .tz(timezone)
      .format(format);
  }
}

module.exports = MomentFunction;
