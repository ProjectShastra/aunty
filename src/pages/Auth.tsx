import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import AuntyMascot from '@/components/AuntyMascot';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthForm = z.infer<typeof authSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthForm) => {
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        const { error } = await signUp(data.email, data.password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
            setActiveTab('signin');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome to Aunty! Let\'s create your profile.');
          navigate('/onboarding');
        }
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/browse');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left side - Branding */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-secondary">Aunty</h1>
            </div>
            
            <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
              Let the stars guide you to your perfect match. Vedic astrology meets modern dating.
            </p>

            <div className="hidden lg:block">
              <AuntyMascot />
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-aunty-gold" />
            <span>Powered by ancient Vedic wisdom</span>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full max-w-md">
          <Card className="border-border shadow-xl">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'signin' | 'signup'); reset(); }}>
              <CardHeader className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                </TabsList>
                
                <CardTitle className="text-xl text-center">
                  {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
                </CardTitle>
                <CardDescription className="text-center">
                  {activeTab === 'signup' 
                    ? 'Start your journey to find your cosmic match'
                    : 'Sign in to continue your search for love'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading 
                      ? 'Please wait...' 
                      : activeTab === 'signup' 
                        ? 'Create Account' 
                        : 'Sign In'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {activeTab === 'signup' 
                      ? 'By signing up, you agree to let Aunty find you the perfect match!'
                      : 'Forgot your password? Aunty is working on that feature!'}
                  </p>
                </CardFooter>
              </form>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
