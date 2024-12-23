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
import {
  Between,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
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

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    const user1 = this.userRepository.create({
      email: 'test@naver.com',
    });

    const user2 = await this.userRepository.save(user1);

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저장하진 않음
    const user3 = await this.userRepository.preload({
      id: 101,
      email: 'test3@naver.com',
    });

    // delete
    await this.userRepository.delete(101);

    // 값 증가시키기
    await this.userRepository.increment(
      {
        id: 1,
      },
      'count',
      2,
    );

    // 값 감소시키기
    await this.userRepository.decrement(
      {
        id: 1,
      },
      'count',
      2,
    );

    // 갯수 카운팅하기
    const count = await this.userRepository.count({
      where: {
        email: ILike('%0%'),
      },
    });

    // sum
    const sum = await this.userRepository.sum('count', {
      id: LessThan(4),
    });

    // average
    const average = await this.userRepository.average('count', {
      id: LessThan(4),
    });

    // minimum
    const min = await this.userRepository.minimum('count', {
      id: LessThan(4),
    });

    // maximum
    const max = await this.userRepository.maximum('count', {
      id: LessThan(4),
    });

    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // where: { id: Not(1) },
      // where: { id: LessThan(30) },
      // where: { id: LessThanOrEqual(30) },
      // where: {
      //   id: MoreThan(30),
      // },
      // where: {
      //   id: MoreThanOrEqual(30),
      // },
      // where: {
      // email: Like('%google%'),
      // email: ILike('%GOOGLE%'),
      // },
      // where: {
      //   // id: Between(10, 20),
      //   // id: In([1, 3, 5, 7]),
      // },
      where: {
        id: IsNull(),
      },
      order: { id: 'ASC' },
    });
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `test-${i}@google.com`,
      });
    }

    return;
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
