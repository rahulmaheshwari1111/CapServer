const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);


router.get('/login', authController.login_get);


router.post('/login', authController.login_post);


router.delete('/login/:id', authController.delete);


router.put('/login/:id',authController.put);
module.exports = router;