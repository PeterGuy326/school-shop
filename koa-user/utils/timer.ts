import moment from 'moment'
/**
 * 睡眠函数
 * @param ms 
 * @returns 
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 对时间戳进行日期格式化
 * @param ms 需要被格式化的时间戳
 * @returns 
 */
export function formatDate(ms: number) {
    return ms ? moment(ms).format('YYYY-MM-DD HH:mm:ss') : ''
}