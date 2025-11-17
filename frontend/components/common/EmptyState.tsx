import React from "react";

type EmptyStateProps = {
  imageSrc?: string;
  title?: string;
  message?: string;
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  //   imageSrc = "/no-products.svg",
  title = "No Products Found",
  message = "Please check back later or try refreshing the page.",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-16 text-center text-gray-500 ${className}`}
    >
      {/* <img src={imageSrc} alt={title} className="w-40 h-40 mb-4 opacity-80" /> */}
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{message}</p>
    </div>
  );
};

export default EmptyState;
