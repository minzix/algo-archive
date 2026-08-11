import java.util.*;

class Solution {
    public int solution(String name) {
        int answer = 0;
        
        // 상하 움직임 최솟값 찾기
        int sumUpDown = 0;
        char[] nameList = name.toCharArray();
        for (char c : nameList) {
            int up = c - 'A';
            int down = 'Z' - c + 1;
            int min = Math.min(up, down);
            sumUpDown += min;
        }
        
        // 좌우 움직임 최솟값 찾기
        int minLeftRight = name.length() - 1;

        for (int i = 0; i < name.length(); i++) {
            int next = i + 1;

            // i 다음부터 연속된 A 구간 건너뛰기
            while (next < name.length() && name.charAt(next) == 'A') {
                next++;
            }

            minLeftRight = Math.min(
                minLeftRight,
                i * 2 + name.length() - next
            );

            minLeftRight = Math.min(
                minLeftRight,
                (name.length() - next) * 2 + i
            );
        }
        answer = minLeftRight + sumUpDown;
        return answer;
    }
}