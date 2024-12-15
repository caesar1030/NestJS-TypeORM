import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalID: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    eager: true,
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
