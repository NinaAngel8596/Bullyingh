const jwt =require('jsonwebtoken')  
const bcryptjs =require('bcryptjs') 
const conexion = require('../database/db');

const {promisify} =require('util') 

//procedimieto para registrarnos

exports.register = async(req, res)=>{
 
   try {
      const name =req.body.name
      const user =req.body.user
      const pass =req.body.pass
      let passHash = await bcryptjs.hash(pass,8)
      //console.log(passHash)
      conexion.query('INSERT INTO users SET ?', {user:user, name: name, pass:passHash}, (error,results)=>{
         if (error){console.log(error)}
         res.redirect('/')
      })
   } catch (error) {
      console.log (error)
   }

//console.log(passHash)


}

exports.login =async(req, res)=> {
   try {
      const user = req.body.user
      const pass = req.body.pass
      console.log(user+"-"+pass)

      if(!user || !pass){
         res.render('login',{
            alert:true,
            alertTitle:"Advetencia",
            alertMessage: "Ingrese un usuario y password",
            alertIcon:"info",
            showConfirmButton:true,
            timer:8000,
            ruta:"login"
         })
      }else{
         conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) =>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)) ){
               res.render('login', {
                  alert: true,
                  alertTitle: "error",
                  alertMessage: "Usuario y/o Password incorrectas",  // Asegúrate de usar 'alertMessage', no 'alertMenssage'
                  alertIcon: "error",
                  showConfirmButton: true,
                  timer: 6000,
                  ruta: 'login'
              }); 
            }else{
               //iniciode session OK
               const id = results[0].id
               const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                  expiresIn : process.env.JWT_TIEMPO_EXPIRA
               })

               console.log("TOKEN: "+token+" para el USUARIO: "+user)
                  
               const cookiesOptions ={
                  expires : new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000),
                  httpOnly :true
               }
               res.cookie('jwt',token,cookiesOptions)
               res.render('login',{
                  alert:true,
                  alertTitle:"conexion exitosa",
                  alertMessage: "¡LOGIN CORRECTO!",
                  alertIcon:"success",
                  showConfirmButton:false,
                  timer:8000,
                  ruta:''
               })
            
            }
            
         })
      }
   } catch (error) {
      console.log(error)
   }
}

exports.isAuthenticated = async(req, res, next)=>{
   if (req.cookies.jwt){
      try {
         const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
         conexion.query('SELECT * FROM users WHERE id =?',[decodificada.id],(error, results)=>{
            if (!results){return next()}
            req.user = results[0]
            return next()
         })
      } catch (error) {
         console.log(error)
         return next()
      }
   } else{
      res.redirect('/login')
      
   }
}

exports.logout = (req, res)=>{
   res.clearCookie('jwt')
   return res.redirect('/')
}