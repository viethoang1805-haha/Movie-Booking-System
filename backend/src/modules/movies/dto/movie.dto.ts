// src/modules/movies/dto/movie.dto.ts

export class CreateMovieDto {
  title!: string;
  description?: string;
  duration!: number;       // phút
  releaseDate!: string;    // ISO string
  posterUrl?: string;
}

export class UpdateMovieDto {
  title?: string;
  description?: string;
  duration?: number;
  releaseDate?: string;
  posterUrl?: string;
}

export class MovieQueryDto {
  page?: number;          // mặc định 1
  limit?: number;         // mặc định 10
  search?: string;        // tìm theo title
}