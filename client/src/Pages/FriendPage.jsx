import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { SearchIcon, UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendFound from "../components/NoFriendFound";

const FriendPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Filter friends based on search term
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.nativeLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.learningLanguage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100">
      <div className="container mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your Friends
            </h1>
            <p className="text-base-content opacity-70 mt-2">
              Manage your language exchange partners
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
            <Link to="/" className="btn btn-primary btn-sm">
              Find New Friends
            </Link>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-50 size-4" />
              <input
                type="text"
                placeholder="Search friends by name or language..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Friends Count */}
          <div className="stats shadow bg-base-200">
            <div className="stat py-4 px-6">
              <div className="stat-title text-sm">Total Friends</div>
              <div className="stat-value text-2xl">{friends.length}</div>
            </div>
          </div>
        </div>

        {/* Friends Grid */}
        {loadingFriends ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredFriends.length === 0 ? (
          searchTerm ? (
            <div className="card bg-base-200 p-8 text-center">
              <SearchIcon className="size-16 mx-auto text-base-content opacity-30 mb-4" />
              <h3 className="font-semibold text-xl mb-2">No friends found</h3>
              <p className="text-base-content opacity-70">
                Try searching with different keywords or{" "}
                <button
                  className="link link-primary"
                  onClick={() => setSearchTerm("")}
                >
                  clear your search
                </button>
              </p>
            </div>
          ) : (
            <NoFriendFound />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPage;
