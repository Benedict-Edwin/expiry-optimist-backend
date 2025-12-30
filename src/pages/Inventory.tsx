import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  products,
  categories,
  getDaysToExpiry,
  getProductStatus,
  getSuggestedDiscount,
} from "@/lib/mockData";

type SortField = "name" | "expiryDate" | "quantity" | "daysLeft";
type SortOrder = "asc" | "desc";

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("expiryDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;
        const daysToExpiry = getDaysToExpiry(product.expiryDate);
        const status = getProductStatus(daysToExpiry);
        const matchesStatus =
          statusFilter === "all" || status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "expiryDate":
            comparison =
              new Date(a.expiryDate).getTime() -
              new Date(b.expiryDate).getTime();
            break;
          case "quantity":
            comparison = a.quantity - b.quantity;
            break;
          case "daysLeft":
            comparison =
              getDaysToExpiry(a.expiryDate) - getDaysToExpiry(b.expiryDate);
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [search, categoryFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 opacity-0 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Complete product list with intelligent insights
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border opacity-0 animate-fade-in transition-shadow duration-300 hover:shadow-md" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold hover:bg-transparent"
                    onClick={() => handleSort("name")}
                  >
                    Product Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold hover:bg-transparent"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold hover:bg-transparent"
                    onClick={() => handleSort("expiryDate")}
                  >
                    Expiry Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold hover:bg-transparent"
                    onClick={() => handleSort("daysLeft")}
                  >
                    Days Left
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Sales Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Suggested Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProducts.map((product, index) => {
                const daysToExpiry = getDaysToExpiry(product.expiryDate);
                const status = getProductStatus(daysToExpiry);
                const discount = getSuggestedDiscount(product);

                return (
                  <TableRow
                    key={product.id}
                    className="opacity-0 animate-fade-in transition-all duration-200 hover:bg-muted/50"
                    style={{ animationDelay: `${300 + index * 40}ms` }}
                  >
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md bg-muted text-sm">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {new Date(product.expiryDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          daysToExpiry <= 0
                            ? "text-danger font-semibold"
                            : daysToExpiry <= 7
                            ? "text-danger font-medium"
                            : daysToExpiry <= 30
                            ? "text-warning font-medium"
                            : "text-success"
                        }
                      >
                        {daysToExpiry <= 0 ? "Expired" : `${daysToExpiry} days`}
                      </span>
                    </TableCell>
                    <TableCell>{product.salesRate} units/day</TableCell>
                    <TableCell>
                      <StatusBadge status={status} />
                    </TableCell>
                    <TableCell>
                      {discount.discount > 0 ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-2 py-1 rounded-md bg-warning/10 text-warning font-semibold text-sm cursor-help">
                              {discount.discount}% off
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium mb-1">Discount Reason:</p>
                            <p className="text-sm">{discount.reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {status === "expired" ? "Remove" : "No discount"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filteredAndSortedProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No products found matching your filters
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
};

export default Inventory;
