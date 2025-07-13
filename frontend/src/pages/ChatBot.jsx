import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, ChevronDown, Menu, X, Clock } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';
import chaptersData from '../data/chapters_per_subject.json';


const chatsJson= {
    "messages": [
        {
            "role": "user",
            "content": "What is nutrition in animals?",
            "_id": "6872c74404332718f321cbbd"
        },
        {
            "role": "assistant",
            "content": "According to the NCERT book, nutrition in animals, also known as heterotrophic nutrition, involves the intake of complex material prepared by other organisms. Animals, including humans, cannot make their own food like plants do, so they need to consume other organisms or plants to obtain energy and nutrients. This process involves the breakdown of complex substances into simpler ones that can be used by the body for growth, maintenance, and energy. In humans, this process occurs in the alimentary canal, which includes the mouth, esophagus, stomach, small intestine, and large intestine, with the help of digestive enzymes and other specialized structures. (Figure 5.6, Page 85)",
            "_id": "6872c74404332718f321cbbe"
        },
        {
            "role": "user",
            "content": "And what about plants?",
            "_id": "6872c77504332718f321cbc5"
        },
        {
            "role": "assistant",
            "content": "According to the NCERT book, plants get the raw materials required for photosynthesis from the following sources: \n- Water is taken up from the soil by the roots in terrestrial plants.\n- Carbon dioxide is taken from the atmosphere through stomata on the leaves.\n- Nitrogen, phosphorus, iron, and magnesium are taken up from the soil by the roots. \n\nThis information can be found on page 84 of the NCERT book.",
            "_id": "6872c77504332718f321cbc6"
        },
        {
            "role": "user",
            "content": "And what about plants?"
        },
        {
            "role": "assistant",
            "content": "According to the NCERT book, page 82, plants get each of the raw materials required for photosynthesis from the following sources: \n- Carbon dioxide and water are taken in from the atmosphere and soil, respectively.\n- Other materials like nitrogen, phosphorus, iron, and magnesium are taken up from the soil through the roots. \n- Nitrogen is taken up in the form of inorganic nitrates or nitrites, or as organic compounds prepared by bacteria from atmospheric nitrogen."
        }
    ],
    "sessionId": "6872c74004332718f321cbba"
}

const youtubeVideos={
    "results": [
        {
            "title": "The Third level Class 12 | Animated | Full (हिन्दी में) Explained | Third Level Class 12 in Hindi",
            "url": "https://www.youtube.com/watch?v=UAYdy-eDWjk",
            "views": 3352719,
            "upload_date": "2023-07-24T10:00:10Z",
            "days_old": 719,
            "score": 3351439.42,
            "channel": "Educational Bhaiya"
        },
        {
            "title": "The Third Level Class 12 animated video The Third Level Class 12 animation in English",
            "url": "https://www.youtube.com/watch?v=AxLTshcNuXQ",
            "views": 625118,
            "upload_date": "2022-03-23T09:28:44Z",
            "days_old": 1207,
            "score": 460719.38,
            "channel": "Students Heaven"
        },
        {
            "title": "The Third Level  Class 12 English Explanation In Tamil",
            "url": "https://www.youtube.com/watch?v=6axA0woKHxQ",
            "views": 308504,
            "upload_date": "2022-05-23T02:30:01Z",
            "days_old": 1147,
            "score": 218010.85,
            "channel": "English Abaca"
        }
    ]
}

// Mock recent chats data
const recentChatsData = {
  "success": true,
  "data": [
    {
      "_id": "6872c74004332718f321cbba",
      "user": "6872a819928562c45f68aa9a",
      "title": "What is nutrition in animals?",
      "class_num": 10,
      "subject": "science",
      "chapter": "Life Processes",
      "createdAt": "2025-07-12T20:36:16.917Z",
      "__v": 0
    },
    {
      "_id": "6872c6fe5e78ccf414601df8",
      "user": "6872a819928562c45f68aa9a",
      "title": "What is nutrition in animals?",
      "class_num": 10,
      "subject": "science",
      "chapter": "Life Processes",
      "createdAt": "2025-07-12T20:35:10.416Z",
      "__v": 0
    }
  ]
};

