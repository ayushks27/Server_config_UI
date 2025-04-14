'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Search, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { AVAILABLE_APPS, APP_TOOLS } from './mockData';

// Define props for the component
type SelectToolsStepProps = {
  selectedApps: string[];
  selectedTools: {
    [app: string]: string[];
  };
  onSelectApp: (app: string, selected: boolean) => void;
  onSelectTool: (app: string, tool: string, selected: boolean) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function SelectToolsStep({
  selectedApps,
  selectedTools,
  onSelectApp,
  onSelectTool,
  onNext,
  onBack,
}: SelectToolsStepProps) {
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('apps');
  const [toolSearchQuery, setToolSearchQuery] = useState('');

  // Count total selected tools across all apps
  const totalSelectedTools = Object.values(selectedTools).reduce(
    (total, tools) => total + tools.length,
    0
  );

  // Filter apps based on search query
  const filteredApps = AVAILABLE_APPS.filter(app =>
    app.name.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  // Group apps by category
  const appsByCategory = filteredApps.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = [];
    }
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_APPS>);

  // Get tools for the currently selected app
  const currentAppTools = selectedApp ? (APP_TOOLS[selectedApp as keyof typeof APP_TOOLS] || []) : [];

  // Filter tools based on search query
  const filteredTools = currentAppTools.filter(tool =>
    tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase())
  );

  // Group tools by category
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof currentAppTools>);

  // Handle selecting an app and moving to tools tab
  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
    setActiveTab('tools');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Count tools by category for the selected app
  const getToolCountByCategory = (appId: string, category: string) => {
    if (!APP_TOOLS[appId as keyof typeof APP_TOOLS]) return 0;

    return APP_TOOLS[appId as keyof typeof APP_TOOLS].filter(
      tool => tool.category === category
    ).length;
  };

  const getSelectedToolCountByCategory = (appId: string, category: string) => {
    if (!selectedTools[appId]) return 0;

    const categoryTools = APP_TOOLS[appId as keyof typeof APP_TOOLS].filter(
      tool => tool.category === category
    );

    return categoryTools.filter(
      tool => selectedTools[appId].includes(tool.id)
    ).length;
  };

  // Organize tool categories for the current app
  const getToolCategories = (appId: string) => {
    if (!APP_TOOLS[appId as keyof typeof APP_TOOLS]) return [];

    const categories = Array.from(
      new Set(APP_TOOLS[appId as keyof typeof APP_TOOLS].map(tool => tool.category))
    );

    // Ensure "Important" is first if it exists
    return categories.sort((a, b) => {
      if (a === 'Important') return -1;
      if (b === 'Important') return 1;
      return a.localeCompare(b);
    });
  };

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="mr-8">
              <TabsList className="grid grid-cols-2 w-[300px]">
                <TabsTrigger value="apps" className="text-sm rounded-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Applications
                </TabsTrigger>
                <TabsTrigger value="tools" disabled={!selectedApp} className="text-sm rounded-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Selected Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex justify-end items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-medium">{totalSelectedTools}/30 tools</span>
                <Progress value={(totalSelectedTools / 30) * 100} className="w-32 h-2 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="apps" className="h-full overflow-hidden flex flex-col">
            <div className="p-6 pb-3">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 pt-3">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
              >
                {/* Render apps by category */}
                {Object.entries(appsByCategory).map(([category, apps]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {apps.map((app) => {
                        const isSelected = selectedApps.includes(app.id);

                        return (
                          <motion.div key={app.id} variants={itemVariants}>
                            <Card
                              className={`cursor-pointer transition-all hover:shadow-md border overflow-hidden ${
                                isSelected
                                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                                  : 'border-gray-200 hover:border-blue-200'
                              }`}
                              onClick={() => onSelectApp(app.id, !isSelected)}
                            >
                              <CardContent className="p-0">
                                <div className="p-4 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md mr-3">
                                      <span>{app.icon}</span>
                                    </div>
                                    <span className="font-medium">{app.name}</span>
                                  </div>

                                  <div className="flex space-x-2 items-center">
                                    {isSelected && (
                                      <Badge variant="outline" className="border-blue-300 bg-blue-100 text-blue-600 text-xs">
                                        {selectedTools[app.id]?.length || 0}
                                        {selectedTools[app.id]?.length === 1 ? ' tool' : ' tools'}
                                      </Badge>
                                    )}

                                    <div
                                      className={`w-5 h-5 flex items-center justify-center rounded-full ${
                                        isSelected ? 'bg-blue-500' : 'border border-gray-300'
                                      }`}
                                    >
                                      {isSelected && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div
                                    className="px-4 py-2 border-t border-blue-200 text-sm bg-blue-50 flex justify-between"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAppSelect(app.id);
                                    }}
                                  >
                                    <span className="text-blue-600 hover:text-blue-800 font-medium">Configure tools</span>
                                    <ArrowRight className="h-4 w-4 text-blue-600" />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="h-full overflow-hidden flex flex-col">
            {selectedApp && (
              <>
                <div className="p-6 pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md mr-3">
                        <span>
                          {AVAILABLE_APPS.find(app => app.id === selectedApp)?.icon}
                        </span>
                      </div>
                      <span className="font-medium text-lg">
                        {AVAILABLE_APPS.find(app => app.id === selectedApp)?.name} Tools
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500"
                      onClick={() => setActiveTab('apps')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Apps
                    </Button>
                  </div>

                  <div className="mt-4 relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tools..."
                      value={toolSearchQuery}
                      onChange={(e) => setToolSearchQuery(e.target.value)}
                      className="pl-10 py-6 text-base"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-6"
                  >
                    {getToolCategories(selectedApp).map((category) => {
                      const categoryTools = APP_TOOLS[selectedApp as keyof typeof APP_TOOLS].filter(
                        tool => tool.category === category &&
                          tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase())
                      );

                      // Skip empty categories
                      if (categoryTools.length === 0) return null;

                      const selectedCount = getSelectedToolCountByCategory(selectedApp, category);
                      const totalCount = getToolCountByCategory(selectedApp, category);

                      return (
                        <motion.div key={category} variants={itemVariants} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-semibold text-gray-700">{category}</h3>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500">
                                {selectedCount} of {totalCount} tools selected
                              </span>

                              {category === 'Important' && totalCount > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 text-xs h-6 text-blue-600"
                                  onClick={() => {
                                    const toolIds = categoryTools.map(tool => tool.id);
                                    // If all are selected, deselect all; otherwise, select all
                                    const selectAll = selectedCount < totalCount;

                                    for (const toolId of toolIds) {
                                      onSelectTool(selectedApp, toolId, selectAll);
                                    }
                                  }}
                                >
                                  {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {categoryTools.map((tool) => {
                              const isSelected = selectedTools[selectedApp]?.includes(tool.id) || false;

                              return (
                                <Card
                                  key={tool.id}
                                  className={`border transition-all ${
                                    isSelected
                                      ? 'border-blue-200 bg-blue-50'
                                      : 'border-gray-200'
                                  }`}
                                >
                                  <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Checkbox
                                        id={`${selectedApp}-${tool.id}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          onSelectTool(selectedApp, tool.id, checked === true);
                                        }}
                                        className={`${
                                          isSelected ? 'bg-blue-600 border-blue-600' : ''
                                        } cursor-pointer`}
                                      />
                                      <label
                                        htmlFor={`${selectedApp}-${tool.id}`}
                                        className="cursor-pointer text-sm font-medium"
                                      >
                                        {tool.name}
                                      </label>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </>
            )}
          </TabsContent>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <Button variant="outline" onClick={onBack} className="px-5">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={onNext}
            disabled={totalSelectedTools === 0}
            className="px-5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
