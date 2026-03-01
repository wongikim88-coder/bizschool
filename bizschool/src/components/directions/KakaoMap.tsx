"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: object) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: object) => any;
        InfoWindow: new (options: object) => any;
        ZoomControl: new () => any;
        ControlPosition: Record<string, any>;
      };
    };
  }
}

const LOCATION = {
  lat: 37.5384,
  lng: 127.0843,
  level: 4,
};

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // 클라이언트 사이드 네비게이션으로 재방문 시 이미 로드된 SDK 감지
  useEffect(() => {
    if (window.kakao?.maps) {
      setSdkLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !mapRef.current) return;

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const position = new window.kakao.maps.LatLng(
        LOCATION.lat,
        LOCATION.lng
      );

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: LOCATION.level,
      });

      const marker = new window.kakao.maps.Marker({ position, map });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content:
          '<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">더존비즈스쿨 평생교육원</div>',
      });
      infoWindow.open(map, marker);

      map.addControl(
        new window.kakao.maps.ZoomControl(),
        window.kakao.maps.ControlPosition?.RIGHT
      );
    });
  }, [sdkLoaded]);

  if (!KAKAO_APP_KEY) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-[var(--color-light-bg)] text-sm text-[var(--color-muted)] md:h-[480px]">
        지도를 표시하려면 카카오 맵 API 키가 필요합니다.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-2xl md:h-[480px]"
      />
    </>
  );
}
