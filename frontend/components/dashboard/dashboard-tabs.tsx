import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, BookOpen, Loader2 } from "lucide-react";
import ProductCard from "./product-card";
import EducationalCard from "./educational-card";
import { Product, EducationalContent } from "@/lib/types";

interface DashboardTabsProps {
  products: Product[];
  educational: EducationalContent[];
  loading: boolean;
  error: string | null;
}

export default function DashboardTabs({
  products,
  educational,
  loading,
  error,
}: DashboardTabsProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="products" className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Products
        </TabsTrigger>
        <TabsTrigger value="educational" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Educational
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </CardContent>
          </Card>
        ) : products.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No products available.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="educational" className="mt-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading educational content...</span>
            </CardContent>
          </Card>
        ) : educational.length > 0 ? (
          <div className="space-y-4">
            {educational.map((content, index) => (
              <EducationalCard key={index} content={content} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No educational content available.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}