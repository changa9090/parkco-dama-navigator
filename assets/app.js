/* Park & Co DAMA Navigator — Occupation, Region & Concession Explorer (KO/EN) */
(function () {
  "use strict";

  const PAGE_SIZE = 40;
  let DATA = null;
  let currentLang = "ko";
  let currentPage = 1;
  let filteredOccupations = [];

  const I18N = {
    ko: {
      brandTag: "IMMIGRATION LAW · REGIONAL DAMA PRACTICE",
      pollBadge: "출처 모니터 (2026-10-20 · 실시간 14/15 · 캐시 1건 원문 확인 필요)",
      navEnquiry: "박앤코 상담·문의하기 →",
      urgentBadge: "2026–27 협약 일정 경보",
      urgentText: "서호주 South West DAMA 신청·변경 접수 마감: 2026-10-30 (협약 종료: 2026-12-14) / Goldfields DAMA 신청 접수 마감: 2026-11-13 (협약 종료: 2026-12-31 · 11.13 이후 신규 접수 불가, 기존 승인 협약·비자 자동 취소 아님) / 남호주 SA DAMA 현행 협약 2027-01-31까지 연장 운영 중(차기 5년 Statewide DAMA 협상 중).",
      heroOverline: "AUSTRALIA-WIDE 13 DAMA · OCCUPATION, REGION & CONCESSION EXPLORER",
      heroTitle: "호주 13개 DAMA 직종 · 지역 및 협약 요건 탐색",
      heroLead: "직업명(ANZSCO/OSCA/한국어), 나이, 영어 점수, 희망 지역/우편번호, 연봉($67,510~$79,423) 조건을 입력하면 호주 전역 13개 DAMA · 2,474건 지역별 직종 등록 항목(781개 고유 직종) 중 후보 지역과 협약 완화 요건(SID 482 · SESR 494 · ENS 186)을 탐색합니다. 모든 결과는 검토 후보 · 추가 확인 필요 · 조건 미충족 3단계로 구분되며, 최종 비자 적합성은 DAR·개별 Labour Agreement 원문 및 미확인 요건(학력·경력 세부, 근무지 우편번호, 시장임금 AMSR 등) 검증이 필수입니다.",
      heroPrimaryCta: "박앤코 전문변호사 1:1 비자·스폰서십 상담 신청 →",
      heroSecondaryCta: "직종·조건 맞춤 탐색 바로가기 ↓",
      specName: "박창민 대표변호사 (Chang Min Park)",
      specRole: "QLS Accredited Specialist in Immigration Law",
      specSlogan: "\"삶에 집중하세요, 법률은 저희가 맡겠습니다.\"",
      specMeta: "법무법인 박앤코 (Park & Co Lawyers · Underwood QLD) | 공식 이메일: enquiry@parkcolawyers.com",
      specBtn: "온라인 문의 바로가기 (parklawyers.com.au) →",

      stat1Over: "ACTIVE DAMAS",
      stat1Val: "13개 지역",
      stat1Sub: "호주 연방·주정부 현행 협약 전수 반영 [1]",
      stat2Over: "OCCUPATION ENTRIES",
      stat2Val: "2,474건",
      stat2Sub: "지역별 직종 등록 항목 수 (고유 직종 781개)",
      stat3Over: "2026–27 STANDARD CSIT",
      stat3Val: "$79,423",
      stat3Sub: "2026.07.01 발효 법정 기준연봉 [2]",
      stat4Over: "90% DAMA CONCESSION",
      stat4Val: "$71,481",
      stat4Sub: "표준 10% 감면 (지역별 Type 1/2/3 상한 상이)",
      stat5Over: "85% NT DAMA III",
      stat5Val: "$67,510",
      stat5Sub: "NT 최저 급여선 (단, 시장임금 AMSR 이상 필수) [11]",
      stat6Over: "MAX AGE CONCESSION",
      stat6Val: "만 55세 미만",
      stat6Sub: "SL1–4 만 55세 / SL5 만 50세 (SA는 55세)",

      combOverline: "STEP 01 · OCCUPATION, REGION & CONCESSION EXPLORER",
      combTitle: "내 직종 · 지역 · 협약 조건 탐색기",
      combSub: "한국어 직업명(예: 요리사, 용접사, 간병인, 바리스타, 청소, 트럭, 정비사, 간호사, 개발자, 회계), 영문 직종명, 또는 6자리 ANZSCO/OSCA 코드로 검색하고 희망 지역·우편번호·조건을 선택해 보세요. 각 뱃지(?)를 클릭하거나 마우스를 올리면 상세 법령 풍선 도움말(Balloon)이 열립니다.",
      searchPlaceholder: "직종 검색: 예) 요리사, Chef, Cook, 351411, 용접, Welder, 간병인, Carer, 개발자, 회계...",
      locationPlaceholder: "근무지 LGA / 도시 / 우편번호 (예: Cairns, Perth, 5950, Ravensthorpe)",
      resetBtn: "필터 초기화",
      presetLabel: "인기 검색 직종:",

      lblRegion: "1. 희망 주(State) / DAMA 지역",
      lblAge: "2. 신청자 현재 나이 (Age)",
      lblEnglish: "3. 보유 영어 점수 (IELTS / PTE)",
      lblSalary: "4. 고용주 제시 가능 연봉 (Salary)",
      lblSkill: "5. 직종 숙련도 (Skill Level / 학력)",
      lblPathway: "6. 영주권(ENS 186) 및 특별 조건",

      optRegionAll: "호주 전체 (13개 DAMA 전 지역 · 2,474건)",
      optStateQLD: "── 퀸즐랜드 (QLD: FNQ 11개 LGA · 타운즈빌) ──",
      optStateNSW: "── 뉴사우스웨일즈 (NSW: 오라나 51개 LGA · 129개 직종) ──",
      optStateNT: "── 노던 테리토리 (NT DAMA III 전역 · 325개 직종) ──",
      optStateSA: "── 남호주 (SA: 애들레이드 Tech · 남호주 Regional) ──",
      optStateVIC: "── 빅토리아 (VIC: 굴번밸리 · 워남불 GSC) ──",
      optStateWA: "── 서호주 (WA: 주전역 Cat 2/3 · 필바라 · 골드필즈 · 남서부 · 킴벌리) ──",

      optAgeAll: "연령 무관 / 전체 보기",
      optAgeUnder45: "만 45세 미만 (표준 연령 상한 충족 — 세부 요건 별도 확인)",
      optAge45_49: "만 45세 ~ 49세 (DAMA 연령 완화 구간 — 직종별 상한 50/55세 확인)",
      optAge50_54: "만 50세 ~ 54세 (만 55세 미만 완화 직종만 후보 · 전환 시점 연령 확인)",

      optEngAll: "영어 점수 전체 (IELTS 6.0+ 표준 포함)",
      optEng50NoBand: "IELTS 5.0 평균 · 과목별 최저점 없음(No Band Min) 명시 직종만",
      optEng50Min40: "IELTS 5.0 평균 · 각 과목 4.0 이상 가능 직종 (4.5 이상 직종 구분 표기)",
      optEng45Min40: "IELTS 4.5 평균 · 각 과목 4.0 이상 (NT / SA 외곽 지방 우편번호 한정)",

      optSalAll: "연봉 무관 ($79,423 표준 CSIT 이상 가능 포함)",
      optSal71481: "$71,481 감면 직종만 (90% 또는 85% 감면 · 시장임금 AMSR 이상 필수)",
      optSal67510: "$67,510 감면 직종만 (85% NT DAMA III · 시장임금 AMSR 이상 필수)",

      optSkillAll: "모든 Skill Level (SL 1~5 및 비-ANZSCO)",
      optSkill1_3: "Skill Level 1–3 (학사·전문학사·Cert III/IV 기술·전문직)",
      optSkill4: "Skill Level 4 (Cert II/III 또는 1~2년 경력 반숙련직)",
      optSkill5: "Skill Level 5 (Cert I 또는 1년 경력 기초·단순노무직)",
      optSkill4_5: "Skill Level 4 & 5 모아보기 (일반 482 불가 · DAMA 전용 직종)",
      optNonAnzsco: "070499 비-ANZSCO 특화 직종만 보기",

      optPathAll: "전체 보기",
      optPathDirect186: "Direct ENS 186 조항 보유 지역 (FNQ·NT·Kimberley — 개별 LA·DAR 확인 필수)",
      optPathFreeDar: "DAR 승인 수수료 $0 (무료) 주정부 지역만 (NT · SA · WA State-wide)",
      optPathNoSl5Upgrade: "SL5 승진 조건 없이 186 영주권 경로가 열려 있는 직종",

      regOverline: "STEP 02 · WHERE TO FIND YOUR REGIONAL EMPLOYER SPONSOR",
      regTitle: "13개 DAMA 지역별 매칭 직종 등록 항목 수 & 지역 상세 가이드",
      regSub: "현재 선택한 검색어·조건에 부합하는 직종 등록 항목이 각 지역에 몇 건 있는지 실시간으로 표시됩니다. 지역 카드를 클릭하면 해당 지역으로 필터링되며, [지역 요건·우편번호 상세] 버튼을 누르면 전체 커버리지와 협약 요건을 팝업으로 확인합니다.",
      regDetailBtn: "지역 요건 · 우편번호 상세",
      regFilterHint: "클릭하여 이 지역만 필터",

      tblOverline: "STEP 03 · VERIFIED OCCUPATION & CONCESSION EXPLORER TABLE",
      tblTitle: "조건별 직종 등록 항목 & 협약 완화 요건 탐색 리스트",
      thDama: "DAMA 지역 · 주(State)",
      thOcc: "직종명 (ANZSCO/OSCA · 상태)",
      thSl: "숙련도 (SL)",
      thSal: "최저 연봉 (2026–27)",
      thEng: "영어 요건 (482 / 494 / 186)",
      thAgePr: "연령 상한 · 영주권 경로",
      thQuals: "학력 · 경력 요약 (482/494/186)",
      thAction: "탐색 판정 · 상세",
      btnRowModal: "요건 · 검증체크 상세",

      discOverline: "LEGAL DISCLAIMER, COPYRIGHT & GOVERNMENT ATTRIBUTION",
      discTitle: "법률 면책공고 (Legal Disclaimer) · 저작권 보호 및 각 주정부/연방정부 1차 출처 각주",
      discP1: "1. 일반 정보 제공 목적 및 법률자문 비구성 (No Legal Advice & No Solicitor-Client Relationship): 본 웹서비스('Park & Co DAMA Navigator')에 수록된 모든 정보는 2026년 10월 20일 기준 호주 연방 이민성(Department of Home Affairs) 및 13개 지정지역대표기관(DAR)이 공개한 공식 가이드라인과 직종 스케줄을 바탕으로 정리된 일반 탐색 정보이며, 개별 사안에 대한 법률자문(Legal Advice)이나 자격 확정 판정이 아닙니다. 본 서비스의 탐색 결과는 '검토 후보(Candidate)' 또는 '추가 확인 필요(Requires Verification)'를 안내할 뿐이며, 실제 DAMA DAR Endorsement, Labour Agreement 체결 및 비자(Subclass 482 / 494 / 186) 신청 가능 여부는 고용주의 근무지 우편번호, 재무 건전성, LMT/SMER 구인광고 적격성, 호주 시장임금(AMSR) 입증, 신청자의 세부 학력·경력(AQF 등급 및 풀타임 환산 경력) 및 각 DAR의 재량에 따라 달라지므로 반드시 QLS 공인 이민법 전문변호사(Accredited Specialist in Immigration Law)의 정식 자문을 받으시기 바랍니다.",
      discP2: "2. 저작권 보호 고지 (Copyright Protection Notice): © 2026 Park & Co Lawyers Pty Ltd. All rights reserved. 본 웹서비스의 데이터베이스 구조, 국·영문 직종 매핑, 연령·영어·경력 요건 탐색 알고리즘, UI/UX 디자인 및 해설 문구에 대한 일체의 저작권과 지식재산권은 법무법인 박앤코에 귀속됩니다. 사전 서면 허가 없는 크롤링, 무단 복제, 재배포 또는 타 이주업체·법무법인의 상업적 도용을 엄격히 금지합니다.",
      discP3: "3. 호주 연방·주·지방정부 및 관할 DAR 공식 출처 표기 (Government & DAR Attribution Notice): 본 서비스에 반영된 각 주·테리토리 정부 및 DAR의 직종 코드, 우편번호 범위, 수수료 및 완화된 기준 수치는 호주 공공저작물 라이선스(Creative Commons Attribution 4.0 International — CC BY 4.0) 및 출처 표시 원칙에 따라 아래 29개 1차 공식 출처([1]~[29])를 원문 링크 및 SHA-256 무결성 해시와 함께 하단 각주에 명시합니다.",
      fnHeading: "1차 공식 출처 및 주정부·DAR 레퍼런스 각주 ([1] ~ [29])",
    },
    en: {
      brandTag: "IMMIGRATION LAW · REGIONAL DAMA PRACTICE",
      pollBadge: "Source Monitor (2026-10-20 · Live 14/15 · 1 Cached — Verify Live)",
      navEnquiry: "Make an Enquiry →",
      urgentBadge: "2026–27 SCHEDULE ALERT",
      urgentText: "WA South West DAMA Application/Variation Cutoff: 2026-10-30 (Agreement Expiry: 2026-12-14) / Goldfields DAMA Application Cutoff: 2026-11-13 (Agreement Expiry: 2026-12-31 · closed to new applications after 13 Nov; existing approved agreements/visas not auto-cancelled) / SA DAMAs extended to 2027-01-31 (proposed 5-year Statewide DAMA under negotiation).",
      heroOverline: "AUSTRALIA-WIDE 13 DAMA · OCCUPATION, REGION & CONCESSION EXPLORER",
      heroTitle: "Australia 13 DAMA Occupation, Region & Concession Explorer",
      heroLead: "Search by occupation title or ANZSCO/OSCA code and filter by your age, English test score, location/postcode, and offered salary ($67,510–$79,423) across all 13 Australian DAMAs (2,474 regional occupation registration entries across 781 unique occupations). Every entry is classified into Candidate, Requires Verification, or Not Met, with explicit checklists of matched vs. unchecked legal criteria.",
      heroPrimaryCta: "Book a 1:1 Consultation with Park & Co Lawyers →",
      heroSecondaryCta: "Launch DAMA Explorer ↓",
      specName: "Chang Min Park — Principal Lawyer",
      specRole: "QLS Accredited Specialist in Immigration Law",
      specSlogan: "\"You focus on life, we'll handle the law.\"",
      specMeta: "Park & Co Lawyers (Underwood QLD) | Official Email: enquiry@parkcolawyers.com",
      specBtn: "Enquire Online (parklawyers.com.au) →",

      stat1Over: "ACTIVE DAMAS",
      stat1Val: "13 Regions",
      stat1Sub: "Commonwealth & State/DAR schedules [1]",
      stat2Over: "OCCUPATION ENTRIES",
      stat2Val: "2,474 Entries",
      stat2Sub: "Regional Occupation Registration Entries (781 Unique)",
      stat3Over: "2026–27 STANDARD CSIT",
      stat3Val: "$79,423",
      stat3Sub: "Statutory threshold from 1 Jul 2026 [2]",
      stat4Over: "90% DAMA CONCESSION",
      stat4Val: "$71,481",
      stat4Sub: "10% reduction (Type 1/2/3 caps vary by DAMA)",
      stat5Over: "85% NT DAMA III",
      stat5Val: "$67,510",
      stat5Sub: "NT minimum floor (must still meet market AMSR) [11]",
      stat6Over: "MAX AGE CONCESSION",
      stat6Val: "Under 55",
      stat6Sub: "SL1–4 Under 55 / SL5 Under 50 (SA: 55)",

      combOverline: "STEP 01 · OCCUPATION, REGION & CONCESSION EXPLORER",
      combTitle: "Explore DAMA Regions, Occupations & Concession Rules",
      combSub: "Search by English occupation title, 6-digit ANZSCO/OSCA code, or Korean keyword, and optionally enter an LGA, suburb, or 4-digit postcode. Hover or tap any (?) badge for interactive legal balloon tooltips and footnote references.",
      searchPlaceholder: "Search occupation or ANZSCO: e.g. Chef, Cook, 351411, Welder, Carer, Developer, Accountant...",
      locationPlaceholder: "LGA / Suburb / Postcode (e.g. Cairns, Perth, 5950, Ravensthorpe)",
      resetBtn: "Reset Filters",
      presetLabel: "Popular Occupations:",

      lblRegion: "1. State / DAMA Region",
      lblAge: "2. Applicant Current Age",
      lblEnglish: "3. English Score (IELTS / PTE)",
      lblSalary: "4. Employer Offered Salary (AUD)",
      lblSkill: "5. Skill Level & Qualification",
      lblPathway: "6. PR (ENS 186) & Special Rules",

      optRegionAll: "All Australia (All 13 DAMAs · 2,474 Entries)",
      optStateQLD: "── Queensland (QLD: FNQ 11 LGAs & Townsville) ──",
      optStateNSW: "── New South Wales (NSW: Orana 51 LGAs · 129 Active) ──",
      optStateNT: "── Northern Territory (NT DAMA III State-wide · 325 Roles) ──",
      optStateSA: "── South Australia (SA: Adelaide Tech & SA Regional) ──",
      optStateVIC: "── Victoria (VIC: Goulburn Valley & Great South Coast) ──",
      optStateWA: "── Western Australia (WA: State-wide Cat 2/3, Pilbara, Goldfields, SW, Kimberley) ──",

      optAgeAll: "Any Age / Show All",
      optAgeUnder45: "Under 45 (Meets standard age cap — verify other criteria)",
      optAge45_49: "Age 45–49 (DAMA Age Concession Band — verify 50/55 cap)",
      optAge50_54: "Age 50–54 (Under-55 cap roles only — check transition age)",

      optEngAll: "Any English Score (incl. Standard IELTS 6.0+)",
      optEng50NoBand: "IELTS 5.0 avg · Explicit No Band Minimum only",
      optEng50Min40: "IELTS 5.0 avg · Min 4.0 each band (or 4.5 where noted)",
      optEng45Min40: "IELTS 4.5 avg · Min 4.0 each (NT & Outer Regional SA postcodes only)",

      optSalAll: "Any Salary (incl. $79,423+ Standard CSIT)",
      optSal71481: "Up to $71,481 concession roles (Must still meet market AMSR)",
      optSal67510: "Up to $67,510 concession roles (NT DAMA III · Must meet AMSR)",

      optSkillAll: "All Skill Levels (SL 1–5 & Non-ANZSCO)",
      optSkill1_3: "Skill Levels 1–3 (Degree / Diploma / Cert III–IV Trades)",
      optSkill4: "Skill Level 4 (Cert II/III or 1–2y Exp Semi-Skilled)",
      optSkill5: "Skill Level 5 (Cert I or 1y Exp Entry-Level)",
      optSkill4_5: "Skill Levels 4 & 5 Only (DAMA-exclusive semi/low-skilled)",
      optNonAnzsco: "070499 Non-ANZSCO Occupations Only",

      optPathAll: "Show All Pathways",
      optPathDirect186: "Direct ENS 186 Provision Regions (FNQ, NT, Kimberley — Verify LA/DAR)",
      optPathFreeDar: "$0 Free DAR Endorsement Fee Only (NT, SA, WA State-wide)",
      optPathNoSl5Upgrade: "No SL5 Promotion Required for ENS 186",

      regOverline: "STEP 02 · WHERE TO FIND YOUR REGIONAL EMPLOYER SPONSOR",
      regTitle: "Matching Occupation Registration Entries by DAMA Region (13 Regions)",
      regSub: "Live count of occupation registration entries matching your filters in each region. Click any card to filter the table by that DAMA, or click [Region Rules & Postcodes] for the full regional profile.",
      regDetailBtn: "Region Rules & Postcodes",
      regFilterHint: "Click to filter by region",

      tblOverline: "STEP 03 · VERIFIED OCCUPATION & CONCESSION EXPLORER TABLE",
      tblTitle: "Matching Occupation Entries & Concession Verification Table",
      thDama: "DAMA Region · State",
      thOcc: "Occupation (ANZSCO/OSCA & Status)",
      thSl: "Skill Level",
      thSal: "Min Salary (2026–27)",
      thEng: "English (482 / 494 / 186)",
      thAgePr: "Age Cap & PR Pathway",
      thQuals: "Qualifications & Work Exp",
      thAction: "Status & Details",
      btnRowModal: "Status & Checklist",

      discOverline: "LEGAL DISCLAIMER, COPYRIGHT & GOVERNMENT ATTRIBUTION",
      discTitle: "Legal Disclaimer, Copyright Notice & Official Government/DAR Source Footnotes",
      discP1: "1. General Information Only (No Legal Advice / No Automated Eligibility Certification): The information provided on this web service ('Park & Co DAMA Navigator') is current as at 20 October 2026 based on official schedules published by the Australian Department of Home Affairs and the 13 Designated Area Representatives (DARs). It is an exploratory reference tool only and does not constitute legal advice or automated eligibility certification. Results are presented as 'Candidate' or 'Requires Verification'; actual DAMA endorsement, Labour Agreement approval, and visa grant (Subclasses 482 / 494 / 186) depend on verified employer postcode, financial viability, LMT/SMER compliance, Annual Market Salary Rate (AMSR), exact AQF qualifications, full-time equivalent work experience, and DAR discretion.",
      discP2: "2. Copyright Protection Notice: © 2026 Park & Co Lawyers Pty Ltd (Underwood QLD). All rights reserved. The compilation, bilingual mapping, exploratory rule engine, UI design, and commentary in this web service are the proprietary intellectual property of Park & Co Lawyers.",
      discP3: "3. Commonwealth, State/Territory Government & DAR Attribution: Underlying statistical codes, postcode boundaries, and official DAMA schedule figures are attributed to the Commonwealth of Australia (Department of Home Affairs) and the respective State/Territory Governments and Designated Area Representatives under Creative Commons Attribution 4.0 International (CC BY 4.0) and fair dealing principles. Full primary-source links and SHA-256 verification hashes are provided in Footnotes [1]–[29] below.",
      fnHeading: "Verified Primary Sources & Official DAR Footnotes ([1] – [29])",
    },
  };

  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.ko[key] || key;
  }

  function getDamaMap() {
    const map = {};
    if (DATA && DATA.damas) {
      DATA.damas.forEach((d) => {
        map[d.id] = d;
      });
    }
    return map;
  }

  // Classify SA postcode using official SA DAMA Postcode Definitions (E07, T12, T13)
  function classifySaPostcode(pcStr) {
    if (!DATA || !DATA.meta || !DATA.meta.sa_postcode_zones) return "unknown";
    const defs = DATA.meta.sa_postcode_zones;
    const clean = String(pcStr || "").trim();
    if (!/^\d{4}$/.test(clean)) return "unknown";
    if ((defs.outer_regional || []).includes(clean)) return "outer_regional";
    if ((defs.inner_regional || []).includes(clean)) return "inner_regional";
    if ((defs.adelaide_metropolitan || []).includes(clean)) return "adelaide_metro";
    return "outside_sa";
  }

  // Classify WA postcode using official WA DAMA Category 2 Metro Perth postcodes (E06, T10, T11)
  function classifyWaPostcode(pcStr) {
    if (!DATA || !DATA.meta || !DATA.meta.wa_cat2_perth_postcodes) return "unknown";
    const clean = String(pcStr || "").trim();
    if (!/^\d{4}$/.test(clean)) return "unknown";
    const metroList = DATA.meta.wa_cat2_perth_postcodes || [];
    if (metroList.includes(clean)) return "cat2_metro_perth";
    if (clean.startsWith("6")) return "cat3_regional_wa";
    return "outside_wa";
  }

  // Evaluate location/LGA/postcode match for a given DAMA & occupation (E02, E03, E06, E07, T03, T04, T10, T12, T13)
  function checkLocationMatch(d, o, locRaw) {
    const loc = String(locRaw || "").trim().toLowerCase();
    if (!loc) return { matched: true, zone: null, reason: null };

    // Check explicit excluded LGAs first (e.g. Carpentaria in FNQ [T03], Wiluna in Goldfields [T04])
    const excludedLgas = (d.excluded_lgas_en || d.excluded_lgas || []).map((x) => x.toLowerCase());
    for (const ex of excludedLgas) {
      const shortEx = ex
        .replace(/^shire of\s+/i, "")
        .replace(/^city of\s+/i, "")
        .replace(/^town of\s+/i, "")
        .replace(/\s+shire council$/i, "")
        .replace(/\s+aboriginal shire council$/i, "")
        .replace(/\s+regional council$/i, "")
        .trim();
      if (loc === ex || (shortEx.length >= 4 && loc.includes(shortEx))) {
        return {
          matched: false,
          zone: "excluded_lga",
          reason: `Excluded LGA (${ex}) is outside ${d.code} coverage.`,
        };
      }
    }

    // Check 4-digit postcode rules
    if (/^\d{4}$/.test(loc)) {
      if (d.id === "adelaide_city_dama") {
        const saZone = classifySaPostcode(loc);
        if (saZone === "outside_sa" || saZone === "outer_regional") {
          return { matched: false, zone: saZone, reason: `Postcode ${loc} is outside Greater Adelaide.` };
        }
        if ((o.availability_zone || "").includes("Adelaide Metropolitan only") && saZone !== "adelaide_metro") {
          return { matched: false, zone: saZone, reason: `Occupation requires Adelaide Metropolitan postcode.` };
        }
        return { matched: true, zone: saZone, reason: null };
      }
      if (d.id === "sa_regional_workforce_dama") {
        const saZone = classifySaPostcode(loc);
        if (saZone === "outside_sa") {
          return { matched: false, zone: saZone, reason: `Postcode ${loc} is outside South Australia.` };
        }
        if ((o.availability_zone || "").includes("Regional SA only") && saZone === "adelaide_metro") {
          return {
            matched: false,
            zone: saZone,
            reason: `Postcode ${loc} is Adelaide Metropolitan (excluded for Regional SA-only occupation).`,
          };
        }
        return { matched: true, zone: saZone, reason: null };
      }
      if (d.id === "wa_statewide_dama") {
        const waZone = classifyWaPostcode(loc);
        if (waZone === "outside_wa") {
          return { matched: false, zone: waZone, reason: `Postcode ${loc} is outside Western Australia.` };
        }
        if (waZone === "cat2_metro_perth" && !(o.wa_cat2_perth || o.wa_metro_available)) {
          return {
            matched: false,
            zone: waZone,
            reason: `Occupation ${o.anzsco_code} is Category 3 Regional WA only and not available in Category 2 Metro Perth (${loc}).`,
          };
        }
        return { matched: true, zone: waZone, reason: null };
      }
    }

    // Named WA Metro Perth vs Regional WA check (T10)
    if (d.id === "wa_statewide_dama") {
      if (loc === "perth" || loc.includes("metro perth") || loc === "cat2" || loc === "category 2" || loc === "퍼스") {
        if (!(o.wa_cat2_perth || o.wa_metro_available)) {
          return {
            matched: false,
            zone: "cat2_metro_perth",
            reason: `Occupation ${o.anzsco_code} is not available in WA Category 2 Metropolitan Perth.`,
          };
        }
        return { matched: true, zone: "cat2_metro_perth", reason: null };
      }
      if (loc === "regional wa" || loc === "cat3" || loc === "category 3") {
        return { matched: Boolean(o.wa_cat3_regional || o.wa_regional_available), zone: "cat3_regional_wa", reason: null };
      }
    }

    // Check Official Included LGAs / Postcodes / Region text
    const haystack = [
      (d.lgas_list_en || d.official_lgas || []).join(" "),
      d.postcodes || "",
      d.name_en || "",
      d.name_ko || "",
      d.state || "",
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(loc)) {
      return { matched: true, zone: "matched_lga_or_text", reason: null };
    }
    return { matched: false, zone: "unmatched", reason: `Location '${locRaw}' not found in ${d.code}.` };
  }

  // Evaluate English score per visa subclass (482, 494, 186) independently (E05, T06, T07, T12, T13, T16)
  function evaluateEnglishBySubclass(o, overallScore, minBandScore, locationQuery) {
    const ov = Number(overallScore);
    const mb = Number(minBandScore);
    const dMap = getDamaMap();
    const d = dMap[o.dama_id] || {};
    const locCheck = checkLocationMatch(d, o, locationQuery || "");

    // For SA Regional DAMA, IELTS 4.5 (min 4.0) applies ONLY in Outer Regional SA postcodes (E07, T12, T13)
    let req482Overall = Number(o.min_ielts_482 || 5.0);
    let req482Band = Number(o.min_ielts_band_482 || 0.0);
    let req494Overall = Number(o.min_ielts_494 || req482Overall);
    let req494Band = Number(o.min_ielts_band_494 != null ? o.min_ielts_band_494 : req482Band);
    const req186Overall = Number(o.min_ielts_186 || 5.0);
    const req186Band = Number(o.min_ielts_band_186 != null ? o.min_ielts_band_186 : 0.0);

    let saOuterVerificationNeeded = false;
    if (o.dama_id === "sa_regional_workforce_dama" && o.english_concession) {
      if (locCheck.zone === "outer_regional") {
        // Verified Outer Regional SA postcode: Type 2 (IELTS 4.5 overall, min 4.0 each band) applies
        req482Overall = 4.5;
        req482Band = 4.0;
        req494Overall = 4.5;
        req494Band = 4.0;
      } else if (locCheck.zone === "adelaide_metro" || locCheck.zone === "inner_regional") {
        // Type 1 applies (IELTS 5.0 overall, min 4.0 each band) — Type 2 (4.5) is NOT permitted in Metro (e.g. 5950) or Inner Regional!
        req482Overall = 5.0;
        req482Band = 4.0;
        req494Overall = 5.0;
        req494Band = 4.0;
      } else if (ov >= 4.5 && ov < 5.0) {
        // No SA postcode entered yet: allow conditional match only as "requires_verification" (T13)
        req482Overall = 4.5;
        req482Band = 4.0;
        req494Overall = 4.5;
        req494Band = 4.0;
        saOuterVerificationNeeded = true;
      }
    }

    const pass482 = ov >= req482Overall && mb >= req482Band && locCheck.matched;
    const pass494 = ov >= req494Overall && mb >= req494Band && locCheck.matched;
    const pass186 = ov >= req186Overall && mb >= req186Band && locCheck.matched;

    return {
      subclass_482: {
        eligible: pass482,
        status: ! pass482 ? "not_met" : (saOuterVerificationNeeded ? "requires_verification" : "candidate"),
        required_overall: req482Overall,
        required_min_band: req482Band,
        requires_sa_outer_postcode_verification: saOuterVerificationNeeded,
      },
      subclass_494: {
        eligible: pass494,
        status: ! pass494 ? "not_met" : (saOuterVerificationNeeded ? "requires_verification" : "candidate"),
        required_overall: req494Overall,
        required_min_band: req494Band,
      },
      subclass_186: {
        eligible: pass186,
        status: pass186 ? "candidate" : "not_met",
        required_overall: req186Overall,
        required_min_band: req186Band,
      },
    };
  }

  // Evaluate salary package including FNQ Type 2 non-monetary cap ($7,942.30) and NT/general AMSR floor (E08, T14, T15)
  function evaluateSalaryPackage(damaId, occ, cashAud, nonMonetaryAud, amsrAud) {
    const csit = 79423;
    const cash = Number(cashAud || 0);
    const nonMon = Number(nonMonetaryAud || 0);
    const amsr = amsrAud != null ? Number(amsrAud) : csit;
    const hasConcession = occ ? Boolean(occ.tsmit_concession) : true;
    const minCashFloor = occ ? Number(occ.min_salary_aud || csit) : (damaId === "nt_dama_iii" ? 67510 : 71481);

    // Market salary rate (AMSR) check: in all DAMAs (including NT $67,510), total/offered salary cannot be less than AMSR (T15)
    if (damaId === "fnq_dama") {
      // FNQ Type 2: max non-monetary = 10% of full CSIT ($7,942.30), cash >= $71,481, total >= $79,423 and >= AMSR (T14)
      const maxNonMonetaryAud = round2(csit * 0.10); // 7942.30
      const recognizedNonMon = hasConcession ? Math.min(nonMon, maxNonMonetaryAud) : 0;
      const effectiveTotal = round2(cash + recognizedNonMon);
      const nonMonExceedsCap = nonMon > maxNonMonetaryAud;
      const meetsCash = cash >= (hasConcession ? 71481 : csit);
      const meetsTotalCsit = effectiveTotal >= csit;
      const meetsAmsr = effectiveTotal >= amsr;
      const eligible = meetsCash && meetsTotalCsit && meetsAmsr;
      return {
        eligible: eligible,
        status: eligible ? "candidate" : "not_met",
        dama_id: damaId,
        max_non_monetary_aud: maxNonMonetaryAud,
        recognized_non_monetary_aud: recognizedNonMon,
        non_monetary_exceeds_cap: nonMonExceedsCap,
        effective_total_aud: effectiveTotal,
        meets_cash_floor: meetsCash,
        meets_csit_total: meetsTotalCsit,
        meets_amsr: meetsAmsr,
        reason: !eligible
          ? `FNQ requires cash >= $71,481, non-monetary <= $7,942.30 (10% of CSIT), total >= $79,423, and total >= AMSR ($${amsr.toLocaleString()}).`
          : "Meets FNQ salary rules.",
      };
    }

    const maxNonMon = damaId === "nt_dama_iii" ? 6751 : (hasConcession ? 7148 : 0);
    const recognizedNonMon = Math.min(nonMon, maxNonMon);
    const effectiveTotal = round2(cash + recognizedNonMon);
    const meetsFloor = cash >= minCashFloor;
    const meetsAmsr = effectiveTotal >= amsr && cash >= Math.min(amsr, minCashFloor);
    const eligible = meetsFloor && effectiveTotal >= amsr;

    return {
      eligible: eligible,
      status: eligible ? "candidate" : "not_met",
      dama_id: damaId,
      min_cash_floor_aud: minCashFloor,
      amsr_aud: amsr,
      max_non_monetary_aud: maxNonMon,
      effective_total_aud: effectiveTotal,
      meets_cash_floor: meetsFloor,
      meets_amsr: meetsAmsr,
      reason: !eligible
        ? `Offered package ($${effectiveTotal.toLocaleString()}) is below required floor ($${minCashFloor.toLocaleString()}) or market salary rate AMSR ($${amsr.toLocaleString()}).`
        : "Meets DAMA minimum floor and AMSR.",
    };
  }

  function round2(n) {
    return Math.round(Number(n) * 100) / 100;
  }

  // Evaluate age transition math accurately without off-by-one or inverted range bugs (E13, E16, T17, T18, T19)
  function evaluateAgeAndTransition(o, currentAge, locationQuery, hasTwoYearsNonDamaRegionalWork) {
    const age = Number(currentAge);
    const maxAge = Number(o.max_age || 55);

    // Determine required 482 -> 186 transition years (Pilbara = 3y; WA Cat 2 Metro Perth = 3y; others = 2y)
    let transitionYears = o.dama_id === "pilbara_dama" ? 3 : 2;
    if (o.dama_id === "wa_statewide_dama") {
      const loc = String(locationQuery || "").trim().toLowerCase();
      if (loc === "perth" || loc.includes("metro") || loc === "cat2" || classifyWaPostcode(loc) === "cat2_metro_perth") {
        transitionYears = 3;
      }
    }

    const ageAt186Nomination = age + transitionYears;
    const eligibleFor494OrDirect186Now = age < maxAge;
    const eligibleFor482To186Transition = ageAt186Nomination < maxAge;
    const willExceedAgeCapDuring482Transition = eligibleFor494OrDirect186Now && !eligibleFor482To186Transition;

    // Exact age band where 482 -> 186 transition will hit/exceed maxAge (e.g. for 2y & max 55: 53-54; for 3y & max 55: 52-54; for 2y & max 50: 48-49)
    const trapStartAge = maxAge - transitionYears;
    const trapEndAge = maxAge - 1;
    const ageTrapRangeText = trapStartAge <= trapEndAge ? `${trapStartAge}–${trapEndAge}` : `${trapEndAge}`;

    // Direct 186 evaluation (E13, T19): never unconditionally eligible from 2y non-DAMA work alone
    let direct186Status = "not_available_in_region";
    let direct186Note = "Direct ENS 186 from non-DAMA regional work is not available in this DAMA.";
    if (o.direct_186) {
      if (!eligibleFor494OrDirect186Now) {
        direct186Status = "not_met";
        direct186Note = `Applicant age (${age}) is not under the ${maxAge} age cap.`;
      } else if (hasTwoYearsNonDamaRegionalWork) {
        direct186Status = "requires_verification";
        direct186Note =
          "추가 확인 필요 (Requires Verification): 2년 지역 경력 외에 고용주 DAR Endorsement, 개별 Labour Agreement 내 ENS 186 스트림 승인 여부, 승인 직종 및 숙련도 요건 충족 확인이 필수입니다.";
      } else {
        direct186Status = "requires_verification";
        direct186Note =
          "조건부 가능 (Conditional): 2년 풀타임 지역 경력 + 고용주 DAR Endorsement + 개별 Labour Agreement 내 ENS 186 승인 확인 필요.";
      }
    }

    return {
      current_age: age,
      max_age: maxAge,
      transition_years: transitionYears,
      projected_age_at_186: ageAt186Nomination,
      eligible_494_now: eligibleFor494OrDirect186Now,
      eligible_482_to_186_transition: eligibleFor482To186Transition,
      exceeds_186_age_cap_after_transition: willExceedAgeCapDuring482Transition,
      age_trap_range_label: ageTrapRangeText,
      direct_186_status: direct186Status,
      direct_186_note: direct186Note,
    };
  }

  function getFilters() {
    const locEl = document.getElementById("filter-location");
    return {
      q: (document.getElementById("search-input").value || "").trim().toLowerCase(),
      location: locEl ? (locEl.value || "").trim() : "",
      region: document.getElementById("filter-region").value,
      age: document.getElementById("filter-age").value,
      english: document.getElementById("filter-english").value,
      salary: document.getElementById("filter-salary").value,
      skill: document.getElementById("filter-skill").value,
      pathway: document.getElementById("filter-pathway").value,
    };
  }

  function rowMatches(o, f, ignoreRegionFilter) {
    const dMap = getDamaMap();
    const d = dMap[o.dama_id] || {};

    // 1. Search query
    if (f.q) {
      const terms = f.q.split(/\s+/).filter(Boolean);
      for (const term of terms) {
        if (!o.search_text.includes(term)) return false;
      }
    }

    // 2. Location / LGA / Postcode filter (E02, E03, E06, E07, T03, T04, T10, T12)
    if (f.location) {
      const locRes = checkLocationMatch(d, o, f.location);
      if (!locRes.matched) return false;
    }

    // 3. Region / State (including WA Cat 2 Metro Perth vs Cat 3 Regional WA sub-options)
    if (!ignoreRegionFilter && f.region !== "all") {
      if (f.region.startsWith("state:")) {
        const st = f.region.split(":")[1];
        if (o.state !== st) return false;
      } else if (f.region === "wa_statewide_dama:cat2_metro") {
        if (o.dama_id !== "wa_statewide_dama" || !(o.wa_cat2_perth || o.wa_metro_available)) return false;
      } else if (f.region === "wa_statewide_dama:cat3_regional") {
        if (o.dama_id !== "wa_statewide_dama" || !(o.wa_cat3_regional || o.wa_regional_available)) return false;
      } else if (o.dama_id !== f.region) {
        return false;
      }
    }

    // 4. Age
    if (f.age === "50-54") {
      if (o.max_age < 55) return false;
    } else if (f.age === "45-49") {
      if (o.max_age < 50) return false;
    }

    // 5. English (E05, T06, T07, T12)
    if (f.english === "5.0-noband") {
      // T07: ONLY match rows where min_ielts_band_482 === 0.0 (explicit no component minimum)
      if (Number(o.min_ielts_band_482) !== 0.0 || Number(o.min_ielts_482) > 5.0) return false;
    } else if (f.english === "5.0-min40") {
      if (!o.english_concession) return false;
    } else if (f.english === "4.5-min40") {
      const isNt45 = o.dama_id === "nt_dama_iii" && Number(o.min_ielts_482) <= 4.5;
      const isSa45 = o.dama_id === "sa_regional_workforce_dama" && o.english_concession;
      if (!isNt45 && !isSa45) return false;
      // T12: If user entered a location in SA that is Adelaide Metro (e.g. 5950) or Inner Regional, reject 4.5-min40!
      if (isSa45 && f.location) {
        const saZone = classifySaPostcode(f.location);
        if (saZone === "adelaide_metro" || saZone === "inner_regional") return false;
      }
    }

    // 6. Salary
    if (f.salary === "71481") {
      if (o.min_salary_aud > 71481) return false;
    } else if (f.salary === "67510") {
      if (o.min_salary_aud > 67510) return false;
    }

    // 7. Skill Level
    if (f.skill === "1-3") {
      if (o.skill_level > 3) return false;
    } else if (f.skill === "4") {
      if (o.skill_level !== 4) return false;
    } else if (f.skill === "5") {
      if (o.skill_level !== 5) return false;
    } else if (f.skill === "4-5") {
      if (o.skill_level < 4) return false;
    } else if (f.skill === "non-anzsco") {
      if (!o.is_non_anzsco) return false;
    }

    // 8. Pathway / Special
    if (f.pathway === "direct186") {
      if (!o.direct_186) return false;
    } else if (f.pathway === "freedar") {
      if (!o.dar_fee_free) return false;
    } else if (f.pathway === "nosl5upgrade") {
      if (o.sl5_upgrade_req) return false;
    }
    return true;
  }

  // Tri-state status & matched vs unchecked criteria per occupation row (E15, T13, T26, T30)
  function evaluateRowStatus(o, f) {
    const matched = [];
    const unchecked = [];

    matched.push(
      currentLang === "ko"
        ? `승인 직종 목록 등재 (${o.dama_code} · ANZSCO/OSCA ${o.anzsco_code} · SL${o.skill_level})`
        : `Listed on ${o.dama_code} schedule (${o.anzsco_code} · SL${o.skill_level})`
    );

    if (f.age !== "all") {
      matched.push(
        currentLang === "ko"
          ? `선택 연령 구간(${f.age}) 대비 협약 연령 상한(만 ${o.max_age}세 미만) 부합`
          : `Selected age band (${f.age}) fits DAMA age cap (Under ${o.max_age})`
      );
    }
    if (f.english !== "all") {
      matched.push(
        currentLang === "ko"
          ? `482 단계 영어 완화 기준(${o.english_482}) 필터 부합`
          : `Matches 482 English filter (${o.english_482})`
      );
    }
    if (f.salary !== "all") {
      matched.push(
        currentLang === "ko"
          ? `협약 최저 급여 감면선($${o.min_salary_aud.toLocaleString()}) 필터 부합`
          : `Matches DAMA concession floor ($${o.min_salary_aud.toLocaleString()})`
      );
    }

    // Always list unchecked legal criteria that the UI filter cannot self-certify (T26, T30)
    unchecked.push(
      currentLang === "ko"
        ? `학력·경력 세부 요건 (${o.quals_and_experience}) 및 기술심사(${o.skills_authority}) 충족 여부`
        : `Exact AQF qualification, full-time equivalent work experience (${o.quals_and_experience}), and skills assessment (${o.skills_authority})`
    );
    unchecked.push(
      currentLang === "ko"
        ? `고용주 제시 연봉이 호주 시장임금(AMSR) 이상인지 여부 및 LMT/SMER 구인 증빙`
        : `Employer salary meets Annual Market Salary Rate (AMSR) and LMT/SMER requirements`
    );

    let needsExtraVerification = false;
    let verificationReasonKo = "세부 학력·경력·AMSR·우편번호 확인 필요";
    let verificationReasonEn = "Verify quals, AMSR & employer postcode";

    // Conditional flags that force "Requires Verification" status badge in table
    if (o.dama_id === "sa_regional_workforce_dama" && f.english === "4.5-min40") {
      const saZone = classifySaPostcode(f.location);
      if (saZone !== "outer_regional") {
        needsExtraVerification = true;
        verificationReasonKo = "추가 확인 필요: 고용주 근무지가 SA Outer Regional 우편번호인지 확인 필수";
        verificationReasonEn = "Requires Verification: Confirm employer is in an SA Outer Regional postcode";
        unchecked.unshift(
          currentLang === "ko"
            ? "고용주 소재지가 남호주 Outer Regional SA 공식 우편번호(5220~5734 등)에 해당하는지 여부 (Adelaide Metro 5950 등은 IELTS 4.5 불가)"
            : "Confirm employer workplace postcode is in Official Outer Regional SA (Adelaide Metro e.g. 5950 is ineligible for IELTS 4.5)"
        );
      }
    }

    if (f.pathway === "direct186" || o.direct_186) {
      unchecked.push(
        currentLang === "ko"
          ? "Direct ENS 186 신청 시: 고용주 DAR Endorsement 및 개별 Labour Agreement에 ENS 186 스트림이 승인되어 있는지 여부"
          : "For Direct ENS 186: Confirm employer holds DAR endorsement and an approved Labour Agreement covering the ENS 186 stream"
      );
      if (f.pathway === "direct186") {
        needsExtraVerification = true;
        verificationReasonKo = "추가 확인 필요: 개별 Labour Agreement 내 Direct 186 승인 확인 필수";
        verificationReasonEn = "Requires Verification: Confirm Direct 186 stream in Employer Labour Agreement";
      }
    }

    if (o.dama_id === "wa_statewide_dama" && !f.location && f.region === "wa_statewide_dama") {
      const hasMetro = Boolean(o.wa_cat2_perth || o.wa_metro_available);
      unchecked.push(
        currentLang === "ko"
          ? `고용주 근무지가 퍼스 대도시권(Cat 2: ${hasMetro ? "가능 · 3년 후 186" : "불가"})인지 서호주 지방(Cat 3: 가능 · 2년 후 186)인지 우편번호 확인`
          : `Confirm whether employer postcode is in WA Cat 2 Metro Perth (${hasMetro ? "Eligible · 3y to 186" : "Not Eligible"}) or Cat 3 Regional WA (Eligible · 2y to 186)`
      );
      if (!hasMetro) {
        needsExtraVerification = true;
        verificationReasonKo = "추가 확인 필요: 서호주 지방(Cat 3) 우편번호 전용 (퍼스 대도시권 불가)";
        verificationReasonEn = "Requires Verification: Regional WA (Cat 3) postcodes only (Excludes Metro Perth)";
      }
    }

    if (o.no_186_eng_concession || o.sl5_upgrade_req || o.ila_warning || f.age === "50-54") {
      needsExtraVerification = true;
    }

    return {
      status: needsExtraVerification ? "requires_verification" : "candidate",
      label_ko: needsExtraVerification ? "추가 확인 필요" : "검토 후보",
      label_en: needsExtraVerification ? "Requires Verification" : "Candidate",
      reason_ko: verificationReasonKo,
      reason_en: verificationReasonEn,
      matched_criteria: matched,
      unchecked_criteria: unchecked,
    };
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = t(k);
    });
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.placeholder = t("searchPlaceholder");
    const locInput = document.getElementById("filter-location");
    if (locInput) locInput.placeholder = t("locationPlaceholder");

    document.getElementById("lang-toggle-ko").classList.toggle("active", currentLang === "ko");
    document.getElementById("lang-toggle-en").classList.toggle("active", currentLang === "en");

    // Hydrate dynamic counts & polling status from DATA if loaded
    if (DATA) {
      const totalEl = document.getElementById("results-total-value");
      if (totalEl) totalEl.textContent = DATA.occupations.length.toLocaleString();
      updatePollingIndicators();
    }

    // Populate region dropdown while preserving value
    const regSelect = document.getElementById("filter-region");
    const prevVal = regSelect.value || "all";
    regSelect.innerHTML = `
      <option value="all">${esc(t("optRegionAll"))}</option>
      <option value="state:QLD">${esc(t("optStateQLD"))}</option>
      <option value="fnq_dama">&nbsp;&nbsp;• [QLD] ${esc(currentLang === "ko" ? "FNQ (케언즈 등 공식 11개 LGA · 232건)" : "Far North Queensland (FNQ · 11 Official LGAs · 232)")}</option>
      <option value="tnq_dama">&nbsp;&nbsp;• [QLD] ${esc(currentLang === "ko" ? "TNQ (타운즈빌 · 북부 퀸즐랜드 · 195건)" : "Townsville North Queensland (TNQ · 195)")}</option>
      <option value="state:NSW">${esc(t("optStateNSW"))}</option>
      <option value="orana_dama">&nbsp;&nbsp;• [NSW] ${esc(currentLang === "ko" ? "Orana DAMA (NSW 51개 카운슬 · 현행 129건)" : "Orana DAMA (51 Regional NSW LGAs · 129 Active)")}</option>
      <option value="state:NT">${esc(t("optStateNT"))}</option>
      <option value="nt_dama_iii">&nbsp;&nbsp;• [NT] ${esc(currentLang === "ko" ? "NT DAMA III (다윈·앨리스스프링스 등 NT 전역 · 325건)" : "Northern Territory DAMA III (State-wide · 325)")}</option>
      <option value="state:SA">${esc(t("optStateSA"))}</option>
      <option value="adelaide_city_dama">&nbsp;&nbsp;• [SA] ${esc(currentLang === "ko" ? "Adelaide City Tech (애들레이드 광역 · 2027.01.31 연장 · 65건)" : "Adelaide City Tech DAMA (Extended to 31 Jan 2027 · 65)")}</option>
      <option value="sa_regional_workforce_dama">&nbsp;&nbsp;• [SA] ${esc(currentLang === "ko" ? "SA Regional Workforce (남호주 지방 · 2027.01.31 연장 · 327건)" : "SA Regional Workforce DAMA (Extended to 31 Jan 2027 · 327)")}</option>
      <option value="state:VIC">${esc(t("optStateVIC"))}</option>
      <option value="goulburn_valley_dama">&nbsp;&nbsp;• [VIC] ${esc(currentLang === "ko" ? "Goulburn Valley (셰파튼·캠파스피·모이라 · 184건)" : "Goulburn Valley (GV) DAMA (184)")}</option>
      <option value="great_south_coast_dama">&nbsp;&nbsp;• [VIC] ${esc(currentLang === "ko" ? "Great South Coast (워남불 등 6개 LGA · 114건)" : "Great South Coast (GSC) DAMA (114)")}</option>
      <option value="state:WA">${esc(t("optStateWA"))}</option>
      <option value="wa_statewide_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "WA State-wide 전체 (Cat 2 퍼스 271건 + Cat 3 지방 358건)" : "WA State-wide All (Cat 2 Metro 271 / Cat 3 Regional 358)")}</option>
      <option value="wa_statewide_dama:cat2_metro">&nbsp;&nbsp;&nbsp;&nbsp;↳ [WA Cat 2] ${esc(currentLang === "ko" ? "퍼스 대도시권 (Metro Perth · 271건 · 3년 후 186)" : "WA Category 2 — Metropolitan Perth Only (271 · 3y to 186)")}</option>
      <option value="wa_statewide_dama:cat3_regional">&nbsp;&nbsp;&nbsp;&nbsp;↳ [WA Cat 3] ${esc(currentLang === "ko" ? "서호주 지방 (Regional WA · 358건 · 2년 후 186)" : "WA Category 3 — Regional WA (358 · 2y to 186)")}</option>
      <option value="pilbara_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "Pilbara DAMA (카라사·포트헤들랜드·뉴먼 · 139건)" : "Pilbara DAMA (139)")}</option>
      <option value="goldfields_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "The Goldfields DAMA (신청마감 2026-11-13 / 협약종료 2026-12-31 · 242건)" : "The Goldfields DAMA (Cutoff 2026-11-13 / Expiry 2026-12-31 · 242)")}</option>
      <option value="south_west_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "South West DAMA (신청마감 2026-10-30 / 협약종료 2026-12-14 · 113건)" : "South West DAMA (Cutoff 2026-10-30 / Expiry 2026-12-14 · 113)")}</option>
      <option value="east_kimberley_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "Kimberley DAMA (브룸·쿠누누라·더비·홀스크릭 · 52건)" : "Kimberley (East Kimberley) DAMA (52)")}</option>
    `;
    regSelect.value = prevVal;
  }

  function updatePollingIndicators() {
    if (!DATA || !DATA.meta || !DATA.meta.polling) return;
    const p = DATA.meta.polling;
    const badgeEl = document.getElementById("polling-badge-label");
    const dotEl = document.getElementById("polling-badge-dot");
    const footerEl = document.getElementById("footer-poll-status");
    if (badgeEl) {
      badgeEl.textContent = currentLang === "ko" ? (p.badge_label_ko || t("pollBadge")) : (p.badge_label_en || t("pollBadge"));
    }
    if (dotEl) {
      dotEl.style.background = p.overall_verification_status === "live_hash_unchanged" ? "#4ADE80" : "#F59E0B";
    }
    if (footerEl) {
      footerEl.textContent = `${p.live_count || 0}/${p.total_targets || 15} Live · ${p.cache_count || 0} Cache (${p.overall_verification_status || "monitored"})`;
    }
  }

  function renderCombinatorAlert(f, totalMatches) {
    const banner = document.getElementById("combinator-alert-banner");
    const alerts = [];

    if (f.location) {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[근무지·우편번호 필터 적용 중: "${esc(f.location)}"]</strong> 입력하신 지역·LGA·우편번호가 공식 커버리지에 포함되는 직종 등록 항목만 표시합니다 (예: FNQ는 11개 공식 LGA만 포함·Carpentaria 등 제외 / Goldfields는 Ravensthorpe 포함·Wiluna 제외 / SA 5950은 Adelaide Metro로 분류).</div>`
          : `<div><strong>[Location / Postcode Filter Active: "${esc(f.location)}"]</strong> Showing only occupation entries where "${esc(f.location)}" is within the official LGA/postcode boundary (e.g. FNQ covers 11 LGAs excluding Carpentaria; Goldfields includes Ravensthorpe and excludes Wiluna; SA 5950 is classified as Adelaide Metropolitan).</div>`
      );
    }

    if (f.age === "50-54") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[만 50~54세 연령 상한 및 전환 시점 주의]</strong> DAMA의 만 55세 미만 연령 완화는 <strong>ENS 186 또는 SESR 494 노미네이션 접수 시점</strong>에 적용됩니다 <a href="#fn-3">[3]</a>. 2년 전환 지역에서는 <strong>만 53~54세</strong>(3년 전환 지역인 Pilbara·WA Cat 2 퍼스는 <strong>만 52~54세</strong>)에 SID 482를 먼저 받으면 186 전환 시점에 만 55세가 넘어 186 연령 상한을 초과하게 됩니다(단, 만 52세에 2년 전환 지역 482를 받으면 2년 뒤 만 54세이므로 55세 미만 요건 충족 가능). <strong>대안:</strong> 만 55세 도래 전에 <strong>Subclass 494(SESR)</strong>를 먼저 접수한 뒤 3년 후 연령 제한이 없는 <strong>Subclass 191</strong>로 전환하는 경로를 검토하십시오.</div>`
          : `<div><strong>[Age 50–54 Transition Timing Notice]</strong> The Under-55 age concession applies at <strong>ENS 186 or SESR 494 nomination lodgement</strong> <a href="#fn-3">[3]</a>. On a 2-year pathway, workers aged <strong>53–54</strong> (or aged <strong>52–54</strong> on a 3-year pathway such as Pilbara or WA Cat 2 Metro Perth) who start on SID 482 will reach 55 before ENS 186 nomination (whereas age 52 + 2 years = 54 remains under 55). Consider lodging <strong>Subclass 494 (SESR)</strong> before turning 55 and transitioning to <strong>Subclass 191 (no age limit)</strong>.</div>`
      );
    }

    if (f.english === "4.5-min40") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[IELTS 4.5 (각 과목 4.0 이상) 적용 조건]</strong> <strong>NT DAMA III(196개 직종)</strong> 및 <strong>SA Regional Workforce DAMA(공식 Outer Regional SA 우편번호 5220~5734 소재 고용주 Type 2 한정)</strong>에서만 482/494 단계 IELTS 4.5(각 4.0)가 허용됩니다 <a href="#fn-11">[11]</a> <a href="#fn-15">[15]</a>. 남호주 Adelaide Metropolitan(5000~5199, 5950, 5960) 및 Inner Regional 우편번호는 IELTS 4.5 대상이 아니며, ENS 186 단계에서는 별도 영어 기준(IELTS 5.0 등)을 다시 충족해야 합니다.</div>`
          : `<div><strong>[IELTS 4.5 (min 4.0 each) Rules]</strong> Accepted for 482/494 only in <strong>NT DAMA III (196 occupations)</strong> and <strong>SA Regional Workforce DAMA (Type 2 — verified Outer Regional SA postcodes only)</strong> <a href="#fn-11">[11]</a> <a href="#fn-15">[15]</a>. Adelaide Metropolitan postcodes (including 5950 and 5960) and Inner Regional SA postcodes do NOT qualify for IELTS 4.5, and ENS 186 requires separate English assessment.</div>`
      );
    }

    if (f.region === "south_west_dama" || f.region === "goldfields_dama") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[서호주 일몰 협약 마감일 구분 안내]</strong> • <strong>South West DAMA:</strong> 신청·변경 접수 마감 <strong>2026-10-30</strong> / 협약 종료 <strong>2026-12-14</strong> (ENS 186 영어 감면 없음 — IELTS 각 6.0 필수) <a href="#fn-26">[26]</a> <a href="#fn-27">[27]</a>.<br/>• <strong>Goldfields DAMA:</strong> 신청 접수 마감 <strong>2026-11-13</strong> / 협약 종료 <strong>2026-12-31</strong> (11월 13일 이후 신규 신청 불가 · 단, 협약 종료가 기존 승인된 고용주 Labour Agreement나 기존 비자를 자동 취소시키지 않음) <a href="#fn-24">[24]</a>.</div>`
          : `<div><strong>[WA Sunset DAMA Cutoff vs Expiry Dates]</strong> • <strong>South West DAMA:</strong> Application/Variation Cutoff <strong>2026-10-30</strong> / Agreement Expiry <strong>2026-12-14</strong> (No ENS 186 English concession — IELTS 6.0 each required) <a href="#fn-26">[26]</a> <a href="#fn-27">[27]</a>.<br/>• <strong>Goldfields DAMA:</strong> Application Cutoff <strong>2026-11-13</strong> / Agreement Expiry <strong>2026-12-31</strong> (Closed to new applications after 13 Nov 2026; existing approved Labour Agreements and visas are NOT automatically cancelled) <a href="#fn-24">[24]</a>.</div>`
      );
    }

    if (alerts.length === 0) {
      banner.style.display = "none";
      banner.innerHTML = "";
    } else {
      banner.style.display = "block";
      banner.innerHTML = alerts.join('<hr style="border:none;border-top:1px solid #D9A7AD;margin:8px 0;"/>');
    }
  }

  function renderRegionCards(f) {
    const grid = document.getElementById("region-cards-grid");
    const countsByDama = {};
    DATA.damas.forEach((d) => {
      countsByDama[d.id] = 0;
    });

    DATA.occupations.forEach((o) => {
      if (rowMatches(o, f, true)) {
        countsByDama[o.dama_id] = (countsByDama[o.dama_id] || 0) + 1;
      }
    });

    const htmlCards = DATA.damas.map((d) => {
      const matchCount = countsByDama[d.id] || 0;
      const isSelected = f.region === d.id || f.region.startsWith(d.id + ":");
      const cardCls = [
        "dama-card",
        isSelected ? "selected" : "",
        matchCount === 0 ? "zero-matches" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const name = currentLang === "ko" ? d.name_ko : d.name_en;
      const lga = currentLang === "ko" ? d.lgas_ko : d.lgas_en;
      const salBadge =
        d.min_salary_floor_aud === 67510
          ? `<span class="badge badge-burgundy" data-balloon="${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}">85% CSIT ($67,510 · AMSR 필수) <span class="balloon-icon">?</span></span>`
          : d.tsmit_concession_count > 0
          ? `<span class="badge badge-teal" data-balloon="${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}">90% CSIT ($71,481 · ${d.tsmit_concession_count}) <span class="balloon-icon">?</span></span>`
          : `<span class="badge badge-neutral">$79,423 CSIT</span>`;

      const feeBadge = d.dar_fee_free
        ? `<span class="badge badge-success" data-balloon="${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}">DAR $0 FREE <span class="balloon-icon">?</span></span>`
        : `<span class="badge badge-neutral" data-balloon="${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}">${esc(d.code)} DAR <span class="balloon-icon">?</span></span>`;

      const directBadge = d.direct_186
        ? `<span class="badge badge-warn" data-balloon="${esc(currentLang === "ko" ? d.pr_rule_ko : d.pr_rule_en)}">Direct 186 (조건부) <span class="balloon-icon">?</span></span>`
        : "";

      const sunsetBadge = d.sunset_warning
        ? `<span class="badge badge-danger" data-balloon="${esc(currentLang === "ko" ? d.sunset_note_ko : d.sunset_note_en)}">⏰ ${esc(d.new_application_cutoff ? `마감 ${d.new_application_cutoff} / 종료 ${d.head_agreement_expiry}` : d.sunset_date)} <span class="balloon-icon">?</span></span>`
        : "";

      return `
        <div class="${cardCls}" data-dama-card="${esc(d.id)}">
          <div>
            <div class="dama-card-top">
              <span class="dama-num">${String(d.order).padStart(2, "0")}</span>
              <span class="state-tag">${esc(d.state)} · ${esc(d.code)}</span>
            </div>
            <h3 class="clickable" data-select-dama="${esc(d.id)}">${esc(name)}</h3>
            <div class="dama-card-lga" title="${esc(lga)}">${esc(lga)}</div>
            <div class="dama-badges">
              ${salBadge}
              ${feeBadge}
              ${directBadge}
              ${sunsetBadge}
            </div>
          </div>
          <div class="dama-card-footer">
            <span class="match-pill clickable" data-select-dama="${esc(d.id)}">
              ${currentLang === "ko" ? `탐색 항목 ${matchCount}건` : `${matchCount} Matching Entries`}
            </span>
            <button type="button" class="btn-region-detail" data-open-region="${esc(d.id)}">
              ${esc(t("regDetailBtn"))}
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = htmlCards.join("");
  }

  function renderTable() {
    const tbody = document.getElementById("occ-table-body");
    const countEl = document.getElementById("results-count-value");
    countEl.textContent = filteredOccupations.length.toLocaleString();

    const totalPages = Math.max(1, Math.ceil(filteredOccupations.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageRows = filteredOccupations.slice(startIdx, startIdx + PAGE_SIZE);
    const f = getFilters();

    if (pageRows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:36px;color:#5A5654;">
            ${
              currentLang === "ko"
                ? "선택하신 조건에 부합하는 직종 등록 항목이 없습니다. 위 필터 조건이나 근무지 우편번호를 조정하거나 [필터 초기화]를 눌러보세요."
                : "No occupation entries match all selected filters. Try adjusting your filters or location query, or click Reset Filters."
            }
          </td>
        </tr>
      `;
    } else {
      const damaMap = getDamaMap();

      tbody.innerHTML = pageRows
        .map((o) => {
          const d = damaMap[o.dama_id];
          const damaName = currentLang === "ko" ? o.dama_name_ko : o.dama_name_en;
          const fnLinks = o.footnote_ids.map((fid) => `<a href="#fn-${fid}" class="fn-ref">[${fid}]</a>`).join(" ");
          const rowEval = evaluateRowStatus(o, f);

          // Salary badge with balloon
          const salBalloon =
            currentLang === "ko"
              ? `[${damaName} 급여 규칙] ${o.min_salary_2026} — ${o.tsmit_detail}. ${d.salary_rule_ko}`
              : `[${damaName} Salary Rule] ${o.min_salary_2026} — ${o.tsmit_detail}. ${d.salary_rule_en}`;
          const salBadge =
            o.min_salary_aud === 67510
              ? `<span class="badge badge-burgundy" data-balloon="${esc(salBalloon)}">$67,510 (85% · AMSR 필수) <span class="balloon-icon">?</span></span>`
              : o.tsmit_concession
              ? `<span class="badge badge-teal" data-balloon="${esc(salBalloon)}">$71,481 (90% CSIT) <span class="balloon-icon">?</span></span>`
              : `<span class="badge badge-neutral" data-balloon="${esc(salBalloon)}">$79,423 (표준 CSIT) <span class="balloon-icon">?</span></span>`;

          // English badge with balloon (explicitly showing 482, 494, and 186)
          const engBalloon =
            currentLang === "ko"
              ? `[482 영어]: ${o.english_482 || o.english_482_494} | [494 영어]: ${o.english_494 || o.english_482_494} | [186 영어]: ${o.english_186}. ${d.eng_rule_ko}`
              : `[482 English]: ${o.english_482 || o.english_482_494} | [494 English]: ${o.english_494 || o.english_482_494} | [186 English]: ${o.english_186}. ${d.eng_rule_en}`;
          const engBadge = o.english_concession
            ? `<span class="badge badge-teal" data-balloon="${esc(engBalloon)}">${esc((o.english_482 || o.english_482_494).slice(0, 38))} <span class="balloon-icon">?</span></span>`
            : `<span class="badge badge-neutral" data-balloon="${esc(engBalloon)}">${currentLang === "ko" ? "표준 영어 점수" : "Standard English"} <span class="balloon-icon">?</span></span>`;

          const swEngWarn =
            o.no_186_eng_concession && o.english_concession
              ? `<div style="margin-top:4px;"><span class="badge badge-danger" data-balloon="${esc(currentLang === "ko" ? "사우스 웨스트 DAMA는 186 영주권 단계에 영어 감면이 없어 IELTS 각 과목 6.0이 필수입니다." : "South West DAMA has NO English concession at the ENS 186 stage (requires IELTS 6.0 each band).")}">186 IELTS 6.0 필수! <span class="balloon-icon">?</span></span></div>`
              : `<div style="font-size:11.5px;color:#5A5654;margin-top:3px;">186: ${esc(o.english_186.slice(0, 36))}</div>`;

          // Age & PR badge with balloon
          const prBalloon =
            currentLang === "ko"
              ? `[연령 상한]: 만 ${o.max_age}세 미만 (494 및 186 노미네이션 시점 기준) | [영주권 경로]: ${o.pr_pathway_summary}. ${d.pr_rule_ko}`
              : `[Max Age]: Under ${o.max_age} (at 494/186 nomination) | [PR Pathway]: ${o.pr_pathway_summary}. ${d.pr_rule_en}`;
          const ageBadge = `<span class="badge ${o.max_age === 55 ? "badge-success" : "badge-warn"}" data-balloon="${esc(prBalloon)}">${currentLang === "ko" ? `만 ${o.max_age}세 미만` : `Under ${o.max_age}`} <span class="balloon-icon">?</span></span>`;

          const directBadge = o.direct_186
            ? `<span class="badge badge-warn" data-balloon="${esc(currentLang === "ko" ? "조건부 Direct ENS 186: 2년 지역 경력 외에 고용주 DAR Endorsement 및 개별 Labour Agreement 내 ENS 186 승인 확인이 필수입니다." : "Conditional Direct ENS 186: Requires verified DAR endorsement and ENS 186 stream in the employer's Labour Agreement in addition to 2y regional work.")}">Direct 186 (조건부) <span class="balloon-icon">?</span></span>`
            : "";

          const sl5Warn = o.sl5_upgrade_req
            ? `<div style="margin-top:4px;"><span class="badge badge-warn" data-balloon="${esc(currentLang === "ko" ? "이 지역(GV / Townsville)에서 Skill Level 5 근로자가 ENS 186 영주권을 신청하려면 반드시 Skill Level 1~4 상위 직종으로 승진하여 최소 2년간 근무해야 합니다." : "In GV and Townsville DAMAs, Skill Level 5 workers must upgrade/progress into a Skill Level 1–4 role for at least 2 years to qualify for ENS 186.")}">SL1–4 승진 필수 <span class="balloon-icon">?</span></span></div>`
            : "";

          const zoneNote = o.availability_zone
            ? `<div style="font-size:11px;color:#7A1F2B;font-weight:700;margin-top:2px;">📍 ${esc(o.availability_zone)}</div>`
            : "";

          const legacyNote = o.legacy_anzsco_alias
            ? ` <span style="font-size:11px;color:#5A5654;">(구 코드: ${esc(o.legacy_anzsco_alias)})</span>`
            : "";

          const statusBadgeCls = rowEval.status === "candidate" ? "badge-success" : "badge-warn";
          const statusLabel = currentLang === "ko" ? rowEval.label_ko : rowEval.label_en;
          const statusBalloon =
            currentLang === "ko"
              ? `[판정: ${rowEval.label_ko}] 충족 필터: ${rowEval.matched_criteria.join("; ")} | 미확인 필수 검증 항목: ${rowEval.unchecked_criteria.join("; ")}`
              : `[Status: ${rowEval.label_en}] Matched: ${rowEval.matched_criteria.join("; ")} | Unchecked criteria: ${rowEval.unchecked_criteria.join("; ")}`;

          const qualsBalloon =
            currentLang === "ko"
              ? `[학력·경력 상세]: ${o.quals_and_experience} | [기술심사 기관]: ${o.skills_authority}. ${d.quals_rule_ko}`
              : `[Qualifications & Experience]: ${o.quals_and_experience} | [Skills Authority]: ${o.skills_authority}. ${d.quals_rule_en}`;

          return `
            <tr>
              <td>
                <div style="font-weight:800;color:#2E2E2E;">${esc(damaName)}</div>
                <div style="font-size:12px;color:#5A5654;margin-top:2px;">
                  <span class="state-tag" style="font-size:10px;padding:1px 6px;">${esc(o.state)}</span>
                  <button type="button" class="btn-region-detail" style="padding:1px 6px;font-size:11px;margin-left:4px;" data-open-region="${esc(o.dama_id)}">${currentLang === "ko" ? "우편번호·지역규칙" : "Postcodes"}</button>
                  ${fnLinks}
                </div>
                ${zoneNote}
              </td>
              <td>
                <div class="occ-title-main">${esc(o.occupation_title)}</div>
                <div class="occ-specs">
                  ${o.classification_scheme || "ANZSCO"}: <strong>${esc(o.anzsco_code)}</strong>${legacyNote}
                  ${o.is_non_anzsco ? `<span class="badge badge-burgundy" style="font-size:10.5px;padding:1px 5px;">Non-ANZSCO</span>` : ""}
                  ${o.category_or_group ? ` · <span>${esc(o.category_or_group)}</span>` : ""}
                </div>
                ${o.specialisations ? `<div class="occ-specs">${currentLang === "ko" ? "세부전공:" : "Specs:"} ${esc(o.specialisations)}</div>` : ""}
              </td>
              <td>
                <span class="badge ${o.skill_level <= 3 ? "badge-teal" : o.skill_level === 4 ? "badge-burgundy" : "badge-neutral"}" data-balloon="${esc(qualsBalloon)}">
                  SL ${o.skill_level} <span class="balloon-icon">?</span>
                </span>
              </td>
              <td>
                ${salBadge}
                <div style="font-size:11.5px;color:#5A5654;margin-top:3px;">${esc(o.tsmit_detail.slice(0, 44))}</div>
              </td>
              <td>
                ${engBadge}
                ${swEngWarn}
              </td>
              <td>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">
                  ${ageBadge}
                  ${directBadge}
                </div>
                <div style="font-size:11.5px;color:#5A5654;margin-top:3px;">${esc(o.pr_pathway_summary.slice(0, 56))}</div>
                ${sl5Warn}
              </td>
              <td>
                <div style="font-size:12.5px;color:#2E2E2E;" data-balloon="${esc(qualsBalloon)}">
                  ${esc(o.quals_and_experience.slice(0, 72))}${o.quals_and_experience.length > 72 ? "..." : ""}
                  <span class="balloon-icon">?</span>
                </div>
                <div style="font-size:11px;color:#1F5A5E;font-weight:700;margin-top:2px;">
                  ${currentLang === "ko" ? "기술심사:" : "Assessment:"} ${esc(o.skills_authority.slice(0, 38))}
                </div>
              </td>
              <td>
                <div style="margin-bottom:5px;">
                  <span class="badge ${statusBadgeCls}" data-balloon="${esc(statusBalloon)}">${esc(statusLabel)} <span class="balloon-icon">?</span></span>
                </div>
                <button type="button" class="btn-open-modal" data-occ-id="${o.id}">
                  ${esc(t("btnRowModal"))}
                </button>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    // Pagination controls
    const pageInfo = document.getElementById("page-info");
    pageInfo.textContent =
      currentLang === "ko"
        ? `총 ${filteredOccupations.length.toLocaleString()}건 중 ${filteredOccupations.length ? startIdx + 1 : 0}–${Math.min(startIdx + PAGE_SIZE, filteredOccupations.length)} 표시 (페이지 ${currentPage} / ${totalPages})`
        : `Showing ${filteredOccupations.length ? startIdx + 1 : 0}–${Math.min(startIdx + PAGE_SIZE, filteredOccupations.length)} of ${filteredOccupations.length.toLocaleString()} entries (Page ${currentPage} of ${totalPages})`;

    document.getElementById("btn-prev-page").disabled = currentPage <= 1;
    document.getElementById("btn-next-page").disabled = currentPage >= totalPages;
  }

  function applyFilters(resetPage) {
    if (resetPage) currentPage = 1;
    const f = getFilters();
    const clearBtn = document.getElementById("clear-search-btn");
    clearBtn.style.display = f.q ? "inline-flex" : "none";

    filteredOccupations = DATA.occupations.filter((o) => rowMatches(o, f, false));
    renderCombinatorAlert(f, filteredOccupations.length);
    renderRegionCards(f);
    renderTable();
  }

  function openOccupationModal(occId) {
    const o = DATA.occupations.find((x) => x.id === Number(occId));
    if (!o) return;
    const d = DATA.damas.find((x) => x.id === o.dama_id);
    const modal = document.getElementById("detail-modal");
    const titleEl = document.getElementById("modal-title");
    const bodyEl = document.getElementById("modal-body-content");
    const f = getFilters();
    const rowEval = evaluateRowStatus(o, f);

    const damaName = currentLang === "ko" ? o.dama_name_ko : o.dama_name_en;
    titleEl.textContent = `${o.occupation_title} (${o.classification_scheme || "ANZSCO"} ${o.anzsco_code} · Skill Level ${o.skill_level}) — ${damaName}`;

    const fnRefs = o.footnote_ids
      .map((id) => {
        const fn = DATA.footnotes.find((fnItem) => fnItem.id === id);
        return fn
          ? `<li><strong>[${fn.id}] ${esc(fn.org)}:</strong> <a href="${esc(fn.url)}" target="_blank" rel="noopener">${esc(fn.title)} (${esc(fn.date)}) ↗</a></li>`
          : "";
      })
      .join("");

    // Accurate transition period & age trap calculation (T11, T17, T18, T19)
    let transitionTrackKo = "";
    let transitionTrackEn = "";
    let transitionYearsForAge = o.dama_id === "pilbara_dama" ? 3 : 2;

    if (o.dama_id === "wa_statewide_dama") {
      if (o.wa_cat2_perth || o.wa_metro_available) {
        transitionYearsForAge = 3; // Conservative 3y warning for Perth Metro
        transitionTrackKo = `<strong>WA State-wide 전환 기간 (지역별 구분 필수):</strong> <strong>Category 2 (퍼스 대도시권 Metro Perth, 우편번호 6000~6199 등): 최소 3년</strong> 풀타임 근무 후 ENS 186 전환 / <strong>Category 3 (서호주 지방 Regional WA): 최소 2년</strong> 풀타임 근무 후 ENS 186 전환이 적용됩니다.`;
        transitionTrackEn = `<strong>WA State-wide Transition Period (Category-Specific):</strong> <strong>Category 2 (Metropolitan Perth, postcodes 6000–6199 etc.): minimum 3 years</strong> full-time work before ENS 186 / <strong>Category 3 (Regional WA): minimum 2 years</strong> full-time work before ENS 186.`;
      } else {
        transitionYearsForAge = 2;
        transitionTrackKo = `<strong>WA Category 3 (서호주 지방 Regional WA 전용 · 퍼스 대도시권 불가):</strong> 이 직종은 퍼스 대도시권(Cat 2)에서는 스폰서십이 불가하며, 서호주 지방(Cat 3) 우편번호 소재 고용주 밑에서 <strong>최소 2년</strong> 풀타임 근무 후 ENS 186 전환이 가능합니다.`;
        transitionTrackEn = `<strong>WA Category 3 (Regional WA Only · Excludes Metro Perth):</strong> Not available in Category 2 Metropolitan Perth. Requires <strong>minimum 2 years</strong> full-time work in a Category 3 Regional WA postcode before ENS 186.`;
      }
    } else if (o.dama_id === "pilbara_dama") {
      transitionTrackKo = `<strong>기본 트랙 (만 ${o.max_age - 3 - 1}세 이하):</strong> <strong>SID Subclass 482 (Labour Agreement Stream)</strong>로 스폰서십 승인 후 <strong>3년</strong> 풀타임 근무 뒤 <strong>ENS Subclass 186 영주권</strong>으로 전환합니다.`;
      transitionTrackEn = `<strong>Standard Track (Under Age ${o.max_age - 3}):</strong> Start on <strong>SID Subclass 482 (Labour Agreement Stream)</strong> and transition to <strong>ENS Subclass 186 PR</strong> after <strong>3 years</strong> of full-time regional work.`;
    } else {
      transitionTrackKo = `<strong>기본 트랙 (만 ${o.max_age - 2 - 1}세 이하):</strong> <strong>SID Subclass 482 (Labour Agreement Stream)</strong>로 스폰서십 승인 후 <strong>2년</strong> 풀타임 근무 뒤 <strong>ENS Subclass 186 영주권</strong>으로 전환합니다.`;
      transitionTrackEn = `<strong>Standard Track (Under Age ${o.max_age - 2}):</strong> Start on <strong>SID Subclass 482 (Labour Agreement Stream)</strong> and transition to <strong>ENS Subclass 186 PR</strong> after <strong>2 years</strong> of full-time regional work.`;
    }

    const trapStart = o.max_age - transitionYearsForAge;
    const trapEnd = o.max_age - 1;
    const trapRangeStr = trapStart <= trapEnd ? `${trapStart}~${trapEnd}` : `${trapEnd}`;

    let strategyHtml = "";
    if (currentLang === "ko") {
      strategyHtml = `
        <ul style="padding-left:18px;font-size:14px;line-height:1.7;">
          <li>${transitionTrackKo}</li>
          <li><strong>연령 전환 시점 주의 구간 (만 ${trapRangeStr}세):</strong> 연령 상한(만 ${o.max_age}세 미만)은 <strong>ENS 186 노미네이션 접수 시점</strong>에 적용됩니다. 따라서 ${transitionYearsForAge}년 전환 경로 기준 만 ${trapRangeStr}세에 482를 먼저 받으면 ${transitionYearsForAge}년 뒤 만 ${o.max_age}세 이상이 되어 186 전환이 불가할 수 있습니다(반면 만 ${trapStart - 1}세 이하는 ${transitionYearsForAge}년 뒤 만 ${o.max_age - 1}세 이하이므로 상한 내). 해당 연령대는 만 ${o.max_age}세 도래 전에 <strong>SESR Subclass 494 비자</strong>를 먼저 접수한 뒤 3년 후 <strong>연령 제한이 없는 Subclass 191 영주권</strong>으로 전환하는 방안을 검토하십시오.</li>
          ${o.direct_186 ? `<li style="color:#7A1F2B;font-weight:700;">★ 조건부 Direct ENS 186 조항 (추가 확인 필수): 이 지역은 비-DAMA 임시비자 2년 지역 경력을 인정하는 조항이 있으나, 자동으로 신청 가능한 것이 아니라 ① 스폰서 고용주의 DAR Endorsement, ② 개별 Labour Agreement 내 ENS 186 스트림 승인 여부, ③ 해당 직종·숙련도 요건 충족이 반드시 확인되어야 합니다.</li>` : ""}
          ${o.sl5_upgrade_req ? `<li style="color:#B23A2E;font-weight:700;">⚠ Skill Level 5 승진 필수 주의: 이 지역에서는 SL5 직종 근로자가 ENS 186 영주권을 받으려면 반드시 Skill Level 1~4 상위 직종으로 승진(Progression)하여 최소 2년간 근무해야 합니다.</li>` : ""}
          ${o.no_186_eng_concession ? `<li style="color:#B23A2E;font-weight:700;">⚠ 186 영어 함정 주의: 사우스 웨스트 DAMA는 ENS 186 단계에서 영어 감면이 없어 IELTS 각 6.0이 필수입니다.</li>` : ""}
        </ul>
      `;
    } else {
      strategyHtml = `
        <ul style="padding-left:18px;font-size:14px;line-height:1.7;">
          <li>${transitionTrackEn}</li>
          <li><strong>Age ${trapRangeStr} Transition Timing Notice (Under-${o.max_age} Cap):</strong> Because the Under-${o.max_age} age cap applies at ENS 186 nomination lodgement, applicants aged ${trapRangeStr} on a ${transitionYearsForAge}-year transition pathway will reach ${o.max_age}+ before 186 nomination (whereas age ${trapStart - 1} + ${transitionYearsForAge}y = ${o.max_age - 1} remains under ${o.max_age}). Applicants aged ${trapRangeStr} should consider lodging <strong>SESR Subclass 494</strong> before turning ${o.max_age}, then transitioning after 3 years to <strong>Subclass 191 PR (no age limit)</strong>.</li>
          ${o.direct_186 ? `<li style="color:#7A1F2B;font-weight:700;">★ Conditional Direct ENS 186 Provision (Requires Verification): While this DAMA allows counting 2 years of regional work on non-DAMA temporary visas, Direct ENS 186 is NOT automatic — it requires verified employer DAR endorsement, an approved Labour Agreement covering the ENS 186 stream, and occupation/skill-level compliance.</li>` : ""}
          ${o.sl5_upgrade_req ? `<li style="color:#B23A2E;font-weight:700;">⚠ SL5 Promotion Requirement: Skill Level 5 workers in this DAMA must progress into a Skill Level 1–4 occupation for at least 2 years to qualify for ENS 186.</li>` : ""}
        </ul>
      `;
    }

    const matchedListHtml = rowEval.matched_criteria.map((c) => `<li>✓ ${esc(c)}</li>`).join("");
    const uncheckedListHtml = rowEval.unchecked_criteria.map((c) => `<li>⚠ ${esc(c)}</li>`).join("");

    bodyEl.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:16px;">
        <div style="background:#E7F3EC;border-left:4px solid #2E6B4F;padding:12px 14px;border-radius:0 8px 8px 0;">
          <h4 style="color:#2E6B4F;font-size:13.5px;font-weight:800;margin-bottom:6px;">
            ${currentLang === "ko" ? `탐색 상태: ${rowEval.label_ko} — 충족된 필터 조건` : `Explorer Status: ${rowEval.label_en} — Matched Filter Criteria`}
          </h4>
          <ul style="padding-left:16px;font-size:12.5px;line-height:1.55;margin:0;">${matchedListHtml}</ul>
        </div>
        <div style="background:#FFF8E7;border-left:4px solid #D97706;padding:12px 14px;border-radius:0 8px 8px 0;">
          <h4 style="color:#B45309;font-size:13.5px;font-weight:800;margin-bottom:6px;">
            ${currentLang === "ko" ? "미확인 · 추가 확인 필수 요건 (Unchecked Criteria)" : "Unchecked Criteria Requiring Legal/DAR Verification"}
          </h4>
          <ul style="padding-left:16px;font-size:12.5px;line-height:1.55;margin:0;">${uncheckedListHtml}</ul>
        </div>
      </div>

      <div style="background:#F2E4E5;border-left:5px solid #7A1F2B;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:18px;">
        <h4 style="color:#7A1F2B;font-size:15px;font-weight:800;margin-bottom:6px;">
          ${currentLang === "ko" ? "비자 경로 및 전환 기간 상세 가이드 (Visa Pathway & Transition Rules)" : "Visa Pathway & Transition Period Rules"}
        </h4>
        ${strategyHtml}
      </div>

      <div class="modal-grid">
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "1. 급여 요건 (CSIT / TSMIT Concession & AMSR)" : "1. Salary Threshold, Concession & Market Rate (AMSR)"}</h4>
          <p><strong>${esc(o.min_salary_2026)}</strong></p>
          <p style="font-size:13px;color:#5A5654;margin-top:4px;">${esc(o.tsmit_detail)}</p>
          <p style="font-size:12.5px;color:#5A5654;margin-top:4px;">${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}</p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "2. 비자 단계별 영어 점수 요건 (482 vs 494 vs 186)" : "2. Visa-Stage English Requirements (482 vs 494 vs 186)"}</h4>
          <p><strong>SID 482:</strong> ${esc(o.english_482 || o.english_482_494)}</p>
          <p><strong>SESR 494:</strong> ${esc(o.english_494 || o.english_482_494)}</p>
          <p><strong>ENS 186:</strong> ${esc(o.english_186)}</p>
          <p style="font-size:12.5px;color:#5A5654;margin-top:4px;">${esc(currentLang === "ko" ? d.eng_rule_ko : d.eng_rule_en)}</p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "3. 학력 · 경력 · 기술심사 요건" : "3. Qualifications, Work Experience & Skills Assessment"}</h4>
          <p><strong>${currentLang === "ko" ? "요구 학력·경력:" : "Rule:"}</strong> ${esc(o.quals_and_experience)}</p>
          <p style="margin-top:4px;"><strong>${currentLang === "ko" ? "기술심사 기관:" : "Assessing Authority:"}</strong> ${esc(o.skills_authority)}</p>
          <p style="font-size:12.5px;color:#5A5654;margin-top:4px;">${esc(currentLang === "ko" ? d.quals_rule_ko : d.quals_rule_en)}</p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "4. 스폰서 고용주 소재지 (포함 카운슬 & 우편번호)" : "4. Eligible Employer Location (LGAs & Postcodes)"}</h4>
          <p><strong>DAR:</strong> <a href="${esc(d.dar_url)}" target="_blank" rel="noopener">${esc(currentLang === "ko" ? d.dar_ko : d.dar_en)} ↗</a></p>
          <p><strong>DAR Fee:</strong> ${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}</p>
          ${o.availability_zone ? `<p style="color:#7A1F2B;font-weight:700;"><strong>Zone:</strong> ${esc(o.availability_zone)}</p>` : ""}
          <p><strong>Postcodes:</strong> <code>${esc(d.postcodes)}</code></p>
          <p style="font-size:12.5px;color:#5A5654;margin-top:4px;">${esc(currentLang === "ko" ? d.lgas_ko : d.lgas_en)}</p>
        </div>
      </div>

      <div class="modal-box" style="margin-bottom:18px;">
        <h4>${currentLang === "ko" ? "5. 1차 공식 출처 및 각주 (Primary Source Footnotes)" : "5. Verified Official Sources & Footnotes"}</h4>
        <ul style="padding-left:18px;font-size:13px;">${fnRefs}</ul>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#1A1211;color:#FFFFFF;padding:16px 20px;border-radius:10px;">
        <div>
          <strong style="display:block;font-size:15px;">${currentLang === "ko" ? "이 직종·지역으로 비자 또는 고용주 스폰서십을 준비 중이신가요?" : "Planning a DAMA sponsorship or visa application for this occupation?"}</strong>
          <span style="font-size:13px;color:#CFC9BF;">${currentLang === "ko" ? "법무법인 박앤코 박창민 대표변호사 (QLS 공인 이민법 전문변호사) · enquiry@parkcolawyers.com" : "Park & Co Lawyers · Chang Min Park (QLS Accredited Specialist) · enquiry@parkcolawyers.com"}</span>
        </div>
        <a href="https://parklawyers.com.au/links/?lang=ko" target="_blank" rel="noopener" class="btn-burgundy">
          ${currentLang === "ko" ? "박앤코 온라인 상담 문의하기 →" : "Enquire with Park & Co Lawyers →"}
        </a>
      </div>
    `;

    modal.classList.add("open");
  }

  function openRegionModal(damaId) {
    const d = DATA.damas.find((x) => x.id === damaId);
    if (!d) return;
    const modal = document.getElementById("detail-modal");
    const titleEl = document.getElementById("modal-title");
    const bodyEl = document.getElementById("modal-body-content");

    titleEl.textContent =
      currentLang === "ko"
        ? `${d.name_ko} (${d.name_en}) — 지역 전체 협약 요건 및 우편번호 가이드`
        : `${d.name_en} — Complete Regional Rules & Postcode Coverage`;

    const fnRefs = d.footnote_ids
      .map((id) => {
        const fn = DATA.footnotes.find((f) => f.id === id);
        return fn
          ? `<li><strong>[${fn.id}] ${esc(fn.org)}:</strong> <a href="${esc(fn.url)}" target="_blank" rel="noopener">${esc(fn.title)} (${esc(fn.date)}) ↗</a></li>`
          : "";
      })
      .join("");

    const lifecycleHtml =
      d.new_application_cutoff || d.head_agreement_expiry
        ? `<p style="margin-top:6px;color:#7A1F2B;font-weight:700;">
            ${
              currentLang === "ko"
                ? `일정 구분: 신청 접수 마감 ${d.new_application_cutoff || "연중 상시"} / 협약 종료 ${d.head_agreement_expiry || "연중"} (${d.sunset_note_ko || ""})`
                : `Schedule: Application Cutoff ${d.new_application_cutoff || "Open"} / Agreement Expiry ${d.head_agreement_expiry || "Current"} (${d.sunset_note_en || ""})`
            }
          </p>`
        : "";

    bodyEl.innerHTML = `
      <div class="modal-grid">
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "관할 DAR 기관 및 승인 수수료" : "Designated Area Representative (DAR) & Fee"}</h4>
          <p><strong>${esc(currentLang === "ko" ? d.dar_ko : d.dar_en)}</strong></p>
          <p style="margin-top:4px;"><strong>Fee:</strong> ${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}</p>
          <p style="margin-top:4px;"><strong>LMT:</strong> ${esc(currentLang === "ko" ? d.lmt_rule_ko : d.lmt_rule_en)}</p>
          ${lifecycleHtml}
          <p style="margin-top:6px;"><a href="${esc(d.dar_url)}" target="_blank" rel="noopener">${currentLang === "ko" ? "공식 DAR 웹사이트 열기 ↗" : "Open Official DAR Website ↗"}</a> | <a href="${esc(d.occ_list_url)}" target="_blank" rel="noopener">${currentLang === "ko" ? "공식 직종 리스트 원문 ↗" : "Official Occupation List ↗"}</a></p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "포함 카운슬(LGA) 및 우편번호(Postcodes)" : "Covered LGAs & Postcodes"}</h4>
          <p><strong>Postcodes:</strong> <code>${esc(d.postcodes)}</code></p>
          <p style="margin-top:6px;font-size:13.5px;">${esc(currentLang === "ko" ? d.lgas_ko : d.lgas_en)}</p>
          ${
            d.excluded_lgas && d.excluded_lgas.length
              ? `<p style="margin-top:6px;font-size:12px;color:#B23A2E;"><strong>${currentLang === "ko" ? "제외 LGA 주의:" : "Excluded LGAs:"}</strong> ${esc(d.excluded_lgas.join(", "))}</p>`
              : ""
          }
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "급여(CSIT) 및 영어(English) Concession" : "Salary (CSIT) & English Concessions"}</h4>
          <p><strong>Salary:</strong> ${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}</p>
          <p style="margin-top:6px;"><strong>English:</strong> ${esc(currentLang === "ko" ? d.eng_rule_ko : d.eng_rule_en)}</p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "연령 상한 · 학력/경력 · 영주권(ENS 186) 전환" : "Age Cap, Qualifications & ENS 186 PR Pathway"}</h4>
          <p><strong>Age:</strong> ${esc(currentLang === "ko" ? d.age_rule_ko : d.age_rule_en)}</p>
          <p style="margin-top:4px;"><strong>Quals/Exp:</strong> ${esc(currentLang === "ko" ? d.quals_rule_ko : d.quals_rule_en)}</p>
          <p style="margin-top:4px;"><strong>PR (186):</strong> ${esc(currentLang === "ko" ? d.pr_rule_ko : d.pr_rule_en)}</p>
        </div>
      </div>

      <div class="modal-box" style="margin-bottom:18px;">
        <h4>${currentLang === "ko" ? "공식 1차 출처 각주 (Footnotes)" : "Official Primary Source Footnotes"}</h4>
        <ul style="padding-left:18px;font-size:13px;">${fnRefs}</ul>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <button type="button" class="btn-secondary" id="modal-filter-this-region" data-dama="${esc(d.id)}">
          ${currentLang === "ko" ? `이 지역(${d.code}) 직종 항목 ${d.total_occupations}건만 테이블에 필터링하기` : `Filter Table to ${d.code} (${d.total_occupations} occupation entries)`}
        </button>
        <a href="https://parklawyers.com.au/links/?lang=ko" target="_blank" rel="noopener" class="btn-burgundy">
          ${currentLang === "ko" ? "박앤코 상담·문의하기 →" : "Make an Enquiry →"}
        </a>
      </div>
    `;

    const filterBtn = document.getElementById("modal-filter-this-region");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        document.getElementById("filter-region").value = d.id;
        modal.classList.remove("open");
        applyFilters(true);
        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });
      });
    }

    modal.classList.add("open");
  }

  async function openPollingStatusModal() {
    const modal = document.getElementById("detail-modal");
    const titleEl = document.getElementById("modal-title");
    const bodyEl = document.getElementById("modal-body-content");

    titleEl.textContent =
      currentLang === "ko"
        ? "주간 DAMA 공식 출처 해시 모니터 및 캐시/실시간 상태 리포트 (Source Monitor)"
        : "Weekly Official DAMA Source Hash Monitor & Live/Cache Verification Report";

    let pollData = null;
    try {
      const r = await fetch("data/polling_status.json");
      if (r.ok) pollData = await r.json();
    } catch (e) {}

    if (!pollData && DATA && DATA.meta) {
      pollData = DATA.meta.polling;
    }

    if (!pollData) {
      bodyEl.innerHTML = `<p>Polling status loading...</p>`;
      modal.classList.add("open");
      return;
    }

    const rowsHtml = (pollData.targets || [])
      .map((targetItem) => {
        const name = currentLang === "ko" ? targetItem.name_ko : targetItem.name_en;
        const stCls = targetItem.fetch_status === "live" ? "badge-success" : "badge-warn";
        const valCls = targetItem.parse_status === "parsed_ok" ? "badge-teal" : "badge-danger";
        const pdfLinkHtml = targetItem.pdf_url
          ? `<div style="margin-top:3px;"><a href="${esc(targetItem.pdf_url)}" target="_blank" rel="noopener" style="font-size:11px;color:#2E6B4F;font-weight:700;">📄 ${esc(targetItem.pdf_title || "Official PDF")} (${Number(targetItem.pdf_bytes || 0).toLocaleString()} bytes) ↗</a></div>`
          : "";
        const pdfHashHtml = targetItem.pdf_binary_sha256
          ? `<div style="margin-top:3px;color:#2E6B4F;"><strong>PDF:</strong> ${esc(targetItem.pdf_binary_sha256.slice(0, 16))}... <span style="font-size:10.5px;">(${esc(targetItem.pdf_change_state || "ok")})</span></div>`
          : "";
        return `
          <tr>
            <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;">
              <strong>${esc(name)}</strong><br/>
              <a href="${esc(targetItem.url)}" target="_blank" rel="noopener" style="font-size:11.5px;">${esc(targetItem.url)} ↗</a>
              ${pdfLinkHtml}
              <div style="font-size:11px;color:#5A5654;">${esc(targetItem.document_version || "")} (${esc(targetItem.source_effective_date || "")})</div>
            </td>
            <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;text-align:center;">
              <span class="badge ${stCls}">${esc((targetItem.fetch_status || "").toUpperCase())} (${esc(targetItem.fetch_mode || "")})</span>
              <div style="font-size:11px;color:#5A5654;margin-top:2px;">${Number(targetItem.bytes || 0).toLocaleString()} bytes</div>
            </td>
            <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;text-align:center;">
              <span class="badge ${valCls}">${esc(targetItem.validation_status || targetItem.change_state)}</span>
            </td>
            <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;font-family:monospace;font-size:11.5px;">
              <div><strong>Web:</strong> ${esc((targetItem.normalized_sha256 || "").slice(0, 16))}...</div>
              ${pdfHashHtml}
            </td>
          </tr>
        `;
      })
      .join("");

    bodyEl.innerHTML = `
      <div style="background:#FFF8E7;border-left:5px solid #D97706;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:16px;">
        <h4 style="color:#B45309;font-size:15px;font-weight:800;margin-bottom:4px;">
          ${esc(currentLang === "ko" ? pollData.badge_label_ko : pollData.badge_label_en)}
        </h4>
        <p style="font-size:13.5px;color:#2E2E2E;">
          ${esc(currentLang === "ko" ? pollData.scope_disclaimer_ko : pollData.scope_disclaimer_en)}
        </p>
        <div style="font-size:12.5px;color:#5A5654;margin-top:6px;">
          <strong>Last Run ID:</strong> <code>${esc(pollData.run_id)}</code> ·
          <strong>Last Checked:</strong> <code>${esc(pollData.last_polled_at)}</code> ·
          <strong>Web Live / Cache / Failed:</strong> <code>${pollData.live_count || 0} Live / ${pollData.cache_count || 0} Cache / ${pollData.failed_count || 0} Failed</code> ·
          <strong>PDF Binary Hash Monitor:</strong> <code>${pollData.pdf_valid_count || 0}/${pollData.pdf_monitored_count || 0} PDFs Verified</code> ·
          <strong>CSIT Check:</strong> <code>${esc(pollData.salary_verification ? pollData.salary_verification.salary_verification_status : "")}</code>
        </div>
      </div>

      <div style="overflow-x:auto;border:1px solid #DED6C8;border-radius:10px;background:#FFFFFF;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#1A1211;color:#FFFFFF;">
              <th style="padding:10px;text-align:left;">${currentLang === "ko" ? "점검 대상 공식 출처 (15개 엔드포인트)" : "Monitored Official Source (15 Endpoints)"}</th>
              <th style="padding:10px;text-align:center;">${currentLang === "ko" ? "수집 방식 · 크기" : "Fetch Mode · Size"}</th>
              <th style="padding:10px;text-align:center;">${currentLang === "ko" ? "검증 상태" : "Validation Status"}</th>
              <th style="padding:10px;text-align:left;">SHA-256</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    modal.classList.add("open");
  }

  function renderFootnotes() {
    const container = document.getElementById("footnotes-container");
    container.innerHTML = DATA.footnotes
      .map((fn) => {
        const lic = currentLang === "ko" ? fn.licence_note_ko : fn.licence_note_en;
        return `
          <div class="footnote-item" id="fn-${fn.id}">
            <div class="fn-badge">[${fn.id}]</div>
            <div>
              <div><strong>${esc(fn.org)}</strong> — <em>${esc(fn.title)}</em> (${esc(fn.date)})</div>
              <div style="margin-top:2px;">
                <a href="${esc(fn.url)}" target="_blank" rel="noopener">${esc(fn.url)} ↗</a>
              </div>
              <div style="font-size:11.5px;color:#5A5654;margin-top:2px;">
                ${esc(lic)} · SHA-256: <code>${esc(fn.sha256.slice(0, 16))}...</code>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function setupBalloonTooltips() {
    const balloon = document.getElementById("floating-balloon");
    const balloonBody = document.getElementById("floating-balloon-body");
    const balloonClose = document.getElementById("floating-balloon-close");

    function showBalloon(targetEl) {
      const text = targetEl.getAttribute("data-balloon");
      if (!text) return;
      balloonBody.textContent = text;
      balloon.style.display = "block";

      const rect = targetEl.getBoundingClientRect();
      const bw = Math.min(360, window.innerWidth - 24);
      balloon.style.width = bw + "px";

      let left = rect.left + rect.width / 2 - bw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - bw - 12));

      let top = rect.bottom + 8;
      if (top + balloon.offsetHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - balloon.offsetHeight - 8);
      }
      balloon.style.left = left + "px";
      balloon.style.top = top + "px";
    }

    function hideBalloon() {
      balloon.style.display = "none";
    }

    document.addEventListener("mouseover", (e) => {
      const tEl = e.target.closest("[data-balloon]");
      if (tEl) showBalloon(tEl);
    });

    document.addEventListener("click", (e) => {
      const tEl = e.target.closest("[data-balloon]");
      if (tEl) {
        e.stopPropagation();
        showBalloon(tEl);
        return;
      }
      if (!e.target.closest("#floating-balloon")) {
        hideBalloon();
      }
    });

    balloonClose.addEventListener("click", hideBalloon);
    window.addEventListener("scroll", hideBalloon, { passive: true });
  }

  // Expose programmatic verification API on window.DAMA_NAVIGATOR for acceptance testing (T01–T30)
  window.DAMA_NAVIGATOR = {
    getData: () => DATA,
    getFilteredOccupations: () => filteredOccupations,
    classifySaPostcode,
    classifyWaPostcode,
    checkLocationMatch,
    evaluateEnglishBySubclass,
    evaluateSalaryPackage,
    evaluateAgeAndTransition,
    evaluateRowStatus,
    rowMatches,
    openOccupationModal,
    openRegionModal,
  };

  async function init() {
    const resp = await fetch("data/dama_navigator_data.json");
    DATA = await resp.json();

    applyStaticTranslations();
    renderFootnotes();
    applyFilters(true);
    setupBalloonTooltips();

    // Language toggle events
    document.getElementById("lang-toggle-ko").addEventListener("click", () => {
      currentLang = "ko";
      applyStaticTranslations();
      renderFootnotes();
      applyFilters(false);
    });
    document.getElementById("lang-toggle-en").addEventListener("click", () => {
      currentLang = "en";
      applyStaticTranslations();
      renderFootnotes();
      applyFilters(false);
    });

    // Search & filter events
    document.getElementById("search-input").addEventListener("input", () => applyFilters(true));
    const locInput = document.getElementById("filter-location");
    if (locInput) {
      locInput.addEventListener("input", () => applyFilters(true));
    }
    document.getElementById("clear-search-btn").addEventListener("click", () => {
      document.getElementById("search-input").value = "";
      applyFilters(true);
    });
    ["filter-region", "filter-age", "filter-english", "filter-salary", "filter-skill", "filter-pathway"].forEach((id) => {
      document.getElementById(id).addEventListener("change", () => applyFilters(true));
    });

    // Reset button
    document.getElementById("reset-filters-btn").addEventListener("click", () => {
      document.getElementById("search-input").value = "";
      if (locInput) locInput.value = "";
      document.getElementById("filter-region").value = "all";
      document.getElementById("filter-age").value = "all";
      document.getElementById("filter-english").value = "all";
      document.getElementById("filter-salary").value = "all";
      document.getElementById("filter-skill").value = "all";
      document.getElementById("filter-pathway").value = "all";
      document.querySelectorAll(".preset-chip").forEach((c) => c.classList.remove("active"));
      applyFilters(true);
    });

    // Preset chips
    document.querySelectorAll(".preset-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-query") || "";
        const sInput = document.getElementById("search-input");
        if (sInput.value === q) {
          sInput.value = "";
          chip.classList.remove("active");
        } else {
          document.querySelectorAll(".preset-chip").forEach((c) => c.classList.remove("active"));
          sInput.value = q;
          chip.classList.add("active");
        }
        applyFilters(true);
      });
    });

    // Pagination buttons
    document.getElementById("btn-prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });
      }
    });
    document.getElementById("btn-next-page").addEventListener("click", () => {
      const totalPages = Math.ceil(filteredOccupations.length / PAGE_SIZE);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });
      }
    });

    // Delegated clicks for region cards and table modals
    document.addEventListener("click", (e) => {
      if (e.target.closest("#btn-polling-status")) {
        openPollingStatusModal();
        return;
      }
      const openOccBtn = e.target.closest(".btn-open-modal");
      if (openOccBtn) {
        openOccupationModal(openOccBtn.getAttribute("data-occ-id"));
        return;
      }
      const openRegBtn = e.target.closest("[data-open-region]");
      if (openRegBtn) {
        openRegionModal(openRegBtn.getAttribute("data-open-region"));
        return;
      }
      const selDamaEl = e.target.closest("[data-select-dama]");
      if (selDamaEl) {
        const did = selDamaEl.getAttribute("data-select-dama");
        const regSelect = document.getElementById("filter-region");
        regSelect.value = regSelect.value === did ? "all" : did;
        applyFilters(true);
        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });
      }
    });

    // Modal close
    const modal = document.getElementById("detail-modal");
    document.getElementById("modal-close-btn").addEventListener("click", () => {
      modal.classList.remove("open");
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.classList.remove("open");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
