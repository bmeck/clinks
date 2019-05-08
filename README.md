# clinks

Simple preload to change the console APIs to include hyperlinks when they are used.

THIS DOES NOT DETECT SUPPORT FOR HYPERLINKS IN YOUR TERMINAL.

THIS IS NOT MEANT TO BE CONSUMED PROGRAMATICALLY BY YOUR APPLICATION CODE.

## Usage

```console
npm i clinks
node -r clinks app.js
```

VSCode has a special protocol for more fine grained line/column support, it is recommended to use
that adapter if you want better links if that is your editor.


```console
node -r clinks/vscode app.js
```

