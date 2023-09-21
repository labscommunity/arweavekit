import fs from 'fs';

const cacheFolder = './cache';

export default async function testTeardown() {
  if (fs.existsSync(cacheFolder)) {
    fs.rm(cacheFolder, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('Warp cache deleted successfully');
    });
  }

  if (global.arLocal) {
    await global.arLocal.stop();
  }
}
