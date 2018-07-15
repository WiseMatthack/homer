const Method = require('../structures/Method');
const { RichEmbed } = require('discord.js');

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

      const parsed = await env.client.lisa.parseString(env, tag.content, 'childrenTag', args, true);
      env.embed = parsed.embed;
      return parsed.content || '';
    },
  ),

  // embed
  new Method(
    'embed',
    null,
    (env, params) => {
      const embed = new RichEmbed();

      const title = params.find(p => p.startsWith('title:'));
      if (title && title.length < 262) embed.setTitle(title.substring(6));

      const description = params.find(p => p.startsWith('desc:'));
      if (description && description.length < 2053) embed.setDescription(description.substring(5));

      const fields = params.filter(p => p.startsWith('field:'));
      for (const field of fields) {
        const [name, value, inline] = field.substring(6).split('§');
        if (!value || name.length > 256 || value.length > 1024) continue;
        embed.addField(name, value, inline === 'true' ? true : false);
      }

      const image = params.find(p => p.startsWith('image:'));
      if (image) embed.setImage(image.substring(6));

      const thumbnail = params.find(p => p.startsWith('thumb:'));
      if (thumbnail) embed.setThumbnail(thumbnail.substring(6));

      const color = params.find(p => p.startsWith('color:'));
      if (color) embed.setColor(color.substring(6).toUpperCase());

      const footer = params.find(p => p.startsWith('footer:'));
      if (footer) {
        const [text, icon] = footer.substring(7).split('§');
        if (text && text.length < 2048) embed.setFooter(text, icon || null);
      }

      const author = params.find(p => p.startsWith('author:'));
      if (author) {
        const [text, icon] = author.substring(7).split('§');
        if (text && text.length < 256) embed.setAuthor(text, icon || null);
      }

      env.embed = embed;
      return '';
    },
  ),
];

function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
