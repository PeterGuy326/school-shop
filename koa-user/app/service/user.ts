import UserServiceType from '../types/service/user'
import { IS_DELETED } from '../constant/mysql_base'
import User from '../model/user'
import { aes_decrypt } from '../../utils/aes'
import config from '../config'
import moment from 'moment'

export default new class UserService {
    async register(params: UserServiceType.RegisterReq): Promise<UserServiceType.RegisterResp> {
        return { isOk: true }
    }
}