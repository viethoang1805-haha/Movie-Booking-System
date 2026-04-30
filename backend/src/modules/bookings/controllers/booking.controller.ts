import {
  Controller, Get, Post, Delete, Param, Body, Query,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { BookingQueryDto, ConfirmBookingDto } from '../dto/booking.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ✅ Chỉ ADMIN xem tất cả booking
  @Roles('ADMIN')
  @Get()
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingService.findAll(query);
  }

  // ✅ User xem booking của mình — cần login
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(Number(userId));
  }

  // ✅ Xem ghế không cần login
  @Public()
  @Get('showtimes/:id/seats')
  getSeats(@Param('id') id: string) {
    return this.bookingService.getSeats(Number(id));
  }

  // ✅ Xem chi tiết booking — cần login
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(Number(id));
  }

  // ✅ Đặt vé — cần login (user thường)
  @Post('confirm')
  confirm(@Body() dto: ConfirmBookingDto) {
    return this.bookingService.confirmBooking(
      dto.userId,
      dto.showtimeId,
      dto.seatIds,
    );
  }

  // ✅ Hủy vé — cần login (user thường)
  @Delete(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ) {
    return this.bookingService.cancel(Number(id), body.userId);
  }
}