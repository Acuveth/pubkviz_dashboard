// src/components/Dashboard.js
import React, { useState } from 'react';
import QuestionsTab from './QuestionsTab';
import MenuTab from './MenuTab';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">PubQuiz Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.username}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'questions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            Questions Management
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'menu'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Items Management
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {activeTab === 'questions' ? <QuestionsTab /> : <MenuTab />}
      </main>
    </div>
  );
}

export default Dashboard;