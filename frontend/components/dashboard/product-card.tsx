// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ExternalLink, ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import { Product } from "@/lib/types";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const handleViewProduct = () => {
//     window.open(product.productLink, '_blank');
//   };

//   return (
//     <Card className="h-full flex flex-col">
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg line-clamp-2">{product.productName}</CardTitle>
//       </CardHeader>
      
//       <CardContent className="flex-1 flex flex-col">
//         <p className="text-sm text-gray-600 mb-3 line-clamp-3">
//           {product.description}
//         </p>
        
//         <div className="mb-4">
//           <h4 className="font-medium text-sm mb-2">How to Use:</h4>
//           <p className="text-xs text-gray-500 line-clamp-3">
//             {product.routineUsage}
//           </p>
//         </div>
        
//         <Button 
//           onClick={handleViewProduct}
//           className="w-full mt-auto"
//           size="sm"
//         >
//           <ShoppingCart className="mr-2 h-4 w-4" />
//           View Product
//           <ExternalLink className="ml-2 h-3 w-3" />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }