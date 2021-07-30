import { SafeHtml } from '@angular/platform-browser';
import { CloudData } from 'angular-tag-cloud-module';

export interface Computer {
  id: string; // 工號
  name: string; // 員工名稱
  computer_id: string; // 所屬電腦id
  ase_id: string; // ASEID
  department_id: string; // 所屬部門id
}

export interface SelectedComputer {
  id: string; // 工號
  name: string; // 員工名稱
  computer_id: string; // 所屬電腦id
  ase_id: string; // ASEID
  department_id: string; // 所屬部門id
  start_datetime: string; // 資料時間範圍的起始時間
  stop_datetime: string; // 資料時間範圍的終止時間
  address: string[]; // 所屬截圖
  keywords: CloudData[]; // 圖片中出現的ase關鍵字與字頻
  wordlist: CloudData[]; // 圖片中所辨識出來的字與字頻
  rawtext: string[]; // 截圖對應的字
  rawtextQueryText: string[]; // 欲查詢的字詞集合
}

export interface QueryTimeInfo {
  start_date: string | Date;
  start_time: string | Date;
  stop_date: string | Date;
  stop_time: string | Date;
}

export interface QueryImageInfo {
  start_datetime: string; // 資料時間範圍的起始時間
  stop_datetime: string; // 資料時間範圍的終止時間
  imageInfo: ImageInfo[];
}

export interface ImageInfo {
  date: string;
  time: string;
  user: Computer;
  address: string;
  keywords: CloudData[] | string;
  wordlist: CloudData[] | string;
  rawtext: string;
}

export interface DialogInfo {
  address: string;
  keywords: CloudData[];
  wordlist: CloudData[];
  rawtext: SafeHtml;
}

export interface KeywordUser {
  computer_id: string;
  id: string;
  name: string;
  ase_id: string;
  department_id: string;
  datetime: string;
  address: string;
}

export interface DatetimeRange {
  start_datetime: string;
  stop_datetime: string;
}

export interface UserData {
  id: string[];
  name: string[];
  ase_id: string[];
  department_id: string[];
  computer_id: string[];
}

export interface AlertContent {
  display: boolean;
  colorClass: string;
  content: string;
}
