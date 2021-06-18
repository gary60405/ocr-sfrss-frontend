import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  backdaysNum = -5; // 預設的過去回推天數
  // baseUrl = 'http://chuntengtech.com.tw/api/';
  baseUrl = 'http://localhost:5031/';
}
