'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { ArrowLeft, Users, Clock, Activity, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function QueueView({ params }) {
  const { queueId } = params;
  const { user } = useAuth();
  const { getQueueById } = useQueue();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  const queue = queueId ? getQueueById(queueId) : undefined;
  const myPosition = queue?.items.find((item) => item.userId === user?.id);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!queue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Queue not found</p>
          <button
            onClick={() => router.push("/user/dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{queue.businessName}</h1>
              <p className="text-gray-600">{queue.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-xl font-mono font-semibold text-gray-900">{formatTime(currentTime)}</p>
            </div>
          </div>
        </div>

        {/* Your Position Card */}
        {myPosition && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="text-center">
              <p className="text-blue-100 mb-2">Your Position</p>
              <div className="text-7xl font-bold mb-4">#{myPosition.position}</div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Estimated wait: {myPosition.estimatedWaitTime} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Alert */}
        {myPosition?.position === 1 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">You`re Next!</h3>
                <p className="text-sm text-green-700 mt-1">Please be ready. You`ll be called soon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Queue Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">People in Queue</p>
                <p className="text-xl font-bold text-gray-900">{queue.currentQueueLength}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Service Time</p>
                <p className="text-xl font-bold text-gray-900">{queue.averageServiceTime} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold text-gray-900">{queue.isOpen ? "Open" : "Closed"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Queue Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Queue</h2>
          <div className="space-y-3">
            {queue.items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Queue is empty</p>
            ) : (
              queue.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    item.userId === user?.id
                      ? "border-blue-600 bg-blue-50"
                      : item.status === "called"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      item.userId === user?.id
                        ? "bg-blue-600 text-white"
                        : item.status === "called"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.userId === user?.id ? "You" : item.userName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Joined {new Date(item.joinedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.status === "called" ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Being Served
                      </span>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Est. wait</p>
                        <p className="font-semibold text-gray-900">{item.estimatedWaitTime} min</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
