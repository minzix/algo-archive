import java.util.*;

// 대기큐: 우선순위큐 -> 한번에 작업을 다 넣으면 안됨. 현재 시간 이전에 들어온 작업들만 넣어야함
// 작업의 소요시간이 짧은 것, 작업의 요청 시각이 빠른 것, 작업의 번호가 작은 것 순으로 우선순위
// jobs 배열에 든 작업 순서대로 넣기 
// 하드디스크: 자료구조 필요없음

class Job {
    int number;
    int requestTime;
    int requiredTime; 
    
    public Job (int number, int requestTime, int requiredTime) {
        this.number = number;
        this.requestTime = requestTime;
        this.requiredTime = requiredTime;
    }
}

class Solution {
    public int solution(int[][] jobs) {        
        PriorityQueue<Job> pq = new PriorityQueue<>(
            (a, b) -> {
                if (a.requiredTime != b.requiredTime) return a.requiredTime - b.requiredTime;
                else if (a.requestTime != b.requestTime) return a.requestTime - b.requestTime;
                else return a.number - b.number;
                
            }
        );
        
        int index = 0;
        int currentTime = 0;
        int turnaroundTimeSum = 0;
        
        // jobs[][] 를 정렬
        ArrayList<Job> jobList = new ArrayList<>();
        for (int i = 0; i < jobs.length; i++) jobList.add(new Job(i, jobs[i][0], jobs[i][1]));
        Collections.sort(jobList, (a, b) -> a.requestTime - b.requestTime);
        
        while (!pq.isEmpty() || index < jobs.length) {
            while (index < jobs.length && jobList.get(index).requestTime <= currentTime) {
                pq.add(jobList.get(index));
                index++;
            }
            
            if (!pq.isEmpty()) {
                Job job = pq.poll();
                currentTime += job.requiredTime;
                turnaroundTimeSum += (currentTime - job.requestTime);
            } else {
                if (index < jobs.length) currentTime = jobList.get(index).requestTime;
            }
        }
        
        return turnaroundTimeSum / jobs.length;
    }
}