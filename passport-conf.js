const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");

const { User } = require("./models.js");

function configurePassport(passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) return done(null, false);
        else if (await bcrypt.compare(password, user.password))
          return done(null, user);

        return done(null, false);
      } catch (e) {
        return done(e);
      }
    })
  );

  // Save user's id in the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Retrieve the user object from the session
  passport.deserializeUser(async function (id, done) {
    const user = await User.findByPk(id);
    done(null, user);
  });
}

module.exports = configurePassport;
