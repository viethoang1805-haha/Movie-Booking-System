import { ShowtimeService } from '../../showtimes/services/showtimes.service';
import { CreateShowtimeDto, UpdateShowtimeDto, ShowtimeQueryDto } from '../dto/showtime.dto';
export declare class ShowtimeController {
    private readonly showtimeService;
    constructor(showtimeService: ShowtimeService);
    findAll(query: ShowtimeQueryDto): Promise<{
        id: any;
        startTime: any;
        price: any;
        movieId: any;
        roomId: any;
        movie: any;
        room: {
            id: any;
            name: any;
            theater: any;
        } | undefined;
    }[]>;
    findOne(id: string): Promise<{
        seats: {
            id: string;
            seatNumber: string;
            status: string;
        }[];
        id: any;
        startTime: any;
        price: any;
        movieId: any;
        roomId: any;
        movie: any;
        room: {
            id: any;
            name: any;
            theater: any;
        } | undefined;
    }>;
    getSeats(id: string): Promise<{
        id: string;
        seatNumber: string;
        status: string;
    }[]>;
    create(dto: CreateShowtimeDto): Promise<{
        id: string;
        movieId: string;
        roomId: string;
        startTime: Date;
        price: number;
    }>;
    update(id: string, dto: UpdateShowtimeDto): Promise<{
        id: string;
        movieId: string;
        roomId: string;
        startTime: Date;
        price: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=showtimes.controller.d.ts.map