    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Power } from '../../../entities/power.entity';
    import { PowerFiltersDto } from '../dto/power-filter.dto';
    import { NotFoundException } from '@nestjs/common';

    @Injectable()
    export class PowerRepository {
    constructor(
        @InjectRepository(Power)
        private readonly repo: Repository<Power>,
    ) {}

    async findDraftByUser(userId: number): Promise<{ draftId: number; componentsCount: number } | null> {
        // Берём черновик с компонентами
        const draft = await this.repo.findOne({
        where: {
            creatorId: userId,
            status: 'DRAFT',
        },
        relations: ['componentPowers',
      'componentPowers.component',
      'creator',      
      'moderator',],
        });

        if (!draft) return null;

        // Считаем количество компонентов через quantity, если у ComponentPower есть поле quantity
        const componentsCount = draft.componentPowers.reduce(
        (sum, cp: any) => sum + (cp.quantity ?? 1), 
        0
        );

        return {
        draftId: draft.id,
        componentsCount,
        };
    }

    async findAllWithFilters(filters?: PowerFiltersDto) {
        const query = this.repo.createQueryBuilder('power')
        .leftJoinAndSelect('power.creator', 'creator')
        .leftJoinAndSelect('power.moderator', 'moderator')
        .where('power.status NOT IN (:...excluded)', { excluded: ['DELETED', 'DRAFT'] });

        if (filters?.status) {
        query.andWhere('power.status = :status', { status: filters.status });
        }

        if (filters?.dateFrom) {
        query.andWhere('power.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
        }

        if (filters?.dateTo) {
        query.andWhere('power.createdAt <= :dateTo', { dateTo: filters.dateTo });
        }

        // Получаем все записи
        const powers = await query.getMany();

        // Добавляем вычисляемое поле mMCount, если есть поле result в “м-м”
        return powers.map(p => {
            const mMCount = p.componentPowers
            ? p.componentPowers.filter(cp => cp.component != null).length
            : 0;
            return {
                ...p,
                creatorLogin: p.creator.login,
                moderatorLogin: p.moderator?.login,
                mMCount,
        };
        });
    }

    async findByIdWithComponents(powerId: number, userId?: number): Promise<Power | null> {
    const query = this.repo.createQueryBuilder('power')
        .leftJoinAndSelect('power.componentPowers', 'cp')
        .leftJoinAndSelect('cp.component', 'component')
        .where('power.id = :powerId', { powerId })
        .andWhere('LOWER(power.status) != LOWER(:deleted)', { deleted: 'deleted' });

    return query.getOne();
    }
      
    async updatePower(powerId: number, data: Partial<{ efficiency: number; description: string }>): Promise<Power> {
        const power = await this.repo.findOne({ where: { id: powerId } });
        if (!power) throw new Error('Power not found');

        if (data.efficiency !== undefined) power.efficiency = data.efficiency;
        if (data.description !== undefined) power.description = data.description;

        return await this.repo.save(power);
    }

    async complete(powerId: number, completedAt: Date, moderatorId: number): Promise<Power> {
        const power = await this.repo.findOne({ where: { id: powerId } });
        if (!power) throw new Error('Power not found');

        power.status = 'COMPLETED';
        power.completedAt = completedAt;
        power.moderatorId = moderatorId;

        return this.repo.save(power);
    }

    async findDraftFull(userId: number): Promise<Power | null> {
    return this.repo.findOne({
        where: { creatorId: userId, status: 'DRAFT' },
        relations: ['componentPowers', 'componentPowers.component', 'creator','moderator'],
    });
    }

    async finalize(powerId: number, formedAt: Date): Promise<Power> {
    const power = await this.repo.findOne({ 
        where: { id: powerId },
        relations: ['componentPowers', 'componentPowers.component', 'creator','moderator',], 
    });

    if (!power) throw new NotFoundException(`Power с ID ${powerId} не найден`);

    power.status = 'FORMED';
    power.formedAt = formedAt;

    return this.repo.save(power);
}

    async update(powerId: number, data: Partial<Power>): Promise<Power> {
    const power = await this.repo.findOne({ where: { id: powerId } });
    if (!power) throw new NotFoundException('Power not found');

    Object.assign(power, data);
    return this.repo.save(power);
    }

    async save(power: Power): Promise<Power> {
        return this.repo.save(power);
    }

    async softDelete(powerId: number): Promise<Power> {
        const power = await this.repo.findOne({ where: { id: powerId } });
        if (!power) throw new Error('Power not found');
        power.status = 'DELETED';

        return await this.repo.save(power);
    }
}
