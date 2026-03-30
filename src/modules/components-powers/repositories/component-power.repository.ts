import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentPower } from '../../../entities/component-power.entity';
import { Power } from '../../../entities/power.entity';
import { AddComponentDto } from '../../components/dto/add-component.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class ComponentPowerRepository {
  constructor(
    @InjectRepository(ComponentPower)
    private readonly cpRepo: Repository<ComponentPower>,
    @InjectRepository(Power)
    private readonly powerRepo: Repository<Power>,
  ) {}

  async findDraftByUser(userId: number): Promise<Power | null> {
    return this.powerRepo.findOne({
      where: { creatorId: userId, status: 'DRAFT' },
      relations: ['componentPowers'],
    });
  }

  async createDraft(userId: number): Promise<Power> {
    const draft = this.powerRepo.create({
      creatorId: userId,
      status: 'DRAFT',
      createdAt: new Date(),
    });
    return this.powerRepo.save(draft);
  }

  async addComponentToDraft(userId: number, dto: AddComponentDto): Promise<ComponentPower> {
    let draft = await this.findDraftByUser(userId);
    if (!draft) {
      draft = await this.createDraft(userId);
    }

    // Проверяем, есть ли уже такая связь
    const existing = await this.cpRepo.findOne({
      where: { powerId: draft.id, componentId: dto.componentId },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.cpRepo.save(existing);
    }

    const newCp = this.cpRepo.create({
      powerId: draft.id,
      componentId: dto.componentId,
      quantity: dto.quantity,
    });

    return this.cpRepo.save(newCp);
  }

   async updateQuantityInDraft(userId: number, componentId: number, quantity: number): Promise<ComponentPower> {
    const draft = await this.findDraftByUser(userId);
    if (!draft) throw new NotFoundException('Черновик не найден');

    const cp = await this.cpRepo.findOne({
      where: { powerId: draft.id, componentId },
    });

    if (!cp) throw new BadRequestException('Можно редактировать только добавленные компоненты');

    cp.quantity = quantity;
    return this.cpRepo.save(cp);
  }

  async removeComponentFromDraft(userId: number, componentId: number): Promise<void> {
  const draft = await this.findDraftByUser(userId);
  if (!draft) throw new NotFoundException('Черновик не найден');

  const cp = await this.cpRepo.findOne({
    where: { powerId: draft.id, componentId },
  });

  if (!cp) throw new BadRequestException('Компонент не найден в черновике');

  await this.cpRepo.delete({
    powerId: draft.id,
    componentId,
  });
  }
}