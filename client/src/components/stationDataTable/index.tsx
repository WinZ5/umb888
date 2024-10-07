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
import { ChevronLeft, ChevronRight, MoreVertical, Settings, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface StationProps {
  StationID: number;
  StationName: string;
  CurrentStock: number;
  Longitude: number;
  Latitude: number;
  Capacity: number;
}

interface StationDataTableProps {
  data: StationProps[];
  onStationDeleted: () => void;
}

interface ColumnVisibility {
  id: boolean;
  name: boolean;
  latitude: boolean;
  longitude: boolean;
  capacity: boolean;
  currentStock: boolean;
}

const StationDataTable: React.FC<StationDataTableProps> = ({ data, onStationDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    name: true,
    latitude: true,
    longitude: true,
    capacity: true,
    currentStock: true,
  });
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleConfig = (StationID: number): void => {
    navigate(`/station/config/${StationID}`, {
      state: { StationID }
    });
  };

  const handleDelete = async (StationID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete selected station?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/stations/${StationID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete station');
        }

        const result = await response.json();
        console.log(result.message);

        onStationDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the station');
      }
    }
  };

  const filteredData = data.filter((station) =>
    station.StationName.toLowerCase().includes(search.toLowerCase()) ||
    station.StationID.toString().includes(search)
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: StationProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = (): void => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = (): void => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or Name..."
          className="border border-gray-300 rounded-md p-2 text-black bg-white w-[200px]"
        />

        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-5 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:border-gray-400"
              >
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">Toggle columns</div>
              {Object.keys(visibleColumns).map((column) => (
                <DropdownMenuItem key={column} onClick={() => toggleColumn(column as keyof ColumnVisibility)}>
                  {visibleColumns[column as keyof ColumnVisibility] ? (
                    <span className="mr-2">
                      <Search className="h-4 w-4 text-green-500" />
                    </span>
                  ) : (
                    <span className="mr-2">
                      <Search className="h-4 w-4 text-red-500" />
                    </span>
                  )}
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => navigate('/station/create')}
            className="h-10 px-5 border border-gray-300 bg-blue-500 text-white shadow-sm hover:bg-gray-100 hover:border-gray-400"
          >
            Add
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.id && <TableHead>ID</TableHead>}
            {visibleColumns.name && <TableHead>Name</TableHead>}
            {visibleColumns.latitude && <TableHead>Latitude</TableHead>}
            {visibleColumns.longitude && <TableHead>Longitude</TableHead>}
            {visibleColumns.capacity && <TableHead>Capacity</TableHead>}
            {visibleColumns.currentStock && <TableHead>Current Stock</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((station) => (
            <TableRow key={station.StationID}>
              {visibleColumns.id && <TableCell>{station.StationID}</TableCell>}
              {visibleColumns.name && <TableCell>{station.StationName}</TableCell>}
              {visibleColumns.latitude && <TableCell>{station.Latitude}</TableCell>}
              {visibleColumns.longitude && <TableCell>{station.Longitude}</TableCell>}
              {visibleColumns.capacity && <TableCell>{station.Capacity}</TableCell>}
              {visibleColumns.currentStock && (
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(station.CurrentStock / station.Capacity) * 100}%`,
                          backgroundColor: station.CurrentStock === station.Capacity ? 'green' : 'blue',
                        }}
                      ></div>
                    </div>
                    <span className="text-sm">{station.CurrentStock}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleConfig(station.StationID)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Config</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(station.StationID)} className="cursor-pointer text-red-600">
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

export default StationDataTable;