import java.util.*;

class Solution {
    ArrayList<String> list = new ArrayList<>();
    char[] alpha = {'A', 'E', 'I', 'O', 'U'};
    
    public int solution(String word) {
        dfs(0, "");
        Collections.sort(list);
        return list.indexOf(word);
    }
    
    // 사전을 만들기
    public void dfs(int depth, String word) {
        if (depth > 5) return;
        list.add(word);
        for (char c : alpha) {
            dfs(depth + 1, word + c);
        }
    }
}