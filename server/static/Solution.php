<?php
	$LOG_Phpname = "Solution";
	include('../Log.php');
	include('Sql/SqlPassword.php');
	
	function latlongdist($lat1, $lon1, $lat2, $lon2) {
		$dlon = ($lon2 - $lon1)*pi()/180;
		$dlat = ($lat2 - $lat1)*pi()/180;
		$a = pow(sin($dlat/2),2) + cos($lat1) * cos($lat2) * pow(sin($dlon/2),2);
		$c = 2.0 * atan2( sqrt($a), sqrt(1-$a) );
		$R = 6371000.0;
		$d = $R * $c;
		return $d;
	}

	function bind_array($stmt, &$row) {
		$md = $stmt->result_metadata();
		$params = array();
		while($field = $md->fetch_field()) {
			$params[] = &$row[$field->name];
		}
		call_user_func_array(array($stmt, 'bind_result'), $params);
	}
	if(!is_null($_REQUEST["Id"]) && !is_null($_REQUEST["Sol"]) && !is_null($_REQUEST["Code"]) && !is_null($_REQUEST["Lat"]) && !is_null($_REQUEST["Long"]) && is_numeric($_REQUEST["Id"]) && is_numeric($_REQUEST["Lat"]) && is_numeric($_REQUEST["Long"])) {
		$servername = "localhost";
		$username = "marci07iq";
		$dbname = "marci07iq";
		$Data = "";
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$stmts = $conn->prepare("SELECT A.Answer, A.Next, A.Latitude, A.Longitude, B.HashID FROM CityQuestQuestions AS A INNER JOIN CityQuestQuestions AS B WHERE A.Id = ? AND A.HashID = ? AND A.Next = B.ID");
		$stmts->bind_param("ss", $_REQUEST["Id"], $_REQUEST["Code"]);
		$stmts->execute();
		bind_array($stmts, $row);
		$stmts->store_result();
	
		if($stmts->num_rows==1) {
			$stmts->fetch();
			if(latlongdist($_REQUEST["Lat"], $_REQUEST["Long"], $row["Latitude"], $row["Longitude"]) <= 150) {
				if($row["Answer"] == $_REQUEST["Sol"]) {
					echo '{"check": true, "msg":"OK.", "next":' . $row["Next"] . ', "code":"' . $row["HashID"] . '"}';
				} else {
					echo '{"check": false, "msg":"Wrong answer.", "next": 0, "code": 0}';
				}
			} else {
				echo '{"check": false, "msg":"Too far, you are ' . round(latlongdist($_REQUEST["Lat"], $_REQUEST["Long"], $row["Latitude"], $row["Longitude"])) . ' meters away.", "next": 0, "code": 0}';
			}
		} else {
			echo '{"check": false, "msg":"Incorrect question", "next": 0, "code": 0}';
		}
		$stmts->close();
		$conn->close();
	} else {
		echo '{"check": false, "msg":"Incorrect question", "next": 0, "code": 0}';
	}
?>