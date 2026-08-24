import java.util.*;

class Solution {
    List<String> dict = new LinkedList<>();
    char[] alpha = {'A', 'E', 'I', 'O', 'U'};
    
    public int solution(String word) {
        dfs(new StringBuilder());    
        Collections.sort(dict);   
        return dict.indexOf(word) + 1;
    }
    
    public void dfs(StringBuilder sb) {
        if (sb.length() == 5) return;
        for (char c : alpha) {
            sb.append(c);
            dict.add(sb.toString()); 
            dfs(sb);
            sb.deleteCharAt(sb.length() - 1); 
        }
    }
}
