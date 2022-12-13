import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { rest } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { ROLE } from '../utils'

dayjs.extend(isBetween)

export let users = [
  { id: '1', name: 'Mister Manager', role: ROLE.MANAGER, username: 'manager', password: '1234' },
  { id: '2', name: 'Mister User', role: ROLE.USER, username: 'user', password: '12345' },
]
export let bikes = [
  { id: '1', model: 'Super', color: 'Green', location: '42 Lincoln St', rating: 5, available: false, reservations: [] },
  { id: '2', model: 'Mega', color: 'Red', location: '42 Random St', rating: 3.5, available: true, reservations: ['1'] },
]

export let reservations = [{ id: '1', bikeId: '2', userId: '2', range: ['2022.12.10', '2022.12.12'] }]

let me = null

export const handlers = [
  //user endpoints
  ...[
    rest.post('/user/login', (req, res, ctx) => {
      const { username, password } = req.body

      const user = users.find(u => u.username === username)

      if (user && user.password === password) {
        me = user
        return res(ctx.delay(), ctx.status(200), ctx.json(user))
      }
      return res(ctx.delay(), ctx.status(403), ctx.json({ message: 'Failed to authenticate!' }))
    }),

    rest.post('/user/logout', (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json({ message: 'Successfully logged out!' }))
    }),

    rest.post('/user/register', (req, res, ctx) => {
      const { username, password, confirm } = req.body

      if (username && password === confirm) {
        const newUser = { name: username, role: ROLE.USER, id: uuidv4(), username, password }
        me = newUser
        users.push(newUser)
        return res(ctx.delay(), ctx.status(200), ctx.json(newUser))
      }
      return res(ctx.delay(), ctx.status(403), ctx.json({ message: 'Failed to authenticate!' }))
    }),

    rest.get('/user/me', (req, res, ctx) => {
      const isLoggedIn = me !== null

      return !isLoggedIn
        ? res(ctx.delay(), ctx.status(403), ctx.json({ message: 'Not authorized' }))
        : res(ctx.delay(), ctx.status(200), ctx.json(me))
    }),

    rest.post('/user', (req, res, ctx) => {
      let data = req.body
      const newUser = { ...data, id: uuidv4(), role: ROLE[data.role.toUpperCase()] }
      users.push(newUser)
      return res(ctx.delay(), ctx.status(200), ctx.json(newUser))
    }), //CREATE

    rest.get('/user', (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json(users))
    }), //READ

    rest.patch('/user/:userId', (req, res, ctx) => {
      const { userId } = req.params
      users = users.map(u =>
        u.id !== userId ? u : { ...u, ...req.body, role: req.body.role ? ROLE[req.body.role.toUpperCase()] : u.role },
      )
      return res(ctx.delay(), ctx.status(200), ctx.json(bikes))
    }), //UPDATE

    rest.delete('/user/:userId', (req, res, ctx) => {
      const { userId } = req.params

      users = users.filter(b => b.id !== userId)
      return res(ctx.delay(), ctx.status(200), ctx.json(users))
    }), //DELETE
  ],

  //bike endpoints
  ...[
    rest.get('/bike/availability/:start/:end', (req, res, ctx) => {
      const { start, end } = req.params // 2022.06.29 <--> 2022.06.29

      const availableBikes = bikes
        .filter(b => b.available)
        .filter(b => isAvailableInRange(b, start.replace(/\./g, '/'), end.replace(/\./g, '/')))

      return res(ctx.delay(), ctx.status(200), ctx.json(availableBikes))
    }),

    rest.post('/bike', (req, res, ctx) => {
      let data = req.body
      const newBike = { ...data, id: uuidv4(), rating: 5, reservations: [] }
      bikes.push(newBike)
      return res(ctx.delay(), ctx.status(200), ctx.json(newBike))
    }), //CREATE

    rest.get('/bike', (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json(bikes))
    }), //READ

    rest.patch('/bike/:bikeId', (req, res, ctx) => {
      const { bikeId } = req.params
      bikes = bikes.map(b => (b.id !== bikeId ? b : { ...b, ...req.body }))
      return res(ctx.delay(), ctx.status(200), ctx.json(bikes))
    }), //UPDATE

    rest.delete('/bike/:bikeId', (req, res, ctx) => {
      const { bikeId } = req.params

      bikes = bikes.filter(b => b.id !== bikeId)
      return res(ctx.delay(), ctx.status(200), ctx.json(bikes))
    }), //DELETE
  ],

  //reservation endpoints
  ...[
    rest.post('/reservation', (req, res, ctx) => {
      const reservation = req.body

      reservation.id = uuidv4()
      reservations.push(reservation)
      bikes.find(b => b.id === reservation.bikeId).reservations.push(reservation.id)

      return res(ctx.delay(), ctx.status(200), ctx.json(reservation))
    }), //CREATE

    rest.get('/reservation/user/:userId', (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json(getUserReservations(req.params.userId)))
    }), //READ

    rest.get('/reservation/bike/:bikeId', (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json(getBikeReservations(req.params.bikeId)))
    }), //READ

    rest.delete('/reservation/:reservationId', (req, res, ctx) => {
      const { reservationId } = req.params // 2022.06.29 <--> 2022.06.29

      const reservation = reservations.filter(r => r.id === reservationId)[0]
      bikes = bikes.map(b =>
        b.id === reservation.bikeId ? { ...b, reservations: b.reservations.filter(rid => rid !== reservationId) } : b,
      ) // remove reservation from bike
      reservations = reservations.filter(r => r.id !== reservationId) //remove reservation
      return res(ctx.delay(), ctx.status(200), ctx.json(reservations))
    }), //DELETE
  ],
]

//AUX functions for "backend"
const isAvailableInRange = (b, desiredStart, desiredEnd) => {
  let resp = true
  b.reservations.forEach(reservationId => {
    const reservation = reservations.find(r => r.id === reservationId)
    const rangeStart = reservation.range[0].replace(/\./g, '/')
    const rangeEnd = reservation.range[1].replace(/\./g, '/')
    const startOnBookedRange = dayjs(desiredStart).isBetween(rangeStart, rangeEnd, undefined, '[]')
    const endOnBookedRange = dayjs(desiredEnd).isBetween(rangeStart, rangeEnd, undefined, '[]')
    const startBeforeEndAfter =
      dayjs(desiredStart).isBefore(rangeStart, 'day') && dayjs(desiredEnd).isAfter(rangeEnd, 'day')

    if (startOnBookedRange || endOnBookedRange || startBeforeEndAfter) {
      resp = false
    }
  })
  return resp
}

const getUserReservations = userId => {
  return reservations
    .filter(r => r.userId === userId)
    .map(r => ({
      id: r.id,
      userId: r.userId,
      range: r.range,
      bikeId: r.bikeId,
      model: bikes.find(b => b.id === r.bikeId).model,
      rating: bikes.find(b => b.id === r.bikeId).rating,
    }))
}

const getBikeReservations = bikeId => {
  return reservations
    .filter(r => r.bikeId === bikeId)
    .map(r => ({
      id: r.id,
      user: users.find(u => u.id === r.userId).name,
      range: r.range,
    }))
}
