const RATE_PLANS = [
    { rate_plan_id: 1, rate_plan_name: 'Standard Rate' },
    { rate_plan_id: 2, rate_plan_name: 'Non-Refundable' },
    { rate_plan_id: 3, rate_plan_name: 'High Season Rate' },
    { rate_plan_id: 4, rate_plan_name: 'Thingyan Festival Rate' },
];

const makeRates = (overrides = {}) =>
    RATE_PLANS.map((rp) => ({
        rate_plan_id: rp.rate_plan_id,
        rate_plan_name: rp.rate_plan_name,
        price: overrides[rp.rate_plan_id]?.price ?? null,
        extra_bed: { adult: null, child: null },
        restriction: {
            min_stay: overrides[rp.rate_plan_id]?.min_stay ?? null,
            max_stay: overrides[rp.rate_plan_id]?.max_stay ?? null,
            cta: false,
            ctd: false,
        },
    }));

const makeDates = (dateConfigs) =>
    dateConfigs.map(({ date, sold, available, stop_sell, rateOverrides }) => ({
        date,
        availability: { sold, available, stop_sell },
        rates: makeRates(rateOverrides),
    }));

const makeRooms = (prefix, count, floorSize = 10) =>
    Array.from({ length: count }, (_, i) => ({
        room_id: i + 1,
        room_number: `${prefix}-${String(i + 1).padStart(3, '0')}`,
        floor: `Floor ${Math.floor(i / floorSize) + 1}`,
    }));

// April 2026 dates
const APRIL_DATES = Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    return `2026-04-${String(d).padStart(2, '0')}`;
});

export const mockCalendarData = {
    dates: APRIL_DATES,
    room_types: [
        {
            room_type_id: 1,
            room_type_name: 'Azura Suite Sea View',
            rooms: makeRooms('ASV', 50),
            dates: makeDates([
                // Apr 1-4: stop_sell = true, available = 0
                { date: '2026-04-01', sold: 0, available: 0, stop_sell: true },
                { date: '2026-04-02', sold: 0, available: 0, stop_sell: true },
                { date: '2026-04-03', sold: 0, available: 0, stop_sell: true },
                { date: '2026-04-04', sold: 0, available: 0, stop_sell: true },
                // Apr 5-15 only (15 days total — simulating partial API response)
                ...Array.from({ length: 11 }, (_, i) => ({
                    date: `2026-04-${String(i + 5).padStart(2, '0')}`,
                    sold: 0,
                    available: 50,
                    stop_sell: false,
                    rateOverrides: (i + 5 === 10 || i + 5 === 11)
                        ? { 4: { min_stay: 2, max_stay: 0 } }
                        : {},
                })),
                // Apr 16-30 intentionally missing to test frontend fallback
            ]),
        },
        {
            room_type_id: 2,
            room_type_name: 'Deluxe Bungalow Double',
            rooms: makeRooms('DBD', 50),
            dates: makeDates(
                APRIL_DATES.map((date) => ({ date, sold: 0, available: 50, stop_sell: false }))
            ),
        },
        {
            room_type_id: 3,
            room_type_name: 'Deluxe Bungalow Twin',
            rooms: makeRooms('DBT', 50),
            dates: makeDates(
                APRIL_DATES.map((date) => ({ date, sold: 0, available: 50, stop_sell: false }))
            ),
        },
    ],
};
