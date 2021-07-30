import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CloudData } from 'angular-tag-cloud-module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Computer, KeywordUser, QueryImageInfo, SelectedComputer, UserData } from '../models';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root',
})
export class ComputersService {

  constructor(private httpClient: HttpClient,
              private global: Globals) {}

  fetchAllkeyword(
    userQueryText: string,
    userQueryType: string,
    startDatetime: string,
    stopDatetime: string,
    backdays: number): Observable<CloudData[]> {
    const body = { userQueryText, userQueryType, startDatetime, stopDatetime, backdays };
    return this.httpClient.post<CloudData[]>(this.global.baseUrl + 'get_all_keyword', body, {responseType: 'json'});
  }

  fetchUserdata(userQueryType: string) {
    const body = { userQueryType };
    return this.httpClient.post<{data: string[]}>(this.global.baseUrl + 'get_userdata', body, {responseType: 'json'})
                .pipe(map((jsonData => jsonData.data)));
  }

  fetchKeywordUser(startDatetime: string, stopDatetime: string, backdays: number, rawtextQueryText: string): Observable<KeywordUser[]> {
    const body = { startDatetime, stopDatetime, backdays, rawtextQueryText };
    return this.httpClient.post<{data: KeywordUser[]}>(this.global.baseUrl + 'get_keyword_user', body, {responseType: 'json'})
                .pipe(map((jsonData => jsonData.data)));
  }

  fetchImageInfoData(
      backdays: number,
      startDatetime: string | null,
      stopDatetime: string | null,
      userQueryText: string | null,
      userQueryType: string | null,
      orQueryText: string[] | null,
      andQueryText: string[] | null,
      notQueryText: string[] | null,
      )
    : Observable<QueryImageInfo> {
    const body = { backdays, startDatetime, stopDatetime, userQueryText, userQueryType, orQueryText, andQueryText, notQueryText };
    console.log(body);
    const response = this.httpClient.post<QueryImageInfo>(this.global.baseUrl + 'get_image_info', body,  {responseType: 'json'});
    return response;
  }

}