const ChatBot = () => {
  // Helper function to convert chatsJson messages to component format
  const convertChatsToMessages = () => {
    const convertedMessages = [
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AI study assistant. How can I help you today?',
        timestamp: new Date()
      }
    ];
    
    // Convert messages from chatsJson
    if (chatsJson.messages) {
      chatsJson.messages.forEach((msg, index) => {
        convertedMessages.push({
          id: index + 2,
          type: msg.role === 'user' ? 'user' : 'bot',
          content: msg.content,
          timestamp: new Date(Date.now() - (chatsJson.messages.length - index) * 60000) // Simulate timestamps
        });
      });
    }
    
    return convertedMessages;
  };

  const [messages, setMessages] = useState(convertChatsToMessages());
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState(recentChatsData.data);
  const [activeChat, setActiveChat] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const messagesEndRef = useRef(null);

  const { formData } = useAuthStore();
  const userClass = formData?.whichClass || '6';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get subjects for user's class
  const getSubjectsForClass = () => {
    const classData = chaptersData[userClass];
    return classData ? Object.keys(classData) : [];
  };
  
  // Get chapters for selected subject
  const getChaptersForSubject = () => {
    if (!selectedSubject) return [];
    const classData = chaptersData[userClass];
    return classData?.[selectedSubject] || [];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Check if the message is requesting YouTube videos
    if (inputMessage.toLowerCase().includes('youtube') || inputMessage.toLowerCase().includes('videos')) {
      setShowVideos(true);
    }

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
    
    // Enhanced responses based on selected subject/chapter
    if (selectedSubject && selectedChapter) {
      return `I can help you with ${selectedSubject} - ${selectedChapter}. What specific concept or problem would you like me to explain?`;
    }
    
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

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for recent chats
  const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsSidebarOpen(false);
    // Here you would typically load the chat messages for the selected chat
    // For now, we'll just close the sidebar
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="text-gray-600 mt-2">Get instant help with your studies</p>
      </div>

      {/* Subject and Chapter Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md ">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Subject & Chapter (Class {userClass})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedSubject ? 'text-gray-900' : 'text-gray-500'}>
                {selectedSubject || 'Select Subject'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {isSubjectDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {getSubjectsForClass().map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedChapter('');
                      setIsSubjectDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 capitalize"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chapter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
              disabled={!selectedSubject}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span className={selectedChapter ? 'text-gray-900' : 'text-gray-500'}>
                {selectedChapter || 'Select Chapter'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {isChapterDropdownOpen && selectedSubject && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {getChaptersForSubject().map((chapter) => (
                  <button
                    key={chapter}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setIsChapterDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 text-sm"
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex bg-white rounded-lg shadow-md h-[500px] relative">
        {/* Sidebar */}
        <div className={`absolute inset-y-0 left-0 z-1 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Recent Chats List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border ${
                      activeChat?._id === chat._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.title}
                        </p>
                        {chat.chapter && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {chat.chapter}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent chats</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg lg:rounded-tl-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">EduBot</h3>
                  <p className="text-sm text-blue-100">Your AI Study Assistant</p>
                </div>
              </div>
              {activeChat && (
                <div className="text-right">
                  <p className="text-sm font-medium">{activeChat.title}</p>
                  <p className="text-xs text-blue-100">
                    {activeChat.subject} • Class {activeChat.class_num}
                  </p>
                </div>
              )}
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
      </div>

      {/* YouTube Videos Section */}
      {showVideos && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Related YouTube Videos</h2>
            <button
              onClick={() => setShowVideos(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {youtubeVideos.results.map((video, index) => {
              const videoId = getYouTubeVideoId(video.url);
              return (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                        {video.channel}
                      </span>
                      <span className="text-xs">{video.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{video.days_old} days ago</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Questions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Explain key concepts in ${selectedChapter} from ${selectedSubject}` 
                : 'Explain photosynthesis'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Concept Explanation</h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Understand ${selectedChapter} concepts` 
                    : 'Get detailed explanations'
                  }
                </p>
              </div>
            </div>
          </button>
          
          
          <button
            onClick={() => {
              setShowVideos(true);
            }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedSubject && selectedChapter ? 'YouTube Videos' : 'Videos'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Get videos for ${selectedChapter}` 
                    : 'Get videos for subject'
                  }
                </p>
              </div>
            </div>
          </button>
          
       <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Give me flashcards for ${selectedChapter} from ${selectedSubject}` 
                : 'Give me flashcards for subject'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedSubject ? `${selectedSubject} Flashcards` : 'Subject Flashcards'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedChapter ? `Get flashcards of ${selectedChapter}` : 'Get get flashcards for subject'}
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Give me a summary of ${selectedChapter} from ${selectedSubject}` 
                : 'Give me practice questions for history'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedSubject && selectedChapter ? 'Chapter Summary' : 'Practice Questions'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Get summary of ${selectedChapter}` 
                    : 'Get quiz questions to practice'
                  }
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;