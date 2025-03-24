// src/components/RoomsTab.js
import React, { useState, useEffect } from 'react';
import { roomsApi, roomMenuSettingsApi, getAvailableMenus } from '../services/roomsApi';

function RoomsTab() {
  // Rooms State
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    id: '',
    name: '',
    is_active: true
  });
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  
  // Available Menus State
  const [availableMenus, setAvailableMenus] = useState([]);
  
  // Room Menu Settings State
  const [roomMenuSettings, setRoomMenuSettings] = useState([]);
  const [currentRoomMenuSetting, setCurrentRoomMenuSetting] = useState({
    room_id: '',
    show_menu: true,
    menu_id: '',
    menu_description: ''
  });
  const [showRoomMenuSettingsForm, setShowRoomMenuSettingsForm] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An unexpected error occurred');
    setLoading(false);
  };

  // Function to fetch all required data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch rooms
      const roomsData = await roomsApi.getAll();
      setRooms(roomsData);
      
      // Fetch available menus
      const menusData = await getAvailableMenus();
      setAvailableMenus(menusData);
      
      // Fetch room menu settings
      const settingsData = await roomMenuSettingsApi.getAll();
      setRoomMenuSettings(settingsData);
      
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Room handlers
  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom({
      ...currentRoom,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const resetRoomForm = () => {
    setCurrentRoom({
      id: '',
      name: '',
      is_active: true
    });
    setIsEditingRoom(false);
  };
  
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentRoom.id || !currentRoom.name) {
      alert('Room ID and name are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isEditingRoom) {
        // Update existing room
        const updatedRoom = await roomsApi.update(currentRoom.id, currentRoom);
        setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
      } else {
        // Check if room ID already exists
        if (rooms.some(room => room.id === currentRoom.id)) {
          alert('A room with this ID already exists');
          setLoading(false);
          return;
        }
        
        // Add new room
        const newRoom = await roomsApi.create(currentRoom);
        setRooms([...rooms, newRoom]);
      }
      
      resetRoomForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const editRoom = (room) => {
    setIsEditingRoom(true);
    setCurrentRoom(room);
  };
  
  const deleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setLoading(true);
      setError(null);
      
      try {
        await roomsApi.delete(id);
        
        // Update local state
        setRooms(rooms.filter(room => room.id !== id));
        
        // Delete is cascaded on the backend, but we'll also update the frontend state
        setRoomMenuSettings(roomMenuSettings.filter(setting => setting.room_id !== id));
        
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };
  
  // Room Menu Settings handlers
  const handleRoomMenuSettingInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoomMenuSetting({
      ...currentRoomMenuSetting,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const manageRoomMenuSettings = async (roomId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if menu settings exist for this room
      const existingSettingIndex = roomMenuSettings.findIndex(
        setting => setting.room_id === roomId
      );
      
      if (existingSettingIndex >= 0) {
        // Use existing settings from state
        setCurrentRoomMenuSetting(roomMenuSettings[existingSettingIndex]);
      } else {
        try {
          // Try to fetch settings from API in case they exist but aren't in local state
          const settings = await roomMenuSettingsApi.getByRoomId(roomId);
          setCurrentRoomMenuSetting(settings);
        } catch (error) {
          // Settings don't exist yet, create new default settings
          setCurrentRoomMenuSetting({
            room_id: roomId,
            show_menu: true,
            menu_id: availableMenus.length > 0 ? availableMenus[0].id : '',
            menu_description: ''
          });
        }
      }
      
      setShowRoomMenuSettingsForm(true);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const handleRoomMenuSettingSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if setting already exists for this room
      const existingSettingIndex = roomMenuSettings.findIndex(
        setting => setting.room_id === currentRoomMenuSetting.room_id
      );
      
      let savedSettings;
      
      if (existingSettingIndex >= 0) {
        // Update existing setting
        savedSettings = await roomMenuSettingsApi.update(
          currentRoomMenuSetting.room_id, 
          currentRoomMenuSetting
        );
        
        // Update local state
        const updatedSettings = [...roomMenuSettings];
        updatedSettings[existingSettingIndex] = savedSettings;
        setRoomMenuSettings(updatedSettings);
      } else {
        // Add new setting
        savedSettings = await roomMenuSettingsApi.create(currentRoomMenuSetting);
        setRoomMenuSettings([...roomMenuSettings, savedSettings]);
      }
      
      setShowRoomMenuSettingsForm(false);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const cancelRoomMenuSettingForm = () => {
    setShowRoomMenuSettingsForm(false);
  };
  
  // Get room name by ID
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown';
  };

  // Get menu name by ID
  const getMenuName = (menuId) => {
    const menu = availableMenus.find(m => m.id === parseInt(menuId, 10));
    return menu ? menu.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-indigo-600">Loading...</span>
        </div>
      )}

      {/* Rooms Form */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditingRoom ? 'Edit Room' : 'Add New Room'}
        </h2>
        
        <form onSubmit={handleRoomSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="room-id" className="block text-sm font-medium text-gray-700">
                Room ID*
              </label>
              <input
                type="text"
                id="room-id"
                name="id"
                value={currentRoom.id}
                onChange={handleRoomInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isEditingRoom || loading} // Can't change room ID when editing
              />
              <p className="mt-1 text-xs text-gray-500">
                Unique identifier used in the system (e.g., weekly_quiz)
              </p>
            </div>
            
            <div>
              <label htmlFor="room-name" className="block text-sm font-medium text-gray-700">
                Room Name*
              </label>
              <input
                type="text"
                id="room-name"
                name="name"
                value={currentRoom.name}
                onChange={handleRoomInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={currentRoom.is_active}
                onChange={handleRoomInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="is_active" className="font-medium text-gray-700">Active</label>
              <p className="text-gray-500">Inactive rooms won't be available for quizzes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {isEditingRoom ? 'Update Room' : 'Add Room'}
            </button>
            
            {isEditingRoom && (
              <button
                type="button"
                onClick={resetRoomForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Rooms List */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">Rooms List</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Menu Settings</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rooms.map((room) => {
                const menuSetting = roomMenuSettings.find(setting => setting.room_id === room.id);
                return (
                  <tr key={room.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{room.id}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{room.name}</td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {room.is_active ? 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span> : 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                      }
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {menuSetting ? (
                        <div>
                          {menuSetting.show_menu ? (
                            <div>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                                Menu Enabled
                              </span>
                              <div className="text-sm mt-1">
                                <span className="text-gray-700 font-medium">Menu: </span>
                                {getMenuName(menuSetting.menu_id)}
                              </div>
                            </div>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Menu Disabled
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No menu settings</span>
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                      <button
                        onClick={() => editRoom(room)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => manageRoomMenuSettings(room.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                        disabled={loading}
                      >
                        Menu Settings
                      </button>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rooms.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Room Menu Settings Form (Modal-like) */}
      {showRoomMenuSettingsForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Menu Settings for {getRoomName(currentRoomMenuSetting.room_id)}
            </h3>
            
            <form onSubmit={handleRoomMenuSettingSubmit} className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="show_menu"
                    name="show_menu"
                    type="checkbox"
                    checked={currentRoomMenuSetting.show_menu}
                    onChange={handleRoomMenuSettingInputChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    disabled={loading}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="show_menu" className="font-medium text-gray-700">Show Menu</label>
                  <p className="text-gray-500">Enable or disable the menu for this room</p>
                </div>
              </div>
              
              {currentRoomMenuSetting.show_menu && (
                <div>
                  <label htmlFor="menu_id" className="block text-sm font-medium text-gray-700">
                    Select Menu
                  </label>
                  <select
                    id="menu_id"
                    name="menu_id"
                    value={currentRoomMenuSetting.menu_id}
                    onChange={handleRoomMenuSettingInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  >
                    <option value="">Select a menu</option>
                    {availableMenus.map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="menu_description" className="block text-sm font-medium text-gray-700">
                  Menu Description
                </label>
                <textarea
                  id="menu_description"
                  name="menu_description"
                  rows="2"
                  value={currentRoomMenuSetting.menu_description || ''}
                  onChange={handleRoomMenuSettingInputChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional text to display above the menu
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Save Settings
                </button>
                
                <button
                  type="button"
                  onClick={cancelRoomMenuSettingForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsTab;