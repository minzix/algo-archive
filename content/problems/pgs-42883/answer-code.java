import java.util.*;
// number는 한번만 순회함
// stack을 그대로 반환하는 문제는 없음. StringBuilder 혹은 stack.toArray() 등으로 반환 전에 타입 정리함
class Solution {
    public String solution(String number, int k) {
        Stack<Integer> stack = new Stack<>();
        for (char n : number.toCharArray()) {
            int num = n - '0';
            
            if (stack.isEmpty()) {
                stack.add(num);
                continue;
            }
            while (!stack.isEmpty() && k > 0 && stack.peek() < num) {
                stack.pop();
                k--;
            } 
            stack.add(num);
        }
        while (k > 0) {
            stack.pop();
            k--;
        }
        StringBuilder sb = new StringBuilder();
        for (Integer num : stack) {
            sb.append(num);
        }
        return sb.toString();
    }
}