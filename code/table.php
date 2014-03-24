<?php
$data = array();

// Create connection
$con = mysqli_connect("localhost","hepa_user","seka1namid4","hepa_bravefrontier");
	
// Prepare Data	
// Check connection
if (mysqli_connect_errno())
	echo "Failed to connect to MySQL: " . mysqli_connect_error();

// Insert it
$result = mysqli_query($con,
			"SELECT name, exp_type, count(submitted_by) AS 'count'
				FROM tmp_units_suggest
				GROUP BY name, exp_type
				ORDER BY name ASC");

$data['d'] = array();
while($row = mysqli_fetch_array($result))
{
	$d = array(
		"name" => $row['name'],
		"exp_type" => $row['exp_type'],
		"counter" => $row['count']
	);
	array_push($data['d'], $d);
}

mysqli_close($con);

$data['status'] = "success";
$data['msg'] = "Thank you for your contribution!";

header('Content-Type: application/json');
echo json_encode($data);
?>