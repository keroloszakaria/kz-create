import notification from '../assets/svg/notification.svg?raw'
import calendar from '../assets/svg/calendar.svg?raw'
import clock from '../assets/svg/clock.svg?raw'

export const icons = {
  notification,
  calendar,
  clock
}

export default {
  install(app) {
    app.config.globalProperties.icons = icons
  }
}
