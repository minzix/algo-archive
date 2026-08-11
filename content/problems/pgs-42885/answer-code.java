import java.util.*;

class Solution {
    public int solution(int[] people, int limit) {
        int answer = 0;
        Arrays.sort(people);
        int minIdx = 0; 
        int maxIdx = people.length - 1;
        int save = 0;
        while (minIdx <= maxIdx) {
            if (people[minIdx] + people[maxIdx] <= limit) {
                minIdx++;
                maxIdx--;
            } else {
                maxIdx--;
            }
            answer++;
        }
        
        return answer;
    }
}