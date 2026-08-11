import java.util.*;

// < 기능 > 
// 10초 전으로 이동 prev -> 현재 위치가 10초 미만인 경우 영상의 처음 위치로 이동
// 10초 후로 이동 next -> 동영상의 남은 시간이 10초 미만일 경우 영상의 마지막 위치로 이동
// 오프닝 건너뛰기: 현재 재생 위치가 오프닝 구간(op_start ≤ 현재 재생 위치 ≤ op_end) 인 경우 op_end로 이동

// video_len: 동영상 길이
// pos: 현위치
// op_start, op_end: 오프닝 시작/종료
// commands: 사용자가 입력한 커맨드 모음

// 사용자의 입력이 모두 끝난 후 동영상의 위치를 return
// 1. 수치를 전부 다 초로 바꾸기
// 2. 마지막에 mm:ss로 환산해서 반환

class Solution {
    public String solution(String video_len, String pos, String op_start, String op_end, String[] commands) {
        String answer = "";
        int video_len_num = toSeconds(video_len); 
        int pos_num = toSeconds(pos); 
        int op_start_num = toSeconds(op_start); 
        int op_end_num = toSeconds(op_end);
        
        for (String c : commands) {
            if (pos_num >= op_start_num && pos_num <= op_end_num) pos_num = op_end_num;
            if (c.equals("next")) {
                if (pos_num + 10 > video_len_num) pos_num = video_len_num;
                else pos_num += 10;
            }
            if (c.equals("prev")) {
                if (pos_num < 10) pos_num = 0;
                else pos_num -= 10;
            }
            if (pos_num >= op_start_num && pos_num <= op_end_num) pos_num = op_end_num;
        }
        answer = toMinuteSeconds(pos_num);
        return answer;
    }
    
    int toSeconds(String minuteSeconds) {
        int minute = Integer.parseInt(minuteSeconds.substring(0, 2));
        int second = Integer.parseInt(minuteSeconds.substring(3, 5));
        
        return minute * 60 + second;
    }
    
    String toMinuteSeconds(int seconds) {
        int minute = seconds / 60;
        int second = seconds % 60;
        String min_str = minute + "";
        String sec_str = second + "";
        
        if (minute < 10) min_str = "0" + minute;
        if (second == 0) sec_str = "00";
        if (second < 10) sec_str = "0" + second;
        
        return min_str + ":" + sec_str;
    }
}