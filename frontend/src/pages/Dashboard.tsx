import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Code, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  CheckCircle, 
  Circle,
  LogOut,
  User,
  Zap,
  Trophy,
  UploadCloud,
  Target
} from 'lucide-react';
import { getProblems, logout, getCurrentUser } from '../api';

interface Problem {
  _id: { $oid: string };
  title: string;
  slug: string;
  description: string;
  constraints: string;
  samples: Array<{
    input_data: string;
    expected_output: string;
    hidden: boolean;
  }>;
  test_cases: Array<{
    input_data: string;
    expected_output: string;
    hidden: boolean;
  }>;
}

export default function Dashboard() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const navigate = useNavigate();
  
  const user = getCurrentUser();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await getProblems();
      setProblems(response.data);
    } catch (error) {
      toast.error('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const getDifficulty = (problem: Problem) => {
    const testCaseCount = problem.test_cases?.length || 0;
    if (testCaseCount <= 2) return 'Easy';
    if (testCaseCount <= 4) return 'Medium';
    return 'Hard';
  };
  const filteredProblems = problems
    .filter(problem => {
      const searchTermMatch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase());
        const curr = getDifficulty(problem)
      const difficultyMatch =
        filterDifficulty === 'all' ||
        curr === filterDifficulty;

      return searchTermMatch && difficultyMatch;
    });


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-xl mr-3">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CodeJudge</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.isAdmin && (
                 <Link
                   to="/upload-problem"
                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                 >
                   <UploadCloud className="h-4 w-4 mr-2" />
                   Upload Problem
                 </Link>
               )}
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username}! 👋
              </h2>
              <p className="text-blue-100 text-lg">
                Ready to solve some coding challenges? Let's improve your skills together.
              </p>
            </div>
            
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No problems found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            filteredProblems.map((problem) => {
              const difficulty = getDifficulty(problem);
              return (
                <Link
                  key={problem._id.$oid}
                  to={`/problem/${problem.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group-hover:translate-y-[-2px]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Circle className="h-5 w-5 text-gray-400 mr-2" />
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {problem.title}
                          </h3>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {problem.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{problem.test_cases?.length || 0} test cases</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          <span>0 submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                        <span className="text-sm font-medium mr-1">Solve</span>
                        <Code className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}