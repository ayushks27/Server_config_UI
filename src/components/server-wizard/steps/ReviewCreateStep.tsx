'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { ServerConfig } from '../ServerWizard';

// Import mock data
import { AVAILABLE_APPS, APP_TOOLS } from './mockData';

type ReviewCreateStepProps = {
  serverConfig: ServerConfig;
  onBack: () => void;
  onCreateServer: () => void;
};

export default function ReviewCreateStep({
  serverConfig,
  onBack,
  onCreateServer,
}: ReviewCreateStepProps) {
  // Count total selected tools
  const totalSelectedTools = Object.values(serverConfig.selectedTools).reduce(
    (total, tools) => total + tools.length,
    0
  );

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

  // Handle server creation with animation and notification
  const handleCreateServer = () => {
    toast.promise(
      // In a real app, this would be an API call
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Creating your server...',
        success: `${serverConfig.name} server created successfully!`,
        error: 'Failed to create server. Please try again.',
      }
    );

    onCreateServer();
  };

  // Find app name by id
  const getAppName = (appId: string) => {
    return AVAILABLE_APPS.find(app => app.id === appId)?.name || appId;
  };

  // Find app icon by id
  const getAppIcon = (appId: string) => {
    return AVAILABLE_APPS.find(app => app.id === appId)?.icon || '📦';
  };

  // Get tool name by app id and tool id
  const getToolName = (appId: string, toolId: string) => {
    const appTools = APP_TOOLS[appId as keyof typeof APP_TOOLS] || [];
    return appTools.find(tool => tool.id === toolId)?.name || toolId;
  };

  // Group tools by category for an app
  const getToolsByCategory = (appId: string) => {
    if (!serverConfig.selectedTools[appId] || !APP_TOOLS[appId as keyof typeof APP_TOOLS]) {
      return {};
    }

    const result: Record<string, string[]> = {};
    const appTools = APP_TOOLS[appId as keyof typeof APP_TOOLS];

    for (const toolId of serverConfig.selectedTools[appId]) {
      const tool = appTools.find(t => t.id === toolId);
      if (tool) {
        if (!result[tool.category]) {
          result[tool.category] = [];
        }
        result[tool.category].push(toolId);
      }
    }

    return result;
  };

  return (
    <div className="p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ml-3">Review Your Server</h2>
          </div>
          <p className="text-gray-600">
            Review your server configuration before creating it. You can go back to make changes.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <Card className="overflow-hidden border-blue-100">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-700">Server Details</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Server Name</p>
                  <p className="text-lg font-medium text-gray-800">{serverConfig.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Server URL</p>
                  <p className="text-lg font-medium text-gray-800">
                    {serverConfig.name
                      ? `https://${serverConfig.name.toLowerCase().replace(/\s+/g, '-')}.mcp-server.cloud`
                      : 'https://your-server-name.mcp-server.cloud'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Tools Selected</p>
                <div className="flex items-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {totalSelectedTools} of 30 tools
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Selected Applications & Tools</h3>

          {serverConfig.selectedApps.length === 0 ? (
            <div className="text-gray-500 italic">No applications selected</div>
          ) : (
            <div className="space-y-4">
              {serverConfig.selectedApps.map((appId) => {
                const appName = getAppName(appId);
                const appIcon = getAppIcon(appId);
                const toolsByCategory = getToolsByCategory(appId);
                const toolCount = serverConfig.selectedTools[appId]?.length || 0;

                return (
                  <Card key={appId} className="border-gray-200">
                    <CardContent className="p-0">
                      <div className="p-4 border-b border-gray-100 flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md mr-3">
                          <span>{appIcon}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{appName}</h4>
                          <p className="text-sm text-gray-500">
                            {toolCount} {toolCount === 1 ? 'tool' : 'tools'} selected
                          </p>
                        </div>
                      </div>

                      {Object.entries(toolsByCategory).length > 0 ? (
                        <div className="px-4 py-3">
                          {Object.entries(toolsByCategory).map(([category, toolIds]) => (
                            <div key={category} className="mb-4 last:mb-0">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                {category}
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {toolIds.map(toolId => (
                                  <Badge
                                    key={toolId}
                                    variant="outline"
                                    className="bg-blue-50 border-blue-200 text-blue-700"
                                  >
                                    {getToolName(appId, toolId)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-gray-500 italic text-sm">
                          No tools selected for this application
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="px-5">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleCreateServer}
            disabled={!serverConfig.name || totalSelectedTools === 0}
            className="px-5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Server
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
