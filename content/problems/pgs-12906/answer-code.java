import java.util.*;

public class Solution {
    public int[] solution(int[] arr) {
        // 연속적으로 나타나는 숫자만 제거!!
        // pop() 시 마지막으로 삽입한 수가 반환되는 자료구조가 필요 -> Stack 사용
        // Set이나 Queue로는 연속된 중복 제거 불가
        Stack<Integer> stack = new Stack<>();
        stack.add(arr[0]);
        for (int i = 1; i < arr.length; i++) {
            if (stack.peek() != arr[i]) stack.add(arr[i]);
        }
        
        // Stack -> int[] 변환
        int size = stack.size();
        int[] answer = new int[size];
        for (int i = 0; i < size; i++) answer[i] = stack.get(i);
        // 다른 변환 방법
        // for (int i = stack.size() - 1; i >= 0; i--) answer[i] = stack.pop(); 
        // stack.pop() 할거면 stack.size를 변수에 필수적으로 둬야 함
        return answer;
    }
}