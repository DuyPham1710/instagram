import { Expose } from 'class-transformer';

export default class UserResponseDto {
    @Expose()
    userId: number;

    @Expose()
    fullName: string;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    avatarUrl?: string;

    @Expose()
    bio?: string;

    @Expose()
    isActive: boolean;

    @Expose()
    createdAt: Date;

    // @Expose()
    // password: string;
}
