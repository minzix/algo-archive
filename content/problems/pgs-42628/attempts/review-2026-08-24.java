import java.util.*;

class Solution {
    public int[] solution(String[] operations) {

        PriorityQueue<Integer> maxQueue = new PriorityQueue<>((a, b) -> b - a);
        PriorityQueue<Integer> minQueue = new PriorityQueue<>();
        List<Integer> list = new LinkedList<>();

        for (String str : operations) {
            String op = str.substring(0, 1);
            int num = Integer.parseInt(str.substring(2));

            if (op.equals("I")) {
                maxQueue.add(num);
                minQueue.add(num);
                list.add(num);
            } 
            else if (op.equals("D")) {
                if (num == 1 && !maxQueue.isEmpty()) { // 최댓값 삭제
                    int target = maxQueue.poll();
                    list.remove(Integer.valueOf(target));
                    minQueue.remove(Integer.valueOf(target));
                } 
                else if (num == -1 && !minQueue.isEmpty()) { // 최솟값 삭제
                    int target = minQueue.poll();
                    list.remove(Integer.valueOf(target));
                    maxQueue.remove(Integer.valueOf(target));
                }
            }
        }

        if (list.isEmpty()) return new int[] {0, 0};

        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;

        for (int num : list) {
            max = Math.max(max, num);
            min = Math.min(min, num);
        }

        return new int[] {max, min};
    }
}
