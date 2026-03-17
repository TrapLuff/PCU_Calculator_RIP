import { Controller, Get, Post, Param, Render, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Component } from './entities/component.entity';
import { PsuCalculatorService } from "./psu_calculator.service";

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
    const power = await this.PsuCalculatorService.getCurrentPower(userId);

    const componentsWithQuantity = components.map(c => {
      const cp = power?.components?.find(pc => pc.id === c.id);
      return {
        ...c,
        quantity: cp ? cp.quantity : 0,
        isActive: true,
      };
    });

    return {
      title: 'Список компонентов',
      hasPower: !!power,
      currentUrl: '/components',
      data: {
        components: componentsWithQuantity,
        componentsCount: power?.componentsCount || 0,
        powerID: power?.powerID,
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
    const power = await this.PsuCalculatorService.getCurrentPower(userId);

    const componentsWithQuantity = components.map(c => {
      const cp = power?.components?.find(pc => pc.id === c.id);
      return {
        ...c,
        quantity: cp ? cp.quantity : 0,
        isActive: true,
      };
    });

    return {
      title: 'Список компонентов',
      hasPower: !!power,
      currentUrl: '/components',
      data: {
        components: componentsWithQuantity,
        componentsCount: power?.componentsCount || 0,
        query: query || '',
        powerID: power?.powerID,
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

  @Get('power')
  @Render('power')
  async getCurrentPower() {
    const userId = 1;

    const power = await this.PsuCalculatorService.getCurrentPower(userId);

    if (!power) {
      return {
        title: 'Заявка отсутствует',
        data: {
          hasPower: false,
        },
      };
    }

    return {
      title: `Заявка #${power.powerID}`,
      currentUrl: '/power',
      data: {
        hasPower: true,
        power,
        components: power.components,
      },
    };
  }

  @Get('power/:id')
async redirectNonDraft(
  @Param('id') id: string,
  @Res() res: Response
) {
    const powerId = Number(id);
    const userId = 1;

    const power = await this.PsuCalculatorService.getPowerById(powerId, userId);

    if (!power) {
        // если заявки нет — просто редирект на DRAFT
        const draft = await this.PsuCalculatorService.getCurrentPower(userId);
        if (draft) return res.redirect(`/power/${draft.powerID}`);
        return res.redirect('/components');
    }

    // если заявка не DRAFT — редирект на DRAFT
    if (power.status !== 'DRAFT') {
        const draft = await this.PsuCalculatorService.getCurrentPower(userId);
        if (draft) return res.redirect(`/power/${draft.powerID}`);
        return res.redirect('/components');
    }

    // если DRAFT — рендерим страницу
    return res.render('power', {
        title: `Заявка #${power.powerID}`,
        data: {
            hasPower: true,
            power,
            components: power.components,
        },
    });
  }

  @Post('power/add-component/:componentId')
  async addComponent(
    @Param('componentId') componentId: number,
    @Res() res: Response,
    @Body() body: { returnUrl: string },
  ) {
    const userId = 1;

    await this.PsuCalculatorService.addComponentToCurrentPower(userId, componentId);

    return res.redirect(body.returnUrl || '/components');
  }

  @Post('delete-power')
  async deletePower(@Res() res: Response) {
    const userId = 1;

    await this.PsuCalculatorService.deleteCurrentPower(userId);

    return res.redirect('/components');
  }
}