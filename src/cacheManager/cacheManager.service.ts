import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache, CachingConfig } from "cache-manager";

@Injectable()
export class CacheManagerService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async get<T>(key: string): Promise<T | any> {
    return new Promise((resolve, reject) => {
      this.cacheManager.get(key, (error: any, result: T) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async set<T>(key: string, value: T, options?: CachingConfig): Promise<T> {
    return this.cacheManager.set(key, value, options);
  }

}