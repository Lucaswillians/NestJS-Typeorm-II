import { IsEnum } from 'class-validator';
import { StatusPedido } from '../enum/statuspedido.enum';

export class UpdatePedidoDto {
  @IsEnum(StatusPedido)
  status: StatusPedido;
}