import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const reviews = await this.prisma.review.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        imageUrl: true,
        selfRating: true,
        usersRating: true,
        likes: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });

    return { reviews };
  }
}
