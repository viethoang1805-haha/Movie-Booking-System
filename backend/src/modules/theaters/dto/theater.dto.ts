
export class CreateTheaterDto {
  name!: string;
  location!: string;
}

export class UpdateTheaterDto {
  name?: string;
  location?: string;
}

export class CreateRoomDto {
  name!: string;
  theaterId!: number;
}

export class UpdateRoomDto {
  name?: string;
}