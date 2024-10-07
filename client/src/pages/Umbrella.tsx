import MainLayout from "@/components/mainLayout"
import UmbrellaDataTable, { UmbrellaProps } from "@/components/umbrellaDataTable"
import { useEffect, useState } from "react";

const Umbrella = () => {
  const [data, setData] = useState<UmbrellaProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/umbrellas');
      if (!response.ok) {
        throw new Error('Failed to fetch umbrellas');
      }
      const data: UmbrellaProps[] = await response.json();
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

  const handleUmbrellaDeleted = () => {
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout title="Umbrella">
      <UmbrellaDataTable data={data} onUmbrellaDeleted={handleUmbrellaDeleted} />
    </MainLayout>
  )
}

export default Umbrella