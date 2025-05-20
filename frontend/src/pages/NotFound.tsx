
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
      <Button asChild>
        <Link to="/designs">Voltar para Designs</Link>
      </Button>
    </div>
  );
};

export default NotFound;
