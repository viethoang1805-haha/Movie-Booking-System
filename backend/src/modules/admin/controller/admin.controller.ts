
import { Controller, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { Roles } from '../../../common/decorators/roles.decorator';

@Roles('ADMIN') // chỉ ADMIN mới vào được
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/dashboard — thống kê tổng quan
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // GET /admin/users?page=1&search=john&role=USER
  @Get('users')
  getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  // PUT /admin/users/:id/role — đổi role
  @Put('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: 'USER' | 'ADMIN' },
  ) {
    return this.adminService.updateUserRole(Number(id), body.role);
  }

  // DELETE /admin/users/:id
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(Number(id));
  }

  // GET /admin/bookings?page=1&status=CONFIRMED
  @Get('bookings')
  getBookings(@Query() query: any) {
    return this.adminService.getBookings(query);
  }
}