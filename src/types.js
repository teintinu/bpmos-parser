import artifact from './artifact'

var app = artifact.register('application', {
  properties: [
    {
      title: {
        type: i18n
      }
    }
  ]
})

var i18n = {

}

export default app
