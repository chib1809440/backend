import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchServiceController } from './search-service.controller';
import { SearchService } from './search-service.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        node: 'http://localhost:9200',
        auth: {
          username: 'elastic',
          password: 'admin',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SearchServiceController],
  exports: [ElasticsearchModule],
  providers: [SearchService],
})
export class SearchServiceModule {}
