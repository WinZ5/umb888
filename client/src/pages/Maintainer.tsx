import MainLayout from "@/components/mainLayout"
import MaintainerDataTable, { MaintainerProps } from "@/components/maintainerDataTable"
import { useEffect, useState } from "react";

const Maintainer = () => {
  const [data, setData] = useState<MaintainerProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/maintainers');
      if (!response.ok) {
        throw new Error('Failed to fetch maintainers');
      }
      const result: MaintainerProps[] = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMaintainerDeleted = () => {
    fetchData();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <MainLayout title="Maintainer">
      <MaintainerDataTable data={data} onMaintainerDeleted={handleMaintainerDeleted}/>
    </MainLayout>
  )
}

export default Maintainer