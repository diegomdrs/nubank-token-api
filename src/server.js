const app = require('./config/express')

require('dotenv').config()
require('./config/http')(app)
require('./config/swagger')(app)
require('./routes')(app)
