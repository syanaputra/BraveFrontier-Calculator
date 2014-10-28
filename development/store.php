<?php
$data = array();
if($_POST['token'] == "x")
{
	// Create connection
	$con = mysqli_connect("localhost","hepa_user","seka1namid4","hepa_bravefrontier");
		
	// Prepare POST data
	$name 			= mysqli_real_escape_string($con, $_POST['unit_name']);
	$exp_type		= mysqli_real_escape_string($con, $_POST['exp_type']);
	$submitted_by	= mysqli_real_escape_string($con, $_POST['submitted_by']);
	
	if((strlen($name) > 0) && (strlen($exp_type) > 0))
	{
		
		// Check connection
		if (mysqli_connect_errno())
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		
		// Insert it
		mysqli_query($con,"INSERT INTO tmp_units_suggest (name, exp_type, submitted_by) VALUES ('$name', '$exp_type', '$submitted_by')");
		mysqli_close($con);
		
		$data['status'] = "success";
		$data['msg'] = "Thank you for your contribution!";
	}
	else
	{
		$data['status'] = "error";
		$data['msg'] = "Please fill in the Name and EXP Type.";
	}
}
else
{
	$data['status'] = "error";
	$data['msg'] = "Sorry, it seems that you are coming to the wrong form.";
}
header('Content-Type: application/json');
echo json_encode($data);
?>