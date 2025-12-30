import { useState, useMemo } from "react";
import {
  Bell,
  Clock,
  AlertTriangle,
  Percent,
  Trash2,
  Check,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAlerts, Alert } from "@/lib/mockData";

const alertTypeConfig = {
  expiry: {
    icon: Clock,
    label: "Expiry Alert",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  risk: {
    icon: AlertTriangle,
    label: "Risk Alert",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  clearance: {
    icon: Trash2,
    label: "Clearance",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  discount: {
    icon: Percent,
    label: "Discount",
    color: "text-info",
    bg: "bg-info/10",
  },
};

const severityConfig = {
  low: { color: "bg-success", label: "Low" },
  medium: { color: "bg-warning", label: "Medium" },
  high: { color: "bg-danger", label: "High" },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(() => getAlerts());
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesType = typeFilter === "all" || alert.type === typeFilter;
      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;
      return matchesType && matchesSeverity;
    });
  }, [alerts, typeFilter, severityFilter]);

  const newAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((alert) => ({ ...alert, acknowledged: true }))
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">
            Proactive notifications requiring your attention
          </p>
        </div>
        {newAlertsCount > 0 && (
          <Button onClick={handleAcknowledgeAll} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark all read ({newAlertsCount})
          </Button>
        )}
      </div>

      {/* Summary Card */}
      <Card className="opacity-0 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Alert Summary</h3>
              <p className="text-muted-foreground">
                {newAlertsCount} new alerts require your attention
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-danger">
                  {alerts.filter((a) => a.severity === "high").length}
                </p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {alerts.filter((a) => a.severity === "medium").length}
                </p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {alerts.filter((a) => a.severity === "low").length}
                </p>
                <p className="text-xs text-muted-foreground">Low</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Alert Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="expiry">Expiry Alerts</SelectItem>
            <SelectItem value="risk">Risk Alerts</SelectItem>
            <SelectItem value="clearance">Clearance</SelectItem>
            <SelectItem value="discount">Discount</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert Timeline */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-1">No alerts found</h3>
              <p className="text-muted-foreground">
                No alerts match your current filters
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert, index) => {
            const typeConfig = alertTypeConfig[alert.type];
            const severity = severityConfig[alert.severity];
            const Icon = typeConfig.icon;

            return (
              <Card
                key={alert.id}
                className={`opacity-0 animate-slide-in-right transition-all hover:shadow-md ${
                  !alert.acknowledged ? "border-l-4 border-l-primary" : ""
                }`}
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${typeConfig.bg}`}>
                      <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`h-2 w-2 rounded-full ${severity.color}`}
                            />
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              {typeConfig.label}
                            </span>
                            {!alert.acknowledged && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold">{alert.productName}</h4>
                          <p className="text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground">
                            {formatTimeAgo(alert.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {!alert.acknowledged && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
