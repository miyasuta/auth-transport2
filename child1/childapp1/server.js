const express = require('express')
const app = express();
const xssec = require('@sap/xssec')
const xsenv = require('@sap/xsenv')
const passport = require('passport')
const JWTStrategy = xssec.JWTStrategy
xsenv.loadEnv();
const UAA_CREDENTIALS = xsenv.getServices({xsuaa: {tag: 'xsuaa'}}).xsuaa
passport.use('JWT', new JWTStrategy(UAA_CREDENTIALS))
app.use(passport.initialize())
app.use(express.json())

// start server
app.listen(process.env.PORT)

// Endpoint to be called by frontend app
app.get('/endpoint', passport.authenticate('JWT', {session: false}), (req, res) => {
    const auth = req.authInfo  
    if (! auth.checkScope(UAA_CREDENTIALS.xsappname + '.Admin')) {
        res.status(403).end('Forbidden. Missing authorization.')
    }      

    res.json({'jwtToken': auth.getAppToken()})
})