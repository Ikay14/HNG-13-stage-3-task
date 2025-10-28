import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'nestjs-prisma';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';


import { createCanvas } from 'canvas';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async refreshCountries() {
    try {
      const countriesResponse = await firstValueFrom(
        this.httpService.get('https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies', {
          timeout: 15000,
        })
      ).catch(() => {
        throw new HttpException(
          { error: 'External data source unavailable', details: 'Could not fetch data from restcountries.com' },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      });

      const exchangeResponse = await firstValueFrom(
        this.httpService.get('https://open.er-api.com/v6/latest/USD', {
          timeout: 15000,
        })
      ).catch(() => {
        throw new HttpException(
          { error: 'External data source unavailable', details: 'Could not fetch data from open.er-api.com' },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      });

      const countries = countriesResponse.data;
      const exchangeRates = exchangeResponse.data.rates;

      const now = new Date();

      for (const country of countries) {
        const currencyCode = country.currencies?.[0]?.code || null;
        const exchangeRate = currencyCode ? exchangeRates[currencyCode] || null : null;
        
        const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
        const estimatedGdp = exchangeRate 
          ? (country.population * randomMultiplier) / exchangeRate 
          : currencyCode ? null : 0;

        await this.prisma.country.upsert({
          where: { name: country.name },
          update: {
            capital: country.capital || null,
            region: country.region || null,
            population: country.population,
            currency_code: currencyCode,
            exchange_rate: exchangeRate,
            estimated_gdp: estimatedGdp,
            flag_url: country.flag || null,
            last_refreshed_at: now,
          },
          create: {
            name: country.name,
            capital: country.capital || null,
            region: country.region || null,
            population: country.population,
            currency_code: currencyCode,
            exchange_rate: exchangeRate,
            estimated_gdp: estimatedGdp,
            flag_url: country.flag || null,
            last_refreshed_at: now,
          },
        });
      }

      await this.prisma.systemStatus.upsert({
        where: { id: 1 },
        update: { last_refreshed_at: now },
        create: { id: 1, last_refreshed_at: now },
      });

      await this.generateSummaryImage();

      return { message: 'Countries refreshed successfully', timestamp: now };
    } catch (error) {
      this.logger.error('Error refreshing countries', error)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(region?: string, currency?: string, sort?: string) {
    const where: any = {};
    
    if (region) {
      where.region = { equals: region, mode: 'insensitive' };
    }
    
    if (currency) {
      where.currency_code = { equals: currency, mode: 'insensitive' };
    }

    let orderBy: any = {};
    if (sort === 'gdp_desc') {
      orderBy = { estimated_gdp: 'desc' };
    }

    return this.prisma.country.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
    });
  }

  async findOne(name: string) {
    const country = await this.prisma.country.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!country) {
      throw new HttpException(
        { error: 'Country not found' },
        HttpStatus.NOT_FOUND
      );
    }

    return country;
  }

  async remove(name: string) {
    const country = await this.prisma.country.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!country) {
      throw new HttpException(
        { error: 'Country not found' },
        HttpStatus.NOT_FOUND
      );
    }

    await this.prisma.country.delete({
      where: { id: country.id },
    });

    return { message: 'Country deleted successfully' };
  }

  async getStatus() {
    try {
    const count = await this.prisma.country.count();
    const status = await this.prisma.systemStatus.findFirst({
      orderBy: { last_refreshed_at: 'desc' },
    });

    return {
      total_countries: count,
      last_refreshed_at: status?.last_refreshed_at || null,
    };
    } catch (error) {
      this.logger.error('Error fetching status', error)
      throw new HttpException(
        { error: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

// HELPER METHOD FOR IMAGE GENERATION
  async generateSummaryImage() {
    const count = await this.prisma.country.count();
    const topCountries = await this.prisma.country.findMany({
      where: { estimated_gdp: { not: null } },
      orderBy: { estimated_gdp: 'desc' },
      take: 5,
    });
    const status = await this.prisma.systemStatus.findUnique({
      where: { id: 1 },
    });

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('Country Summary Report', 50, 60);

    ctx.font = '24px Arial';
    ctx.fillText(`Total Countries: ${count}`, 50, 120);

    ctx.font = 'bold 26px Arial';
    ctx.fillText('Top 5 Countries by GDP:', 50, 180);

    ctx.font = '20px Arial';
    let yPos = 220;
    topCountries.forEach((country, index) => {
      const gdp = country.estimated_gdp 
        ? country.estimated_gdp.toLocaleString('en-US', { maximumFractionDigits: 2 })
        : 'N/A';
      ctx.fillText(`${index + 1}. ${country.name}: $${gdp}`, 70, yPos);
      yPos += 40;
    });

    ctx.font = '18px Arial';
    ctx.fillStyle = '#aaaaaa';
    const timestamp = status?.last_refreshed_at 
      ? new Date(status.last_refreshed_at).toISOString()
      : new Date().toISOString();
    ctx.fillText(`Last Refreshed: ${timestamp}`, 50, 550);

    const cacheDir = path.join(process.cwd(), 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(cacheDir, 'summary.png'), buffer);
  }

  getImagePath(): string {
    return path.join(process.cwd(), 'cache', 'summary.png');
  }
}
