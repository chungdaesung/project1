import { QuotationData } from '../types';

export const SAMPLE_QUOTES: { title: string; desc: string; data: QuotationData }[] = [
  {
    title: '표준 34평형 주방 (PET 무광 & 인조대리석)',
    desc: '가장 보편적인 아파트 ‘ㄱ’자형 주방 견적',
    data: {
      customerName: '김민준 고객님',
      projectName: '서초 래미안 34평 주방 교체 공사',
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: 'KQ-2026-034',
      managerName: '이지훈 대리 (영업1팀)',
      doorCost: 1800000, // 도어 금액 (E0 PET 무광)
      countertopCost: 1400000, // 상판 금액 (LG 하이막스 12T)
      hardwareCost: 950000, // 하드웨어 (블룸 힌지, 백조 싱크볼, 하츠 후드)
      productionCost: 1100000, // 제작비 (몸통 가공, 조립 공임)
      installationCost: 850000, // 시공비 (전문 시공 1조 + 양중)
      otherCost: 200000, // 기타 비용 (폐기물, 보양)
      sellingPrice: 8500000, // 판매가
      notes: '• 싱크대 규격: 3,200 x 2,400mm (ㄱ자형)\n• 도어 사양: E0 친환경 PET 무광 화이트\n• 상판: 인조대리석 오로라 비앙코 12T 슬림 라인\n• 하드웨어: Blum 댐핑 힌지 및 언더레일 적용\n• 현장 엘리베이터 양중 가능, 기존 싱크대 철거 폐기 포함',
    },
  },
  {
    title: '프리미엄 50평형 대형 아일랜드 주방 (세라믹 & 우레탄 도장)',
    desc: '고급 주택 11자형 대면형 아일랜드 + 키큰장',
    data: {
      customerName: '박서연 대표님',
      projectName: '한남동 단독주택 대면형 아일랜드 주방 신축',
      quoteDate: new Date().toISOString().split('T')[0],
      quoteNumber: 'KQ-2026-089',
      managerName: '김태윤 팀장 (특판영업)',
      doorCost: 4500000, // 우레탄 6면 도장 도어
      countertopCost: 4800000, // 이태리 라미남 세라믹 12T
      hardwareCost: 3200000, // 블룸 서보드라이브, 그로헤 수전, 엘리카 후드
      productionCost: 2400000, // 특수 가공 및 현장 가공비
      installationCost: 1800000, // 프리미엄 전문 시공팀 2일
      otherCost: 500000, // 정밀 보양 및 폐기물
      sellingPrice: 24500000, // 판매가
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
      doorCost: 350000,
      countertopCost: 280000,
      hardwareCost: 220000,
      productionCost: 250000,
      installationCost: 200000,
      otherCost: 80000,
      sellingPrice: 1850000,
      notes: '• 규격: W1800 x D600 x H870mm (일자형)\n• 기본 슬림 후드 및 1구 인덕션 타공 포함\n• 시공 당일 3시간 소요 예정',
    },
  },
];

export const INITIAL_QUOTATION_DATA: QuotationData = SAMPLE_QUOTES[0].data;
