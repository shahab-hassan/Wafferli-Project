const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/login/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  try {

    // LOGIN COMES HERE

    // let user = await User.findOne({ email: emails[0].value });
    // if (!user) {
    //   let username = displayName.split(" ")[0].toLowerCase();
    //   while (await User.findOne({ username })) {
    //     username = username.concat(Math.ceil(Math.random() * 10000));
    //   }
    //   user = await User.create({ googleId: id, username, email: emails[0].value });
    // }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
