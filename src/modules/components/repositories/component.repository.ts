import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from '../../../entities/component.entity';
import { ComponentFiltersDto } from '../dto/component-filter.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ComponentsRepository {
  constructor(
    @InjectRepository(Component)
    private readonly repo: Repository<Component>,
  ) {}

  async findAll(filters?: ComponentFiltersDto): Promise<Component[]> {
    const query = this.repo.createQueryBuilder('component');

    if (filters?.isActive !== undefined) {
      query.where('component.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      query.andWhere('LOWER(component.title) LIKE :search', {
        search: `%${filters.search.toLowerCase()}%`,
      });
    }

    if (filters?.type) {
      query.andWhere('component.type = :type', { type: filters.type });
    }

    if (filters?.minTdpTypical !== undefined) {
      query.andWhere('component.tdp_typical >= :minTdp', { minTdp: filters.minTdpTypical });
    }

    if (filters?.maxTdpTypical !== undefined) {
      query.andWhere('component.tdp_typical <= :maxTdp', { maxTdp: filters.maxTdpTypical });
    }

    return query.getMany();
  }

  async findById(id: number): Promise<Component | null> {
    return this.repo.findOne({ where: { id } });
  }

    async update(componentId: number, data: Partial<Component>): Promise<Component> {
    const component = await this.repo.findOne({ where: { id: componentId } });
    if (!component) throw new NotFoundException('Component not found');

    Object.assign(component, data);
    return this.repo.save(component);
  }
}


