
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '../context/UserContext';

const SubmitDesign = () => {
  const { isMetaMaskConnected, connectMetaMask } = useUser();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMetaMaskConnected) {
      toast({
        title: "MetaMask não conectado",
        description: "Conecte sua carteira MetaMask para submeter um design",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo 3D para submeter",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would normally submit to the blockchain or backend
    console.log('Submitting design:', { ...formData, file: selectedFile });
    
    toast({
      title: "Design submetido com sucesso!",
      description: "Seu design foi enviado para análise e será publicado em breve",
    });
    
    // Reset form
    setSelectedFile(null);
    setFormData({
      name: '',
      description: '',
      characteristics: '',
      price: ''
    });
    
    // Reset the file input by clearing its value
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Submeter Novo Design</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Ficheiro 3D:</label>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Escolher ficheiro
              </Button>
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'Nenhum ficheiro selecionado'}
              </span>
              <input
                id="file-input"
                type="file"
                accept=".obj,.stl,.glb,.gltf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Nome do Design:</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nome do seu design"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Descrição:</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o design..."
              className="min-h-24"
            />
          </div>
          
          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium mb-2">Características:</label>
            <Input
              id="characteristics"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleInputChange}
              placeholder="ex: material, tamanho, uso"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">Preço da Licença:</label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            {!isMetaMaskConnected ? (
              <Button type="button" onClick={connectMetaMask} className="w-full">
                Conectar MetaMask para Submeter
              </Button>
            ) : (
              <Button type="submit" className="blue-button w-full">
                Submeter Design
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitDesign;