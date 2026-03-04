import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not, DataSource} from 'typeorm';
import { ComponentBuild } from './entities/component-build.entity';
import { Build } from './entities/build.entity';
import { BuildDTO } from './dto/build.dto'

@Injectable()
export class PsuCalculatorService {
    constructor(
        @InjectRepository(Build)
        private readonly buildRepo: Repository<Build>,

        @InjectRepository(ComponentBuild)
        private readonly componentBuildRepo: Repository<ComponentBuild>,

        private readonly dataSource: DataSource,
    ) {}

    async getCurrentBuild(userId: number): Promise<BuildDTO | null>{
        const build = await this.buildRepo.findOne({
        where: {
            creatorId: userId,
            status: ('DRAFT'),
            },
        relations: [
            'componentBuilds',
            'componentBuilds.component',
            ],
        });

        if (!build) return null;

        const components = build.componentBuilds.map(cb => ({
            id: cb.component.id,
            title: cb.component.title,
            isActive: cb.component.isActive,
            image: cb.component.image,
            tdp_up: cb.component.tdp_up,
            tdp_typical: cb.component.tdp_typical,
            quantity: cb.quantity,
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
        

        const efficiency = build.efficiency; 
        const recommendedPower = Math.ceil(upTotal * 100 / efficiency );

        return {
            buildID: build.id, 
            componentsCount,
            components,
            upTotal,
            typicalTotal,
            efficiency: efficiency,
            recommendedPower,
        };
    }

    async addComponentToCurrentBuild(userId: number, componentId: number){
        let build = await this.buildRepo.findOne({
        where: {
            creatorId: userId,
            status: ('DRAFT'),
            },
        relations: [
            'componentBuilds',
            'componentBuilds.component',
            ],
        });

        if (!build) {
            build = this.buildRepo.create({
            creatorId: userId,
            status: 'DRAFT',
            efficiency: 85, // например дефолтное значение
            createdAt: new Date(),
            });

            build = await this.buildRepo.save(build);
        }
        

        let existing = await this.componentBuildRepo.findOne({
            where: { buildId: build.id, componentId }
        });
        if (existing) {
            existing.quantity += 1;
            return this.componentBuildRepo.save(existing);
        }

        // Создаём новый ComponentBuild
        const position = await this.componentBuildRepo.count({ where: { buildId: build.id } }) + 1;
        const newCb = this.componentBuildRepo.create({
            buildId: build.id,
            componentId,
            quantity: 1,
            position,
        });

        return this.componentBuildRepo.save(newCb);
    }

    async deleteCurrentBuild(userId: number) {
        await this.dataSource.query(
            `
            UPDATE builds
            SET status = 'DELETED'
            WHERE creator_id = $1
            AND status = 'DRAFT'
            `,
            [userId],
        );
    }
}
