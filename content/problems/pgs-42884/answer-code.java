import java.util.*;

class Node {
    int from;
    int to;
    
    Node (int from, int to) {
        this.from = from;
        this.to = to;
    }
}

class Solution {
    public int solution(int[][] routes) {
        // routes[i][0]에는 i번째 차량이 고속도로에 진입한 지점
        // routes[i][1]에는 i번째 차량이 고속도로에서 나간 지점
        List<Node> routeList = new ArrayList<>();
        for (int[] r : routes) {
            routeList.add(new Node(r[0], r[1]));
        }
        
        // Collections.sort(routeList, (a, b) -> a.from - b.from);
        Collections.sort(routeList, (a, b) -> a.to - b.to);
        
        // int count = routes.length;
        int count = 0;
        
        int camera = Integer.MIN_VALUE;
        
        // for (int i = 0; i < routes.length; i++) {
        //     System.out.println("i = " + i);
        //     if (i + 1 < routes.length) {
        //         Node before = routeList.get(i);
        //         Node after = routeList.get(i + 1);
        //         System.out.println("before.to = " + before.to + " after.from = " + after.from);
        //         if (before.to > after.from) count--;
        //     }
        //     현재 카메라로 못 잡는 차량이면 새 카메라 설치
        // }
        for (Node route : routeList) {
            if (camera < route.from) {
                count++;
                camera = route.to;
            }
        }    
        return count;
    }
}