import { Rules } from 'async-validator'
import { Context } from 'koa'
import response from '../../utils/response'
import validate from '../../utils/validate'
import { sign } from '../../utils/auth'
import UserService from '../service/user'


export default new class IndexController {
    async login(ctx: Context) {

    }
}