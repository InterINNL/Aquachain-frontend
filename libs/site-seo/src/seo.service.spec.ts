import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { SEO_SITE_CONFIG, SITE_ORIGIN } from './seo.constants';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  it('sets title and canonical from route data', () => {
    const events = new Subject<NavigationEnd>();
    const leafRoute = {
      firstChild: null,
      snapshot: {
        data: {
          title: 'Demo page | InterINNL',
          description: 'Demo description for SEO.',
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Title,
        Meta,
        {
          provide: Router,
          useValue: {
            events: events.asObservable(),
            url: '/demo',
          },
        },
        {
          provide: ActivatedRoute,
          useValue: leafRoute,
        },
        {
          provide: SEO_SITE_CONFIG,
          useValue: {
            siteName: 'InterINNL',
            canonicalBase: SITE_ORIGIN,
            defaultTitle: 'InterINNL',
            defaultDescription: 'Default description.',
          },
        },
      ],
    });

    const seo = TestBed.inject(SeoService);
    const title = TestBed.inject(Title);
    const doc = TestBed.inject(DOCUMENT);

    seo.init();
    events.next(new NavigationEnd(1, '/demo', '/demo'));

    expect(title.getTitle()).toBe('Demo page | InterINNL');
    expect(doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE_ORIGIN}/demo`,
    );
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(
      'Demo description for SEO.',
    );
  });
});
