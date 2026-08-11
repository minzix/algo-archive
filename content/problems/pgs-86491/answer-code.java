import java.util.*;

// 
import java.util.*;

class Solution {
    public int solution(int[][] sizes) {
        int answer = 0;
        int shorterMax = 0;
        int longerMax = 0;
        for (int[] size : sizes) {
            int width = size[0];
            int height = size[1];
            
            if (width > height) {
                longerMax = Math.max(longerMax, width);
                shorterMax = Math.max(shorterMax, height);
            } else {
                longerMax = Math.max(longerMax, height);
                shorterMax = Math.max(shorterMax, width);
            }

        }
        answer = shorterMax * longerMax;
        return answer;
    }
}