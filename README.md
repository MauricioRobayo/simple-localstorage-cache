# Simple Storage Cache [![npm version](https://badge.fury.io/js/simple-storage-cache.svg)](https://www.npmjs.com/package/simple-storage-cache)

![build and release](https://github.com/MauricioRobayo/simple-storage-cache/workflows/build%20and%20release/badge.svg)
[![codecov](https://codecov.io/gh/MauricioRobayo/simple-storage-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/MauricioRobayo/simple-storage-cache)
[![CodeFactor](https://www.codefactor.io/repository/github/mauriciorobayo/simple-storage-cache/badge)](https://www.codefactor.io/repository/github/mauriciorobayo/simple-storage-cache)

Simple Storage Cache to save API responses and avoid unnecessary requests.

Dependencies-free and super small.

[![install size](https://packagephobia.now.sh/badge?p=simple-storage-cache)](https://packagephobia.now.sh/result?p=simple-storage-cache)

## Usage

Install [`simple-storage-cache`](https://www.npmjs.com/package/simple-storage-cache):

```
npm install simple-storage-cache
```

Create an instance with the key that you want to use and the expiration time in milliseconds:

```js
import Cache from 'simple-storage-cache';

const ONE_MINUTE = 60000;
const KEY = 'somekey'; 
const cache = new Cache(KEY, ONE_MINUTE);
```

The `key` will be transformed to use the `'ssc-'` prefix: `'ssc-somekey'`.

By default, the module will use [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but you can change the [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface to be [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) by explicitly passing it on the constructor:

```js
const cache = new Cache('somekey', 60000, sessionStorage);
```

### Methods

Simple Storage cache provides two convenient methods: `get` and `update`.

#### get()

The `get()` method is used to get the data stored in Storage. It will return `null` if there is not data to retrieve or if the key has expired.

If there is data to retrieve and it hasn't expired, then it will return an object with two properties, the `data` property, containing the data that was originally stored, and the `expiration` property, with the expiration time as a number of milliseconds.

```js
const cached = cache.get();
console.log(cached);
// { data: { ... }, expiration: 1595179891655, }
```

#### update(_data_)

The `update(data)` method allows to set new data or update it:


```js
const response = await fetch(url);
const data = await response.json();

cache.update(data);
```

## Example

```js
import Cache from "simple-storage-cache";
import axios from "axios";

async function getChuckNorrisFact() {
  const ONE_MINUTE = 60000;
  const URL = "https://api.chucknorris.io/jokes/random";
  const cache = new Cache("chuck", ONE_MINUTE);

  const cached = cache.get();

  if (cached) {
    return cached.data;
  }

  const response = await axios.get(url);

  cache.update(response.data);

  return response.data;
}
```

You can also use it with TypeScript:

```ts
import Cache from "simple-storage-cache";
import axios, { AxiosResponse } from "axios";

interface ChuckNorrisFact {
  categories: string[];
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
}

async function getChuckNorrisFact() {
  const ONE_MINUTE = 60000
  const URL = "https://api.chucknorris.io/jokes/random";
  
  const cache = new Cache<ChuckNorrisFact>("chuck", ONE_MINUTE);
  
  const cached = cache.get();

  if (cached) {
    return cached.data;
  }

  const response = await axios.get<string, AxiosResponse<ChuckNorrisFact>>(url);

  cache.update(response.data);

  return response.data;
}
```

## Acknowledgements

Some of the best ideas for this module came from an outstanding [code review](https://codereview.stackexchange.com/a/247898/146118) by [r3dst0rm](https://github.com/r3dst0rm).

## Contributing

Contributions, issues and feature requests are welcome!

## Show your support

Give a ⭐️ if you like this project!

## License

[MIT](LICENSE).
