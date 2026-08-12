import java.util.*;

class Solution {
    public int[] solution(String[] genres, int[] plays) {
        List<Integer> result = new ArrayList<>();
        
        Map<String, List<Integer>> map = new HashMap<>();
        Map<String, Integer> songCountMap = new HashMap<>(); // 각 장르에 속한 노래들의 재생횟수 sum
        
        for (int i = 0; i < genres.length; i++) {
            List<Integer> tmp = map.getOrDefault(genres[i], new ArrayList<>());
            tmp.add(i);
            map.put(genres[i], tmp);
            songCountMap.put(genres[i], songCountMap.getOrDefault(genres[i], 0) + plays[i]);
        }
        
        // map을 정렬해야 할 때에는 Map.Entry<>, .entrySet() 을 사용해서 list로 바꿔야 함. 
        List<Map.Entry<String, List<Integer>>> list = new ArrayList<>(map.entrySet());
        Collections.sort(list, 
            (a, b) -> songCountMap.get(b.getKey()) - songCountMap.get(a.getKey())
        );

        for (Map.Entry<String, List<Integer>> l : list) {
            List<Integer> tmp = l.getValue(); // .getValue()
            tmp.sort(
                (a, b) -> {
                    if (plays[a] != plays[b])
                        return plays[b] - plays[a];
                    else return a - b;
                }
            );
            int max = 0;
            for (Integer t : tmp) {
                if (max < 2) result.add(t);
                max++;
            }
        }
        int[] answer = new int[result.size()];
        for (int i = 0; i < result.size(); i++) answer[i] = result.get(i);
        return answer;
    }
}
