import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginResponseDto } from './dto/login-response.dto';
import { AuthenticatedUser, JwtPayload } from './auth.interfaces';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CommonService } from 'src/common/common.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    readonly commonService: CommonService,
    private jwtService: JwtService,
  ) { }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthenticatedUser | null> {
    const [user] = await this.userService.query({
      filter: { username: { eq: username } },
      paging: { limit: 1 },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }

    return null;
  }



  async currentUser(authUser: AuthenticatedUser): Promise<UserDto> {
    try {
      const users = await this.userService.query({
        filter: {
          and: [
            {
              id: { eq: authUser.id },
            },
            {
              username: { eq: authUser.username },
            },
          ],
        },
        paging: { limit: 1 },
      });

      if (users.length === 1) {
        return users[0];
      }

      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async login(user: AuthenticatedUser): Promise<LoginResponseDto> {
    const loginUser = await this.userService.userRepository.findOne(user.id, {
      relations: ['role'],
    });

    const payload: JwtPayload = {
      username: loginUser.username,
      sub: loginUser.id,
      role: {
        id: loginUser.role.id,
        name: loginUser.role.name,
        shortname: loginUser.role.shortname,
        access: loginUser.role.access,
      },
    };

    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }

  async updateUser(
    authUser: AuthenticatedUser,
    input: UpdateProfileInput,
  ): Promise<UserDto> {
    const user = await this.userService.getById(authUser.id);

    if (input.password && input.password.length > 0) {
      input.password = this.commonService.passwordHash(input.password);
    } else {
      delete input.password;
    }

    return this.userService.updateOne(user.id, input);
  }
}
