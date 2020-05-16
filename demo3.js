//問題、選択肢、解答をgithubのページからJSONを取得
const DATA_URL = 'https://raw.githubusercontent.com/m-614/mizutamari_json/master/final.json';

//1度に表示する問題数
const quiz_count = 10;

//初期設定
let count = 0; //問題番号
let number = 0; //問題番号表示用
let correct = []; //解答記録
let wrong = []; //解答記録

var shuffle_list = [];
var s_list = [];
let quiz_change = 0;

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
    var quiz = function(count,number){
        //最初のHTMLにタグを用意する
        document.getElementById("quiz_content").innerHTML += `<div class="quiz" id="quiz_${count}"><div class="number" id="number${count}"></div><div class="text_q" id="text_q${count}"></div><div class="text_s" id="text_s${count}"></div><div class="text_a" id="text_a${count}"></div><div class="answer" id="answer${count}"></div><br></div>`;
        //問題番号
        document.getElementById(`number${count}`).innerHTML = `${number+1}問目`;
        //問題文
        document.getElementById(`text_q${count}`).innerHTML += jsonData[count]["text_q"];
        //選択肢
        s_list[count] = [jsonData[count]["answer"],jsonData[count]["s1"]];
        //選択肢が４つ以下の場合を考える
        if(jsonData[count]["s2"] === ''){
            console.log("選択肢は2つ");  //answer,s1をシャッフルして表示
        }else if(jsonData[count]["s3"] === '' && jsonData[count]["s2"] !== ''){
            console.log("選択肢は3つ");  //s2を足してシャッフルして表示
            s_list[count].push(jsonData[count]["s2"]);
        }else{
            console.log("選択肢は4つ");  //s2,s3を足してシャッフルして表示
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
            text_s += `<input type="submit" value="${n+1}：${shuffle_list[count][n]}" class="selection" id="sel_${n}_${count}"><br>`;
            document.getElementById(`text_s${count}`).innerHTML = text_s;
        }
    }
    
    //10問まとめて問題を表示
    var quiz10set= function(){
        for (var index = 0; index < quiz_count; index++) {
            try{ //HTMLの読み込みによるエラーを回避
                quiz(count,number);
                count+=1; //count=10
                number+=1; //number=10
            } catch(e){}
        }    
    }
    quiz10set();
    
    //正解判定 shuffle_list[何問目][何番目]===s_list[何問目][0]
    var select = function (select_count,n){
        if(shuffle_list[select_count][n] === s_list[select_count][0]){ //回答が正解だった場合
            document.getElementById(`text_a${select_count}`).innerHTML = "正解！";
            correct.push(1);
            console.log(correct);

        }else if(shuffle_list[select_count][n] !== s_list[select_count][0]){ //回答が不正解だった場合
            document.getElementById(`text_a${select_count}`).innerHTML = "不正解！";
            wrong.push(1);
            console.log(wrong);
        }
        document.getElementById(`answer${select_count}`).innerHTML = `正解は${jsonData[select_count]["answer"]}`;
        
        for(let i=0; i<shuffle_list[select_count].length; i++){
        document.getElementById(`sel_${i}_${select_count}`).disabled = true; //非活性ボタンにする
        }
        document.getElementById(`sel_${n}_${select_count}`).style.background = 'cyan';
        document.getElementById(`sel_${n}_${select_count}`).style.color = 'white';

    }
    //選択肢を押された時の対応
    var select_answer = function(){
        for (let s=0; s<quiz_count*(quiz_change+1); s++) {
            try{//エラーがうざかったらtry catch入れる
                for (let t=0; t<shuffle_list[s].length; t++) {
                    document.getElementById(`sel_${t}_${s}`).onclick = function() {
                        select(s, t);
                    }
                }
            } catch(e){}
        }
    }
    select_answer();

    //menu
    var next = document.getElementById("next");
    var stop = document.getElementById("stop");
    //「次の10問へ進む」を押された時の対応
    next.onclick = function(){
        quiz10set(); //問題を表示する
        quiz_change+=1; //選択肢の判定の数を増やす
        select_answer();
    }
    //「諦めて採点する」を押された時の対応
    stop.onclick = function(){
        next.disabled = true;
        stop.disabled = true;
        stop.style.background = 'cyan';
        stop.style.color = 'white';
        document.getElementById("point").innerHTML += `${correct.length+wrong.length}問中 ${correct.length}問正解`;
        document.getElementById("point_result").innerHTML += `正答率は${correct.length/(correct.length+wrong.length)*100}％`;
    }
    

});

