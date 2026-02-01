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

// 🔥 Firestore
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { signOut } from "firebase/auth";
import DeleteConfirmDialog from "@/components/admin/AlertDeleteProductDialog";

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

  const { ref: statsRef, isVisible: statsVisible } =
    useScrollAnimation({ threshold: 0.1 });
  const { ref: tableRef, isVisible: tableVisible } =
    useScrollAnimation({ threshold: 0.1 });

  // 🔥 REALTIME FETCH (Firestore)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list: Product[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Product),
        }));
        setProducts(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => signOut(auth).then(() => navigate("/login"))}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive rounded-lg"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <Button
            onClick={() => {
              setEditProduct(null);
              setAddProductOpen(true);
            }}
          >
            <Plus size={18} /> Add Product
          </Button>
        </header>

        <div className="p-6">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.originalPrice}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => {
                          setEditProduct(product);
                          setAddProductOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteProduct(product)}>
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Dialogs */}
      <AddProductDialog
        open={addProductOpen}
        product={editProduct}
        onOpenChange={(open) => {
          setAddProductOpen(open);
          if (!open) setEditProduct(null); // 🔑 CRITICAL
        }}
        onSuccess={() => {
          setAddProductOpen(false);
          setEditProduct(null); // 🔑 CRITICAL
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
        productName={deleteProduct?.name || ""}
        onConfirm={async () => {
          if (!deleteProduct?.id) return;
          await deleteDoc(doc(db, "products", deleteProduct.id));
          setDeleteProduct(null);
        }}
      />
    </div>
  );
};

export default AdminPage;
