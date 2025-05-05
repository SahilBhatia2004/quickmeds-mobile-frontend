
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VendorLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    // In a real app, this would authenticate with the backend
    // For now, we'll simulate a successful login
    toast.success("Pharmacy owner logged in successfully");
    navigate("/vendor/dashboard");
  };

  return (
    <MobileLayout>
      <PageHeader title="Pharmacy Login" showBackButton />
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="pharmacy@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message as string}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Not registered yet?</h3>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/vendor/register")}
          >
            Register Your Pharmacy
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default VendorLogin;
