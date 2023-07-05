import { Context } from 'koa'
import Schema, { Rules, Values } from "async-validator"

/**
 * 参数校验
 * @param ctx Context
 * @param rules 校验规则
 * @param flag 是否返回完整的错误信息
 * @returns {*}
 */
async function validate<T extends Values>(ctx: Context, rules: Rules, flag: boolean = false): Promise<{ data: T, error: null | any }> {
    const validator = new Schema(rules)
    let data: any = {}

    switch (ctx.method) {
        case 'GET':
            break
        case 'POST':
            data = getFormData(ctx)
            break
        case 'PUT':
            data = getFormData(ctx)
            break
        case 'DELETE':
            break
    }

    return await validator.validate(data).then(() => {
        return {
            data: data as T,
            error: null
        }
    }).catch(err => {
        if (flag) {
            return {
                data: {} as T,
                error: err
            }
        }
        return {
            data: {} as T,
            error: err.errors[0].message
        }
    })
}

function getFormData(ctx: Context) {
    return ctx.request.body
}

export default validate