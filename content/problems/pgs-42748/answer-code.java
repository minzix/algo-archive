import java.util.*;

class Solution {
    public int[] solution(int[] array, int[][] commands) {
        int[] answer = new int[commands.length];
        int idx = 0;
        // i = commands[n][0], j = commands[n][1], k = commands[n][2]
        for (int[] c : commands) {
            int i = c[0] - 1; 
            int j = c[1] - 1; 
            int k = c[2] - 1;
            
            int[] arrayCut = new int[j - i + 1];
            for (int n = i; n <= j; n++) arrayCut[n - i] = array[n];
            
            Arrays.sort(arrayCut);
            answer[idx++] = arrayCut[k];
        }
        return answer;
    }
}