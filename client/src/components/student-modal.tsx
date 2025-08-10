import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { X, Edit } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@shared/schema";

interface StudentModalProps {
  studentId: string;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function StudentModal({ studentId, onClose, isAdmin }: StudentModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ["/api/students", studentId],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Student>) => {
      const response = await apiRequest("PUT", `/api/students/${studentId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setIsEditing(false);
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil diperbarui",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal memperbarui data siswa",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !student) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="glassmorphism border-0">
          <div className="animate-pulse space-y-4">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleEdit = () => {
    setEditData(student);
    setIsEditing(true);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Profil Siswa</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {isEditing ? (
            <>
              <div className="space-y-4">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="glassmorphism border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="photoUrl">URL Foto</Label>
                    <Input
                      id="photoUrl"
                      value={editData.photoUrl || ""}
                      onChange={(e) => setEditData({ ...editData, photoUrl: e.target.value })}
                      className="glassmorphism border-slate-300 dark:border-slate-600"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hobbies">Hobi & Minat</Label>
                    <Textarea
                      id="hobbies"
                      value={editData.hobbies || ""}
                      onChange={(e) => setEditData({ ...editData, hobbies: e.target.value })}
                      className="glassmorphism border-slate-300 dark:border-slate-600"
                      placeholder="Gaming, Programming, Fotografi"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-cyber-emerald to-cyan-500"
                >
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 glassmorphism border-slate-300 dark:border-slate-600"
                >
                  Batal
                </Button>
              </div>
            </>
          ) : (
            <>
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                {student.name}
              </h3>
              
              <div className="glassmorphism rounded-lg p-4 text-left">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Hobi & Minat:
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {student.hobbies || "Belum ada informasi hobi"}
                </p>
              </div>

              <div className="flex space-x-3">
                {isAdmin && (
                  <Button
                    onClick={handleEdit}
                    className="flex-1 bg-gradient-to-r from-cyber-amber to-orange-500"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 glassmorphism border-slate-300 dark:border-slate-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Tutup
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
