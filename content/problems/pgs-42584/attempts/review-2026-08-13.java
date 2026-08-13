import java.util.*;

class Solution {
    public int[] solution(int[] prices) {
        
        int[] answer = new int[prices.length];
        Stack<Integer> stack = new Stack<>();
        stack.add(0);
        
        for (int i = 0; i < prices.length; i++) {
            answer[i] = prices.length - i - 1;
            
            while (!stack.isEmpty() && prices[stack.peek()] > prices[i]) {
                int idx = stack.pop();
                answer[idx] = i - idx;
            }
            stack.add(i);
        }      
        return answer;
    }
}
