const fs = require('fs');
const path = require('path');

const PACKAGE_JSON = 'package.json';
interface IPackageJson {
  dependencies: string;
};

export function getFiles(rootDir: string) {
  const pack = tryCatch(() => getPackageJson(path.join(rootDir, PACKAGE_JSON)), () => {});
  const deps = getDependencies(pack);

  let styles = deps
    .map((dep: string) => getStyleField(dep, rootDir))
    .filter(removeEmptyFilter);

  return flatten(styles);
};

function tryCatch(tryFn, catchFn) {
  try {
    return tryFn();
  } catch (e) {
    return catchFn(e);
  }
}

function getPackageJson(url: string) {
  return JSON.parse(fs.readFileSync(url));
}

function getDependencies(pack: IPackageJson) {
  return Object.keys(getField('dependencies', pack, {}));
}

function getField(field: string, pack: IPackageJson, fallback: any = '') {
  const hasField = (pack && pack.hasOwnProperty && pack.hasOwnProperty(field));
  return hasField ? pack[field] : fallback;
}

function getStyleField(dependency: string, rootDir: string) {
  const file = path.join(rootDir, 'node_modules', dependency, PACKAGE_JSON);
  const pack = getPackageJson(file);
  return addPathPrefix(path.dirname(file), getField('style', pack));
}

function addPathPrefix(prefix: string, subject: string[]|string) {

  return Array.isArray(subject) ? subject.map(add) : add(subject);

  function add(entry: string) {
    return isEmpty(entry) ? '' : path.join(prefix, entry);
  }
}

function removeEmptyFilter(entry) {
  return !isEmpty(entry);
}

function isEmpty(entry) {
  return entry === undefined || entry === '';
}

function flatten(list: string[]) {
  return list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b),
    []
  );
}