import recompose from '../src/utils'

describe('recompose object value from string keys', () => {
  it('should return value one level deep', () => {
    expect(
      recompose(
        {
          hello: 'world',
        },
        'hello',
      ),
    ).toEqual('world')
  })

  it('should return value two level deep', () => {
    expect(
      recompose(
        {
          hello: {
            world: 'hello',
          },
        },
        'hello.world',
      ),
    ).toEqual('hello')
  })

  it('should return value three level deep', () => {
    expect(
      recompose(
        {
          hello: {
            world: {
              john: 'doe',
            },
          },
        },
        'hello.world.john',
      ),
    ).toEqual('doe')
  })
})
