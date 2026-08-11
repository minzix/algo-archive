import java.util.*;

class Solution {
    public int[] solution(int[] progresses, int[] speeds) {
        // 완성되는데 필요한 날짜를 담은 Queue 필요
        Queue<Integer> dates = new LinkedList<>();
        for (int i = 0; i < speeds.length; i++) {
            int date;
            if ((100 - progresses[i]) % speeds[i] == 0) date = (100 - progresses[i]) / speeds[i];
            else date = (100 - progresses[i]) / speeds[i] + 1;
            dates.add(date);
        }
        ArrayList<Integer> arr = new ArrayList<>();
        // peek() 한거랑 pop() 한거랑 비교해야 함
        while (!dates.isEmpty()) {
            Integer date = dates.poll();
            int featureNum = 1;
            while (!dates.isEmpty() && date >= dates.peek()) { // 같은 경우까지 고려 필요함! (등호 추가)
                featureNum++;
                dates.poll();
            }
            arr.add(featureNum);
        }
        // ArrayList -> int[]
        int N = arr.size();
        int[] answer = new int[N];
        for (int i = 0; i < N; i++) answer[i] = arr.get(i);
        return answer;
    }
}