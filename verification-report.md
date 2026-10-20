# Park & Co DAMA Navigator — Internal Verification Report (`T01`–`T30`)

- **Verification Date**: `2026-10-20`
- **Test Runner**: `uv run --with playwright pytest -v /home/cp/ag/dama-navigator/tests/` (`11/11` test modules/suites **PASSED**, covering all `T01`–`T30` acceptance tests)
- **Dataset Summary**:
  - Active DAMAs: **13**
  - Active Regional Occupation Registration Entries (`total_records`): **2,474**
  - Unique Occupations across 13 DAMAs (`unique_occupations_count`): **781**
  - Superseded / Removed Occupations (`superseded_occupations`): **2** (`121215` Grape Grower & `121411` Mixed Crop and Livestock Farmer in Orana DAMA, removed `2026-04-03`)
  - Primary Source Footnotes: **29** (`27` Live HTTP 200 OK + `2` WAF-403 `gscdama.warrnambool.vic.gov.au` with verified local snapshots; **0** HTTP 404)

---

## 1. Acceptance Test Matrix (`T01`–`T30`)

| Test ID | Acceptance Criterion (`GEMINI_CORRECTION_INSTRUCTIONS.md`) | Automated Test Location | Result |
| :--- | :--- | :--- | :--- |
| **T01** | Goldfields DAMA displays both `2026-11-13` application cutoff and `2026-12-31` agreement expiry, and transitions to `closed_to_new_applications` after `2026-11-13`. | `test_t01_t05_data_and_lifecycle_rules` & Playwright UI check | **PASS** |
| **T02** | South West & Goldfields expiry notes explicitly confirm existing approved Labour Agreements and existing visas are NOT automatically cancelled. | `test_t01_t05_data_and_lifecycle_rules` | **PASS** |
| **T03** | FNQ DAMA official 11 LGAs include `Cairns` (`matched=True`) and exclude `Carpentaria` (`matched=False`). | `test_t01_t05_data_and_lifecycle_rules` & Playwright `checkLocationMatch` | **PASS** |
| **T04** | Goldfields DAMA official 8 LGAs include `Shire of Ravensthorpe` (`matched=True`) and exclude `Shire of Wiluna` (`matched=False`). | `test_t01_t05_data_and_lifecycle_rules` & Playwright `checkLocationMatch` | **PASS** |
| **T05** | Orana DAMA active occupation count is `129`, and `121215` & `121411` are excluded from active `occupations` (stored in `superseded_occupations`). | `test_t01_t05_data_and_lifecycle_rules` | **PASS** |
| **T06** | Applicant with `overall=5.0, min_band=3.5` is rejected (`eligible=False`) for NT (`min 4.0`), SA (`min 4.0`), and GV Table 6.1 (`min 4.0`), and accepted only for `no band minimum` roles (e.g. GV Table 6). | `test_t06_..._playwright` | **PASS** |
| **T07** | Selecting `"5.0-noband"` returns `0` rows where `min_ielts_band_482 > 0` (never matches NT `4.5 min 4.0` or GV Table 6.1). | `test_t06_..._playwright` | **PASS** |
| **T08** | Goulburn Valley DAMA separates Table 6 (`64` occupations, `no band min`) and Table 6.1 (`4` occupations: `131112`, `132311`, `225411`, `234112`, `min 4.0`). | `test_t08_..._data_integrity` | **PASS** |
| **T09** | Great South Coast DAMA has `43` occupations with English concession (`IELTS 5.0, no minimum component score`) and `71` standard English occupations. | `test_t08_..._data_integrity` | **PASS** |
| **T10** | WA State-wide DAMA filters **271** occupations for Category 2 Metropolitan Perth (`wa_cat2_perth=True`) and **358** occupations for Category 3 Regional WA (`wa_cat3_regional=True`). | `test_t06_..._playwright` | **PASS** |
| **T11** | WA State-wide occupation modal explicitly distinguishes **Category 2 Metro Perth (3 years to ENS 186)** vs **Category 3 Regional WA (2 years to ENS 186)**. | `test_t06_..._playwright` | **PASS** |
| **T12** | SA postcode `5950` is classified as `adelaide_metro` and rejected (`eligible=False`) for SA Regional Type 2 (`IELTS 4.5`) English concession. | `test_t06_..._playwright` | **PASS** |
| **T13** | Without a verified SA Outer Regional postcode, SA Regional `IELTS 4.5` is marked as `requires_verification` (`추가 확인 필요`). | `test_t06_..._playwright` | **PASS** |
| **T14** | FNQ Type 2 max non-monetary cap is computed as `10%` of full CSIT (`$7,942.30`), with cash `>= $71,481`, total `>= $79,423`, and total `>= AMSR`. | `test_t06_..._playwright` | **PASS** |
| **T15** | In NT DAMA III, offering `$67,510` when market salary rate (`AMSR`) is `$70,000` returns `eligible=False` (`status="not_met"`). | `test_t06_..._playwright` | **PASS** |
| **T16** | Passing `482` English (`5.0` in South West or `4.5` in NT) does NOT mark `186` English as passed (`sw186=False`, `nt186=False`). | `test_t06_..._playwright` | **PASS** |
| **T17** | Age `52` + `2` years transition = `54` (`< 55`) and `exceeds_186_age_cap_after_transition` is `False`. | `test_t06_..._playwright` | **PASS** |
| **T18** | For `max_age == 50` (SL5) occupations, the transition warning range is `48–49` (`만 48~49세`) and never renders inverted `52~49`. | `test_t06_..._playwright` | **PASS** |
| **T19** | Direct ENS 186 with 2 years of non-DAMA regional work is classified as `requires_verification` (`추가 확인 필요`: DAR endorsement + Labour Agreement ENS 186 stream + occupation/skill level). | `test_t06_..._playwright` | **PASS** |
| **T20** | Poller running in `--use-cache` mode records `fetch_status="cache"` and `validation_status="cache_used_requires_live_verification"`, never claiming live verification. | `test_t20_t21_t22_poller_honesty` | **PASS** |
| **T21** | Poller rejects short stubs (`<1,000` bytes, e.g. `295`-byte stub) or challenge/error pages with `parse_status="parse_failed"` and `validation_status="failed"`. | `test_t20_t21_t22_poller_honesty` | **PASS** |
| **T22** | When `detected_salaries` is empty (`[]`), `resolve_VerifySalaryStatus([])` returns `salary_verification_status="not_extracted_requires_review"` and `verified_csit_aud=None`. | `test_t20_t21_t22_poller_honesty` | **PASS** |
| **T23** | All `29` footnote URLs in `sources.jsonl` and `dama_navigator_data.json` are verified (`27` HTTP 200 + `2` WAF-403 with full local snapshot; `0` HTTP 404). | `test_t08_..._data_integrity` | **PASS** |
| **T24** | GSC `"0 70499"` (5 rows) is normalized to `"070499"` with `is_non_anzsco=True`, and NT/Goldfields dual-code rows are normalized to 6-digit `anzsco_code` + `legacy_anzsco_alias`. | `test_t08_..._data_integrity` | **PASS** |
| **T25** | UI and JSON dynamically derive regional counts from row data and display `2,474건` (`지역별 직종 등록 항목 수`) alongside `781개 고유 직종`. | `test_t08_..._data_integrity` & Playwright UI check | **PASS** |
| **T26** | Every occupation row & modal displays **충족된 필터 조건 (Matched Filter Criteria)** and **미확인 · 추가 확인 필수 요건 (Unchecked Criteria Requiring Verification)**. | `test_t06_..._playwright` | **PASS** |
| **T27** | Searching `"개발자"` matches Developer/Programmer occupations and returns `0` matches for `Accountant` (`221111`). | `test_t08_..._data_integrity` | **PASS** |
| **T28** | WA State-wide LMT text reflects verified SMER registration + unique ID + 28-day LMT within 12 months, and explicitly notes LMT is not required for ENS 186. | `test_t08_..._data_integrity` | **PASS** |
| **T29** | Playwright desktop (`1440x900`) and mobile (`375x812`) layout checks pass with zero horizontal overflow (`scrollWidth <= clientWidth + 2`). | `test_t06_..._playwright` & `test_web_ui_playwright.py` | **PASS** |
| **T30** | Hero/section titles use exploratory positioning (`"호주 13개 DAMA 직종 · 지역 및 협약 요건 탐색"`) and tri-state status badges (`검토 후보` / `추가 확인 필요` / `조건 미충족`). | `test_t06_..._playwright` | **PASS** |

