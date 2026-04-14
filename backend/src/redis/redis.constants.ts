export const REDIS_KEYS = {
  SEAT: (showtimeId: number, seatId: string) =>
    `seat:${showtimeId}:${seatId}`,
};