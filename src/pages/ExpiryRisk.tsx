import { useMemo } from "react";
import { AlertTriangle, TrendingDown, Percent, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "@/components/ui/status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { products, getDaysToExpiry, getRiskLevel, getSuggestedDiscount } from "@/lib/mockData";

const ExpiryRisk = () => {
  const riskAnalysis = useMemo(() => {
    return products
      .map((product) => {
        const daysToExpiry = getDaysToExpiry(product.expiryDate);
        const risk = getRiskLevel(product);
        const discount = getSuggestedDiscount(product);
        return {
          ...product,
          daysToExpiry,
          risk,
          discount,
        };
      })
      .filter((p) => p.daysToExpiry > 0) // Exclude already expired
      .sort((a, b) => {
        // Sort by risk level first, then by days to expiry
        const riskOrder = { high: 0, medium: 1, low: 2 };
        if (riskOrder[a.risk.level] !== riskOrder[b.risk.level]) {
          return riskOrder[a.risk.level] - riskOrder[b.risk.level];
        }
        return a.daysToExpiry - b.daysToExpiry;
      });
  }, []);

  const riskSummary = useMemo(() => {
    const high = riskAnalysis.filter((p) => p.risk.level === "high").length;
    const medium = riskAnalysis.filter((p) => p.risk.level === "medium").length;
    const low = riskAnalysis.filter((p) => p.risk.level === "low").length;
    const totalPotentialLoss = riskAnalysis
      .filter((p) => p.risk.level !== "low")
      .reduce((sum, p) => {
        const unsoldQty = Math.max(
          0,
          p.quantity - p.salesRate * p.daysToExpiry
        );
        return sum + unsoldQty * p.costPrice;
      }, 0);
    return { high, medium, low, totalPotentialLoss };
  }, [riskAnalysis]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActionLabel = (riskLevel: string, discount: number): string => {
    if (discount >= 40) return "Clearance Sale";
    if (discount >= 20) return "Apply Discount";
    if (discount > 0) return "Consider Discount";
    return "Monitor";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 opacity-0 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">Expiry Risk Analysis</h1>
        <p className="text-muted-foreground">
          Predict future unsold stock and take proactive action
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-danger/20 bg-danger/5 opacity-0 animate-fade-in transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-danger/10 transition-transform duration-500 group-hover:scale-110">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-3xl font-bold text-danger">
                  {riskSummary.high}
                </p>
                <p className="text-sm text-muted-foreground">High Risk Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-warning/5 opacity-0 animate-fade-in transition-all duration-500 hover:shadow-lg hover:-translate-y-1" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">
                  {riskSummary.medium}
                </p>
                <p className="text-sm text-muted-foreground">
                  Medium Risk Items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5 opacity-0 animate-fade-in transition-all duration-500 hover:shadow-lg hover:-translate-y-1" style={{ animationDelay: "200ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <AlertTriangle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-success">
                  {riskSummary.low}
                </p>
                <p className="text-sm text-muted-foreground">Low Risk Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-0 animate-fade-in transition-all duration-500 hover:shadow-lg hover:-translate-y-1" style={{ animationDelay: "300ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(riskSummary.totalPotentialLoss)}
                </p>
                <p className="text-sm text-muted-foreground">Potential Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Explanation */}
      <Card className="opacity-0 animate-fade-in transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "400ms" }}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            How Risk is Calculated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Inputs Considered</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Days until expiry</li>
                <li>• Current stock quantity</li>
                <li>• Historical sales rate</li>
                <li>• Product category</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Risk Logic</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <span className="text-danger">HIGH:</span> Expected sales {"<"}{" "}
                  30% of stock
                </li>
                <li>
                  <span className="text-warning">MEDIUM:</span> Days left {"<"}{" "}
                  15 or sales {"<"} 70%
                </li>
                <li>
                  <span className="text-success">LOW:</span> Healthy sales
                  trajectory
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Discount Strategy</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>High risk + {"<"}3 days: 50% off</li>
                <li>High risk + {"<"}7 days: 40% off</li>
                <li>Medium risk: 10-20% off</li>
                <li>Low risk: No discount</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Items List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold opacity-0 animate-fade-in" style={{ animationDelay: "450ms" }}>Products by Risk Level</h2>
        <div className="grid gap-4">
          {riskAnalysis.map((product, index) => (
            <Card
              key={product.id}
              className={`opacity-0 animate-fade-in transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                product.risk.level === "high"
                  ? "border-danger/30"
                  : product.risk.level === "medium"
                  ? "border-warning/30"
                  : ""
              }`}
              style={{ animationDelay: `${500 + index * 80}ms` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {product.name}
                      </h3>
                      <RiskBadge level={product.risk.level} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 bg-muted rounded">
                        {product.category}
                      </span>
                      <span>{product.quantity} units</span>
                      <span>{product.daysToExpiry} days left</span>
                      <span>{product.salesRate} sold/day</span>
                    </div>
                  </div>

                  {/* Risk Probability */}
                  <div className="w-full lg:w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Risk Probability
                      </span>
                      <span className="font-semibold">
                        {product.risk.probability}%
                      </span>
                    </div>
                    <Progress
                      value={product.risk.probability}
                      className={`h-2 ${
                        product.risk.level === "high"
                          ? "[&>div]:bg-danger"
                          : product.risk.level === "medium"
                          ? "[&>div]:bg-warning"
                          : "[&>div]:bg-success"
                      }`}
                    />
                  </div>

                  {/* Suggested Action */}
                  <div className="flex flex-col items-start lg:items-end gap-2">
                    {product.discount.discount > 0 ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 cursor-help">
                            <Percent className="h-4 w-4 text-warning" />
                            <span className="font-semibold text-warning">
                              {product.discount.discount}% Discount
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium mb-1">Why this discount?</p>
                          <p className="text-sm">{product.discount.reason}</p>
                          <p className="text-sm mt-2">
                            Expected recovery:{" "}
                            {formatCurrency(product.discount.impact)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="px-4 py-2 rounded-lg bg-muted text-muted-foreground">
                        No action needed
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground max-w-[200px] text-right">
                      {product.risk.reason}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpiryRisk;
