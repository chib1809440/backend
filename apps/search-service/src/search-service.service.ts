/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createProduct(product: any) {
    console.log('🚀 ~ SearchService ~ createProduct ~ product:', product);
    await this.elasticsearchService.index({
      index: 'products',
      id: product.id,
      body: product,
    });
  }

  async search(keyword: string) {
    const res = await this.elasticsearchService.search({
      index: 'products',
      body: {
        query: {
          match_phrase_prefix: {
            name: keyword,
          },
        },
      },
    });
    console.log('🚀 ~ SearchService ~ search ~ res:', res);

    return res.body.hits.hits.map((hit) => hit._source);
  }
}
