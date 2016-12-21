<?php
	$LOG_Phpname = "Quest";
	include('../Log.php');
	include('Sql/SqlPassword.php');
	
	function bind_array($stmt, &$row) {
		$md = $stmt->result_metadata();
		$params = array();
		while($field = $md->fetch_field()) {
			$params[] = &$row[$field->name];
		}
		call_user_func_array(array($stmt, 'bind_result'), $params);
	}
	if(!is_null($_REQUEST["Latitude"]) && !is_null($_REQUEST["Longitude"]) && is_numeric($_REQUEST["Latitude"]) && is_numeric($_REQUEST["Longitude"])) {
		$servername = "localhost";
		$username = "marci07iq";
		$dbname = "marci07iq";
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$stmts = $conn->prepare("SELECT Start, Name, Description FROM CityQuests WHERE ? < Latitude AND Latitude < ? AND ? < Longitude AND Longitude < ?;");
		$stmts->bind_param("dddd", $latmin, $latmax, $longmin, $longmax);
		
		$latmin = $_REQUEST["Latitude"]-0.0904;
		$latmax = $_REQUEST["Latitude"]+0.0904;
		$longmin = $_REQUEST["Longitude"]-0.0898/cos($_REQUEST["Latitude"]*pi()/180.0);
		$longmax = $_REQUEST["Longitude"]+0.0898/cos($_REQUEST["Latitude"]*pi()/180.0);
		
		$stmts->execute();
		bind_array($stmts, $row);
		$stmts->store_result();
		echo "[";
		$comma = false;
		while($stmts->fetch()) {
			if($comma) {
				echo ",";
			}
			$comma = true;
			echo '{"Name":"' . $row["Name"] . '", "Description":"' . $row["Description"]. '", "Start":"' . $row["Start"] . '"}';
		}
		echo "]";
		$stmts->close();
		$conn->close();
	} else {
		echo "Invalid request";
	}
?>