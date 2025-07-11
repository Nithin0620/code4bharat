import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI study assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
      return 'I can help you with mathematics! What specific math topic would you like to study? I can assist with algebra, calculus, geometry, and more.';
    } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry')) {
      return 'Science is fascinating! Are you looking for help with Physics, Chemistry, or Biology? I can explain concepts, help with problems, and suggest study materials.';
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      return 'Great! I can help you create effective study plans, suggest learning techniques, and provide practice questions. What subject would you like to focus on?';
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return 'I can help you prepare for quizzes and tests! Would you like me to create practice questions for a specific subject or help you review key concepts?';
    } else {
      return 'I\'m here to help with your studies! You can ask me about any subject, request explanations of concepts, or get help with homework. What would you like to learn about?';
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="text-gray-600 mt-2">Get instant help with your studies</p>
      </div>

      <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">EduBot</h3>
              <p className="text-sm text-blue-100">Your AI Study Assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setInputMessage('Help me with math homework')}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Math Help</h3>
                <p className="text-sm text-gray-600">Get help with math problems</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage('Create a study plan for science')}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Study Plan</h3>
                <p className="text-sm text-gray-600">Create a personalized study schedule</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage('Explain photosynthesis')}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Concept Explanation</h3>
                <p className="text-sm text-gray-600">Get detailed explanations</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage('Give me practice questions for history')}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Practice Questions</h3>
                <p className="text-sm text-gray-600">Get quiz questions to practice</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;