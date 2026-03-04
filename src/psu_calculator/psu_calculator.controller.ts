import { Controller, Get, Post, Param, Render, Body } from '@nestjs/common';

type Component = {
  id: number;
  title: string;
  type: string;
  image: string;
  video: string;
  tdp_typical: number;
  tdp_up: number;
  description: string;  

};

@Controller()
export class PsuCalculatorController {
  private components: Component[] = [
    {
        id: 1,
        title: 'Процессор Intel Core i5-14600K OEM',
        type: 'CPU',
        image: 'components/component-logo_1.png',
        video: 'video.mp4',
        tdp_typical: 125,
        tdp_up: 181,
        description: '14-ядерный процессор Intel Core i5-14600K OEM рассчитан на оснащение игровых и мощных универсальных системных блоков. Модель имеет 6 производительных и 8 энергоэффективных ядер. Последние снижают энергопотребление CPU при работе с невысокой нагрузкой. Базовая частота процессора равна 3.5 ГГц, а максимальная частота в турборежиме – 5.3 ГГц.'
    },
    {
        id: 2,
        title: 'Видеокарта GIGABYTE GeForce RTX 4070 WINDFORCE OC 12G',
        type: 'GPU',
        image: 'components/component-logo_2.png',
        video: 'video.mp4',
        tdp_typical: 200,
        tdp_up: 245,
        description: 'Видеокарта GIGABYTE GeForce RTX 4070 WINDFORCE OC 12G [GV-N4070WF3OC-12GD] позволяет создать систему для работы с графикой и погружения в виртуальный игровой мир. Она содержит архитектуру Ada Lovelace с технологией NVIDIA DLSS 3 и трассировкой лучей, что обеспечивает детализацию, плавность и насыщенность изображения. В модели реализована возможность разгона частоты процессора до 2490 МГц.'
    },
    {
        id: 3,
        title: 'Оперативная память Kingston FURY Beast Black 16 GB 5200',
        type: 'RAM',
        image: 'components/component-logo_3.png',
        video: 'video.mp4',
        tdp_typical: 8,
        tdp_up: 8,
        description: 'Оперативная память Kingston FURY Beast Black поколения DDR5 разработана с учетом требований игровых систем. Она обеспечивает быстродействие при обработке требовательных ресурсов и стабильность в процессе эксплуатации. Набор представлен двумя модулями объемом 8 ГБ каждый, которые работают с частотой 5200 МГц. Поддержка Intel (XMP) 3.0 позволяет с удобством выполнять разгон аппаратной платформы. Алюминиевый ребристый радиатор способствует быстрому отведению тепла и помогает предотвратить перегрев чипов Kingston FURY Beast Black. Интегрированная микросхема управления питанием и технология коррекции ошибок ECC гарантируют надежность оперативной памяти.'
    },
    {
        id: 4,
        title: 'Процессор AMD Ryzen 7 5800X OEM',
        type: 'CPU',
        image: 'components/component-logo_4.png',
        video: '  ',
        tdp_typical: 105,
        tdp_up: 105,
        description: 'Процессор AMD Ryzen 7 5800X OEM подходит для установки в игровые и рабочие ПК. Его 8-ядерная архитектура Zen 3, выполненная на 7-нм техпроцессе, предусматривает большой объем кэш-памяти L3 (32 МБ), 16-поточную обработку данных и низкое энергопотребление. Ядра работают с тактовой частотой 3.8-4.7 ГГц, что исключает зависания системы. Поддержка свободного множителя обеспечивает возможность увеличить частоту до более высокого значения, что положительно сказывается на производительности.'
    },
    {
        id: 5,
        title: 'Видеокарта GIGABYTE GeForce RTX 3060 WINDFORCE OC 12G',
        type: 'GPU',
        image: 'components/component-logo_5.png',
        video: 'video.mp4',
        tdp_typical: 155,
        tdp_up: 170,
        description: 'Видеокарта GIGABYTE GeForce RTX 3060 WINDFORCE OC обеспечивает высокую графическую производительность, стабильное охлаждение и надежность в эксплуатации. Она разработана для использования в составе игровых и других требовательных ПК. В графическом адаптере с архитектурой NVIDIA Ampere задействованы 12 ГБ памяти стандарта GDDR6 и процессор с частотой до 1792 МГц в режиме разгона.'
    },
    {
        id: 6,
        title: 'Накопитель 1000 ГБ M.2 NVMe Kingston NV3',
        type: 'SSD',
        image: 'components/component-logo_6.png',
        video: 'video.mp4',
        tdp_typical: 5,
        tdp_up: 12,
        description: 'SSD-накопитель Kingston NV3 SNV3S/1000G 1ТБ обеспечивает быстрый запуск системы, плавную работу приложений, стабильную скорость чтения и записи и экономит время при обработке файлов. Незаменим для ускорения работы компьютера и надёжного хранения данных.'
    }
    ];

  @Get('components')
  @Render('components')
  getComponents() {
    return {
      title: 'Список компонентов',
      data: {
        components: this.components,
      },
    };
  }

  @Post('components')
  @Render('components')
  async searchComponents(@Body() body: { query?: string }) {
    const query = body?.query || '';
    let components: Component[];

    if (query && query.trim()) {
      const searchQuery = query.toLowerCase();
      components = this.components.filter(component =>
        component.title.toLowerCase().includes(searchQuery) || 
        component.type.toLowerCase().includes(searchQuery),
      );
    } else {
      components = this.components;
    }

    return {
      title: 'Список компонентов',
      data: {
        current_date: new Date().toLocaleDateString(),
        components: components,
        query: query || '',
      },
    };
  }

  @Get('component/:id')
  @Render('component')
  getComponent(@Param('id') id: string) {
    const component = this.components.find(o => o.id === Number(id));
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
  getResult() {
    return{
      data: {
      components: [
        this.components[1],
        this.components[2],
      ],
      },
    }
  }

}