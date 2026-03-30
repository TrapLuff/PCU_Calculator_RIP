import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '../modules/minio.module';
import { DatabaseModule } from './database.module';

import { ComponentsModule } from '../modules/components/components.module';
import { PowersModule } from '../modules/powers/powers.module';
import { UsersModule } from '../modules/users/users.module';
import { ComponentsPowersModule } from '../modules/components-powers/components-powers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'RIP',
      autoLoadEntities: true,
      synchronize: true,
    }),

    MinioModule,
    DatabaseModule,

    ComponentsModule,
    PowersModule,
    UsersModule,
    ComponentsPowersModule,
  ],
})
export class PsuCalculatorModule {}