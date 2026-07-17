# Changelog

[English](CHANGELOG.md) | 한국어

이 프로젝트의 주요 변경 사항을 기록합니다. 버전은 [Semantic Versioning](https://semver.org/)을 따릅니다.

## Unreleased

## 0.1.2 - 2026-07-17

### Removed

- 레거시 설정 키 `pauseRabbitMarkdownGfm.customCss` 및 관련 fallback 로직 제거

## 0.1.1 - 2026-07-17

### Fixed

- 마크다운 미리보기에서 하위 목록(Nested List) 하단 영역이 너무 넓게 표시되는 여백 문제 수정

### Changed

- 기본 테마 파일을 `theme/basic-dark-theme.css`로 이동
- 설치 기본값에서 custom CSS와 `markdown.styles` 경로를 비워 내장 테마만 사용

## 0.1.0 - 2026-07-15

### Added

- GitHub 스타일 alert와 작업 목록 렌더링
- Markdown 미리보기 기본 테마
- 사용자 CSS override와 로컬 파일 자동 새로고침
- Antigravity 및 VS Code 빌드·설치 스크립트
- 오픈소스 기여 문서와 단위 테스트

### Changed

- 프로젝트 이름과 확장 식별자를 `antigravity-markdown-theme`과 `devnneth`로 정리
- Markdown 변환과 custom CSS 관리를 독립 모듈로 분리

### Deprecated

- `pauseRabbitMarkdownGfm.customCss` 설정 키. `antigravityMarkdownTheme.customCss`를 사용하세요.
