import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))
