[![NPM](https://img.shields.io/npm/v/tfa-input.svg)](https://www.npmjs.com/package/tfa-input)
[![build status](https://github.com/diananem/tfa-input/workflows/CI/badge.svg)](https://github.com/diananem/tfa-input/actions)
[![npm size](https://img.shields.io/bundlephobia/minzip/tfa-input)](https://bundlephobia.com/package/tfa-input@1.0.1)
[![npm downloads](https://img.shields.io/npm/dm/tfa-input)](https://www.npmjs.com/package/tfa-input)
[![NPM](https://img.shields.io/npm/l/tfa-input)](https://github.com/diananem/tfa-input/blob/main/LICENSE)

# tfa-input

Tfa-input is a cool and customizable component built with TypeScript ready to drop in your projects. 

## Table of content

* [`Built with`](#built-with)
* [`Installation`](#installation)
* [`API`](#api)
* [`Example of usage`](#example-of-usage)
* [`Contributing`](#contributing)
* [`License`](#license)

## Built with
* [`TypeScript`](https://www.typescriptlang.org/docs/)
* [`React`](https://reactjs.org/docs/getting-started.html)
* [`Goober`](https://github.com/cristianbote/goober)
* [`tsdx`](https://tsdx.io/)


## Installation
You can use npm

```js
npm i tfa-input
```

or via Yarn

```js
yarn add tfa-input
```

## API

Option | Type | Required | Default | Description
--- | --- | --- | --- | ---
|[`value`](#value) | `string` / `number` | `false` | `[]` | The value of the input passed into the component. |
|[`onSubmit`](#onSubmit) | `function` | `true` | `undefined` | Function called when the user filled in the code. |
|[`autoFocus`](#autoFocus) | `boolean` | `false` | `false` | Optional boolean param to control whether the input should be autofocused on mount. |
|[`containerStyle`](#containerStyle) |`string` (className) /  `object` (style) | `false` |  | Style applied or class passed to container of cells. |
|[`cellNumberStyle`](#cellNumberStyle) |`string` /  `object` | `false` |  | Style applied or class passed to each cell. |
|[`inputStyle`](#inputStyle) |`string` /  `object` | `false` |  | Style applied or class passed to input. |
|[`focusColor`](#focusColor) |`string` | `false` | `#23d9d9` | Color of input cell on focus state. |


## Example of usage

```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TfaInput } from 'tfa-input';


const App = () => {
  return (
    <div>
      <TfaInput
        value={123456}
        autoFocus
        onSubmit={(code) => console.log(code)}
        containerStyle="container-classname"
        cellNumberStyle={{ fontSize: '26px'}}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

```

## Contributing

[![GitHub issues](https://img.shields.io/github/issues-raw/diananem/tfa-input?logo=github)](https://github.com/diananem/tfa-input/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/diananem/tfa-input?logo=git)](https://github.com/diananem/tfa-input/pulls)

Feel free to open [issues](https://github.com/diananem/tfa-input/issues/new/choose) and [pull requests](https://github.com/diananem/tfa-input/pulls)!

## License

This project is licensed under the terms of the [MIT license](LICENSE).
