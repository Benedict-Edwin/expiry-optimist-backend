// Mock data for the Retail Inventory Expiry & Sales Intelligence System

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  salesRate: number; // units per day
  costPrice: number;
  sellingPrice: number;
}

export interface Alert {
  id: string;
  type: 'expiry' | 'risk' | 'clearance' | 'discount';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged: boolean;
}

export const categories = [
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks',
  'Frozen',
  'Canned Goods',
  'Fresh Produce',
  'Meat & Poultry'
];

export const products: Product[] = [
  { id: '1', name: 'Organic Milk 1L', category: 'Dairy', quantity: 120, manufactureDate: '2024-12-01', expiryDate: '2025-01-15', salesRate: 8, costPrice: 45, sellingPrice: 65 },
  { id: '2', name: 'Greek Yogurt 500g', category: 'Dairy', quantity: 85, manufactureDate: '2024-12-10', expiryDate: '2025-01-10', salesRate: 4, costPrice: 80, sellingPrice: 120 },
  { id: '3', name: 'Whole Wheat Bread', category: 'Bakery', quantity: 40, manufactureDate: '2024-12-20', expiryDate: '2025-01-02', salesRate: 12, costPrice: 25, sellingPrice: 45 },
  { id: '4', name: 'Croissants 6-pack', category: 'Bakery', quantity: 25, manufactureDate: '2024-12-22', expiryDate: '2025-01-01', salesRate: 5, costPrice: 60, sellingPrice: 95 },
  { id: '5', name: 'Orange Juice 1L', category: 'Beverages', quantity: 200, manufactureDate: '2024-11-15', expiryDate: '2025-02-15', salesRate: 10, costPrice: 55, sellingPrice: 85 },
  { id: '6', name: 'Almond Milk 1L', category: 'Beverages', quantity: 75, manufactureDate: '2024-12-05', expiryDate: '2025-01-20', salesRate: 3, costPrice: 90, sellingPrice: 140 },
  { id: '7', name: 'Potato Chips 200g', category: 'Snacks', quantity: 150, manufactureDate: '2024-10-01', expiryDate: '2025-04-01', salesRate: 8, costPrice: 35, sellingPrice: 55 },
  { id: '8', name: 'Trail Mix 300g', category: 'Snacks', quantity: 60, manufactureDate: '2024-11-01', expiryDate: '2025-02-01', salesRate: 2, costPrice: 120, sellingPrice: 180 },
  { id: '9', name: 'Frozen Pizza', category: 'Frozen', quantity: 45, manufactureDate: '2024-09-01', expiryDate: '2025-03-01', salesRate: 3, costPrice: 150, sellingPrice: 220 },
  { id: '10', name: 'Ice Cream 500ml', category: 'Frozen', quantity: 90, manufactureDate: '2024-11-20', expiryDate: '2025-05-20', salesRate: 5, costPrice: 110, sellingPrice: 175 },
  { id: '11', name: 'Canned Tomatoes 400g', category: 'Canned Goods', quantity: 180, manufactureDate: '2024-06-01', expiryDate: '2026-06-01', salesRate: 4, costPrice: 28, sellingPrice: 45 },
  { id: '12', name: 'Canned Beans 400g', category: 'Canned Goods', quantity: 220, manufactureDate: '2024-05-01', expiryDate: '2026-05-01', salesRate: 3, costPrice: 22, sellingPrice: 38 },
  { id: '13', name: 'Fresh Apples 1kg', category: 'Fresh Produce', quantity: 100, manufactureDate: '2024-12-18', expiryDate: '2025-01-08', salesRate: 15, costPrice: 80, sellingPrice: 120 },
  { id: '14', name: 'Bananas 1kg', category: 'Fresh Produce', quantity: 80, manufactureDate: '2024-12-23', expiryDate: '2025-01-03', salesRate: 20, costPrice: 40, sellingPrice: 60 },
  { id: '15', name: 'Chicken Breast 500g', category: 'Meat & Poultry', quantity: 35, manufactureDate: '2024-12-24', expiryDate: '2025-01-02', salesRate: 8, costPrice: 180, sellingPrice: 280 },
  { id: '16', name: 'Ground Beef 500g', category: 'Meat & Poultry', quantity: 28, manufactureDate: '2024-12-23', expiryDate: '2025-01-01', salesRate: 6, costPrice: 200, sellingPrice: 320 },
  { id: '17', name: 'Cheese Slices 200g', category: 'Dairy', quantity: 95, manufactureDate: '2024-12-01', expiryDate: '2025-01-25', salesRate: 5, costPrice: 65, sellingPrice: 95 },
  { id: '18', name: 'Butter 250g', category: 'Dairy', quantity: 110, manufactureDate: '2024-11-15', expiryDate: '2025-02-15', salesRate: 4, costPrice: 70, sellingPrice: 105 },
  { id: '19', name: 'Energy Drink 250ml', category: 'Beverages', quantity: 300, manufactureDate: '2024-08-01', expiryDate: '2025-08-01', salesRate: 12, costPrice: 45, sellingPrice: 75 },
  { id: '20', name: 'Chocolate Bar 100g', category: 'Snacks', quantity: 180, manufactureDate: '2024-10-01', expiryDate: '2025-06-01', salesRate: 7, costPrice: 40, sellingPrice: 65 },
];

