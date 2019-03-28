let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')

//regex

const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let app=express()

//Moteur de template
app.set('view engine','ejs')



//Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json())
app.use(session({
  secret: 'ravivi',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))


//Routes


app.get('/',(req,res)=>{
    
    let Message = require('./models/message')
    Message.all(function(message){
        res.render('pages/index', {message:message})
    })
    
})

app.post('/',(req,res)=>{
    if(req.body.message === undefined|| req.body.message ==='')
        
        {
            
            req.flash('error',"Mettez un commentaire svp")
            res.redirect('/')
            
        } else if(req.body.name === undefined|| req.body.name === '')
        
        {
            
            req.flash('error',"n'oubliez pas votre nom svp")
            res.redirect('/')
            
        }
     else if(req.body.name.length>=13||req.body.name.length<=4)
        
        {
            
            req.flash('error',"Rentrez un nom d'utilisateur compris entre 4 et 13 lettres")
            res.redirect('/')
            
        }
        else if(req.body.email === undefined|| req.body.email ==='')
        
        {
            
            req.flash('error',"besoin de votre email svp")
            res.redirect('/')
        }
         else if(!emailRegex.test(req.body.email))
        
        {
            
            req.flash('error',"ceci n'est pas un email valide")
            res.redirect('/')
        }
    
    else{
        let Message = require('./models/message')
        var message = req.body.message; 
        var nom = req.body.name;
        var email = req.body.email;
        
        Message.create(message, nom, email, function(){
            req.flash('success',"Merci pour ce commentaire")
            res.redirect('/')
            
        })
    }
    
    
})



app.listen(8081)