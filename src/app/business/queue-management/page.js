'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import {
  Users,
  Clock,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Phone,
  CheckCircle,
} from "lucide-react";

export default function QueueManagement() {
  const { user, logOut } = useAuth();
  const { queues, callNext, completeService } = useQueue();
  const router = useRouter();

  // Get business's queue (in a real app, filter by businessId)
  const businessQueue = queues[0]; // Mock - first queue

  const handleCallNext = () => {
    if (businessQueue && businessQueue.items.length > 0) {
      callNext(businessQueue.id);
    }
  };

  const handleComplete = (itemId) => {
    if (businessQueue) {
      completeService(businessQueue.id, itemId);
    }
  };

  const currentCustomer = businessQueue?.items.find((item) => item.status === "called");
  const waitingCustomers = businessQueue?.items.filter((item) => item.status === "waiting") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/business/dashboard")}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Queue Management</h1>
                  <p className="text-xs text-gray-500">{user?.businessName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold text-gray-900">{businessQueue?.currentQueueLength || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Service Time</p>
                <p className="text-2xl font-bold text-gray-900">{businessQueue?.averageServiceTime || 0} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {businessQueue?.isOpen ? "Open" : "Closed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Customer</h2>
            {currentCustomer ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-green-600 mb-2">#{currentCustomer.position}</div>
                    <p className="text-xl font-semibold text-gray-900">{currentCustomer.userName}</p>
                    <p className="text-sm text-gray-600">
                      Joined at {new Date(currentCustomer.joinedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleComplete(currentCustomer.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Service
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {waitingCustomers.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Next in line</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{waitingCustomers[0].userName}</p>
                      <p className="text-sm text-gray-600">Position #{waitingCustomers[0].position}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No customer being served</p>
                {waitingCustomers.length > 0 && (
                  <button
                    onClick={handleCallNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Call Next Customer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Waiting Queue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Waiting Queue</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {waitingCustomers.length} waiting
              </span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {waitingCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No customers waiting</p>
                  <p className="text-sm text-gray-500 mt-1">Queue is empty</p>
                </div>
              ) : (
                waitingCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {customer.position}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.userName}</p>
                        <p className="text-sm text-gray-600">
                          Joined {new Date(customer.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Est. wait</p>
                      <p className="font-semibold text-gray-900">{customer.estimatedWaitTime} min</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!currentCustomer && waitingCustomers.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCallNext}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Call Next Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
