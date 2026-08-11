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

## 사용법

```bash
npm run dev                      # 로컬 개발 서버
npm run build                    # 정적 빌드

npm run import                   # algorithm 레포에서 프로그래머스 문제 임포트 (멱등)
npm run annotate <id>            # 유형 / 오답 유형 / 개념 태깅, 오답노트 템플릿 생성
npm run review <id>              # 복습 결과 기록 (상태 · 이력 갱신)
npm run concept                  # 복습 카드 추가
```

문제 id는 `pgs-42627` 형식이다.

## 워크플로

```
문제 풀이 → BaekjoonHub가 algorithm 레포에 정답 코드 커밋
   ↓
npm run import        정답 코드와 메타데이터를 아카이브로 가져옴
   ↓
npm run annotate      유형·오답 유형 태깅, 오답노트 작성
   ↓
git commit            학습 기록 자체가 Git 활동이 됨
   ↓
GitHub Actions → GitHub Pages 자동 배포
```

복습할 때는 `/reviews`에서 문제를 고르면 오답노트를 바로 보여주지 않고,
먼저 접근을 떠올리게 한 뒤 단계적으로 공개한다. 결과는 `npm run review`로 기록한다.

## 배포

https://minzix.github.io/algo-archive/
