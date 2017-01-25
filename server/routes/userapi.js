var User=require('../models/user');
var nodemailer=require('nodemailer');
var sgTransporter = require('nodemailer-sendgrid-transport');
var options={
    auth: { //TODO: Poner el mail designado para esto
        api_user: "jamesokbo",
        api_key: "123Melones"
    }
};
var client = nodemailer.createTransport(sgTransporter(options));

var sendMail=function(emailTo, subject, html, fn){
    var mailOptions={
        from: 'jaime@xoxoc.mx',
        to:emailTo,
        subject:subject,
        html:html
    };
    
    client.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
            fn(error);
     }
     else{
        console.log("Message sent: " + response.message);
        fn(response);
    }
    });
};



module.exports= function(router, passport){
    
    //registro del usuario
    router.post('/signup', function(req, res) {
        console.log('signup: '+req.body.username +' '+ req.body.email + ' '+ req.body.password);
        User.register(new User({ username: req.body.username, email:req.body.email, verified:false, newsletter:req.body.newsletter }),
            req.body.password, function(err, account) {
            if (err) {
              return res.status(500).json({
                err: err
              });
            }
            passport.authenticate('local')(req, res, function () {
                
                return res.status(200).json({
                    status: 'Registration successful!'
              });
            });
        });
    });
    //Login del usuario
    router.post('/login',function(req,res,next){
        passport.authenticate('local', function(err, user, info){
            if(err){
               return next(err);
            } 
            if(!user){
                console.log(user);
                return res.status(401).json({
                err: info
               });
            }
            req.logIn(user, function(err) {
              if (err) {
                return res.status(500).json({
                  err: 'Could not log in user'
                });
              }
              res.status(200).json({
                status: 'Login successful!'
              });
            });
        })(req, res, next);
    });
    //Logout del usuario
    router.get('/logout', function(req, res) {
      console.log('logging Out');
      req.logout();
      res.status(200).json({
        status: 'Bye!'
      });
    });
    //Status del usuario
    router.get('/status', function(req, res) {
        if(!req.isAuthenticated()) {
            return res.status(200).json({
              status: false
            });
        }
        return res.status(200).json({
            status: true
        });
    });
    router.get('/currentUser', function(req,res){
        if(req.isAuthenticated()) {
            console.log(req.user);
            return res.status(200).json(req.user);
        }
        return res.status(200).json({
              _id: ''
        });
    });
    router.get('/verifyEmail', function(req,res){
        if(req.isAuthenticated()) {
            var subject='Verify your email address';
            var link="https://grovemonitor-jamesokbo.c9users.io/verify/:"+req.user._id;
            var html='Hello,<br> Please copy and paste the following address in your addressbar!<br>'+link;
            console.log('Sending verification email to: '+req.user.email);
            sendMail(req.user.email,subject, html,function(response,error){
                if (error){
                    console.log(error);
                    return res.status(400).json({error:error});
                }
                return res.status(200).json(response);
            });
        }
    });
    router.get('/verify/:id', function(req,res){
        var id=req.params.id.slice(1,25);
        console.log(id);
        User.update({_id:id},{$set:{verified:true}},function(err,response){
            if(err){
                throw err;
            }
            console.log(response);
            if(response.ok==1 && response.nModified==1){
                console.log('success!');
                res.render('verifiedSuccess.ejs');    
            }
        });
    });
    
    router.post('/user', function(req,res){
        console.log(req.body);
        var user= new User(); 
        user.name=req.body.name;
        user.email=req.body.email;
        user.password=req.body.password;
        user.save(function(err,data){
            if(err){
               throw err; 
            }
            else{
                console.log("no errors");
                res.json(data);
            }
               
            
        });
    });
    //Obtiene la lista de usuarios
    router.get('/user', function(req, res){
       User.find({}, function(err,data){
           res.json(data);
       }); 
    });
    //Elimina todos los usuarios
    router.delete('/user', function(req,res){
       User.remove({}, function(err,data){
          res.json({result: err ? 'error':'ok'}); 
       });
    });
    router.get('/user/:id', function(req,res){
        User.find({_id:req.params.id}, function(err,data){
           res.json(data);
        });
    });
    router.delete('/user/:id', function(req,res){
       User.remove({_id:req.params.id}, function(err,data){
          res.json({result: err ? 'error':'ok'}); 
       });
    });
    router.post('/user/:id',function(req,res){
        User.findOne({_id:req.params.id},function(err,data){
            var user=data;
            user.name=req.body.name;
            user.email=req.body.email;
            user.password=req.body.password;
            console.log(req.body)
            user.save(function(err,data){
                if(err){
                    throw err; 
                }
                else{
                    console.log("no errors");
                    res.json(data);
                }
            });
        });
    });
    
}