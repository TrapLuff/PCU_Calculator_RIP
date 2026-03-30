import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ComponentsRepository } from '../repositories/component.repository';
import { ComponentResponseDto } from '../dto/component-response.dto';
import { ComponentFiltersDto } from '../dto/component-filter.dto';
import { Component } from '../../../entities/component.entity';
import { MinioService } from '../../../services/minio.service';

@Injectable()
export class ComponentsService {
  constructor(
    private readonly componentsRepository: ComponentsRepository,
    private readonly minioService: MinioService,
  ) {}

  async findAll(filters: ComponentFiltersDto): Promise<ComponentResponseDto[]> {
    const components = await this.componentsRepository.findAll(filters);
    return components.map(c => this.toDto(c));
  }

  async findById(id: number): Promise<ComponentResponseDto> {
    const component = await this.componentsRepository.findById(id);

    if (!component || !component.isActive) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }

    return this.toDto(component);
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    const component = await this.componentsRepository.findById(id);
    if (!component) throw new NotFoundException('Component not found');

    if (!file) throw new BadRequestException('Файл не передан');

    const fileName = await this.minioService.uploadImage(file.buffer, id);

    return this.componentsRepository.update(id, { image: fileName });
  }

  async uploadVideo(id: number, file: Express.Multer.File) {
    const component = await this.componentsRepository.findById(id);
    if (!component) throw new NotFoundException('Component not found');

    if (!file) throw new BadRequestException('Файл не передан');

    const fileName = await this.minioService.uploadVideo(file.buffer, id);

    return this.componentsRepository.update(id, { video: fileName });
  }

  private toDto(component: Component): ComponentResponseDto {
    return {
      id: component.id,
      title: component.title,
      tdp_up: component.tdp_up,
      tdp_typical: component.tdp_typical,
      image: component.image,
    };
  }
}