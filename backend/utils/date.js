// Convert any Date into IST "date-only" boundaries
export const getISTDayBounds = (date = new Date()) => {
  const IST_OFFSET = 5.5 * 60; // minutes
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const ist = new Date(utc + IST_OFFSET * 60000);

  const startOfDayIST = new Date(
    ist.getFullYear(),
    ist.getMonth(),
    ist.getDate(),
    0, 0, 0, 0
  );

  const endOfDayIST = new Date(
    ist.getFullYear(),
    ist.getMonth(),
    ist.getDate(),
    23, 59, 59, 999
  );

  // Convert back to UTC so Mongo queries work correctly
  return {
    startUTC: new Date(startOfDayIST.getTime() - IST_OFFSET * 60000),
    endUTC: new Date(endOfDayIST.getTime() - IST_OFFSET * 60000),
    dayIST: startOfDayIST // human readable IST date
  };
};
