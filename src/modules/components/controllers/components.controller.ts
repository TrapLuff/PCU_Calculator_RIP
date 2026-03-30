import { Controller, Get, Post, Param, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ComponentsService } from '../services/components.service';
import { ComponentResponseDto } from '../dto/component-response.dto';
import { ComponentFiltersDto } from '../dto/component-filter.dto';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get()
  async getAllComponents(@Query() filters: ComponentFiltersDto): Promise<ComponentResponseDto[]> {
    return this.componentsService.findAll(filters);
  }

  @Get(':id')
  async getComponentById(@Param('id', ParseIntPipe) id: number): Promise<ComponentResponseDto> {
    return this.componentsService.findById(id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    return this.componentsService.uploadImage(id, file);
  }

  @Post(':id/video')
  @UseInterceptors(FileInterceptor('video', { storage: memoryStorage() }))
  async uploadVideo(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    return this.componentsService.uploadVideo(id, file);
  }
}