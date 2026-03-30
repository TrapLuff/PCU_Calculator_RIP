import { Controller, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ComponentPowerService } from '../services/components-powers.service';
import { UpdateComponentPowerDto } from '../dto/update-component-power.dto';
import { getCurrentUserId } from '../../../current-user';

@Controller('components-powers')
export class ComponentPowerController {
  constructor(private readonly service: ComponentPowerService) {}

  @Post('add/:componentId')
  async addComponent(@Param('componentId', ParseIntPipe) componentId: number, @Body('quantity') quantity?: number) {
    const userId = getCurrentUserId();
    return this.service.addComponentToDraft(userId, { componentId, quantity: quantity ?? 1 });
  }

  @Put(':componentId')
  async updateComponent(@Param('componentId', ParseIntPipe) componentId: number, @Body() dto: UpdateComponentPowerDto) {
    return this.service.updateInDraft(componentId, dto);
  }

  @Delete(':componentId')
  async removeComponent(@Param('componentId', ParseIntPipe) componentId: number) {
    return this.service.removeFromDraft(componentId);
  }
}