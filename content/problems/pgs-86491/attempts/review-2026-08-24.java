import java.util.*;

class Solution {
    public int solution(int[][] sizes) {
        int answer = 0;
        int bigMax = 0;
        int smallMax = 0;
        
        for (int[] size : sizes) {
            int w = size[0];
            int h = size[1];
            
            int max = Math.max(w, h);
            int min = Math.min(w, h);
            
            bigMax = Math.max(max, bigMax);
            smallMax = Math.max(min, smallMax);
        }
        return bigMax * smallMax;
    }
}
