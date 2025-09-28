import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { CloudCog } from "lucide-react";

const LeaderboardTable = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard?page=${currentPage}&limit=${usersPerPage}`);
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages); 
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const formatJoinDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) return "Today";
    if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) === 1 ? "" : "s"} ago`;
    return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) === 1 ? "" : "s"} ago`;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return <span className="text-lg font-bold text-yellow-500">{rank}</span>;
    if (rank === 2) return <span className="text-lg font-bold text-gray-400">{rank}</span>;
    if (rank === 3) return <span className="text-lg font-bold text-amber-600">{rank}</span>;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50";
    return "bg-dark-card border-gray-700";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-dark-card border-gray-700 rounded-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="px-5">
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-gray-300 font-semibold w-20 text-center">Rank</TableHead>
                <TableHead className="text-gray-300 font-semibold">User</TableHead>
                <TableHead className="text-gray-300 font-semibold text-center">Questions Solved</TableHead>
                <TableHead className="text-gray-300 font-semibold text-center">Accuracy</TableHead>
                <TableHead className="text-gray-300 font-semibold text-center">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                console.log(user);
                const rank = (currentPage - 1) * usersPerPage + index + 1;
                const accuracy = user.submissions === 0 ? 0 : ((user.correctSubmissions / user.submissions) * 100).toFixed(1);
                return (
                  <TableRow key={user._id} className={`border-gray-700 hover:bg-gray-800/30 ${getRankStyle(rank)}`}>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center w-16">
                        {getRankDisplay(rank)}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-code-blue to-code-purple rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(user.name)}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-800 border border-gray-600">
                        <span className="text-white font-semibold text-sm">{user.solvedTotal}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <span className="text-white font-medium">{accuracy}%</span>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <span className="text-gray-400">{formatJoinDate(user.createdAt)}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <Pagination className="justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 text-gray-300"} bg-dark-card border-gray-700`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
                className={`${
                  currentPage === page
                    ? "bg-code-blue text-white border-code-blue"
                    : "bg-dark-card border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 text-gray-300"} bg-dark-card border-gray-700`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default LeaderboardTable;
