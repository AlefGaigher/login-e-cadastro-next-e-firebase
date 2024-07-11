'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    
    try {
      setIsLoading(true);
      await signIn('credentials', {
        email,
        password,
        redirect: false
      });

    }catch(error: any){
      setIsLoading(false);
      setError(error.message);
    }finally{
      setIsLoading(false);
      router.replace('/admin');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl mb-6">Login</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form className="w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="text" 
          name="email" 
          placeholder="Digite seu e-mail" 
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="password" 
          name="password" 
          placeholder="Digite sua senha" 
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        
        <button type="submit" className="h-12 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center justify-center" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
      <div className="mt-4 text-lg text-center">
          Não tem uma conta?{' '}
          <a href="/register"  className="font-medium text-blue-500 hover:text-blue-600">
              Cadastre-se
          </a>
      </div>
    </div>
  )
}
