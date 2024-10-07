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

export interface MaintenanceHistoryProps {
  MaintenanceHistoryID: number;
  MaintenanceTime: string;
  MaintainerID: number;
  MaintainerName: string;
  MaintainerLastName: string;
  StationID: number;
  StationName: string;
  Report: string;
}

interface MaintenanceDataTableProps {
  data: MaintenanceHistoryProps[];
  onHistoryDeleted: () => void;
}

interface ColumnVisibility {
  maintenanceHistoryID: boolean;
  maintenanceTime: boolean;
  maintainerID: boolean;
  maintainerName: boolean;
  stationID: boolean;
  stationName: boolean;
  report: boolean;
}

const MaintenanceHistoryDataTable: React.FC<MaintenanceDataTableProps> = ({ data, onHistoryDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    maintenanceHistoryID: true,
    maintenanceTime: true,
    maintainerID: true,
    maintainerName: true,
    stationID: true,
    stationName: true,
    report: true,
  });
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleConfig = (MaintenanceHistoryID: number): void => {
    const history = data.find((h) => h.MaintenanceHistoryID === MaintenanceHistoryID);
    navigate(`/history/config/${MaintenanceHistoryID}`, {
      state: { maintenanceHistory: history }
    });
  };

  const handleDelete = async (MaintenanceHistoryID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete the selected maintenance history?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/maintenance-histories/${MaintenanceHistoryID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete maintenance history');
        }

        const result = await response.json();
        console.log(result.message);
        onHistoryDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the maintenance history');
      }
    }
  };

  const filteredData = data.filter((history) =>
    history.MaintenanceHistoryID.toString().includes(search) ||
    history.MaintainerName.toLowerCase().includes(search.toLowerCase()) ||
    history.StationName.toLowerCase().includes(search.toLowerCase()) ||
    history.Report.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: MaintenanceHistoryProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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
            onClick={() => navigate('/history/create')}
            className="h-10 px-5 border border-gray-300 bg-blue-500 text-white shadow-sm hover:bg-gray-100 hover:border-gray-400"
          >
            Add
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.maintenanceHistoryID && <TableHead>History ID</TableHead>}
            {visibleColumns.maintenanceTime && <TableHead>Maintenance Time</TableHead>}
            {visibleColumns.maintainerID && <TableHead>Maintainer ID</TableHead>}
            {visibleColumns.maintainerName && <TableHead>Maintainer Name</TableHead>}
            {visibleColumns.stationID && <TableHead>Station ID</TableHead>}
            {visibleColumns.stationName && <TableHead>Station Name</TableHead>}
            {visibleColumns.report && <TableHead>Report</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((history) => (
            <TableRow key={history.MaintenanceHistoryID}>
              {visibleColumns.maintenanceHistoryID && <TableCell>{history.MaintenanceHistoryID}</TableCell>}
              {visibleColumns.maintenanceTime && <TableCell>{new Date(history.MaintenanceTime).toLocaleString()}</TableCell>}
              {visibleColumns.maintainerID && <TableCell>{history.MaintainerID}</TableCell>}
              {visibleColumns.maintainerName && <TableCell>{`${history.MaintainerName} ${history.MaintainerLastName}`}</TableCell>}
              {visibleColumns.stationID && <TableCell>{history.StationID}</TableCell>}
              {visibleColumns.stationName && <TableCell>{history.StationName}</TableCell>}
              {visibleColumns.report && <TableCell>{history.Report}</TableCell>}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleConfig(history.MaintenanceHistoryID)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Config</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(history.MaintenanceHistoryID)} className="cursor-pointer text-red-600">
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

export default MaintenanceHistoryDataTable;
