import dayjs from 'dayjs';

const generateMonthDates = () => {
    const start = dayjs().startOf('month');
    return Array.from({ length: start.daysInMonth() }, (_, i) => {
        const d = start.add(i, 'day');
        return { date: d.format('YYYY-MM-DD'), day: d.format('ddd') };
    });
};

const MONTH_DATES = generateMonthDates();

const makeInventoryDates = (configs) => {
    const result = {};
    configs.forEach(({ date, stopSell, available, sold }) => {
        result[date] = { stopSell, available, sold };
    });
    return result;
};

const makeRooms = (prefix, count) =>
    Array.from({ length: count }, (_, i) => {
        const roomNo = `${prefix}-${String(i + 1).padStart(3, '0')}`;
        const floor = `Floor ${Math.floor(i / 10) + 1}`;
        const availability = {};
        MONTH_DATES.forEach(({ date }, idx) => {
            if ((i + idx) % 3 !== 0) {
                availability[date] = true;
            }
        });
        return { id: i + 1, roomNo, floor, availability };
    });

// First 4 days stop sell for room type 1, rest open
const rt1InventoryDates = makeInventoryDates(
    MONTH_DATES.map(({ date }, i) => ({
        date,
        stopSell: i < 4,
        available: i < 4 ? 0 : 50,
        sold: 0,
    }))
);

// Last 2 days have prices for room type 1
const rt1Prices = {};
if (MONTH_DATES.length >= 2) {
    rt1Prices[MONTH_DATES[MONTH_DATES.length - 2].date] = 120;
    rt1Prices[MONTH_DATES[MONTH_DATES.length - 1].date] = 120;
}

export const mockCalendarData = {
    dates: MONTH_DATES,
    roomTypes: [
        {
            id: 1,
            name: 'Azura Suite Sea View',  // 4 rate plans
            inventory: {
                totalRooms: 50,
                dates: rt1InventoryDates,
            },
            ratePlans: [
                { id: 1, name: 'Standard Rate',          prices: { ...rt1Prices } },
                { id: 2, name: 'Non-Refundable',         prices: Object.fromEntries(Object.entries(rt1Prices).map(([k]) => [k, 100])) },
                { id: 3, name: 'High Season Rate',       prices: {} },
                { id: 4, name: 'Thingyan Festival Rate', prices: {} },
            ],
            rooms: makeRooms('ASV', 50),
        },
        {
            id: 2,
            name: 'Deluxe Bungalow Double',  // 2 rate plans
            inventory: {
                totalRooms: 50,
                dates: makeInventoryDates(
                    MONTH_DATES.map(({ date }) => ({ date, stopSell: false, available: 50, sold: 0 }))
                ),
            },
            ratePlans: [
                { id: 1, name: 'Standard Rate',  prices: {} },
                { id: 2, name: 'Non-Refundable', prices: {} },
            ],
            rooms: makeRooms('DBD', 50),
        },
        {
            id: 3,
            name: 'Deluxe Bungalow Twin',  // 3 rate plans
            inventory: {
                totalRooms: 50,
                dates: makeInventoryDates(
                    MONTH_DATES.map(({ date }) => ({ date, stopSell: false, available: 50, sold: 0 }))
                ),
            },
            ratePlans: [
                { id: 1, name: 'Standard Rate',    prices: {} },
                { id: 2, name: 'Non-Refundable',   prices: {} },
                { id: 3, name: 'High Season Rate', prices: {} },
            ],
            rooms: makeRooms('DBT', 50),
        },
        {
            id: 4,
            name: 'Superior Garden View',  // 1 rate plan
            inventory: {
                totalRooms: 50,
                dates: makeInventoryDates(
                    MONTH_DATES.map(({ date }) => ({ date, stopSell: false, available: 50, sold: 0 }))
                ),
            },
            ratePlans: [
                { id: 1, name: 'Standard Rate', prices: {} },
            ],
            rooms: makeRooms('SGV', 50),
        },
    ],
};
