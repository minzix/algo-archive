import java.util.*;

class Solution {
    public int solution(int[] priorities, int location) {
        // 우선순위큐 하나, 일반 큐 하나 만들기. 
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        Queue<Integer> queue = new LinkedList<>();
        
        for (int i = 0; i < priorities.length; i++) {
            queue.add(i);
            pq.add(priorities[i]);
        }
        
        // 두 큐에서 동시에 peek() 하고, 값이 서로 같으면 큐 두 개에서 같이 poll() 하기. 
        int count = 1;
        while (!queue.isEmpty()) {
            if (pq.peek() == priorities[queue.peek()]) {
                if (queue.peek() == location) return count;
                else {
                    pq.poll();
                    queue.poll();
                    count++;
                }
            } else queue.add(queue.poll());
        }
        return count;
    }
}
