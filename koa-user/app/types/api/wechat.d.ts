import { extend } from "lodash"

export interface Code2SessionReq {
	appid: string // 小程序 appId
    secret: string // 小程序 appSecret
    js_code: string // 登录时获取的 code，可通过wx.login获取
    grant_type: string // 授权类型，此处只需填写 authorization_code
}

export interface Code2SessionResp extends Resp {
    session_key: string
    unionid: string
}

interface Resp {
    errcode: number
    errmsg: string
    openid: string
}