import axios, { AxiosInstance } from 'axios'
import { accessLogger } from './../logger/index'
import moment from 'moment'
import { Context } from 'koa'
import { formatDate } from '../../utils/timer'

export class Axios {
	private instance: AxiosInstance
	private ctx: Context
	constructor(baseURL: string, ctx: Context) {
		this.ctx = ctx
		this.instance = axios.create({ baseURL })
		this.instance.interceptors.request.use(
			(config: any) => {
				// 在发送请求之前做一些处理，例如记录请求开始时间
				config.metadata = { startTime: formatDate(moment().valueOf()) }
                // 请求开始时，写入日志
				accessLogger.info(`request start:${config.metadata.startTime}|${(this.ctx.zipkinTraceId || {}).traceId}|${config.url}|${config.params || config.data}|耗时:${config.metadata.duration}ms`)
                return config
			},
			(error) => {
				return Promise.reject(error)
			}
		)
		this.instance.interceptors.response.use(
			(response: any) => {
				// 在接收响应后做一些处理，例如记录请求结束时间和响应时间
				const { config } = response
				config.metadata.endTime = formatDate(moment().valueOf())
				config.metadata.duration = moment(config.metadata.endTime).valueOf() - moment(config.metadata.startTime).valueOf()

				// 请求结束时，写入日志
				accessLogger.info(`request end:${config.metadata.endTime}|${(this.ctx.zipkinTraceId || {}).traceId}|${config.url}|${response && response.data}|耗时:${config.metadata.duration}ms`)

				return response
			},
			(error) => {
				// 处理响应错误，例如记录错误信息
				const { config, response } = error
				config.metadata.endTime = formatDate(moment().valueOf())

				// 写入错误日志
				accessLogger.error(`request end:${config.metadata.endTime}|${(this.ctx.zipkinTraceId || {}).traceId}|${config.url}|${response && response.data}`)

				return Promise.reject(error)
			}
		)
	}

    getInstance() {
        return this.instance as AxiosInstance
    }
}
