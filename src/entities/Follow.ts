import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('follows')
export class Follow {
    @PrimaryGeneratedColumn()
    followId: number;

    @ManyToOne(() => User)
    follower: User; // người theo dõi

    @ManyToOne(() => User)
    following: User; // người được theo dõi

    @CreateDateColumn()
    createdAt: Date;
}