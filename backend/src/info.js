import packageJson from '../package.json'
import { pick } from 'ramda'

export const info = () => pick([
  'version',
  'name'
], packageJson)