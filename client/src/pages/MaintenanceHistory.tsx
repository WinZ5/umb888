import MaintenanceHistoryDataTable, { MaintenanceHistoryProps } from "@/components/historyDataTable";
import MainLayout from "@/components/mainLayout"
import { useEffect, useState } from "react";

const MaintainanceHistory = () => {
  const [data, setData] = useState<MaintenanceHistoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/maintenance-histories');
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance histories');
      }
      const data: MaintenanceHistoryProps[] = await response.json();
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

  const handleMaintenanceHistoryDeleted = () => {
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainLayout title="Maintainance History">
      <MaintenanceHistoryDataTable data={data} onHistoryDeleted={handleMaintenanceHistoryDeleted} />
    </MainLayout>
  )
}

export default MaintainanceHistory