import Chance from 'chance'

const chance = new Chance(Date.now())

export const randomPick = events => {

  const total = events.reduce((acc, e) => acc + e.p, 0)

  if (total > 100)
    throw new Error('Probability count > than 100')

  const num = chance.integer({min: 1, max: 100})

  let acc = 0

  for (let i = 0; i < events.length; i++) {
    const {value, p} = events[i]
    acc = acc + p
    if (acc >= num)
      return value
  }

  return null
}