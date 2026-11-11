import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const HealthController = () => import('#controllers/health_controller')
const ReadyController = () => import('#controllers/ready_controller')
const TweetsController = () => import('#controllers/tweets_controller')

router.get('/', [HomeController, 'index'])
router.get('/health', [HealthController, 'show'])
router.get('/ready', [ReadyController, 'show'])

router.resource('/api/tweets', TweetsController).apiOnly()
