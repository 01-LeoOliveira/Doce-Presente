'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import bolos from '../../data/bolos.json'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Home } from 'lucide-react'

interface BoloCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho: string
}

function CardapioContent() {
  const searchParams = useSearchParams()
  const [carrinho, setCarrinho] = useState<BoloCarrinho[]>(() => {
    const carrinhoParam = searchParams.get('carrinho')
    if (carrinhoParam) {
      try {
        return JSON.parse(carrinhoParam)
      } catch (error) {
        console.error('Erro ao parsear o carrinho:', error)
        return []
      }
    }
    return []
  })

  const [bolosQuantidade, setBolosQuantidade] = useState<{[key: number]: {quantidade: number, tamanho: string}}>({})

  const atualizarQuantidade = (boloId: number, quantidade: number, tamanho: string) => {
    setBolosQuantidade(prev => ({
      ...prev,
      [boloId]: { quantidade, tamanho }
    }))
  }

  const adicionarAoCarrinho = (bolo: typeof bolos[0]) => {
    const detalhes = bolosQuantidade[bolo.id] || { quantidade: 1, tamanho: '400ml' }
    const boloNoCarrinho: BoloCarrinho = {
      id: bolo.id,
      nome: bolo.nome,
      preco: bolo.preco,
      quantidade: detalhes.quantidade,
      tamanho: detalhes.tamanho
    }

    const carrinhoAtualizado = [...carrinho]
    const indiceExistente = carrinhoAtualizado.findIndex(item => 
      item.id === boloNoCarrinho.id && item.tamanho === boloNoCarrinho.tamanho
    )

    if (indiceExistente > -1) {
      carrinhoAtualizado[indiceExistente].quantidade += boloNoCarrinho.quantidade
    } else {
        carrinhoAtualizado.push(boloNoCarrinho)
    }

    setCarrinho(carrinhoAtualizado)
  }

  const valorTotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0)

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 bg-[#ffcbdb] min-h-screen">
      {/* Botão de Carrinho Flutuante */}
      {carrinho.length > 0 && (
        <Link 
          href={{
            pathname: '/pedidos',
            query: { carrinho: JSON.stringify(carrinho) }
          }}
          className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 bg-pink-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-pink-600 flex items-center text-sm md:text-base"
        >
          <ShoppingCart className="mr-1 md:mr-2 w-4 h-4 md:w-6 md:h-6" />
          {carrinho.length} | R$ {valorTotal.toFixed(2)}
        </Link>
      )}

      <div className="relative flex flex-col items-center justify-center mb-4">
        <Link 
          href="/" 
          className="self-start w-full max-w-xs flex items-center text-pink-700 hover:text-pink-900 mb-2"
        >
          <Home className="mr-2" /> Início
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-pink-600">
          Nossos Bolos de Pote
        </h1>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {bolos.map((bolo) => (
            <div 
              key={bolo.id} 
              className="border rounded-lg overflow-hidden shadow-md bg-pink-50 p-3 md:p-4"
            >
              <Image 
                src={bolo.imagem} 
                alt={bolo.nome}
                width={400}
                height={300}
                className="w-full h-40 md:h-48 object-cover rounded-t-lg"
              />
              <div className="mt-2 md:mt-4">
                <h2 className="text-lg md:text-xl font-semibold text-pink-700">
                  {bolo.nome}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-2">{bolo.descricao}</p>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 space-y-2 sm:space-y-0">
                  <span className="text-base md:text-lg font-bold text-pink-600">
                    R$ {bolo.preco.toFixed(2)}
                  </span>
                  <select 
                    value={(bolosQuantidade[bolo.id]?.tamanho) || '400ml'}
                    onChange={(e) => {
                      const tamanhoSelecionado = e.target.value
                      atualizarQuantidade(bolo.id, 
                        bolosQuantidade[bolo.id]?.quantidade || 1, 
                        tamanhoSelecionado
                      )
                    }}
                    className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                  >
                    {bolo.tamanhos.map(tamanho => (
                      <option key={tamanho} value={tamanho}>
                        {tamanho}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="number"
                    min="1"
                    value={bolosQuantidade[bolo.id]?.quantidade || 1}
                    onChange={(e) => {
                      const quantidade = parseInt(e.target.value)
                      atualizarQuantidade(
                        bolo.id, 
                        quantidade, 
                        bolosQuantidade[bolo.id]?.tamanho || '400ml'
                      )
                    }}
                    className="w-full sm:w-16 border rounded px-2 py-1 text-center text-sm"
                  />
                  <button 
                    onClick={() => adicionarAoCarrinho(bolo)}
                    className="w-full sm:flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600 text-sm"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Cardapio() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Carregando...</div>}>
      <CardapioContent />
    </Suspense>
  )
}