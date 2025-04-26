
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import WorkshopRegistrationForm from '@/components/WorkshopRegistrationForm';

const RegisterWorkshop = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Cadastro de Oficina
          </h1>
          <p className="text-foreground mb-8">
            Preencha o formulário abaixo para cadastrar sua oficina. Após o cadastro, nossa equipe irá revisar as informações e aprovar sua oficina.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <WorkshopRegistrationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterWorkshop;
