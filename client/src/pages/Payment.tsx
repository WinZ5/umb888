import MainLayout from "@/components/mainLayout"
import PaymentDataTable, { PaymentProps } from "@/components/paymentDataTable"
import { useEffect, useState } from "react";

const Payment = () => {
  const [data, setData] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      const paymentMethods: PaymentProps[] = await response.json();
      setData(paymentMethods);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePaymentDeleted = () => {
    fetchData();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <MainLayout title="Payment Method">
      <PaymentDataTable data={data} onPaymentDeleted={handlePaymentDeleted}/>
    </MainLayout>
  )
}

export default Payment