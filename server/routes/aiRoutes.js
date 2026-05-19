const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/recommendation', auth, aiController.generateRecommendation);
router.get('/dashboard', auth, aiController.getAnalytics);

module.exports = router;
