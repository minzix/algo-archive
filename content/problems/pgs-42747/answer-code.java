import java.util.*;

class Solution {
    public int solution(int[] citations) {
        int answer = 0;
        Arrays.sort(citations); // int[] 타입은 정렬 기준 지정 불가
        for (int i = citations.length - 1; i >= 0; i--) {
            int h = citations.length - i;
            if (h <= citations[i]) {
                answer = h;
            }
        }
        return answer;
    }
}