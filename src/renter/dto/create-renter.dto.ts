export class CreateRenterDto {
  id: string;
  fisrtName: string;
  lastName: string;
  document_cpf: string;
  document_rg: string;
  nationality?: string;
  birthDate?: string;
  maritalStatus?: string;
  ocupation?: string;
}
