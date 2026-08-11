import java.util.*;
class Solution {
    public int solution(int[] priorities, int location) {
        // priorities 값이 다른 경우, 무조건 큰 프로세스가 먼저 실행
        // 같은 프로세스간의 실행순서를 파악하기 위해 큐가 필요함
        Queue<Integer> queue = new LinkedList<>(); // index 저장
        for (int i = 0; i < priorities.length; i++) queue.add(i);
        int sequence = 0;
        while (!queue.isEmpty()) {
            Integer idx = queue.poll();
            int max = 0;
            for (Integer i : queue) max = Math.max(max, priorities[i]);
            if (priorities[idx] >= max) {
                sequence++;
                if (idx == location) return sequence;
            }
            else queue.add(idx);
        }
        return sequence;
    }
}