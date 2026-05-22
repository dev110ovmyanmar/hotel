import React from 'react';
import { Users, Utensils } from 'lucide-react';

const StayHistory = () => {
  const historyData = [
    {
      year: "2026",
      bookings: [
        {
          dateRange: "Apr 20, 2026 - Apr 23, 2026",
          nights: "3 Nights",
          roomType: "Deluxe Bungalow Double",
          roomCode: "DBD - 1001 Floor 1",
          guests: 2,
          breakfast: 1,
          reservationId: "1234567890",
          price: "200,000 MMK",
          status: "Booked",
          paymentStatus: "Partially-paid",
          statusColor: "text-blue-600 bg-blue-50 border-blue-100",
          paymentColor: "text-orange-600 bg-orange-50 border-orange-100",
        },
        {
          dateRange: "Feb 20, 2026 - Feb 23, 2026",
          nights: "3 Nights",
          roomType: "Deluxe Bungalow Double",
          roomCode: "DBD - 1001 Floor 1",
          guests: 2,
          breakfast: 0,
          reservationId: "1234567890",
          price: "900,000 MMK",
          status: "Confirmed",
          paymentStatus: "Paid",
          statusColor: "text-green-600 bg-green-50 border-green-100",
          paymentColor: "text-green-600 bg-green-50 border-green-100",
        }
      ]
    },
    {
      year: "2025",
      bookings: [
        {
          dateRange: "May 15, 2025 - May 17, 2026",
          nights: "2 Nights",
          roomType: "Azura Suite Sea View",
          roomCode: "ASV - 1001 Floor 1",
          guests: 1,
          breakfast: 0,
          reservationId: "1234567890",
          price: "900,000 MMK",
          status: "Check-out",
          paymentStatus: "Paid",
          statusColor: "text-orange-400 bg-orange-50 border-orange-100",
          paymentColor: "text-green-600 bg-green-50 border-green-100",
        }
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Stay History</h2>
      
      {historyData.map((section) => (
        <div key={section.year} className="relative">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-100 mb-6">{section.year}</h3>
          
          <div className="space-y-12">
            {section.bookings.map((booking, idx) => (
              <div key={idx} className="relative pl-10">
                
                {/* 1. THE LINE: Only show if it's NOT the last item in the entire history */}
                {/* We use h-full and top-6 to ensure the line starts at the circle and goes down */}
                <div className="absolute left-[11px] top-6 bottom-[-48px] w-[2px] bg-slate-200 last:hidden"></div>
                
                {/* 2. THE CIRCLE: Added bg-white and z-10 to stay on top of the line */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center">

                </div>
                
                {/* 3. THE CARD */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{booking.dateRange}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {booking.nights}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-tight ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{booking.roomType}</h4>
                    <p className="text-xs text-slate-400 font-medium">{booking.roomCode}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-100 mb-6">
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Users size={16} className="text-slate-400" /> {booking.guests}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Utensils size={16} className="text-slate-400" /> {booking.breakfast}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">
                      Reservation Id: <span className="text-slate-800 dark:text-slate-100 font-bold">{booking.reservationId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-slate-800 dark:text-slate-100">{booking.price}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${booking.paymentColor}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StayHistory;