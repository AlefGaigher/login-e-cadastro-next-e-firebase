'use client'
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'

const Register = () => {
  const router = useRouter()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name  
      });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
      });

      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="p-6 w-11/12 md:w-5/12">
        <h1 className="mb-6 text-2xl font-bold text-center">Cadastrar</h1>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              placeholder="Digite seu nome" 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              placeholder="Digite seu e-mail" 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              value={phone}
              placeholder="Digite seu telefone" 
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              placeholder="Digite sua senha" 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={confirmPassword}
              placeholder="Repita sua senha" 
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className='grid grid-cols-2 gap-5 mt-10'>
            <button type="button" onClick={handleBack} className="w-full px-4 py-2 font-bold rounded-lg h-12  bg-blue-500 text-white hover:bg-blue-600">
                Voltar
            </button>
            <button type="submit" className="w-full px-4 py-2 font-bold rounded-lg h-12 bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center justify-center" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>   
        </form>
      </div>
    </div>
  );
};

export default Register;
