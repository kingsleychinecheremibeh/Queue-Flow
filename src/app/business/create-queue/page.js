'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';
import { ArrowLeft } from 'lucide-react';

export default function CreateQueue() {
  const router = useRouter();
  const { user } = useAuth();
  const { createQueue } = useQueue();
  const [formData, setFormData] = useState({
    queueName: '',
    category: '',
    averageServiceTime: 15,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'averageServiceTime' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.queueName || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    createQueue(
      user.id,
      user.businessName,
      formData.queueName,
      formData.category,
      formData.averageServiceTime
    );

    alert('Queue created successfully!');
    router.push('/business/dashboard');
  };

  if (!user || user.role !== 'business') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Only businesses can access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/business/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Queue</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Queue Name */}
            <div>
              <label htmlFor="queueName" className="block text-sm font-medium text-gray-700 mb-2">
                Queue Name
              </label>
              <input
                type="text"
                id="queueName"
                name="queueName"
                value={formData.queueName}
                onChange={handleChange}
                placeholder="e.g., General Registration, Checkout"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Government">Government</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Bank">Bank</option>
                <option value="Post Office">Post Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Average Service Time */}
            <div>
              <label htmlFor="averageServiceTime" className="block text-sm font-medium text-gray-700 mb-2">
                Average Service Time (minutes)
              </label>
              <input
                type="number"
                id="averageServiceTime"
                name="averageServiceTime"
                value={formData.averageServiceTime}
                onChange={handleChange}
                min="1"
                max="300"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Queue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
