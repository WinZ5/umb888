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
import { ChevronLeft, ChevronRight, MoreVertical, Search, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface UmbrellaProps {
  UmbrellaID: number;
  Size: string;
  Color: string;
  CurrentStationID?: number;
  CurrentStationName?: string;
}

interface UmbrellaDataTableProps {
  data: UmbrellaProps[];
  onUmbrellaDeleted: () => void;
}

interface ColumnVisibility {
  id: boolean;
  size: boolean;
  color: boolean;
  currentStationID: boolean;
  currentStationName: boolean;
}

const UmbrellaDataTable: React.FC<UmbrellaDataTableProps> = ({ data, onUmbrellaDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    size: true,
    color: true,
    currentStationID: true,
    currentStationName: true,
  });
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleConfig = (UmbrellaID: number): void => {
    navigate(`/umbrella/config/${UmbrellaID}`, {
      state: { UmbrellaID }
    });
  };

  const handleDelete = async (UmbrellaID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete the selected umbrella?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/umbrellas/${UmbrellaID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete umbrella');
        }

        const result = await response.json();
        console.log(result.message);
        onUmbrellaDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the umbrella');
      }
    }
  };

  const filteredData = data.filter((umbrella) =>
    umbrella.Color.toLowerCase().includes(search.toLowerCase()) ||
    umbrella.UmbrellaID.toString().includes(search) ||
    umbrella.CurrentStationName?.toLocaleLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: UmbrellaProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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
          placeholder="Search..."
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
            onClick={() => navigate('/umbrella/create')}
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
            {visibleColumns.size && <TableHead>Size</TableHead>}
            {visibleColumns.color && <TableHead>Color</TableHead>}
            {visibleColumns.currentStationID && <TableHead>Current Station ID</TableHead>}
            {visibleColumns.currentStationName && <TableHead>Current Station Name</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((umbrella) => (
            <TableRow key={umbrella.UmbrellaID}>
              {visibleColumns.id && <TableCell>{umbrella.UmbrellaID}</TableCell>}
              {visibleColumns.size && <TableCell>{umbrella.Size}</TableCell>}
              {visibleColumns.color && <TableCell>{umbrella.Color}</TableCell>}
              {visibleColumns.currentStationID && <TableCell>{umbrella.CurrentStationID ?? 'N/A'}</TableCell>}
              {visibleColumns.currentStationName && <TableCell>{umbrella.CurrentStationName ?? 'N/A'}</TableCell>}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleConfig(umbrella.UmbrellaID)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Config</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(umbrella.UmbrellaID)} className="cursor-pointer text-red-600">
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

export default UmbrellaDataTable;