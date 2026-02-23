"use client";

import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { Users, TrendingUp, Clock, Bell, Search, LogOut } from "lucide-react";
import Link from "next/link"
export default function UserDashboard() {
  const { user, logOut } = useAuth();
  const { queues, joinQueue } = useQueue();

  const handleJoinQueue = (queueId) => {
    if (user) {
      joinQueue(queueId, user.name, user.id);
    } else {
      console.warn("user is not logged in")
    }
  };

  // User's active queues
  const myQueues = user
    ? queues.filter((queue) => queue.items.some((item) => item.userId === user?.id)
      )
    : [];      
  
       

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QueueFlow</h1>
                {user &&<p className="text-xs text-gray-500">{user.email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={logOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-600 mt-1">Find and join queues near you</p>
        </div>

        {/* My Active Queues */}
        {myQueues.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Queues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myQueues.map((queue) => {
                const myPosition = queue.items.find((item) => item.userId === user?.id);
                return (
                  <Link
                    key={queue.id}
                    href={`/user/queue/${queue.id}`}
                    className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{queue.businessName}</h4>
                        <p className="text-sm text-gray-600">{queue.category}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Your Position</span>
                        <span className="font-bold text-blue-600 text-lg">#{myPosition?.position}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estimated Wait</span>
                        <span className="font-medium text-gray-900">{myPosition?.estimatedWaitTime} min</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business name or category..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Available Queues */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Queues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queues.map((queue) => {
              const isJoined = queue.items.some((item) => item.userId === user?.id);
              return (
                <div key={queue.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{queue.businessName}</h4>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {queue.category}
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${queue.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{queue.currentQueueLength} people in queue</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>~{queue.averageServiceTime} min per person</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Est. wait: {queue.currentQueueLength * queue.averageServiceTime} min</span>
                    </div>
                  </div>

                  {isJoined ? (
                    <Link
                      href={`/user/queue/${queue.id}`}
                      className="block w-full py-2 text-center bg-gray-100 text-gray-700 rounded-lg font-medium"
                    >
                      View Queue
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleJoinQueue(queue.id)}
                      disabled={!queue.isOpen}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {queue.isOpen ? "Join Queue" : "Closed"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
