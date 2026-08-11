# Algorithm Archive

코딩 테스트 문제를 **어떻게 생각했고, 왜 틀렸으며, 무엇을 배웠는지** 기록하는 정적 학습 아카이브.

[minzix/algorithm](https://github.com/minzix/algorithm) 레포는 BaekjoonHub가 자동 커밋하는 **정답 코드 저장소**다.
이 레포는 그 위에 얹는 **학습 과정 저장소**로, 별도의 DB나 백엔드 없이 레포 자체가 데이터베이스다.

```
algorithm          →  "어떤 문제를 풀었고 정답 코드는 무엇인가"
algo-archive       →  "나는 이 문제를 어떻게 생각했고, 왜 틀렸으며 무엇을 배웠는가"
```

## 구조

```
data/
├── problems.json      문제 메타데이터 (유형, 오답 유형, 복습 상태, 날짜)
├── concepts.json      새로 배운 문법·알고리즘 복습 카드
└── reviews.json       복습 이력

content/problems/pgs-42627/
├── review.md          오답노트 (## 내 접근 / ## 왜 틀렸는가)
├── my-code.java       내 오답 코드
├── answer-code.java   정답 코드 (algorithm 레포에서 임포트)
└── attempts/          복습 때 다시 푼 코드

scripts/               데이터를 쓰는 CLI (사이트는 읽기 전용)
src/                   Astro 정적 사이트
```

**JSON = 데이터, Markdown = 오답노트, Java = 코드**로 역할을 나눈다.

## 기록하는 방법

터미널 없이 **브라우저에서만** 할 수 있다. 폰에서도 된다.

정적 사이트라 서버가 없으므로, 저장하려면 GitHub 에 신원을 증명할 토큰이 필요하다.
`/settings` 에서 기기마다 한 번 등록하면 된다. 토큰은 그 브라우저에만 저장된다.

| 하고 싶은 것 | 어디서 |
|---|---|
| 오답노트 쓰기·고치기 | 문제 상세 맨 아래 `오답노트 쓰기` |
| 복습 결과 남기기 | 복습 4단계 → `복습 결과 저장` |
| 개념 카드 추가 | Concepts → `개념 카드 추가` |

저장하면 레포에 바로 커밋되고 1~2분 뒤 사이트에 반영된다.
JSON 여러 개와 Markdown 이 한 커밋으로 묶이므로 이력이 깔끔하다.

### 터미널을 쓰고 싶다면

같은 일을 하는 CLI 도 있다. 결과물(정렬·들여쓰기까지)은 폼과 동일하다.

```bash
npm run dev                      # 로컬 개발 서버
npm run build                    # 정적 빌드

npm run import                   # algorithm 레포에서 프로그래머스 문제 임포트 (멱등)
npm run annotate <id>            # 유형 / 오답 유형 / 개념 태깅, 오답노트 템플릿 생성
npm run review <id>              # 복습 결과 기록 (상태 · 이력 갱신)
npm run concept                  # 복습 카드 추가
```

문제 id 는 `pgs-42627` 형식이다. CLI 는 로컬 파일만 고치므로 `git push` 해야 사이트에 반영된다.

## 워크플로

```
문제 풀이 → BaekjoonHub 가 algorithm 레포에 정답 코드 커밋
   ↓
npm run import        정답 코드와 메타데이터를 아카이브로 가져옴 (이건 로컬에서)
   ↓
사이트에서 오답노트 쓰기 → 저장
   ↓
브라우저가 레포에 커밋      학습 기록 자체가 Git 활동이 됨
   ↓
GitHub Pages 자동 배포
```

복습할 때는 `/reviews` 에서 문제를 고르면 오답노트를 바로 보여주지 않고,
먼저 접근을 떠올리게 한 뒤 단계적으로 공개한다.

## 배포

https://minzix.github.io/algo-archive/
