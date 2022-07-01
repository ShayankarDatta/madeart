const express = require('express')
const config = require('./config.json')
var path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')




global.models = {};
const DBConnection = require('./config/db')

// Connect to Database
DBConnection();
const { auth, apiAuth } = require('./middleware/auth')
const app = express()

// Port Number
const port = config.PORT || 8080

// CORS Middleware
app.use(cors())

// Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middliware
// app.use(bodyParser.json())
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: '5mb', extended: true }));

// api auth middle errors
// app.use(apiAuth)

const apiRoute = require('./route/api')
apiRoute(app)

app.get('/', (req, res) => {
    res.send('Invalid endpoint!')
})

app.listen(port, () => {
    console.log('Listen : ' + port)
})