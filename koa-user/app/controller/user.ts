import { Context } from 'koa'
import { Rules } from 'async-validator'
import validate from '../../utils/validate'
import response from '../../utils/response'
import UserService from '../service/user'
import UserServiceType from '../types/service/user'

export default new class UserController {
    async register(ctx: Context) {
        const rules: Rules = {
            wx: [
                {
                    type: 'string',
                    required: true,
                    message: '注册时，微信号不能为空'
                }
            ]
        }
        const { data, error } = await validate<UserServiceType.RegisterReq>(ctx, rules)
        if (error !== null) {
            return response.error(ctx, error)
        }
        try {
            const res = await UserService.register(data)
            response.success(ctx, res)
        } catch (err) {
            response.error(ctx, String(err))
        }
    }
}