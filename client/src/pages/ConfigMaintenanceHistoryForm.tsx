import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface MaintenanceHistoryFormData {
  MaintenanceTime: string;
  MaintainerID: number | null;
  StationID: number | null;
  Report: string;
}

interface Station {
  StationID: number;
  StationName: string;
}

interface Maintainer {
  MaintainerID: number;
  FirstName: string;
  LastName: string;
}

const ConfigMaintenanceHistoryForm = () => {
  const navigate = useNavigate();
  const { historyId } = useParams<{ historyId: string }>();
  const [formData, setFormData] = useState<MaintenanceHistoryFormData>({
    MaintenanceTime: '',
    MaintainerID: null,
    StationID: null,
    Report: '',
  });
  const [stations, setStations] = useState<Station[]>([]);
  const [maintainers, setMaintainers] = useState<Maintainer[]>([]);
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

    const fetchMaintainers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/maintainers');
        if (!response.ok) {
          throw new Error('Failed to fetch maintainers');
        }
        const data: Maintainer[] = await response.json();
        setMaintainers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    const fetchMaintenanceHistoryData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/maintenance-histories/${historyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch maintenance history data');
        }
        const data: MaintenanceHistoryFormData = await response.json();

        const utcDate = new Date(data.MaintenanceTime);
        const localMaintenanceTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        setFormData({
          ...data,
          MaintenanceTime: localMaintenanceTime,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching maintenance history data');
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
    fetchMaintainers();
    fetchMaintenanceHistoryData();
  }, [historyId]);

  const handleMaintenanceTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      MaintenanceTime: value,
    }));
  };

  const handleMaintainerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      MaintainerID: value ? parseInt(value) : null,
    }));
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      StationID: value ? parseInt(value) : null,
    }));
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      Report: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with the following data:', formData);

    const localDate = new Date(formData.MaintenanceTime);
    const utcMaintenanceTime = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

    const formattedMaintenanceTime = utcMaintenanceTime.toISOString().slice(0, 19).replace('T', ' ');

    const updatedData = {
      ...formData,
      MaintenanceTime: formattedMaintenanceTime,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/maintenance-histories/${historyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to update maintenance history: ${errorResponse}`);
      }

      const result = await response.json();
      console.log('Maintenance history updated:', result);
      handleBack();
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating maintenance history');
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
            <label htmlFor="maintenanceTime" className="block text-sm font-medium text-gray-700">
              Maintenance Time
            </label>
            <input
              type="datetime-local"
              id="maintenanceTime"
              value={formData.MaintenanceTime}
              onChange={handleMaintenanceTimeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="maintainerID" className="block text-sm font-medium text-gray-700">
              Maintainer
            </label>
            <select
              id="maintainerID"
              value={formData.MaintainerID ?? ''}
              onChange={handleMaintainerChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              required
            >
              <option value="" disabled>Select a Maintainer</option>
              {maintainers.map(maintainer => (
                <option key={maintainer.MaintainerID} value={maintainer.MaintainerID}>
                  {`${maintainer.FirstName} ${maintainer.LastName}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stationID" className="block text-sm font-medium text-gray-700">
              Station
            </label>
            <select
              id="stationID"
              value={formData.StationID ?? ''}
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

          <div>
            <label htmlFor="report" className="block text-sm font-medium text-gray-700">
              Report
            </label>
            <textarea
              id="report"
              value={formData.Report}
              onChange={handleReportChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter a report"
              required
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

export default ConfigMaintenanceHistoryForm;
