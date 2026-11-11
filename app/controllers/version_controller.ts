import env from '#start/env'

export default class VersionController {
  show() {
    return { version: env.get('APP_VERSION') ?? 'dev' }
  }
}
