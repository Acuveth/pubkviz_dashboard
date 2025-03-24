// src/components/QuestionsTab.js
import React, { useState, useEffect } from 'react';
import { roomsApi, questionsApi, optionsApi } from '../services/questionsApi';

function QuestionsTab() {
  const [questions, setQuestions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingOptions, setIsAddingOptions] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    room_id: '',
    text: '',
    question_type: 'TEXT',
    correct_answer: '',
    points: 1,
    time_limit: null,
    is_active: false
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questionTypes = [
    { value: 'TEXT', label: 'Text Answer' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' }
  ];

  // Fetch questions and rooms data on component mount
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
      
      // Fetch questions with their options
      const questionsData = await questionsApi.getAll();
      setQuestions(questionsData);
      
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setCurrentQuestion({ ...currentQuestion, [name]: checked });
    } else if (name === 'points' || name === 'time_limit') {
      const numValue = value === '' ? null : parseInt(value, 10);
      setCurrentQuestion({ ...currentQuestion, [name]: numValue });
    } else {
      setCurrentQuestion({ ...currentQuestion, [name]: value });
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const addOption = () => {
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const newOption = {
      option_letter: optionLetters[options.length] || '',
      option_text: ''
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    
    // Update option letters after removal
    const updatedWithLetters = updatedOptions.map((option, idx) => {
      const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      return { ...option, option_letter: optionLetters[idx] || '' };
    });
    
    setOptions(updatedWithLetters);
  };

  const resetForm = () => {
    setCurrentQuestion({
      id: null,
      room_id: '',
      text: '',
      question_type: 'TEXT',
      correct_answer: '',
      points: 1,
      time_limit: null,
      is_active: false
    });
    setOptions([]);
    setIsEditing(false);
    setIsAddingOptions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentQuestion.text || !currentQuestion.room_id) {
      alert('Please fill all required fields');
      return;
    }

    if (currentQuestion.question_type === 'MULTIPLE_CHOICE' && options.length < 2) {
      alert('Multiple choice questions require at least 2 options');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let savedQuestion;
      
      if (isEditing) {
        // Update existing question
        savedQuestion = await questionsApi.update(currentQuestion.id, currentQuestion);
      } else {
        // Create new question
        savedQuestion = await questionsApi.create(currentQuestion);
      }
      
      // If it's a multiple choice question, save the options
      if (currentQuestion.question_type === 'MULTIPLE_CHOICE') {
        await optionsApi.bulkCreateOrUpdate(savedQuestion.id, { options });
        
        // Fetch the updated question with options to get the complete data
        savedQuestion = await questionsApi.getById(savedQuestion.id);
      }
      
      // Update the questions list
      if (isEditing) {
        setQuestions(questions.map(q => q.id === savedQuestion.id ? savedQuestion : q));
      } else {
        setQuestions([...questions, savedQuestion]);
      }
      
      resetForm();
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const editQuestion = async (question) => {
    setIsEditing(true);
    setCurrentQuestion({
      id: question.id,
      room_id: question.room_id,
      text: question.text,
      question_type: question.question_type,
      correct_answer: question.correct_answer,
      points: question.points,
      time_limit: question.time_limit,
      is_active: question.is_active
    });
    
    if (question.question_type === 'MULTIPLE_CHOICE') {
      setIsAddingOptions(true);
      
      if (question.options && question.options.length > 0) {
        // Use options from the question if available
        setOptions(question.options.map(opt => ({
          option_letter: opt.option_letter,
          option_text: opt.option_text
        })));
      } else {
        // Otherwise, fetch options from the API
        try {
          setLoading(true);
          const optionsData = await optionsApi.getByQuestionId(question.id);
          setOptions(optionsData.map(opt => ({
            option_letter: opt.option_letter,
            option_text: opt.option_text
          })));
          setLoading(false);
        } catch (error) {
          handleApiError(error);
        }
      }
    } else {
      setOptions([]);
      setIsAddingOptions(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      setError(null);
      
      try {
        await questionsApi.delete(id);
        setQuestions(questions.filter(q => q.id !== id));
        setLoading(false);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const toggleQuestionType = (e) => {
    const newType = e.target.value;
    setCurrentQuestion({ ...currentQuestion, question_type: newType });
    
    if (newType === 'MULTIPLE_CHOICE') {
      setIsAddingOptions(true);
      if (options.length === 0) {
        // Initialize with two empty options
        setOptions([
          { option_letter: 'A', option_text: '' },
          { option_letter: 'B', option_text: '' }
        ]);
      }
    } else {
      setIsAddingOptions(false);
    }
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

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Question' : 'Add New Question'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="room_id" className="block text-sm font-medium text-gray-700">
                Room*
              </label>
              <select
                id="room_id"
                name="room_id"
                value={currentQuestion.room_id}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={loading}
              >
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">
                Question Type
              </label>
              <select
                id="question_type"
                name="question_type"
                value={currentQuestion.question_type}
                onChange={toggleQuestionType}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Question Text*
            </label>
            <textarea
              id="text"
              name="text"
              rows="3"
              value={currentQuestion.text}
              onChange={handleInputChange}
              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          
          {/* Multiple Choice Options */}
          {isAddingOptions && (
            <div className="p-4 space-y-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Options</h3>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-2 py-1 text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  disabled={loading || options.length >= 8}
                >
                  Add Option
                </button>
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-10">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-indigo-600 rounded-full">
                      {option.option_letter}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option.option_text}
                      onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Option text"
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700"
                    disabled={loading || options.length <= 2}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="pt-2 mt-3 border-t border-gray-200">
                <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700">
                  Correct Answer
                </label>
                <select
                  id="correct_answer"
                  name="correct_answer"
                  value={currentQuestion.correct_answer}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select correct answer</option>
                  {options.map((option, index) => (
                    <option key={index} value={option.option_letter}>
                      {option.option_letter} - {option.option_text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Text Answer */}
          {currentQuestion.question_type === 'TEXT' && (
            <div>
              <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700">
                Correct Answer*
              </label>
              <input
                type="text"
                id="correct_answer"
                name="correct_answer"
                value={currentQuestion.correct_answer}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={loading}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                Points
              </label>
              <input
                type="number"
                id="points"
                name="points"
                min="1"
                value={currentQuestion.points || ''}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700">
                Time Limit (seconds, optional)
              </label>
              <input
                type="number"
                id="time_limit"
                name="time_limit"
                min="5"
                value={currentQuestion.time_limit || ''}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={currentQuestion.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              disabled={loading}
            />
            <label htmlFor="is_active" className="block ml-2 text-sm text-gray-700">
              Active (available for quiz)
            </label>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
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
        <h2 className="text-lg font-medium text-gray-900">Questions List</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Question</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Room</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Answer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Points</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{question.text}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {rooms.find(room => room.id === question.room_id)?.name || question.room_id}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {question.question_type === 'TEXT' ? 'Text Answer' : 'Multiple Choice'}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{question.correct_answer}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{question.points}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {question.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                    <button
                      onClick={() => editQuestion(question)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-4 pl-4 pr-3 text-sm font-medium text-gray-500 text-center">
                    No questions found. Add your first question above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuestionsTab;