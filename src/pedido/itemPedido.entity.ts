import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { PedidoEntity } from './pedido.entity';
import { ProdutoEntity } from '../produto/produto.entity';

@Entity({ name: 'itens_pedidos' })
export class ItemPedidoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantidade', nullable: false })
  quantidade: number;

  @Column({ name: 'preco_venda', nullable: false })
  precoVenda: number;

  @ManyToOne(() => PedidoEntity, (pedido) => pedido.itensPedidos, {
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
  })
  pedido: PedidoEntity

  @ManyToOne(() => ProdutoEntity, (produto) => produto.itensPedidos, {
    cascade: ['update']
  })
  produto: ProdutoEntity
}
