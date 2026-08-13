import java.util.*;

// 시간은 어떤 자료구조의 인덱스도 아니다. 시간의 흐름을 어떻게 표현할 수 있을까? 
class Solution {
    public int solution(int bridge_length, int weight, int[] truck_weights) {
        
        Queue<Integer> bridge = new LinkedList<>();
        // queue 의 길이는 항상 bridge_length를 유지한다. 
        for (int i = 0; i < bridge_length; i++) bridge.add(0);
        
        int currentWeight = 0;
        int currentTime = 0;
        int idx = 0;
        
        while (!bridge.isEmpty() && idx < truck_weights.length) {
            currentWeight -= bridge.poll();
            
            if (currentWeight + truck_weights[idx] <= weight) {
                bridge.add(truck_weights[idx]);
                currentWeight += truck_weights[idx];
                idx++;
            } else bridge.add(0);
            
            currentTime++;
        }
        return currentTime + bridge_length;
    }
}
