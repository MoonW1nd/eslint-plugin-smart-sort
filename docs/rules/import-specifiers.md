# sort

Sort import specifiers by natural sort oder ([wiki](https://en.wikipedia.org/wiki/Natural_sort_order));

## Rule Details

This rule aims to...

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

## Configure rule

```json
{
    "rules": {
        "smart-sort/import-specifiers": 2
    }
}
```

## Further Reading

- [Natural Sort Order](https://en.wikipedia.org/wiki/Natural_sort_order)
