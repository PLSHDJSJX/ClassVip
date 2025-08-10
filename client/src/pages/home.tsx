import { useState } from "react";
import ClassroomLayout from "@/components/classroom-layout";
import Gallery from "@/components/gallery";
import StudentModal from "@/components/student-modal";
import AdminLogin from "@/components/admin-login";
import AdminDashboard from "@/components/admin-dashboard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Moon, Sun, ShieldQuestion, Armchair, Images } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const { data: authStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/auth/status"],
  });

  const isAdmin = authStatus?.isAdmin;

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const slides = [
    { id: 0, title: "Denah Kelas", icon: Armchair },
    { id: 1, title: "Galeri", icon: Images },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Background Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-cyber-purple/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-cyber-blue/10 rounded-full blur-xl" style={{ animationDelay: "-2s" }}></div>
        <div className="floating-element absolute bottom-32 left-1/4 w-20 h-20 bg-cyber-emerald/10 rounded-full blur-xl" style={{ animationDelay: "-4s" }}></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-50 glassmorphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyber-indigo to-cyber-purple rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyber-indigo to-cyber-purple bg-clip-text text-transparent">XI-TKJ-2</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Classroom Layout System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="glassmorphism hover:bg-white/20 dark:hover:bg-slate-700/50"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </Button>
              
              <Button
                onClick={handleAdminClick}
                className="bg-gradient-to-r from-cyber-indigo to-cyber-purple hover:shadow-lg hover:shadow-cyber-indigo/25"
              >
                <ShieldQuestion className="mr-2 h-4 w-4" />
                {isAdmin ? "Dashboard" : "Admin"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Slide Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glassmorphism rounded-full p-2 flex space-x-2">
            {slides.map((slide) => {
              const Icon = slide.icon;
              return (
                <Button
                  key={slide.id}
                  variant={currentSlide === slide.id ? "default" : "ghost"}
                  onClick={() => setCurrentSlide(slide.id)}
                  className={
                    currentSlide === slide.id
                      ? "bg-gradient-to-r from-cyber-indigo to-cyber-purple text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-700/50"
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {slide.title}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Slides Container */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="w-full flex-shrink-0">
              <ClassroomLayout onSeatClick={setSelectedStudentId} />
            </div>
            <div className="w-full flex-shrink-0">
              <Gallery />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedStudentId && (
        <StudentModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
          isAdmin={isAdmin}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminDashboard(true);
          }}
        />
      )}

      {showAdminDashboard && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}
    </div>
  );
}
