import { useState, useEffect } from "react";
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
import { cn, Product } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Firebase
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/firebase";
import DeleteConfirmDialog from "@/components/admin/AlertDeleteProductDialog";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref as dbRef, remove } from "firebase/database";
import { storage } from "@/firebase"
import { signOut } from "firebase/auth";
// Product interface

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
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: tableRef, isVisible: tableVisible } = useScrollAnimation({ threshold: 0.1 });

  // Fetch products in real-time
  useEffect(() => {
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsList: Product[] = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }));
          setProducts(productsList);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered products for search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic stats
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 3).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const onSaleCount = products.filter((p) => p.isOnSale).length;
  const newArrivalsCount = products.filter((p) => p.isNew).length;

  const stats = [
    { label: "Total Products", value: totalProducts.toString(), change: "+12%", icon: Package },
    { label: "On Sale", value: onSaleCount.toString(), change: "+8%", icon: ShoppingBag },
    { label: "Low Stock", value: lowStockCount.toString(), change: lowStockCount > 0 ? "Warning" : "Good", icon: Users },
    { label: "New Arrivals", value: newArrivalsCount.toString(), change: "+23%", icon: BarChart3 },
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
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-foreground">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

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

          <div className="p-4 border-t border-border">
            <button
              onClick={() => signOut(auth).then(() => navigate("/login"))}
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
              onClick={() => {
                setEditProduct(null);
                setAddProductOpen(true);
              }}
              className="gap-2 transition-all duration-sm hover:scale-[1.02]"
            >
              <Plus size={18} />
              Add Product
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat.change.includes("Warning") ? "text-yellow-500" : "text-green-500"
                    )}
                  >
                    {stat.change}
                  </span>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product, index) => {
                      const displayPrice = product.discountPrice ?? product.originalPrice;
                      const status =
                        product.stock === 0
                          ? "Out of Stock"
                          : product.stock < 30
                            ? "Low Stock"
                            : "Active";

                      return (
                        <TableRow
                          key={product.id}
                          className={cn(
                            "border-border transition-all duration-sm hover:bg-muted/50",
                            tableVisible ? "opacity-100" : "opacity-0"
                          )}
                          style={{ transitionDelay: `${(index + 4) * 50}ms` }}
                        >
                          <TableCell className="font-medium text-foreground flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            {product.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground capitalize">
                            {product.category}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {product.discountPrice && (
                              <span className="line-through text-muted-foreground mr-2">
                                ₹{product.originalPrice.toFixed(2)}
                              </span>
                            )}
                            ₹{displayPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.stock}</TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                status === "Active"
                                  ? "bg-green-500/10 text-green-500"
                                  : status === "Low Stock"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-red-500/10 text-red-500"
                              )}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditProduct(product);
                                  setAddProductOpen(true);
                                }}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-sm"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteProduct(product)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AddProductDialog
        open={addProductOpen}
        onOpenChange={(open) => {
          setAddProductOpen(open);
          if (!open) setEditProduct(null); // Reset edit mode when closed
        }}
        product={editProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        productName={deleteProduct?.name || ""}
        onConfirm={async () => {
          if (!deleteProduct?.id) return;

          try {
            // Delete only from Firebase Realtime Database
            const productRef = dbRef(db, `products/${deleteProduct.id}`);
            await remove(productRef);

            setDeleteProduct(null);

            // Optional: toast.success("Product deleted successfully");
          } catch (error: any) {
            console.error("Delete failed:", error);
            alert("Failed to delete product: " + error.message);
          }
        }}
      />
    </div>
  );
};

export default AdminPage;