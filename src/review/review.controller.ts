import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('/')
  getReviews() {
    return this.reviewService.findAll();
  }

  @Get('/:id')
  getReview(@Param('id') id: string) {
    return this.reviewService.findOne(parseInt(id));
  }
}
