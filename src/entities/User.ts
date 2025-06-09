import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'nvarchar', length: 255 })
    name: string;

    @Column({ type: 'nvarchar', length: 255 })
    email: string;


    @Column({ type: 'nvarchar', length: 255 })
    password: string;

    @Column({ default: true })
    isActive: boolean;
}