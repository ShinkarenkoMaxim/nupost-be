import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  private defaultSelection = {
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
  };

  async findAll() {
    const reviews = await this.prisma.review.findMany({
      select: this.defaultSelection,
    });

    return { reviews };
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: {
        ...this.defaultSelection,
        pieceOfArt: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    return review;
  }
}
