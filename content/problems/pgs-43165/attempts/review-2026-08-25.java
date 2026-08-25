import java.util.*;

class Solution {
    int target;
    int[] numbers;
    int answer = 0;
    boolean[] visited;
    
    public int solution(int[] numbers, int target) {
        
        this.target = target;
        this.numbers = numbers;
        this.visited = new boolean[numbers.length];
        
        dfs(0, 0);
        
        return answer;
    }
    public void dfs(int current, int idx) {
        
        if (idx >= numbers.length) {
            if (current == target) answer++;
            return;
        }
                
        dfs(current + numbers[idx], idx + 1);      
        dfs(current - numbers[idx], idx + 1);
    }
}
