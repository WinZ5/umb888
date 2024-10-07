import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ConfigAccountForm = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [cardIDs, setCardIDs] = useState([]);
  const [selectedCardID, setSelectedCardID] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    DateOfBirth: new Date() as Date | null,
    Phone: '',
    Street: '',
    City: '',
    Province: '',
    ZIPCode: '',
    CardID: '',
  });


  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const fetchCardIDs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/cardIDs');
      if (!response.ok) {
        throw new Error('Failed to fetch CardIDs');
      }
      const data = await response.json();
      setCardIDs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCardIDs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'CardID' ? Number(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prevState => ({
      ...prevState,
      DateOfBirth: date,
    }));
  };

  const handleCardIDChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCardID(e.target.value);
    setFormData(prevState => ({
      ...prevState,
      CardID: e.target.value,
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsLoading(true);
    const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to update account');
    }

    const result = await response.json();
    console.log('Account updated successfully:', result);
    handleBack();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto mt-4 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Configure Account</h1>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="DateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <DatePicker
              selected={formData.DateOfBirth}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-blue-500"
              placeholderText="Select a date"
              required
            />
          </div>
          <div>
            <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="cardID" className="block text-sm font-medium text-gray-700">
              CardID
            </label>
            <select id="cardID" value={selectedCardID} onChange={handleCardIDChange} className='bg-white'>
              <option value="" disabled>Select a Card ID</option>
              {cardIDs.map((cardID) => (
                <option key={cardID} value={cardID}>
                  {cardID}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Street" className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              id="Street"
              name="Street"
              value={formData.Street}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="City" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="Province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              id="Province"
              name="Province"
              value={formData.Province}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label htmlFor="ZIPCode" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              id="ZIPCode"
              name="ZIPCode"
              value={formData.ZIPCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfigAccountForm;

