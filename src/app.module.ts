import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { LoggerModule } from './logger/logger.module';
import * as process from 'process';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
  imports: [
    // 配置文件校验
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        TYPE: Joi.string().valid('mysql'),
        HOST: Joi.string().ip(),
        PORT: Joi.number().default(3306),
        DATABASE: Joi.string().required(),
        USERNAME: Joi.string().required(),
        PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.TYPE),
          host: configService.get(ConfigEnum.HOST),
          port: configService.get(ConfigEnum.PORT),
          username: configService.get(ConfigEnum.USERNAME),
          password: configService.get(ConfigEnum.PASSWORD),
          database: configService.get(ConfigEnum.DATABASE),
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          entities: [`${__dirname}/**/*.entity.{ts,js}`],
          logging: true,
        } as TypeOrmModuleOptions),
    }),
    UserModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
