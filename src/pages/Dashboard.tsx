import { useMemo } from "react";
import {
  Package,
  Boxes,
  AlertCircle,
  Clock,
  TrendingDown,
  Percent,
  Smartphone,
  Banknote,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getKPIData,
  getStatusDistribution,
  salesTrendData,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const kpiData = useMemo(() => getKPIData(), []);
  const statusDistribution = useMemo(() => getStatusDistribution(), []);

  // Calculate payment method totals
  const paymentSummary = useMemo(() => {
    const totalUpi = salesTrendData.reduce((sum, d) => sum + d.upiAmount, 0);
    const totalCash = salesTrendData.reduce((sum, d) => sum + d.cashAmount, 0);
    const totalRevenue = salesTrendData.reduce((sum, d) => sum + d.revenue, 0);
    const totalUpiTxn = salesTrendData.reduce((sum, d) => sum + d.upiTransactions, 0);
    const totalCashTxn = salesTrendData.reduce((sum, d) => sum + d.cashTransactions, 0);
    return {
      totalUpi,
      totalCash,
      totalRevenue,
      upiPercent: Math.round((totalUpi / totalRevenue) * 100),
      cashPercent: Math.round((totalCash / totalRevenue) * 100),
      totalUpiTxn,
      totalCashTxn,
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 opacity-0 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Executive overview of your store's health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Products"
          value={kpiData.totalProducts}
          icon={Package}
          tooltip="Number of unique product SKUs in inventory"
          delay={0}
        />
        <KPICard
          title="Total Stock"
          value={kpiData.totalStock.toLocaleString()}
          icon={Boxes}
          tooltip="Total quantity of items across all products"
          trend={{ value: 5.2, positive: true }}
          delay={100}
        />
        <KPICard
          title="Expired Items"
          value={kpiData.expiredItems}
          icon={AlertCircle}
          tooltip="Products past their expiry date"
          variant="danger"
          delay={200}
        />
        <KPICard
          title="Near Expiry"
          value={kpiData.nearExpiryItems}
          icon={Clock}
          tooltip="Products expiring within 30 days"
          variant="warning"
          delay={300}
        />
        <KPICard
          title="Est. Loss"
          value={formatCurrency(kpiData.estimatedLoss)}
          icon={TrendingDown}
          tooltip="Estimated financial loss from expiring inventory"
          variant="danger"
          delay={400}
        />
        <KPICard
          title="Need Discount"
          value={kpiData.productsNeedingDiscount}
          icon={Percent}
          tooltip="Products recommended for discount pricing"
          variant="warning"
          delay={500}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Inventory Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales Trend Line Chart */}
        <Card className="opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "700ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Sales Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `₹${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Payment Summary Cards */}
        <Card className="opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "750ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <span className="truncate">Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* UPI Payment Box */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">UPI Payments</span>
                <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary text-xs">
                  {paymentSummary.upiPercent}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-bold text-primary">{formatCurrency(paymentSummary.totalUpi)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Transactions</p>
                  <p className="font-semibold">{paymentSummary.totalUpiTxn.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {/* Cash Payment Box */}
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-success/10">
                  <Banknote className="h-4 w-4 text-success" />
                </div>
                <span className="font-semibold text-sm">Cash Payments</span>
                <Badge variant="secondary" className="ml-auto bg-success/10 text-success text-xs">
                  {paymentSummary.cashPercent}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-bold text-success">{formatCurrency(paymentSummary.totalCash)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Transactions</p>
                  <p className="font-semibold">{paymentSummary.totalCashTxn.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {/* Total */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total (7 days)</span>
                <span className="font-bold text-lg">{formatCurrency(paymentSummary.totalRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Comparison Bar Chart */}
        <Card className="xl:col-span-2 opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "800ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold">
              Daily Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesTrendData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === "upiAmount" ? "UPI" : "Cash",
                    ]}
                  />
                  <Legend 
                    formatter={(value) => (value === "upiAmount" ? "UPI" : "Cash")}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Bar dataKey="upiAmount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cashAmount" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per Day Sales Table with Payment Evidence */}
      <Card className="opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "850ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
            <span>Per Day Sales Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">Units</TableHead>
                  <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">Revenue</TableHead>
                  <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">UPI</TableHead>
                  <TableHead className="text-center whitespace-nowrap text-xs sm:text-sm">Txns</TableHead>
                  <TableHead className="text-right whitespace-nowrap text-xs sm:text-sm">Cash</TableHead>
                  <TableHead className="text-center whitespace-nowrap text-xs sm:text-sm">Txns</TableHead>
                  <TableHead className="text-center whitespace-nowrap text-xs sm:text-sm">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesTrendData.map((day) => {
                  const isUpiDominant = day.upiAmount > day.cashAmount;
                  const upiPercentDay = Math.round((day.upiAmount / day.revenue) * 100);
                  return (
                    <TableRow 
                      key={day.date}
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm py-2">{day.date}</TableCell>
                      <TableCell className="text-right font-semibold text-xs sm:text-sm py-2">{formatCurrency(day.revenue)}</TableCell>
                      <TableCell className="text-right text-primary text-xs sm:text-sm py-2">{formatCurrency(day.upiAmount)}</TableCell>
                      <TableCell className="text-center py-2">
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs border border-primary/30 text-primary bg-primary/5">
                          {day.upiTransactions}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-success text-xs sm:text-sm py-2">{formatCurrency(day.cashAmount)}</TableCell>
                      <TableCell className="text-center py-2">
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs border border-success/30 text-success bg-success/5">
                          {day.cashTransactions}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        {isUpiDominant ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary">
                            <Smartphone className="h-3 w-3" />
                            <span className="hidden sm:inline">UPI</span> {upiPercentDay}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-success/10 text-success">
                            <Banknote className="h-3 w-3" />
                            <span className="hidden sm:inline">Cash</span> {100 - upiPercentDay}%
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="opacity-0 animate-fade-in group transition-shadow duration-500 hover:shadow-lg" style={{ animationDelay: "900ms" }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                <span className="text-sm font-medium">Top Performer</span>
              </div>
              <p className="text-lg font-semibold">Bananas 1kg</p>
              <p className="text-sm text-muted-foreground">
                20 units/day • Healthy turnover
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse-soft" />
                <span className="text-sm font-medium">Needs Attention</span>
              </div>
              <p className="text-lg font-semibold">Ground Beef 500g</p>
              <p className="text-sm text-muted-foreground">
                Expires tomorrow • 28 units left
              </p>
            </div>
            <div className="p-4 rounded-lg bg-danger/5 border border-danger/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-danger animate-pulse-soft" />
                <span className="text-sm font-medium">Action Required</span>
              </div>
              <p className="text-lg font-semibold">Croissants 6-pack</p>
              <p className="text-sm text-muted-foreground">
                Expires today • Apply 40% discount
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
