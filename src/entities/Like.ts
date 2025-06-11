import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity('likes')
export class Like {
    @PrimaryGeneratedColumn()
    likeId: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Post)
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}

