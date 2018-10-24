import { txManager } from './txManager'
import '../log'

const mockSession = () => {
  const session = {
    startSession: jest.fn(),
    endSession: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn()
  }
  return session
}

describe('tx manager', () => {

  it('commits on success', async () => {

    const session = mockSession()
    const client = {
      startSession: () => session
    }

    const sut = txManager({client})

    const fun = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(123))

    const res = await sut(fun)
    expect(res).toBe(123)

    expect(session.commitTransaction).toHaveBeenCalledBefore(session.endSession)
    expect(session.endSession.mock.calls.length).toBe(1)
    expect(session.commitTransaction.mock.calls.length).toBe(1)
  })

  it('rollbacks on error', async () => {

    const session = mockSession()
    const client = {
      startSession: () => session
    }

    const sut = txManager({client})

    const fun = jest.fn()
      .mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await expect(sut(fun)).rejects.toThrow('fail')
    expect(session.abortTransaction).toHaveBeenCalledBefore(session.endSession)
    expect(session.endSession.mock.calls.length).toBe(1)
    expect(session.abortTransaction.mock.calls.length).toBe(1)
  })

})