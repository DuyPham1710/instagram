import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { PostImage } from "./PostImage";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column({ nullable: true })
    caption: string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => PostImage, postImage => postImage.post, { cascade: true })
    images: PostImage[];

    @CreateDateColumn()
    createdAt: Date;
}   