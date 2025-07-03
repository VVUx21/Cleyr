// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ExternalLink, BookOpen } from "lucide-react";
// import { EducationalContent } from "@/lib/types";

// interface EducationalCardProps {
//   content: EducationalContent;
// }

// export default function EducationalCard({ content }: EducationalCardProps) {
//   const handleReadMore = () => {
//     window.open(content.url, '_blank');
//   };

//   const cleanDescription = (desc: string) => {
//     return desc.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
//   };

//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex items-start gap-3">
//           <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
//             <BookOpen className="h-5 w-5 text-blue-600" />
//           </div>
//           <div className="flex-1">
//             <CardTitle className="text-lg line-clamp-2 mb-1">
//               {content.title}
//             </CardTitle>
//             <CardDescription className="text-sm capitalize">
//               {content.type}
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <p className="text-sm text-gray-600 mb-4 line-clamp-3">
//           {cleanDescription(content.description)}
//         </p>
        
//         <Button 
//           onClick={handleReadMore}
//           variant="outline"
//           size="sm"
//           className="w-full"
//         >
//           Read More
//           <ExternalLink className="ml-2 h-3 w-3" />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }