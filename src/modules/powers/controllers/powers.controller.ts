import { Controller, Get, Put, Delete, Param, Body, Query, ParseIntPipe, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { PowersService } from '../services/powers.service';
import { PowerCartResponseDto } from '../dto/power-cart-response';
import { PowerFiltersDto } from '../dto/power-filter.dto';
import { PowerResponseDto, PowerListResponseDto } from '../dto/power-response.dto';
import { PowerFinalizeResponseDto } from '../dto/power-finalize-response.dto';
import { UpdatePowerDto } from '../dto/update-power.dto';
import type { Request } from 'express';
import { getCurrentUserId } from '../../../current-user';

@Controller('powers')
export class PowersController {
  constructor(private readonly powersService: PowersService) {}

  @Get('cart')
  async getUserCart(@Req() req: Request): Promise<PowerCartResponseDto | null> {
    const userId = getCurrentUserId();
    return this.powersService.getUserDraftCart(userId);
  }

  @Get()
  async getAllPowers(@Query() filters: PowerFiltersDto) {
    return this.powersService.getFilteredPowers(filters);
  }

  @Get(':id')
  async getPowerById(@Param('id', ParseIntPipe) id: number): Promise<PowerResponseDto> {
    const userId = getCurrentUserId();
    return this.powersService.getPowerById(id, userId);
  }

  @Put('form')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async form(): Promise<PowerListResponseDto> {
    return this.powersService.formDraft();
  }

  @Put(':id/complete')
  async complete(@Param('id', ParseIntPipe) id: number): Promise<PowerFinalizeResponseDto> {
    return this.powersService.completePower(id);
  }

  @Put(':id')
  async updatePower(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePowerDto) {
    return this.powersService.updatePower(id, dto);
  }

  @Delete()
  async remove(): Promise<{ message: string }> {
    return this.powersService.remove();
  }
}