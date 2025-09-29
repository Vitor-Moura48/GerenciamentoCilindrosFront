"use client";

import Button from "@/components/Button";
import PasswordInput from "@/hooks/PasswordInput";
import TextInput from "@/hooks/TextInput";
import { ArrowRight, Mail } from "lucide-react";
import { FormEventHandler } from "react";

interface FormLoginProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function FormLogin({ onSubmit }: FormLoginProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <TextInput icon={Mail} name="email" placeholder="Matrícula" />
      </div>

      <div>
        <PasswordInput name="password" placeholder="Senha" />
      </div>

      <Button
        className="cursor-pointer w-full bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex items-center justify-between"
        type="submit"
        icon={ArrowRight}
      >
        ENTRAR
      </Button>
    </form>
  );
}

// 'use client';                                                                                                   │
//  │     2                                                                                                                 │
//  │     3 import { FormEvent, useState } from 'react';                                                                    │
//  │     4 import { signIn } from 'next-auth/react';                                                                       │
//  │     5 import { useRouter, useSearchParams } from 'next/navigation';                                                   │
//  │     6 import FormLogin from '@/hooks/FormLogin';                                                                      │
//  │     7 import Logo from '@/components/Logo';                                                                           │
//  │     8                                                                                                                 │
//  │     9 export default function LoginPage() {                                                                           │
//  │    10   const router = useRouter();                                                                                   │
//  │    11   const searchParams = useSearchParams();                                                                       │
//  │    12   const [error, setError] = useState<string | null>(null);                                                      │
//  │    13                                                                                                                 │
//  │    14   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {                                           │
//  │    15     event.preventDefault();                                                                                     │
//  │    16     setError(null);                                                                                             │
//  │    17                                                                                                                 │
//  │    18     const formData = new FormData(event.currentTarget);                                                         │
//  │    19     const email = formData.get('email') as string;                                                              │
//  │    20     const password = formData.get('password') as string;                                                        │
//  │    21                                                                                                                 │
//  │    22     const result = await signIn('credentials', {                                                                │
//  │    23       redirect: false,                                                                                          │
//  │    24       email,                                                                                                    │
//  │    25       password,                                                                                                 │
//  │    26     });                                                                                                         │
//  │    27                                                                                                                 │
//  │    28     if (result?.error) {                                                                                        │
//  │    29       setError('Credenciais inválidas. Verifique sua matrícula e senha.');                                      │
//  │    30     } else {                                                                                                    │
//  │    31       const callbackUrl = searchParams.get('callbackUrl') || '/';                                               │
//  │    32       router.push(callbackUrl);                                                                                 │
//  │    33     }                                                                                                           │
//  │    34   };                                                                                                            │
//  │    35                                                                                                                 │
//  │    36   return (                                                                                                      │
//  │    37     <main className="flex items-center justify-center min-h-screen bg-gray-100">                                │
//  │    38       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">                             │
//  │    39         <div className="flex justify-center">                                                                   │
//  │    40           <Logo />                                                                                              │
//  │    41         </div>                                                                                                  │
//  │    42         <h2 className="text-2xl font-bold text-center text-gray-800">Bem-vindo de volta</h2>                    │
//  │    43         {error && <p className="text-red-500 text-center">{error}</p>}                                          │
//  │    44         <FormLogin onSubmit={handleSubmit} />                                                                   │
//  │    45       </div>                                                                                                    │
//  │    46     </main>                                                                                                     │
//  │    47   );                                                                                                            │
//  │    48 }
