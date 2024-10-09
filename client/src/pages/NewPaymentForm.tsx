import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface PaymentFormData {
  CardNumber: string;
  CardName: string;
  CVV: string;
  ExpireDate: Date | null;
}

const NewPaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PaymentFormData>({
    CardNumber: '',
    CardName: '',
    CVV: '',
    ExpireDate: null,
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
      ExpireDate: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      ExpireDate: formData.ExpireDate ? formData.ExpireDate.toISOString().split('T')[0] : null,
    };

    console.log('Form submitted with the following data:', dataToSubmit);

    try {
      const response = await fetch('http://localhost:3000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      const result = await response.json();
      console.log('Payment method added:', result);
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
            <label htmlFor="CardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="CardNumber"
              name="CardNumber"
              value={formData.CardNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Card Number"
            />
          </div>

          <div>
            <label htmlFor="CardName" className="block text-sm font-medium text-gray-700">
              Card Name
            </label>
            <input
              type="text"
              id="CardName"
              name="CardName"
              value={formData.CardName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter Card Name"
            />
          </div>

          <div>
            <label htmlFor="CVV" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="CVV"
              name="CVV"
              value={formData.CVV}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
              placeholder="Enter CVV"
            />
          </div>

          <div>
            <label htmlFor="ExpireDate" className="block text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <DatePicker
              selected={formData.ExpireDate}
              onChange={handleDateChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-blue-500"
              placeholderText="Select expiration date"
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
};

export default NewPaymentForm;