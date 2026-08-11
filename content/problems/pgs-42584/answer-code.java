import java.util.*;

class Solution {
    public int[] solution(int[] prices) {

        int[] answer = new int[prices.length];

        // 아직 가격이 떨어지지 않은 인덱스만 저장
        Stack<Integer> stack = new Stack<>();

        // 모든 가격을 앞에서부터 하나씩 확인
        for (int i = 0; i < prices.length; i++) {

            // 스택이 비어있지 않고,
            // 현재 가격이 스택 맨 위 인덱스의 가격보다 작다면
            // => 해당 시점에서 가격이 처음으로 떨어진 것
            while (!stack.isEmpty()
                    && prices[stack.peek()] > prices[i]) {

                // 가격이 떨어진 인덱스를 꺼냄
                int idx = stack.pop();

                // 가격이 유지된 시간 = 현재 시각 - 해당 인덱스
                answer[idx] = i - idx;
            }

            // 현재 인덱스를 스택에 저장: 이번 비교로는 가격이 떨어지지 않음. 이후에 떨어질 수도 있으니 저장해두고 추후 확인
            stack.push(i);
        }

        // 끝까지 가격이 떨어지지 않은 인덱스들을 처리
        while (!stack.isEmpty()) {

            // 아직 스택에 남아있는 인덱스 꺼내기
            int idx = stack.pop();

            // 마지막 시점까지 가격이 유지된 시간 저장
            answer[idx] = prices.length - idx - 1;
        }
        return answer;
    }
}