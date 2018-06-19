exports.defaultGuildSettings = (id) => ({
  id,
  welcome: {
    channel: '0',
    message: false,
  },
  leave: {
    channel: '0',
    message: false,
  },
  ignored: [],
  prefixes: [],
  rolemeRoles: [],
  misc: {
    timezone: 'UTC',
    locale: 'en-gb',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm:ss',
  },
});

exports.defaultUserSettings = (id) => ({
  id,
  prefixes: [],
  misc: {
    timezone: 'UTC',
    locale: 'en-gb',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm:ss',
  },
});

exports.userAgent = () => `DiscordBot (https://github.com/iDroid27210/homer) Node.js/${process.version}`;

exports.emotes = {
  success: '<:success:453889194016899074>',
  warning: '<:warn:453591316027408395>',
  error: '<:error:453889225356738560>',
  successID: 'success:453889194016899074',
  warningID: 'warn:453591316027408395',
  errorID: 'error:453889225356738560',
  dot: '◽',
  humanUser: '👤',
  botUser: '🤖',
  botIcon: '<:bot:420699407344730122>',
  bot: '<:ibot:420656561493377024>',
  loading: '<a:loading:455113752984027163>',
  dbans: '<:discordbans:420715963718041641>',
};

exports.badges = {
  donator: '<:donator:458192052866383873>',
  nitro: '<:nitro:452417495341727763>',
  botDev: '<:botDev:458194202908426262>',
};

exports.status = {
  online: '<:online:420522894570029056>',
  idle: '<:idle:420522947531374593>',
  dnd: '<:dnd:420522920620720129>',
  offline: '<:offline:420522970482606081>',
};

exports.services = {
  translate: '<:translate:420659720727298054>',
};

exports.regionFlags = {
  amsterdam: ':flag_nl:',
  brazil: ':flag_br:',
  'eu-central': ':flag_eu:',
  'eu-west': ':flag_eu:',
  frankfurt: ':flag_de:',
  hongkong: ':flag_hk:',
  japan: ':flag_jp:',
  london: ':flag_gb:',
  russia: ':flag_ru:',
  'us-central': ':flag_us:',
  'us-east': ':flag_us:',
  'us-south': ':flag_us:',
  'us-west': ':flag_us:',
  singapore: ':flag_sg:',
  sydney: ':flag_au:',
};

exports.categoryEmotes = {
  bot: '<:ibot:420656561493377024>',
  general: '🖥',
  misc: '🎮',
  settings: '🔧',
  telephone: '📞',
};

exports.donationLink = 'https://paypal.me/ibotandidroid';
exports.githubLink = 'https://github.com/iDroid27210/homer';
exports.logChannel = '458334746338918403';