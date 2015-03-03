<?php
$data = array();
if($_POST['token'] == "x")
{
	// Email Configuration
	$emailAddress = 'bravefrontier@memoriesdust.com'; // Separate by comma for more email addresses (e.g.: 'email1@domain.com, email2@domain.com')
	$cc_emailAddress = 'stephanus.yanaputra@gmail.com';
	$bcc_emailAddress = '';
	
    // Variables start
	$name = "";
	$email = "";
	$message = "";
	
	$name =  trim($_POST['name']);
	$email =  trim($_POST['email']);
	$message =  nl2br(str_replace("\'","'",htmlspecialchars(trim($_POST['comments']))));
	// Variables end
	
	if($emailAddress != "" && $name != "" && $email != "" && $message != "")
	{
		$subject = "[BF-Calc] Feedback From: $name";	
		$message = "<strong>From:</strong> $name <br/><strong>Email:</strong> $email <br/><br/> <strong>Message:</strong><br />$message";
		
		$headers .= 'From: '. $name . '<' . $email . '>' . "\r\n";
		
		if($cc_emailAddress != '')
			$headers .= 'Cc: '. $cc_emailAddress . "\r\n";
		
		if($bcc_emailAddress != '')
			$headers .= 'Bcc: '. $bcc_emailAddress . "\r\n";
		
		$headers .= 'Reply-To: ' . $email . "\r\n";
		
		$headers .= 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		
		//send email function starts
		mail($emailAddress, $subject, $message, $headers);
		//send email function ends
		
		// Store in Database
		// Create connection
		$con = mysqli_connect("localhost","hepa_user","seka1namid4","hepa_bravefrontier");
		
		// Check connection
		if (mysqli_connect_errno())
		{
			// echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		else
		{
			// Insert it
			mysqli_query($con,"INSERT INTO tmp_suggestions (name, email, message) VALUES ('$name', '$email', '$message')");
			mysqli_close($con);
		}
		
		$data['status'] = "success";
		$data['msg'] = "Thank you, your message has been sent successfully! We appreciate your feedback!";
	}
	else
	{
		$error_msg = "";
		$error_msg .= "Please complete the form: ";
		if($name == "")
			$error_msg .= "Name is empty. ";
		if($email == "")
			$error_msg .= "Email is empty. ";
		if($message == "")
			$error_msg .= "Message is empty. ";
			
		$data['status'] = "error";
		$data['msg'] = $error_msg;
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