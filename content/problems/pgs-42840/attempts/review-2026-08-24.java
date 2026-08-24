import java.util.*;

class Solution {
    
    public int[] solution(int[] answers) {
        
        int[] first = {1, 2, 3, 4, 5};
        int[] second = {2, 1, 2, 3, 2, 4, 2, 5};
        int[] third = {3, 3, 1, 1, 2, 2, 4, 4, 5, 5};
        
        int[] answerCount = new int[3];
        // 서로 길이가 다른 세 배열을 동시에 순회하며 answers 배열과 비교해야 한다. 
        for (int i = 0; i < answers.length; i++) {
            int ans = answers[i];
            int firstAns = first[i % 5];
            int secondAns = second[i % 8];
            int thirdAns = third[i % 10];
            
            if (ans == firstAns) answerCount[0]++;
            if (ans == secondAns) answerCount[1]++;
            if (ans == thirdAns) answerCount[2]++;
        }
        
        // 최고점 구하기
        int max = Math.max(Math.max(answerCount[0], answerCount[1]), answerCount[2]);
        
        List<Integer> temp = new ArrayList<>();
        for (int i = 0; i < answerCount.length; i++) {
            if (answerCount[i] == max) temp.add(i + 1);
        }
        int[] answer = new int[temp.size()];
        for (int i = 0; i < answer.length; i++) {
            answer[i] = temp.get(i);
        }
        return answer;
    }
}
