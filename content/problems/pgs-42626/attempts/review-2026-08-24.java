import java.util.*;

class Solution {
    public int solution(int[] scoville, int K) {
        int answer = 0; // count
        
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int s : scoville) pq.add(s);
        
        while (pq.size() > 1 && pq.peek() < K) {
            int a = pq.poll();
            int b = pq.poll();
            pq.add(a + b * 2);
            answer++;
        }
        if (pq.size() == 1 && pq.peek() < K) return -1;
        else return answer;
    }
}
