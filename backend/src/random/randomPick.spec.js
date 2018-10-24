import { randomPick } from './randomPick'
import { groupBy, range } from 'ramda'

const expectWithinRange = (val, min, max) => {
  expect(val).toBeGreaterThan(min)
  expect(val).toBeLessThan(max)
}

describe('randomPick', () => {

  it('disallows total probability > 100', () => {
    expect(() => {
      const sut = randomPick([{p: 40},
        {p: 40}, {p: 40}])
    }).toThrow()
  })

  it('distribution is reasonable', () => {
    const events = [{p: 60, value: 'a'},
      {p: 30, value: 'b'},
      {p: 10, value: 'c'}]

    const selections = groupBy(
      x => x,
      range(0, 1000).map(() => randomPick(events)))

    expectWithinRange(selections.a.length, 520, 670)
    expectWithinRange(selections.b.length, 250, 350)
    expectWithinRange(selections.c.length, 80, 120)
  })
})