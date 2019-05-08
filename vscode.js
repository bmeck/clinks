require('./index.js')((url, line, column) => url.protocol === 'file:' ?
  `vscode://file/${url.pathname}:${line}:${column}` :
  url);
