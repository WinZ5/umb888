import MainLayout from "@/components/mainLayout"
import RentalHistoryDataTable, { RentalHistoryProps } from "@/components/rentalDataTable";
import { useEffect, useState } from "react";

const RentalHistory = () => {
  const [data, setData] = useState<RentalHistoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rental-histories');
      if (!response.ok) {
        throw new Error('Failed to fetch rental histories');
      }
      const data: RentalHistoryProps[] = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRentalHistoryDeleted = () => {
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout title="Rental History">
      <RentalHistoryDataTable data={data} onRentalHistoryDeleted={handleRentalHistoryDeleted} />
    </MainLayout>
  )
}

export default RentalHistory;