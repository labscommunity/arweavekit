import { resolve } from 'path';
import fs, { PathLike, readFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { appVersionTag } from '../src/utils';

const version = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' })
).version;

const paths = ['./utils.js'];

export const checkPath = async (path: PathLike): Promise<boolean> => {
  return fs.promises
    .stat(path)
    .then((_) => true)
    .catch((_) => false);
};

(async function (): Promise<void> {
  const dir = resolve('./dist');
  await Promise.all(
    paths.map((p) =>
      (async (): Promise<void> => {
        const path = resolve(dir, p);
        if (!(await checkPath(path))) {
          throw new Error(`${path} does not exist!`);
        }
        const content = await readFile(path, { encoding: 'utf-8' });
        const newContent = content.replace(appVersionTag.value, version);
        await writeFile(path, newContent, { encoding: 'utf-8' });
      })()
    )
  );
})();
