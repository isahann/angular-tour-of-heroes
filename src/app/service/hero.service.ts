import { Injectable } from '@angular/core';
import { Hero } from '../class/hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesURL = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/json'}
    )
  }

  constructor(private messageService: MessageService, private http: HttpClient) {
  }

  // Methods

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL, hero, this.httpOptions)
    .pipe(
      tap((newHero: Hero) => this.log(`Added hero with id ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesURL, hero, this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated hero with id ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesURL}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`Deleted hero with id ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesURL)
    .pipe(
      tap(_ => this.log('Fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    // this.messageService.add(`HeroService fetched hero with id=${id} successfully.`);
    // return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesURL}/${id}`;
    return this.http.get<Hero>(url)
    .pipe(
      tap(_ => this.log(`Fetched hero with id ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  getHeroNo404<Data>(id: number): Observable<Hero> {
   const url = `${this.heroesURL}/?id=${id}`;
   return this.http.get<Hero[]>(url)
     .pipe(
       map(heroes => heroes[0]), // returns a {0|1} element array
       tap(h => {
         const outcome = h ? `fetched` : `did not find`;
         this.log(`${outcome} hero id=${id}`);
       }),
       catchError(this.handleError<Hero>(`getHero id=${id}`))
     );
 }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`)
    .pipe(
      tap(_ => this.log(`Found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

  // Helpers

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
