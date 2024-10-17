"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

// Mock data - replace this with actual data fetching logic
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    textEnabled: true,
    emailEnabled: true,
    conditions: [
      { condition1: "value1" },
      { condition2: "value2" },
      { condition3: "value3" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+0987654321",
    textEnabled: false,
    emailEnabled: true,
    conditions: [{ condition1: "value1" }, { condition2: "value2" }],
  },
  // Add more mock users as needed
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const totalUsers = mockUsers.length;
  const usersWithTextEnabled = mockUsers.filter(
    (user) => user.textEnabled
  ).length;
  const usersWithEmailEnabled = mockUsers.filter(
    (user) => user.emailEnabled
  ).length;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column)
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users with Text Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithTextEnabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users with Email Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithEmailEnabled}</div>
          </CardContent>
        </Card>
      </div>

      <Input
        type="search"
        placeholder="Search users..."
        className="max-w-sm mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {["name", "email", "phone", "textEnabled", "emailEnabled"].map(
                (column) => (
                  <TableHead key={column} className="px-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column)}
                      className="min-w-[100px] justify-between font-bold"
                    >
                      <span>
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </span>
                      <SortIcon column={column} />
                    </Button>
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.textEnabled ? "Yes" : "No"}</TableCell>
                  <TableCell>{user.emailEnabled ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
