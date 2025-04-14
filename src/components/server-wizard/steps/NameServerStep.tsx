'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NameServerStepProps = {
  serverName: string;
  onServerNameChange: (name: string) => void;
  onNext: () => void;
};

// Common server name suggestions
const SERVER_NAME_SUGGESTIONS = [
  'Production API',
  'Development Web',
  'Auth Gateway',
  'Analytics Dashboard',
  'Testing Environment',
];

export default function NameServerStep({
  serverName,
  onServerNameChange,
  onNext,
}: NameServerStepProps) {
  const [nameError, setNameError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show suggestions after a delay when input is focused and empty
  useEffect(() => {
    if (isFocused && !serverName && !showSuggestions) {
      const timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFocused, serverName, showSuggestions]);

  // Validate the server name
  useEffect(() => {
    if (!isDirty) return;

    if (!serverName.trim()) {
      setNameError('Server name is required');
    } else if (serverName.trim().length < 3) {
      setNameError('Server name must be at least 3 characters');
    } else if (serverName.trim().length > 50) {
      setNameError('Server name must be less than 50 characters');
    } else if (!/^[a-zA-Z0-9-_\s]+$/.test(serverName)) {
      setNameError('Only letters, numbers, spaces, hyphens, and underscores are allowed');
    } else {
      setNameError('');
    }
  }, [serverName, isDirty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onServerNameChange(e.target.value);
    setIsDirty(true);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDirty(true);

    if (!serverName.trim() || nameError) return;

    onNext();
  };

  const handleSuggestionClick = (suggestion: string) => {
    onServerNameChange(`${suggestion} Server`);
    setIsDirty(true);
    setShowSuggestions(false);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="p-5 rounded-lg border border-blue-100 bg-gradient-blue mb-5">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Name Your Server</h2>
                <p className="text-gray-600 mt-1">
                  Give your server a recognizable name that will help you identify it later.
                </p>
                <div className="mt-3 flex items-center">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    REQUIRED
                  </Badge>
                  <span className="ml-2 text-xs text-gray-500">Step 1 of 3</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="serverName"
                className="block text-sm font-medium text-gray-700"
              >
                Server Name
              </label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-blue-600"
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                      setShowSuggestions(true);
                    }
                  }}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  See examples
                </Button>
              </div>
            </div>
            <div className="relative">
              <Input
                ref={inputRef}
                id="serverName"
                placeholder="e.g., Production API Server"
                value={serverName}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className={`w-full px-4 py-6 text-lg border rounded-lg focus-ring
                  ${nameError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'}`}
              />

              {isDirty && !nameError && serverName.trim() && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                >
                  <Check className="h-5 w-5" />
                </motion.span>
              )}

              {/* Name suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Suggested server names:</p>
                    </div>
                    <ul className="py-1 max-h-60 overflow-auto custom-scrollbar">
                      {SERVER_NAME_SUGGESTIONS.map((suggestion) => (
                        <li
                          key={suggestion}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion} Server
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {nameError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-start text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{nameError}</span>
              </motion.div>
            )}

            <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600 font-medium">
                    Your server will be available at:
                  </p>
                  <p className="mt-1 text-sm text-blue-600 font-mono truncate">
                    {serverName
                      ? `https://${serverName.toLowerCase().replace(/\s+/g, '-')}.mcp-server.cloud`
                      : 'https://your-server-name.mcp-server.cloud'}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Tips: Choose a descriptive name that reflects the purpose of your server.
                  This will help you and your team identify it easily later.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center"
          >
            <div className="text-sm text-gray-500">
              Press Enter or click Continue to proceed
            </div>

            <Button
              type="submit"
              disabled={!serverName.trim() || !!nameError}
              className={`px-6 py-2 flex items-center ${
                !serverName.trim() || !!nameError
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 animate-pulse-subtle'
              } text-white transition-colors`}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
