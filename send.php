<?php
header("Access-Control-Allow-Origin: *");
require_once 'includes/db.php'; // The mysql database connection script
if(isset($_GET['id']) || isset($_GET['type']) || isset($_GET['text'])){
$id = $_GET['id'];
$type = $_GET['type'];
$text = $_GET['text'];
$time = time();
$query="INSERT INTO chats(id,type,text,time)  VALUES ('$id', '$type', '$text', '$time')";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$result = $mysqli->affected_rows;

echo $json_response = json_encode($result);
}
?>
