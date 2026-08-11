import java.util.*;
// 총 N 마리의 폰켓몬 중 N/2마리 가져가기
// 예: nums = [3번, 1번, 2번, 3번] 중 가장 많은 종류를 가지는 방법의 종류 -> 2개 (1번, 2번 등)
class Solution {
    public int solution(int[] nums) { // nums.length() : 항상 짝수
        int answer = 0;
        Set<Integer> set = new HashSet<>(); // nums 를 set에 담음
        for (int num : nums) set.add(num);
        if (set.size() > nums.length / 2) answer = nums.length / 2;
        else answer = set.size();
        return answer;
    }
}