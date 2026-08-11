import java.util.*;

// 장르별로 가장 많이 재생된 노래를 2개씩 모아 베스트앨범 출시
// 장르 총 재생수를 저장
// 장르별 노래 목록 저장

class Song {
    int play;
    int number;

    Song(int play, int number) {
        this.play = play;
        this.number = number;
    }
}

class Solution {
    public int[] solution(String[] genres, int[] plays) {

        Map<String, Integer> sortGenre = new HashMap<>();
        Map<String, List<Song>> sortSong = new HashMap<>();

        // 장르별 총 재생수, 노래 목록 저장
        for (int i = 0; i < genres.length; i++) {
            String genre = genres[i];
            int play = plays[i];

            sortGenre.put(genre, sortGenre.getOrDefault(genre, 0) + play);

            sortSong.putIfAbsent(genre, new ArrayList<>());
            sortSong.get(genre).add(new Song(play, i));
        }

        // 장르를 총 재생수 기준으로 정렬
        List<String> genreList = new ArrayList<>(sortGenre.keySet());
        genreList.sort((a, b) -> sortGenre.get(b) - sortGenre.get(a));

        List<Integer> result = new ArrayList<>();

        // 각 장르마다 상위 2곡 선택
        for (String genre : genreList) {

            List<Song> songs = sortSong.get(genre);

            songs.sort((a, b) -> {
                if (a.play == b.play) {
                    return a.number - b.number;   // 번호 오름차순
                }
                return b.play - a.play;           // 재생수 내림차순
            });

            for (int i = 0; i < Math.min(2, songs.size()); i++) {
                result.add(songs.get(i).number);
            }
        }

        int[] answer = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            answer[i] = result.get(i);
        }

        return answer;
    }
}