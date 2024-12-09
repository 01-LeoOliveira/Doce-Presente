import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#ffcbdb] min-h-screen">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        <Image 
          src="/img/Logo.png" 
          alt="Doce Presente" 
          width={200} 
          height={200} 
          className="mx-auto mb-6 rounded-full"
        />
        <h1 className="text-4xl font-bold mb-4 text-pink-600">Doce Presente</h1>
        <p className="text-xl mb-8 text-gray-700">
          Os melhores bolos de pote da cidade!
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            href="/cardapio" 
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
          >
            Ver Cardápio
          </Link>
          <Link 
            href="/pedidos" 
            className="bg-pink-300 text-white px-6 py-3 rounded-lg hover:bg-pink-400 transition"
          >
            Fazer Pedido
          </Link>
        </div>
      </div>
    </div>
  )
}