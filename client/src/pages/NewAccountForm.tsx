import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface AccountFormData {
  FirstName: string;
  LastName: string;
  Email: string;
  DateOfBirth: Date | null;
  Phone: string;
  Street: string;
  City: string;
  Province: string;
  ZIPCode: string;
  CardID: number | null;
}

const NewAccountForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AccountFormData>({
    FirstName: '',
    LastName: '',
    Email: '',
    DateOfBirth: null,
    Phone: '',
    Street: '',
    City: '',
    Province: '',
    ZIPCode: '',
    CardID: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prevState => ({
      ...prevState,
      DateOfBirth: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      CardID: null,
    };

    console.log('Form submitted with the following data:', dataToSubmit);

    try {
      const response = await fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to add account');
      }

      const result = await response.json();
      console.log('Account added:', result);
      handleBack();
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter First Name"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Last Name"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Email"
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
              type="text"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Phone Number"
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Street"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter City"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Province"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter ZIP Code"
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

export default NewAccountForm;