import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity('post_images')
export class PostImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imageUrl: string;

    @Column({ nullable: true })
    caption: string;

    @Column({ default: 0 })
    order: number; // thứ tự hiện thị ảnh trong 1 bài đăng

    @ManyToOne(() => Post, post => post.images, { onDelete: 'CASCADE' })
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
} 