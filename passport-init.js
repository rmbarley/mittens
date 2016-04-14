var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt');

module.exports = function(passport) {

  // Serialize and deserialize users
  passport.serializeUser(function(user, done) {
    console.log('serializing user:', user.username);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:', user.username);
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
      passReqToCallback: true
    },
    function(req, username, password, done) {
      // check if username in use
      User.findOne({ 'username': username },
        function(err, user) {
          if (err)
            return done(err);
          // Username does not exist
          if (!user) {
            console.log('User Not Found with username ' + username);
            return done(null, false);
          }
          // User exists but wrong password
          if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false); // redirect back to login page
          }
          // Success
          return done(null, user);
        }
      );
    }
  ));

  passport.use('signup', new LocalStrategy({
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({ 'username': username }, function(err, user) {
        if (err) {
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists with username: ' + username);
          return done(null, false);
        } else {
          // if there is no user, create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) {
              console.log('Error in Saving user: ' + err);
              throw err;
            }
            console.log(newUser.username + ' Registration succesful');
            return done(null, newUser);
          });
        }
      });
    }));

  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  };
  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };

};
