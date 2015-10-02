import artifacts from './artifacts'
import application from './application'

export function initialize () {
  artifacts.register('application', application)
}
