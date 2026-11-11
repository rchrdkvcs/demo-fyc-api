import server from '@adonisjs/core/services/server'
import router from '@adonisjs/core/services/router'

server.errorHandler(() => import('#exceptions/handler'))

/**
 * Router middleware run for every matched route: parse JSON request bodies.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware')])
