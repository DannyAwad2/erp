import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  cache: any = {};

  // set the cache
  set(key: string, value: any) {
    this.cache[key] = value;
  }

  // get the cache
  get(key: string) {
    return this.cache[key];
  }

  // clear the cache
  clear(key: string) {
    this.cache[key] = null;
  }

  // clear all cache
  clearAll() {
    this.cache = {};
  }
}
