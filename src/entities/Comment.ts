import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Post)
    post: Post;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}