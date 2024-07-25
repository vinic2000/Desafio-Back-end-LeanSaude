export class CreateLogDto {
  payer?: string;
  payee: string;
  action: string;
  value: number;
  error: string;
}