---

## 2. Structural Guardrails Added to Prevent Future Errors

1. **Single Source of Truth for Regional Counts (`build_dynamic_rules`)**:
   - Eliminated hardcoded summary counts in `DAMAS_META`. Every DAMA's `total_occupations`, `tsmit_concession_count`, `english_concession_count`, `age_55_count`, and summary strings are now computed directly from the verified occupation rows at build time.
2. **Strict Code Normalization & Provenance (`normalize_code_fields` + `source-manifest.json`)**:
   - Any whitespace or dual-code notation (`"0 70499"`, `"394112 (394111)"`, `"362311 / 362313"`) is automatically normalized into a clean 6-digit `anzsco_code` while preserving `raw_anzsco_code` and `legacy_anzsco_alias`.
   - Every DAMA and footnote is linked to `data/source-manifest.json` with SHA-256 hashes, document versions, and effective dates.
3. **Honest Poller Validation (`validate_target_payload` & `resolve_VerifySalaryStatus`)**:
   - The weekly poller (`dama_navigator_poller.py`) now enforces a minimum payload size (`>= 1,000` bytes), required semantic markers per DAMA, PDF text extraction via `pdftotext`, explicit `live` vs `cache` status reporting, and refuses to stamp salary verification as `PASS` unless `$79,423` is actually extracted from the payload.
4. **Automated `T01`–`T30` Regression Gate**:
   - `tests/test_codex_audit_t01_t30.py` runs both Python data/poller assertions and headless Chromium Playwright checks across all 30 audit test cases before any GitHub Pages deployment.
