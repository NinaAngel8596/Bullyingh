const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
//comentario
const app = express()

// Seteamos el motor de plantillas
app.set('view engine', 'ejs')

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'))

// Para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' })

// Para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router

app.use('/',require('./routes/router'))

///ELIMINAR EL CACHE PARA QUE NO PUEDA VOLVER CON EL BOTON BACK LUEGO DE QUE HACEMOS LOGOUT
app.use(function(req, res, next){
    if(!req.user)
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});


// Iniciar el servidor
app.listen(3000, () => {
    console.log('SERVER UP running at http://localhost:3000')
})
