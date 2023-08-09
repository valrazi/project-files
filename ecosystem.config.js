require('dotenv').config()
module.exports = {
  apps : [{
    name   : `ProjectFiles:${process.env.PORT}`,
    script : "./index.js",
    exec_mode: 'cluster'
  }]
}
