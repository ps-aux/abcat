import { retrier } from './retrier'
import '../log'

const writeConflict = () => {
  const err = new Error()
  err.code = 112
  return Promise.reject(err)
}

describe('retrier', () => {

  const retry = retrier()

  it('tries n times and returns result', async () => {

    const fun = jest.fn()
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(() => Promise.resolve(123))

    const res = await retry(fun, {maxCount: 3, delay: 0})
    expect(fun.mock.calls.length).toBe(3)
    expect(res).toBe(123)
  })

  it('tries max n times then throw an error', async () => {

    const fun = jest.fn()
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(writeConflict)
      .mockImplementationOnce(writeConflict)

    await expect(retry(fun, {maxCount: 2, delay: 0})).rejects.toThrow()
    expect(fun.mock.calls.length).toBe(3)
  })

})