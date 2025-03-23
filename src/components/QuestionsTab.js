// src/components/QuestionsTab.js
import React, { useState, useEffect } from 'react';

function QuestionsTab() {
  const [questions, setQuestions] = useState([
    { id: 1, text: 'What is the capital of France?', category: 'Geography', difficulty: 'Easy', answer: 'Paris' },
    { id: 2, text: 'Who wrote "Romeo and Juliet"?', category: 'Literature', difficulty: 'Medium', answer: 'William Shakespeare' },
    { id: 3, text: 'What is the chemical symbol for gold?', category: 'Science', difficulty: 'Easy', answer: 'Au' },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    text: '',
    category: '',
    difficulty: 'Easy',
    answer: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const resetForm = () => {
    setCurrentQuestion({
      id: null,
      text: '',
      category: '',
      difficulty: 'Easy',
      answer: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentQuestion.text || !currentQuestion.category || !currentQuestion.answer) {
      alert('Please fill all required fields');
      return;
    }

    if (isEditing) {
      // Update existing question
      setQuestions(
        questions.map((q) =>
          q.id === currentQuestion.id ? currentQuestion : q
        )
      );
    } else {
      // Add new question
      const newQuestion = {
        ...currentQuestion,
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1
      };
      setQuestions([...questions, newQuestion]);
    }
    
    resetForm();
  };

  const editQuestion = (question) => {
    setIsEditing(true);
    setCurrentQuestion(question);
  };

  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Question' : 'Add New Question'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={currentQuestion.category}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={currentQuestion.difficulty}
                onChange={handleInputChange}
                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              Answer*
            </label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={currentQuestion.answer}
              onChange={handleInputChange}
              className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Question' : 'Add Question'}
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
        <h2 className="text-lg font-medium text-gray-900">Questions List</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Question</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Answer</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{question.text}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{question.category}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{question.difficulty}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{question.answer}</td>
                  <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                    <button
                      onClick={() => editQuestion(question)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
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

export default QuestionsTab;