import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { parseEther } from 'ethers';

interface Design {
  id: string;
  tokenURI: string;
  creatorName: string;
  description: string;
  price: string;
  owner: string;
  isListed: boolean;
}

export const useDesign = () => {
  const { designRegistry, nftMarketplace, account, signer } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerDesign = async (
    tokenURI: string,
    creatorName: string,
    description: string
  ): Promise<string | null> => {
    if (!designRegistry || !account || !signer) {
      console.error('Missing requirements:', { 
        designRegistry: !!designRegistry, 
        account: !!account,
        signer: !!signer 
      });
      setError('Design registry, account, or signer not available');
      return null;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Starting design registration...', {
        tokenURI,
        creatorName,
        description,
        account,
        contractAddress: await designRegistry.getAddress()
      });

      // Get the current token ID before registration
      const currentTokenId = await designRegistry.nextTokenId();
      console.log('Current token ID:', currentTokenId.toString());

      // Create a new contract instance with the signer
      const designRegistryWithSigner = designRegistry.connect(signer);
      console.log('Connected contract with signer');

      // Estimate gas first
      console.log('Estimating gas...');
      const gasEstimate = await designRegistryWithSigner.registerDesign.estimateGas(
        tokenURI,
        creatorName,
        description
      );
      console.log('Gas estimate:', gasEstimate.toString());

      // Register the design with gas limit
      console.log('Sending registration transaction...');
      const tx = await designRegistryWithSigner.registerDesign(
        tokenURI,
        creatorName,
        description,
        {
          gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
        }
      );
      console.log('Transaction sent:', {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        data: tx.data
      });

      // Wait for transaction confirmation with timeout
      console.log('Waiting for transaction confirmation...');
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
        )
      ]);
      console.log('Transaction confirmed:', {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status
      });

      // Get the new token ID
      const newTokenId = await designRegistry.nextTokenId();
      console.log('New token ID:', newTokenId.toString());

      // Calculate the token ID of the newly registered design
      const tokenId = newTokenId - 1n;
      console.log('Design registered with token ID:', tokenId.toString());

      return tokenId.toString();
    } catch (err) {
      console.error('Error in registerDesign:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
      }
      setError(err instanceof Error ? err.message : 'Error registering design');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listDesign = async (tokenId: string, price: string): Promise<boolean> => {
    if (!designRegistry || !nftMarketplace || !account) {
      setError('Contracts or account not available');
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Checking marketplace approval...');
      const isApproved = await designRegistry.getApproved(tokenId);
      const marketplaceAddress = await nftMarketplace.getAddress();
      
      if (isApproved !== marketplaceAddress) {
        console.log('Approving marketplace...');
        const approveTx = await designRegistry.approve(marketplaceAddress, tokenId);
        console.log('Waiting for approval transaction...');
        await approveTx.wait();
        console.log('Marketplace approved');
      }

      console.log('Listing design...');
      const listTx = await nftMarketplace.listDesign(
        await designRegistry.getAddress(),
        tokenId,
        parseEther(price)
      );
      console.log('Waiting for listing transaction...');
      await listTx.wait();
      console.log('Design listed successfully');
      return true;
    } catch (err) {
      console.error('Error in listDesign:', err);
      setError(err instanceof Error ? err.message : 'Error listing design');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buyDesign = async (tokenId: string, price: string): Promise<boolean> => {
    if (!designRegistry || !nftMarketplace || !account) {
      setError('Contracts or account not available');
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Buying design...');
      const tx = await nftMarketplace.buyDesign(
        await designRegistry.getAddress(),
        tokenId,
        { value: parseEther(price) }
      );
      console.log('Waiting for purchase transaction...');
      await tx.wait();
      console.log('Design purchased successfully');
      return true;
    } catch (err) {
      console.error('Error in buyDesign:', err);
      setError(err instanceof Error ? err.message : 'Error buying design');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDesign = async (tokenId: string): Promise<Design | null> => {
    if (!designRegistry || !nftMarketplace) {
      setError('Contracts not available');
      return null;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching design details...');
      const [tokenURI, metadata, owner] = await Promise.all([
        designRegistry.tokenURI(tokenId),
        designRegistry.getMetadata(tokenId),
        designRegistry.ownerOf(tokenId),
      ]);

      console.log('Fetching listing details...');
      const listing = await nftMarketplace.listings(
        await designRegistry.getAddress(),
        tokenId
      );

      return {
        id: tokenId,
        tokenURI,
        creatorName: metadata.creatorName,
        description: metadata.description,
        price: listing.price.toString(),
        owner,
        isListed: listing.price > 0n,
      };
    } catch (err) {
      console.error('Error in getDesign:', err);
      setError(err instanceof Error ? err.message : 'Error fetching design');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerDesign,
    listDesign,
    buyDesign,
    getDesign,
    loading,
    error,
  };
}; 