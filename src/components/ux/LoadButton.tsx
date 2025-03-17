
import { Loader } from "lucide-react";
import React from "react";
import clsx from "clsx"; 
import { Button } from "../ui/button";


interface LoadButtonProps {
  onSubmit?: () => void;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const LoadButton: React.FC<LoadButtonProps> = ({
  onSubmit,
  text,
  loading = false,
  disabled = false,
  className,
}) => {
  return (
    <Button
      type="submit"
      className={clsx("submit-btn", className)} 
      disabled={disabled}
    >
      
      {!loading ? text :  <Loader  /> }
     
    </Button>


  );
};

export default LoadButton;
