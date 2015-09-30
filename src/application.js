import artifacts from './artifacts'
import i18n from './i18n'

var app = artifacts.register('application', {
  properties: [
    {
      name: 'title',
      type: i18n
    }
  ]
})

export default app
