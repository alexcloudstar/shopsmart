import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './models/users/user.entity';
import { Address } from './models/addresses/addresses.entity';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Address],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
