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
			"SELECT id, name, star, element, cost
				FROM units
				ORDER BY id ASC");

$data['d'] = array();
while($row = mysqli_fetch_array($result))
{
	$d = array(
		"id" => $row['id'],
		"name" => $row['name'],
		"star" => $row['star'],
		"element" => $row['element'],
		"cost" => $row['cost']
	);
	array_push($data['d'], $d);
}

mysqli_close($con);

header('Content-Type: application/json');
echo json_encode($data);
?>