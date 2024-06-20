export class CreateLocationDto {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  postalCode: string;
  userId: string;
}
