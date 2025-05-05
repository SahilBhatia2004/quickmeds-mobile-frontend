
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  action?: React.ReactNode; // Add the action prop
  className?: string;
}

const PageHeader = ({
  title,
  showBackButton = false,
  rightElement,
  action, // Add the action prop here
  className,
  ...props
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div 
      className={cn(
        "sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-between p-4 border-b border-gray-200", 
        className
      )}
      {...props}
    >
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
      {action || rightElement ? (
        <div>
          {action || rightElement}
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
