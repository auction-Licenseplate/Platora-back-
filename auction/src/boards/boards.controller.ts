import { Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  // 모든 경매 목록 전달
  @Post('/getAllProduct')
  async allInfo() {
    return await this.boardService.getAllInfo();
  }

  // 승인 전
  @Get('/getMyPosts')
  @UseGuards(JwtAuthGuard)
  async getNo(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getMyPots(userId, query);
  }

  // 승인 후
  @Get('/getPosts')
  @UseGuards(JwtAuthGuard)
  async getYes(@Query() query, @Req() req) {
    const userId = req.user.id;
    return await this.boardService.getPosts(userId, query);
  }

  // 관심상품
  @Get('/getMyFavorites')
  @UseGuards(JwtAuthGuard)
  async getFavorite(@Req() req) {
    const userId = req.user.id;
    return await this.boardService.getfavorite(userId);
  }

  // 상세페이지 정보 전달
  @Post('/detail')
  @UseGuards(JwtAuthGuard)
  async detailPage(@Body() body: {id: string}, @Req() req){
    const { id } = body;
    const userId = req.user.id
    return await this.boardService.getDetailInfo(id, userId);
  }

  // 입찰가 갱신
  @Post('/priceupdate')
  async postPrice(@Body() body: {id: number, price: number}){
    const { id, price } = body;
    return await this.boardService.updatePrice(id, price);
  }
}
