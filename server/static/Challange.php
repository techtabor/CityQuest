<?php
	$LOG_Phpname = "Challange";
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
	if(!is_null($_REQUEST["Id"]) && !is_null($_REQUEST["Code"]) && is_numeric($_REQUEST["Id"])) {
		$servername = "localhost";
		$username = "marci07iq";
		$dbname = "marci07iq";
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		$stmts = $conn->prepare("SELECT Question FROM CityQuestQuestions WHERE Id = ? AND HashID = ?;");
		$stmts->bind_param("ss", $_REQUEST["Id"], $_REQUEST["Code"]);
		$stmts->execute();
		bind_array($stmts, $row);
		$stmts->store_result();
		if($stmts->num_rows==1) {
			$stmts->fetch();
			echo $row["Question"];
		} else {
			echo "Internal server error...";
		}
		$stmts->close();
		$conn->close();
	} else {
		echo "Invalid request" . $_REQUEST["Id"] . $_REQUEST["Code"] . is_numeric("0");
	}
?>