import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PaymentProps {
  CardID: number;
  CardNumber: string;
  CardName: string;
  CVV: string;
  ExpireDate: Date;
}

interface PaymentDataTableProps {
  data: PaymentProps[];
  onPaymentDeleted: () => void;
}

const PaymentDataTable: React.FC<PaymentDataTableProps> = ({ data, onPaymentDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const filteredData = data.filter((payment) =>
    payment.CardID.toString().includes(search) ||
    payment.CardName.toLowerCase().includes(search.toLowerCase()) ||
    payment.CardNumber.includes(search)
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: PaymentProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = (): void => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = (): void => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDelete = async (CardID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete selected payment method?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/payments/${CardID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete payment method');
        }

        const result = await response.json();
        console.log(result.message);

        onPaymentDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the payment method');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ..."
          className="border border-gray-300 rounded-md p-2 text-black bg-white w-[200px]"
        />

        <Button
          variant="outline"
          onClick={() => navigate('/payment/create')}
          className="h-10 px-5 border border-gray-300 bg-blue-500 text-white shadow-sm hover:bg-gray-100 hover:border-gray-400"
        >
          Add Payment Method
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card ID</TableHead>
            <TableHead>Card Number</TableHead>
            <TableHead>Card Name</TableHead>
            <TableHead>CVV</TableHead>
            <TableHead>Expire Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((payment) => (
            <TableRow key={payment.CardID}>
              <TableCell>{payment.CardID}</TableCell>
              <TableCell>{payment.CardNumber || 'N/A'}</TableCell>
              <TableCell>{payment.CardName}</TableCell>
              <TableCell>{payment.CVV}</TableCell>
              <TableCell>{new Date(payment.ExpireDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(payment.CardID)} className="cursor-pointer text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">Page {currentPage} of {totalPages}</div>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDataTable;
