import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Code,
  Copy,
  User,
  LogOut,
  Zap
} from 'lucide-react';
import { getProblem, submit, logout, getCurrentUser,run,aiHelp } from '../api';
import Editor from '../components/Editor';

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

interface SubmissionResult {
  id: string;
  verdict: string;
  results: Array<{
    input: string;
    expected: string;
    output: string;
    status: string;
  }>;
}

export default function ProblemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [runResult, setRunResult] = useState<SubmissionResult | null>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [input, setInput] = useState('');
  const [inputRan, setInputRan] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  const fetchProblem = async () => {
    try {
      const response = await getProblem(slug!);
      setProblem(response.data);
      
      // Set default code based on language
      setDefaultCode(language);
    } catch (error) {
      toast.error('Failed to fetch problem');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const setDefaultCode = (lang: string) => {
    const templates = {
      python: `# Write your solution here
def solve():
    # Read input
    
    # Process and solve
    
    # Print output
    pass

solve()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`
    };
    setCode(templates[lang as keyof typeof templates] || '');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setDefaultCode(newLanguage);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setResult(null);
    

    try {
      const response = await submit({
        problem_slug: slug!,
        language,
        code,
      });
      
      setResult(response.data);
      
      if (response.data.verdict === 'Accepted') {
        toast.success('🎉 All test cases passed! Great job!');
      } else {
        toast.error('Some test cases failed. Check the results below.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
      setActiveTab("verdict");
    }
  };
  const handleAIHelp = async () =>{
    if (!code.trim()) {
      toast.error('Please write some code to get AI help');
      return;
    }
    setLoadingAI(true);
    setAiResult(null);
    try{
      const response = await aiHelp({
        problem_slug: slug!,
        language,
        code,
      })
      console.log(2)
      setAiResult(response.data.suggestions);
      toast.success('AI help received successfully!');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'AI help failed');
    } finally {
      setLoadingAI(false);
      setActiveTab("ai");
    }

  }
  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setRunning(true);
    setRunResult(null);
    
    setInputRan(input);
    try {
      const response = await run({
        problem_slug: slug!,
        language,
        code,
        input
      });
      
      setRunResult(response.data);
      
      if (response.data.verdict === 'Accepted' || response.data.verdict === 'Pending') {
        toast.success('🎉 Code Executed!');
      } else {
        toast.error('Some Error Occurred. Check the results below.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Execution failed');
    } finally {
      setRunning(false);
      setActiveTab("output");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Problem not found</h3>
          <p className="text-gray-500 mb-4">The problem you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-xl mr-3">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{problem.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <p className="text-gray-600 font-mono text-sm bg-gray-50 p-3 rounded-lg">
                  {problem.constraints}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Test Cases</h3>
                <div className="space-y-4">
                  {problem.samples?.map((sample, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Input</h4>
                            <button
                              onClick={() => copyToClipboard(sample.input_data)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <pre className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                            {sample.input_data}
                          </pre>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Expected Output</h4>
                            <button
                              onClick={() => copyToClipboard(sample.expected_output)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <pre className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                            {sample.expected_output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex mt-4 space-x-2">
              {["input", "output", "verdict","ai"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-t font-medium text-sm ${
                    activeTab === tab
                      ? "bg-gray-50 text-gray-600"
                      : "bg-blue-600 text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab==='ai' ? 'AI Help' : tab.charAt(0).toUpperCase()+tab.slice(1)}
                </button>
              ))}
            </div>
            {activeTab === 'input' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Input</h3>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  rows={6}
                  placeholder="Enter custom input here"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 font-mono text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {/* Results */}
            {result && activeTab=="verdict" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Submission Results</h3>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    result.verdict === 'Accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.verdict === 'Accepted' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {result.verdict}
                  </div>
                </div>

                <div className="space-y-4">
                  {result.results.map((testResult, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Test Case {index + 1}</h4>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          testResult.status === 'AC' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testResult.status === 'AC' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {testResult.status === 'AC' ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Input</p>
                          <pre className="bg-gray-50 p-2 rounded font-mono text-gray-800 overflow-x-auto">
                            {testResult.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Expected</p>
                          <pre className="bg-gray-50 p-2 rounded font-mono text-gray-800 overflow-x-auto">
                            {testResult.expected}
                          </pre>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Your Output</p>
                          <pre className={`p-2 rounded font-mono overflow-x-auto ${
                            testResult.status === 'AC' 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-red-50 text-red-800'
                          }`}>
                            {testResult.output || '(no output)'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {runResult && activeTab=="output" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Submission Results</h3>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    runResult.verdict === 'Accepted' || runResult.verdict === 'Pending' 
                      ? 'bg-white text-white' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {runResult.verdict === 'Accepted' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {runResult.verdict}
                  </div>
                </div>

                <div className="space-y-4">
                  {runResult.results.map((testResult, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Test Case {index + 1}</h4>
                        
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Input</p>
                          <pre className="bg-gray-50 p-2 rounded font-mono text-gray-800 overflow-x-auto">
                            {inputRan === '' ? '(no input)' : inputRan}
                          </pre>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Your Output</p>
                          <pre className={`p-2 rounded font-mono overflow-x-auto ${
                            testResult.status === 'Accepted' || testResult.status === 'Pending' 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-red-50 text-red-800'
                          }`}>
                            {testResult.output || '(no output)'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab==='ai' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">AI Assistance</h3>
                {loadingAI
                  ? <p>Loading AI suggestions...</p>
                  : <div className="whitespace-pre-wrap prose prose-sm max-w-7xl overflow-auto text-gray-800">
                      <ReactMarkdown>
                        {aiResult || 'No suggestions yet.'}
                      </ReactMarkdown>
                    </div>
                  // <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{aiResult || 'No suggestions yet.'}</pre>
                }
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {running ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </button>
                <button onClick={handleAIHelp} disabled={loadingAI}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all">
                  {loadingAI ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"/> : <Zap className="h-4 w-4 mr-2"/>}
                  {loadingAI ? 'Thinking...' : 'AI Help'}
                </button>
              </div>
            </div>

            <Editor
              language={language}
              value={code}
              onChange={setCode}
              height="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}