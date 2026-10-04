const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/habitController');

router.use(auth);
router.get('/', c.getHabits);
router.post('/', c.createHabit);
router.post('/samples', c.addSamples);
router.put('/:id', c.updateHabit);
router.put('/:id/complete', c.toggleComplete);
router.delete('/:id', c.deleteHabit);

module.exports = router;
