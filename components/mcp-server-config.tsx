'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface ToolConfig {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
}

interface ResourceConfig {
  id: string;
  uri: string;
  name: string;
  description: string;
}

interface PromptConfig {
  id: string;
  name: string;
  description: string;
  template: string;
}

interface MCPServerConfigProps {
  onConfigChange?: (config: {
    tools: ToolConfig[];
    resources: ResourceConfig[];
    prompts: PromptConfig[];
  }) => void;
}

export function MCPServerConfig({ onConfigChange }: MCPServerConfigProps) {
  const [tools, setTools] = useState<ToolConfig[]>([
    {
      id: '1',
      name: 'example-tool',
      description: 'An example interactive tool',
      inputSchema: '{ "type": "object", "properties": {} }',
    },
  ]);

  const [resources, setResources] = useState<ResourceConfig[]>([
    {
      id: '1',
      uri: 'ui://my-component/instance-1',
      name: 'My Widget',
      description: 'Interactive UI widget',
    },
  ]);

  const [prompts, setPrompts] = useState<PromptConfig[]>([
    {
      id: '1',
      name: 'example-prompt',
      description: 'Example prompt template',
      template: 'You are a helpful assistant.',
    },
  ]);

  const handleToolChange = (id: string, field: keyof ToolConfig, value: string) => {
    const updated = tools.map((tool) => (tool.id === id ? { ...tool, [field]: value } : tool));
    setTools(updated);
    onConfigChange?.({ tools: updated, resources, prompts });
  };

  const handleAddTool = () => {
    const newTool: ToolConfig = {
      id: Date.now().toString(),
      name: `tool-${tools.length + 1}`,
      description: 'New tool',
      inputSchema: '{ "type": "object", "properties": {} }',
    };
    const updated = [...tools, newTool];
    setTools(updated);
    onConfigChange?.({ tools: updated, resources, prompts });
  };

  const handleRemoveTool = (id: string) => {
    const updated = tools.filter((tool) => tool.id !== id);
    setTools(updated);
    onConfigChange?.({ tools: updated, resources, prompts });
  };

  const handleResourceChange = (id: string, field: keyof ResourceConfig, value: string) => {
    const updated = resources.map((resource) =>
      resource.id === id ? { ...resource, [field]: value } : resource
    );
    setResources(updated);
    onConfigChange?.({ tools, resources: updated, prompts });
  };

  const handleAddResource = () => {
    const newResource: ResourceConfig = {
      id: Date.now().toString(),
      uri: `ui://component/instance-${resources.length + 1}`,
      name: `Resource ${resources.length + 1}`,
      description: 'New resource',
    };
    const updated = [...resources, newResource];
    setResources(updated);
    onConfigChange?.({ tools, resources: updated, prompts });
  };

  const handleRemoveResource = (id: string) => {
    const updated = resources.filter((resource) => resource.id !== id);
    setResources(updated);
    onConfigChange?.({ tools, resources: updated, prompts });
  };

  const handlePromptChange = (id: string, field: keyof PromptConfig, value: string) => {
    const updated = prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, [field]: value } : prompt
    );
    setPrompts(updated);
    onConfigChange?.({ tools, resources, prompts: updated });
  };

  const handleAddPrompt = () => {
    const newPrompt: PromptConfig = {
      id: Date.now().toString(),
      name: `prompt-${prompts.length + 1}`,
      description: 'New prompt',
      template: 'You are a helpful assistant.',
    };
    const updated = [...prompts, newPrompt];
    setPrompts(updated);
    onConfigChange?.({ tools, resources, prompts: updated });
  };

  const handleRemovePrompt = (id: string) => {
    const updated = prompts.filter((prompt) => prompt.id !== id);
    setPrompts(updated);
    onConfigChange?.({ tools, resources, prompts: updated });
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="tools" className="flex h-full flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="tools" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>MCP Tools</span>
                  <Button size="sm" onClick={handleAddTool}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure tools exposed by your MCP server. Tools allow AI assistants to perform
                  actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle className="mb-2 h-8 w-8" />
                    <p>No tools configured</p>
                  </div>
                ) : (
                  tools.map((tool) => (
                    <Card key={tool.id} className="border-2">
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Tool Configuration</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTool(tool.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tool-name-${tool.id}`}>Name</Label>
                          <Input
                            id={`tool-name-${tool.id}`}
                            value={tool.name}
                            onChange={(e) => handleToolChange(tool.id, 'name', e.target.value)}
                            placeholder="tool-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tool-desc-${tool.id}`}>Description</Label>
                          <Input
                            id={`tool-desc-${tool.id}`}
                            value={tool.description}
                            onChange={(e) =>
                              handleToolChange(tool.id, 'description', e.target.value)
                            }
                            placeholder="Tool description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tool-schema-${tool.id}`}>Input Schema (JSON)</Label>
                          <textarea
                            id={`tool-schema-${tool.id}`}
                            value={tool.inputSchema}
                            onChange={(e) =>
                              handleToolChange(tool.id, 'inputSchema', e.target.value)
                            }
                            placeholder='{ "type": "object", "properties": {} }'
                            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>MCP Resources</span>
                  <Button size="sm" onClick={handleAddResource}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure resources exposed by your MCP server. Resources provide UI templates
                  and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resources.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle className="mb-2 h-8 w-8" />
                    <p>No resources configured</p>
                  </div>
                ) : (
                  resources.map((resource) => (
                    <Card key={resource.id} className="border-2">
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Resource Configuration</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-uri-${resource.id}`}>URI</Label>
                          <Input
                            id={`resource-uri-${resource.id}`}
                            value={resource.uri}
                            onChange={(e) => handleResourceChange(resource.id, 'uri', e.target.value)}
                            placeholder="ui://component/instance"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-name-${resource.id}`}>Name</Label>
                          <Input
                            id={`resource-name-${resource.id}`}
                            value={resource.name}
                            onChange={(e) =>
                              handleResourceChange(resource.id, 'name', e.target.value)
                            }
                            placeholder="Resource name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`resource-desc-${resource.id}`}>Description</Label>
                          <Input
                            id={`resource-desc-${resource.id}`}
                            value={resource.description}
                            onChange={(e) =>
                              handleResourceChange(resource.id, 'description', e.target.value)
                            }
                            placeholder="Resource description"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="m-0 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>MCP Prompts</span>
                  <Button size="sm" onClick={handleAddPrompt}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Prompt
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure prompts exposed by your MCP server. Prompts provide reusable templates
                  for interactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prompts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle className="mb-2 h-8 w-8" />
                    <p>No prompts configured</p>
                  </div>
                ) : (
                  prompts.map((prompt) => (
                    <Card key={prompt.id} className="border-2">
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Prompt Configuration</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePrompt(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`prompt-name-${prompt.id}`}>Name</Label>
                          <Input
                            id={`prompt-name-${prompt.id}`}
                            value={prompt.name}
                            onChange={(e) => handlePromptChange(prompt.id, 'name', e.target.value)}
                            placeholder="prompt-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`prompt-desc-${prompt.id}`}>Description</Label>
                          <Input
                            id={`prompt-desc-${prompt.id}`}
                            value={prompt.description}
                            onChange={(e) =>
                              handlePromptChange(prompt.id, 'description', e.target.value)
                            }
                            placeholder="Prompt description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`prompt-template-${prompt.id}`}>Template</Label>
                          <textarea
                            id={`prompt-template-${prompt.id}`}
                            value={prompt.template}
                            onChange={(e) =>
                              handlePromptChange(prompt.id, 'template', e.target.value)
                            }
                            placeholder="You are a helpful assistant..."
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
