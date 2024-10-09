import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ChevronLeft, ChevronRight, MoreVertical, Search, Trash2, Settings } from 'lucide-react';

export interface RentalHistoryProps {
  RentalHistoryID: number;
  AccountID: number;
  FirstName: string;
  LastName: string;
  StartStationName: string;
  DestinationStationName: string | null;
  UmbrellaID: number;
  StartRentalTime: Date;
  EndRentalTime: Date | null;
  Price: number;
}

interface RentalHistoryDataTableProps {
  data: RentalHistoryProps[];
  onRentalHistoryDeleted: () => void;
}

interface ColumnVisibility {
  id: boolean;
  account: boolean;
  startStation: boolean;
  destinationStation: boolean;
  umbrellaId: boolean;
  startTime: boolean;
  endTime: boolean;
  price: boolean;
}

const RentalHistoryDataTable: React.FC<RentalHistoryDataTableProps> = ({ data, onRentalHistoryDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    account: true,
    startStation: true,
    destinationStation: true,
    umbrellaId: true,
    startTime: true,
    endTime: true,
    price: true,
  });
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleDelete = async (RentalHistoryID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete this rental history?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/rental-histories/${RentalHistoryID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete rental history');
        }

        onRentalHistoryDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting');
      }
    }
  };

  const handleConfig = (RentalHistoryID: number) => {
    navigate(`/rental/config/${RentalHistoryID}`);
  };

  const handleAddRental = () => {
    navigate('/rental/create');
  };

  const filteredData = data.filter((rental) =>
    rental.FirstName.toLowerCase().includes(search.toLowerCase()) ||
    rental.LastName.toLowerCase().includes(search.toLowerCase()) ||
    rental.StartStationName.toLowerCase().includes(search.toLowerCase()) ||
    (rental.DestinationStationName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    rental.UmbrellaID.toString().includes(search)
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: RentalHistoryProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ..."
            className="border border-gray-300 rounded-md p-2 text-black bg-white w-[200px]"
          />
        </div>

        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-5 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100"
              >
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">Toggle columns</div>
              {Object.entries(visibleColumns).map(([key, value]) => (
                <DropdownMenuItem key={key} onClick={() => toggleColumn(key as keyof ColumnVisibility)}>
                  {value ? (
                    <Search className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Search className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleAddRental}
            className="h-10 px-5 border border-gray-300 bg-blue-500 text-white shadow-sm hover:bg-blue-600"
          >
            Add
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.id && <TableHead>ID</TableHead>}
            {visibleColumns.account && <TableHead>Account</TableHead>}
            {visibleColumns.startStation && <TableHead>Start Station</TableHead>}
            {visibleColumns.destinationStation && <TableHead>Destination Station</TableHead>}
            {visibleColumns.umbrellaId && <TableHead>Umbrella ID</TableHead>}
            {visibleColumns.startTime && <TableHead>Start Time</TableHead>}
            {visibleColumns.endTime && <TableHead>End Time</TableHead>}
            {visibleColumns.price && <TableHead>Price</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((rental) => (
            <TableRow key={rental.RentalHistoryID}>
              {visibleColumns.id && <TableCell>{rental.RentalHistoryID}</TableCell>}
              {visibleColumns.account && <TableCell>{`${rental.FirstName} ${rental.LastName}`}</TableCell>}
              {visibleColumns.startStation && <TableCell>{rental.StartStationName}</TableCell>}
              {visibleColumns.destinationStation && <TableCell>{rental.DestinationStationName || 'Not returned'}</TableCell>}
              {visibleColumns.umbrellaId && <TableCell>{rental.UmbrellaID}</TableCell>}
              {visibleColumns.startTime && <TableCell>{new Date(rental.StartRentalTime).toLocaleString()}</TableCell>}
              {visibleColumns.endTime && 
                <TableCell>{rental.EndRentalTime ? new Date(rental.EndRentalTime).toLocaleString() : 'Active'}</TableCell>
              }
              {visibleColumns.price && <TableCell>${rental.Price}</TableCell>}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleConfig(rental.RentalHistoryID)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Config</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(rental.RentalHistoryID)} className="cursor-pointer text-red-600">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">Page {currentPage} of {totalPages}</div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalHistoryDataTable;