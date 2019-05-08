'use strict';
let link = require('hyperlinker'),
  {URL, pathToFileURL} = require('url'),
  {inspect, formatWithOptions} = require('util'),
  opts = {colors: require('process').stderr.isTTY},
  stack = require('vm').runInNewContext(`(${() => {
    Error.prepareStackTrace = (_, callsites) => callsites;
    return (n) => {
      Error.stackTraceLimit = n + 2;
      return new Error().stack.slice(2);
    };
  }})`)();
module.exports = (callsiteToURLTransform) => {
  let wrap = (text, cs) => {
    let url = cs.getFileName();
    if (url.startsWith('internal/')) return `${cs}`;
    try { url = new URL(url); } catch (e) { url = pathToFileURL(url); }
    return link(`${text}`, `${callsiteToURLTransform(url, cs.getLineNumber(), cs.getColumnNumber())}`);
  }, { error } = console;
  Object.keys(console).forEach(k => {
    if (k === 'Console') return;
    if (k === 'dir')
      return console.dir = function (o, flags) {
        return error(wrap(inspect(o, {
          ...opts, ...flags
        }), stack(Error.stackTraceLimit)[0]));
      };
    if (k === 'trace')
      return console.trace = function (...args) {
        return error(`Trace ${formatWithOptions(opts, ...args)}\n    ${
          stack(Error.stackTraceLimit)
            .map(cs => wrap(cs, cs)).join('\n    ')
        }`);
      };
    let old = console[k];
    console[k] = function (...args) {
      return old(wrap(formatWithOptions(opts, ...args), stack(1)[0]));
    };
  });
}