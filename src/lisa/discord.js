const Method = require('../structures/Method');
const { deconstruct } = require('../../node_modules/discord.js/src/util/Snowflake');

module.exports = [
  // user
  new Method(
    'user',
    (env) => env.user.username,
    (env, params) => {
      if (!env.guild) return;
      const members = env.client.finder.findMembers(env.guild.members, params[0]);
      return members.length > 0 ? members[0].user.username : '?';
    },
  ),

  // nick
  new Method(
    'nick',
    (env) => (env.member && env.member.nickname) ? env.member.nickname : env.user.username,
    (env, params) => {
      if (!env.guild) return;
      const members = env.client.finder.findMembers(env.guild.members, params[0]);
      return members.length > 0 ? (members[0].nickname || members[0].user.username) : '?';
    },
  ),

  new Method(
    'discrim',
    (env) => env.user.discriminator,
    (env, params) => {
      if (!env.guild) return;
      const members = env.client.finder.findMembers(env.guild.members, params[0]);
      return members.length > 0 ? members[0].user.discriminator : '?';
    },
  ),

  // avatar
  new Method(
    'avatar',
    (env) => env.user.avatar ? `https://cdn.discordapp.com/avatars/${env.user.id}/${env.user.avatar}.png` : this.getDefaultAvatar(env.user.discriminator),
    (env, params) => {
      if (!env.guild) return;
      const members = env.client.finder.findMembers(env.guild.members, params[0]);
      return members.length > 0 ? (members[0].user.avatar ? `https://cdn.discordapp.com/avatars/${members[0].user.id}/${members[0].user.avatar}.png` : this.getDefaultAvatar(members[0].user.discriminator)) : '?';
    },
  ),

  // creation
  new Method(
    'creation',
    null,
    (env, params) => deconstruct(params[0]).timestamp.toString(),
  ),

  // userid
  new Method(
    'userid',
    (env) => env.user.id,
  ),

  // atuser
  new Method(
    'atuser',
    (env) => `<@${(env.member && env.member.nickname) ? '!' : ''}${env.user.id}>`,
  ),

  // server
  new Method(
    'server',
    (env) => env.guild ? env.guild.name : null,
  ),

  // serverid
  new Method(
    'serverid',
    (env) => env.guild ? env.guild.id : null,
  ),

  // servercount
  new Method(
    'servercount',
    (env) => env.guild ? env.guild.memberCount.toString() : null,
  ),

  // servericon
  new Method(
    'servericon',
    (env) => env.guild ? (env.guild.icon ? `https://discordapp.com/icons/${env.guild.id}/${env.guild.icon}.png` : 'NO_ICON') : null,
  ),

  // channel
  new Method(
    'channel',
    (env) => env.guild ? env.channel.name : 'DM',
  ),

  // channelid
  new Method(
    'channelid',
    (env) => env.channel.id,
  ),

  // randuser
  new Method(
    'randuser',
    (env) => env.guild ? env.guild.members.random().user.username : null,
  ),

  // randonline
  new Method(
    'randonline',
    (env) => env.guild ? env.guild.members.filter(m => m.user.presence.status === 'online').random().user.username : null,
  ),

  // randchannel
  new Method(
    'randchannel',
    (env) => env.guild ? env.guild.channels.random().name : null,
  ),
];
