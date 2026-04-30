import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateShowtimeDto, UpdateShowtimeDto, ShowtimeQueryDto } from '../dto/showtime.dto';
export declare class ShowtimeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    create(dto: CreateShowtimeDto): Promise<{
        id: string;
        movieId: string;
        roomId: string;
        startTime: Date;
        price: number;
    }>;
    update(id: number, dto: UpdateShowtimeDto): Promise<{
        id: string;
        movieId: string;
        roomId: string;
        startTime: Date;
        price: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getSeats(id: number): Promise<{
        id: string;
        seatNumber: string;
        status: string;
    }[]>;
    private serialize;
}
//# sourceMappingURL=showtimes.service.d.ts.map