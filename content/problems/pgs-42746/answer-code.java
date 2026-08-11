import java.util.*;

// 1. int[] numbers -> String[] arr
// 2. Arrays.sort(arr, (a, b) -> (b + a).compareTo(a + b));
// 3. String.join("", arr);

class Solution {
    public String solution(int[] numbers) {
        int len = numbers.length;
        String[] arr = new String[len];
        for (int i = 0; i < len; i++) arr[i] = numbers[i] + "";
        
        Arrays.sort(arr, (a, b) -> (b + a).compareTo(a + b));
        
        if (arr[0].equals("0")) return "0";
        
        return String.join("", arr);
    }
}