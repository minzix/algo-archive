class Solution {
    public int solution(int n, int[] lost, int[] reserve) {
        int answer = 0;
        
        int[] people = new int[n + 1];
        for (int i = 1; i < n + 1; i++) people[i] = 1;
        for (int i = 0; i < lost.length; i++) {
            people[lost[i]] = 0;
        }
        for (int i = 0; i < reserve.length; i++) {
            if (people[reserve[i]] == 0) {
                people[reserve[i]] = 1;
            }
            else {
                people[reserve[i]] = 2;
                // System.out.println(people[reserve[i]]);
            }
        }
        int saved = 0;
        for (int i = 1; i <= n; i++) {
            System.out.println(people[i]);
            if (people[i] == 0) {
                if (i - 1 >= 0 && people[i - 1] == 2) {
                    people[i - 1] = 1;
                    people[i] = 1;
                    saved++;
                    continue;
                }
                if (i + 1 < people.length && people[i + 1] == 2) {
                    people[i + 1] = 1;
                    people[i] = 1;
                    saved++;
                }
            }
        }
        // answer = n - lost.length + saved;
        for (int i = 1; i <= n; i++) {
            if (people[i] > 0) {
                answer++;
            }
        }
        return answer;
    }
}