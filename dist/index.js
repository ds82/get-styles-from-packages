"use strict";
var fs = require('fs');
var path = require('path');
var PACKAGE_JSON = 'package.json';
;
function getFiles(rootDir) {
    var pack = getPackageJson(path.join(rootDir, PACKAGE_JSON));
    var deps = getDependencies(pack);
    var styles = deps
        .map(function (dep) { return getStyleField(dep, rootDir); })
        .filter(removeEmptyFilter);
    return flatten(styles);
}
exports.getFiles = getFiles;
;
function getPackageJson(url) {
    return JSON.parse(fs.readFileSync(url));
}
function getDependencies(pack) {
    return Object.keys(getField('dependencies', pack));
}
function getField(field, pack) {
    var hasField = (pack && pack.hasOwnProperty && pack.hasOwnProperty(field));
    return hasField ? pack[field] : '';
}
function getStyleField(dependency, rootDir) {
    var file = path.join(rootDir, 'node_modules', dependency, PACKAGE_JSON);
    var pack = getPackageJson(file);
    return addPathPrefix(path.dirname(file), getField('style', pack));
}
function addPathPrefix(prefix, subject) {
    return Array.isArray(subject) ? subject.map(add) : add(subject);
    function add(entry) {
        return isEmpty(entry) ? '' : path.join(prefix, entry);
    }
}
function removeEmptyFilter(entry) {
    return !isEmpty(entry);
}
function isEmpty(entry) {
    return entry === undefined || entry === '';
}
function flatten(list) {
    return list.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []);
}
