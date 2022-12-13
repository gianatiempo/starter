export const ROLE = {
  USER: 'User',
  MANAGER: 'Manager',
}

export const dateFormat = 'YYYY/MM/DD'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
export const ars = v => new Intl.NumberFormat('es', { style: 'currency', currency: 'ARS' }).format(v)
export const bill = (min, max, total) => {
  let myTotal = 0
  const myValues = []
  while (myTotal < total) {
    const rnd = random(min, max)
    myTotal += rnd
    myValues.push(rnd)
  }
  myValues[myValues.length - 1] += total - myTotal
  myTotal += total - myTotal
  const last = myValues[myValues.length - 1]

  if (last < min) {
    delete myValues[myValues.length - 1]
    const eachAdd = last / myValues.length - 1
    myValues.map(val => val + eachAdd)
  }

  return myValues
}
