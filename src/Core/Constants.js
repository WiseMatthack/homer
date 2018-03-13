exports.statusEmotes = {
  success: '<:success:420529118417780747>',
  warning: '<:warn:420529189658034187>',
  error: '<:error:420529091280633856>',
};

exports.presenceIcons = {
  online: '420522894570029056',
  idle: '420522947531374593',
  dnd: '420522920620720129',
  offline: '420522970482606081',
  invisible: '420522996621639680',
};

exports.serviceIcons = {
  google: '<:google:420659833356812319>',
  youtube: '<:youtube:420659693531168790>',
  translate: '<:translate:420659720727298054>',
  discordBans: '<:discordbans:420715963718041641>',
};

exports.nitroIcon = '420522857785720832';

exports.botEmote = '<:ibot:420656561493377024>';

exports.profileFields = {
  birthday: '🎂',
  email: '📧',
  instagram: '<:instagram:420886984140259329>',
  minecraft: '<:minecraft:420885989628575744>',
  nnid: '<:nnid:420886250581393408>',
  skype: '<:skype:420886428793307136>',
  snapchat: '<:snapchat:420886848202866698>',
  steam: '<:steam:420885590804791307>',
  twitch: '<:twitch:420891463031717888>',
  twitter: '<:twitter:420885434697252874>',
  youtube: '<:youtube:420659693531168790>',
};

exports.dynamicTags = [
  {
    name: 'choose',
    pattern: /choose\{(?:(.*?))\}/g,
    run: (str) => {
      const match = dynamicTags.find(dyn => dyn.name === 'choose').pattern.exec(str)[1];
      const array = match.split(':');
      if (array.length < 2) throw 'choose.tooFewChoices';

      const chosen = array[Math.floor(Math.random() * array.length)];
      return chosen;
    },
  },
  {
    name: 'random',
    pattern: /random\{(?:(.*?))\}/g,
    run: (str) => {
      const match = dynamicTags.find(dyn => dyn.name === 'random').pattern.exec(str)[1];
      const array = match.split(':');
      if (array.length !== 2) throw 'random.invalidParameters';
      if (isNaN(array[0]) || isNaN(array[1])) throw 'random.NaN';

      const generated = Math.floor(Math.random() * (array[1] - array[0] + 1)) + array[0];
      return generated;
    },
  },
];
