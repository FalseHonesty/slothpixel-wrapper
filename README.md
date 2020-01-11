The `slothpixel` module provides a simple and concise wrapper around the [slothpixel api](https://docs.slothpixel.me/).

In addition, it provides an easy API for paginating requests and a custom DSL for using the powerful
MongoDB filters covered in [this](https://github.com/slothpixel/core/wiki/Using-MongoDB-filters-with-the-Slothpixel-API) wiki post.

Functions for all endpoints are provided, and are documented in the `endpoints.js` file.

Examples:
```js
/* Basic request */
import { getPlayer } from 'slothpixel/endpoints';

getPlayer("FalseHonesty").then(data => {
    // Consume JSON data.
});
```

```js
/* Paginated request */
import { getSkyblockAuctions } from 'slothpixel/endpoints';

getSkyblockAuctions().then(data => {
    if (data.hasNextPage()) {
        data.nextPage().then(nextPageData => {
            // Use nextPageData...        
        });    
    }
});
```


```js
/* Filtered request */
import * as slothpixel from 'slothpixel/endpoints';
import { makeFilter }  from 'slothpixel/utils';
let filter = makeFilter`
    ${'starting_bid'} <= ${500},
    ${'item.attributes.enchantments.sharpness'} > ${3},
    ${"item.attributes.origin"} == ${"DARK_AUCTION"} || ${"item.attributes.origin"} == ${"SHOP_PURCHASE"}
`;
slothpixel.getSkyblockAuctions({ limit: 10, filter }).then(data => {
    print(`data length: ${data.length}`);
    print(`data: ${JSON.stringify(data)}`);
}).catch(print);
```