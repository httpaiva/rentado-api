export class CreateRenterDto {
  id: string;
  firstName: string;
  lastName: string;
  document_cpf: string;
  document_rg: string;
  nationality?: string;
  birthDate?: Date;
  maritalStatus?: string;
  ocupation?: string;
}
