class Solution {
    public int solution(int[] diffs, int[] times, long limit) {

        int left = 1;
        int right = 0;

        // 숙련도의 최대값 = 최대 난이도
        for (int diff : diffs) right = Math.max(right, diff);

        int answer = right;

        while (left <= right) {
            int level = (left + right) / 2;

            long consumedTime = 0;

            for (int i = 0; i < diffs.length; i++) {

                if (diffs[i] <= level) {
                    consumedTime += times[i];
                } else {
                    consumedTime += (long) (diffs[i] - level)
                            * (times[i - 1] + times[i])
                            + times[i];
                }
            }

            if (consumedTime <= limit) {
                answer = level;
                right = level - 1;   // 더 작은 숙련도도 가능한지 탐색
            } else {
                left = level + 1;    // 숙련도를 높여야 함
            }
        }

        return answer;
    }
}