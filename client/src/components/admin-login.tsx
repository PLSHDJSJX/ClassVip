import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldQuestion, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
      toast({
        title: "Berhasil Login",
        description: "Selamat datang, Admin!",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Login Gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Login Admin</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyber-indigo to-cyber-purple rounded-full flex items-center justify-center mx-auto">
            <ShieldQuestion className="text-white text-2xl" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Login Admin</h3>
            <p className="text-slate-600 dark:text-slate-400">Masukkan kredensial admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="glassmorphism border-slate-300 dark:border-slate-600"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="glassmorphism border-slate-300 dark:border-slate-600"
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex-1 bg-gradient-to-r from-cyber-indigo to-cyber-purple"
              >
                {loginMutation.isPending ? "Loading..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 glassmorphism border-slate-300 dark:border-slate-600"
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
