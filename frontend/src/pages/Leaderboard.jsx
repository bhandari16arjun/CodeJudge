import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("overall");

  return (
    <div className="min-h-screen bg-dark-bg">
      
      {/* Top Section with Gradient Background */}
      <div className="bg-gradient-to-b from-gray-800 to-dark-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-400 mb-2 relative">
              <span className="relative inline-block">&lt;&gt;</span>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-normal text-white mr-2">CodeCraft</span>
              <span className="text-4xl font-light text-white">Leaderboard</span>
            </div>
            <p className="text-sm font-light text-gray-400 max-w-xl mx-auto">
              Compete with fellow coders and climb the ranks
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Leaderboard Table */}
          <div className="max-w-4xl mx-auto">
            <LeaderboardTable activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
