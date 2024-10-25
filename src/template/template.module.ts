import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from 'src/rent/entities/rent.entity';
import { UserModule } from 'src/user/user.module';
import { RentModule } from 'src/rent/rent.module';
import { Template } from './entities/template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template, User, Rent]),
    UserModule,
    RentModule,
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
