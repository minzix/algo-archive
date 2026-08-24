import java.util.*;

class Solution {
    public int solution(int[] citations) {
        int answer = 0;
        Arrays.sort(citations);
        for (int i = citations.length - 1; i >= 0; i--) {
            int h = citations.length - i; // h편
            if (citations[i] >= h) answer = h;
            
        }
        // h번 이상 인용된 논문이 h편 이상
        return answer;
    }
}
