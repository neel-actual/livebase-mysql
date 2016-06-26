<?php
header("Access-Control-Allow-Origin: *");
require_once 'includes/db.php'; // The mysql database connection script
if(isset($_GET['livebaseid'])){
$id = $_GET['livebaseid'];

$query="SELECT * FROM `chats` WHERE id=".$id;
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
$chats =array();
while ($row = $result->fetch_assoc()) {
    array_push($chats, $row);
}

echo $json_response = json_encode($chats);

}
?>
