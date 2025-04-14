'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import StepIndicator from './StepIndicator';
import NameServerStep from './steps/NameServerStep';
import SelectToolsStep from './steps/SelectToolsStep';
import ReviewCreateStep from './steps/ReviewCreateStep';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Lightbulb, Info, ChevronRight, ExternalLink, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AVAILABLE_APPS } from './steps/mockData';
import { Badge } from '@/components/ui/badge';

// Define the server configuration type
export type ServerConfig = {
  name: string;
  selectedApps: string[];
  selectedTools: {
    [app: string]: string[];
  };
};

// Define the steps of the wizard
export type WizardStep = 'name' | 'tools' | 'review';

export default function ServerWizard() {
  // State for the current step and server configuration
  const [currentStep, setCurrentStep] = useState<WizardStep>('name');
  const [serverConfig, setServerConfig] = useState<ServerConfig>({
    name: '',
    selectedApps: [],
    selectedTools: {},
  });
  const [isShowingHelpTip, setIsShowingHelpTip] = useState(false);

  // Show a help tip when the component mounts
  useEffect(() => {
    const helpTipTimer = setTimeout(() => {
      setIsShowingHelpTip(true);
      setTimeout(() => setIsShowingHelpTip(false), 5000); // Hide after 5 seconds
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(helpTipTimer);
  }, []);

  // Count total selected tools across all apps
  const totalSelectedTools = Object.values(serverConfig.selectedTools).reduce(
    (total, tools) => total + tools.length,
    0
  );

  // Calculate progress percentage
  const progressPercentage =
    currentStep === 'name'
      ? serverConfig.name ? 33 : 0
      : currentStep === 'tools'
        ? serverConfig.selectedApps.length ? 66 : 33
        : 100;

  // Handler for moving to the next step
  const handleNext = () => {
    if (currentStep === 'name') {
      setCurrentStep('tools');
      toast.success('Server name saved!', {
        description: 'Now select the tools you want to include.',
        position: 'top-center',
        duration: 3000,
      });
    } else if (currentStep === 'tools') {
      setCurrentStep('review');
      toast.success('Tool selection saved!', {
        description: 'Review your configuration before creating your server.',
        position: 'top-center',
        duration: 3000,
      });
    }
  };

  // Handler for moving to the previous step
  const handleBack = () => {
    if (currentStep === 'tools') setCurrentStep('name');
    else if (currentStep === 'review') setCurrentStep('tools');
  };

  // Helper to generate a random server configuration
  const generateRandomConfig = () => {
    // Generate a random server name
    const adjectives = ['Production', 'Development', 'Testing', 'Staging', 'Demo', 'Enterprise', 'Cloud'];
    const nouns = ['API', 'Web', 'Gateway', 'Core', 'Main', 'DataSync', 'Auth'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} Server`;

    // Select random apps (2-4 apps)
    const shuffledApps = [...AVAILABLE_APPS].sort(() => 0.5 - Math.random());
    const selectedAppCount = Math.floor(Math.random() * 3) + 2; // Random number between 2-4
    const randomApps = shuffledApps.slice(0, selectedAppCount).map(app => app.id);

    // Create tools for each app
    const toolsMap: Record<string, string[]> = {};
    for (const appId of randomApps) {
      // Find app in import
      const app = AVAILABLE_APPS.find(a => a.id === appId);
      if (app) {
        // Create random tools for each app
        toolsMap[appId] = ['list_courses', 'get_current_user', 'create_course']; // Sample tools
      }
    }

    // Update server config with random data
    setServerConfig({
      name: randomName,
      selectedApps: randomApps,
      selectedTools: toolsMap
    });

    // Show success toast
    toast.success('Demo configuration generated!', {
      description: 'We filled the form with example data for you.',
      position: 'top-center',
    });
  };

  // Render the wizard component
  return (
    <div className="relative">
      {/* Progress header */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Help tip */}
      <AnimatePresence>
        {isShowingHelpTip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-8 bg-blue-50 border border-blue-200 p-3 rounded-lg shadow-lg max-w-xs z-50"
          >
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Need help setting up?</p>
                <p className="text-xs text-blue-600 mt-1">
                  Try the "Auto-fill with Demo Data" button to see how it works, or use the help icons for guidance.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar with step indicator */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="shadow-md bg-white elevation-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Create Server</h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <span className="whitespace-nowrap">{currentStep === 'name' ? 'Step 1/3' : currentStep === 'tools' ? 'Step 2/3' : 'Step 3/3'}</span>
                </Badge>
              </div>
              <p className="text-gray-500 mb-8">Follow the steps to configure your MCP server</p>

              <StepIndicator
                currentStep={currentStep}
                onStepClick={(step) => {
                  // Only allow clicking on completed steps
                  if (
                    (step === 'tools' && serverConfig.name) ||
                    (step === 'review' && serverConfig.name && totalSelectedTools > 0)
                  ) {
                    setCurrentStep(step);
                  } else if (step === 'name') {
                    // Always allow going back to the first step
                    setCurrentStep(step);
                  }
                }}
                steps={[
                  { id: 'name', label: 'Name Server', description: 'Give your server a recognizable name' },
                  { id: 'tools', label: 'Select Tools', description: 'Choose up to 30 tools for your server' },
                  { id: 'review', label: 'Review & Create', description: 'Review your configuration and create' },
                ]}
              />

              {/* Demo section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                  <div className="flex">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Quick Setup</h3>
                      <p className="text-xs text-amber-700 mt-1">
                        Not sure where to start? Auto-fill with demo data to see how it works.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 flex items-center justify-center text-amber-700 border-amber-300 hover:bg-amber-100 transition-colors"
                    onClick={generateRandomConfig}
                  >
                    <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                    Auto-fill with Demo Data
                  </Button>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => {
                        toast.info('Documentation', {
                          description: 'Server configuration documentation would open here.',
                        });
                      }}
                    >
                      Read the documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area with step content */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="shadow-md bg-white h-full elevation-hover">
            <CardContent className="p-0">
              <div className="border-b border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  {currentStep === 'name' && (
                    <div className="text-blue-600 font-medium flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">1</span>
                      Name Your Server
                    </div>
                  )}
                  {currentStep === 'tools' && (
                    <div className="text-blue-600 font-medium flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">2</span>
                      Select Tools
                    </div>
                  )}
                  {currentStep === 'review' && (
                    <div className="text-blue-600 font-medium flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">3</span>
                      Review Configuration
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 flex items-center"
                    onClick={() => {
                      toast.info('Help Center', {
                        description: 'The help center would open here with guides and FAQ.',
                        position: 'top-center',
                      });
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Need help?</span>
                  </Button>
                </div>
              </div>

              <Tabs value={currentStep} className="w-full">
                <AnimatePresence mode="sync">
                  {currentStep === 'name' && (
                    <TabsContent value="name" className="mt-0">
                      <motion.div
                        key="name-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <NameServerStep
                          serverName={serverConfig.name}
                          onServerNameChange={(name) =>
                            setServerConfig((prev) => ({ ...prev, name }))
                          }
                          onNext={handleNext}
                        />
                      </motion.div>
                    </TabsContent>
                  )}

                  {currentStep === 'tools' && (
                    <TabsContent value="tools" className="mt-0">
                      <motion.div
                        key="tools-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SelectToolsStep
                          selectedApps={serverConfig.selectedApps}
                          selectedTools={serverConfig.selectedTools}
                          onSelectApp={(app, selected) => {
                            setServerConfig((prev) => {
                              const newSelectedApps = selected
                                ? [...prev.selectedApps, app]
                                : prev.selectedApps.filter((a) => a !== app);

                              const newSelectedTools = { ...prev.selectedTools };
                              if (!selected && newSelectedTools[app]) {
                                delete newSelectedTools[app];
                              }

                              return {
                                ...prev,
                                selectedApps: newSelectedApps,
                                selectedTools: newSelectedTools,
                              };
                            });
                          }}
                          onSelectTool={(app, tool, selected) => {
                            setServerConfig((prev) => {
                              const currentTools = prev.selectedTools[app] || [];
                              const updatedTools = selected
                                ? [...currentTools, tool]
                                : currentTools.filter((t) => t !== tool);

                              return {
                                ...prev,
                                selectedTools: {
                                  ...prev.selectedTools,
                                  [app]: updatedTools,
                                },
                              };
                            });
                          }}
                          onNext={handleNext}
                          onBack={handleBack}
                        />
                      </motion.div>
                    </TabsContent>
                  )}

                  {currentStep === 'review' && (
                    <TabsContent value="review" className="mt-0">
                      <motion.div
                        key="review-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ReviewCreateStep
                          serverConfig={serverConfig}
                          onBack={handleBack}
                          onCreateServer={() => {
                            // Handle server creation (would connect to API in a real app)
                            toast.success(`${serverConfig.name} server created!`, {
                              description: 'Your server is now being provisioned and will be ready shortly.',
                              position: 'top-center',
                              duration: 5000,
                            });

                            // Reset wizard after successful creation
                            setTimeout(() => {
                              setServerConfig({
                                name: '',
                                selectedApps: [],
                                selectedTools: {},
                              });
                              setCurrentStep('name');

                              toast.info('Server created successfully', {
                                description: 'You can now create another server or close this wizard.',
                                action: {
                                  label: 'View Dashboard',
                                  onClick: () => alert('This would navigate to the dashboard'),
                                },
                              });
                            }, 2000);
                          }}
                        />
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
