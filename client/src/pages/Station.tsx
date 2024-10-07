import MainLayout from "@/components/mainLayout";
import StationDataTable, { StationProps } from "@/components/stationDataTable";
import { useEffect, useState } from "react";

const Station = () => {
  const [data, setData] = useState<StationProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stations');
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }
      const data: StationProps[] = await response.json();
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

  const handleStationDeleted = () => {
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout title="Stations">
      <StationDataTable data={data} onStationDeleted={handleStationDeleted} />
    </MainLayout>
  );
}

export default Station