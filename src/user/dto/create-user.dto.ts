export class CreateUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  document_cpf?: string;
  document_rg?: string;
  nationality?: string;
  birthDate?: Date;
  maritalStatus?: string;
  ocupation?: string;
}
