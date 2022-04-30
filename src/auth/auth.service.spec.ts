import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { AuthUserDto } from './auth-user.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  const usersServiceMock = createMock<UsersService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'test';
      const dto: AuthUserDto = {
        email: 'test@test.test',
        password: password,
      };
      usersServiceMock.create.mockResolvedValue(Promise.resolve(dto as User));
      usersServiceMock.isEmailInUse.mockResolvedValue(false);

      const user: User = await authService.register(dto);

      expect(bcrypt.compareSync(password, user.password)).toBeTruthy();
    });
  });
});
