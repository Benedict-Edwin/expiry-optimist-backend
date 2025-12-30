import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Database, CheckCircle, XCircle } from 'lucide-react';
import { getApiConfig, setApiConfig, ApiConfig } from '@/lib/apiConfig';
import { toast } from '@/hooks/use-toast';

interface ApiConfigDialogProps {
  onConfigChange?: () => void;
}

export const ApiConfigDialog = ({ onConfigChange }: ApiConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ApiConfig>({ baseUrl: '', apiKey: '', enabled: false });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    setConfig(getApiConfig());
  }, [open]);

  const handleSave = () => {
    setApiConfig(config);
    toast({
      title: 'API Configuration Saved',
      description: config.enabled ? 'External API is now enabled' : 'Using mock data',
    });
    setOpen(false);
    onConfigChange?.();
  };

  const handleTest = async () => {
    if (!config.baseUrl) {
      toast({
        title: 'Error',
        description: 'Please enter an API URL',
        variant: 'destructive',
      });
      return;
    }

    setTestStatus('testing');

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const response = await fetch(`${config.baseUrl}/health`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        setTestStatus('success');
        toast({
          title: 'Connection Successful',
          description: 'API is reachable and responding',
        });
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      setTestStatus('error');
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Could not connect to API',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          API Config
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            External Database API
          </DialogTitle>
          <DialogDescription>
            Configure your external API endpoint to fetch real data. The API should return data in the expected format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="api-enabled">Enable External API</Label>
            <Switch
              id="api-enabled"
              checked={config.enabled}
              onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              placeholder="https://your-api.com/api/v1"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Your API should expose: /products, /sales, /kpi, /alerts endpoints
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Bearer token or API key"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest} disabled={!config.baseUrl} className="flex-1">
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              {testStatus === 'success' && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
              {testStatus === 'error' && <XCircle className="ml-2 h-4 w-4 text-red-500" />}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Configuration
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-sm font-medium">Expected API Response Format</p>
          <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
{`GET /products → Product[]
GET /sales → DailySale[]
GET /kpi → { totalProducts, ... }
GET /alerts → Alert[]
GET /health → { status: "ok" }`}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};
