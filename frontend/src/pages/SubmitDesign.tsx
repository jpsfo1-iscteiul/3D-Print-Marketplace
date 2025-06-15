import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '../context/UserContext';
import { useWeb3 } from '../context/Web3Context';
import { useDesign } from '../hooks/useDesign';
import { useLanguage } from '../context/LanguageContext';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitDesign = () => {
  const { t } = useLanguage();
  const { account, connectWallet } = useWeb3();
  const { registerDesign, listDesign, loading } = useDesign();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: ''
  });
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast({
        title: t.header.metamaskNotConnected,
        description: t.header.connectMetamask,
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a 3D file to submit",
        variant: "destructive"
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmissionStep('uploading');
      // 1. Upload file to IPFS (in a real implementation)
      // For now, we'll just use a dummy IPFS hash
      const ipfsHash = `ipfs://QmDummy${Date.now()}`;

      // 2. Register the design
      setSubmissionStep('registering');
      const tokenId = await registerDesign(
        ipfsHash,
        formData.name,
        formData.description
      );

      if (!tokenId) {
        throw new Error('Failed to register design');
      }

      // 3. List the design for sale
      setSubmissionStep('listing');
      const success = await listDesign(tokenId, formData.price);
      
      if (success) {
        setSubmissionStep('');
        toast({
          title: "Success!",
          description: "Your design has been registered and listed for sale.",
        });

        // Reset form
        setSelectedFile(null);
        setFormData({
          name: '',
          description: '',
          characteristics: '',
          price: ''
        });
        
        // Reset the file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Redirect to My Designs
        navigate('/designs');
      } else {
        throw new Error('Failed to list design for sale');
      }
    } catch (err) {
      setSubmissionStep('');
      console.error('Error submitting design:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit design. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (submissionStep) {
        case 'uploading':
          return 'Uploading to IPFS...';
        case 'registering':
          return 'Registering Design...';
        case 'listing':
          return 'Listing for Sale...';
        default:
          return 'Processing...';
      }
    }
    return t.sidebar.submitDesign;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t.sidebar.submitDesign}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">3D File:</label>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={loading}
              >
                Choose File
              </Button>
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
              <input
                id="file-input"
                type="file"
                accept=".obj,.stl,.glb,.gltf"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Design Name:</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter design name"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description:</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your design..."
              className="min-h-24"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium mb-2">Characteristics:</label>
            <Input
              id="characteristics"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleInputChange}
              placeholder="e.g., material, size, usage"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">License Price (ETH):</label>
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
              disabled={loading}
            />
          </div>
          
          <div>
            {!account ? (
              <Button type="button" onClick={connectWallet} className="w-full">
                {t.header.connectMetamask}
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getSubmitButtonText()}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitDesign;