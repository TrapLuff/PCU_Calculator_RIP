import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PowerRepository } from '../repositories/power.repository';
import { MinioService } from '../../../services/minio.service';

import { PowerCartResponseDto } from '../dto/power-cart-response';
import { PowerFiltersDto } from '../dto/power-filter.dto';
import { PowerResponseDto, PowerListResponseDto } from '../dto/power-response.dto';
import { PowerFinalizeResponseDto } from '../dto/power-finalize-response.dto';
import { UpdatePowerDto } from '../dto/update-power.dto';

import { getCurrentUserId, getModeratorId, getCreatorId } from '../../../current-user';

@Injectable()
export class PowersService {
  constructor(
    private readonly powerRepo: PowerRepository,
    private readonly minioService: MinioService,
  ) {}

  async getUserDraftCart(userId: number): Promise<PowerCartResponseDto | null> {
    const draft = await this.powerRepo.findDraftByUser(userId);
    if (!draft) return null;

    return {
      draftId: draft.draftId,
      componentsCount: draft.componentsCount,
    };
  }

  async getFilteredPowers(filters: PowerFiltersDto) {
    return this.powerRepo.findAllWithFilters(filters);
  }

  async getPowerById(powerId: number, userId?: number): Promise<PowerResponseDto> {
    const power = await this.powerRepo.findByIdWithComponents(powerId, userId);
    if (!power) throw new NotFoundException(`Заявка с ID ${powerId} не найдена`);

    const components = await Promise.all(
      power.componentPowers.map(async cp => {
        const fileName = cp.component.image;

        let imageUrl: string | null = null;

        if (fileName) {
          const signedUrl = await this.minioService.getSignedUrl(fileName);
          imageUrl = signedUrl ?? fileName;
        }

        return {
          id: cp.component.id,
          title: cp.component.title,
          isActive: cp.component.isActive,
          image: imageUrl,
          tdp_up: cp.component.tdp_up,
          tdp_typical: cp.component.tdp_typical,
          quantity: cp.quantity,
        };
      })
    );

    const upTotal = components.reduce((sum, c) => sum + c.tdp_up * c.quantity, 0);
    const typicalTotal = components.reduce((sum, c) => sum + c.tdp_typical * c.quantity, 0);
    const componentsCount = components.reduce((sum, c) => sum + c.quantity, 0);
    const efficiency = power.efficiency ?? 85;
    const recommendedPower = Math.ceil(upTotal * 100 / efficiency);

    return {
      powerId: power.id,
      status: power.status,
      upTotal,
      typicalTotal,
      efficiency,
      recommendedPower,
      componentsCount,
      components,
    };
  }

  async updatePower(powerId: number, dto: UpdatePowerDto) {
    try {
      return await this.powerRepo.updatePower(powerId, dto);
    } catch {
      throw new NotFoundException(`Power with ID ${powerId} not found`);
    }
  }

  async formDraft(): Promise<PowerListResponseDto> {
    const userId = getCurrentUserId();
    const draft = await this.powerRepo.findDraftFull(userId);

    if (!draft) throw new NotFoundException('Черновик не найден');
    if (!draft.componentPowers?.length) throw new BadRequestException('Нет компонентов');
    if (!draft.efficiency) throw new BadRequestException('Нет эффективности');

    const upTotal = draft.componentPowers.reduce(
      (sum, cp) => sum + cp.component.tdp_up * cp.quantity,
      0,
    );

    const componentsCount = draft.componentPowers.reduce(
      (sum, cp) => sum + cp.quantity,
      0,
    );

    const recommendedPower = Math.ceil(upTotal * 100 / draft.efficiency);

    await this.powerRepo.update(draft.id, { recommendedPower });
    await this.powerRepo.finalize(draft.id, new Date());

    return {
      id: draft.id,
      userName: draft.creator.login,
      moderatorName: draft.moderator?.login ?? null,
      status: 'FORMED',
      createdAt: null,
      formedAt: draft.formedAt,
      completedAt: new Date(),
      componentsCount,
      upTotal,
      recommendedPower,
    };
  }

  async completePower(powerId: number): Promise<PowerFinalizeResponseDto> {
    const power = await this.powerRepo.findByIdWithComponents(powerId);
    const moderatorId = getModeratorId();

    if (!power) throw new NotFoundException('Заявка не найдена');
    if (power.status !== 'FORMED') {
      throw new BadRequestException('Неверный статус');
    }

    const upTotal = power.componentPowers.reduce(
      (sum, cp) => sum + cp.component.tdp_up * cp.quantity,
      0,
    );

    const componentsCount = power.componentPowers.reduce(
      (sum, cp) => sum + cp.quantity,
      0,
    );

    const efficiency = power.efficiency ?? 85;
    const recommendedPower = Math.ceil(upTotal * 100 / efficiency);
    const completedAt = new Date();

    await this.powerRepo.complete(powerId, completedAt, moderatorId);

    return {
      powerId: power.id,
      status: 'COMPLETED',
      completedAt,
      componentsCount,
      upTotal,
      efficiency,
      recommendedPower,
    };
  }

  async remove(): Promise<{ message: string }> {
    const creatorId = getCreatorId();
    const power = await this.powerRepo.findDraftByUser(creatorId);

    if (!power) {
      throw new NotFoundException('Черновик не найден');
    }

    await this.powerRepo.softDelete(power.draftId);

    return { message: 'Черновик успешно удален' };
  }
}