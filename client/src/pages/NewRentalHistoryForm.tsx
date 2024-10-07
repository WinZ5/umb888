import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface RentalHistoryFormData {
  AccountID: number | null;
  DestinationStationID: number | null;
  StartStationID: number | null;
  CardID: number | null;
  UmbrellaID: number | null;
  StartRentalTime: string;
  EndRentalTime: string;
}

interface Station {
  StationID: number;
  StationName: string;
}

interface Umbrella {
  UmbrellaID: number;
}

interface Account {
  AccountID: number;
  FirstName: string;
  LastName: string;
}

const NewRentalHistoryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RentalHistoryFormData>({
    AccountID: null,
    DestinationStationID: null,
    StartStationID: null,
    CardID: null,
    UmbrellaID: null,
    StartRentalTime: '',
    EndRentalTime: '',
  });
  const [stations, setStations] = useState<Station[]>([]);
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stations');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data: Station[] = await response.json();
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    const fetchUmbrellas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/umbrellas');
        if (!response.ok) {
          throw new Error('Failed to fetch umbrellas');
        }
        const data: Umbrella[] = await response.json();
        setUmbrellas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data: Account[] = await response.json();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    Promise.all([fetchStations(), fetchUmbrellas(), fetchAccounts()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "StartRentalTime" || name === "EndRentalTime") {
      setFormData(prevState => ({
        ...prevState,
        [name]: value || '',
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value ? (isNaN(parseInt(value)) ? value : parseInt(value)) : null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with the following data:', formData);

    try {
      const response = await fetch('http://localhost:3000/api/rental-histories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add rental history');
      }

      const result = await response.json();
      console.log('Rental history added:', result);
      handleBack();
    } catch (error) {
      console.error('Error submitting the form:', error);
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
              <option value="" disabled>Select an Account</option>
              {accounts.map(account => (
                <option key={account.AccountID} value={account.AccountID}>
                  {`${account.FirstName} ${account.LastName}`}
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
              <option value="" disabled>Select a Start Station</option>
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
              required
            >
              <option value="" disabled>Select a Destination Station</option>
              {stations.map(station => (
                <option key={station.StationID} value={station.StationID}>
                  {station.StationName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="umbrellaID" className="block text-sm font-medium text-gray-700">
              Umbrella ID
            </label>
            <select
              id="umbrellaID"
              name="UmbrellaID"
              value={formData.UmbrellaID ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="" disabled>Select an Umbrella ID</option>
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
              value={formData.EndRentalTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewRentalHistoryForm;