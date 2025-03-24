// src/components/RoomsTab.js
import React, { useState, useEffect } from 'react';

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

  // Load data on component mount
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For this example, we'll use mock data
    
    // Mock rooms
    const mockRooms = [
      { id: 'sample_room', name: 'Sample Pub Quiz', is_active: true, created_at: '2025-03-11 20:49:35' },
      { id: 'test_room', name: 'Test Room', is_active: true, created_at: '2025-03-12 19:03:40' },
      { id: 'weekly_quiz', name: 'Weekly Trivia Night', is_active: true, created_at: '2025-03-11 20:49:35' }
    ];
    
    // Mock menus
    const mockMenus = [
      { id: 1, name: 'Main Food Menu', description: 'Regular food items' },
      { id: 2, name: 'Weekend Special Menu', description: 'Special items available only on weekends' },
      { id: 3, name: 'Drinks Menu', description: 'Beverages and cocktails' }
    ];
    
    // Mock room menu settings
    const mockRoomMenuSettings = [
      { 
        room_id: 'sample_room', 
        show_menu: true, 
        menu_id: 1, 
        menu_description: 'Enjoy our delicious pub food while you play!', 
        created_at: '2025-03-12 19:46:46' 
      }
    ];
    
    setRooms(mockRooms);
    setAvailableMenus(mockMenus);
    setRoomMenuSettings(mockRoomMenuSettings);
  }, []);

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
  
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    
    if (!currentRoom.id || !currentRoom.name) {
      alert('Room ID and name are required');
      return;
    }
    
    if (isEditingRoom) {
      // Update existing room
      setRooms(
        rooms.map((room) =>
          room.id === currentRoom.id ? currentRoom : room
        )
      );
    } else {
      // Check if room ID already exists
      if (rooms.some(room => room.id === currentRoom.id)) {
        alert('A room with this ID already exists');
        return;
      }
      
      // Add new room
      const newRoom = {
        ...currentRoom,
        created_at: new Date().toISOString()
      };
      setRooms([...rooms, newRoom]);
    }
    
    resetRoomForm();
  };
  
  const editRoom = (room) => {
    setIsEditingRoom(true);
    setCurrentRoom(room);
  };
  
  const deleteRoom = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== id));
      // Also delete any associated menu settings
      setRoomMenuSettings(roomMenuSettings.filter(setting => setting.room_id !== id));
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
  
  const manageRoomMenuSettings = (roomId) => {
    // Check if menu settings exist for this room
    const existingSettings = roomMenuSettings.find(setting => setting.room_id === roomId);
    
    if (existingSettings) {
      setCurrentRoomMenuSetting(existingSettings);
    } else {
      setCurrentRoomMenuSetting({
        room_id: roomId,
        show_menu: true,
        menu_id: availableMenus.length > 0 ? availableMenus[0].id : '',
        menu_description: ''
      });
    }
    
    setShowRoomMenuSettingsForm(true);
  };
  
  const handleRoomMenuSettingSubmit = (e) => {
    e.preventDefault();
    
    // Check if setting already exists for this room
    const existingSettingIndex = roomMenuSettings.findIndex(
      setting => setting.room_id === currentRoomMenuSetting.room_id
    );
    
    if (existingSettingIndex >= 0) {
      // Update existing setting
      const updatedSettings = [...roomMenuSettings];
      updatedSettings[existingSettingIndex] = {
        ...currentRoomMenuSetting,
        created_at: new Date().toISOString()
      };
      setRoomMenuSettings(updatedSettings);
    } else {
      // Add new setting
      const newSetting = {
        ...currentRoomMenuSetting,
        created_at: new Date().toISOString()
      };
      setRoomMenuSettings([...roomMenuSettings, newSetting]);
    }
    
    setShowRoomMenuSettingsForm(false);
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
                disabled={isEditingRoom} // Can't change room ID when editing
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
            >
              {isEditingRoom ? 'Update Room' : 'Add Room'}
            </button>
            
            {isEditingRoom && (
              <button
                type="button"
                onClick={resetRoomForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => manageRoomMenuSettings(room.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Menu Settings
                      </button>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rooms.length === 0 && (
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
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional text to display above the menu
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Settings
                </button>
                
                <button
                  type="button"
                  onClick={cancelRoomMenuSettingForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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