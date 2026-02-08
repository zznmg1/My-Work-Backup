# 2026 매일운세 개발 및 빌드 표준 가이드 (v1.0)

본 문서는 앱 개발부터 구글 플레이 스토어 배포까지의 표준 절차를 정의합니다.

## 1. 개발 및 빌드 흐름 (Web to Android)
*   **1단계: 웹 개발**: 기본적인 모든 기능과 UI는 React/Vite 환경에서 먼저 완성하고 브라우저에서 검증합니다.
*   **2단계: 동기화**: `npm run build`를 실행하여 `dist` 폴더를 생성한 후, `npx cap sync` 명령어로 안드로이드 소스에 반영합니다.
*   **3단계: 안드로이드 빌드**: 
    *   테스트용: `gradlew assembleRelease` (APK 생성)
    *   출시용: `gradlew bundleRelease` (AAB 생성)

## 2. 구글 광고(AdMob) 연합 규칙
광고를 연동할 때는 반드시 다음 정보가 사전에 준비되어야 합니다.
*   **App ID**: AdMob 앱 설정에 있는 앱 ID (예: `ca-app-pub-...~...`)
*   **광고 단위 ID**:
    *   **보상형(Reward)**: `ca-app-pub-.../...`
    *   **배너(Banner)**: `ca-app-pub-.../...`
*   **적용 위치**: `AndroidManifest.xml`에 App ID를 등록하고, `App.tsx` 또는 Ad 정의 파일에서 각 단위 ID를 매칭합니다.

## 3. 구글 플레이 출시 준비 (Final Mile)
*   **버전 관리**: 신규 출시 시 반드시 `android/app/build.gradle`의 `versionCode`를 이전보다 높여야 합니다 (+1 추천).
*   **서명(Signing)**: `upload-keystore.jks` 파일과 `key.properties`가 `android/app` 폴더 내에 정확히 존재해야 합니다.
*   **산출물**: 최종적으로 바탕화면에 복사된 `_FINAL_CORRECTED.aab` 파일을 콘솔에 업로드합니다.

## 4. [중요] 버전 복구 및 소스 보존 (Rollback Strategy)
자꾸 이상한 버전이 빌드되는 문제를 방지하기 위해 다음 규칙을 **강제**합니다.

### A. Git Tag 사용 (가장 추천)
단순 커밋은 시간이 흐르면 찾기 어렵습니다. 성공적인 빌드가 나올 때마다 **태그(Tag)**를 붙입니다.
*   명령어: `git tag -a v4.3 -m "광고 및 아이콘 수정 완료 v4.3"`
*   복구 방법: `git checkout v4.3`을 하면 해당 빌드 시점의 소스코드로 **1초 만에 완벽하게** 돌아갑니다.

### B. 물리적 아카이브 (이중 안전장치)
불안할 경우, 빌드 성공 직후 프로젝트 폴더 전체를 복사하여 별도 폴더로 보관합니다.
*   파일명 예시: `_ARCHIVE_2026/oneira-web-v4.3-AD-FINAL`
*   이 방식은 Git이 꼬여도 물리적으로 파일이 남아있어 가장 확실합니다.

### C. 골든 소스 관리
*   작업 중인 폴더(`oneira-web`)가 항상 **최신 표준**이 되도록 관리하며, 실험적인 작업은 `_TEST` 폴더에서 따로 진행한 후 합칩니다.
