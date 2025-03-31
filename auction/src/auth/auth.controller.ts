import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API
  @Post('/signup')
  async signUp(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      phone: string;
    },
  ) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.name,
      body.phone,
    );
  }

  // 로컬 로그인 API
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: any, @Res() res: any) {
    const { id, email, token } = req.user;
    if (!token) {
      return { message: '로그인 실패' };
    }

        // 쿠키에 토큰 저장
        res.cookie('accessToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1일 유지
        });
  
        // 로그인 성공 응답
        return res.json({ message: '로그인 성공', id, email });
    }

    // 쿠키에서 토큰 꺼내기
    @Get('/tokenCheck')
    @UseGuards(AuthGuard('jwt'))
    async tokenCheck(@Req() req: Request) {
        if (!req.cookies || !req.cookies.access_token) {
            throw new UnauthorizedException('쿠키가 없음');
        }
        return { message: "로그인 유지됨", token: req.user };    
    }
    
    // 카카오 로그인 API
    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin(@Req() req: Request){
        // 카카오 로그인 페이지로 자동 리다이렉트
    }

  // 네이버 로그인 API
  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(@Req() req: Request) {
    // 네이버 로그인 페이지로 자동 리다이렉트
  }

  // 구글 로그인 API
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // 구글 로그인 페이지로 자동 리다이렉트
  }

  // sns 로그인 타입 구별
  @Post('login/:type')
  async socialLogin(@Param('type') type: string, @Res() res: Response ,@Body() body: { code: string }) {
    console.log(`프론트에서 받은타입 ${type}`);
    console.log(`프론트에서 받은코드 ${body.code}`);
    let user;

    if (type === 'kakao') {
      user = await this.authService.kakaoUser(body.code);
    }
    if (type === 'naver') {
      user = await this.authService.naverUser(body.code);
    }
    if (type === 'google') {
      user = await this.authService.googleUser(body.code);
    }

    if (!user) {
      return { message: '200 소셜로그인 실패' };
    }

    // jwt 토큰 발급
    const token = await this.authService.snsToken(user);

    // 쿠키에 저장
    res.cookie('accessToken', token.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1시간
    });

    res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.json({ message: '로그인 성공' });
  }

  // 아이디 찾기
  @Post('/findID')
  async userID(@Body() body: { name: string; phone: string }) {
    return await this.authService.findId(body.name, body.phone);
  }

  // 비밀번호 찾기
  @Post('/findpw')
  async userPW(@Body() body) {
    const { email, phone } = body;
    return await this.authService.findPW(email, phone);
  }
}
