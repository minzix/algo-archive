import java.util.*;
class Solution {
    boolean solution(String s) {
        // Stack 써서 쭉 add() 하다가 반대방향 나오면 pop() 하는 방향
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (stack.isEmpty() && c == '(') stack.add(c);
            else if (stack.isEmpty() && c == ')') return false;
            else if (c == stack.peek()) stack.add(c);
            else stack.pop();
        }
        if (!stack.isEmpty()) return false;
        else return true;
    }
}