import java.util.*;

// Queue는 add(), poll() 을 반복하면 일정한 길이를 유지하며 요소를 원형으로 순환시킬 수 있다 -> LinkedList<>() 이므로
// 다리 길이 = bridge_length
// 다리 최대 무게 = weight
// 대기중인 트럭들 = truck_weights
// Queue bridge 만들기 -> 각 요소를 다리에 올라와있는 트럭의 무게로 채우기. 
// 자연히 처음에 아무 트럭도 올라와있지 않을 때에는 모두 0으로 채움

// 입력값 〉	2, 10, [7, 4, 5, 6]
// 기댓값 〉	8

class Solution {
    public int solution(int bridge_length, int weight, int[] truck_weights) {
        int answer = 0;
        
        Queue<Integer> bridge = new LinkedList<>();
        Queue<Integer> wait = new LinkedList<>();
        
        for (int i = 0; i < bridge_length; i++) bridge.add(0);
        for (int i = 0; i < truck_weights.length; i++) wait.add(truck_weights[i]);
        
        int currentWeight = 0;
        int time = 0;
        
        while (!wait.isEmpty()) {
            currentWeight -= bridge.peek();
            bridge.poll();
            
            if (currentWeight + wait.peek() <= weight) {
                currentWeight += wait.peek();
                bridge.add(wait.poll());
            } 
            else bridge.add(0);
            
            time++;
        }
        answer = time + bridge_length;
        
        return answer;
    }
}