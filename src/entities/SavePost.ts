import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

// entity để lưu trữ các bài viết đã lưu của user
@Entity('save_post')
export class SavePost {
    @PrimaryGeneratedColumn()
    savePostId: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Post)
    post: Post;
}