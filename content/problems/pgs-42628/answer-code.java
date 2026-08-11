import java.util.*;

// 이중우선순위큐란? 
// I 숫자 : 큐에 숫자 삽입
// D 1 : 큐에서 최댓값을 삭제
// D -1 : 큐에서 최솟값을 삭제
// 예: ["I 16", "I -5643", "D -1", "D 1", "D 1", "I 123", "D -1"]

// 모든 연산을 처리한 후 큐가 비어있으면 [0,0] 
//                        비어있지 않으면 [최댓값, 최솟값]을 return 
// 빈 큐에 데이터를 삭제하라는 연산이 주어질 경우, 해당 연산은 무시합니다.

class Solution {
    public int[] solution(String[] operations) {
        
        // 오름차순 정렬 큐, 내림차순 정렬 큐 하나씩
        // 정답 리스트 따로
        // queue.remove(20);
        LinkedList<Integer> list = new LinkedList<>();
        PriorityQueue<Integer> minQueue = new PriorityQueue<>();
        PriorityQueue<Integer> maxQueue = new PriorityQueue<>((a, b) -> b - a);
            
        for (String op : operations) {
            // char operator = (char) op.substring(0, 1);
            char operator = op.charAt(0);
            // int num = op.substring(2, op.length + 1).parseInt();
            int num = Integer.parseInt(op.substring(2));
            if (operator == 'D') {
                if (list.isEmpty()) continue;
                if (num < 0) {
                    Integer minNum = minQueue.poll();
                    maxQueue.remove(minNum);
                    list.remove(minNum);
                } else {
                    Integer maxNum = maxQueue.poll();
                    minQueue.remove(maxNum);
                    list.remove(maxNum);
                }
            } else {
                list.add(num);
                minQueue.add(num);
                maxQueue.add(num);
            }
        }
        
        if (list.isEmpty()) return new int[] {0, 0};
        else {
            int min = Collections.min(list);
            int max = Collections.max(list);
            return new int[] {max, min};
        }
    }
}