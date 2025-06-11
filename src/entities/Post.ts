import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    contentUrl: string;

    @Column({ nullable: true })
    caption: string;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}