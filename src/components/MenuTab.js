// src/components/MenuTab.js
import React, { useState } from 'react';

function MenuTab() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Pub Burger', category: 'Food', price: 12.99, description: 'Juicy burger with cheese and bacon' },
    { id: 2, name: 'Craft Beer', category: 'Drinks', price: 5.99, description: 'Local IPA' },
    { id: 3, name: 'Fish & Chips', category: 'Food', price: 14.99, description: 'Classic English dish with tartar sauce' },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: '',
    category: 'Food',
    price: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ 
      ...currentItem, 
      [name]: name === 'price' ? parseFloat(value) || '' : value 
    });
  };

  const resetForm = () => {
    setCurrentItem({
      id: null,
      name: '',
      category: 'Food',
      price: '',
      description: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentItem.name || !currentItem.price) {
      alert('Please fill all required fields');
      return;
    }

    if (isEditing) {
      // Update existing menu item
      setMenuItems(
        menuItems.map((item) =>
          item.id === currentItem.id ? currentItem : item
        )
      );
    } else {
      // Add new menu item
      const newItem = {
        ...currentItem,
        id: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1
      };
      setMenuItems([...menuItems, newItem]);
    }
    
    resetForm();
  };

  const editItem = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Item Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Food</option>
                <option>Drinks</option>
                <option>Desserts</option>
                <option>Snacks</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price*
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={currentItem.price}
                  onChange={handleInputChange}
                  className="block w-full pl-7 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="2"
              value={currentItem.description}
              onChange={handleInputChange}
              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">Menu Items List</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{item.category}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">${item.price.toFixed(2)}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{item.description}</td>
                  <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                    <button
                      onClick={() => editItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MenuTab;