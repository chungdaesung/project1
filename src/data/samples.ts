import { QuotationData, CostItemEntry } from '../types';

export const DEFAULT_PALETTE_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#64748b', // slate
  '#f97316', // orange
  '#14b8a6', // teal
  '#6366f1', // indigo
];

export const STANDARD_COST_PRESETS: { name: string; category: CostItemEntry['category']; desc: string }[] = [
  { name: '도어 비용', category: '자재비', desc: '도어 판넬, 엣지 밴딩, 도장/PET/LPM 가공' },
  { name: '상판 비용', category: '자재비', desc: '인조대리석, 엔지니어드스톤, 세라믹 상판' },
  { name: '하드웨어 비용', category: '자재비', desc: '싱크볼, 수전, 힌지, 서랍 언더레일, 액세서리' },
  { name: '주방가전/기기', category: '자재비', desc: '후드, 쿡탑/인덕션, 식기세척기, 빌트인 기기' },
  { name: '가구 몸통 제작비', category: '가공/제작비', desc: '공장 캐비닛 몸통(PB/MDF) 재단, 조립 공임' },
  { name: '특수 가공비', category: '가공/제작비', desc: '세라믹 졸리컷, 빗각 가공, 도면 특수가공비' },
  { name: '현장 시공비', category: '시공/인건비', desc: '전문 시공팀 인건비 및 현장 설치 마감' },
  { name: '철거 및 폐기물', category: '시공/인건비', desc: '기존 싱크대 철거 및 폐자재 반출 처리' },
  { name: '양중 및 사다리차', category: '부대비용', desc: '엘리베이터 보양, 사다리차 이용 및 운반비' },
  { name: '운반 및 물류비', category: '부대비용', desc: '공장-현장 직송 화물 운송비' },
  { name: '실측 및 설계비', category: '부대비용', desc: '현장 정밀 실측 및 3D/CAD 도면 설계' },
  { name: '기타 예비비', category: '기타', desc: '현장 부자재, 보양재 및 예비 비용' },
];

