import java.util.*;
 
class Solution {
    public String solution(String[] participant, String[] completion) {
        // participant 에는 있고 completion 에는 없는 이름 return
        String answer = "";
        // completion을 map에 담음: key = 이름, value = 숫자 (동명이인 고려)
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < completion.length; i++) {
            map.put(completion[i], map.getOrDefault(completion[i], 0) + 1);
        }
        for (int i = 0; i < participant.length; i++) {
            if (map.containsKey(participant[i]) && map.get(participant[i]) > 0) {
                map.put(participant[i], map.get(participant[i]) - 1);
            }
            else answer = participant[i]; 
        }
        return answer;
    }
}