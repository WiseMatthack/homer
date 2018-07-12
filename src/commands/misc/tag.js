const Command = require('../../structures/Command');

class TagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tag',
      aliases: ['t'],
      usage: '<tag name> [tag argument(s)]',
      category: 'misc',
      children: [
        new CreateSubcommand(client),
        new EditSubcommand(client),
        new DeleteSubcommand(client),
        new OwnerSubcommand(client),
        new RawSubcommand(client),
        new RawtwoSubcommand(client),
        new ExecSubcommand(client),
      ],
      dm: true,
    });
  }

  async execute(context) {
    const name = context.args[0];
    const args = context.args.slice(1);
    if (!name) return context.replyError(context.__('tag.noName'));

    const tag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!tag) return context.replyWarning(context.__('tag.unknownTag', { name }));

    context.reply(await this.client.lisa.parseString(context, tag.content, 'tag', args));
  }
}

class CreateSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'create',
      usage: '<tag name> <tag content>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const name = context.args[0];
    const content = context.args.slice(1).join(' ');
    if (!name) return context.replyError(context.__('tag.create.noName'));
    if (!content) return context.replyError(context.__('tag.create.noContent'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (existentTag) return context.replyWarning(context.__('tag.create.alreadyExist', { name }));

    await this.client.database.insertDocument(
      'tags',
      {
        id: name.toLowerCase(),
        content,
        creation: Date.now(),
        edit: null,
        author: context.message.author.id,
      },
    );
    context.replySuccess(context.__('tag.create.created', { name }));
  }
}

class EditSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'edit',
      usage: '<tag name> <tag content>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const name = context.args[0];
    const content = context.args.slice(1).join(' ');
    if (!name) return context.replyError(context.__('tag.edit.noName'));
    if (!content) return context.replyError(context.__('tag.edit.noContent'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!existentTag) return context.replyWarning(context.__('tag.notFound', { name }));
    if (existentTag.author !== context.message.author.id) return context.replyError(context.__('tag.edit.cantInteract', { name }));

    await this.client.database.updateDocument(
      'tags',
      existentTag.id,
      {
        content,
        edit: Date.now(),
      },
    );
    context.replySuccess(context.__('tag.edit.edited', { name }));
  }
}

class DeleteSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delete',
      usage: '<tag name>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const name = context.args[0];
    if (!name) return context.replyError(context.__('tag.delete.noName'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!existentTag) return context.replyWarning(context.__('tag.notFound', { name }));
    if (existentTag.author !== context.message.author.id) return context.replyError(context.__('tag.delete.cantInteract', { name }));

    await this.client.database.deleteDocument('tags', existentTag.id);
    context.replySuccess(context.__('tag.delete.deleted', { name }));
  }
}

class OwnerSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'owner',
      aliases: ['author'],
      usage: '<tag name>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const name = context.args[0];
    if (!name) return context.replyError(context.__('tag.noName'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!existentTag) return context.replyWarning(context.__('tag.notFound', { name }));

    const author = await this.client.fetchUser(existentTag.author).then(u => `**${u.username}**#${u.discriminator}`);
    context.replySuccess(context.__('tag.owner.owner', {
      author,
      name,
    }));
  }
}

class RawSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'raw',
      usage: '<tag name>',
    });
  }

  async execute(context) {
    const name = context.args[0];
    if (!name) return context.replyError(context.__('tag.noName'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!existentTag) return context.replyWarning(context.__('tag.notFound', { name }));

    context.reply(existentTag.content);
  }
}

class RawtwoSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'raw2',
      usage: '<tag name>',
    });
  }

  async execute(context) {
    const name = context.args[0];
    if (!name) return context.replyError(context.__('tag.noName'));

    const existentTag = await this.client.database.getDocument('tags', name.toLowerCase());
    if (!existentTag) return context.replyWarning(context.__('tag.notFound', { name }));

    context.reply(existentTag.content, { code: 'js' });
  }
}

class ExecSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      usage: '<content>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const content = context.args.join(' ');
    if (!content) return context.replyError(context.__('tag.exec.noContent'));

    context.reply(await this.client.lisa.parseString(context, content, 'tag'));
  }
}

module.exports = TagCommand;
