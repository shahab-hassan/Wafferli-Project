import { X } from "lucide-react";
import { Button } from "../common/button";

export function ProductSuggestion({
  product,
  onSendProductMessage,
  onRemove,
}: any) {
  if (!product) return null;

  console.log(product, "product");
  const handleSend = () => {
    onSendProductMessage?.({
      message: `Hi! I'm interested in your product "${product.title}"`,
      productReference: {
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
      },
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-purple-900 text-sm">
          Message about this product
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 hover:bg-purple-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex gap-3">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
            {product.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
          {product.price && (
            <p className="text-xs font-medium text-green-600 mt-1">
              ${product.price}
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={handleSend}
        className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
        size="sm"
      >
        Send Product Inquiry
      </Button>
    </div>
  );
}
