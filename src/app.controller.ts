import { Controller, Get, Post, Delete, Param, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from 'fs';


@Controller('countries')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('refresh')
  async refresh() {
    return this.appService.refreshCountries();
  }

  @Get()
  async findAll(
    @Query('region') region?: string,
    @Query('currency') currency?: string,
    @Query('sort') sort?: string,
  ) {
    return this.appService.findAll(region, currency, sort);
  }

    @Get('status')
    async getStatus() {
    return this.appService.getStatus();
  }

  @Get('image')
  async getImage(@Res() res: Response) {
    const imagePath = this.appService.getImagePath();
    
    if (!fs.existsSync(imagePath)) {
      throw new HttpException(
        { error: 'Summary image not found' },
        HttpStatus.NOT_FOUND
      );
    }

    res.sendFile(imagePath);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.appService.findOne(name);
  }

  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.appService.remove(name);
  }

}