export const SAMPLE_QUOTES: { title: string; desc: string; data: QuotationData }[] = [
  {
    title: '표준 34평형 주방 (PET 무광 & 인조대리석)',
    desc: '가장 보편적인 아파트 ‘ㄱ’자형 주방 견적 (6대 표준 원가)',
    data: {
      customerName: '김민준 고객님',
      projectName: '서초 래미안 34평 주방 교체 공사',
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: 'KQ-2026-034',
      managerName: '이지훈 대리 (영업1팀)',
      costItems: [
        {
          id: 'item-1',
          name: '도어 비용',
          description: 'E0 친환경 PET 무광 화이트 도어',
          amount: 1800000,
          category: '자재비',
          color: '#3b82f6',
        },
        {
          id: 'item-2',
          name: '상판 비용',
          description: 'LG 하이막스 오로라 12T 인조대리석',
          amount: 1400000,
          category: '자재비',
          color: '#06b6d4',
        },
        {
          id: 'item-3',
          name: '하드웨어/수전',
          description: 'Blum 댐핑 힌지, 백조 사각 싱크볼, 거위목 수전',
          amount: 950000,
          category: '자재비',
          color: '#f59e0b',
        },
        {
          id: 'item-4',
          name: '몸통 제작비',
          description: 'E0 PB 18T 바디 재단 및 조립 공임',
          amount: 1100000,
          category: '가공/제작비',
          color: '#10b981',
        },
        {
          id: 'item-5',
          name: '현장 시공비',
          description: '전문 가구 시공팀 1조 (1일 시공)',
          amount: 850000,
          category: '시공/인건비',
          color: '#8b5cf6',
        },
        {
          id: 'item-6',
          name: '철거/기타 비용',
          description: '기존 싱크대 철거 폐기 및 현장 보양',
          amount: 200000,
          category: '부대비용',
          color: '#64748b',
        },
      ],
      sellingPrice: 8500000,
      notes: '• 싱크대 규격: 3,200 x 2,400mm (ㄱ자형)\n• 도어 사양: E0 친환경 PET 무광 화이트\n• 상판: 인조대리석 오로라 비앙코 12T 슬림 라인\n• 하드웨어: Blum 댐핑 힌지 및 언더레일 적용\n• 현장 엘리베이터 양중 가능, 기존 싱크대 철거 폐기 포함',
    },
  },
  {
    title: '프리미엄 50평형 대형 아일랜드 주방 (세라믹 & 우레탄 도장)',
    desc: '고급 주택 11자형 대면형 아일랜드 + 키큰장 시스템',
    data: {
      customerName: '박서연 대표님',
      projectName: '한남동 단독주택 대면형 아일랜드 주방 신축',
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: 'KQ-2026-089',
      managerName: '김태윤 팀장 (특판영업)',
      costItems: [
        {
          id: 'item-1',
          name: '도어 마감재',
          description: '6면 친환경 우레탄 무광 도장 (샌드 그레이)',
          amount: 4500000,
          category: '자재비',
          color: '#3b82f6',
        },
        {
          id: 'item-2',
          name: '세라믹 상판',
          description: '이태리 직수입 12T 세라믹 졸리컷 45도 가공',
          amount: 4800000,
          category: '자재비',
          color: '#06b6d4',
        },
        {
          id: 'item-3',
          name: '프리미엄 H.W/기기',
          description: 'Blum 서보드라이브 전동 서랍, 그로헤 수전, 엘리카 후드',
          amount: 3200000,
          category: '자재비',
          color: '#f59e0b',
        },
        {
          id: 'item-4',
          name: '공장 맞춤 제작비',
          description: '친환경 방습 PB 18T 특수 규격 커스텀 가공',
          amount: 2400000,
          category: '가공/제작비',
          color: '#10b981',
        },
        {
          id: 'item-5',
          name: '전문 기술 시공비',
          description: '하이엔드 가구 전문 시공 마스터 2인 (2일)',
          amount: 1800000,
          category: '시공/인건비',
          color: '#8b5cf6',
        },
        {
          id: 'item-6',
          name: '양중 및 운반비',
          description: '사다리차 2회 + 화물 직송료',
          amount: 500000,
          category: '부대비용',
          color: '#f97316',
        },
        {
          id: 'item-7',
          name: '정밀 실측/설계비',
          description: '3D 렌더링 및 현장 레이저 실측',
          amount: 300000,
          category: '부대비용',
          color: '#64748b',
        },
      ],
      sellingPrice: 24500000,
      notes: '• 3,600mm 대형 독립 아일랜드 + 4,200mm 풀 키큰장 시스템\n• 상판: 이태리 직수입 12T 세라믹 졸리컷 45도 가공\n• 도어: 6면 우레탄 무광 도장 (샌드 그레이)\n• 하드웨어: Blum Servo-Drive 전동 서랍 시스템 풀셋\n• 천장 매립형 다운드래프트 후드 및 빌트인 냉장고 도어 패널 포함',
    },
  },
  {
    title: '원룸/오피스텔 맞춤형 일자 싱크대 (LPM 기본형)',
    desc: '임대 세대용 1,800mm 소형 실속 주방',
    data: {
      customerName: '강남 프라임 오피스텔 (관리실)',
      projectName: '102동 405호 1.8M 소형 일자 싱크대 교체',
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: 'KQ-2026-012',
      managerName: '정우성 주임',
      costItems: [
        {
          id: 'item-1',
          name: '도어 (LPM 화이트)',
          description: 'LPM 무광 화이트 도어',
          amount: 350000,
          category: '자재비',
          color: '#3b82f6',
        },
        {
          id: 'item-2',
          name: '상판 (인조대리석)',
          description: '기본형 인조대리석 12T',
          amount: 280000,
          category: '자재비',
          color: '#06b6d4',
        },
        {
          id: 'item-3',
          name: '하드웨어/싱크볼',
          description: '일반 댐핑 힌지 및 점보 싱크볼',
          amount: 220000,
          category: '자재비',
          color: '#f59e0b',
        },
        {
          id: 'item-4',
          name: '몸통 제작비',
          description: '소형 일자형 캐비닛 제작',
          amount: 250000,
          category: '가공/제작비',
          color: '#10b981',
        },
        {
          id: 'item-5',
          name: '시공 인건비',
          description: '반일 시공 (3시간)',
          amount: 200000,
          category: '시공/인건비',
          color: '#8b5cf6',
        },
        {
          id: 'item-6',
          name: '기타/폐기물',
          description: '소형 철거 및 폐기물 처리',
          amount: 80000,
          category: '부대비용',
          color: '#64748b',
        },
      ],
      sellingPrice: 1850000,
      notes: '• 규격: W1800 x D600 x H870mm (일자형)\n• 기본 슬림 후드 및 1구 인덕션 타공 포함\n• 시공 당일 3시간 소요 예정',
    },
  },
];

export const INITIAL_QUOTATION_DATA: QuotationData = SAMPLE_QUOTES[0].data;
