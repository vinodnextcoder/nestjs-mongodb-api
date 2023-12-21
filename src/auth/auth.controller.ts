import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response,Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { AuthGuard } from '../common/guards/index';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signIn(signInDto.email, signInDto.password);

    res.cookie('access_token',token.access_token,  {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    
    res.cookie('refresh_token', token.refresh_token,  {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return token;
  }

  // @Public()
  @UseGuards(AuthGuard)
  @Post('/refresh')
  @UseFilters(new HttpExceptionFilter())
  async refreshTokens(
     @Res() request:Request,
     @Res() res: Response
  ) {
    // console.log(request);
    return res.sendStatus(200)
    // return await this.authService.refreshTokens(userId, refreshToken);
  }


}
