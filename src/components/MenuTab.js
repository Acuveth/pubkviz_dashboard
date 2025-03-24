// src/components/MenuTab.js
import React, { useState, useEffect } from 'react';
import { menuApi, categoryApi, menuItemApi, itemOptionApi } from '../services/api';

function MenuTab() {
  // Main state variables
  const [activeTab, setActiveTab] = useState('menus');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Menus State
  const [menus, setMenus] = useState([]);
  const [currentMenu, setCurrentMenu] = useState({
    id: null,
    name: '',
    description: '',
    is_active: true
  });
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  // Categories State
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    menu_id: null,
    name: '',
    description: '',
    display_order: 0
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  
  // Menu Items State
  const [menuItems, setMenuItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    category_id: '',
    name: '',
    description: '',
    price: '',
    image_path: '',
    is_available: true,
    is_popular: false,
    display_order: 0
  });
  const [isEditingItem, setIsEditingItem] = useState(false);
  
  // Menu Item Options State
  const [itemOptions, setItemOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState({
    id: null,
    menu_item_id: null,
    name: '',
    price_addition: 0
  });
  const [isEditingOption, setIsEditingOption] = useState(false);
  const [selectedItemForOptions, setSelectedItemForOptions] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch data based on selected menu
  useEffect(() => {
    if (selectedMenu) {
      fetchMenuData(selectedMenu);
    }
  }, [selectedMenu]);

  // Update current category and item with selected menu info when it changes
  useEffect(() => {
    if (selectedMenu) {
      // Update current category with selected menu_id
      setCurrentCategory({
        ...currentCategory,
        menu_id: selectedMenu
      });
      
      // For currentItem, we need to find a valid category in the selected menu
      const validCategories = categories.filter(cat => cat.menu_id === selectedMenu);
      if (validCategories.length > 0) {
        setCurrentItem({
          ...currentItem,
          category_id: validCategories[0].id
        });
      } else {
        // Reset category_id if no valid categories exist
        setCurrentItem({
          ...currentItem,
          category_id: ''
        });
      }
    }
  }, [selectedMenu]);

  // Function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An unexpected error occurred');
    setLoading(false);
  };

  // Function to fetch all initial data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch menus
      const menusData = await menuApi.getAll();
      setMenus(menusData);
      
      // Set default selected menu if available
      if (menusData.length > 0) {
        setSelectedMenu(menusData[0].id);
      }
      
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Function to fetch data for a specific menu
  const fetchMenuData = async (menuId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch categories for the selected menu
      const categoriesData = await categoryApi.getAll(menuId);
      setCategories(categoriesData);
      
      // Fetch menu items for the selected menu
      const menuItemsData = await menuItemApi.getByMenuId(menuId);
      setMenuItems(menuItemsData);
      
      // Fetch options for all menu items
      // Note: This could be optimized to only fetch when needed
      const optionsData = await itemOptionApi.getAll();
      setItemOptions(optionsData);
      
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  // ===== MENU HANDLERS =====
  
  const handleMenuInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentMenu({
      ...currentMenu,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const resetMenuForm = () => {
    setCurrentMenu({
      id: null,
      name: '',
      description: '',
      is_active: true
    });
    setIsEditingMenu(false);
  };
  
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentMenu.name) {
      alert('Menu name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let responseData;
      
      if (isEditingMenu) {
        // Update existing menu
        responseData = await menuApi.update(currentMenu.id, currentMenu);
        setMenus(menus.map(menu => menu.id === responseData.id ? responseData : menu));
      } else {
        // Add new menu
        responseData = await menuApi.create(currentMenu);
        setMenus([...menus, responseData]);
        
        // Auto-select the new menu
        setSelectedMenu(responseData.id);
      }
      
      resetMenuForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const editMenu = (menu) => {
    setIsEditingMenu(true);
    setCurrentMenu(menu);
    setActiveTab('menus');
  };
  
  const deleteMenu = async (id) => {
    // Check if any categories use this menu
    const categoriesUsingMenu = categories.filter(cat => cat.menu_id === id);
    
    if (categoriesUsingMenu.length > 0) {
      alert(`Cannot delete menu: ${categoriesUsingMenu.length} categories are using it.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this menu?')) {
      setLoading(true);
      setError(null);
      
      try {
        await menuApi.delete(id);
        
        // Update local state
        setMenus(menus.filter(menu => menu.id !== id));
        
        // If the deleted menu was selected, select another menu if available
        if (selectedMenu === id) {
          const remainingMenus = menus.filter(menu => menu.id !== id);
          setSelectedMenu(remainingMenus.length > 0 ? remainingMenus[0].id : null);
        }
        
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // ===== CATEGORY HANDLERS =====
  
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value
    });
  };
  
  const resetCategoryForm = () => {
    setCurrentCategory({
      id: null,
      menu_id: selectedMenu,
      name: '',
      description: '',
      display_order: 0
    });
    setIsEditingCategory(false);
  };
  
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    if (!currentCategory.name) {
      alert('Category name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let responseData;
      
      if (isEditingCategory) {
        // Update existing category
        responseData = await categoryApi.update(currentCategory.id, currentCategory);
        setCategories(categories.map(category => category.id === responseData.id ? responseData : category));
      } else {
        // Add new category
        responseData = await categoryApi.create(currentCategory);
        setCategories([...categories, responseData]);
      }
      
      resetCategoryForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const editCategory = (category) => {
    setIsEditingCategory(true);
    setCurrentCategory(category);
    setActiveTab('categories');
  };
  
  const deleteCategory = async (id) => {
    // Check if any menu items use this category
    const itemsUsingCategory = menuItems.filter(item => item.category_id === id);
    
    if (itemsUsingCategory.length > 0) {
      alert(`Cannot delete category: ${itemsUsingCategory.length} menu items are using it.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      setError(null);
      
      try {
        await categoryApi.delete(id);
        
        // Update local state
        setCategories(categories.filter(category => category.id !== id));
        
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // ===== MENU ITEM HANDLERS =====
  
  const handleItemInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseFloat(value) || (name === 'display_order' ? 0 : '') 
          : value
    });
  };
  
  const resetItemForm = () => {
    // Find the first category in the selected menu
    const validCategories = categories.filter(cat => cat.menu_id === selectedMenu);
    
    setCurrentItem({
      id: null,
      category_id: validCategories.length > 0 ? validCategories[0].id : '',
      name: '',
      description: '',
      price: '',
      image_path: '',
      is_available: true,
      is_popular: false,
      display_order: 0
    });
    setIsEditingItem(false);
  };
  
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentItem.name || !currentItem.price || !currentItem.category_id) {
      alert('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let responseData;
      
      if (isEditingItem) {
        // Update existing menu item
        responseData = await menuItemApi.update(currentItem.id, currentItem);
        setMenuItems(menuItems.map(item => item.id === responseData.id ? responseData : item));
      } else {
        // Add new menu item
        responseData = await menuItemApi.create(currentItem);
        setMenuItems([...menuItems, responseData]);
      }
      
      resetItemForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const editItem = (item) => {
    setIsEditingItem(true);
    setCurrentItem(item);
    setActiveTab('menu-items');
  };
  
  const deleteItem = async (id) => {
    // Check if any options are associated with this item
    const optionsForItem = itemOptions.filter(option => option.menu_item_id === id);
    
    if (optionsForItem.length > 0) {
      alert(`This item has ${optionsForItem.length} options. These will also be deleted.`);
    }
    
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setLoading(true);
      setError(null);
      
      try {
        await menuItemApi.delete(id);
        
        // Update local state
        setMenuItems(menuItems.filter(item => item.id !== id));
        // Also remove any associated options
        setItemOptions(itemOptions.filter(option => option.menu_item_id !== id));
        
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // ===== MENU ITEM OPTIONS HANDLERS =====
  
  const handleOptionInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOption({
      ...currentOption,
      [name]: name === 'price_addition' ? parseFloat(value) || 0 : value
    });
  };
  
  const resetOptionForm = () => {
    setCurrentOption({
      id: null,
      menu_item_id: selectedItemForOptions,
      name: '',
      price_addition: 0
    });
    setIsEditingOption(false);
  };
  
  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentOption.name) {
      alert('Option name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let responseData;
      
      if (isEditingOption) {
        // Update existing option
        responseData = await itemOptionApi.update(currentOption.id, currentOption);
        setItemOptions(itemOptions.map(option => option.id === responseData.id ? responseData : option));
      } else {
        // Add new option
        responseData = await itemOptionApi.create(currentOption);
        setItemOptions([...itemOptions, responseData]);
      }
      
      resetOptionForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const editOption = (option) => {
    setIsEditingOption(true);
    setCurrentOption(option);
  };
  
  const deleteOption = async (id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      setLoading(true);
      setError(null);
      
      try {
        await itemOptionApi.delete(id);
        
        // Update local state
        setItemOptions(itemOptions.filter(option => option.id !== id));
        
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };
  
  const openItemOptions = (itemId) => {
    setSelectedItemForOptions(itemId);
    setActiveTab('options');
    // Reset the current option but set the menu_item_id
    setCurrentOption({
      id: null,
      menu_item_id: itemId,
      name: '',
      price_addition: 0
    });
  };

  // Get the selected item name for display in options tab
  const getSelectedItemName = () => {
    const item = menuItems.find(item => item.id === selectedItemForOptions);
    return item ? item.name : '';
  };

  // Find category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get menu name by ID
  const getMenuName = (menuId) => {
    const menu = menus.find(menu => menu.id === menuId);
    return menu ? menu.name : 'Unknown';
  };

  // Get filtered categories for the selected menu
  const getFilteredCategories = () => {
    return categories.filter(category => category.menu_id === selectedMenu);
  };

  // Get filtered menu items for the selected menu
  const getFilteredMenuItems = () => {
    // Get categories in the selected menu
    const menuCategoryIds = categories
      .filter(category => category.menu_id === selectedMenu)
      .map(category => category.id);
    
    // Return items that belong to those categories
    return menuItems.filter(item => menuCategoryIds.includes(item.category_id));
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
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

      {/* Menu Selector - Always visible */}
      {menus.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Current Menu
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Select which menu to work with
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedMenu || ''}
                onChange={(e) => setSelectedMenu(parseInt(e.target.value, 10))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={loading}
              >
                <option value="" disabled>Select a menu</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('menus')}
            className={`${
              activeTab === 'menus'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            disabled={loading}
          >
            Menus
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            disabled={!selectedMenu || loading}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('menu-items')}
            className={`${
              activeTab === 'menu-items'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            disabled={!selectedMenu || loading}
          >
            Menu Items
          </button>
          {selectedItemForOptions && (
            <button
              onClick={() => setActiveTab('options')}
              className={`${
                activeTab === 'options'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              disabled={loading}
            >
              Options for {getSelectedItemName()}
            </button>
          )}
        </nav>
      </div>

      {/* Menus Tab */}
      {activeTab === 'menus' && (
        <>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditingMenu ? 'Edit Menu' : 'Add New Menu'}
            </h2>
            
            <form onSubmit={handleMenuSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="menu-name" className="block text-sm font-medium text-gray-700">
                    Menu Name*
                  </label>
                  <input
                    type="text"
                    id="menu-name"
                    name="name"
                    value={currentMenu.name}
                    onChange={handleMenuInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    placeholder="e.g. Lunch Menu, Dinner Menu, Happy Hour"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={currentMenu.is_active}
                      onChange={handleMenuInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_active" className="font-medium text-gray-700">Active</label>
                    <p className="text-gray-500">Inactive menus won't be shown in the restaurant app</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="menu-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="menu-description"
                  name="description"
                  rows="2"
                  value={currentMenu.description}
                  onChange={handleMenuInputChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of when this menu is available"
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {isEditingMenu ? 'Update Menu' : 'Add Menu'}
                </button>
                
                {isEditingMenu && (
                  <button
                    type="button"
                    onClick={resetMenuForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Menus List</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categories</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {menus.map((menu) => {
                    const menuCategoriesCount = categories.filter(cat => cat.menu_id === menu.id).length;
                    return (
                      <tr key={menu.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{menu.name}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">{menu.description}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {menu.is_active ? 
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span> : 
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                          }
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">{menuCategoriesCount}</td>
                        <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => editMenu(menu)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMenu(menu.id);
                              setActiveTab('categories');
                            }}
                            className="text-green-600 hover:text-green-900 mr-2"
                            disabled={loading}
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => deleteMenu(menu.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {menus.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                        No menus found. Create your first menu above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && selectedMenu && (
        <>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditingCategory ? 'Edit Category' : 'Add New Category'} 
              <span className="text-gray-500 text-sm ml-2">
                for {getMenuName(selectedMenu)}
              </span>
            </h2>
            
            <form onSubmit={handleCategorySubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                    Category Name*
                  </label>
                  <input
                    type="text"
                    id="category-name"
                    name="name"
                    value={currentCategory.name}
                    onChange={handleCategoryInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={currentCategory.display_order}
                    onChange={handleCategoryInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="category-description"
                  name="description"
                  rows="2"
                  value={currentCategory.description}
                  onChange={handleCategoryInputChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {isEditingCategory ? 'Update Category' : 'Add Category'}
                </button>
                
                {isEditingCategory && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              Categories for {getMenuName(selectedMenu)}
            </h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Display Order</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {getFilteredCategories().map((category) => (
                    <tr key={category.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{category.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{category.description}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{category.display_order}</td>
                      <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <button
                          onClick={() => editCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {getFilteredCategories().length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                        No categories found for this menu. Add your first category above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'menu-items' && selectedMenu && (
        <>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              <span className="text-gray-500 text-sm ml-2">
                for {getMenuName(selectedMenu)}
              </span>
            </h2>
            
            <form onSubmit={handleItemSubmit} className="mt-4 space-y-4">
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
                    onChange={handleItemInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                    Category*
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={currentItem.category_id}
                    onChange={handleItemInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select a category</option>
                    {getFilteredCategories().map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      onChange={handleItemInputChange}
                      className="block w-full pl-7 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={currentItem.display_order}
                    onChange={handleItemInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="image_path" className="block text-sm font-medium text-gray-700">
                    Image Path
                  </label>
                  <input
                    type="text"
                    id="image_path"
                    name="image_path"
                    value={currentItem.image_path}
                    onChange={handleItemInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  />
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
                  onChange={handleItemInputChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_available"
                      name="is_available"
                      type="checkbox"
                      checked={currentItem.is_available}
                      onChange={handleItemInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_available" className="font-medium text-gray-700">Available</label>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_popular"
                      name="is_popular"
                      type="checkbox"
                      checked={currentItem.is_popular}
                      onChange={handleItemInputChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_popular" className="font-medium text-gray-700">Popular</label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {isEditingItem ? 'Update Item' : 'Add Item'}
                </button>
                
                {isEditingItem && (
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              Menu Items for {getMenuName(selectedMenu)}
            </h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {getFilteredMenuItems().map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{getCategoryName(item.category_id)}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {item.is_available ? 
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span> : 
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unavailable</span>
                        }
                        {item.is_popular && 
                          <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Popular</span>
                        }
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{item.description}</td>
                      <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <button
                          onClick={() => editItem(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openItemOptions(item.id)}
                          className="text-green-600 hover:text-green-900 mr-2"
                          disabled={loading}
                        >
                          Options
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {getFilteredMenuItems().length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                        No menu items found for this menu. Add your first item above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Options Tab */}
      {activeTab === 'options' && selectedItemForOptions && (
        <>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditingOption ? 'Edit Option' : 'Add New Option'} for {getSelectedItemName()}
            </h2>
            
            <form onSubmit={handleOptionSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="option-name" className="block text-sm font-medium text-gray-700">
                    Option Name*
                  </label>
                  <input
                    type="text"
                    id="option-name"
                    name="name"
                    value={currentOption.name}
                    onChange={handleOptionInputChange}
                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="price_addition" className="block text-sm font-medium text-gray-700">
                    Additional Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      id="price_addition"
                      name="price_addition"
                      value={currentOption.price_addition}
                      onChange={handleOptionInputChange}
                      className="block w-full pl-7 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {isEditingOption ? 'Update Option' : 'Add Option'}
                </button>
                
                {isEditingOption && (
                  <button
                    type="button"
                    onClick={resetOptionForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => setActiveTab('menu-items')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  Back to Menu Items
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900">Options for {getSelectedItemName()}</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price Addition</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {itemOptions
                    .filter(option => option.menu_item_id === selectedItemForOptions)
                    .map((option) => (
                    <tr key={option.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{option.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${parseFloat(option.price_addition).toFixed(2)}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <button
                          onClick={() => editOption(option)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOption(option.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {itemOptions.filter(option => option.menu_item_id === selectedItemForOptions).length === 0 && !loading && (
                    <tr>
                      <td colSpan="3" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                        No options found for this menu item
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MenuTab;