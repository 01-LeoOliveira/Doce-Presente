'use client'

import { useState } from 'react'
import bolos from '../../data/bolos.json'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface BoloCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho: string
}

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState<BoloCarrinho[]>([])
  const [bolosQuantidade, setBolosQuantidade] = useState<{[key: number]: {quantidade: number, tamanho: string}}>({})

  const atualizarQuantidade = (boloId: number, quantidade: number, tamanho: string) => {
    setBolosQuantidade(prev => ({
      ...prev,
      [boloId]: { quantidade, tamanho }
    }))
  }

  const adicionarAoCarrinho = (bolo: typeof bolos[0]) => {
    const detalhes = bolosQuantidade[bolo.id] || { quantidade: 1, tamanho: '200ml' }
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
      carrinhоAtualizado.push(boloNoCarrinho)
    }

    setCarrinho(carrinhоAtualizado)
  }

  const valorTotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0)

  return (
    <div className="container mx-auto px-4 py-8 bg-[#ffcbdb] min-h-screen">
      {/* Botão de Carrinho Flutuante */}
      {carrinho.length > 0 && (
        <Link 
          href={{
            pathname: '/pedidos',
            query: { carrinho: JSON.stringify(carrinho) }
          }}
          className="fixed bottom-6 right-6 z-50 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 flex items-center"
        >
          <ShoppingCart className="mr-2" />
          {carrinho.length} | R$ {valorTotal.toFixed(2)}
        </Link>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">
          Nossos Bolos de Pote
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          {bolos.map((bolo) => (
            <div 
              key={bolo.id} 
              className="border rounded-lg overflow-hidden shadow-md bg-pink-50 p-4"
            >
              <Image 
                src={bolo.imagem} 
                alt={bolo.nome}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-pink-700">
                  {bolo.nome}
                </h2>
                <p className="text-gray-600 mb-2">{bolo.descricao}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-pink-600">
                    R$ {bolo.preco.toFixed(2)}
                  </span>
                  <select 
                    value={(bolosQuantidade[bolo.id]?.tamanho) || '200ml'}
                    onChange={(e) => {
                      const tamanhoSelecionado = e.target.value
                      atualizarQuantidade(bolo.id, 
                        bolosQuantidade[bolo.id]?.quantidade || 1, 
                        tamanhoSelecionado
                      )
                    }}
                    className="border rounded px-2 py-1"
                  >
                    {bolo.tamanhos.map(tamanho => (
                      <option key={tamanho} value={tamanho}>
                        {tamanho}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="number"
                    min="1"
                    value={bolosQuantidade[bolo.id]?.quantidade || 1}
                    onChange={(e) => {
                      const quantidade = parseInt(e.target.value)
                      atualizarQuantidade(
                        bolo.id, 
                        quantidade, 
                        bolosQuantidade[bolo.id]?.tamanho || '200ml'
                      )
                    }}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button 
                    onClick={() => adicionarAoCarrinho(bolo)}
                    className="flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
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