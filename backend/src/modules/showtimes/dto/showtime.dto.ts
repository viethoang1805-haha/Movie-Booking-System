// src/modules/showtimes/dto/showtime.dto.ts

export class CreateShowtimeDto {
  movieId!: number;
  roomId!: number;
  startTime!: string; // ISO string
  price!: number;
}

export class UpdateShowtimeDto {
  startTime?: string;
  price?: number;
}

export class ShowtimeQueryDto {
  movieId?: number;   // lọc theo phim
  roomId?: number;    // lọc theo phòng
  date?: string;      // lọc theo ngày (YYYY-MM-DD)
}