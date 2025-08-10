import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Edit, Trash2, Users, Images, Presentation } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student, GalleryItem } from "@shared/schema";

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("students");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Berhasil",
        description: "Siswa berhasil dihapus",
      });
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Berhasil",
        description: "Media berhasil dihapus",
      });
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-0 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                Dashboard Admin
              </DialogTitle>
              <p className="text-slate-600 dark:text-slate-400">Kelola data siswa dan media</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-red-500/20 text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Siswa
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Galeri
            </TabsTrigger>
            <TabsTrigger value="slides" className="flex items-center gap-2">
              <Presentation className="h-4 w-4" />
              Slide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manajemen Siswa</h3>
              <Button
                onClick={() => setShowStudentForm(true)}
                className="bg-gradient-to-r from-cyber-emerald to-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Siswa
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div key={student.id} className="glassmorphism rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      👤
                    </div>
                  )}
                  <h4 className="font-semibold text-center text-slate-800 dark:text-white mb-2">
                    {student.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-3">
                    Kursi {student.seatNumber}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingStudent(student)}
                      className="flex-1 border-cyber-amber text-cyber-amber hover:bg-cyber-amber/10"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteStudentMutation.mutate(student.id)}
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manajemen Galeri</h3>
              <Button
                onClick={() => setShowGalleryForm(true)}
                className="bg-gradient-to-r from-cyber-emerald to-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.mediaType === 'image' ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-32 object-cover rounded-lg"
                      muted
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteGalleryMutation.mutate(item.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Hapus
                    </Button>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="slides" className="space-y-6">
            <h3 className="text-lg font-semibold">Manajemen Slide</h3>
            <div className="space-y-4">
              <div className="glassmorphism rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Denah Kelas</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Slide interaktif denah kelas</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-cyber-amber text-cyber-amber">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="glassmorphism rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Galeri Kenangan</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Koleksi foto dan video</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-cyber-amber text-cyber-amber">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Student Form Modal */}
        {(showStudentForm || editingStudent) && (
          <StudentForm
            student={editingStudent}
            onClose={() => {
              setShowStudentForm(false);
              setEditingStudent(null);
            }}
          />
        )}

        {/* Gallery Form Modal */}
        {showGalleryForm && (
          <GalleryForm onClose={() => setShowGalleryForm(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StudentForm({ 
  student, 
  onClose 
}: { 
  student?: Student | null; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    seatNumber: student?.seatNumber || 1,
    photoUrl: student?.photoUrl || "",
    hobbies: student?.hobbies || "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = student ? `/api/students/${student.id}` : "/api/students";
      const method = student ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Berhasil",
        description: student ? "Siswa berhasil diperbarui" : "Siswa berhasil ditambahkan",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-0">
        <DialogHeader>
          <DialogTitle>
            {student ? "Edit Siswa" : "Tambah Siswa"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="seatNumber">Nomor Kursi</Label>
            <Input
              id="seatNumber"
              type="number"
              min="1"
              max="33"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="photoUrl">URL Foto</Label>
            <Input
              id="photoUrl"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <Label htmlFor="hobbies">Hobi & Minat</Label>
            <Textarea
              id="hobbies"
              value={formData.hobbies}
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
              placeholder="Gaming, Programming, Fotografi"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-gradient-to-r from-cyber-emerald to-cyan-500"
            >
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GalleryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    mediaUrl: "",
    description: "",
    mediaType: "image" as "image" | "video",
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData | typeof formData) => {
      if (data instanceof FormData) {
        // File upload
        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (!response.ok) throw new Error("Upload failed");
        return response.json();
      } else {
        // URL upload
        const response = await apiRequest("POST", "/api/gallery", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Berhasil",
        description: "Media berhasil ditambahkan",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menambahkan media",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      mutation.mutate(formDataObj);
    } else if (formData.mediaUrl) {
      mutation.mutate(formData);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-0">
        <DialogHeader>
          <DialogTitle>Tambah Media Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="mediaUrl">URL Media</Label>
            <Input
              id="mediaUrl"
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              disabled={!!file}
            />
          </div>

          <div>
            <Label htmlFor="file">Atau Upload File</Label>
            <Input
              id="file"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                setFile(selectedFile || null);
                if (selectedFile) {
                  setFormData({ ...formData, mediaUrl: "" });
                }
              }}
              disabled={!!formData.mediaUrl}
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi media (opsional)"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={mutation.isPending || (!formData.mediaUrl && !file)}
              className="flex-1 bg-gradient-to-r from-cyber-emerald to-cyan-500"
            >
              {mutation.isPending ? "Mengunggah..." : "Tambah Media"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
