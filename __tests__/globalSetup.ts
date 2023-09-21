import ArLocal from 'arlocal';

export default async function testSetup() {
  const arLocal = new ArLocal(1984, false);
  await arLocal.start();
  global.arLocal = arLocal;
}
