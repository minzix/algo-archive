import java.util.*;

class Solution {
    public int[] solution(int[] answers) {
        int[] answer = {};
        int[] firstStudent = {1, 2, 3 ,4, 5};
        int[] secondStudent = {2, 1, 2, 3, 2, 4, 2, 5};
        int[] thirdStudent = {3, 3, 1, 1, 2, 2, 4, 4, 5, 5};
        
        int[] score = new int[3];
        
        for (int i = 0; i < answers.length; i++) {   
            if (answers[i] == firstStudent[i % firstStudent.length]) score[0]++;
            if (answers[i] == secondStudent[i % secondStudent.length]) score[1]++;
            if (answers[i] == thirdStudent[i % thirdStudent.length]) score[2]++;
        }

        int max = Math.max(score[0], Math.max(score[1], score[2]));

        List<Integer> list = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            if (score[i] == max) {
                list.add(i + 1);   // 학생 번호는 1부터 시작
            }
        }

        answer = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            answer[i] = list.get(i);
        }

        return answer;
    }
}