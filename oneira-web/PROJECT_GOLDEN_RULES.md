# 2026 매일운세 프로젝트 통합 관리 규칙 (Golden Rules)

본 문서는 AI(Antigravity)와 개발자가 합의한 **절대 규칙**입니다. 향후 모든 작업은 이 규칙을 따르며, AI는 이 규칙을 위반하여 임의로 소스를 섞거나 빌드해서는 안 됩니다.

## 1. 소스 코드의 단일 진실 (Source of Truth)
*   **공식 프로젝트 폴더**: `C:\Project\My-Work-Backup\oneira-web`
*   **금지 사항**: `dream-fortune-ai`나 기타 백업 폴더에서 소스를 가져와 현재 프로젝트에 섞지 마십시오. 필요한 소스는 반드시 'Git Checkout'을 통해서만 가져옵니다.

## 2. 버전 기록 및 정밀 롤백 (Git & Time-Travel)
*   **태그(Tag) 관리**: 주요 릴리스 및 마일스톤에 태그를 지정합니다. (`git tag -a v4.x`)
*   **시간 기반 롤백 (Time-Travel)**: 태그가 기억나지 않을 때, 특정 시점으로 정확히 되돌리기 위해 깃의 **Reflog**와 **시간 지정자**를 사용합니다.
    *   명령어 예시: `git checkout "master@{2026-02-07 14:00:00}"`
    *   AI는 사용자가 "어제 오후 2시쯤 상태로 돌아가"라고 하면 이 명령어를 사용하여 물리적으로 복구합니다.
*   **빌드 감사 로그 (Build Audit Log)**: APK 생성 시점마다 `BUILD_HISTORY.log` 파일에 [시간, 커밋ID, 파일명, 주요 변경사항]을 자동으로 기록하여, 사용자가 시간으로 버전을 특정하기 쉽게 돕습니다.

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
