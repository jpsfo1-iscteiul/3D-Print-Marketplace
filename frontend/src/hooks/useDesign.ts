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
  const { designRegistry, nftMarketplace, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerDesign = async (
    tokenURI: string,
    creatorName: string,
    description: string
  ): Promise<string | null> => {
    if (!designRegistry || !account) return null;
    setLoading(true);
    setError(null);

    try {
      const tx = await designRegistry.registerDesign(tokenURI, creatorName, description);
      await tx.wait();
      const tokenId = await designRegistry.nextTokenId() - 1n;
      return tokenId.toString();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error registering design');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listDesign = async (tokenId: string, price: string): Promise<boolean> => {
    if (!designRegistry || !nftMarketplace || !account) return false;
    setLoading(true);
    setError(null);

    try {
      // First approve the marketplace contract
      const approveTx = await designRegistry.approve(
        await nftMarketplace.getAddress(),
        tokenId
      );
      await approveTx.wait();

      // Then list the design
      const listTx = await nftMarketplace.listDesign(
        await designRegistry.getAddress(),
        tokenId,
        parseEther(price)
      );
      await listTx.wait();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error listing design');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buyDesign = async (tokenId: string, price: string): Promise<boolean> => {
    if (!designRegistry || !nftMarketplace || !account) return false;
    setLoading(true);
    setError(null);

    try {
      const tx = await nftMarketplace.buyDesign(
        await designRegistry.getAddress(),
        tokenId,
        { value: parseEther(price) }
      );
      await tx.wait();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buying design');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDesign = async (tokenId: string): Promise<Design | null> => {
    if (!designRegistry || !nftMarketplace) return null;
    setLoading(true);
    setError(null);

    try {
      const [tokenURI, metadata, owner] = await Promise.all([
        designRegistry.tokenURI(tokenId),
        designRegistry.getMetadata(tokenId),
        designRegistry.ownerOf(tokenId),
      ]);

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