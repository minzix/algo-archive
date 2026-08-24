import java.util.*;

class Solution {
    public int[] solution(int[] array, int[][] commands) {
        int[] answer = new int[commands.length];
        int idx = 0;
        for (int[] command : commands) {
            int[] cutArray = Arrays.copyOfRange(array, command[0] - 1, command[1]);
            Arrays.sort(cutArray);
            answer[idx] = cutArray[command[2] - 1];
            idx++;
        }
        return answer;
    }
}
