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

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
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
      setError(error.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="p-6 border border-gray-300 rounded-lg shadow-lg w-7/12">
        <h1 className="mb-6 text-2xl font-bold text-center">Register</h1>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Telefone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-300"
              required
            />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <button type="button" onClick={handleBack} className="w-full px-4 py-2 font-bold rounded-lg h-12  bg-blue-500 text-white hover:bg-blue-600">
                Voltar
            </button>
            <button type="submit" className="w-full px-4 py-2 font-bold rounded-lg h-12  bg-gray-300 text-gray-800 hover:bg-gray-400">
                Salvar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Register;
