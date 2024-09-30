const express = require('express');
const router = express.Router();

const authController =require('../controllers/authController')

// Ruta para el index
router.get('/', authController.isAuthenticated, (req, res) => {
    res.render('index', { user: req.user });
});


// Ruta para el login
router.get('/login', (req, res) => {
    res.render('login',{alert:false})
});

// Ruta para el register
router.get('/register', (req, res) => {
    res.render('register')
});



//router para los metodos formularios

router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/logout',authController.logout)

module.exports = router
