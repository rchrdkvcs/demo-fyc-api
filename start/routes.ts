import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const HealthController = () => import('#controllers/health_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/', [HomeController, 'index'])
router.get('/health', [HealthController, 'show'])
router.get('/api/products', [ProductsController, 'index'])

const TweetsController = () => import('#controllers/tweets_controller')

router.resource('/api/tweets', TweetsController).apiOnly()
