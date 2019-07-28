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


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "smart-sort/rule-name": 2
    }
}
```

## Supported Rules

* [import-specifiers](./docs/rules/import-specifiers.md)





