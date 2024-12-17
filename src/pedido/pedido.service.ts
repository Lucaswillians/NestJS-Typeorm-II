import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { In, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from './enum/statusPedido.enum';
import { ItemPedidoEntity } from './itemPedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ProdutoEntity } from '../produto/produto.entity';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
 constructor (
  @InjectRepository(PedidoEntity)
  private readonly pedidoRepository: Repository<PedidoEntity>,
  
  @InjectRepository(UsuarioEntity)
  private readonly usuarioRepository: Repository<UsuarioEntity>,

  @InjectRepository(ProdutoEntity)
  private readonly produtoRepository: Repository<ProdutoEntity>
 ) {}

private async buscaUsuario (id) {
  const usuario = await this.usuarioRepository.findOneBy({ id })

  if (usuario === null) throw new NotFoundException('Usuario nao encontrado')
  
  return usuario
}

  private async trataDadosDoPedido(
    dadosDoPedido: CreatePedidoDto,
    produtosRelacionados: ProdutoEntity[],
  ) {
    try {
      for (const itemPedido of dadosDoPedido.itensPedido) {
        const produtoRelacionado = produtosRelacionados.find(
          (produto) => produto.id === itemPedido.produtoId,
        );

        if (!produtoRelacionado) {
          throw new NotFoundException(
            `Produto com ID ${itemPedido.produtoId} não encontrado`,
          );
        }

        if (produtoRelacionado.quantidadeDisponivel <= 0) {
          throw new BadRequestException(
            `Produto "${produtoRelacionado.nome}" está fora de estoque`,
          );
        }

        if (itemPedido.quantidade > produtoRelacionado.quantidadeDisponivel) {
          throw new BadRequestException(
            `Quantidade solicitada do produto "${produtoRelacionado.nome}" indisponível no momento.`,
          );
        }
      }
    } 
    catch (error) {
      console.error('Erro ao processar os dados do pedido:', error.message);
      throw error
    }
  }

async cadastrarPedido (usuarioId: string, dadosDoPedido: CreatePedidoDto) {
  const usuario = await this.buscaUsuario(usuarioId)
  const produtosIds = dadosDoPedido.itensPedido.map((itemPedido) => itemPedido.produtoId)
  const produtosRelacionados = await this.produtoRepository.findBy({ id: In(produtosIds) })
  const pedidoEntity = new PedidoEntity()

  pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO,
  pedidoEntity.usuario = usuario

  await this.trataDadosDoPedido(dadosDoPedido, produtosRelacionados)

  const itensPedidosEntidades = dadosDoPedido.itensPedido.map((itemPedido) => {
    const produtoRelacionado = produtosRelacionados.find((produto) => produto.id === itemPedido.produtoId)

    const itemPedidoEntity = new ItemPedidoEntity()

    itemPedidoEntity.produto = produtoRelacionado!
    itemPedidoEntity.precoVenda = produtoRelacionado!.valor
    itemPedidoEntity.quantidade = itemPedido.quantidade
    itemPedidoEntity.produto.quantidadeDisponivel -= itemPedido.quantidade
    
    return itemPedidoEntity
  })

  const valorTotal = itensPedidosEntidades.reduce((total, item) => { return total + item.precoVenda * item.quantidade }, 0)

  pedidoEntity.itensPedidos = itensPedidosEntidades
  pedidoEntity.valorTotal = valorTotal

  const pedidoCriado = await this.pedidoRepository.save(pedidoEntity)
  return pedidoCriado
}

  async obtemPedidosDeUsuario(usuarioId: string) {
    return this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });
  }

  async atualizaPedido(id: string, dto: UpdatePedidoDto) {
    const pedido = await this.pedidoRepository.findOneBy({ id });

    if (pedido === null) throw new NotFoundException('Pedido nao encontrado')

    Object.assign(pedido, dto);

    return this.pedidoRepository.save(pedido);
  }
}
