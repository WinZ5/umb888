import MainLayout from "@/components/mainLayout"
import AccountDataTable, { AccountProps } from "@/components/accountDataTable";
import { useEffect, useState } from "react";


const Account = () => {
  const [data, setData] = useState<AccountProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const result: AccountProps[] = await response.json();
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

  const handleAccountDeleted = () => {
    fetchData();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <MainLayout title="Account">
      <AccountDataTable data={data} onAccountDeleted={handleAccountDeleted} />
    </MainLayout>
  )
}

export default Account