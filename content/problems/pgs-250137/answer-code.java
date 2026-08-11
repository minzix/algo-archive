import java.util.*;

// t초 동안 붕대를 감으면서 t * x 만큼의 체력 회복
// 최대체력 이상으로는 증가 안됨
// 몬스터 공격 시 기술이 취소됨. 공격 끝난 후 체력이 0 이하가 아니라면 기술 재개됨. 

// bandage: [시전 시간, 초당 회복량(x), 추가 회복량] 
// attacks: [공격 시간, 피해량] -> 공격 시간을 기준으로 오름차순 정렬
// health: 최대 체력, 시작 직후 체력. 

// 모든 공격이 끝난 직후 남은 체력을 return. 도중에 죽으면 -1

class Solution {
    public int solution(int[] bandage, int health, int[][] attacks) {
        int totalTime = attacks[attacks.length - 1][0];
        int bonusTime = bandage[0];
        
        int attackIdx = 0;
        int currentHealth = health;
        int currentBonusTime = -1;
        
        for (int currentTime = 0; currentTime <= totalTime; currentTime++) {
            // 공격 여부
            if (currentTime == attacks[attackIdx][0]) {
                currentHealth -= attacks[attackIdx][1];
                attackIdx++;
                currentBonusTime = 0;
            } else { 
                currentHealth += bandage[1];
                currentBonusTime++;
                
                if (bonusTime == currentBonusTime) { // 보너스타임 도달
                    currentHealth += bandage[2];
                    currentBonusTime = 0;
                } 
            }
            if (currentHealth > health) currentHealth = health;
            if (currentHealth <= 0) return -1;
            // System.out.println("currentTime = " + currentTime);
            // System.out.println("attackIdx = " + attackIdx);
            // System.out.println("currentHealth = " + currentHealth);
            // System.out.println("currentBonusTime = " + currentBonusTime);
            // System.out.println();
        }
        return currentHealth;
    }
}