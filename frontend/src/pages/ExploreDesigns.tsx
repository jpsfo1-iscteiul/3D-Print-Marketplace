import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { useWeb3 } from "../context/Web3Context";
import { useDesign } from "../hooks/useDesign";
import { toast } from "@/components/ui/use-toast";

interface Design {
  id: string;
  tokenURI: string;
  creatorName: string;
  description: string;
  price: string;
  owner: string;
  isListed: boolean;
}

export default function ExploreDesigns() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();
  const { account, isDesigner, setIsDesigner } = useWeb3();
  const { getDesign, buyDesign, loading, error } = useDesign();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const loadDesigns = async () => {
      // In a real implementation, you would:
      // 1. Query the total number of tokens
      // 2. Fetch metadata for each token
      // 3. Check if they are listed in the marketplace
      // For now, we'll just show a placeholder
      setDesigns([]);
    };

    if (account) {
      loadDesigns();
    }
  }, [account]);

  // Filter logic
  const filtered = designs.filter((d) => {
    return (
      d.creatorName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDesignClick = async (designId: string) => {
    try {
      const design = await getDesign(designId);
      if (design) {
        // In a real implementation, you would navigate to a detail page
        console.log('Design details:', design);
      }
    } catch (err) {
      console.error('Error fetching design:', err);
    }
  };

  const handleBuyDesign = async (design: Design) => {
    if (!account) {
      toast({
        title: t.header.metamaskNotConnected,
        description: t.header.connectMetamask,
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await buyDesign(design.id, design.price);
      if (success) {
        toast({
          title: "Success!",
          description: "You have successfully purchased the design.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to purchase the design. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitDesign = () => {
    if (!account) {
      toast({
        title: t.header.metamaskNotConnected,
        description: t.header.connectMetamask,
        variant: "destructive"
      });
      return;
    }
    
    setUserRole('Designer');
    setIsDesigner(true);
    navigate('/submit-design');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Explore Designs</h1>
        <Button onClick={handleSubmitDesign}>
          {t.explore.submitDesign}
        </Button>
      </div>

      {/* Search Bar */}
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder={t.explore.searchPlaceholder}
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginated.map(design => (
          <div key={design.id} className="border rounded shadow p-4 flex flex-col">
            <div className="font-bold mb-2">{design.creatorName}</div>
            <p className="text-sm text-gray-600 mb-2">{design.description}</p>
            <div className="mt-auto">
              <div className="text-lg font-semibold mb-2">
                {design.price} ETH
              </div>
              {design.isListed && design.owner !== account && (
                <Button 
                  className="w-full"
                  onClick={() => handleBuyDesign(design)}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </Button>
              )}
              {design.owner === account && (
                <div className="text-sm text-gray-500">You own this design</div>
              )}
            </div>
          </div>
        ))}

        {paginated.length === 0 && (
          <div className="col-span-4 flex flex-col items-center justify-center p-12 text-center">
            <svg
              className="w-32 h-32 text-gray-300 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t.explore.noDesigns}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {t.explore.noDesignsDescription}
            </p>
            <Button onClick={handleSubmitDesign}>
              {t.explore.submitDesign}
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            {t.explore.previous}
          </Button>
          <span>{t.explore.page} {page} {t.explore.of} {totalPages}</span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            {t.explore.next}
          </Button>
          <span className="ml-4">{t.explore.perPage}</span>
          <select
            className="p-1 border rounded"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {[10, 20, 30].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
