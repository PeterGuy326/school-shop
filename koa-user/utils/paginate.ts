import { Model } from 'sequelize-typescript'
function paginate<T extends Model[]>(data: T, currentPage: number = 1, total: number = 0, limit: number = 15) {
    return {
        data,
        currentPage,
        total,
        totalPage: Math.ceil(total / limit),
        limit
    }
}
export default paginate