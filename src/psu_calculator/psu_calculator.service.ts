import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not, DataSource } from 'typeorm';
import { ComponentPower } from './entities/component-power.entity';
import { Power } from './entities/power.entity';
import { PowerDTO } from './dto/power.dto';

@Injectable()
export class PsuCalculatorService {
    constructor(
        @InjectRepository(Power)
        private readonly powerRepo: Repository<Power>,

        @InjectRepository(ComponentPower)
        private readonly componentPowerRepo: Repository<ComponentPower>,

        private readonly dataSource: DataSource,
    ) {}

    async getCurrentPower(userId: number): Promise<PowerDTO | null> {
        const power = await this.powerRepo.findOne({
            where: {
                creatorId: userId,
                status: 'DRAFT',
            },
            relations: [
                'componentPowers',
                'componentPowers.component',
            ],
        });

        if (!power) return null;

        const components = power.componentPowers.map(cp => ({
            id: cp.component.id,
            title: cp.component.title,
            isActive: cp.component.isActive,
            image: cp.component.image,
            tdp_up: cp.component.tdp_up,
            tdp_typical: cp.component.tdp_typical,
            quantity: cp.quantity,
        }));

        const upTotal = components.reduce(
            (sum, c) => sum + c.tdp_up * c.quantity,
            0
        );

        const typicalTotal = components.reduce(
            (sum, c) => sum + c.tdp_typical * c.quantity,
            0
        );

        const componentsCount = components.reduce(
            (sum, c) => sum + c.quantity,
            0
        );

        const efficiency = power.efficiency;
        const recommendedPower = Math.ceil(upTotal * 100 / (efficiency ?? 85));

        return {
            powerID: power.id,
            status: power.status,
            componentsCount,
            components,
            upTotal,
            typicalTotal,
            efficiency: efficiency ?? 85,
            recommendedPower,
        };
    }

    async getPowerById(powerId: number, userId: number): Promise<PowerDTO | null> {
        const power = await this.powerRepo.findOne({
            where: {
                id: powerId,
                creatorId: userId,
                status: Not('DELETED'),
            },
            relations: [
                'componentPowers',
                'componentPowers.component',
            ],
        });

        if (!power) return null;

        const components = power.componentPowers.map(cp => ({
            id: cp.component.id,
            title: cp.component.title,
            isActive: cp.component.isActive,
            image: cp.component.image,
            tdp_up: cp.component.tdp_up,
            tdp_typical: cp.component.tdp_typical,
            quantity: cp.quantity,
        }));

        const upTotal = components.reduce(
            (sum, c) => sum + c.tdp_up * c.quantity,
            0
        );

        const typicalTotal = components.reduce(
            (sum, c) => sum + c.tdp_typical * c.quantity,
            0
        );

        const componentsCount = components.reduce(
            (sum, c) => sum + c.quantity,
            0
        );

        const efficiency = power.efficiency;
        const recommendedPower = Math.ceil(upTotal * 100 / (efficiency ?? 85));

        return {
            powerID: power.id,
            status: power.status,
            componentsCount,
            components,
            upTotal,
            typicalTotal,
            efficiency: efficiency ?? 85,
            recommendedPower,
        };
    }

    async addComponentToCurrentPower(userId: number, componentId: number) {
    let power = await this.powerRepo.findOne({
        where: {
            creatorId: userId,
            status: 'DRAFT',
        },
        relations: [
            'componentPowers',
            'componentPowers.component',
        ],
    });

    if (!power) {
        power = this.powerRepo.create({
            creatorId: userId,
            status: 'DRAFT',
            efficiency: 85,
            createdAt: new Date(),
        });

        power = await this.powerRepo.save(power);
    }

    let existing = await this.componentPowerRepo.findOne({
        where: { powerId: power.id, componentId }
    });

    if (existing) {
        // Если quantity было null, превращаем в 1
        existing.quantity = (existing.quantity ?? 0) + 1;
        return this.componentPowerRepo.save(existing);
    }

    // Создаём новый ComponentPower без position
    const newCp = this.componentPowerRepo.create({
        power: power,          // связываем объект Power
        componentId: componentId,
        quantity: 1,           // не nullable для новой записи
    });

    return this.componentPowerRepo.save(newCp);
}

    async deleteCurrentPower(userId: number) {
        await this.dataSource.query(
            `
            UPDATE powers
            SET status = 'DELETED'
            WHERE creator_id = $1
            AND status = 'DRAFT'
            `,
            [userId],
        );
    }
}