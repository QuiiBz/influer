import influer from '../src';

describe('default function', () => {
  it('should be defined', () => {
    expect(influer).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof influer).toEqual('function');
  });
});

describe('state', () => {
  const initialState = {
    hello: 'world',
  };

  it('should be defined', () => {
    const { state } = influer(initialState);
    expect(state).toBeDefined();
  });

  it('should be the same state', () => {
    const { state } = influer(initialState);
    expect(state).toEqual(initialState);
  });
});

describe('watch', () => {
  const initialState = {
    hello: 'world',
  };

  it('should be defined', () => {
    const { watch } = influer(initialState);
    expect(watch).toBeDefined();
  });

  it('should be a function', () => {
    const { watch } = influer(initialState);
    expect(typeof watch).toEqual('function');
  });

  it('should not watch if state is not modified', () => {
    const { watch } = influer(initialState);
    const watcher = jest.fn();

    watch('hello', watcher);

    expect(watcher).not.toHaveBeenCalled();
  });

  it('should watch one level deep', () => {
    const { state, watch } = influer(initialState);
    const watcher = jest.fn();

    watch('hello', watcher);

    state.hello = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'world');
  });

  it('should watch two level deep', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    watch('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');
  });

  it('should watch three level deep', () => {
    const { state, watch } = influer({
      hello: {
        world: {
          john: 'doe',
        },
      },
    });
    const watcher = jest.fn();

    watch('hello.world.john', watcher);

    state.hello.world.john = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'doe');
  });

  it('should watch two level deep only on specified value', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    watch('hello.world', watcher);

    state.hello = { world: 'updated' };
    expect(watcher).not.toHaveBeenCalled();
  });

  it('should watch multiple values', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
      user: 'john',
    });
    const helloWorldWatcher = jest.fn();
    const userWatcher = jest.fn();

    watch('hello.world', helloWorldWatcher);
    watch('user', userWatcher);

    state.hello.world = 'updated';
    state.user = 'jane';

    expect(helloWorldWatcher).toHaveBeenCalledWith('updated', 'hello');
    expect(userWatcher).toHaveBeenCalledWith('jane', 'john');
  });

  it('should watch multiple times', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    watch('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');

    state.hello.world = 'modified';
    expect(watcher).toHaveBeenCalledWith('modified', 'updated');
  });

  it('should modify the state', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    watch('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');
    expect(state.hello.world).toEqual('updated');
  });

  it('should modify the state with the returned value from the watcher', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn().mockReturnValue('mock-updated');

    watch('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');
    expect(state.hello.world).toEqual('mock-updated');
  });
});

describe('watchOnce', () => {
  const initialState = {
    hello: 'world',
  };

  it('should be defined', () => {
    const { watchOnce } = influer(initialState);
    expect(watchOnce).toBeDefined();
  });

  it('should be a function', () => {
    const { watchOnce } = influer(initialState);
    expect(typeof watchOnce).toEqual('function');
  });

  it('should watch once', () => {
    const { state, watchOnce } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    watchOnce('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');

    state.hello.world = 'modified';
    expect(watcher).not.toHaveBeenCalledWith('modified', 'updated');
  });
});

describe('unwatch', () => {
  const initialState = {
    hello: 'world',
  };

  it('should be defined on watch', () => {
    const { watch } = influer(initialState);
    const unwatch = watch('hello', () => undefined);

    expect(unwatch).toBeDefined();
  });

  it('should be defined on watchOnce', () => {
    const { watchOnce } = influer(initialState);
    const unwatch = watchOnce('hello', () => undefined);

    expect(unwatch).toBeDefined();
  });

  it('should be a function on watch', () => {
    const { watch } = influer(initialState);
    const unwatch = watch('hello', () => undefined);

    expect(typeof unwatch).toEqual('function');
  });

  it('should be a function on watchOnce', () => {
    const { watchOnce } = influer(initialState);
    const unwatch = watchOnce('hello', () => undefined);

    expect(typeof unwatch).toEqual('function');
  });

  it('should watch multiple times until unwatch is called', () => {
    const { state, watch } = influer({
      hello: {
        world: 'hello',
      },
    });
    const watcher = jest.fn();

    const unwatch = watch('hello.world', watcher);

    state.hello.world = 'updated';
    expect(watcher).toHaveBeenCalledWith('updated', 'hello');

    state.hello.world = 'modified';
    expect(watcher).toHaveBeenCalledWith('modified', 'updated');

    unwatch();

    state.hello.world = 're-updated';
    expect(watcher).not.toHaveBeenCalledWith('re-updated', 'modified');
  });
});
