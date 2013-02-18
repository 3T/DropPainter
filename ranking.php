<?php
  $fname1 = "./data/ranking1.csv";
  $fname2 = "./data/ranking2.csv";
  $fname3 = "./data/ranking3.csv";
      
  setlocale(LC_ALL, "ja_JP.UTF-8");
    
  //ファイルから取得したデータを名前と点数にわけてソートする
  function mySort($fp, &$name, &$point) {
    $counter = 0;
    $data = array();

    while(($d = fgetcsv($fp, 1000, ",", '"')) !== FALSE){
      $num = count($d);
      $counter += $num-1;
      for($i=0; $i<$num; $i++){
        if($i == 0){
          if($name == null){
            $name[] = $d[$i];
          }
          else {
            array_push($name, $d[$i]);
          }
        }
        else if($i == 1){
          if($point == null){
            $point[] = $d[$i];
          }
          else {
            array_push($point, $d[$i]);
          }
        }
      }
    }

    for($i=0; $i<count($point)-1; $i++){
      for($j=count($point)-1; $j>$i; $j--){
        if($point[$j] > $point[$j-1]){
          $temp = $point[$j];
          $point[$j] = $point[$j-1];
          $point[$j-1] = $temp;
          $tempName = $name[$j];
          $name[$j] = $name[$j-1];
          $name[$j-1] = $tempName;
        }
      }
    }

    for($i=0; $i<$counter; $i++){
        $data[] = $name[$i];
        $data[] = $point[$i];
    }
  }
  
  $fp1 = fopen($fname1, "r");
  mySort($fp1, $name1, $point1);
  fclose($fname1);
  
  $fp2 = fopen($fname2, "r");
  mySort($fp2, $name2, $point2);
  fclose($fname2);

  $fp3 = fopen($fname3, "r");
  mySort($fp3, $name3, $point3);
  fclose($fname3);
  
  //print_r($name1);
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>MTPainter for Safari / Point Ranking</title>
  <link rel="stylesheet" href="ranking.css" type="text/css" media="all">
</head>

<body>
      <div id="nav">
    <a href="MTPainter.html"><div>戻る</div></a>
  </div>

<div id="container">
      
  <div class="course">
    <?php
      echo "<p>コース１</p>";
      echo "<table><tr><th></th><th>名前</th><th>得点</th></tr>";
      for($i=0; $i<count($name1); $i++){
        echo "<tr><td>".($i+1)."</td><td>".$name1[$i]."</td><td>".$point1[$i]."</td></tr>";
      }
      echo "</table>";
    ?>
  </div>
        
  <div class="course">
    <?php
      echo "<p>コース２</p>";
      echo "<table><tr><th></th><th>名前</th><th>得点</th></tr>";
      for($i=0; $i<count($name2); $i++){
        echo "<tr><td>".($i+1)."</td><td>".$name2[$i]."</td><td>".$point2[$i]."</td></tr>";
      }
      echo "</table>";
    ?>
  </div>
        
  <div class="course">
    <?php
      echo "<p>コース３</p>";
      echo "<table><tr><th></th><th>名前</th><th>得点</th></tr>";
      for($i=0; $i<count($name3); $i++){
        echo "<tr><td>".($i+1)."</td><td>".$name3[$i]."</td><td>".$point3[$i]."</td></tr>";
      }
      echo "</table>";
    ?>
  </div>
</div>
</body>
</html>
