import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'nvarchar', length: 255 })
    fullName: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ type: 'nvarchar', length: 255, unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ type: 'nvarchar', length: 255 })
    password: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    otp: string;

    @Column({ nullable: true, type: 'datetime' })
    otpGenaratedTime: Date;

    @CreateDateColumn()
    createdAt: Date;
}