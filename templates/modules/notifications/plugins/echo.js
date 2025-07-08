import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useAuthStore } from '@/modules/auth/stores/auth'

const authStore = useAuthStore()

const user = authStore.user
const token = authStore.token
const ecoUrl = import.meta.env.VITE_SERVER_URL
const wsHost = import.meta.env.VITE_REVERB_HOST ?? window.location.hostname
const pusherKey = import.meta.env.VITE_REVERB_KEY ?? 'bae3160ce349d284eace'
const port = import.meta.env.VITE_REVERB_PORT ?? '9000'

const pusherClient = new Pusher(pusherKey, {
  cluster: 'mt1',
  wsHost: wsHost,
  wsPort: port,
  wssPort: port,
  forceTLS: false,
  disableStats: true,
  authEndpoint: `${ecoUrl}broadcasting/auth`,
  auth: { headers: { Authorization: `Bearer ${token}` } },
  enabledTransports: ['ws', 'wss', 'websocket', 'polling', 'flashsocket']
})

const echo = new Echo({
  broadcaster: 'reverb',
  client: pusherClient
})

export default echo