export const getAlerts = (): Alert[] => {
  const today = new Date();
  const alerts: Alert[] = [];
  
  products.forEach(product => {
    const expiryDate = new Date(product.expiryDate);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const expectedSales = product.salesRate * daysToExpiry;
    
    if (daysToExpiry <= 7 && daysToExpiry > 0) {
      alerts.push({
        id: `alert-${product.id}-expiry`,
        type: 'expiry',
        productId: product.id,
        productName: product.name,
        message: `${product.name} expires in ${daysToExpiry} days`,
        severity: daysToExpiry <= 3 ? 'high' : 'medium',
        timestamp: new Date(today.getTime() - Math.random() * 86400000 * 2).toISOString(),
        acknowledged: Math.random() > 0.7
      });
    }
    
    if (expectedSales < product.quantity && daysToExpiry <= 30 && daysToExpiry > 0) {
      const riskLevel = expectedSales < product.quantity * 0.5 ? 'high' : 'medium';
      alerts.push({
        id: `alert-${product.id}-risk`,
        type: 'risk',
        productId: product.id,
        productName: product.name,
        message: `High risk: ${product.quantity - Math.floor(expectedSales)} units may expire unsold`,
        severity: riskLevel,
        timestamp: new Date(today.getTime() - Math.random() * 86400000 * 3).toISOString(),
        acknowledged: Math.random() > 0.6
      });
    }
  });
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export interface DailySale {
  date: string;
  sales: number;
  revenue: number;
  upiAmount: number;
  cashAmount: number;
  upiTransactions: number;
  cashTransactions: number;
}

export const salesTrendData: DailySale[] = [
  { date: 'Dec 21', sales: 12500, revenue: 185000, upiAmount: 128500, cashAmount: 56500, upiTransactions: 342, cashTransactions: 158 },
  { date: 'Dec 22', sales: 14200, revenue: 210000, upiAmount: 152000, cashAmount: 58000, upiTransactions: 398, cashTransactions: 142 },
  { date: 'Dec 23', sales: 11800, revenue: 175000, upiAmount: 118000, cashAmount: 57000, upiTransactions: 312, cashTransactions: 168 },
  { date: 'Dec 24', sales: 18500, revenue: 280000, upiAmount: 210000, cashAmount: 70000, upiTransactions: 520, cashTransactions: 180 },
  { date: 'Dec 25', sales: 8200, revenue: 120000, upiAmount: 82000, cashAmount: 38000, upiTransactions: 215, cashTransactions: 105 },
  { date: 'Dec 26', sales: 15600, revenue: 230000, upiAmount: 165000, cashAmount: 65000, upiTransactions: 428, cashTransactions: 172 },
  { date: 'Dec 27', sales: 16800, revenue: 250000, upiAmount: 182500, cashAmount: 67500, upiTransactions: 465, cashTransactions: 155 },
];

export const categoryWastageData = [
  { category: 'Dairy', wastage: 12.5, value: 15000 },
  { category: 'Bakery', wastage: 18.2, value: 8500 },
  { category: 'Fresh Produce', wastage: 22.8, value: 12000 },
  { category: 'Meat & Poultry', wastage: 8.5, value: 18000 },
  { category: 'Frozen', wastage: 3.2, value: 4500 },
  { category: 'Beverages', wastage: 2.1, value: 2800 },
];

export const getDaysToExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const getProductStatus = (daysToExpiry: number): 'expired' | 'critical' | 'warning' | 'safe' => {
  if (daysToExpiry <= 0) return 'expired';
  if (daysToExpiry <= 7) return 'critical';
  if (daysToExpiry <= 30) return 'warning';
  return 'safe';
};

export const getRiskLevel = (product: Product): { level: 'low' | 'medium' | 'high'; probability: number; reason: string } => {
  const daysToExpiry = getDaysToExpiry(product.expiryDate);
  const expectedSales = product.salesRate * daysToExpiry;
  const unsoldRisk = product.quantity - expectedSales;
  
  if (daysToExpiry <= 0) {
    return { level: 'high', probability: 100, reason: 'Product has already expired' };
  }
  
  if (expectedSales < product.quantity * 0.3) {
    return { 
      level: 'high', 
      probability: Math.min(95, Math.round((unsoldRisk / product.quantity) * 100)),
      reason: `Only ${Math.round(expectedSales)} units expected to sell, ${Math.round(unsoldRisk)} units at risk`
    };
  }
  
  if (expectedSales < product.quantity * 0.7 || daysToExpiry <= 15) {
    return { 
      level: 'medium', 
      probability: Math.min(70, Math.round((unsoldRisk / product.quantity) * 100)),
      reason: `Moderate risk: ${daysToExpiry} days left with ${product.salesRate} units/day sales rate`
    };
  }
  
  return { 
    level: 'low', 
    probability: Math.max(5, Math.round((unsoldRisk / product.quantity) * 100)),
    reason: 'Sales rate sufficient to clear stock before expiry'
  };
};

export const getSuggestedDiscount = (product: Product): { discount: number; impact: number; reason: string } => {
  const daysToExpiry = getDaysToExpiry(product.expiryDate);
  const risk = getRiskLevel(product);
  const status = getProductStatus(daysToExpiry);
  
  if (status === 'expired') {
    return { discount: 0, impact: 0, reason: 'Product expired - remove from shelf' };
  }
  
  if (status === 'safe' && risk.level === 'low') {
    return { discount: 0, impact: 0, reason: 'No discount needed - healthy sales trajectory' };
  }
  
  let discount = 0;
  let reason = '';
  
  if (risk.level === 'high') {
    discount = daysToExpiry <= 3 ? 50 : daysToExpiry <= 7 ? 40 : 30;
    reason = `High stock (${product.quantity}) + low sales (${product.salesRate}/day) + ${daysToExpiry} days left`;
  } else if (risk.level === 'medium') {
    discount = daysToExpiry <= 15 ? 20 : 10;
    reason = `Moderate risk with ${daysToExpiry} days remaining`;
  } else if (status === 'warning') {
    discount = 5;
    reason = 'Preventive discount to accelerate sales';
  }
  
  const potentialLoss = product.quantity * product.costPrice;
  const recoveryRate = (100 - discount) / 100;
  const impact = Math.round(potentialLoss * recoveryRate * (risk.probability / 100));
  
  return { discount, impact, reason };
};

export const getKPIData = () => {
  const today = new Date();
  let totalProducts = products.length;
  let totalStock = 0;
  let expiredItems = 0;
  let nearExpiryItems = 0;
  let estimatedLoss = 0;
  let productsNeedingDiscount = 0;
  
  products.forEach(product => {
    totalStock += product.quantity;
    const daysToExpiry = getDaysToExpiry(product.expiryDate);
    const status = getProductStatus(daysToExpiry);
    const discount = getSuggestedDiscount(product);
    
    if (status === 'expired') {
      expiredItems++;
      estimatedLoss += product.quantity * product.costPrice;
    } else if (status === 'critical' || status === 'warning') {
      nearExpiryItems++;
      const risk = getRiskLevel(product);
      const unsoldQty = Math.max(0, product.quantity - (product.salesRate * daysToExpiry));
      estimatedLoss += unsoldQty * product.costPrice;
    }
    
    if (discount.discount > 0) {
      productsNeedingDiscount++;
    }
  });
  
  return {
    totalProducts,
    totalStock,
    expiredItems,
    nearExpiryItems,
    estimatedLoss,
    productsNeedingDiscount
  };
};

export const getStatusDistribution = () => {
  const today = new Date();
  let safe = 0;
  let warning = 0;
  let critical = 0;
  let expired = 0;
  
  products.forEach(product => {
    const daysToExpiry = getDaysToExpiry(product.expiryDate);
    const status = getProductStatus(daysToExpiry);
    
    if (status === 'safe') safe++;
    else if (status === 'warning') warning++;
    else if (status === 'critical') critical++;
    else expired++;
  });
  
  return [
    { name: 'Safe', value: safe, color: 'hsl(var(--success))' },
    { name: 'Warning', value: warning, color: 'hsl(var(--warning))' },
    { name: 'Critical', value: critical, color: 'hsl(var(--danger))' },
    { name: 'Expired', value: expired, color: 'hsl(var(--muted-foreground))' },
  ];
};

export const storeProfile = {
  storeName: 'FreshMart Superstore',
  location: 'Mumbai, Maharashtra',
  riskThreshold: 30,
  maxDiscount: 50,
  notifications: {
    email: true,
    push: true,
    sms: false,
    dailyDigest: true
  }
};
