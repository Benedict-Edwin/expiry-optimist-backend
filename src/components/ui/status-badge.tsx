import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "safe" | "warning" | "critical" | "expired";
  className?: string;
}

const statusConfig = {
  safe: {
    label: "Safe",
    className: "bg-success/10 text-success border-success/20",
  },
  warning: {
    label: "Warning",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  critical: {
    label: "Critical",
    className: "bg-danger/10 text-danger border-danger/20",
  },
  expired: {
    label: "Expired",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          status === "safe" && "bg-success",
          status === "warning" && "bg-warning",
          status === "critical" && "bg-danger",
          status === "expired" && "bg-muted-foreground"
        )}
      />
      {config.label}
    </span>
  );
};

interface RiskBadgeProps {
  level: "low" | "medium" | "high";
  className?: string;
}

const riskConfig = {
  low: {
    label: "Low Risk",
    className: "bg-success/10 text-success border-success/20",
  },
  medium: {
    label: "Medium Risk",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  high: {
    label: "High Risk",
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

export const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
