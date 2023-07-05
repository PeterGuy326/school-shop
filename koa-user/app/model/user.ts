import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export default class User extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number
    
    @Column({ field: 'wx_id' })
    wxId!: string

    @Column({ field: 'school_id' })
    schoolId!: number

    @Column
    phone!: string

    @Column({ field: 'created_at' })
    createdAt!: string

    @Column({ field: 'updated_at' })
    updatedAt!: string

    @Column({ field: 'deleted_at' })
    deletedAt!: number
}