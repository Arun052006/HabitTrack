const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/authController');

router.post('/register', c.register);
router.post('/login', c.login);
router.post('/logout', c.logout);
router.get('/me', auth, c.me);

module.exports = router;
