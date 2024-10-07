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

export interface MaintainerProps {
  MaintainerID: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  DateOfBirth: Date;
  ZIPCode: string;
  Street: string;
  City: string;
  Province: string;
  Salary: number;
}

interface MaintainerDataTableProps {
  data: MaintainerProps[];
  onMaintainerDeleted: () => void;
}

interface ColumnVisibility {
  id: boolean;
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  email: boolean;
  dateOfBirth: boolean;
  zipCode: boolean;
  street: boolean;
  city: boolean;
  province: boolean;
  salary: boolean;
}

const MaintainerDataTable: React.FC<MaintainerDataTableProps> = ({ data, onMaintainerDeleted }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    dateOfBirth: true,
    zipCode: true,
    street: true,
    city: true,
    province: true,
    salary: true,
  });
  const [search, setSearch] = useState<string>('');
  const itemsPerPage: number = 12;
  const navigate = useNavigate();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleConfig = (MaintainerID: number): void => {
    navigate(`/maintainer/config/${MaintainerID}`, {
      state: { MaintainerID }
    });
  };

  const handleDelete = async (MaintainerID: number): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete selected maintainer?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/maintainers/${MaintainerID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete maintainer');
        }

        const result = await response.json();
        console.log(result.message);

        onMaintainerDeleted();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An error occurred while deleting the maintainer');
      }
    }
  };

  const filteredData = data.filter((maintainer) =>
    maintainer.FirstName.toLowerCase().includes(search.toLowerCase()) ||
    maintainer.LastName.toLowerCase().includes(search.toLowerCase()) ||
    maintainer.MaintainerID.toString().includes(search)
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: MaintainerProps[] = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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
          placeholder="Search ..."
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
            onClick={() => navigate('/maintainer/create')}
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
            {visibleColumns.firstName && <TableHead>First Name</TableHead>}
            {visibleColumns.lastName && <TableHead>Last Name</TableHead>}
            {visibleColumns.phone && <TableHead>Phone</TableHead>}
            {visibleColumns.email && <TableHead>Email</TableHead>}
            {visibleColumns.dateOfBirth && <TableHead>Date of Birth</TableHead>}
            {visibleColumns.zipCode && <TableHead>ZIP Code</TableHead>}
            {visibleColumns.street && <TableHead>Street</TableHead>}
            {visibleColumns.city && <TableHead>City</TableHead>}
            {visibleColumns.province && <TableHead>Province</TableHead>}
            {visibleColumns.salary && <TableHead>Salary</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((maintainer) => (
            <TableRow key={maintainer.MaintainerID}>
              {visibleColumns.id && <TableCell>{maintainer.MaintainerID}</TableCell>}
              {visibleColumns.firstName && <TableCell>{maintainer.FirstName}</TableCell>}
              {visibleColumns.lastName && <TableCell>{maintainer.LastName}</TableCell>}
              {visibleColumns.phone && <TableCell>{maintainer.Phone}</TableCell>}
              {visibleColumns.email && <TableCell>{maintainer.Email}</TableCell>}
              {visibleColumns.dateOfBirth && <TableCell>{new Date(maintainer.DateOfBirth).toLocaleDateString()}</TableCell>}
              {visibleColumns.zipCode && <TableCell>{maintainer.ZIPCode}</TableCell>}
              {visibleColumns.street && <TableCell>{maintainer.Street}</TableCell>}
              {visibleColumns.city && <TableCell>{maintainer.City}</TableCell>}
              {visibleColumns.province && <TableCell>{maintainer.Province}</TableCell>}
              {visibleColumns.salary && <TableCell>{maintainer.Salary.toFixed(2)}</TableCell>}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleConfig(maintainer.MaintainerID)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Config</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(maintainer.MaintainerID)} className="cursor-pointer text-red-600">
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

export default MaintainerDataTable;
