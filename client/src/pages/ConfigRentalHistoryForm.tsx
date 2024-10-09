import { AccountProps } from "@/components/accountDataTable";
import { StationProps } from "@/components/stationDataTable";
import { Button } from "@/components/ui/button";
import { UmbrellaProps } from "@/components/umbrellaDataTable";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface RentalHistoryFormData {
  RentalHistoryID: number;
  AccountID: number | null;
  UmbrellaID: number | null;
  StartStationID: number | null;
  DestinationStationID: number | null;
  StartRentalTime: string;
  EndRentalTime: string | null;
  Price: number,
}

const ConfigRentalHistoryForm = () => {
  const navigate = useNavigate();
  const { rentalId } = useParams<{ rentalId: string }>();

  const [formData, setFormData] = useState<RentalHistoryFormData>({
    RentalHistoryID: 0,
    AccountID: null,
    UmbrellaID: null,
    StartStationID: null,
    DestinationStationID: null,
    StartRentalTime: '',
    EndRentalTime: null,
    Price: 0,
  });

  const [accounts, setAccounts] = useState<AccountProps[]>([]);
  const [stations, setStations] = useState<StationProps[]>([]);
  const [umbrellas, setUmbrellas] = useState<UmbrellaProps[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalResponse = await fetch(`http://localhost:3000/api/rental-histories/${rentalId}`);
        if (!rentalResponse.ok) throw new Error('Failed to fetch rental history data');
        const rentalData: RentalHistoryFormData = await rentalResponse.json();

        const utcStartRentalTime = new Date(rentalData.StartRentalTime);
        const localStartRentalTime = new Date(utcStartRentalTime.getTime() - utcStartRentalTime.getTimezoneOffset() * 60000)
          .toISOString().slice(0, 16);

        let localEndRentalTime: string | null = null;
        if (rentalData.EndRentalTime) {
          const utcEndRentalTime = new Date(rentalData.EndRentalTime);
          localEndRentalTime = new Date(utcEndRentalTime.getTime() - utcEndRentalTime.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        }

        setFormData({
          ...rentalData,
          StartRentalTime: localStartRentalTime,
          EndRentalTime: localEndRentalTime,
        });

        const accountsResponse = await fetch(`http://localhost:3000/api/accounts`);
        const stationsResponse = await fetch(`http://localhost:3000/api/stations`);
        const umbrellasResponse = await fetch(`http://localhost:3000/api/umbrellas`);

        if (!accountsResponse.ok || !stationsResponse.ok || !umbrellasResponse.ok) {
          throw new Error('Failed to fetch accounts, stations, or umbrellas data');
        }

        const accountsData = await accountsResponse.json();
        const stationsData = await stationsResponse.json();
        const umbrellasData = await umbrellasResponse.json();

        setAccounts(accountsData);
        setStations(stationsData);
        setUmbrellas(umbrellasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rentalId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/rental-histories/${rentalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to update rental history: ${errorResponse}`);
      }

      const result = await response.json();
      console.log('Rental history updated:', result);
      handleBack();
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating rental history');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accountID" className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <select
              id="accountID"
              name="AccountID"
              value={formData.AccountID ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.AccountID} value={account.AccountID}>
                  {account.FirstName} {account.LastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startStationID" className="block text-sm font-medium text-gray-700">
              Start Station
            </label>
            <select
              id="startStationID"
              name="StartStationID"
              value={formData.StartStationID ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="">Select a start station</option>
              {stations.map(station => (
                <option key={station.StationID} value={station.StationID}>
                  {station.StationName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="destinationStationID" className="block text-sm font-medium text-gray-700">
              Destination Station
            </label>
            <select
              id="destinationStationID"
              name="DestinationStationID"
              value={formData.DestinationStationID ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
            >
              <option value="">Select a destination station</option>
              {stations.map(station => (
                <option key={station.StationID} value={station.StationID}>
                  {station.StationName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="umbrellaID" className="block text-sm font-medium text-gray-700">
              Umbrella
            </label>
            <select
              id="umbrellaID"
              name="UmbrellaID"
              value={formData.UmbrellaID ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="">Select an umbrella</option>
              {umbrellas.map(umbrella => (
                <option key={umbrella.UmbrellaID} value={umbrella.UmbrellaID}>
                  {umbrella.UmbrellaID}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startRentalTime" className="block text-sm font-medium text-gray-700">
              Start Rental Time
            </label>
            <input
              type="datetime-local"
              id="startRentalTime"
              name="StartRentalTime"
              value={formData.StartRentalTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="endRentalTime" className="block text-sm font-medium text-gray-700">
              End Rental Time
            </label>
            <input
              type="datetime-local"
              id="endRentalTime"
              name="EndRentalTime"
              value={formData.EndRentalTime ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="Price"
              value={formData.Price ?? 0}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter Price"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ConfigRentalHistoryForm;