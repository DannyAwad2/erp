import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  cache: any = {};

  // set the cache
  setCache(key: string, value: any) {
    this.cache[key] = value;
  }

  // get the cache
  getCache(key: string) {
    return this.cache[key];
  }

  // clear the cache
  clearCache(key: string) {
    this.cache[key] = null;
  }

  // clear all cache
  clearAllCache() {
    this.cache = {};
  }
}
