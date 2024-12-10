import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#ffcbdb] min-h-screen flex items-center justify-center">
      <div className="text-center bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <Image 
          src="/img/Logo.png" 
          alt="Doce Presente" 
          width={200} 
          height={200} 
          className="mx-auto mb-4 md:mb-6 rounded-full w-32 md:w-48 h-32 md:h-48 object-cover"
        />
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-pink-600">
          Doce Presente
        </h1>
        <p className="text-base md:text-xl mb-4 md:mb-8 text-gray-700 px-2">
          Os melhores bolos de pote da cidade!
        </p>
        
        <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
          <Link 
            href="/cardapio" 
            className="bg-pink-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-pink-600 transition text-center"
          >
            Ver Cardápio
          </Link>
          <Link 
            href="/pedidos" 
            className="bg-pink-300 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-pink-400 transition text-center"
          >
            Fazer Pedido
          </Link>
        </div>
      </div>
    </div>
  )
}