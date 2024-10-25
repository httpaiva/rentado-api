import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import * as Mustache from 'mustache';
import { GetUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RentService } from 'src/rent/rent.service';

@Controller('template')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly rentService: RentService,
  ) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto, @GetUser() user: User) {
    const template = this.templateService.create(createTemplateDto, user);
    return template;
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return await this.templateService.findAllFromUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Get('/translate/:id')
  async translate(
    @Param() param: { id: string },
    @Query() query: { rent_id: string },
  ) {
    const { id } = param;
    const { rent_id } = query;
    // Template de texto com variáveis
    const template = await this.templateService.findOne(id);

    if (!template) {
      throw new NotFoundException(`Template not found`);
    }

    const rent = await this.rentService.findOne(rent_id);

    if (!rent) {
      throw new NotFoundException(`Rent not found`);
    }

    // Objeto com os valores que serão substituídos nas variáveis
    const data = {
      user_email: template.user.email || '',
      user_firstName: template.user.firstName || '',
      user_lastName: template.user.lastName || '',
      user_document_cpf: template.user.document_cpf || '',
      user_document_rg: template.user.document_rg || '',
      user_nationality: template.user.nationality || '',
      user_birthDate: template.user.birthDate || '',
      user_maritalStatus: template.user.maritalStatus || '',
      user_ocupation: template.user.ocupation || '',

      location_name: rent.location.name || '',
      location_country: rent.location.country || '',
      location_state: rent.location.state || '',
      location_city: rent.location.city || '',
      location_neighborhood: rent.location.neighborhood || '',
      location_street: rent.location.street || '',
      location_number: rent.location.number || '',
      location_complement: rent.location.complement || '',
      location_postalCode: rent.location.postalCode || '',

      rent_initialDate: rent.initialDate || '',
      rent_endDate: rent.endDate || '',
      rent_price: rent.price || '',
      rent_paymentDate: rent.paymentDate || '',

      renter_firstName: rent.renter.firstName || '',
      renter_lastName: rent.renter.lastName || '',
      renter_document_cpf: rent.renter.document_cpf || '',
      renter_document_rg: rent.renter.document_rg || '',
      renter_nationality: rent.renter.nationality || '',
      renter_birthDate: rent.renter.birthDate || '',
      renter_maritalStatus: rent.renter.maritalStatus || '',
      renter_ocupation: rent.renter.ocupation || '',
    };

    // Substitui as variáveis no template pelo valor correspondente
    const output = Mustache.render(template.content, data);

    return output;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
