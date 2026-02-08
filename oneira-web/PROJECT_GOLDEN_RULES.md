# 2026 매일운세 프로젝트 통합 관리 규칙 (Golden Rules)

본 문서는 AI(Antigravity)와 개발자가 합의한 **절대 규칙**입니다. 향후 모든 작업은 이 규칙을 따르며, AI는 이 규칙을 위반하여 임의로 소스를 섞거나 빌드해서는 안 됩니다.

## 1. 소스 코드의 단일 진실 (Source of Truth)
*   **공식 프로젝트 폴더**: `C:\Project\My-Work-Backup\oneira-web`
*   **금지 사항**: `dream-fortune-ai`나 기타 백업 폴더에서 소스를 가져와 현재 프로젝트에 섞지 마십시오. 필요한 소스는 반드시 'Git Checkout'을 통해서만 가져옵니다.

## 2. 버전 기록 및 롤백 (Git Flow)
*   **커밋 강제화**: APK/AAB 빌드 성공 또는 주요 기능(광고, 디자인 수정) 완료 시 즉시 커밋하고 **태그(Tag)**를 생성합니다.
*   **태그 명명 규칙**: `v[버전번호]-[특징]` (예: `v4.3-AD-FINAL`)
*   **롤백 프로세스**:
    1.  사용자가 "v4.0으로 돌아가"라고 하면, AI는 메시지나 파일 검색이 아닌 `git checkout [Tag]`를 먼저 실행하여 환경을 물리적으로 초기화합니다.
    2.  초기화 후 `npx cap sync`를 통해 안드로이드 환경까지 완벽히 일치시킵니다.

## 3. 빌드 및 배포 표준 (Build Standard)
*   **빌드 시퀀스**: `npm run build` (웹 빌드) -> `npx cap sync` (동기화) -> `gradlew assembleRelease` (안드로이드 빌드)
*   **구글 플랫폼 필수 체크리스트**:
    1.  **Version Code**: 이전 빌드보다 무조건 +1 증가.
    2.  **Package Name**: `com.dreamfortune.ai` 고정 (스토어 ID 유지).
    3.  **Signing**: `upload-keystore.jks`를 이용한 정식 서명 필수.
    4.  **AdMob**: `AndroidManifest.xml`의 App ID와 `App.tsx`의 단위 ID 일치 여부 확인.

## 4. 광고 및 수익화 (Monetization)
*   **보상형 광고**: 1일 1회 무료 제공 후, 추가 사용 시 광고 시청(+1 크레딧) 로직 유지.
*   **배너 광고**: 하단 고정형 유지.
*   **광고 ID**: `DEVELOPMENT_RULES.md`에 기록된 실무용 ID(Production ID)만 사용.

## 5. 산출물 관리 (Artifacts)
*   모든 최종 APK 및 AAB는 바탕화면에 명확한 이름으로 복사합니다.
*   형식: `2026매일운세_v[버전]_[상태].apk/aab`

---
**이 규칙은 프로젝트의 최우선 순위이며, AI는 작업을 시작하기 전 항상 이 문서를 먼저 숙지해야 합니다.**
