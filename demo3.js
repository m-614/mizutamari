//問題、選択肢、解答をgithubのページからJSONを取得
const DATA_URL = 'https://raw.githubusercontent.com/m-614/mizutamari_json/master/final.json';

//1ページに表示する問題数
var quiz_count = 10;

//初期設定
var count = 0; //問題番号
var number = 0; //問題番号表示用
var answers = []; //解答記録
var select_count = 0;
var shuffle_list = [];
var s_list = [];

//HTMLにタグを用意する
for(n=0; n<10; n++){
    document.getElementById("quiz_content").innerHTML += `<div class="quiz"><div class="number" id="number${n}"></div><div class="text_q" id="text_q${n}"></div><div class="text_s" id="text_s${n}"></div><div class="text_a" id="text_a${n}"></div><div class="answer" id="answer${n}"></div><br></div>`;
}

fetch(DATA_URL)
.then((response) => response.json())
.then((jsonData) => {
    // JSONデータを扱った処理など
    console.log(jsonData);
    //データ
    var text_q = jsonData[count]["text_q"];
    var answer = jsonData[count]["answer"];
    var s1 = jsonData[count]["s1"];
    var s2 = jsonData[count]["s2"];
    var s3 = jsonData[count]["s3"];

    //問題表示
    var quiz = function(){
        //問題番号
        document.getElementById(`number${count}`).innerHTML = `${number+1}問目`;
        //問題文
        document.getElementById(`text_q${count}`).innerHTML += jsonData[count]["text_q"];
        //選択肢
        s_list[count] = [jsonData[count]["answer"],jsonData[count]["s1"]];
        //選択肢が４つ以下の場合を考える
        if(jsonData[count]["s2"] === ''){
            console.log("選択肢は2つ");  //answer,s1をシャッフルして表示
        }else if(jsonData[count]["s3"] === ''){
            console.log("選択肢は3つ");  //s2を足してシャッフルして表示
            s_list[count].push(jsonData[count]["s3"]);
        }else{
            console.log("選択肢は4つ");  //s3を足してシャッフルして表示
            s_list[count].push(jsonData[count]["s2"],jsonData[count]["s3"]);
        }
        //シャッフル関数
        const shuffle = ([...array]) => {
            for (let i = array.length - 1; i >= 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }        
        //シャッフルする
        shuffle_list[count] = shuffle(s_list[count]);
        console.log(`シャッフル後のリストの中は${shuffle_list[count]}`);
        console.log(`答えは${s_list[count][0]}`);
        //選択肢を表示
        text_s='';
        for(n=0; n<shuffle_list[count].length; n++){
            text_s += `<a href="#!" class="select" id="btn_${n}_${count}"><div class="selection" id="sel_${n}_${count}">${n+1}：${shuffle_list[count][n]}</div></a><br>`;
            document.getElementById(`text_s${count}`).innerHTML = text_s;
        }
    }
    
    //10問まとめて問題を表示
    for (let index = 0; index < quiz_count+1; index++) {
        try{ //HTMLの読み込みによるエラーを回避
            quiz();
            count+=1;
            number+=1;
        } catch(e){}
    }

    //正解判定 shuffle_list[何問目][何番目]===s_list[何問目][0]
    var select = function (select_count,n){
        if(shuffle_list[select_count][n] === s_list[select_count][0]){ //回答が正解だった場合
            document.getElementById(`text_a${select_count}`).innerHTML = "正解！";
        }else if(shuffle_list[select_count][n] !== s_list[select_count][0]){ //回答が不正解だった場合
            document.getElementById(`text_a${select_count}`).innerHTML = "不正解！"
        }
        document.getElementById(`answer${select_count}`).innerHTML = `正解は${jsonData[select_count]["answer"]}`;
    }

    //ボタンを押されたときの対応
    function select_answer(){
        for (let s=0; s<quiz_count+1; s++) {
            //エラーがうざかったらtry catch入れる
                for (let t=0; t<shuffle_list[s].length; t++) {
                    document.getElementById(`sel_${t}_${s}`).onclick = function() {
                        select(s, t);
                    }
                }
        }
    }
    select_answer();

    



});

