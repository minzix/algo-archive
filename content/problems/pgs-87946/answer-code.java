import java.util.*;

class Solution {
    int[][] dungeons;
    boolean visited[];;
    int answer = -1;
    
    public int solution(int k, int[][] dungeons) { // 현재 피로도 k
        this.dungeons = dungeons;
        visited = new boolean[dungeons.length];

        dfs(k, 0);
        
        return answer;
    }

    public void dfs(int k, int count) {
        answer = Math.max(answer, count);

        for (int i = 0; i < dungeons.length; i++) {

            if (!visited[i] && k >= dungeons[i][0]) {

                visited[i] = true;
                dfs(k - dungeons[i][1], count + 1);
                visited[i] = false;
            }
        }
    }
}