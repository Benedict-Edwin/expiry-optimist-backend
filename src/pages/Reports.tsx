import { useMemo } from "react";
import {
  FileBarChart,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  categoryWastageData,
  products,
  getDaysToExpiry,
  getProductStatus,
  getSuggestedDiscount,
} from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const reportData = useMemo(() => {
    // Calculate monthly metrics
    const monthlyExpiryLoss = products.reduce((sum, product) => {
      const daysToExpiry = getDaysToExpiry(product.expiryDate);
      if (daysToExpiry <= 30 && daysToExpiry > 0) {
        const unsoldQty = Math.max(0, product.quantity - product.salesRate * daysToExpiry);
        return sum + unsoldQty * product.costPrice;
      }
      return sum;
    }, 0);

    // Discount effectiveness
    const productsWithDiscount = products.filter(
      (p) => getSuggestedDiscount(p).discount > 0
    );
    const potentialRecovery = productsWithDiscount.reduce((sum, p) => {
      const discount = getSuggestedDiscount(p);
      return sum + discount.impact;
    }, 0);

    // Best and worst products
    const sortedByPerformance = [...products].sort(
      (a, b) => b.salesRate - a.salesRate
    );
    const bestProducts = sortedByPerformance.slice(0, 5);
    const worstProducts = sortedByPerformance.slice(-5).reverse();

    return {
      monthlyExpiryLoss,
      potentialRecovery,
      bestProducts,
      worstProducts,
      discountCount: productsWithDiscount.length,
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExport = (format: "pdf" | "csv") => {
    toast({
      title: `Exporting ${format.toUpperCase()}...`,
      description: "Your report will be ready shortly",
    });
    // Simulated export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report downloaded as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const wastageColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Business analytics and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="opacity-0 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-danger/10">
                <TrendingDown className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(reportData.monthlyExpiryLoss)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Monthly Expiry Loss
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(reportData.potentialRecovery)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Potential Recovery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Package className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reportData.discountCount}</p>
                <p className="text-sm text-muted-foreground">
                  Products on Discount
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (reportData.potentialRecovery /
                      (reportData.monthlyExpiryLoss || 1)) *
                      100
                  )}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Recovery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wastage by Category */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-primary" />
              Wastage by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryWastageData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Wastage"]}
                  />
                  <Bar
                    dataKey="wastage"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Loss Distribution Pie Chart */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle className="text-lg">Loss by Category Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryWastageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="category"
                    label={({ category, value }) =>
                      `${category}: ${formatCurrency(value)}`
                    }
                    labelLine={false}
                  >
                    {categoryWastageData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={wastageColors[index % wastageColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Loss"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best and Worst Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Top 5 Best Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.bestProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-success/10 text-success font-semibold text-sm">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      {product.salesRate} units/day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worst Performers */}
        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-danger" />
              Top 5 Slow Movers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.worstProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-danger/10 text-danger font-semibold text-sm">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-danger">
                      {product.salesRate} units/day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
