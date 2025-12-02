import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProductDialog from "@/components/admin/AddProductDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Mock product data
const mockProducts = [
  { id: 1, name: "Classic Oxford Shoes", category: "Formal", price: 189.99, stock: 45, status: "Active" },
  { id: 2, name: "Running Sneakers Pro", category: "Athletic", price: 159.99, stock: 78, status: "Active" },
  { id: 3, name: "Women's Elegant Heels", category: "Women", price: 129.99, stock: 32, status: "Active" },
  { id: 4, name: "Heavy Duty Work Boots", category: "Boots", price: 219.99, stock: 56, status: "Active" },
  { id: 5, name: "Canvas Sneakers", category: "Athletic", price: 79.99, stock: 120, status: "Active" },
  { id: 6, name: "Kids Adventure Shoes", category: "Kids", price: 59.99, stock: 89, status: "Low Stock" },
  { id: 7, name: "Hiking Boots Pro", category: "Boots", price: 249.99, stock: 23, status: "Low Stock" },
  { id: 8, name: "Business Loafers", category: "Formal", price: 169.99, stock: 67, status: "Active" },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Package, label: "Products", active: true },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: tableRef, isVisible: tableVisible } = useScrollAnimation({ threshold: 0.1 });

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Products", value: "156", change: "+12%", icon: Package },
    { label: "Total Orders", value: "1,234", change: "+8%", icon: ShoppingBag },
    { label: "Total Customers", value: "892", change: "+15%", icon: Users },
    { label: "Revenue", value: "$45,678", change: "+23%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-md ease-primary lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-sm",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-sm"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-display font-semibold text-foreground">
                Product Management
              </h2>
            </div>
            <Button 
              onClick={() => setAddProductOpen(true)}
              className="gap-2 transition-all duration-sm hover:scale-[1.02]"
            >
              <Plus size={18} />
              Add Product
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "bg-card border border-border rounded-xl p-6 transition-all duration-md ease-primary",
                  statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  "hover:shadow-elegant hover:-translate-y-1"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-primary" size={24} />
                  </div>
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Products Table */}
          <div
            ref={tableRef}
            className={cn(
              "bg-card border border-border rounded-xl overflow-hidden transition-all duration-md ease-primary",
              tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Table Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">All Products</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Product</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground">Price</TableHead>
                    <TableHead className="text-muted-foreground">Stock</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow
                      key={product.id}
                      className={cn(
                        "border-border transition-all duration-sm hover:bg-muted/50",
                        tableVisible ? "opacity-100" : "opacity-0"
                      )}
                      style={{ transitionDelay: `${(index + 4) * 50}ms` }}
                    >
                      <TableCell className="font-medium text-foreground">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-foreground">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.stock}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            product.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          )}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-sm">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredProducts.length} of {mockProducts.length} products</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Dialog */}
      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />
    </div>
  );
};

export default AdminPage;
