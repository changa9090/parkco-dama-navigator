/* Park & Co DAMA Navigator & Eligibility Combinator — Bilingual (KO/EN) Interactive Engine */
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
      pollBadge: "주간 자동검증 활성 (2026-10-20 · 15/15 정상)",
      navEnquiry: "박앤코 상담·문의하기 →",
      urgentBadge: "2026 일몰 경보",
      urgentText: "서호주 South West DAMA 2026.10.30 신규·변경 마감(12.14 종료) / Goldfields DAMA 2026.12.31 종료 후 WA State-wide로 통합됩니다 ($71,481 급여 감면·SL5 직종 활용 시 기한 내 접수 필수).",
      heroOverline: "AUSTRALIA-WIDE 13 DAMA · SID 482 · SESR 494 · ENS 186 ELIGIBILITY COMBINATOR",
      heroTitle: "호주 13개 DAMA 전 지역 직종 · 자격요건 · 스폰서십 지역 찾기",
      heroLead: "내 직업(ANZSCO/한국어), 나이, 영어 점수, 연봉($67,510~$79,423), 학력·경력 조건을 선택하면 호주 전역 13개 DAMA · 2,476개 승인 직종 중 어느 지방에서 고용주를 찾아야 하는지, 그리고 어떤 비자 조합(SID 482 vs SESR 494→191 vs Direct ENS 186)이 가장 안전한지 즉시 진단해 드립니다.",
      heroPrimaryCta: "박앤코 전문변호사 1:1 비자·스폰서십 상담 신청 →",
      heroSecondaryCta: "직종·조건 맞춤 검색 바로가기 ↓",
      specName: "박창민 대표변호사 (Chang Min Park)",
      specRole: "QLS Accredited Specialist in Immigration Law",
      specSlogan: "\"삶에 집중하세요, 법률은 저희가 맡겠습니다.\"",
      specMeta: "법무법인 박앤코 (Park & Co Lawyers · Underwood QLD) | 공식 이메일: cpark@parkcolawyers.com",
      specBtn: "온라인 문의 바로가기 (parklawyers.com.au) →",

      stat1Over: "ACTIVE DAMAS",
      stat1Val: "13개 지역",
      stat1Sub: "호주 연방·주정부 협약 전수 반영 [1]",
      stat2Over: "OCCUPATION DB",
      stat2Val: "2,476개",
      stat2Sub: "SL 1~5 및 070499 비-ANZSCO 통합",
      stat3Over: "2026–27 STANDARD CSIT",
      stat3Val: "$79,423",
      stat3Sub: "2026.07.01 발효 법정 기준연봉 [2]",
      stat4Over: "90% DAMA CONCESSION",
      stat4Val: "$71,481",
      stat4Sub: "표준 10% 감면 (Type 1 금전 / Type 2 숙식)",
      stat5Over: "85% NT DAMA III",
      stat5Val: "$67,510",
      stat5Sub: "NT 전 직종 최저 급여선 (+숙식 $6,751) [11]",
      stat6Over: "MAX AGE CONCESSION",
      stat6Val: "만 55세 미만",
      stat6Sub: "SL1–4 만 55세 / SL5 만 50세 (SA는 55세)",

      combOverline: "STEP 01 · INTERACTIVE ELIGIBILITY COMBINATOR",
      combTitle: "내 직종 · 조건으로 최적의 DAMA 고용주 지역 찾기",
      combSub: "한국어 직업명(예: 요리사, 용접사, 간병인, 바리스타, 청소, 트럭, 정비사, 간호사, 회계), 영문 직종명, 또는 6자리 ANZSCO 코드로 검색하고 본인의 조건을 선택해 보세요. 각 뱃지(?)에 마우스를 올리거나 탭하면 상세 법령 풍선 도움말(Balloon)이 열립니다.",
      searchPlaceholder: "직종 검색: 예) 요리사, Chef, Cook, 351411, 용접, Welder, 간병인, Carer, Barista, 청소, 트럭...",
      resetBtn: "필터 초기화",
      presetLabel: "인기 검색 직종:",

      lblRegion: "1. 희망 주(State) / DAMA 지역",
      lblAge: "2. 신청자 현재 나이 (Age)",
      lblEnglish: "3. 보유 영어 점수 (IELTS / PTE)",
      lblSalary: "4. 고용주 제시 가능 연봉 (Salary)",
      lblSkill: "5. 직종 숙련도 (Skill Level / 학력)",
      lblPathway: "6. 영주권(ENS 186) 및 특별 조건",

      optRegionAll: "호주 전체 (13개 DAMA 전 지역)",
      optStateQLD: "── 퀸즐랜드 (QLD: FNQ · 타운즈빌) ──",
      optStateNSW: "── 뉴사우스웨일즈 (NSW: 오라나 51개 LGA) ──",
      optStateNT: "── 노던 테리토리 (NT: 다윈 및 주 전역) ──",
      optStateSA: "── 남호주 (SA: 애들레이드 · 남호주 지방) ──",
      optStateVIC: "── 빅토리아 (VIC: 굴번밸리 · 워남불 GSC) ──",
      optStateWA: "── 서호주 (WA: 퍼스/주전역 · 필바라 · 골드필즈 · 남서부 · 킴벌리) ──",

      optAgeAll: "연령 무관 / 전체 보기",
      optAgeUnder45: "만 45세 미만 (일반·DAMA 모두 안전)",
      optAge45_49: "만 45세 ~ 49세 (SL 1–5 전 직종 연령 완화 구간)",
      optAge50_54: "만 50세 ~ 54세 (SL 1–4 가능 · 만 52~54세 나이 함정 주의!)",

      optEngAll: "영어 점수 전체 (IELTS 6.0+ 포함)",
      optEng50NoBand: "IELTS 5.0 / PTE 31 평균 (과목별 과락 없음 가능 직종)",
      optEng50Min40: "IELTS 5.0 평균 (각 과목 4.0 이상 가능 직종)",
      optEng45Min40: "IELTS 4.5 평균 (각 과목 4.0 이상 — NT / SA 외곽 지방)",

      optSalAll: "연봉 무관 ($79,423 표준 CSIT 이상 가능 포함)",
      optSal71481: "$71,481 이하 가능 직종만 (90% 또는 85% 급여 감면 필수)",
      optSal67510: "$67,510 가능 직종만 (85% NT DAMA III 최저 급여 감면)",

      optSkillAll: "모든 Skill Level (SL 1~5 및 비-ANZSCO)",
      optSkill1_3: "Skill Level 1–3 (학사·전문학사·Cert III/IV 기술·전문직)",
      optSkill4: "Skill Level 4 (Cert II/III 또는 1~2년 경력 반숙련직)",
      optSkill5: "Skill Level 5 (Cert I 또는 1년 경력 기초·단순노무직)",
      optSkill4_5: "Skill Level 4 & 5 모아보기 (일반 482 불가 · DAMA 전용 직종)",
      optNonAnzsco: "070499 비-ANZSCO 특화 직종만 보기",

      optPathAll: "전체 보기",
      optPathDirect186: "Direct ENS 186 가능 지역만 (비-DAMA 비자 2년 경력 인정: FNQ·NT·Kimberley)",
      optPathFreeDar: "DAR 승인 수수료 $0 (무료) 주정부 지역만 (NT · SA · WA State-wide)",
      optPathNoSl5Upgrade: "SL5 승진 조건 없이 바로 186 영주권 가능한 직종",

      regOverline: "STEP 02 · WHERE TO FIND YOUR REGIONAL EMPLOYER SPONSOR",
      regTitle: "13개 DAMA 지역별 매칭 직종 수 & 지역 상세 가이드",
      regSub: "현재 선택한 검색어·조건에 부합하는 직종이 각 지역에 몇 개 있는지 실시간으로 표시됩니다. 지역 카드를 클릭하면 해당 지역으로 필터링되며, [지역 요건·우편번호 상세] 버튼을 누르면 전체 커버리지와 조합 공식을 팝업으로 확인합니다.",
      regDetailBtn: "지역 요건 · 우편번호 상세",
      regFilterHint: "클릭하여 이 지역만 필터",

      tblOverline: "STEP 03 · VERIFIED OCCUPATION & CONCESSION COMBINATOR TABLE",
      tblTitle: "조건 맞춤형 승인 직종 & 자격요건 상세 리스트",
      thDama: "DAMA 지역 · 주(State)",
      thOcc: "직종명 (ANZSCO · 세부전공)",
      thSl: "숙련도 (SL)",
      thSal: "최저 연봉 (2026–27)",
      thEng: "영어 조건 (482/494 vs 186)",
      thAgePr: "연령 상한 · 영주권 경로",
      thQuals: "학력 · 경력 요약 (482/494/186)",
      thAction: "상세 조합 · 팝업",
      btnRowModal: "조합 공식 · 상세 팝업",

      discOverline: "LEGAL DISCLAIMER, COPYRIGHT & GOVERNMENT ATTRIBUTION",
      discTitle: "법률 면책공고 (Legal Disclaimer) · 저작권 보호 및 각 주정부/연방정부 1차 출처 각주",
      discP1: "1. 일반 정보 제공 목적 및 법률자문 비구성 (No Legal Advice & No Solicitor-Client Relationship): 본 웹서비스('Park & Co DAMA Navigator')에 수록된 모든 정보는 2026년 10월 20일 기준 호주 연방 내무부(Department of Home Affairs) 및 13개 지정지역대표기관(DAR)이 공개한 공식 가이드라인과 직종 스케줄을 바탕으로 정리된 일반 정보이며, 개별 사안에 대한 법률자문(Legal Advice)이 아닙니다. 본 서비스의 검색 결과나 조합 가이드를 열람·활용하는 것만으로는 법무법인 박앤코(Park & Co Lawyers)와 변호사-의뢰인 관계가 성립하지 않습니다. 실제 DAMA DAR Endorsement, Labour Agreement 체결 및 비자(Subclass 482 / 494 / 186) 신청 가능 여부는 고용주의 재무 건전성, LMT 구인광고 적격성, 시장임금(AMSR) 입증 및 각 DAR의 재량에 따라 달라지므로 반드시 QLS 공인 이민법 전문변호사(Accredited Specialist in Immigration Law)의 정식 자문을 받으시기 바랍니다.",
      discP2: "2. 저작권 보호 고지 (Copyright Protection Notice): © 2026 Park & Co Lawyers Pty Ltd. All rights reserved. 본 웹서비스의 데이터베이스 구조, 국·영문 직종 매핑, 연령·영어·경력 법률 조합 알고리즘(Combinator Logic), UI/UX 디자인 및 해설 문구에 대한 일체의 저작권과 지식재산권은 법무법인 박앤코에 귀속됩니다. 사전 서면 허가 없는 크롤링, 무단 복제, 재배포 또는 타 이주업체·법무법인의 상업적 도용을 엄격히 금지합니다.",
      discP3: "3. 호주 연방·주·지방정부 및 관할 DAR 공식 출처 표기 (Government & DAR Attribution Notice): 본 서비스에 반영된 각 주·테리토리 정부 및 DAR의 직종 코드, 우편번호 범위, 수수료 및 완화된 기준 수치는 호주 공공저작물 라이선스(Creative Commons Attribution 4.0 International — CC BY 4.0) 및 출처 표시 원칙에 따라 아래 29개 1차 공식 출처([1]~[29])를 원문 링크 및 SHA-256 무결성 해시와 함께 하단 각주에 명시합니다.",
      fnHeading: "1차 공식 출처 및 주정부·DAR 레퍼런스 각주 ([1] ~ [29])",
    },
    en: {
      brandTag: "IMMIGRATION LAW · REGIONAL DAMA PRACTICE",
      pollBadge: "Weekly Auto-Poll Active (2026-10-20 · 15/15 Verified)",
      navEnquiry: "Make an Enquiry →",
      urgentBadge: "2026 SUNSET ALERT",
      urgentText: "WA South West DAMA closes to new/variation requests on 30 Oct 2026 (expires 14 Dec 2026) & Goldfields DAMA expires 31 Dec 2026 before merging into WA State-wide DAMA (which has NO $71,481 salary concession and NO Skill Level 5 roles).",
      heroOverline: "AUSTRALIA-WIDE 13 DAMA · SID 482 · SESR 494 · ENS 186 ELIGIBILITY COMBINATOR",
      heroTitle: "Australia 13 DAMA Occupation, Concession & Regional Sponsor Finder",
      heroLead: "Search by occupation title or ANZSCO code and filter by your age, English test score, offered salary ($67,510–$79,423), and qualification/experience across all 13 Australian DAMAs (2,476 occupation entries). Instantly discover where to target regional employers and which visa pathway (SID 482 vs SESR 494→191 vs Direct ENS 186) fits your profile.",
      heroPrimaryCta: "Book a 1:1 Consultation with Park & Co Lawyers →",
      heroSecondaryCta: "Launch DAMA Eligibility Combinator ↓",
      specName: "Chang Min Park — Principal Lawyer",
      specRole: "QLS Accredited Specialist in Immigration Law",
      specSlogan: "\"You focus on life, we'll handle the law.\"",
      specMeta: "Park & Co Lawyers (Underwood QLD) | Official Email: cpark@parkcolawyers.com",
      specBtn: "Enquire Online (parklawyers.com.au) →",

      stat1Over: "ACTIVE DAMAS",
      stat1Val: "13 Regions",
      stat1Sub: "Commonwealth & State/DAR schedules [1]",
      stat2Over: "OCCUPATION DB",
      stat2Val: "2,476",
      stat2Sub: "Skill Levels 1–5 & 070499 Non-ANZSCO",
      stat3Over: "2026–27 STANDARD CSIT",
      stat3Val: "$79,423",
      stat3Sub: "Statutory threshold from 1 Jul 2026 [2]",
      stat4Over: "90% DAMA CONCESSION",
      stat4Val: "$71,481",
      stat4Sub: "Standard 10% reduction (Type 1 & Type 2)",
      stat5Over: "85% NT DAMA III",
      stat5Val: "$67,510",
      stat5Sub: "Lowest cash floor in AU (+$6,751 board) [11]",
      stat6Over: "MAX AGE CONCESSION",
      stat6Val: "Under 55",
      stat6Sub: "SL1–4 Under 55 / SL5 Under 50 (SA: 55)",

      combOverline: "STEP 01 · INTERACTIVE ELIGIBILITY COMBINATOR",
      combTitle: "Find Your Best DAMA Region & Employer Sponsor Requirements",
      combSub: "Search by English occupation title, 6-digit ANZSCO code, or Korean keyword and select your personal conditions below. Hover or tap any (?) badge for interactive legal balloon tooltips and footnote references.",
      searchPlaceholder: "Search occupation or ANZSCO: e.g. Chef, Cook, 351411, Welder, Carer, Barista, Cleaner, Truck Driver...",
      resetBtn: "Reset Filters",
      presetLabel: "Popular Occupations:",

      lblRegion: "1. State / DAMA Region",
      lblAge: "2. Applicant Current Age",
      lblEnglish: "3. English Score (IELTS / PTE)",
      lblSalary: "4. Employer Offered Salary (AUD)",
      lblSkill: "5. Skill Level & Qualification",
      lblPathway: "6. PR (ENS 186) & Special Rules",

      optRegionAll: "All Australia (All 13 DAMA Regions)",
      optStateQLD: "── Queensland (QLD: FNQ & Townsville) ──",
      optStateNSW: "── New South Wales (NSW: Orana 51 LGAs) ──",
      optStateNT: "── Northern Territory (NT DAMA III State-wide) ──",
      optStateSA: "── South Australia (SA: Adelaide Tech & SA Regional) ──",
      optStateVIC: "── Victoria (VIC: Goulburn Valley & Great South Coast) ──",
      optStateWA: "── Western Australia (WA: State-wide, Pilbara, Goldfields, SW, Kimberley) ──",

      optAgeAll: "Any Age / Show All",
      optAgeUnder45: "Under 45 (Eligible under Standard & DAMA)",
      optAge45_49: "Age 45–49 (Eligible for both Under 50 & Under 55 caps)",
      optAge50_54: "Age 50–54 (Requires Under 55 cap — Watch Age 52–54 Trap!)",

      optEngAll: "Any English Score (incl. Standard IELTS 6.0+)",
      optEng50NoBand: "IELTS 5.0 / PTE 31 avg (No minimum band score)",
      optEng50Min40: "IELTS 5.0 avg (Min 4.0 each band)",
      optEng45Min40: "IELTS 4.5 avg (Min 4.0 each — NT & Outer Regional SA)",

      optSalAll: "Any Salary (incl. $79,423+ Standard CSIT)",
      optSal71481: "Up to $71,481 only (Requires 90% or 85% CSIT Concession)",
      optSal67510: "Up to $67,510 only (Requires 85% NT DAMA III Concession)",

      optSkillAll: "All Skill Levels (SL 1–5 & Non-ANZSCO)",
      optSkill1_3: "Skill Levels 1–3 (Degree / Diploma / Cert III–IV Trades)",
      optSkill4: "Skill Level 4 (Cert II/III or 1–2y Exp Semi-Skilled)",
      optSkill5: "Skill Level 5 (Cert I or 1y Exp Entry-Level)",
      optSkill4_5: "Skill Levels 4 & 5 Only (DAMA-exclusive semi/low-skilled)",
      optNonAnzsco: "070499 Non-ANZSCO Occupations Only",

      optPathAll: "Show All Pathways",
      optPathDirect186: "Direct ENS 186 Allowed (Counts non-DAMA visas: FNQ, NT, Kimberley)",
      optPathFreeDar: "$0 Free DAR Endorsement Fee Only (NT, SA, WA State-wide)",
      optPathNoSl5Upgrade: "No SL5 Promotion Required for ENS 186",

      regOverline: "STEP 02 · WHERE TO FIND YOUR REGIONAL EMPLOYER SPONSOR",
      regTitle: "Matching Occupations by DAMA Region (13 Regions)",
      regSub: "Live count of approved occupations matching your criteria in each region. Click any card to filter the table by that DAMA, or click [Region Rules & Postcodes] for the full regional profile.",
      regDetailBtn: "Region Rules & Postcodes",
      regFilterHint: "Click to filter by region",

      tblOverline: "STEP 03 · VERIFIED OCCUPATION & CONCESSION COMBINATOR TABLE",
      tblTitle: "Matching Occupations & Visa Concession Breakdown",
      thDama: "DAMA Region · State",
      thOcc: "Occupation (ANZSCO & Specialisations)",
      thSl: "Skill Level",
      thSal: "Min Salary (2026–27)",
      thEng: "English (482/494 vs 186)",
      thAgePr: "Age Cap & PR Pathway",
      thQuals: "Qualifications & Work Exp",
      thAction: "Full Rules & Combinator",
      btnRowModal: "View Rules & Combinator",

      discOverline: "LEGAL DISCLAIMER, COPYRIGHT & GOVERNMENT ATTRIBUTION",
      discTitle: "Legal Disclaimer, Copyright Notice & Official Government/DAR Source Footnotes",
      discP1: "1. General Information Only (No Legal Advice / No Solicitor-Client Relationship): The information provided on this web service ('Park & Co DAMA Navigator') is current as at 20 October 2026 based on official schedules published by the Australian Department of Home Affairs and the 13 Designated Area Representatives (DARs). It is provided for general informational purposes only and does not constitute legal or migration advice. Accessing or using this tool does not create a solicitor-client relationship with Park & Co Lawyers. DAMA endorsement criteria, income thresholds (CSIT/TSMIT), occupation lists, and concessions are subject to change without notice and depend on DAR discretion, Labour Market Testing (LMT), and Annual Market Salary Rate (AMSR) assessments. Always obtain formal legal advice from a QLS Accredited Specialist in Immigration Law before lodging an endorsement or visa application.",
      discP2: "2. Copyright Protection Notice: © 2026 Park & Co Lawyers Pty Ltd (Underwood QLD). All rights reserved. The compilation, bilingual mapping, legal eligibility combinator logic, UI design, and commentary in this web service are the proprietary intellectual property of Park & Co Lawyers. Unauthorised scraping, reproduction, redistribution, or commercial use by third-party migration agencies or law firms is strictly prohibited.",
      discP3: "3. Commonwealth, State/Territory Government & DAR Attribution: Underlying statistical codes, postcode boundaries, and official DAMA schedule figures are attributed to the Commonwealth of Australia (Department of Home Affairs) and the respective State/Territory Governments and Designated Area Representatives under Creative Commons Attribution 4.0 International (CC BY 4.0) and fair dealing principles. Full primary-source links and SHA-256 verification hashes are provided in Footnotes [1]–[29] below.",
      fnHeading: "Verified Primary Sources & Official DAR Footnotes ([1] – [29])",
    }
  };

  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.ko[key] || key;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = t(k);
    });
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.placeholder = t("searchPlaceholder");

    document.getElementById("lang-toggle-ko").classList.toggle("active", currentLang === "ko");
    document.getElementById("lang-toggle-en").classList.toggle("active", currentLang === "en");

    // Populate region dropdown while preserving value
    const regSelect = document.getElementById("filter-region");
    const prevVal = regSelect.value || "all";
    regSelect.innerHTML = `
      <option value="all">${esc(t("optRegionAll"))}</option>
      <option value="state:QLD">${esc(t("optStateQLD"))}</option>
      <option value="fnq_dama">&nbsp;&nbsp;• [QLD] ${esc(currentLang === "ko" ? "FNQ (케언즈 · 파노스 퀸즐랜드)" : "Far North Queensland (FNQ) DAMA")}</option>
      <option value="tnq_dama">&nbsp;&nbsp;• [QLD] ${esc(currentLang === "ko" ? "TNQ (타운즈빌 · 북부 퀸즐랜드)" : "Townsville North Queensland (TNQ) DAMA")}</option>
      <option value="state:NSW">${esc(t("optStateNSW"))}</option>
      <option value="orana_dama">&nbsp;&nbsp;• [NSW] ${esc(currentLang === "ko" ? "Orana DAMA (더보·오렌지·와가와가 등 51개 카운슬)" : "Orana DAMA (51 Regional NSW LGAs)")}</option>
      <option value="state:NT">${esc(t("optStateNT"))}</option>
      <option value="nt_dama_iii">&nbsp;&nbsp;• [NT] ${esc(currentLang === "ko" ? "NT DAMA III (다윈·앨리스스프링스 등 NT 전역)" : "Northern Territory DAMA III (State-wide)")}</option>
      <option value="state:SA">${esc(t("optStateSA"))}</option>
      <option value="adelaide_city_dama">&nbsp;&nbsp;• [SA] ${esc(currentLang === "ko" ? "Adelaide City Tech (애들레이드 도심 기술·혁신)" : "Adelaide City Tech & Innovation DAMA")}</option>
      <option value="sa_regional_workforce_dama">&nbsp;&nbsp;• [SA] ${esc(currentLang === "ko" ? "SA Regional Workforce (남호주 광역·지방 전역)" : "South Australia Regional Workforce DAMA")}</option>
      <option value="state:VIC">${esc(t("optStateVIC"))}</option>
      <option value="goulburn_valley_dama">&nbsp;&nbsp;• [VIC] ${esc(currentLang === "ko" ? "Goulburn Valley (셰파튼·캠파스피·모이라)" : "Goulburn Valley (GV) DAMA")}</option>
      <option value="great_south_coast_dama">&nbsp;&nbsp;• [VIC] ${esc(currentLang === "ko" ? "Great South Coast (워남불·콜락·포틀랜드 등 6개 LGA)" : "Great South Coast (GSC) DAMA")}</option>
      <option value="state:WA">${esc(t("optStateWA"))}</option>
      <option value="wa_statewide_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "WA State-wide (퍼스 대도시권 & 서호주 전역)" : "Western Australia State-wide DAMA")}</option>
      <option value="pilbara_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "Pilbara DAMA (카라사·포트헤들랜드·뉴먼)" : "Pilbara DAMA")}</option>
      <option value="goldfields_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "The Goldfields DAMA (칼굴리·에스페란스 — 2026.12.31 종료)" : "The Goldfields DAMA (Extended to 31 Dec 2026)")}</option>
      <option value="south_west_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "South West DAMA (번버리·버셀턴·마가렛리버 — 2026.10.30 마감)" : "South West DAMA (Closes 30 Oct 2026)")}</option>
      <option value="east_kimberley_dama">&nbsp;&nbsp;• [WA] ${esc(currentLang === "ko" ? "Kimberley DAMA (브룸·쿠누누라·더비·홀스크릭)" : "Kimberley (East Kimberley) DAMA")}</option>
    `;
    regSelect.value = prevVal;
  }

  function getFilters() {
    return {
      q: (document.getElementById("search-input").value || "").trim().toLowerCase(),
      region: document.getElementById("filter-region").value,
      age: document.getElementById("filter-age").value,
      english: document.getElementById("filter-english").value,
      salary: document.getElementById("filter-salary").value,
      skill: document.getElementById("filter-skill").value,
      pathway: document.getElementById("filter-pathway").value,
    };
  }

  function rowMatches(o, f, ignoreRegionFilter) {
    // 1. Search query
    if (f.q) {
      const terms = f.q.split(/\s+/).filter(Boolean);
      for (const term of terms) {
        if (!o.search_text.includes(term)) return false;
      }
    }
    // 2. Region / State
    if (!ignoreRegionFilter && f.region !== "all") {
      if (f.region.startsWith("state:")) {
        const st = f.region.split(":")[1];
        if (o.state !== st) return false;
      } else if (o.dama_id !== f.region) {
        return false;
      }
    }
    // 3. Age
    if (f.age === "50-54") {
      if (o.max_age < 55) return false;
    } else if (f.age === "45-49") {
      if (o.max_age < 50) return false;
    }
    // 4. English
    if (f.english === "5.0-noband") {
      if (o.eng_tier_482 !== "ielts_5_0_no_band" && o.eng_tier_482 !== "ielts_4_5") return false;
    } else if (f.english === "5.0-min40") {
      if (!o.english_concession) return false;
    } else if (f.english === "4.5-min40") {
      const isSaOuter = o.dama_id === "sa_regional_workforce_dama" && o.english_482_494.includes("Type 2");
      if (o.eng_tier_482 !== "ielts_4_5" && !isSaOuter) return false;
    }
    // 5. Salary
    if (f.salary === "71481") {
      if (o.min_salary_aud > 71481) return false;
    } else if (f.salary === "67510") {
      if (o.min_salary_aud > 67510) return false;
    }
    // 6. Skill Level
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
    // 7. Pathway / Special
    if (f.pathway === "direct186") {
      if (!o.direct_186) return false;
    } else if (f.pathway === "freedar") {
      if (!o.dar_fee_free) return false;
    } else if (f.pathway === "nosl5upgrade") {
      if (o.sl5_upgrade_req) return false;
    }
    return true;
  }

  function renderCombinatorAlert(f, totalMatches) {
    const banner = document.getElementById("combinator-alert-banner");
    const alerts = [];

    if (f.age === "50-54") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[나이 함정 경보 — 만 50~54세 조합 공식]</strong> DAMA의 만 55세 미만 연령 완화는 <strong>ENS 186 또는 SESR 494 노미네이션 접수 시점</strong>에 적용됩니다 <a href="#fn-3">[3]</a>. 만약 만 52~54세 근로자가 연령 제한이 없는 SID 482를 먼저 받으면, 2년 뒤 186 전환 시 만 55세가 넘어 영주권 신청 자격이 상실됩니다! <strong>해결책:</strong> ① 처음부터 <strong>Subclass 494 (SESR) 비자</strong>로 승인받아 나이를 고정한 뒤 3년 후 <strong>연령 제한이 전혀 없는 Subclass 191 영주권</strong>으로 직행하거나, ② 이미 <strong>FNQ·NT·Kimberley</strong>에서 비-DAMA 비자로 2년 근무했다면 만 55세 전에 <strong>Direct ENS 186</strong>을 신청하십시오.</div>`
          : `<div><strong>[Age 50–54 Trap Warning & Combinator Strategy]</strong> The Under-55 age concession applies at the time of <strong>ENS 186 or SESR 494 nomination lodgement</strong> <a href="#fn-3">[3]</a>. If a worker aged 52–54 takes a SID 482 visa first, they will turn 55 before completing the 2-year transition period for ENS 186! <strong>Solution:</strong> (1) Lodge <strong>Subclass 494 (SESR)</strong> upfront before turning 55 and transition after 3 years to <strong>Subclass 191 PR (which has NO age limit)</strong>, OR (2) use <strong>Direct ENS 186</strong> in <strong>FNQ, NT, or Kimberley</strong> if 2 years of regional work is already completed.</div>`
      );
    }

    if (f.english === "4.5-min40") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[IELTS 4.5 (각 밴드 4.0) 매칭 결과]</strong> 호주 전체 13개 DAMA 중 <strong>노던 테리토리(NT DAMA III, 196개 직종)</strong> 및 <strong>남호주 광역·지방 DAMA(Outer Regional SA 포스트코드 소재 고용주 Type 2)</strong>에서만 IELTS 4.5로 SID 482 / SESR 494 진입이 가능합니다 <a href="#fn-11">[11]</a> <a href="#fn-15">[15]</a>. (단, 2년 뒤 ENS 186 신청 시에는 IELTS 5.0 평균이 필요합니다.)</div>`
          : `<div><strong>[IELTS 4.5 (min 4.0 each) Strategy]</strong> Only <strong>NT DAMA III (196 occupations)</strong> and <strong>SA Regional Workforce DAMA (Outer Regional SA postcodes under Type 2)</strong> accept IELTS 4.5 overall (min 4.0 each) for SID 482 / SESR 494 <a href="#fn-11">[11]</a> <a href="#fn-15">[15]</a>.</div>`
      );
    }

    if (f.region === "south_west_dama") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[사우스 웨스트(South West WA) DAMA 필수 주의사항]</strong> ① 신규·변경 DAR 신청이 <strong>2026년 10월 30일 마감</strong>(12월 14일 종료)됩니다 <a href="#fn-26">[26]</a>. ② 482/494에서는 IELTS 5.0(밴드 무관) 감면이 있으나, <strong>ENS 186 영주권 단계에는 영어 감면이 아예 없어 IELTS 각 6.0이 필수</strong>입니다 <a href="#fn-27">[27]</a>!</div>`
          : `<div><strong>[South West WA DAMA Alert]</strong> (1) Closes to new/variation DAR applications on <strong>30 October 2026</strong> <a href="#fn-26">[26]</a>. (2) Has <strong>NO English concession for ENS 186</strong> (Competent English IELTS 6.0 each band required at 186 stage) <a href="#fn-27">[27]</a>!</div>`
      );
    }

    if (f.skill === "5" || f.skill === "4-5") {
      alerts.push(
        currentLang === "ko"
          ? `<div><strong>[Skill Level 4–5 반숙련·단순노무 직종 조합 팁]</strong> 일반 482(Core Skills)로는 불가능한 SL 4–5 직종도 DAMA에서는 스폰서십 및 영주권 전환이 가능합니다. 특히 <strong>FNQ, Kimberley, Great South Coast, NT, SA Regional</strong>은 SL5 직종도 승진 없이 바로 2년 후 186 영주권이 가능하며, <strong>Goulburn Valley(VIC)와 Townsville(QLD)</strong>은 SL5 근로자가 SL 1–4로 승진 후 2년 근무해야 186이 가능합니다 <a href="#fn-6">[6]</a> <a href="#fn-17">[17]</a>.</div>`
          : `<div><strong>[Skill Level 4–5 Semi/Entry-Level Strategy]</strong> Unavailable under standard SID 482, SL 4–5 roles gain full sponsorship and PR pathways under DAMA. <strong>FNQ, Kimberley, GSC, NT, and SA Regional</strong> allow direct 186 transition without promotion, whereas <strong>Goulburn Valley and Townsville</strong> require SL5 workers to progress into a SL 1–4 role for 2 years before ENS 186 <a href="#fn-6">[6]</a> <a href="#fn-17">[17]</a>.</div>`
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
    DATA.damas.forEach((d) => { countsByDama[d.id] = 0; });

    DATA.occupations.forEach((o) => {
      if (rowMatches(o, f, true)) {
        countsByDama[o.dama_id] = (countsByDama[o.dama_id] || 0) + 1;
      }
    });

    const htmlCards = DATA.damas.map((d) => {
      const matchCount = countsByDama[d.id] || 0;
      const isSelected = f.region === d.id;
      const cardCls = [
        "dama-card",
        isSelected ? "selected" : "",
        matchCount === 0 ? "zero-matches" : "",
      ].filter(Boolean).join(" ");

      const name = currentLang === "ko" ? d.name_ko : d.name_en;
      const lga = currentLang === "ko" ? d.lgas_ko : d.lgas_en;
      const salBadge = d.min_salary_floor_aud === 67510
        ? `<span class="badge badge-burgundy" data-balloon="${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}">85% CSIT ($67,510) <span class="balloon-icon">?</span></span>`
        : (d.tsmit_concession_count > 0
            ? `<span class="badge badge-teal" data-balloon="${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}">90% CSIT ($71,481 · ${d.tsmit_concession_count}) <span class="balloon-icon">?</span></span>`
            : `<span class="badge badge-neutral">$79,423 CSIT</span>`);

      const feeBadge = d.dar_fee_free
        ? `<span class="badge badge-success" data-balloon="${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}">DAR $0 FREE <span class="balloon-icon">?</span></span>`
        : `<span class="badge badge-neutral" data-balloon="${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}">${esc(d.code)} DAR <span class="balloon-icon">?</span></span>`;

      const directBadge = d.direct_186
        ? `<span class="badge badge-success" data-balloon="${esc(currentLang === "ko" ? d.pr_rule_ko : d.pr_rule_en)}">Direct 186 ✓ <span class="balloon-icon">?</span></span>`
        : "";

      const sunsetBadge = d.sunset_warning
        ? `<span class="badge badge-danger" data-balloon="${esc(currentLang === "ko" ? d.sunset_note_ko : d.sunset_note_en)}">⏰ Sunset 2026 <span class="balloon-icon">?</span></span>`
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
              ${currentLang === "ko" ? `조건 부합 ${matchCount}개 직종` : `${matchCount} Matching Roles`}
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

    if (pageRows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:36px;color:#5A5654;">
            ${currentLang === "ko"
              ? "선택하신 조건에 정확히 일치하는 직종이 없습니다. 위 필터 조건을 일부 완화하거나 [필터 초기화]를 눌러보세요."
              : "No occupation entries match all selected filters. Try broadening one of your filter criteria or click Reset Filters."}
          </td>
        </tr>
      `;
    } else {
      const damaMap = {};
      DATA.damas.forEach((d) => { damaMap[d.id] = d; });

      tbody.innerHTML = pageRows.map((o) => {
        const d = damaMap[o.dama_id];
        const damaName = currentLang === "ko" ? o.dama_name_ko : o.dama_name_en;
        const fnLinks = o.footnote_ids.map((fid) => `<a href="#fn-${fid}" class="fn-ref">[${fid}]</a>`).join(" ");

        // Salary badge with balloon
        const salBalloon = currentLang === "ko"
          ? `[${damaName} 급여 규칙] ${o.min_salary_2026} — ${o.tsmit_detail}. ${d.salary_rule_ko}`
          : `[${damaName} Salary Rule] ${o.min_salary_2026} — ${o.tsmit_detail}. ${d.salary_rule_en}`;
        const salBadge = o.min_salary_aud === 67510
          ? `<span class="badge badge-burgundy" data-balloon="${esc(salBalloon)}">$67,510 (85% CSIT) <span class="balloon-icon">?</span></span>`
          : (o.tsmit_concession
              ? `<span class="badge badge-teal" data-balloon="${esc(salBalloon)}">$71,481 (90% CSIT) <span class="balloon-icon">?</span></span>`
              : `<span class="badge badge-neutral" data-balloon="${esc(salBalloon)}">$79,423 (표준 CSIT) <span class="balloon-icon">?</span></span>`);

        // English badge with balloon
        const engBalloon = currentLang === "ko"
          ? `[482/494 영어]: ${o.english_482_494} | [186 영주권 영어]: ${o.english_186}. ${d.eng_rule_ko}`
          : `[482/494 English]: ${o.english_482_494} | [ENS 186 English]: ${o.english_186}. ${d.eng_rule_en}`;
        const engBadge = o.english_concession
          ? `<span class="badge badge-teal" data-balloon="${esc(engBalloon)}">${esc(o.english_482_494.slice(0, 34))} <span class="balloon-icon">?</span></span>`
          : `<span class="badge badge-neutral" data-balloon="${esc(engBalloon)}">${currentLang === "ko" ? "표준 영어 점수" : "Standard English"} <span class="balloon-icon">?</span></span>`;

        const swEngWarn = o.no_186_eng_concession && o.english_concession
          ? `<div style="margin-top:4px;"><span class="badge badge-danger" data-balloon="${esc(currentLang === "ko" ? "사우스 웨스트 DAMA는 186 영주권 단계에 영어 감면이 전혀 없어 IELTS 각 과목 6.0이 필수입니다! 영어 6.0이 어렵다면 494 비자 후 191 영주권 루트를 선택하세요." : "South West DAMA has NO English concession at the ENS 186 stage (requires IELTS 6.0 each band). Consider the 494 -> 191 pathway instead.")}">186 IELTS 6.0 필수! <span class="balloon-icon">?</span></span></div>`
          : `<div style="font-size:11.5px;color:#5A5654;margin-top:3px;">186: ${esc(o.english_186.slice(0, 32))}</div>`;

        // Age & PR badge with balloon
        const prBalloon = currentLang === "ko"
          ? `[연령 상한]: 만 ${o.max_age}세 미만 (494 및 186 노미네이션 시점 기준) | [영주권 경로]: ${o.pr_pathway_summary}. ${d.pr_rule_ko}`
          : `[Max Age]: Under ${o.max_age} (at 494/186 nomination) | [PR Pathway]: ${o.pr_pathway_summary}. ${d.pr_rule_en}`;
        const ageBadge = `<span class="badge ${o.max_age === 55 ? "badge-success" : "badge-warn"}" data-balloon="${esc(prBalloon)}">${currentLang === "ko" ? `만 ${o.max_age}세 미만` : `Under ${o.max_age}`} <span class="balloon-icon">?</span></span>`;

        const directBadge = o.direct_186
          ? `<span class="badge badge-burgundy" data-balloon="${esc(currentLang === "ko" ? "워홀(417/462)·졸업생(485)·일반 482 등 비-DAMA 비자로 이 지역에서 2년 근무한 경력을 인정하여 DAMA 482 없이 곧바로 Direct ENS 186 영주권 신청이 가능합니다!" : "Counts 2 years of regional work on non-DAMA temporary visas toward Direct ENS 186 nomination without holding a DAMA 482 first!")}">Direct 186 가능 <span class="balloon-icon">?</span></span>`
          : "";

        const sl5Warn = o.sl5_upgrade_req
          ? `<div style="margin-top:4px;"><span class="badge badge-warn" data-balloon="${esc(currentLang === "ko" ? "이 지역(GV / Townsville)에서 Skill Level 5 근로자가 ENS 186 영주권을 신청하려면 반드시 Skill Level 1~4 상위 직종으로 승진하여 최소 2년간 근무해야 합니다." : "In GV and Townsville DAMAs, Skill Level 5 workers must upgrade/progress into a Skill Level 1–4 role for at least 2 years to qualify for ENS 186.")}">SL1–4 승진 필수 <span class="balloon-icon">?</span></span></div>`
          : "";

        const ilaWarn = o.ila_warning
          ? `<div style="margin-top:4px;"><span class="badge badge-warn" data-balloon="${esc(currentLang === "ko" ? "노인요양(Aged Care)·원예(Horticulture)·육가공 등 별도 산업 노동협약(ILA)이 있는 섹터의 고용주는 DAMA 대신 ILA 적용 대상인지 반드시 사전 확인해야 합니다 (예: Orana 423111은 장애인 케어만 가능)." : "Employers in sectors covered by an Industry Labour Agreement (Aged Care, Horticulture, Meat) may be required to use the sector ILA instead of DAMA.")}">ILA 섹터 확인 <span class="balloon-icon">?</span></span></div>`
          : "";

        const qualsBalloon = currentLang === "ko"
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
            </td>
            <td>
              <div class="occ-title-main">${esc(o.occupation_title)}</div>
              <div class="occ-specs">
                ANZSCO: <strong>${esc(o.anzsco_code)}</strong>
                ${o.is_non_anzsco ? `<span class="badge badge-burgundy" style="font-size:10.5px;padding:1px 5px;">Non-ANZSCO</span>` : ""}
                ${o.category_or_group ? ` · <span>${esc(o.category_or_group)}</span>` : ""}
              </div>
              ${o.specialisations ? `<div class="occ-specs">${currentLang === "ko" ? "세부전공:" : "Specs:"} ${esc(o.specialisations)}</div>` : ""}
              ${ilaWarn}
            </td>
            <td>
              <span class="badge ${o.skill_level <= 3 ? "badge-teal" : (o.skill_level === 4 ? "badge-burgundy" : "badge-neutral")}" data-balloon="${esc(qualsBalloon)}">
                SL ${o.skill_level} <span class="balloon-icon">?</span>
              </span>
            </td>
            <td>
              ${salBadge}
              <div style="font-size:11.5px;color:#5A5654;margin-top:3px;">${esc(o.tsmit_detail.slice(0, 42))}</div>
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
              <div style="font-size:11.5px;color:#5A5654;margin-top:3px;">${esc(o.pr_pathway_summary.slice(0, 48))}</div>
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
              <button type="button" class="btn-open-modal" data-occ-id="${o.id}">
                ${esc(t("btnRowModal"))}
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Pagination controls
    const pageInfo = document.getElementById("page-info");
    pageInfo.textContent = currentLang === "ko"
      ? `총 ${filteredOccupations.length.toLocaleString()}개 결과 중 ${filteredOccupations.length ? startIdx + 1 : 0}–${Math.min(startIdx + PAGE_SIZE, filteredOccupations.length)} 표시 (페이지 ${currentPage} / ${totalPages})`
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

    const damaName = currentLang === "ko" ? o.dama_name_ko : o.dama_name_en;
    titleEl.textContent = `${o.occupation_title} (ANZSCO ${o.anzsco_code} · Skill Level ${o.skill_level}) — ${damaName}`;

    const fnRefs = o.footnote_ids.map((id) => {
      const fn = DATA.footnotes.find((f) => f.id === id);
      return fn
        ? `<li><strong>[${fn.id}] ${esc(fn.org)}:</strong> <a href="${esc(fn.url)}" target="_blank" rel="noopener">${esc(fn.title)} (${esc(fn.date)}) ↗</a></li>`
        : "";
    }).join("");

    // Build personalized combinator strategy
    let strategyHtml = "";
    if (currentLang === "ko") {
      strategyHtml = `
        <ul style="padding-left:18px;font-size:14px;line-height:1.7;">
          <li><strong>기본 트랙 (만 45~51세 이하):</strong> <strong>SID Subclass 482 (Labour Agreement Stream)</strong>로 스폰서십 승인 후 ${o.dama_id === "pilbara_dama" ? "3년" : "2년"} 풀타임 근무 뒤 <strong>ENS Subclass 186 영주권</strong>으로 전환합니다.</li>
          <li><strong>고연령자 우회 트랙 (만 52~${o.max_age - 1}세 나이 함정 방지):</strong> 482를 먼저 받으면 ${o.dama_id === "pilbara_dama" ? "3년" : "2년"} 뒤 만 ${o.max_age}세가 넘어 186 영주권이 막힐 수 있습니다. 경력이 2년 이상 있다면 만 ${o.max_age}세 전에 처음부터 <strong>SESR Subclass 494 비자</strong>로 노미네이션을 접수하여 나이를 고정한 후, 3년 뒤 <strong>연령 제한이 전혀 없는 Subclass 191 영주권</strong>으로 전환하십시오.</li>
          ${o.direct_186 ? `<li style="color:#2E6B4F;font-weight:700;">★ Direct ENS 186 특전 지역: 워킹홀리데이(417/462), 졸업생 비자(485), 일반 482 등 취업권이 있는 비-DAMA 비자로 이미 이 지역에서 2년 풀타임(또는 파트타임 환산) 근무했다면, DAMA 482를 거치지 않고 곧바로 Direct ENS 186 영주권 신청이 가능합니다!</li>` : ""}
          ${o.sl5_upgrade_req ? `<li style="color:#B23A2E;font-weight:700;">⚠ Skill Level 5 승진 필수 주의: 이 지역에서는 SL5 직종 근로자가 ENS 186 영주권을 받으려면 반드시 Skill Level 1~4 상위 직종으로 승진(Progression)하여 최소 2년간 근무해야 합니다.</li>` : ""}
          ${o.no_186_eng_concession ? `<li style="color:#B23A2E;font-weight:700;">⚠ 186 영어 함정 주의: 사우스 웨스트 DAMA는 ENS 186 단계에서 영어 감면이 없어 IELTS 각 6.0이 필수입니다. 영어 6.0이 어렵다면 반드시 494 &rarr; 191 루트를 선택하십시오.</li>` : ""}
        </ul>
      `;
    } else {
      strategyHtml = `
        <ul style="padding-left:18px;font-size:14px;line-height:1.7;">
          <li><strong>Standard Track (Under Age 51):</strong> Start on <strong>SID Subclass 482 (Labour Agreement Stream)</strong> and transition to <strong>ENS Subclass 186 PR</strong> after ${o.dama_id === "pilbara_dama" ? "3 years" : "2 years"} of full-time regional work.</li>
          <li><strong>Age 52–${o.max_age - 1} Protection Track (SESR 494 &rarr; 191):</strong> Because the Under-${o.max_age} age cap applies at 186 nomination lodgement, applicants close to age ${o.max_age} should lodge <strong>SESR Subclass 494</strong> upfront before turning ${o.max_age}, then transition after 3 years to <strong>Subclass 191 PR (which has NO age cap)</strong>.</li>
          ${o.direct_186 ? `<li style="color:#2E6B4F;font-weight:700;">★ Direct ENS 186 Available: Work experience gained on non-DAMA temporary visas (417/462/485/standard 482) in this region counts toward the 2-year requirement for Direct ENS 186 nomination!</li>` : ""}
          ${o.sl5_upgrade_req ? `<li style="color:#B23A2E;font-weight:700;">⚠ SL5 Promotion Requirement: Skill Level 5 workers in this DAMA must progress into a Skill Level 1–4 occupation for at least 2 years to qualify for ENS 186.</li>` : ""}
        </ul>
      `;
    }

    bodyEl.innerHTML = `
      <div style="background:#F2E4E5;border-left:5px solid #7A1F2B;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:18px;">
        <h4 style="color:#7A1F2B;font-size:15px;font-weight:800;margin-bottom:6px;">
          ${currentLang === "ko" ? "박앤코 변호사 맞춤 비자 조합 공식 (Recommended Visa Combinator)" : "Recommended Visa Pathway & Combinator Strategy"}
        </h4>
        ${strategyHtml}
      </div>

      <div class="modal-grid">
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "1. 급여 요건 (CSIT / TSMIT Concession)" : "1. Salary Threshold & Concession (2026–27)"}</h4>
          <p><strong>${esc(o.min_salary_2026)}</strong></p>
          <p style="font-size:13px;color:#5A5654;margin-top:4px;">${esc(o.tsmit_detail)}</p>
          <p style="font-size:12.5px;color:#5A5654;margin-top:4px;">${esc(currentLang === "ko" ? d.salary_rule_ko : d.salary_rule_en)}</p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "2. 영어 점수 요건 (SID 482 · SESR 494 · ENS 186)" : "2. English Language Requirements"}</h4>
          <p><strong>482 / 494:</strong> ${esc(o.english_482_494)}</p>
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
          <span style="font-size:13px;color:#CFC9BF;">${currentLang === "ko" ? "법무법인 박앤코 박창민 대표변호사 (QLS 공인 이민법 전문변호사) · cpark@parkcolawyers.com" : "Park & Co Lawyers · Chang Min Park (QLS Accredited Specialist) · cpark@parkcolawyers.com"}</span>
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

    titleEl.textContent = currentLang === "ko"
      ? `${d.name_ko} (${d.name_en}) — 지역 전체 자격요건 및 우편번호 가이드`
      : `${d.name_en} — Complete Regional Rules & Postcode Coverage`;

    const fnRefs = d.footnote_ids.map((id) => {
      const fn = DATA.footnotes.find((f) => f.id === id);
      return fn
        ? `<li><strong>[${fn.id}] ${esc(fn.org)}:</strong> <a href="${esc(fn.url)}" target="_blank" rel="noopener">${esc(fn.title)} (${esc(fn.date)}) ↗</a></li>`
        : "";
    }).join("");

    bodyEl.innerHTML = `
      <div class="modal-grid">
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "관할 DAR 기관 및 승인 수수료" : "Designated Area Representative (DAR) & Fee"}</h4>
          <p><strong>${esc(currentLang === "ko" ? d.dar_ko : d.dar_en)}</strong></p>
          <p style="margin-top:4px;"><strong>Fee:</strong> ${esc(currentLang === "ko" ? d.dar_fee_ko : d.dar_fee_en)}</p>
          <p style="margin-top:4px;"><strong>LMT:</strong> ${esc(currentLang === "ko" ? d.lmt_rule_ko : d.lmt_rule_en)}</p>
          <p style="margin-top:6px;"><a href="${esc(d.dar_url)}" target="_blank" rel="noopener">${currentLang === "ko" ? "공식 DAR 웹사이트 열기 ↗" : "Open Official DAR Website ↗"}</a> | <a href="${esc(d.occ_list_url)}" target="_blank" rel="noopener">${currentLang === "ko" ? "공식 직종 리스트 원문 ↗" : "Official Occupation List ↗"}</a></p>
        </div>
        <div class="modal-box">
          <h4>${currentLang === "ko" ? "포함 카운슬(LGA) 및 우편번호(Postcodes)" : "Covered LGAs & Postcodes"}</h4>
          <p><strong>Postcodes:</strong> <code>${esc(d.postcodes)}</code></p>
          <p style="margin-top:6px;font-size:13.5px;">${esc(currentLang === "ko" ? d.lgas_ko : d.lgas_en)}</p>
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
          ${currentLang === "ko" ? `이 지역(${d.code}) 직종 ${d.total_occupations}개만 테이블에 필터링하기` : `Filter Table to ${d.code} (${d.total_occupations} occupations)`}
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

    titleEl.textContent = currentLang === "ko"
      ? "주간 DAMA 공식 출처 정기 폴링 및 자동 업데이트 모니터 (Weekly Polling Engine)"
      : "Weekly Official DAMA Source Auto-Polling & Verification Monitor";

    let pollData = null;
    try {
      const r = await fetch("data/polling_status.json");
      if (r.ok) pollData = await r.json();
    } catch (e) {}

    if (!pollData) {
      bodyEl.innerHTML = `<p>Polling status loading...</p>`;
      modal.classList.add("open");
      return;
    }

    const rowsHtml = (pollData.targets || []).map((t) => {
      const name = currentLang === "ko" ? t.name_ko : t.name_en;
      const stCls = t.http_status === 200 ? "badge-success" : "badge-danger";
      return `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;">
            <strong>${esc(name)}</strong><br/>
            <a href="${esc(t.url)}" target="_blank" rel="noopener" style="font-size:11.5px;">${esc(t.url)} ↗</a>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;text-align:center;">
            <span class="badge ${stCls}">HTTP ${t.http_status}</span>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;text-align:center;">
            <span class="badge badge-teal">${esc(t.change_state.toUpperCase())}</span>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #E7E0D3;font-family:monospace;font-size:11.5px;">
            ${esc((t.normalized_sha256 || "").slice(0, 16))}...
          </td>
        </tr>
      `;
    }).join("");

    bodyEl.innerHTML = `
      <div style="background:#E7F3EC;border-left:5px solid #2E6B4F;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:16px;">
        <h4 style="color:#2E6B4F;font-size:15px;font-weight:800;margin-bottom:4px;">
          ${currentLang === "ko"
            ? `✓ 주간 정기 폴링 엔진 가동 중 (${pollData.schedule_cron_desc})`
            : `✓ Weekly Automated Polling Active (${pollData.schedule_cron_desc})`}
        </h4>
        <p style="font-size:13.5px;color:#2E2E2E;">
          ${currentLang === "ko"
            ? `매주 월요일 오전 07:15 (호주 브리즈번 시각) 217 서버의 systemd 타이머(pnc-dama-weekly-poll.timer)가 호주 연방 내무부(CSIT/TSMIT 급여 기준) 및 13개 DAMA 지정지역대표기관(DAR) 공식 웹페이지를 자동으로 순회(Polling)하여 정규화 SHA-256 해시를 대조하고, 변경 사항 및 일몰 시한(South West 2026.10.30 / Goldfields 2026.12.31)을 웹서비스에 자동 반영한 뒤 218 서버 msmtp로 요약 리포트를 발송합니다.`
            : `Every Monday at 07:15 AEST (Australia/Brisbane), the automated systemd timer (pnc-dama-weekly-poll.timer) polls all 13 DAMA DAR portals and the Department of Home Affairs CSIT/TSMIT pages, verifies normalized SHA-256 content hashes, auto-updates sunset statuses and web datasets, redeploys to GitHub Pages, and emails a verification digest.`}
        </p>
        <div style="font-size:12.5px;color:#5A5654;margin-top:6px;">
          <strong>Last Run ID:</strong> <code>${esc(pollData.run_id)}</code> ·
          <strong>Last Checked:</strong> <code>${esc(pollData.last_polled_at)}</code> ·
          <strong>Verified Base CSIT:</strong> <code>AUD $${Number(pollData.verified_csit_aud || 79423).toLocaleString()}</code>
        </div>
      </div>

      <div style="overflow-x:auto;border:1px solid #DED6C8;border-radius:10px;background:#FFFFFF;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#1A1211;color:#FFFFFF;">
              <th style="padding:10px;text-align:left;">${currentLang === "ko" ? "점검 대상 공식 출처 (15개 엔드포인트)" : "Monitored Official Source (15 Endpoints)"}</th>
              <th style="padding:10px;text-align:center;">HTTP</th>
              <th style="padding:10px;text-align:center;">${currentLang === "ko" ? "변동 상태" : "Status"}</th>
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
    container.innerHTML = DATA.footnotes.map((fn) => {
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
    }).join("");
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
