'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa';

// Interface para os itens do carrinho
interface BoloCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho: string
}

// Interface para o pedido completo
interface PedidoCompleto {
  bolos: BoloCarrinho[];
  cliente: {
    nome: string;
    telefone: string;
    observacoes?: string;
  };
  pagamento: string;
}

function PedidosContent() {
  const searchParams = useSearchParams()
  const [carrinho, setCarrinho] = useState<BoloCarrinho[]>(() => {
    const carrinhoParam = searchParams.get('carrinho')
    if (carrinhoParam) {
      try {
        const parsedCarrinho = JSON.parse(carrinhoParam)
        return Array.isArray(parsedCarrinho) ? parsedCarrinho : []
      } catch (error) {
        console.error('Erro ao parsear o carrinho:', error)
        return []
      }
    }
    return []
  })

  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    observacoes: ''
  })

  const [metodoPagamento, setMetodoPagamento] = useState('pix')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pedidoCompleto: PedidoCompleto = {
      bolos: carrinho,
      cliente: dadosCliente,
      pagamento: metodoPagamento
    }

    // Preparar mensagem para WhatsApp
    const mensagemWhatsApp = gerarMensagemWhatsApp(pedidoCompleto)
    const telefoneEmpresa = '+5591982690087' // Substitua pelo número real
    const linkWhatsApp = `https://wa.me/${telefoneEmpresa}?text=${encodeURIComponent(mensagemWhatsApp)}`
    
    window.open(linkWhatsApp, '_blank')
  }

  const gerarMensagemWhatsApp = (pedido: PedidoCompleto) => {
    let mensagem = `*Novo Pedido - Doce Presente*\n\n`
    mensagem += `*Nome:* ${pedido.cliente.nome}\n`
    mensagem += `*Telefone:* ${pedido.cliente.telefone}\n\n`
    
    mensagem += `*Itens do Pedido:*\n`
    pedido.bolos.forEach((bolo) => {
      mensagem += `- ${bolo.nome} (${bolo.tamanho}) x${bolo.quantidade}: R$ ${(bolo.preco * bolo.quantidade).toFixed(2)}\n`
    })
    
    mensagem += `\n*Valor Total:* R$ ${pedido.bolos.reduce((total, item) => 
      total + item.preco * item.quantidade, 0).toFixed(2)}\n\n`
    
    mensagem += `*Método de Pagamento:* ${pedido.pagamento.toUpperCase()}\n`
    
    if (pedido.cliente.observacoes) {
      mensagem += `*Observações:* ${pedido.cliente.observacoes}\n`
    }

    return mensagem
  }

  const valorTotal = carrinho.reduce((total, item) =>
    total + item.preco * item.quantidade, 0
  )

  const removerBolo = (index: number) => {
    const novoCarrinho = carrinho.filter((_, i) => i !== index)
    setCarrinho(novoCarrinho)
  }

  return (
    <div 
      className="container mx-auto px-4 py-8 min-h-screen flex flex-col" 
      style={{ backgroundColor: '#ffcbdb' }}
    >
      {/* Cabeçalho responsivo com título centralizado */}
      <div className="relative flex items-center justify-center mb-8">
        <Link 
          href="/cardapio" 
          className="absolute left-0 flex items-center text-pink-700 hover:text-pink-900"
        >
          <ArrowLeft className="mr-2" /> Voltar ao Cardápio
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black">
          Finalizar Pedido
        </h1>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md flex-grow"
      >
        {/* Lista de bolos no pedido */}
        {carrinho.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <h2 className="text-black font-bold mb-2">Bolos no Pedido:</h2>
            {carrinho.map((bolo, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-center bg-pink-50 p-2 rounded mb-2"
              >
                <span className="text-black text-center sm:text-left mb-2 sm:mb-0">
                  {bolo.nome} - {bolo.tamanho}
                  (x{bolo.quantidade})
                  R$ {(bolo.preco * bolo.quantidade).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removerBolo(index)}
                  className="text-red-500 hover:text-red-700 w-full sm:w-auto"
                >
                  Remover
                </button>
              </div>
            ))}
            <div className="text-right font-bold text-black">
              Total: R$ {valorTotal.toFixed(2)}
            </div>
          </div>
        )}

        {/* Campos de formulário com espaçamento e responsividade */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-black">Nome Completo</label>
            <input
              type="text"
              value={dadosCliente.nome}
              onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
              className="w-full border rounded p-2 text-black bg-white focus:ring-2 focus:ring-pink-300"
              required
              placeholder="Digite seu nome"
            />
          </div>
          <div>
            <label className="block mb-2 text-black">Telefone</label>
            <input
              type="tel"
              value={dadosCliente.telefone}
              onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
              className="w-full border rounded p-2 text-black bg-white focus:ring-2 focus:ring-pink-300"
              required
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label className="block mb-2 text-black">Método de Pagamento</label>
            <select
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="w-full border rounded p-2 text-black bg-white focus:ring-2 focus:ring-pink-300"
            >
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-black">Observações</label>
            <textarea
              value={dadosCliente.observacoes}
              onChange={(e) => setDadosCliente({ ...dadosCliente, observacoes: e.target.value })}
              className="w-full border rounded p-2 text-black bg-white focus:ring-2 focus:ring-pink-300"
              rows={4}
              placeholder="Alguma observação especial?"
            />
          </div>
        </div>

        {/* Botão de envio com feedback de toque */}
        <button
          type="submit"
          disabled={carrinho.length === 0}
          className="mt-4 w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600 
                     disabled:opacity-50 flex items-center justify-center 
                     active:scale-95 transition-transform"
        >
          <FaWhatsapp className="mr-2" /> Enviar Pedido pelo WhatsApp
        </button>
      </form>
    </div>
  )
}

export default function Pedidos() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Carregando...</div>}>
      <PedidosContent />
    </Suspense>
  )
}