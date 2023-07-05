import { Context } from 'koa'
import { Axios } from '../lib/axios'
import WechatApiType from '../types/api/wechat'

const PrefixUrl = 'https://api.weixin.qq.com'

enum WE_CHAT_METHODS {
    code2Session = '/sns/jscode2session'
}
export class WechatApi {
    private wechatApi: Axios
    constructor(ctx: Context) {
        this.wechatApi = new Axios(PrefixUrl, ctx)
    }

    async code2Session(params: WechatApiType.Code2SessionReq): Promise<WechatApiType.Code2SessionResp> {
        return await this.wechatApi.getInstance().get(WE_CHAT_METHODS.code2Session, {
            params
        })
    }
}