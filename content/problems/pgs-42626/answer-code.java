import java.util.*;

class Solution {
    public int solution(int[] scoville, int K) {
        int answer = 0;
        // int[] scoville -> PriorityQueue<Integer> pq
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int s : scoville) pq.offer(s);
        while (pq.peek() < K) {
            if (pq.size() == 1 && pq.peek() < K) return -1;
            Integer first = pq.poll();
            Integer second = pq.poll();
            Integer mix = first + second * 2;
            pq.offer(mix);
            answer++;
        }
        return answer;
    }
}