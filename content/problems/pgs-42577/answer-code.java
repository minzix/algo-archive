import java.util.*;

// 접두어 구하는 법: String으로 바꾼 후 startsWith()? 메서드 쓰기
// 이대로 쭉 순회하면 이중for문 써야해서 O(n**2)
// 정렬하면 앞 뒤만 비교하면 돼서 O(n)
class Solution {
    public boolean solution(String[] phone_book) {
        boolean answer = true;
        Arrays.sort(phone_book);
        for (int i = 0; i < phone_book.length - 1; i++) {
            if (phone_book[i + 1].startsWith(phone_book[i])) {
                answer = false;
                break;
            }
        } 
        return answer;
    }
}