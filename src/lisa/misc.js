const Method = require('../structures/Method');

module.exports = [
  // uid
  new Method(
    'uuid',
    () => uuid(),
  ),

  // exec
  new Method(
    'exec',
    null,
    async (env, params) => {
      if (env.children || !params[0]) return;

      const name = params[0];
      const args = params.slice(1);

      const tag = await env.client.database.getDocument('tags', name);
      if (!tag) return 'UNKNOWN_TAG';

      return (await env.client.lisa.parseString(env, tag.content, 'childrenTag', args, true)) || '';
    },
  )
];

function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
