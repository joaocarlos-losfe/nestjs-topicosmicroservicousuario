import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreate } from './dto/create-user.dto';
import { UserUpdate } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/")
  async create(@Body() data: UserCreate){
    return this.userService.create(data);
  }

  @Get("/")
  async readAll(){
    return this.userService.readAll();
  }

  @Get("/:id")
  async read(@Param("id") id: string){
    return this.userService.read(id);
  }

  @Get("/get-by-username/:username")
  async readByUsername(@Param("username") username: string){
    return this.userService.readByUsername(username);
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() data: UserUpdate){
    return this.userService.update(id, data);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string){
    return this.userService.delete(id);
  }
}
