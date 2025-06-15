import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('follows')
export class Follow {
    @PrimaryGeneratedColumn()
    followId: number;

    @ManyToOne(() => User)
    follower: User; // người theo dõi bạn

    @ManyToOne(() => User)
    following: User; // người bạn theo dõi

    @CreateDateColumn()
    createdAt: Date;
}