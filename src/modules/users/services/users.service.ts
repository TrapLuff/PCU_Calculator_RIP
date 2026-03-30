import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async register(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.repository.findByLogin(dto.login);
    if (existing) throw new BadRequestException('Пользователь уже существует');

    const user = await this.repository.create({
      login: dto.login,
      password: dto.password,
      fullName: dto.fullName,
      role: 'user',
    });

    return this.toDto(user);
  }

  async auth(dto: AuthUserDto): Promise<{ message: string }> {
    const user = await this.repository.findByLogin(dto.login);

    if (!user || user.password !== dto.password) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    return { message: 'Аутентификация успешна' };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Деавторизация успешна' };
  }

  private toDto(user: any): UserResponseDto {
    return {
      id: user.id,
      login: user.login,
      role: user.role,
      fullName: user.fullName,
    };
  }
}