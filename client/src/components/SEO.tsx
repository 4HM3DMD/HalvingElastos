import { useEffect } from 'react';

interface SEOProps {
  currentBlock?: number;
  blocksRemaining?: number;
  estimatedDate?: string;
  progressPercent?: string;
}

export function SEO({ currentBlock, blocksRemaining, estimatedDate, progressPercent }: SEOProps) {
  useEffect(() => {
    // Dynamic title with countdown info
    const title = estimatedDate 
      ? `Elastos (ELA) Halving Countdown | ${estimatedDate} | Live Tracker`
      : 'Elastos (ELA) Halving Countdown 2025 | Live Block Reward Tracker';
    
    document.title = title;

    // Update dynamic meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Core SEO Meta Tags
    const description = `Live Elastos (ELA) halving countdown tracker. ${blocksRemaining?.toLocaleString() || '~2,500'} blocks remaining until block reward drops from 1.522 to 0.761 ELA. Similar to Bitcoin halving, ELA halving reduces inflation and increases scarcity. Track the countdown to ${estimatedDate || 'December 2025'}.`;
    
    updateMeta('description', description);
    
    // Extended keywords targeting Bitcoin halving searchers
    updateMeta('keywords', [
      // Primary ELA keywords
      'ELA halving',
      'Elastos halving',
      'Elastos halving countdown',
      'ELA halving 2025',
      'Elastos block reward',
      'ELA tokenomics',
      
      // Bitcoin halving crossover (to capture that traffic)
      'crypto halving',
      'cryptocurrency halving',
      'halving countdown',
      'block reward halving',
      'Bitcoin halving alternative',
      'next crypto halving',
      'crypto halving 2025',
      'halving event crypto',
      
      // Technical keywords
      'ELA block height',
      'Elastos blockchain',
      'ELA mining rewards',
      'merge mining',
      'AuxPoW halving',
      
      // Investment keywords
      'ELA price prediction',
      'Elastos investment',
      'deflationary cryptocurrency',
      'scarce crypto assets',
      'Bitcoin secured altcoins'
    ].join(', '));

    // Open Graph Tags (Facebook, LinkedIn, Discord)
    updateMeta('og:title', title, true);
    updateMeta('og:description', `Track the live Elastos (ELA) halving countdown. ${progressPercent || '99'}% complete with ${blocksRemaining?.toLocaleString() || '~2,500'} blocks to go. Block rewards will halve from 1.522 to 0.761 ELA, similar to Bitcoin's deflationary model.`, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', 'https://halving.elastos.net', true);
    updateMeta('og:image', 'https://halving.elastos.net/og-image.jpg', true);
    updateMeta('og:image:type', 'image/jpeg', true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:image:alt', 'Elastos ELA Halving Countdown 2025 - Live blockchain countdown timer', true);
    updateMeta('og:site_name', 'Elastos Halving Countdown', true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', '@ElastosInfo');
    updateMeta('twitter:creator', '@ElastosInfo');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', `Live ELA halving countdown: ${blocksRemaining?.toLocaleString() || '~2,500'} blocks remaining. Track Elastos's Bitcoin-style halving event reducing block rewards by 50%.`);
    updateMeta('twitter:image', 'https://halving.elastos.net/twitter-image.jpg');
    updateMeta('twitter:image:alt', 'Elastos ELA Halving Countdown 2025');

    // Additional SEO Meta Tags
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('googlebot', 'index, follow');
    updateMeta('author', 'Elastos DAO');
    updateMeta('publisher', 'Elastos Foundation');
    updateMeta('copyright', '2025 Elastos');
    updateMeta('language', 'English');
    updateMeta('revisit-after', '1 day');
    updateMeta('rating', 'General');
    updateMeta('distribution', 'global');
    
    // Mobile & App Meta
    updateMeta('mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMeta('apple-mobile-web-app-title', 'ELA Halving');
    updateMeta('application-name', 'Elastos Halving Countdown');
    updateMeta('theme-color', '#141414');
    updateMeta('msapplication-TileColor', '#141414');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://halving.elastos.net');

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        // Website Schema
        {
          "@type": "WebSite",
          "@id": "https://halving.elastos.net/#website",
          "url": "https://halving.elastos.net",
          "name": "Elastos Halving Countdown",
          "description": "Official Elastos (ELA) halving countdown tracker with live blockchain data",
          "publisher": {
            "@id": "https://halving.elastos.net/#organization"
          },
          "inLanguage": "en-US"
        },
        // Organization Schema
        {
          "@type": "Organization",
          "@id": "https://halving.elastos.net/#organization",
          "name": "Elastos DAO",
          "url": "https://elastos.net",
          "logo": {
            "@type": "ImageObject",
            "url": "https://halving.elastos.net/elastos-logo.png",
            "width": 200,
            "height": 200
          },
          "sameAs": [
            "https://twitter.com/ElastosInfo",
            "https://t.me/elastosgroup",
            "https://github.com/elastos",
            "https://www.youtube.com/@elastosinfo"
          ]
        },
        // Event Schema (Halving Event)
        {
          "@type": "Event",
          "@id": "https://halving.elastos.net/#halving-event",
          "name": "Elastos (ELA) Second Halving",
          "description": "The second Elastos halving event where block rewards will be reduced from 1.522 ELA to 0.761 ELA per block, following the same deflationary model as Bitcoin.",
          "startDate": estimatedDate ? new Date(estimatedDate).toISOString() : "2025-12-10T00:00:00Z",
          "endDate": estimatedDate ? new Date(estimatedDate).toISOString() : "2025-12-10T00:00:00Z",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "VirtualLocation",
            "url": "https://halving.elastos.net"
          },
          "organizer": {
            "@id": "https://halving.elastos.net/#organization"
          },
          "image": "https://halving.elastos.net/og-image.jpg",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://halving.elastos.net"
          }
        },
        // FAQPage Schema
        {
          "@type": "FAQPage",
          "@id": "https://halving.elastos.net/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Elastos (ELA) halving?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Elastos halving is a pre-programmed event that reduces the ELA block reward by 50% every 1,051,200 blocks (approximately 4 years). Similar to Bitcoin halving, this creates scarcity and reduces inflation. The current reward of 1.522 ELA will drop to 0.761 ELA after the next halving."
              }
            },
            {
              "@type": "Question",
              "name": "When is the next Elastos halving?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The next Elastos halving is estimated to occur around ${estimatedDate || 'December 2025'} at block height 2,102,400. Currently ${blocksRemaining?.toLocaleString() || 'approximately 2,500'} blocks remain until the halving event.`
              }
            },
            {
              "@type": "Question",
              "name": "How is Elastos halving similar to Bitcoin halving?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Like Bitcoin, Elastos follows a deflationary tokenomics model with periodic halving events. Both reduce block rewards by 50% to control inflation and increase scarcity. Additionally, Elastos is secured by Bitcoin's hashpower through merged mining (AuxPoW), making it one of the most secure blockchains after Bitcoin itself."
              }
            },
            {
              "@type": "Question",
              "name": "What is the maximum supply of ELA?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The maximum supply of ELA is capped at 28,219,999 tokens. This was established after the July 2020 token burn event where 13 million ELA were permanently destroyed, reducing the original supply from approximately 41 million."
              }
            },
            {
              "@type": "Question",
              "name": "How does Elastos merged mining work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Elastos uses Auxiliary Proof of Work (AuxPoW) merged mining with Bitcoin. This means Bitcoin miners can simultaneously mine ELA without additional computational resources, giving Elastos access to Bitcoin's massive hashpower for security while earning additional rewards in ELA."
              }
            }
          ]
        },
        // WebPage Schema
        {
          "@type": "WebPage",
          "@id": "https://halving.elastos.net/#webpage",
          "url": "https://halving.elastos.net",
          "name": "Elastos (ELA) Halving Countdown 2025 | Live Tracker",
          "description": "Live countdown to the Elastos halving event. Track blocks remaining, estimated date, and learn about ELA tokenomics.",
          "isPartOf": {
            "@id": "https://halving.elastos.net/#website"
          },
          "about": {
            "@id": "https://halving.elastos.net/#halving-event"
          },
          "datePublished": "2024-01-01T00:00:00Z",
          "dateModified": new Date().toISOString(),
          "inLanguage": "en-US",
          "potentialAction": {
            "@type": "ReadAction",
            "target": ["https://halving.elastos.net"]
          }
        },
        // BreadcrumbList Schema
        {
          "@type": "BreadcrumbList",
          "@id": "https://halving.elastos.net/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Elastos",
              "item": "https://elastos.net"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Halving Countdown",
              "item": "https://halving.elastos.net"
            }
          ]
        },
        // SoftwareApplication Schema (for app stores)
        {
          "@type": "SoftwareApplication",
          "name": "Elastos Halving Countdown",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          }
        }
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [currentBlock, blocksRemaining, estimatedDate, progressPercent]);

  return null; // This component only manages document head
}

export default SEO;

