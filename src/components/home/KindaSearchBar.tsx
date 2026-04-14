'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';

const ITEMS = [
  {
    id: 'talk',
    label: 'talk',
    sub: '相談したい・迷っている',
    img: '/images/section-counseling.png',
    href: '/search',
    bg: '#FFFBEC',
  },
  {
    id: 'meet',
    label: 'meet',
    sub: 'お見合い・デート用のカフェ',
    img: '/images/section-cafe-pastel.png.PNG',
    href: '/shops',
    bg: '#FFF0F3',
  },
  {
    id: 'change',
    label: 'change',
    sub: '美容室・エステ',
    img: '/images/section-beauty-n2.png.jpg',
    href: '/shops',
    bg: '#EDF4FF',
  },
  {
    id: 'story',
    label: 'story',
    sub: 'みんなの体験談',
    img: '/images/section-story-new.png.PNG',
    href: '/episodes',
    bg: '#F0FAF2',
  },
] as const;

export default function KindaSearchBar() {
  const [open, setOpen] = useState(false);
  const [modalBottom, setModalBottom] = useState(0);
  const [mounted, setMounted] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  const close = () => setOpen(false);

  const openModal = () => {
    // ヒーローセクションの底辺がビューポート底辺から何px上にあるかを計算
    const hero = document.querySelector<HTMLElement>('.hero-kinda-new');
    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const vh = window.innerHeight;
      setModalBottom(Math.max(0, vh - heroBottom));
    }
    setOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0].clientY - touchStartY.current > 60) close();
  };

  return (
    <>
      {/* 検索バー */}
      <button
        className="ks-bar"
        onClick={openModal}
        type="button"
        aria-label="Kindaカテゴリを選ぶ"
      >
        <svg className="ks-bar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="ks-bar-text">エリアや条件で探す...</span>
        <div className="ks-bar-btn" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {mounted && createPortal(
        <>
          {/* オーバーレイ */}
          <div
            className={`ks-overlay${open ? ' is-open' : ''}`}
            onClick={close}
            aria-hidden="true"
          />

          {/* モーダル（ボトムシート） */}
          <div
            className={`ks-modal${open ? ' is-open' : ''}`}
            style={{ bottom: `${modalBottom}px` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            role="dialog"
            aria-modal="true"
            aria-label="Kindaカテゴリ選択"
          >
            {/* スワイプハンドル */}
            <div className="ks-modal-handle" aria-hidden="true" />

            {/* タイトル */}
            <p className="ks-modal-title">
              あなたの<em>Kinda</em>はどれ？
            </p>

            {/* 4枚カードグリッド */}
            <div className="ks-modal-grid">
              {ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="ks-modal-card"
                  style={{ background: item.bg }}
                  onClick={close}
                >
                  {item.img ? (
                    <div className="ks-modal-img" style={item.id === 'meet' ? { background: '#EDE5DA' } : undefined}>
                      <Image
                        src={item.img}
                        alt={`Kinda ${item.label}`}
                        width={200}
                        height={150}
                        style={{ width: '100%', height: '100%', objectFit: item.id === 'meet' ? 'contain' : 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="ks-modal-img ks-modal-no-img">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path
                          d="M20 34s-14-8.4-14-18.2a8.4 8.4 0 0114-6.4 8.4 8.4 0 0114 6.4C34 25.6 20 34 20 34z"
                          stroke="#2D7A4A"
                          strokeWidth="1.3"
                          fill="rgba(45,122,74,.1)"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="ks-modal-card-body">
                    <div className="ks-modal-card-name">
                      <em>Kinda</em> {item.label}
                    </div>
                    <p className="ks-modal-card-sub">{item.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
