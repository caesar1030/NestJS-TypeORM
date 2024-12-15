import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({});
  }

  @Patch('users/:id')
  async PatchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this.userRepository.save({
      ...user,
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'test@naver.com',
    });
    await this.profileRepository.save({
      profileImg: 'asdf.png',
      user,
    });

    return user;
  }

  @Post('/user/posts')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'test@naver.com',
    });

    await this.postRepository.save({
      title: 'test',
      author: user,
    });

    await this.postRepository.save({
      title: 'test2',
      author: user,
    });

    return user;
  }
}
