import { Tag } from 'arweave/node/lib/transaction';

export function decodeTags(tags: Tag[]) {
  return tags.map(
    (tag) =>
      ({
        name: tag.get('name', { decode: true, string: true }),
        value: tag.get('value', { decode: true, string: true }),
      } as Tag)
  );
}
