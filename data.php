<?php
  $fname1 = "./data/ranking1.csv";
  $fname2 = "./data/ranking2.csv";
  $fname3 = "./data/ranking3.csv";

  setlocale(LC_ALL, "ja_JP.UTF-8");
  
  //書き込み
  if(isset($_POST["point"]) && $_POST["point"] != ""){
    $newdata = array(
      $_POST["name"],
      $_POST["point"]
    );
    
    //コースによってファイル分け
    if($_POST["course"] == 1){
      $fp = fopen($fname1, "ab");
    }
    else if($_POST["course"] == 2){
      $fp = fopen($fname2, "ab");
    }
    else if($_POST["course"] == 3){
      $fp = fopen($fname3, "ab");
    }
    
    //ファイルの排他的ロック
    flock($fp, LOCK_EX);
    
    //データの書き込み
    fputcsv($fp, $newdata, ",", '"');
    
    //ファイルのクローズ
    fclose($fp);
  }
  
?>