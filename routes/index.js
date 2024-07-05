var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer')


passport.use(new localStrategy(userModel.authenticate()));

// GET
//index route
router.get('/', function (req, res) {
  res.render('index');

});

//login route
router.get('/login', function (req, res) {
  res.render('login', { error: req.flash('error') });
});




//profile route
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render('profile', { user });
});

//log out route
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})



//feed route
router.get('/feed', isLoggedIn,async function (req, res,next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts =  await postModel.find()
    .populate("user");
  res.render('feed',{user, posts});
});

//add route
router.get('/add', async function (req, res) {
  res.render('add');
});


//forgot password route
router.get('/forgotpassword', async function (req, res) {
  res.render('forgot');
});



// POST
//forgot password route



//register route
router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});


// login route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) {
});


///upload route
router.post('/createpost', isLoggedIn, upload.single('postImage'), async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image:req.file.filename,
    description: req.body.description,
    title: req.body.title,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

//upload profile image route
router.post('/fileupload', isLoggedIn, upload.single("image"), async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});



//is logged in fnc
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect("/login");
}

module.exports = router;
