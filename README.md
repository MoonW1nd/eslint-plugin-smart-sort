# eslint-plugin-smart-sort

Plugin ESlint help sort code entities, with autofix and without format code style.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-smart-sort`:

```
$ npm install eslint-plugin-smart-sort --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-smart-sort` globally.

## Usage

Add `smart-sort` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "smart-sort"
    ]
}
```

## Rules
### import-specifiers

Sort import specifiers by natural sort oder ([wiki](https://en.wikipedia.org/wiki/Natural_sort_order));

#### Rule Details
Examples of **incorrect** code for this rule:

```js
    import {c, b, a} from './';
    import {a1, a10, a2} from './';
    import {a1,  a2, a10, A} from './';
    import {
        a10,
        a1,
        B,
        A,
        a2,
    } from './';
```

Examples of **correct** code for this rule:

```js
    import {a, b, c} from './';
    import {a1, a2, a10} from './';
    import {A, a1,  a2, a10} from './';
    import {
        A,
        B,
        a1,
        a2,
        a10
    } from './';

```

#### Configure rule

```json
{
    "rules": {
        "smart-sort/import-specifiers": 2
    }
}
```
