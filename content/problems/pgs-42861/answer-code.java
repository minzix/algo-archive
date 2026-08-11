import java.util.*;

class Node {
    int connect;
    int value;

    Node(int connect, int value) {
        this.connect = connect;
        this.value = value;
    }
}

class Solution {
    public int solution(int n, int[][] costs) {
        int answer = 0;
        int visitCount = 0;

        boolean[] visited = new boolean[n];

        Map<Integer, List<Node>> map = new HashMap<>();

        // 그래프 생성
        for (int[] c : costs) {
            int a = c[0];
            int b = c[1];
            int cost = c[2];

            map.computeIfAbsent(a, k -> new ArrayList<>())
               .add(new Node(b, cost));

            map.computeIfAbsent(b, k -> new ArrayList<>())
               .add(new Node(a, cost));
        }

        // 비용이 가장 작은 간선부터 꺼냄
        PriorityQueue<Node> pq =
            new PriorityQueue<>((a, b) -> a.value - b.value);

        // 0번 섬부터 시작
        visited[0] = true;
        visitCount++;

        // 0번 섬과 연결된 간선 추가
        pq.addAll(map.get(0));

        while (visitCount < n) {

            Node next = pq.poll();

            // 이미 방문한 섬이면 무시
            if (visited[next.connect]) {
                continue;
            }

            // 새로운 섬 연결
            visited[next.connect] = true;
            visitCount++;

            answer += next.value;

            // 새로 방문한 섬에서 갈 수 있는 간선 추가
            pq.addAll(map.get(next.connect));
        }

        return answer;
    }
}