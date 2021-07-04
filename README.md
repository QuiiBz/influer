<h1 align="center">influer</h1>
<p align="center">
    <a href="https://github.com/QuiiBz/influer/actions">
        <img src="https://github.com/QuiiBz/influer/workflows/Test/badge.svg" />
    </a>
    <br />
    <br />
    <span>A tiny (< 1KB) reactivity library</span>
    <br />
    <br />
    <code>yarn add influer</code>
</p>

## Introduction
**influer** is a tiny reactivity library. Exported in ESM, CJS, and IIFE, all < 1KB.

Available through Yarn/NPM:
```bash
# Yarn
yarn add influer
# NPM
npm install influer
```

Or a CDN:
```html
<script defer src="https://unpkg.com/influer"></script>
```

## Features
-  Tiny (< 1KB, 0 dependencies)
- Use in Browser / NodeJS
- Full TypeScript support

## Example
```ts
import influer from 'influer';

// Create your state
export const { state, watch } = influer({
    user: {
        firstname: 'John',
        lastname: 'Doe',
    },
});

// Watch user's firstname
watch('user.firstname', (current, previous) => {
    console.log(`Updated from ${previous} to ${current}`);
});

// Update the user somewhere
state.user.firstname = 'Jane';

// Updated from John to Jane
```

## API
The `influer` (default exported) method gives you an object with a [`state`](#state), and two functions [`watch`](#watch) and [`watchOnce`](#watchOnce).

You must pass an object as an argument to `influer`, which represents the initial state. You can then export those variables to make them available on your application.
```ts
export const { state, watch } = influer({
    user: {
        firstname: 'John',
        lastname: 'Doe',
    },
});
```

### `state`
When you need to modify the state, simply re-affect the desired field. If you use TypeScript and don't follow the type of the original state, you will have a warning.
```ts
import { state } from '...';

// Re-affect the whole user object
state.user = {
    firstname: 'Jane',
    lastname: 'Due',
};

// Re-affect only the firstname
state.user.firstname = 'Jane';
```

### `watch`
You can watch any object or property from the state using the `watch` or `watchOnce` methods.

With TypeScript, you can get auto-completion for all available keys to watch, corresponding to the objects or property in the state.
```ts
import { watch } from '...';

// Watch the whole user object
watch('user', (current, previous) => ...);

// Watch only the firstname
watch('user.firstname', (current, previous) => ...);
```

As you can see, you must pass a watcher callback as a second argument, which will be called when the property linked to the key will be updated.

This watcher callback gives you the current and the previous value of the property. If you return something which is not `void` inside this watcher callback, the value of this property will be updated to the one returned.
```ts
watch('user.firstname', (current) => {
    if(current === 'John') {
        return 'Mister John';
    }
});

state.user.firstname = 'Jane';
// firstname = Jane

state.user.firstname = 'John';
// firstname = Mister John
```

### `watchOnce`
The same method as `watch`, except that the watcher callback will be called once, and the key will not be watched anymore.

You can reproduce the same behavior and stop watching a key at any time: the `watch` method returns an `unwatch` method that you can call:
```ts
const unwatch = watch('user.firstname', (current, previous) => ...);

state.user.firstname = 'Jane';
// firstname = Jane

unwatch();

state.user.firstname = 'John';
// firstname = Jane
```

## License
[MIT](./LICENSE)
