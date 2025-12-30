import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-count-up";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tooltip?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
  delay?: number;
}

const variantStyles = {
  default: "bg-card",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  danger: "bg-danger/5 border-danger/20",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

// Extract numeric value from formatted string
const extractNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  // Remove currency symbols, commas, and other non-numeric chars except decimal
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
};

// Animated counter component
const AnimatedValue = ({
  value,
  delay = 0,
  isCurrency = false,
}: {
  value: string | number;
  delay?: number;
  isCurrency?: boolean;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = extractNumber(value);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(easeOut * targetValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay + 200);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, delay, prefersReducedMotion]);

  // Format the display value
  if (isCurrency) {
    return (
      <span>
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(displayValue)}
      </span>
    );
  }

  // Check if original value is formatted (with commas)
  if (typeof value === "string" && value.includes(",")) {
    return <span>{Math.round(displayValue).toLocaleString()}</span>;
  }

  return <span>{Math.round(displayValue)}</span>;
};

export const KPICard = ({
  title,
  value,
  icon: Icon,
  tooltip,
  trend,
  variant = "default",
  className,
  delay = 0,
}: KPICardProps) => {
  const isCurrency =
    typeof value === "string" && (value.includes("₹") || value.includes("$"));

  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl border transition-all duration-500 ease-out",
        "hover:shadow-lg hover:-translate-y-1",
        "opacity-0 animate-fade-in",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-2xl font-bold tabular-nums">
            <AnimatedValue value={value} delay={delay} isCurrency={isCurrency} />
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium transition-opacity duration-300",
                trend.positive ? "text-success" : "text-danger"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last
              week
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg transition-transform duration-500 ease-out group-hover:scale-110",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
