const io = require('@pm2/io')

const realtimeUsers = io.metric({
  name: 'Realtime Users',
  id: 'app/realtime/users'
})

realtimeUsers.set()

const currentReqs = io.counter({
  name: 'Realtime request count',
  id: 'app/realtime/requests'
})

// currentReqs.inc()
// currentReqs.dec()

/*
  count number of messages sent by users
  number of commands used
  number of rss/reddit and whatever found
  free games
*/