import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { GalleryItem } from "@shared/schema";

export default function Gallery() {
  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: authStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/auth/status"],
  });

  const isAdmin = authStatus?.isAdmin;

  if (isLoading) {
    return (
      <div className="glassmorphism rounded-2xl p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyber-indigo to-cyber-purple bg-clip-text text-transparent mb-2">
          Galeri Kenangan
        </h2>
        <p className="text-slate-600 dark:text-slate-400">Koleksi foto dan video kelas XI-TKJ-2</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Belum ada media dalam galeri</p>
            {isAdmin && (
              <Button className="bg-gradient-to-r from-cyber-emerald to-cyan-500">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media
              </Button>
            )}
          </div>
        ) : (
          galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {item.mediaType === 'image' ? (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  muted
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm opacity-90">{item.description}</p>
                  )}
                  <p className="text-xs opacity-75">
                    {new Date(item.createdAt!).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Media Button (Admin Only) */}
      {isAdmin && galleryItems.length > 0 && (
        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-cyber-emerald to-cyan-500">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Media
          </Button>
        </div>
      )}
    </div>
  );
}
