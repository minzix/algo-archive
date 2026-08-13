import java.util.*;

public class Solution {
    public int[] solution(int []arr) {
        Stack<Integer> stack = new Stack<>();
        List<Integer> list = new ArrayList<>();
        for (int a : arr) {
            if (stack.isEmpty()) stack.add(a); 
            else if (stack.peek() != a) stack.add(a);
        }
        while (!stack.isEmpty()) {
            list.add(stack.pop());
        }
        int[] answer = new int[list.size()];
        for (int i = 0; i < list.size(); i++) 
            answer[i] = list.get(list.size() - 1 - i);
        return answer;
    }
}
