# eslint-plugin-sort-import-specifiers

Simple plugin implement sort import specifiers by natural sort oder ([wiki](https://en.wikipedia.org/wiki/Natural_sort_order)), with autofix and without format code style.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-sort-import-specifiers`:

```
$ npm install eslint-plugin-sort-import-specifiers --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-sort-import-specifiers` globally.

## Usage

Add `sort-import-specifiers` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "sort-import-specifiers"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "sort-import-specifiers/rule-name": 2
    }
}
```

## Supported Rules

* [sort](./docs/rules/sort.md)





