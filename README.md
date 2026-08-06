# 모바일 청첩장

사진 중심의 시네마틱한 모바일 청첩장입니다. 빌드 과정이 없는 정적 HTML/CSS/JS라 GitHub Pages / Vercel에 바로 배포할 수 있고, 내용은 `config.js` 한 파일만 수정하면 전체 페이지에 반영됩니다.

## 파일 구조
```
index.html      청첩장 마크업 (내용은 대부분 config.js를 읽어 JS가 채웁니다)
config.js       ★ 실제로 수정할 설정 파일 (이름/날짜/사진/계좌/RSVP 등 전부 여기)
qr.html         배포 후 URL을 넣으면 QR 코드를 만들어주는 도구
css/style.css   레이아웃 + 시네마틱 톤앤매너(아치 프레임, 스크롤 페이드인 등)
js/main.js      렌더링 + 캘린더/갤러리/지도/RSVP/공유/BGM 기능
gas/Code.gs     RSVP를 구글 시트에 저장하는 Google Apps Script 코드
music/          BGM mp3 파일을 넣는 폴더 (직접 준비 필요)
```

## 로컬 확인
`index.html`을 브라우저로 바로 열거나, 다음처럼 로컬 서버를 띄워 확인하세요.
```bash
npx serve .
```

## 1. 내용 채우기 (`config.js`)
`config.js`를 열어 아래 항목을 실제 정보로 바꾸세요. 텍스트로 정리해서 "이 내용으로 config.js 채워줘"라고 요청하시면 대신 채워 드립니다.

- `intro`: 신랑·신부 이름, 예식 일시 문구, 장소 약칭, 메인 사진, 인사말, 아치형(`archFrame:true`)/풀스크린(`false`) 여부
- `parents`: 양가 부모님 성함, 장남·장녀 등 관계
- `contacts`: "축하 연락하기"에 뜨는 연락처 목록
- `calendar.date`: 캘린더/디데이 계산 기준 (ISO 날짜, 예: `'2026-11-14T13:00:00+09:00'`)
- `video`: 예식 영상(유튜브) 있으면 `enabled:true` + URL
- `gallery`: 사진 URL 배열 (지금은 picsum.photos 임시 이미지)
- `map`: 장소명, 주소, 위도/경도(`lat`,`lng`), 교통 안내
- `information`: 식사 안내, 포토부스 등 자유 추가 가능한 안내 블록
- `accounts`: 양가 계좌번호
- `rsvp.endpoint`: 아래 "2. RSVP 구글시트 연동" 완료 후 발급되는 URL
- `share`: 링크 공유/카카오톡 카드에 쓰일 제목·설명·썸네일

## 2. RSVP 구글시트 연동
지금은 `rsvp.endpoint`가 비어 있어 제출 시 안내 메시지만 뜨고 실제로 저장되지 않습니다. 실제로 저장하려면:

1. 새 Google Sheets 문서를 만듭니다.
2. 메뉴에서 **확장 프로그램 → Apps Script**를 클릭합니다.
3. 열린 편집기의 코드를 지우고 이 프로젝트의 `gas/Code.gs` 내용을 그대로 붙여넣습니다.
4. 우측 상단 **배포 → 새 배포**를 클릭 → 유형은 **웹 앱**.
   - 실행 대상: **나**
   - 액세스 권한: **전체 허용(익명 포함)**
5. 배포 후 나오는 **웹 앱 URL**을 복사합니다.
6. `config.js`의 `rsvp.endpoint`에 그 URL을 붙여넣습니다.
7. 시트에 `RSVP`라는 탭이 자동 생성되고, 제출될 때마다 한 줄씩 쌓입니다.

## 3. 카카오톡 공유 연동
지금은 카카오톡 공유 버튼이 숨겨져 있습니다(`kakao.appKey`가 비어 있으면 자동으로 숨김). 활성화하려면:

1. [Kakao Developers](https://developers.kakao.com)에 가입하고 애플리케이션을 하나 추가합니다.
2. **플랫폼 → Web** 플랫폼을 등록하고, 배포한 사이트 주소를 사이트 도메인으로 등록합니다.
3. **앱 키** 중 **JavaScript 키**를 복사합니다.
4. `config.js`의 `kakao.appKey`에 붙여넣습니다.
5. 새로고침하면 카카오톡 공유 버튼이 나타나고, 눌렀을 때 `share` 설정(제목/설명/썸네일)으로 카드형 공유가 됩니다.

## 4. 배경음악(BGM)
1. 본인이 사용 권한을 가진 mp3 파일을 준비해 `music/bgm.mp3`로 저장합니다. (저작권 있는 음원을 무단 사용하지 않도록 주의하세요.)
2. 우측 상단 이퀄라이저 아이콘이 재생/정지 토글 버튼입니다.
3. 브라우저 자동재생 정책 때문에 페이지 진입 직후 자동재생이 막힐 수 있는데, 이 경우 화면을 한 번 터치/클릭하면 자동으로 재생을 시도합니다.
4. 음악을 쓰지 않으려면 `config.js`의 `bgm.enabled`를 `false`로 두세요.

## 5. 배포하기
### GitHub Pages
```bash
git init
git add .
git commit -m "wedding invitation"
git branch -M main
git remote add origin <저장소 URL>
git push -u origin main
```
저장소 Settings → Pages → Source에서 `main` 브랜치, 루트(`/`)를 선택하면 몇 분 후 `https://<username>.github.io/<repo>/`에서 확인할 수 있습니다.

### Vercel
```bash
npm i -g vercel
vercel
```
Framework Preset은 **Other**, Build Command는 비워두고 Output Directory는 `.`로 두면 됩니다.

## 6. QR 코드 생성 및 공유 방법
1. 사이트를 배포하고 실제 접속 주소를 확인합니다.
2. 배포된 사이트에서 `/qr.html`로 접속합니다.
3. 입력창에 청첩장 주소를 넣고 "QR 코드 생성"을 누르면 QR 이미지가 만들어집니다.
4. "이미지 다운로드"로 저장하거나 이미지를 길게 눌러 저장하세요.
5. 인쇄물, 문자메시지, 카카오톡 등에 QR 이미지를 첨부해 공유하면, 하객은 스마트폰 카메라로 비추기만 해도 바로 청첩장에 접속됩니다.

## 알아두면 좋은 점
- 지도는 API 키가 필요 없는 OpenStreetMap 임베드를 사용합니다. 실제 위치는 `config.js`의 `map.lat`/`map.lng`를 정확한 좌표로 바꿔야 정확하게 표시됩니다.
- 계좌번호·연락처 등 민감한 정보가 포함되므로, 검색엔진 노출을 막으려면 `robots.txt`로 색인을 차단하거나 링크를 아는 사람만 접근하게 하는 것을 권장합니다.
- 갤러리·메인 사진은 현재 picsum.photos 임시 이미지입니다. 실제 사진 URL이나 파일을 알려주시면 `config.js`에 반영해 드립니다.
