import { Injectable } from '@nestjs/common';
import { ComponentPowerRepository } from '../repositories/component-power.repository';
import { AddComponentDto } from '../../components/dto/add-component.dto';
import { UpdateComponentPowerDto } from '../dto/update-component-power.dto';
import { getCreatorId } from '../../../current-user';

@Injectable()
export class ComponentPowerService {
  constructor(private readonly repository: ComponentPowerRepository) {}

  async addComponentToDraft(userId: number, dto: AddComponentDto) {
    return this.repository.addComponentToDraft(userId, dto);
  }

  async updateInDraft(componentId: number, dto: UpdateComponentPowerDto) {
    const userId = getCreatorId();

    if (dto.quantity === undefined) {
      throw new Error('Quantity должен быть указан');
    }

    return this.repository.updateQuantityInDraft(userId, componentId, dto.quantity);
  }

  async removeFromDraft(componentId: number) {
    const userId = getCreatorId();
    return this.repository.removeComponentFromDraft(userId, componentId);
  }
}