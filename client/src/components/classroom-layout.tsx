import { useQuery } from "@tanstack/react-query";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Student } from "@shared/schema";

interface ClassroomLayoutProps {
  onSeatClick: (studentId: string) => void;
}

export default function ClassroomLayout({ onSeatClick }: ClassroomLayoutProps) {
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Create a 33-seat grid (6x6 minus 3 seats)
  const createSeats = () => {
    const seats = [];
    for (let i = 1; i <= 33; i++) {
      const student = students.find(s => s.seatNumber === i);
      seats.push({ seatNumber: i, student });
    }
    return seats;
  };

  const seats = createSeats();

  if (isLoading) {
    return (
      <div className="glassmorphism rounded-2xl p-8 cyber-glow">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="grid grid-cols-6 gap-3 max-w-4xl mx-auto">
            {Array.from({ length: 33 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-2xl p-8 cyber-glow">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyber-indigo to-cyber-purple bg-clip-text text-transparent mb-2">
          Denah Kelas Interaktif
        </h2>
        <p className="text-slate-600 dark:text-slate-400">Klik pada kursi untuk melihat profil siswa</p>
      </div>

      {/* Teacher Desk */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-cyber-emerald to-cyan-500 text-white px-8 py-4 rounded-xl shadow-lg">
          <span className="font-semibold">Meja Guru</span>
        </div>
      </div>

      {/* Seating Chart */}
      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-3 max-w-4xl">
          {seats.map(({ seatNumber, student }) => (
            <Button
              key={seatNumber}
              variant="ghost"
              onClick={() => student && onSeatClick(student.id)}
              className={`
                p-4 h-20 flex flex-col items-center justify-center text-center transition-all duration-300
                ${student
                  ? "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-cyber-blue hover:to-cyber-purple hover:text-white hover:scale-105 hover:shadow-lg cursor-pointer"
                  : "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 opacity-50 cursor-not-allowed"
                }
                rounded-xl
              `}
              disabled={!student}
            >
              <UserCircle className="h-6 w-6 mb-1" />
              <div className="text-xs font-medium">
                {student ? student.name.split(' ')[0] : `Kursi ${seatNumber}`}
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">Total: 33 Kursi</p>
      </div>
    </div>
  );
}
