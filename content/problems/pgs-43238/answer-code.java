import java.util.*;

class Solution {
    public long solution(int n, int[] times) {
        Arrays.sort(times);
        
        long answer = 0;
        long right = (long) times[times.length - 1] * n;
        long left = 0;
        
        while (left <= right) {
            long sum = 0; // 시간 당 처리 가능한 사람 수
            long mid = (right + left) / 2; 
            
            for (int t : times) sum += (mid / t);
            
            if (sum >= n) {
                answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }    
        }
        return answer;
    }
}