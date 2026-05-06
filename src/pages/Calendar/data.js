import dayjs from 'dayjs';

export const fetchCalendarData = (monthDate) => {
    const monthStart = dayjs(monthDate).startOf('month');
    const groups = [
        "Azura Suite Sea View", "Deluxe Bungalow Double", "Standard Twin",
        "Executive Suite", "Family Garden View", "Penthouse Luxury"
    ];

    const data = groups.map((type, gIdx) => ({
        type,
        price: `${150 + (gIdx * 20)},000`,
        rooms: Array.from({ length: 25 }, (_, rIdx) => ({
            id: `${type.substring(0, 3).toUpperCase()}-${1001 + rIdx + (gIdx * 25)}`,
            floor: `Floor ${Math.floor(rIdx / 10) + 1}`,
            // bookings: rIdx % 3 === 0 ? (() => {
            //     const startDay = (rIdx % 5) + 2;  // 2–6, always within a month
            //     const endDay = startDay + 3;
            //     const checkIn = monthStart.add(startDay, 'day').format('YYYY-MM-DD');
            //     const checkOut = monthStart.add(endDay, 'day').format('YYYY-MM-DD');
            //     const nights = endDay - startDay;
            //     return [{
            //         id: `BKG-${1000 + gIdx * 100 + rIdx}`,
            //         name: `Guest ${rIdx + 1}`,
            //         email: `guest${rIdx + 1}@example.com`,
            //         phone: `+1 555-01${rIdx.toString().padStart(2, '0')}`,
            //         start: startDay,
            //         end: endDay,
            //         checkIn,
            //         checkOut,
            //         nights,
            //         status: ['confirmed', 'pending', 'checkin', 'booked'][rIdx % 4],
            //         price: `$${150 + (gIdx * 20)}`,
            //         guests: (rIdx % 4) + 1,
            //         specialRequests: rIdx % 2 === 0 ? 'Sea view preferred, extra towels requested' : 'None'
            //     }];
            // })()

            bookings: (() => {
                const startDay = (rIdx % 5) + 2;  // 2–6, always within a month
                const endDay = startDay + 3;
                const checkIn = monthStart.add(startDay, 'day').format('YYYY-MM-DD');
                const checkOut = monthStart.add(endDay, 'day').format('YYYY-MM-DD');
                const nights = endDay - startDay;
                return [{
                    id: `BKG-${1000 + gIdx * 100 + rIdx}`,
                    name: `Guest ${rIdx + 1}`,
                    email: `guest${rIdx + 1}@example.com`,
                    phone: `+1 555-01${rIdx.toString().padStart(2, '0')}`,
                    start: startDay,
                    end: endDay,
                    checkIn,
                    checkOut,
                    nights,
                    status: ['confirmed', 'pending', 'cancelled', 'booked', 'checkout'][rIdx % 4],
                    price: `$${150 + (gIdx * 20)}`,
                    guests: (rIdx % 4) + 1,
                    specialRequests: rIdx % 2 === 0 ? 'Sea view preferred, extra towels requested' : 'None'
                }];
            })()
        }))
    }));

    // Simulate API delay (800ms)
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 800);
    });
};