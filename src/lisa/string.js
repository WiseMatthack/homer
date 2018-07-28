const Method = require('../structures/Method');

module.exports = [
  // lower
  new Method(
    'lower',
    null,
    (env, params) => params[0].toLowerCase(),
  ),

  // upper
  new Method(
    'upper',
    null,
    (env, params) => params[0].toUpperCase(),
  ),

  // length
  new Method(
    'length',
    null,
    (env, params) => params[0].length.toString(),
  ),

  // url
  new Method(
    'url',
    null,
    (env, params) => encodeURIComponent(params[0]),
  ),

  // replace
  new Method(
    'replace',
    null,
    (env, params) => {
      if (params[2].startsWith('in:')) params[2] = params[2].substring(3);
      if (params[1].startsWith('with:')) params[1] = params[1].substring(5);
      return params[2].replace(new RegExp(params[0], 'ig'), params[1]);
    },
  ),

  // replaceregex
  new Method(
    'replaceregex',
    null,
    (env, params) => {
      console.log(params)
      if (params[2].startsWith('in:')) params[2] = params[2].substring(3);
      if (params[1].startsWith('with:')) params[1] = params[1].substring(5);
      return params[2].replace(new RegExp(params[0], 'ig'), params[1]);
    },
  ),

  // substring
  new Method(
    'substring',
    null,
    (env, params) => {
      const string = params[2];
      let start;
      let end;

      try {
        start = parseInt(params[0]);
      } catch (e) {
        start = 0;
      }

      try {
        end = parseInt(params[1]);
      } catch (e) {
        end = string.length;
      }

      if (start < 0) start += string.length;
      if (end < 0) end += string.length;
      if (end <= start || end <= 0 || start >= string.length) return null;
      if (end > string.length) end = string.length;
      if (start < 0) start = 0;

      return params[2].substring(start, end);
    },
  ),

  // oneline
  new Method(
    'oneline',
    null,
    (env, params) => params[0].replace(/\\s+/g, ' ').trim(),
  ),

  // hash
  new Method(
    'hash',
    null,
    (env, params) => params[0].hashCode().toString(),
  ),

  // encode
  new Method(
    'encode',
    null,
    (env, params) => {
      if (!params[0] || !params[1]) return;
      return Buffer.from(params[0]).toString(params[1]);
    },
  ),

  // decode
  new Method(
    'decode',
    null,
    (env, params) => {
      if (!params[0] || !params[1]) return;
      return Buffer.from(params[0], params[1]).toString();
    },
  ),

  // repeat
  new Method(
    'repeat',
    null,
    (env, params) => {
      let [text, times, separator] = params;
      if (!text || !times) return;
      times = parseInt(times);
      if (times < 1 || times > 100) return 'RANGE_ERROR';

      const repeated = [];
      for (let i = 0; i < times; i += 1) repeated.push(text);
      return repeated.join(separator || '');
    },
  ),

  // reverse
  new Method(
    'reverse',
    null,
    (env, params) => {
      const original = params[0];
      let str = '';

      for (let i = (original.length - 1); i >= 0; i -= 1) str += original[i];
      return str;
    },
  ),

  // emote
  new Method(
    'emote',
    null,
    (env, params) => {
      const name = params[0];
      if (!name) return;

      const constants = env.client.constants;
      if (name === 'success') return constants.emotes.success;
      else if (name === 'warning') return constants.emotes.warning;
      else if (name === 'error') return constants.emotes.error;
      else if (name === 'online') return constants.status.online;
      else if (name === 'idle') return constants.status.idle;
      else if (name === 'dnd') return constants.status.dnd;
      else if (name === 'offline') return constants.status.offline;
      else if (name === 'streaming') return constants.status.streaming;
      else if (name === 'dot') return constants.emotes.dot;
      else if (name === 'loading') return constants.emotes.loading;
      return '';
    },
  ),
];
