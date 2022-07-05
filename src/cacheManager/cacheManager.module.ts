import { CacheModule, Module } from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';
import { CacheManagerService } from './cacheManager.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
    }),
  ],
  exports: [CacheManagerService],
  controllers: [],
  providers: [CacheManagerService]
})
export class CacheManagerModule {}
