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
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // 아무것도 없을 경우 전부
      // select: {},
      // relations가 설정돼있을 경우
      // select: {
      //   id: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // and 조건
      // where: {
      //   version: 1,
      //   id: 3,
      // },
      // or 조건
      // where: [{ version: 1 }, { id: 3 }],
      // relation이 설정 돼있을 경우
      // where: {
      //   profile: {
      //     id: 3,
      //   },
      // },
      // relations: {
      //   profile: true,
      // },
      // order: {
      //   id: 'ASC',
      // },
      // [skip, skip+take]
      // skip: 1,
      // take: 1,
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
      profile: {
        profileImg: 'asdf.jpg',
      },
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

  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'test 1',
    });

    const post2 = await this.postRepository.save({
      title: 'test 1',
    });

    const tag1 = await this.tagRepository.save({
      name: 'test 1',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'test 2',
      posts: [post1],
    });

    await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
