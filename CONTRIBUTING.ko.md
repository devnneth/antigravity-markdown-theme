# Contributing

[English](CONTRIBUTING.md) | 한국어

Antigravity Markdown Theme에 기여해 주셔서 감사합니다.

## 시작하기

1. 저장소를 fork하고 clone합니다.
2. Node.js 20 이상에서 `npm ci`를 실행합니다.
3. 변경 전에 `npm test`가 통과하는지 확인합니다.
4. 기능별로 작은 변경을 만들고 관련 테스트를 추가합니다.

## 개발 원칙

- 원본 Markdown 파일을 수정하지 않습니다.
- 일반 blockquote와 일반 list의 렌더링을 불필요하게 변경하지 않습니다.
- Markdown 문법 변환은 `src/markdown-transform.js`에 둡니다.
- IDE 설정과 파일 감시는 `src/custom-css-manager.js`에 둡니다.
- 미리보기 외형만 바꾸는 경우에는 `theme/basic-dark-theme.css`만 수정합니다.
- 새로운 빌드 단계가 꼭 필요하지 않다면 CommonJS와 Node 내장 테스트 러너를 유지합니다.

## 검증

```sh
npm run check
npm test
./scripts/build.sh
```

CSS 변경은 Antigravity와 VS Code의 내장 Markdown 미리보기에서 직접 확인합니다. 최소한 다음 항목을 점검합니다.

- `markdown.preview.fontSize`를 12, 14, 20으로 바꿨을 때 전체 요소가 비례하는지
- 표 안쪽 경계와 라운딩이 깨지지 않는지
- alert가 hover 전후에 움직이거나 잘리지 않는지
- 체크된 작업 목록과 체크되지 않은 작업 목록이 구분되는지
- 일반 인용문이 alert로 오인되지 않는지

## Pull request

- 변경 이유와 사용자에게 보이는 차이를 설명합니다.
- 동작 변경에는 테스트를 포함합니다.
- 시각 변경에는 가능하면 변경 전후 스크린샷을 첨부합니다.
- `CHANGELOG.ko.md`의 `Unreleased` 항목을 갱신합니다.
- 생성된 `.vsix` 파일은 커밋하지 않습니다.

## 릴리스

1. `package.json`의 버전을 갱신합니다.
2. `CHANGELOG.ko.md`의 `Unreleased` 내용을 새 버전 항목으로 옮깁니다.
3. `npm ci`, `npm run check`, `npm test`를 실행합니다.
4. `./scripts/build.sh`로 VSIX를 생성합니다.
5. Antigravity와 VS Code에 각각 설치해 smoke test를 수행합니다.
