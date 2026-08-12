import java.util.*;

class Solution {
    public int solution(String[][] clothes) {
        int answer = 1;
        Map<String, List<String>> map = new HashMap<>();
        for (String[] cloth : clothes) {
            List<String> tmp = map.getOrDefault(cloth[1], new ArrayList<>());
            tmp.add(cloth[0]);
            map.put(cloth[1], tmp);
        }        
        for (String k : map.keySet()) {
            int size = map.get(k).size();
            answer *= (size + 1);
        }
        return answer - 1;
    }
}
