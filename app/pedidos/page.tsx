'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BoloCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho: string
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pedidoCompleto = {
      bolos: carrinho,
      cliente: dadosCliente
    }
    console.log('Pedido Completo:', pedidoCompleto)
    alert('Pedido enviado com sucesso!')
  }

  const valorTotal = carrinho.reduce((total, item) =>
    total + item.preco * item.quantidade, 0
  )

  const removerBolo = (index: number) => {
    const novoCarrinho = carrinho.filter((_, i) => i !== index)
    setCarrinho(novoCarrinho)
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#ffcbdb' }}>
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/cardapio" 
          className="flex items-center text-pink-700 hover:text-pink-900"
        >
          <ArrowLeft className="mr-2" /> Voltar ao Cardápio
        </Link>
        <h1 className="text-3xl font-bold text-center text-black">Finalizar Pedido</h1>
        <div className="w-8"></div> {/* Placeholder to center the title */}
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg">
        {carrinho.length > 0 && (
          <div className="mb-4">
            <h2 className="text-black font-bold mb-2">Bolos no Pedido:</h2>
            {carrinho.map((bolo, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-pink-50 p-2 rounded mb-2"
              >
                <span className="text-black">
                  {bolo.nome} - {bolo.tamanho}
                  (x{bolo.quantidade})
                  R$ {(bolo.preco * bolo.quantidade).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removerBolo(index)}
                  className="text-red-500 hover:text-red-700"
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

        <div className="mb-4">
          <label className="block mb-2 text-black">Nome Completo</label>
          <input
            type="text"
            value={dadosCliente.nome}
            onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
            className="w-full border rounded p-2 text-black bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Telefone</label>
          <input
            type="tel"
            value={dadosCliente.telefone}
            onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
            className="w-full border rounded p-2 text-black bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Observações</label>
          <textarea
            value={dadosCliente.observacoes}
            onChange={(e) => setDadosCliente({ ...dadosCliente, observacoes: e.target.value })}
            className="w-full border rounded p-2 text-black bg-white"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={carrinho.length === 0}
          className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-600 disabled:opacity-50"
        >
          Finalizar Pedido
        </button>
      </form>
    </div>
  )
}

export default function Pedidos() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PedidosContent />
    </Suspense>
  )
}