#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.error('❌ Please provide module name');
  process.exit(1);
}

const pascal = name.charAt(0).toUpperCase() + name.slice(1);
const baseDir = path.join(__dirname, '..', 'src', 'modules', name);

if (fs.existsSync(baseDir)) {
  console.error(`❌ Module "${name}" already exists`);
  process.exit(1);
}

// ---------- HELPERS ----------
const write = (file, content) => {
  fs.writeFileSync(file, content.trimStart());
};

const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true });

// ---------- STRUCTURE ----------
mkdir(baseDir);

[
  'application/usecases',
  'application/dtos',
  'domain/entities',
  'domain/events',
  'domain/repositories',
  'infrastructure/persistence',
  'presentation',
].forEach((d) => mkdir(path.join(baseDir, d)));

// ---------- DOMAIN ----------
write(
  path.join(baseDir, 'domain/entities', `${name}.entity.ts`),
  `
export class ${pascal} {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}
}
`,
);

write(
  path.join(baseDir, 'domain/events', `${name}-created.domain-event.ts`),
  `
export class ${pascal}CreatedDomainEvent {
  constructor(public readonly id: string) {}
}
`,
);

write(
  path.join(baseDir, 'domain/repositories', `${name}.repository.ts`),
  `
import { ${pascal} } from '../entities/${name}.entity';

export abstract class ${pascal}Repository {
  abstract save(entity: ${pascal}): Promise<void>;
}
`,
);

// ---------- APPLICATION ----------
write(
  path.join(baseDir, 'application/usecases', `create-${name}.usecase.ts`),
  `
import { ${pascal}Repository } from '../../domain/repositories/${name}.repository';
import { ${pascal} } from '../../domain/entities/${name}.entity';

export class Create${pascal}UseCase {
  constructor(
    private readonly repo: ${pascal}Repository,
  ) {}

  async execute(name: string) {
    const entity = new ${pascal}(
      crypto.randomUUID(),
      name,
    );

    await this.repo.save(entity);

    return entity;
  }
}
`,
);

write(
  path.join(baseDir, 'application/dtos', `create-${name}.dto.ts`),
  `
export class Create${pascal}Dto {
  name: string;
}
`,
);

write(
  path.join(baseDir, 'application', 'application.module.ts'),
  `
import { Module } from '@nestjs/common';
import { Create${pascal}UseCase } from './usecases/create-${name}.usecase';

@Module({
  providers: [Create${pascal}UseCase],
  exports: [Create${pascal}UseCase],
})
export class ${pascal}ApplicationModule {}
`,
);

// ---------- INFRA ----------
write(
  path.join(
    baseDir,
    'infrastructure/persistence',
    `${name}.prisma.repository.ts`,
  ),
  `
import { ${pascal}Repository } from '../../domain/repositories/${name}.repository';
import { ${pascal} } from '../../domain/entities/${name}.entity';

export class ${pascal}PrismaRepository
  implements ${pascal}Repository
{
  async save(entity: ${pascal}): Promise<void> {
    console.log('[DB] Saving ${name}:', entity);
  }
}
`,
);

// ---------- PRESENTATION ----------
write(
  path.join(baseDir, 'presentation', `${name}.controller.ts`),
  `
import { Body, Controller, Post } from '@nestjs/common';
import { Create${pascal}UseCase } from '../application/usecases/create-${name}.usecase';
import { Create${pascal}Dto } from '../application/dtos/create-${name}.dto';

@Controller('${name}s')
export class ${pascal}Controller {
  constructor(
    private readonly create${pascal}: Create${pascal}UseCase,
  ) {}

  @Post()
  create(@Body() dto: Create${pascal}Dto) {
    return this.create${pascal}.execute(dto.name);
  }
}
`,
);

// ---------- MODULE ----------
write(
  path.join(baseDir, `${name}.module.ts`),
  `
import { Module } from '@nestjs/common';
import { ${pascal}Controller } from './presentation/${name}.controller';
import { ${pascal}ApplicationModule } from './application/application.module';
import { ${pascal}Repository } from './domain/repositories/${name}.repository';
import { ${pascal}PrismaRepository } from './infrastructure/persistence/${name}.prisma.repository';

@Module({
  imports: [${pascal}ApplicationModule],
  controllers: [${pascal}Controller],
  providers: [
    {
      provide: ${pascal}Repository,
      useClass: ${pascal}PrismaRepository,
    },
  ],
})
export class ${pascal}Module {}
`,
);

// ---------- DONE ----------
console.log(`✅ DDD module "${name}" generated successfully`);
