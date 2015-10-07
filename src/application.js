
import i18n from './i18n'
import languages from './languages'

export default {
  properties: [
    {
      name: 'title',
      type: i18n,
      required: true
    }, {
      name: 'languages',
      type: languages,
      required: true
    }
  ]
}
