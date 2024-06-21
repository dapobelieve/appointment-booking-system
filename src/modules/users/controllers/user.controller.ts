import { BadRequestException, Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { AuthType } from '../../iam/authentication/enums/auth-type.enums';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import { UpdateUserDto } from '../../iam/authentication/dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerApiTagsEnum } from '../../common/enums/role.enum';

@ApiTags(SwaggerApiTagsEnum.AUTHENTICATION)
@Controller('v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    type: User,
  })
  @Auth(AuthType.Bearer)
  @Get('me')
  async me(@ActiveUser('id') authUserId: any): Promise<Partial<User>> {
    return this.userService.me(authUserId);
  }

  // @Auth(AuthType.Bearer)
  // @Patch('users/update/:id')
  // async update(
  //   @ActiveUser() authUserData: User,
  //   @Param('id') userId: string,
  //   @Body() data: UpdateUserDto,
  // ) {
  //   const { id: _id, role } = authUserData;
  //   if (_id !== userId) {
  //     throw new BadRequestException('Profile not found');
  //   }
  //   return this.userService.update(userId, data);
  // }
}
