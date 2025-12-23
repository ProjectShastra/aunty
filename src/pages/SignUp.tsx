import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Mail,
  Lock,
  Loader2,
  Sparkles,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match, bestie!");
      return;
    }
    
    if (data.password.length < 6) {
      toast.error("Password needs at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Log in instead!");
        } else if (error.message.includes("invalid email")) {
          toast.error("That email doesn't look right...");
        } else {
          toast.error(`Sign up failed: ${error.message}`);
        }
        return;
      }
      
      toast.success("Account created! Let's set up your cosmic profile ✨");
      
      sessionStorage.setItem('signupData', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      
      setTimeout(() => {
        navigate("/onboarding");
      }, 1500);
      
    } catch (err: any) {
      toast.error(`Something went wrong: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-aunty-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aunty-purple/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          {/* Glass card */}
          <div className="glass-strong rounded-2xl p-8 glow-border">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-aunty-pink to-aunty-purple mb-4"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Hey there, starshine! ✨
              </h1>
              <p className="text-muted-foreground">
                Aunty's ready to find your cosmic match. Let's get you signed up!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground/80">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      {...register("firstName", { required: "What's your name?" })}
                      placeholder="First name"
                      className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground/80">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName", { required: "And the last name?" })}
                    placeholder="Last name"
                    className="bg-muted/50 border-border focus:border-primary focus:ring-primary"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Aunty needs your email!",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "That email doesn't look right"
                      }
                    })}
                    placeholder="your.email@example.com"
                    className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
                <p className="text-xs text-muted-foreground italic">
                  Don't worry, Aunty won't spam you. She's too busy matchmaking! 💅
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/80">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { 
                        required: "Set a password",
                        minLength: { value: 6, message: "At least 6 characters" }
                      })}
                      placeholder="••••••"
                      className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground/80">
                    Confirm
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Confirm it!",
                      validate: value => value === password || "Doesn't match"
                    })}
                    placeholder="••••••"
                    className="bg-muted/50 border-border focus:border-primary focus:ring-primary"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-aunty-pink to-aunty-purple hover:opacity-90 transition-opacity glow-pink"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Let's Go! 🚀
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
