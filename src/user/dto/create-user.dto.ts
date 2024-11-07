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
  country?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  postalCode?: string;
}
