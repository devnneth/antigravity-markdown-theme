# Antigravity Markdown Theme

[English](README.md) | 한국어

Antigravity IDE의 Plan/Review 모드의 테마를 모티프로 만든 Antigravity 및 Visual Studio Code 용 마크다운 테마 플러그인입니다. Custom CSS를 지원합니다.

## 최근 변경 사항 (v0.1.1)

- **Fixed**: 마크다운 미리보기에서 하위 목록(Nested List) 하단 영역이 너무 넓게 표시되는 여백 문제 수정
- **Changed**: 기본 테마 파일을 `theme/basic-dark-theme.css`로 이동
- **Changed**: 설치 기본값에서 custom CSS와 `markdown.styles` 경로를 비워 내장 테마만 사용

전체 릴리스 이력은 [CHANGELOG.ko.md](CHANGELOG.ko.md) (또는 [English](CHANGELOG.md))를 참고하세요.

## 테마 렌더링 샘플

![alt text](https://raw.githubusercontent.com/devnneth/antigravity-markdown-theme/main/assets/sample-1.png)
![alt text](https://raw.githubusercontent.com/devnneth/antigravity-markdown-theme/main/assets/sample-2.png)


## 빌드 요구 사항

- Node.js 20 이상
- npm
- Antigravity IDE 또는 VS Code 1.70 이상

## 개발 환경 준비

```sh
git clone https://github.com/devnneth/antigravity-markdown-theme.git
cd antigravity-markdown-theme
npm ci
```

## 빌드 및 설치

```sh
./scripts/build.sh
./scripts/install-antigravity.sh
./scripts/install-vscode.sh
```

`build.sh`는 정적 검사와 테스트를 실행하고, `package.json` 버전에 맞는 `antigravity-markdown-theme-<version>.vsix`를 생성합니다. 설치 스크립트는 빌드 후 해당 IDE에 VSIX를 설치합니다.

CLI를 자동으로 찾지 못할 때는 환경 변수로 실행 파일을 지정할 수 있습니다.

```sh
ANTIGRAVITY_CLI=/path/to/antigravity-ide ./scripts/install-antigravity.sh
VSCODE_CLI=/path/to/code ./scripts/install-vscode.sh
```

설치 후 IDE에서 `Developer: Reload Window`를 실행합니다.

## 사용자 CSS

기본 테마로 항상 적용됩니다. 사용자 또는 작업 영역 설정에서 CSS 경로를 추가하면 그 CSS가 뒤에 로드되어 내장 스타일을 override합니다.


```json
{
  "antigravityMarkdownTheme.customCss": [
    "/<PATH>/style.css"
  ]
}
```

## 글꼴 크기

본문 기준 크기는 IDE의 `markdown.preview.fontSize` 설정을 따릅니다. 제목, 표, 코드 등은 상대 단위로 함께 확대·축소됩니다.

```json
{
  "markdown.preview.fontSize": 16
}
```

## 개발 명령

```sh
npm run check
npm test
npm run package:vsix
```

## 코드 구조

```text
extension.js                  확장 진입점과 Markdown-it 등록
src/markdown-transform.js     alert와 작업 목록 토큰 변환
src/custom-css-manager.js     custom CSS 설정 동기화와 파일 감시
theme/basic-dark-theme.css    배포되는 기본 미리보기 테마
test/                         Node 내장 테스트 러너 기반 단위 테스트
scripts/                      빌드와 IDE별 설치 스크립트
```

변경 방법과 검증 기준은 [CONTRIBUTING.md](CONTRIBUTING.md), 릴리스 이력은 [CHANGELOG.md](CHANGELOG.md)를 참고하세요.

## 라이선스

[MIT](LICENSE) © [devnneth](https://github.com/devnneth) and contributors
