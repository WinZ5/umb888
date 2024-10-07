import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface UmbrellaFormData {
  Size: string;
  Color: string;
  CurrentStationID: number | null;
}

interface Station {
  StationID: number;
  StationName: string;
}

const NewUmbrellaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UmbrellaFormData>({
    Size: '',
    Color: '',
    CurrentStationID: null,
  });
  const [stations, setStations] = useState<Station[]>([]);
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
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      Size: value,
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      Color: value,
    }));
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      CurrentStationID: value ? parseInt(value) : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with the following data:', formData);

    try {
      const response = await fetch('http://localhost:3000/api/umbrellas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add umbrella');
      }

      const result = await response.json();
      console.log('Umbrella added:', result);
      handleBack();
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading stations...</div>;
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
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <select
              id="size"
              value={formData.Size}
              onChange={handleSizeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="" disabled>Select a Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              id="color"
              value={formData.Color}
              onChange={handleColorChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter a Color"
              required
            />
          </div>

          <div>
            <label htmlFor="currentStationID" className="block text-sm font-medium text-gray-700">
              Current Station
            </label>
            <select
              id="currentStationID"
              value={formData.CurrentStationID ?? ''}
              onChange={handleStationChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="" disabled>Select a Station</option>
              {stations.map(station => (
                <option key={station.StationID} value={station.StationID}>
                  {station.StationName}
                </option>
              ))}
            </select>
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

export default NewUmbrellaForm;
