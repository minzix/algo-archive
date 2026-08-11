import java.util.*;

// 갈색 격자 수, 노란색 격자 수 -> 카펫의 가로 세로 크기 구하기
// 가로 >= 세로

class Solution {
    public int[] solution(int brown, int yellow) {
        int[] answer = new int[2];
        for (int h = 1; h <= yellow; h++) {
            if (yellow % h == 0) {
                int w = yellow / h;
                if (h > w) break;
                int brownNum = (h + w + 2) * 2;
                if (brownNum == brown) {
                    answer[0] = w + 2;
                    answer[1] = h + 2;
                    break;
                }
            }
        }
        return answer;
    }
}