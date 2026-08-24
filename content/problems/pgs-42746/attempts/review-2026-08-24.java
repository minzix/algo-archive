import java.util.*;

class Solution {
    public String solution(int[] numbers) {

        String[] numberStr = new String[numbers.length];
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < numbers.length; i++) numberStr[i] = numbers[i] + "";
        
        Arrays.sort(numberStr, (a, b) -> (b + a).compareTo(a + b));
        
        for (String num : numberStr) sb.append(num);
        
        if (numberStr[0].equals("0")) return "0";
        return sb.toString();
    }
}
