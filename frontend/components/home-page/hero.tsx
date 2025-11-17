"use client";
import { Button } from "@/components/common/button";
import { GetFeaturedExplore } from "@/features/slicer/AdSlice";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface Slide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  image: string;
  alt: string;
}

const BusinessDiscoveryCarousel: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("carousel");
  const isRTL = locale === "ar";

  const slides: Slide[] = [
    {
      id: 1,
      titleKey: "slide1.title",
      subtitleKey: "slide1.subtitle",
      image: "/hero1.png",
      alt: t("slide1.alt"),
    },
    {
      id: 2,
      titleKey: "slide2.title",
      subtitleKey: "slide2.subtitle",
      image: "/hero2.png",
      alt: t("slide2.alt"),
    },
    {
      id: 3,
      titleKey: "slide3.title",
      subtitleKey: "slide3.subtitle",
      image: "/hero3.png",
      alt: t("slide3.alt"),
    },
  ];

  return (
    <div className="max-w-[1440px] w-full bg-white border-b border-grey-5">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .carousel-container {
          min-height: 400px;
          max-height: 550px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
          max-width:1440px
          width: 100%;
        }

        @media (min-width: 480px) {
          .carousel-container {
            padding: 2rem 1.5rem;
            min-height: 450px;
          }
        }

        @media (min-width: 768px) {
          .carousel-container {
            padding: 1rem 2rem;
            max-height: 380px;
          }
        }

        @media (min-width: 1024px) {
          .carousel-container {
            padding: 2rem 2.5rem;
            max-height: 3800px;
          }
        }

        @media (min-width: 1280px) {
          .carousel-container {
            padding: 1rem 4rem;
            max-height: 380px;
          }
        }

        .carousel-section {
          display: grid;
          max-width: 1200px;
          width: 100%;
          font-family: 'Inter';
          color: #111;
          direction: ${isRTL ? "rtl" : "ltr"};
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Layout - Single Column */
        @media (max-width: 767px) {
          .carousel-section {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            text-align: center;
            gap: 1rem;
            max-width: 100%;
          }
        }

        /* Tablet and Desktop Layout - Two Columns */
        @media (min-width: 768px) {
          .carousel-section {
            grid-template-columns: 1fr minmax(300px, 500px);
            grid-template-rows: auto;
            gap: 1rem 2rem;
            align-items: start;
          }
        }

        @media (min-width: 1024px) {
          .carousel-section {
            grid-template-columns: 1fr minmax(400px, 600px);
            gap: 1rem 1rem;
          }
        }

        @media (min-width: 1280px) {
          .carousel-section {
            gap: 1rem 1rem;
          }
        }

        .carousel-content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 200px;
          width: 100%;
        }

        @media (max-width: 767px) {
          .carousel-content {
            grid-area: 1 / 1 / 2 / 2;
            text-align: center;
            min-height: 150px;
          }
        }

        @media (min-width: 768px) {
          .carousel-content {
            grid-area: 1 / 1 / 2 / 2;
            text-align: ${isRTL ? "right" : "left"};
            justify-content: flex-start;
            align-items: flex-start;
            min-height: auto;
            max-width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .carousel-content {
            min-height: auto;
          }
        }

        .text-wrapper {
          display: grid;
          position: relative;
          width: 100%;
        }

        .content-item {
          opacity: 0;
          animation: contentCycle 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform: translateY(20px);
          grid-area: 1 / 1;
        }

        .content-item:nth-child(1) { animation-delay: 0s; }
        .content-item:nth-child(2) { animation-delay: 3s; }
        .content-item:nth-child(3) { animation-delay: 6s; }
        
        .carousel-title {
          font-size: 1.75rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          background: linear-gradient(to right, #762C85, #e71e86);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: ${isRTL ? "'Cairo', 'Inter'" : "'Inter'"};
        }

        @media (min-width: 480px) {
          .carousel-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
        }
        
        @media (min-width: 768px) {
          .carousel-title {
            font-size: 2.25rem;
            margin-bottom: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .carousel-title {
            font-size: 2.75rem;
            margin-bottom: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .carousel-title {
            font-size: 3rem;
          }
        }
        
        .carousel-description {
          font-size: 1rem;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-family: ${
            isRTL ? "'Cairo', 'Inter', sans-serif" : "'Inter', sans-serif"
          };
        }

        @media (min-width: 480px) {
          .carousel-description {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }
        }

        @media (min-width: 768px) {
          .carousel-description {
            font-size: 1.125rem;
            margin-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .carousel-description {
            font-size: 1.25rem;
          }
        }
        
       .carousel-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          flex-wrap: wrap;
          margin-top: auto;
          justify-content: flex-start;
        }

        @media (min-width: 768px) {
          .carousel-buttons {
            margin-top: 0.625rem;
          }
        }

        @media (max-width: 767px) {
          .carousel-buttons {
            justify-content: center;
          }
        }

        @media (min-width: 480px) {
          .carousel-buttons {
            gap: 1.5rem;
            flex-wrap: nowrap;
          }
        }

        @media (max-width: 768px) {
          .carousel-buttons {
          display:none;
          }
        }
        
        .carousel-images {
          position: relative;
          perspective: 1000px;
          margin: 0 auto;
          width: 100%;
          max-width: 350px;
          height: 200px;
        }

        @media (max-width: 767px) {
          .carousel-images {
            grid-area: 2 / 1 / 3 / 2;
            max-width: 320px;
            height: 180px;
          }
        }

        @media (min-width: 480px) and (max-width: 767px) {
          .carousel-images {
            max-width: 380px;
            height: 220px;
          }
        }

        @media (min-width: 768px) {
          .carousel-images {
            grid-area: 1 / 2 / 2 / 3;
            max-width: 400px;
            height: 240px;
            margin: ${isRTL ? "0 auto 0 0" : "0 0 0 auto"};
          }
        }

        @media (min-width: 1024px) {
          .carousel-images {
            max-width: 480px;
            height: 280px;
          }
        }

        @media (min-width: 1280px) {
          .carousel-images {
            max-width: 520px;
            height: 320px;
          }
        }

        .mobile-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          width: 100%;
        }

        @media (max-width: 767px) {
          .mobile-buttons {
            grid-area: 3 / 1 / 4 / 2;
            margin-top: 1rem;
            padding-top: 1rem;
          }
        }

        @media (min-width: 768px) {
          .mobile-buttons {
            display: none;
          }
        }

        .carousel-article {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          border: solid 2px rgba(139, 92, 246, 0.3);
          animation: cardCycle 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          backdrop-filter: blur(10px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 768px) {
          .carousel-article {
            border-radius: 1.5rem;
          }
        }
        
        .carousel-article:nth-child(1) { animation-delay: 0s; z-index: 3; }
        .carousel-article:nth-child(2) { animation-delay: 3s; z-index: 2; }
        .carousel-article:nth-child(3) { animation-delay: 6s; z-index: 1; }
        
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .dot-indicators {
          position: absolute;
          bottom: -35px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .dot-indicators {
            bottom: -40px;
            ${
              isRTL
                ? "right: 10%; left: auto; transform: translateX(50%);"
                : "left: 10%; transform: translateX(-50%);"
            }
          }
        }
        
        .dot {
          height: 6px;
          border-radius: 9999px;
          background: rgba(156, 163, 175, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: dotCycle 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .dot:nth-child(1) {
          background: #762c85;
          width: 24px;
          animation-delay: 0s;
        }
        
        .dot:nth-child(2) {
          width: 6px;
          animation-delay: 3s;
        }
        
        .dot:nth-child(3) {
          width: 6px;
          animation-delay: 6s;
        }

        @media (min-width: 768px) {
          .dot:nth-child(1) {
            width: 32px;
          }
          
          .dot:nth-child(2),
          .dot:nth-child(3) {
            width: 6px;
          }
        }

        .dot:hover {
          background: rgba(118, 44, 133, 0.6);
          transform: scale(1.1);
        }
        
        @keyframes cardCycle {
          0%, 30% {
            transform: rotateY(0deg) rotateX(0deg) translateX(0%) translateY(0%) scale(1);
            z-index: 10;
            filter: brightness(1.1) saturate(1.2);
          }
          35%, 65% {
            transform: rotateY(${isRTL ? "15deg" : "-15deg"}) translateX(${
            isRTL ? "-8%" : "8%"
          }) translateY(-10px) scale(0.95);
            z-index: 5;
            filter: brightness(0.9) saturate(0.8);
          }
          70%, 100% {
            transform: rotateY(${isRTL ? "20deg" : "-20deg"}) translateX(${
            isRTL ? "-15%" : "15%"
          }) translateY(-20px) scale(0.9);
            z-index: 1;
            filter: brightness(0.7) saturate(0.6);
          }
        }
        
        @keyframes contentCycle {
          0%, 30% { opacity: 1; transform: translateY(0px); }
          35%, 100% { opacity: 0; transform: translateY(-10px); }
        }

        @keyframes dotCycle {
          0%, 30% {
            background: #762c85;
            width: 24px;
            transform: scale(1);
          }
          35%, 65% {
            background: rgba(156, 163, 175, 0.6);
            width: 8px;
            transform: scale(0.9);
          }
          70%, 100% {
            background: rgba(156, 163, 175, 0.4);
            width: 6px;
            transform: scale(0.8);
          }
        }

        @media (min-width: 768px) {
          @keyframes dotCycle {
            0%, 30% {
              background: #762c85;
              width: 32px;
              transform: scale(1);
            }
            35%, 65% {
              background: rgba(156, 163, 175, 0.6);
              width: 8px;
              transform: scale(0.9);
            }
            70%, 100% {
              background: rgba(156, 163, 175, 0.4);
              width: 6px;
              transform: scale(0.8);
            }
          }
        }

        /* Fix for overflow issues */
        .carousel-container{
          overflow: hidden;
        }

        /* Ensure buttons don't overflow */
        .carousel-buttons > * {
          flex-shrink: 0;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .carousel-buttons {
            margin-top: 0.625rem;
            gap: 1rem;
          }
          
          .carousel-buttons > * {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
        }
        `,
        }}
      />

      <div className="carousel-container">
        <section className="carousel-section">
          {/* Text Content */}
          <div className="carousel-content">
            <div className="text-wrapper">
              {slides.map((slide) => (
                <div key={slide.id} className="content-item">
                  <h1 className="carousel-title">{t(slide.titleKey)}</h1>
                  <p className="carousel-description">{t(slide.subtitleKey)}</p>
                </div>
              ))}
            </div>

            {/* Desktop Buttons - Hidden on mobile */}
            <div className="carousel-buttons">
              <Link href="/offers">
                <Button variant="tertiary" size="lg">
                  {t("buttons.exploreDeal")} {isRTL ? "←" : "→"}
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="normal">Explore Products</Button>
              </Link>
            </div>
          </div>

          {/* Images */}
          <div className="carousel-images">
            {slides.map((slide) => (
              <article key={slide.id} className="carousel-article">
                <img
                  className="carousel-image"
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                />
              </article>
            ))}

            {/* Dot indicators */}
            <div className="dot-indicators">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className="dot"
                  role="button"
                  tabIndex={0}
                  aria-label={t("dotIndicator", { index: index + 1 })}
                />
              ))}
            </div>
          </div>

          {/* Mobile Buttons - Only visible on mobile */}
          <div className="mobile-buttons md:hidden">
            <Link href="/offers">
              <Button variant="tertiary" size="lg">
                {t("buttons.exploreDeal")} {isRTL ? "←" : "→"}
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="normal">Explore Products</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessDiscoveryCarousel;
