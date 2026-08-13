import java.util.*;

class Solution {
    public int[] solution(int[] progresses, int[] speeds) {
        
        Queue<Integer> queue = new LinkedList<>();
        ArrayList<Integer> list = new ArrayList<>();
        
        for (int p : progresses) queue.add(p);
        
        int day = 0;
        int idx = 0;
              
        while (!queue.isEmpty()) {
            Integer progress = queue.poll();
            int prev = day * speeds[idx]; // 추가 필요
            int add = (100 - (progress + prev)) / speeds[idx];
            if ((100 - progress) % speeds[idx] != 0) add += 1;
            day += add;
            System.out.println("day = " + day);
            idx++;
            
            int count = 1;
            while (!queue.isEmpty() && queue.peek() + day * speeds[idx] >= 100) {
                queue.poll();
                idx++;
                count++;
                System.out.println("idx = " + idx + " count = " + count);
            }
            list.add(count);
        }
        int[] answer = new int[list.size()];
        for (int i = 0; i < list.size(); i++) answer[i] = list.get(i);
        return answer;
    }
}
