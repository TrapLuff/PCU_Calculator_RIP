import { Controller, Get, Post, Param, Render, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Component } from './entities/component.entity';
import { PsuCalculatorService } from "./psu_calculator.service"

@Controller()
export class PsuCalculatorController {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepo: Repository<Component>,
    private readonly PsuCalculatorService: PsuCalculatorService,
  ) {}

  @Get('components')
  @Render('components')
  async getComponents() { 
    const components = await this.componentRepo.find();

    const userId = 1;
    const build = await this.PsuCalculatorService.getCurrentBuild(userId);

    const componentsWithQuantity = components.map(c => {
    const cb = build?.components?.find(bc => bc.id === c.id);
        return {
          ...c,
          quantity: cb ? cb.quantity : 0,
          isActive: true,
        };
    });

    return {
      title: 'Список компонентов',
      hasDraft: !!build,
      currentUrl: '/components',
      data: {
        components: componentsWithQuantity,
      },
    };
  }

  @Post('components')
  @Render('components')
  async searchComponents(@Body() body: { query?: string }) {
    const query = body?.query?.trim();

    let components: Component[];

    if (query) {
      components = await this.componentRepo.find({
        where: [
          { title: ILike(`%${query}%`) },
          { type: ILike(`%${query}%`) },
        ],
      });
    } else {
      components = await this.componentRepo.find();
    }
    
    const userId = 1;
    const build = await this.PsuCalculatorService.getCurrentBuild(userId);

    const componentsWithQuantity = components.map(c => {
    const cb = build?.components?.find(bc => bc.id === c.id);
        return {
          ...c,
          quantity: cb ? cb.quantity : 0,
          isActive: true,
        };
    });

    return {
      title: 'Список компонентов',
      hasDraft: !!build,
      currentUrl: '/components',
      data: {
        components: componentsWithQuantity,
        query: query || '',
      },
    };
    }

    @Get('component/:id')
    @Render('component')
    async getComponent(@Param('id') id: string) {
      const component = await this.componentRepo.findOneBy({
      id: Number(id),
    });
      return {
        title: component ? component.title : 'Не найдено',
        data: {
          id,
          current_date: new Date().toLocaleDateString(),
          component,
        },
      };
    }

    @Get('build')
    @Render('build')
    async getCurrentBuild() {
    const userId = 1; // временно

    const build = await this.PsuCalculatorService.getCurrentBuild(userId);

    if (!build) {
    return {
      title: 'Заявка отсутствует',
      data: {
        hasBuild: false,
      },
    };
    }

    return {
      title: `Заявка #${build.buildID}`,
      currentUrl: '/build',
      data: {
        hasBuild: true,
        build,
        components: build.components,
      },
    };

  }

  @Get('build/:id')
  @Render('build')
  async getBuildById(@Param('id') id: string) {
      const buildId = Number(id);
      const userId = 1; 
      const build = await this.PsuCalculatorService.getBuildById(buildId, userId);

      if (!build) {
      return {
        title: 'Заявка отсутствует',
        data: {
          hasBuild: false,
        },
      };
      }

      return {
        title: `Заявка #${build.buildID}`,
        data: {
          hasBuild: true,
          build,
          components: build.components,
        },
      };
  }

  @Post('build/add-component/:componentId')
  async addComponent(@Param('componentId') componentId: number,  @Res() res: Response, @Body() body: { returnUrl: string },) {
    const userId = 1; // временно для теста
    const cb = await this.PsuCalculatorService.addComponentToCurrentBuild(userId, componentId);
    return res.redirect(body.returnUrl || '/components');
  } 


  @Post('delete-build')
  async deleteBuild(@Res() res: Response) {
    const userId = 1; // временно

    await this.PsuCalculatorService.deleteCurrentBuild(userId);

    return res.redirect('/components'); // после удаления переходим к компонентам
  }

}