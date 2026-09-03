"use client";
import React, { useEffect, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Button from "./Button";
import Instagram3DCarousel from "./Instagram3DCarousel";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const INSTAGRAM_POSTS = [
  {
    url: "https://www.instagram.com/reel/DcTVoB4PZk6/",
    id: "DcTVoB4PZk6",
    title: "Club Investiture Ceremony",
    tag: "Leadership",
  },
  {
    url: "https://www.instagram.com/p/Db-woKOj63d/",
    id: "Db-woKOj63d",
    title: "Youth Parliament",
    tag: "Student Voice",
  },
  {
    url: "https://www.instagram.com/reel/Dbhk5sHPxFm/",
    id: "Dbhk5sHPxFm",
    title: "Friendship Day Celebrations",
    tag: "Campus Life",
  },
  {
    url: "https://www.instagram.com/p/DcDhCj8j-eA/",
    id: "DcDhCj8j-eA",
    title: "Independence Day Pride",
    tag: "Celebration",
  },
];

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processEmbeds = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = processEmbeds;
      document.body.appendChild(script);
    } else {
      processEmbeds();
    }

    const timer1 = setTimeout(processEmbeds, 600);
    const timer2 = setTimeout(processEmbeds, 1500);
    const timer3 = setTimeout(processEmbeds, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-slate-50/80 via-white to-cream/20 border-t border-cream-line relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ee2a7b]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </span>
              <span className="text-navy font-sans font-bold uppercase tracking-widest text-xs">
                Campus Buzz • @ccisjaipur
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-serif font-bold text-navy leading-tight">
              Life &amp; Moments at CCIS
            </h2>
            <p className="text-ink-muted text-sm md:text-base mt-2 max-w-xl">
              Catch daily campus life, student achievements, celebrations, and glimpses of inquiry in action.
            </p>
          </div>

          <a
            href="https://www.instagram.com/ccisjaipur"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              variant="secondary"
              size="md"
              className="rounded-2xl flex items-center gap-2.5 border-cream-line hover:border-gold shadow-sm hover:shadow-card group bg-white px-5 py-3"
            >
              <span className="font-semibold text-navy group-hover:text-gold transition-colors">
                Follow on Instagram
              </span>
              <span className="w-6 h-6 rounded-full bg-navy/5 group-hover:bg-gold/15 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-navy group-hover:text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Button>
          </a>
        </div>

        {/* Mobile 3D Coverflow Carousel (Mobile View Only) */}
        <div className="block md:hidden">
          <Instagram3DCarousel posts={INSTAGRAM_POSTS} />
        </div>

        {/* Desktop & Tablet Grid */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <div
              key={post.id}
              className="group flex flex-col bg-white rounded-3xl border border-cream-line hover:border-gold/60 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              {/* Card Header Tag */}
              <div className="px-5 py-3.5 border-b border-cream-line/60 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ee2a7b] animate-pulse" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-navy/70">
                    {post.tag}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-ink-muted/80 uppercase">
                  #{idx + 1}
                </span>
              </div>

              {/* Instagram Embed Container */}
              <div className="p-3 flex-1 flex flex-col items-center justify-start bg-white overflow-hidden min-h-[480px]">
                <blockquote
                  className="instagram-media w-full !my-0 !min-w-[240px] !max-w-full !rounded-2xl"
                  data-instgrm-permalink={`${post.url}?utm_source=ig_embed&amp;utm_campaign=loading`}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: "0",
                    borderRadius: "16px",
                    boxShadow: "none",
                    margin: "0",
                    padding: "0",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <a
                      href={`${post.url}?utm_source=ig_embed&amp;utm_campaign=loading`}
                      style={{
                        background: "#FFFFFF",
                        lineHeight: 0,
                        padding: "0 0",
                        textAlign: "center",
                        textDecoration: "none",
                        width: "100%",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <div
                          style={{
                            backgroundColor: "#F4F4F4",
                            borderRadius: "50%",
                            height: "36px",
                            marginRight: "12px",
                            width: "36px",
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: "4px",
                              height: "12px",
                              marginBottom: "6px",
                              width: "100px",
                            }}
                          />
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: "4px",
                              height: "12px",
                              width: "60px",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ padding: "19% 0" }} />
                      <div style={{ display: "block", height: "40px", margin: "0 auto 10px", width: "40px" }}>
                        <svg width="40px" height="40px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
                          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                              <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886" />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div style={{ paddingTop: "6px" }}>
                        <div
                          style={{
                            color: "#3897f0",
                            fontFamily: "Arial,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            lineHeight: "16px",
                          }}
                        >
                          View on Instagram
                        </div>
                      </div>
                    </a>
                  </div>
                </blockquote>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/70 border-t border-cream-line/60 flex items-center justify-between text-xs text-navy/70">
                <span className="font-medium truncate max-w-[170px]">{post.title}</span>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-bold flex items-center gap-1 hover:underline shrink-0"
                >
                  Watch <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
