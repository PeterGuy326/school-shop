import run from './app'
import config from './app/config'
import colors from 'colors'

console.log(config)
run(config.server.port)
console.log(colors.green(`[app] Server running port at ${config.server.port}`))