import { Body, Controller, Delete, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface AuthRequest extends Request{
    user: {id: number};
}

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // 사용자 정보 자동 출력
    @Get('/user-info')
    @UseGuards(AuthGuard('jwt'))
    async userInfo(@Req() req: AuthRequest) {
        const user = req.user;
        return await this.userService.getUserInfo(user.id);
    };

    // 비밀번호 변경 가능 여부 확인
    @Get('/passCheck')
    @UseGuards(JwtAuthGuard)
    async passwordCheck(@Req() req) {
        const user = req.user;
        // console.log(user)
        return await this.userService.passChange(user.id);
    }

    // 이용약관 체크
    @Post('/userCheck')
    async agreeCheck(@Body() body){
        return await this.userService.userAgree(body.user_email, body.term);
    }

    // 회원 탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    async userDelete(@Req() req){
        const user = req.user;
        return await this.userService.userOut(user.id);
    }

    // 공인인증서 저장
    @Post('/certificate')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, '../../uploads'), // 저장할 경로
            filename: (req, file, callback) => {
                const filename = `${Date.now()}_${file.originalname}`;
                callback(null, filename);
            },
        }),
    }))
    async saveCertification(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req){
        console.log(body, '확인용')
        if (!file) {
            return { message: '파일 없음' };
        }

        // 처리 로직
        const userId = req.user.id;
        return await this.userService.saveFile(userId, body, file);
    }
}
