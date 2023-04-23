import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Gfycat, GfycatResponse, TaggedVideo } from './gfycat-response';

const BAD_TAGS = [
  'fail',
  'disappointment',
  'sad',
  'unhappy',
  'frustrated',
  'angry',
  'upset',
  'displeased',
  'letdown',
  'bummed',
  'disheartened',
  'discouraged',
  'miserable',
  'heartbroken',
  'dejected',
  'devastated',
  'crushed',
  'despondent',
  'gloomy',
  'dismal',
];
const GOOD_TAGS = [
  'success',
  'happy',
  'satisfied',
  'content',
  'pleased',
  'joyful',
  'delighted',
  'thrilled',
  'excited',
  'cheerful',
  'grateful',
  'optimistic',
  'hopeful',
  'elated',
  'overjoyed',
  'ecstatic',
  'euphoric',
  'blissful',
];
const PERFECT_TAGS = [
  'amazing',
  'fantastic',
  'excellent',
  'outstanding',
  'superb',
  'incredible',
  'awesome',
  'impressive',
  'flawless',
  'marvelous',
  'stunning',
  'spectacular',
  'wonderful',
  'magnificent',
  'glorious',
];
const NEUTRAL_TAGS = [
  'okay',
  'average',
  'fair',
  'indifferent',
  'meh',
  'so-so',
  'mediocre',
  'unremarkable',
  'ordinary',
  'commonplace',
];

@Injectable({
  providedIn: 'root',
})
export class GfycatService {
  constructor(private http: HttpClient) {}

  private tags(score: number, max: number): Array<string> {
    if (score > max * 0.99) {
      return PERFECT_TAGS;
    } else if (score >= max * 0.9) {
      return GOOD_TAGS;
    } else if (score < max * 0.1) {
      return BAD_TAGS;
    }
    return NEUTRAL_TAGS;
  }

  fetchGifForScore(score: number, max: number): Observable<TaggedVideo> {
    const tag = this.random(this.tags(score, max));
    return this.fetchGifForTag(tag).pipe(
      map((video) => ({
        src: video.webmUrl,
        tag: video.title && video.title.trim().length != 0 ? video.title : tag,
      }))
    );
  }

  fetchGifForTag(tag: string): Observable<Gfycat> {
    const url = `https://api.gfycat.com/v1/gfycats/search?search_text=${tag}`;
    return this.http
      .get<GfycatResponse>(url)
      .pipe(map((r) => this.random<Gfycat>(r.gfycats)));
  }

  private random<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
