import java.util.*;

class Solution {

    Set<Integer> set = new HashSet<>();
    String numbers;
    boolean[] visited;

    public int solution(String numbers) {

        this.numbers = numbers;
        this.visited = new boolean[numbers.length()];

        dfs("");

        int answer = 0;

        for (int num : set) {
            if (isPrime(num)) answer++;
        }

        return answer;
    }

    void dfs(String current) {

        if (!current.equals("")) {
            set.add(Integer.parseInt(current));
        }

        for (int i = 0; i < numbers.length(); i++) {

            if (visited[i]) continue;

            visited[i] = true;
            dfs(current + numbers.charAt(i));
            visited[i] = false;
        }
    }

    boolean isPrime(int num) {

        if (num < 2) return false;

        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) return false;
        }

        return true;
    }
}