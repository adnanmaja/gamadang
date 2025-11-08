import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import Menu from "@/pages/Menu";

// This component wraps the admin Menu page and redirects customers to dashboard
export default function MenuRouter() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const userRole = user?.role;

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      // Not logged in, redirect to login
      navigate("/login");
      return;
    }

    // If user is a customer, redirect to dashboard
    if (userRole === "customer") {
      navigate("/dashboard");
    }
    // Sellers and admins can access the admin menu
  }, [userRole, navigate]);

  // Only render admin Menu for sellers and admins
  if (userRole === "customer") {
    return null; // Will redirect via useEffect
  }

  return <Menu />;
}
