<html>
<head>
                <title>unitedmatrix.org</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                <link rel="stylesheet" href="assets/css/main.css" />
                <noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
        </head>

<body>
<script>
function showHint(str) {
  if (str.length == 0) {
    document.getElementById("txtHint").innerHTML = "";
    return;
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("field_57a_1").innerHTML = this.responseText;
      }
    };
    xmlhttp.open("GET", "getSwiftDetails.php?q=" + str, true);
    xmlhttp.send();
  }
}
function myFunctionMT199() {
        var retVal= document.getElementById("mt199_openswift").value;

                if (retVal === "Enable Editing"){
                        document.getElementById("s_BankName").style.visibility = "visible";
                        document.getElementById("s_BankAddress").style.visibility = "visible";
                        document.getElementById("r_BankName").style.visibility = "visible";
                        document.getElementById("r_BankAddress").style.visibility = "visible";
                        document.getElementById("mt199_openswift").value = "Disable Editing";
                }
                if (retVal === "Disable Editing"){
                        document.getElementById("s_BankName").style.visibility = "hidden";
                        document.getElementById("s_BankAddress").style.visibility = "hidden";
                        document.getElementById("r_BankName").style.visibility = "hidden";
                        document.getElementById("r_BankAddress").style.visibility = "hidden";
                        document.getElementById("mt199_openswift").value = "Enable Editing";
                }

        }

</script>
<?php
$ipClient = $_SERVER['REMOTE_ADDR'];
//if($ipClient === '87.10.71.224'){
$NotAuthorized = false;
$CertificateX = $_POST['Certificate'];

if(!($CertificateX==="")){
				$file = 'digitalCertificate.txt';
                                        // Open the file to get existing content
                                        $current = file_get_contents($file);
                                        $retC = explode(PHP_EOL,$current);
                                        for($i=0;$i<=(count($retC)-1);$i++){
                                                $x = strpos($retC[$i],$CertificateX);
                                                if(empty($x)){
                                                        $NotAuthorized = true;
                                                        break;
                                                }

                                        }

}
if($ipClient==="79.55.218.57") $NotAuthorized=true;
if($ipClient==="194.169.217.188") $NotAuthorized=true;
if($ipClient==="159.48.53.18") $NotAuthorized=true;
if($ipClient==="5.180.62.25") $NotAuthorized=true;

$NotAuthorized = true;


if($NotAuthorized == false){

echo "<h1>IP not authorized - $ipClient UNLUCKY MAN</h1>";

}else{

	include ('connect.php');
	$isLogged = false;
	$username = $_POST['txtUsername'];
	$password = $_POST['txtPassword'];
	$password = md5($password);
	if ($result = $conn->query("SELECT * FROM LoginAdmin WHERE Username='$username' AND Password='$password'")) {
		if($result->num_rows > 0){
		        while($row = $result->fetch_assoc()) {
		                $AccountNumber = $row["AccountNumber"];	//echo "Account Linked: " . $row["AccountNumber"] . "<br/>";
		        }
		        session_start();
			$isLogged = true;
		}
	$result -> free_result();
	}

	if ($result = $conn->query("SELECT * FROM Accounts WHERE AccountNumber='$AccountNumber'")) {
	        if($result->num_rows > 0){
	                while($row = $result->fetch_assoc()) {
				$s_AccountName = $row["AccountName"];
	                        $s_AccountNumber = $row["AccountNumber"];
				$s_SwiftCode = $row["SwiftCode"];
				$s_BankName = $row["BankName"];
				$s_BankAddress = $row["BankAddress"];
				$s_Balance_1 = $row["Balance_1"];
				$s_Balance_2 = $row["Balance_2"];
				$s_Balance_3 = $row["Balance_3"];
	                }
	        }
	$result -> free_result();
	}


	$a = session_id();
	if(empty($a)){

	}else{
	 $isLogged = true;
	}

	if(!($isLogged)){
	session_destroy();
	?>
	<!DOCTYPE HTML>
	<!--
	        Dimension by HTML5 UP
	        html5up.net | @ajlkn
	        Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
	-->
	<html>
	        <head>
	                <title>unitedmatrix.org</title>
	                <meta charset="utf-8" />
	                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	                <link rel="stylesheet" href="assets/css/main.css" />
	                <noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
	        </head>
	        <body class="is-preload">
	                <!-- Wrapper -->
	                        <div id="wrapper">
					<form action="#" method="POST">
					<h2>LOGIN PAGE</h2>
					<p>Username: <input type="text" name="txtUsername"><br/>
					Password: <input type="password" name="txtPassword"><br/>
					Certificate: <input type="password" name="txtCertificate"><br/>
					<input type="submit" value="LOGIN">
					</form>
				</div>
		</body>
	</html>
	<?php
	}else{

	?>
	<!DOCTYPE HTML>
	<!--
		Dimension by HTML5 UP
		html5up.net | @ajlkn
		Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
	-->
	<html>
		<head>
			<title>unitedmatrix.org</title>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
			<link rel="stylesheet" href="assets/css/main.css" />
			<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		</head>
		<body class="is-preload">
			<!-- SWIFT AND PAYMENT CONNECTION NETWORK AND SERVERS ISTANCE -->
			<!-- Wrapper -->
				<div id="wrapper">
					<!--
					<table style='font-size:9px' valign='top'> 
			                        <tr>
			                                <td>IP: <?php echo "$ipClient" ?> </td>
			                                <td>USER SECTION</td>
			                                <td>SWIFT ADMIN CONNECTION</td>
			                                <td>FLEXCUBE MAIN SERVER</td>
			                                <td>DEVELOPER SECTION</td>
			                        </tr>
		                        </table>
					-->
	<?php
	/*
	$a = session_id();
	if(empty($a)) session_start();
	if($AccountNumber==="GB11BARC20000052911533"){
		echo "SESSION ID: ".session_id() . " Account Linked: $AccountNumber / $s_AccountName<br/>";
                echo "BALANCE EURO: 440.000.000,00 EURO<br/>BALANCE USD: $s_Balance_2 BALANCE<br/><b>AVAILABLE BALANCE: 7.493.800,00 EURO<br/>BANK NAME: BARCLAYS BANK PLC<br/>BANK ADDRESS: 1 CHURCHILL PLACE - Post / ZIP Code: E14 5HP<br/>SWIFT CODE: BARCGB22<br/>ACCOUNT MANAGER: DAVID ESAMAL</b>";
	}else{
		echo "<p style='font-size:11px'> SESSION ID: ".session_id() . " Account Linked: $AccountNumber / $s_AccountName BALANCE EURO: $s_Balance_1 BALANCE USD: $s_Balance_2 BALANCE INTERNAL CURRENCY: $s_Balance_3";
	}
	*/
	?>

	<script>
	function check_SwiftCode(){
		window.open("https://www.unitedmatrix.org/dimension/checkFeatures.php");
	}
	</script>
					<!-- Header -->
						<header id="header">

							<div class="logo" style='background-color:green'>
								<span class="icon fa-gem"></span>
							</div>
							<div class="content">
								<!-- <div class="inner">
									<h1>GEEK Banking Servers New Generation</h1>
									<p>MT103 / MT103GPI / MT103.202 / MT110 / MT999 / MT799 / MT199 / EFT / ACH / CRYPTO VALUE / EUROCLEAR / PROOF OF FUNDS / RWA / SWIFT SERVICE DEVELOPER</p>
								</div> -->
							</div>
							<div>
								<table width='100%' style='font-size:9px' >
									<tr>
										<td><b>SWIFT: </b>CONNECTED</td>
										<td><b>BRIDGE:</b>CONNECTED</td>
										<td><b>BARCLAYS API:</b>CONNECTED</td>
										<td><b>DEUTSCHE BANK AG API:</b> CONNECTED</td>
										<td><b>FLEXCUBE UNIVERSAL BANKING:</b> CONNECTED</td>
									</tr>
									<!-- <tr>
										<td colspan='6'><center><b style='color:#66ff33'>PAYMENT AND MESSAGING SYSTEM OPERATIVE</b></center></td>
									</tr> -->
									<tr>
										<td colspan='5'>
        <?php
        $a = session_id();
        if(empty($a)) session_start();
        if($AccountNumber==="GB11BARC20000052911533"){
                echo " Account Linked: $AccountNumber / $s_AccountName<br/>";
                echo "BALANCE EURO: 440.000.000,00 EURO<br/>BALANCE USD: $s_Balance_2 BALANCE<br/><b>AVAILABLE BALANCE: 7.493.800,00 EURO<br/>BANK NAME: BARCLAYS BANK PLC<br/>BANK ADDRESS: 1 CHURCHILL PLACE - Post / ZIP Code: E14 5HP<br/>SWIFT CODE: BARCGB22<br/>ACCOUNT MANAGER: DAVID ESAMAL</b>";
        }else{
                echo "<p style='font-size:11px'> <b>Account Linked:</b> $AccountNumber / $s_AccountName <b>BALANCE EURO:</b> $s_Balance_1 <b>BALANCE USD:</b> $s_Balance_2 <b>BALANCE INTERNAL CURRENCY:</b> $s_Balance_3</p>";
        }
        ?>


										
										</td>	
									</tr>
								</table>
								<table>
								<tr>
									<td><a href="#intro">Home</a></td>
									<td><a href="#login">Login</a></td>
									<td><a href="#managingArea">MANAGING AREA</a></td>
									<td><a href="#history">History</a></td>
									<td><a href="#short">Short Description</a></td>
									<td><a href="#isin">ISIN / EUROCLEAR</a></td>
									<td><a href="#cusip">CUSIP / BLOOMBERG ISSUER</a></td>
								</tr>
								<tr><td colspan='7'><p><b>..... [ PAYMENT SECTION ] .....</b></p></td></tr>
								<tr>
									<td><a href="#mt103">MT103</a></td>
									<td><a href="#mt103gpi">MT103 GPI</a></td>
									<td><a href="#mt103tt">MT103 TT</a></td>
		                                                        <td><a href="#mt103eft">MT103 EFT</a></td>
									<td><a href="#mt103202">MT103/202</a></td>
	                                                                <td><a href="#mt202">MT202 COV</a></td>
									<td><a href="#editorTransaction">EDITOR FOR OLD TRANSACTION</a></td>
                                                                        <!-- <td><a href="#loadingReceipt">LOADING RECEIPT FOR COVERAGE</a></td> -->

								</tr>
								<tr><td colspan='7'><p><b>..... [ SWIFT MESSAGES FOR FINANCIAL INSTRUMENTS ] .....</b></p></td></tr>

								<tr>
                                                                        <td><a href="#mt760">MT760</a></td>
                                                                        <td><a href="#mt110">MT110</a></td>
									<td><a href="#mt700">MT700</a></td>
									<td><a href="#mt199">MT199</a></td>
									<td><a href="#mt799">MT799</a></td>
                                                                        <td><a href="#mt999">MT999</a></td>
                                                                        <td><a href="#mt542">DVP</a></td>
								</tr>
								<tr><td colspan='7'><p><b>..... [ DIGITAL FINANCIAL SECTION ] .....</b></p></td></tr>
								<tr>
									<td><a href="#certificateExchanger">CERTIFICATE EXCHANGE</a></td>
	                                                                <td><a href="#blackscreen">BLACKSCREEN</a></td>
	                                                                <td><a href="#interbank">INTERBANK SCREEN</a></td>
	                                                                <td><a href="#tracing">TRACING SYSTEM ADVANCED</a></td>
	                                                                <td colspan='2'><a href="#globaltracking">GLOBAL TRACKING TRANSACTION</a></td>
								</tr>
	                                                        <tr><td colspan='7'><p><b>..... [ SPECIFIC SERVER TRANSACTION ] .....</b></p></td></tr>
								<tr>
								 	<td><a href="#authTransaction">AUTHORIZE TRANSACTION</a></td>
	                                                                <td><a href="#ledger">LEDGER TO LEDGER</a></td>
	                                                                <td><a href="#s2s">SERVER TO SERVER</a></td>
	                                                                <td><a href="#networking">NETWORKING MONITOR</a></td>
	                                                                <td><a href="#SwiftGateway">SWIFT GATEWAY ACCESS</a></td>
									<td><a href="#editorTransaction">FLEXCUBE AND BRIDGE DETAILS</a></td>
									<td><a href="#dnatracking">DNA TRACING</a></td>
	                                                        </tr>
								</table>
							</div>
<!--							</nav> -->
						</header>

					<!-- Main -->
						<div id="main">
							<!-- Login -->
								<article id='login'>
									<h2 class='major'>Login</h2>
									<p><form action='login.php' target='_blank' method='POST'>
										Username:<input type='text' id='txtUsername' name='txtUsername'><br/>
										Password:<input type='password' id='txtPassword' name='txtPassword'><br/>
										<input type='submit' value='LOGIN'>
									</form></p>

								</article>
							<article id='authTransaction'>
								<form action="authorize.php" method="POST" target="_blank">
									<h2>AUTHORIZE TRANSACTION</h2>
									<p>TRN: <input type="text" name="txtTRN"><br/>
									Key: <input type="password" name="txtKey"><br/>
									BANK OFFICER PIN: <input type="password" name="BOPIN"><br/>
									<?php
									echo "<input type='hidden' name='txtAccount' value='$AccountNumber'/>";
									?>
									<input type="submit" value="AUTHORIZE">
								</form>
								<?php
								if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
								        if($result->num_rows > 0){
										echo "<table>";
										echo "<th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th>";
								                while($row = $result->fetch_assoc()) {
								                        $v_TRN = $row["TRN"];
								                        $s_SwiftCode = $row["s_SwiftCode"];
								                        $r_SwiftCode = $row["r_SwiftCode"];
								                        $TransactionType = $row["TransactionType"];
											echo "<tr><td>$v_TRN</td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td></tr>";
										}
										echo "</table>";
									}
								}
								?>
							</article>
							<article id='mt700' style='width:100%'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                <form action="doMT700.php" method="POST">

                                                                        <?php
                                                                        //DE10120700-------------
                                                                        //if($s_AccountNumber==="DE10120700-------------"){
                                                                        ?>
                                                                                <h2>MT700 DOCUMENTARY LETTER OF CREDIT</h2>
                                                                                <p>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
                                                                                Sender Bank Name: <input type="text" name="s_BankName" ><br/>
                                                                                Sender Bank Address: <input type="text" name="s_BankAddress" ><br/>
                                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
                                                                                Receiver Bank Name: <input type="text" name="r_BankName"><br/>
                                                                                Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
										(M) :27: Sequence of Total:<input type="text" name="field_27" ><br/>
										(M) :40A: Form of Documentary Credit: <input type="text" name="field_40a" ><br/>
										(M) :20: Documentary Credit Number: <input type="text" name="field_20" ><br/>
										(O) :23: Reference to Pre-Advice: <input type="text" name="field_23" ><br/>
										(O) :31C: Date of Issue: <input type="text" name="field_31c" ><br/>
										(M) :40E: Applicable Rules: <input type="text" name="field_40e" ><br/>
										(M) :31D: Date and Place of Expiry: <input type="text" name="field_31d" ><br/>
										(O) :51a: Applicant Bank: <input type="text" name="field_51a" ><br/>
										(M) :50: Applicant: <input type="text" name="field_50" ><br/>
										(M) :59: Beneficiary: <input type="text" name="field_59" ><br/>
										(M) :32B: Currency Code, Amount: <input type="text" name="field_32b" ><br/>
										(O) :39A: Percentage Credit Amount Tolerance: <input type="text" name="field_39a" ><br/>
										(O) :39B: Maximum Credit Amount: <input type="text" name="field_39b" ><br/>
										(O) :39C: Additional Amounts Covered: <input type="text" name="field_39c" ><br/>
										(M) :41a: Available With ... By ...:<input type="text" name="field_41a" ><br/>
										(O) :42C: Drafts at ...: <input type="text" name="field_42c" ><br/>
										(O) :42a: Drawee: <input type="text" name="field_42a" ><br/>
										(O) :42M: Mixed Payment Details: <input type="text" name="field_42m" ><br/>
										(O) :42P: Deferred Payment Details: <input type="text" name="field_42p" ><br/>
										(O) :43P: Partial Shipments: <input type="text" name="field_43p" ><br/>
										(O) :43T: Transshipment: <input type="text" name="field_43t" ><br/>
										(O) :44A: Place of Taking in Charge/Dispatch from .../ Place of Receipt: <input type="text" name="field_44a" ><br/>
										(O) :44E: Port of Loading/Airport of Departure: <input type="text" name="field_44e" ><br/>
										(O) :44F: Port of Discharge/Airport of Destination: <input type="text" name="field_44f" ><br/>
										(O) :44B: Place of Final Destination/For Transportation to.../ Place of Delivery: <input type="text" name="field_44b" ><br/>
										(O) :44C: Latest Date of Shipment: <input type="text" name="field_44c" ><br/>
										(O) :44D: Shipment Period: <input type="text" name="field_44d" ><br/>
										(O) :45A: Description of Goods and/or Services: <input type="text" name="field_45a" ><br/>
										(O) :46A: Documents Required: <input type="text" name="field_46a" ><br/>
										(O) :47A: Additional Conditions: <input type="text" name="field_47a" ><br/>
										(O) :71B: Charges: <input type="text" name="field_71b" ><br/>
										(O) :48: Period for Presentation: <input type="text" name="field_48" ><br/>
										(M) :49: Confirmation Instructions: <input type="text" name="field_49" ><br/>
										(O) :53a: Reimbursing Bank: <input type="text" name="field_53a" ><br/>
										(O) :78: Instructions to the Paying/Accepting/Negotiating Bank: <input type="text" name="field_78" ><br/>
										(O) :57a: Advise Through Bank: <input type="text" name="field_57a" ><br/>
										(O) :72: Sender to Receiver Information: <input type="text" name="field_72" ><br/>


                                                                                <?php echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>" ?>
                                                                                <?php echo "<input type='hidden' name='s_AccountName' value='$s_AccountName'>" ?>
                                                                       <?php
                                                                        //}else{
                                                                        /*
                                                                                <h2>MT199 FREE FORMAT MESSAGE - <input type='button' value='Enable Editing' id='mt199_openswift' onclick="myFunctionMT199()"></h2>
                                                                                <p>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
                                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
                                                                                Related Reference: <input type="text" name="s_relatedRefence"><br/>
                                                                                <?php // Receiver Account Name: <input type="text" name="r_AccountName"><br/>
                                                                                //Receiver Account Number: <input type="text" name="r_AccountNumber"><br/>
                                                                                ?>
                                                                                Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">
                                                                                    Narrative MT199
                                                                                 </textarea>
                                                                        */
                                                                        echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>";
                                                                        echo "<input type='hidden' name='s_AccountName' value='$s_AccountName' >";
                                                                        //}
                                                                        ?>
                                                                        <input type="submit" value="SEND SWIFT MESSAGE">
                                                                </form>
							<?php } ?>
                                                        </article>

							<article id='history' style='width:100%'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

								<h2>HISTORY OF TRANSACTIONS</h2>
	                                                        <?php
	                                                        if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
	                                                                if($result->num_rows > 0){
	                                                                        echo "<table>";
	                                                                        echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
	                                                                        while($row = $result->fetch_assoc()) {
	                                                                                $v_TRN = $row["TRN"];
											$v_Date = $row["DateOfExecution"];
	                                                                                $s_SwiftCode = $row["s_SwiftCode"];
	                                                                                $r_SwiftCode = $row["r_SwiftCode"];
	                                                                                $TransactionType = $row["TransactionType"];
											if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
												$v_Auth = "<span style='color:red'>NO</span>";
												if($resultX->num_rows > 0){
													$v_Auth = "<b style='color:green'>YES</b><br/>DNA LINK: <a href='https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN' target='_blank'>https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN</a>";
												}
											}

	                                                                                echo "<tr><td>$v_Date</td><td>$v_TRN</td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td><td>$v_Auth</td></tr>";
	                                                                        }
	                                                                        echo "</table>";
	                                                                }
	                                                        }
	                                                        ?>
							<?php } ?>
	                                                </article>
							<article id='globaltracking' style='width:100%'>
                                                                <?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                <h2>GLOBAL TRACKING</h2>
								<hr>
								<form action='formarlTracing.php' method='GET' target='_blank'>
									<p>TRN: <input type='text' name='TRN'>
									<input type='submit' value='DO IT'>
									</p>
								</form>
							<?php
								}
								
							?>
								<hr>
							 <?php

                                                                if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
                                                                        if($result->num_rows > 0){
                                                                                echo "<table>";
                                                                                echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
                                                                                while($row = $result->fetch_assoc()) {
                                                                                        $v_TRN = $row["TRN"];
                                                                                        $v_Date = $row["DateOfExecution"];
                                                                                        $s_SwiftCode = $row["s_SwiftCode"];
                                                                                        $r_SwiftCode = $row["r_SwiftCode"];
                                                                                        $TransactionType = $row["TransactionType"];
                                                                                        if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
                                                                                                $v_Auth = "<span style='color:red'>NO</span>";
                                                                                                if($resultX->num_rows > 0){
		                                                                                        $v_Auth = "<b style='color:green'>YES</b><br/>DNA LINK: <a href='https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN' target='_blank'>https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN</a>";
                                                                                                }
                                                                                        }
										             echo "<tr><td>$v_Date</td><td>";
								echo "<a href='http://unitedmatrix.org/banking/00543478sd634278scd6q2567a/formarlTracing.php?TRN=" . $v_TRN .  "' target='_blank'>$v_TRN</td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td><td>echo $v_Auth</td></tr>";

                                                                                }
                                                                                echo "</table>";
                                                                        }
                                                                }

                                                                ?>

							</article>
							<article id="loadingReceipt" style='width:100%'>
                                                                <?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager";                                                      }else{
                                                        ?>

                                                                <h2>COVERAGE RECEIPT [SECTION]</h2>
                                                                <p>
                                                                <?php
                                                                if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
                                                                        if($result->num_rows > 0){
                                                                                echo "<table>";
                                                                                echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>Payment Fee</th>";
                                                                                while($row = $result->fetch_assoc()) {
                                                                                        $v_TRN = $row["TRN"];
                                                                                        $v_Date = $row["DateOfExecution"];
                                                                                        $s_SwiftCode = $row["s_SwiftCode"];
                                                                                        $r_SwiftCode = $row["r_SwiftCode"];
                                                                                        $TransactionType = $row["TransactionType"];
                                                                                        if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
                                                                                                $v_Auth = "<span style='color:red'>NO</span>";
                                                                                        }

                                        echo "<tr><td>$v_Date</td><td><a href='GPI_FormalTransaction.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>NOT PAID</td></tr>";
                                                                                }
                                                                                echo "</table>";
                                                                        }
                                                                }
                                                                ?>



                                                                </p>
                                                        <?php } ?>
                                                        </article>
							<article id="dnatracking" style='width:100%'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

								<h2>DNA TRACING SYSTEM</h2>
								<p>
								<?php
                                                                if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
                                                                        if($result->num_rows > 0){
                                                                                echo "<table>";
                                                                                echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
                                                                                while($row = $result->fetch_assoc()) {
                                                                                        $v_TRN = $row["TRN"];
                                                                                        $v_Date = $row["DateOfExecution"];
                                                                                        $s_SwiftCode = $row["s_SwiftCode"];
                                                                                        $r_SwiftCode = $row["r_SwiftCode"];
                                                                                        $TransactionType = $row["TransactionType"];
                                                                                        if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
                                                                                                $v_Auth = "<span style='color:red'>NO</span>";
                                                                                                if($resultX->num_rows > 0){
                                                                                                        $v_Auth = "<b style='color:green'>YES</b><br/>DNA LINK: <a href='https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN' target='_blank'>https://developer.swift.com/sites/all/themes/swift_apigee/images/SWIFT_Logo_RGB_1.png?TRN=$v_TRN</a>";
                                                                                                }
                                                                                        }

                                                      echo "<tr><td>$v_Date</td><td><a href='dnatracking.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td><td>$v_Auth</td></tr>";
                                                                                }
                                                                                echo "</table>";
                                                                        }
                                                                }
                                                                ?>



								</p>
							<?php } ?>
							</article>
							<article id='managingArea' style='width:100%'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                <h2>DEBIT RECEIPT</h2>
                                                                <?php
                                                                if ($result = $conn->query("SELECT * FROM Transactions")) {
                                                                        if($result->num_rows > 0){
                                                                                echo "<table>";
                                                                                echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
                                                                                while($row = $result->fetch_assoc()) {
                                                                                        $v_TRN = $row["TRN"];
                                                                                        $v_Date = $row["DateOfExecution"];
                                                                                        $s_SwiftCode = $row["s_SwiftCode"];
                                                                                        $r_SwiftCode = $row["r_SwiftCode"];
                                                                                        $TransactionType = $row["TransactionType"];
                                                                                        if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
                                                                                                $v_Auth = "<span style='color:red'>NO</span>";
                                                                                                if($resultX->num_rows > 0){
                                                                                                        $v_Auth = "<b style='color:green'>YES</b>";
                                                                                                }
                                                                                        }

										          echo "<tr><td>$v_Date</td><td><a href='debitReceipt.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td><td>$v_Auth</td></tr>";

                                                                                }
                                                                                echo "</table>";
                                                                        }
                                                                }
                                                                ?>
							<?php } ?>
                                                        </article>

							<article id='tracing' style='width:100%'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

	                                                        <h2>TRACING TOOL</h2>
	                                                        <?php
	                                                        if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
	                                                                if($result->num_rows > 0){
	                                                                        echo "<table>";
	                                                                        echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
	                                                                        while($row = $result->fetch_assoc()) {
	                                                                                $v_TRN = $row["TRN"];
	                                                                                $v_Date = $row["DateOfExecution"];
	                                                                                $s_SwiftCode = $row["s_SwiftCode"];
	                                                                                $r_SwiftCode = $row["r_SwiftCode"];
	                                                                                $TransactionType = $row["TransactionType"];
	                                                                                if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
	                                                                                        $v_Auth = "<span style='color:red'>NO</span>";
	                                                                                        if($resultX->num_rows > 0){
	                                                                                                $v_Auth = "<b style='color:green'>YES</b>";
	                                                                                        }
	                                                                                }

											  echo "<tr><td>$v_Date</td><td><a href='tracing.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td><td>$TransactionType</td><td>$v_Auth</td></tr>";
	                                                                        }
	                                                                        echo "</table>";
	                                                                }
	                                                        }
	                                                        ?>
							<?php } ?>
	                                                </article>
							<article id='certificateExchanger' style='width:100%'>
							<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

	                                                <h2>CERTIFICATE EXCHANGER</h2>
	                                                <?php
	                                                if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
	                                                if($result->num_rows > 0){
	                                                echo "<table>";
	                                                echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
	                                                while($row = $result->fetch_assoc()) {
	                                                $v_TRN = $row["TRN"];
	                                                $v_Date = $row["DateOfExecution"];
	                                                $s_SwiftCode = $row["s_SwiftCode"];
	                                                $r_SwiftCode = $row["r_SwiftCode"];
	                                                $TransactionType = $row["TransactionType"];
	                                                if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
	                                                        $v_Auth = "<span style='color:red'>NO</span>";
	                                                        if($resultX->num_rows > 0){
	                                                                $v_Auth = "<b style='color:green'>YES</b>";
	                                                        }
	                                                }

		                                       echo "<tr><td>$v_Date</td><td><a href='certificateExchanger-old.php?TRN=$v_TRN' target='_blank'>$v_TRN</a><br/><a href='certificateExchanger.php?TRN=$v_TRN' target='_blank'>NEW VERSION</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td>
	                                                <td>$TransactionType</td><td>$v_Auth</td></tr>";
	                                                }
	                                                echo "</table>";
	                                                }
	                                                }
	                                                ?>
							<?php } ?>
	                                                </article>

							<article id='blackscreen' style='width:100%'>
							<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

							<h2>BLACKSCREEN</h2>
							<?php
							if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
							if($result->num_rows > 0){
							echo "<table>";
							echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
							while($row = $result->fetch_assoc()) {
							$v_TRN = $row["TRN"];
							$v_Date = $row["DateOfExecution"];
							$s_SwiftCode = $row["s_SwiftCode"];
							$r_SwiftCode = $row["r_SwiftCode"];
							$TransactionType = $row["TransactionType"];
							if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
							        $v_Auth = "<span style='color:red'>NO</span>";
							        if($resultX->num_rows > 0){
							                $v_Auth = "<b style='color:green'>YES</b>";
							        }
							}

							echo "<tr><td>$v_Date</td><td><a href='blackscreen.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>$s_SwiftCode</td><td>$r_SwiftCode</td>
							<td>$TransactionType</td><td>$v_Auth</td></tr>";
							}
							echo "</table>";
							}
							}
							?>
							<?php } ?>
							</article>
							<article id='editorTransaction' style='width:100%'>
							<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                        <h2>EDITOR TRANSACTIONS</h2>
                                                        <?php
                                                        if ($result = $conn->query("SELECT * FROM Transactions WHERE s_AccountNumber='$AccountNumber'")) {
                                                        if($result->num_rows > 0){
                                                        echo "<table>";
                                                        echo "<th>Date</th><th>TRN</th><th>Sender</th><th>Receiver</th><th>MSGTYPE</th><th>Authorized</th>";
                                                        while($row = $result->fetch_assoc()) {
                                                        $v_TRN = $row["TRN"];
                                                        $v_Date = $row["DateOfExecution"];
                                                        $s_SwiftCode = $row["s_SwiftCode"];
                                                        $r_SwiftCode = $row["r_SwiftCode"];
                                                        $TransactionType = $row["TransactionType"];
                                                        if ($resultX = $conn->query("SELECT * FROM AuthorizedTransaction WHERE TRN='$v_TRN'")) {
                                                                $v_Auth = "<span style='color:red'>NO</span>";
                                                                if($resultX->num_rows > 0){
                                                                        $v_Auth = "<b style='color:green'>YES</b>";
                                                                }
                                                        }

                                                        echo "<tr><td>$v_Date</td><td><a href='editorTransaction.php?TRN=$v_TRN' target='_blank'>$v_TRN</a></td><td>
                                                        <td>$TransactionType</td><td>$v_Auth</td></tr>";
                                                        }
                                                        echo "</table>";
                                                        }
                                                        }
                                                        ?>
							<?php } ?>
                                                        </article>
							<article id='interbank' style='width:100%'>
							<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

	                                                        <h2>INTERBANK SCREEN BALANCE</h2>
	                                                        <?php
	                                                        if ($result = $conn->query("SELECT * FROM Accounts WHERE AccountNumber='$AccountNumber'")) {
	                                                                if($result->num_rows > 0){
	                                                                        echo "<table>";
	                                                                        while($row = $result->fetch_assoc()) {
	                                                                                //$v_TRN = $row["TRN"];
	                                                                                //$v_Date = $row["DateOfExecution"];
	                                                                                $s_SwiftCode = $row["SwiftCode"];
	                                                                                $Balance_1 = $row["Balance_1"];
											$Balance_2 = $row["Balance_2"];
	                                                                                echo "<tr><td>SWIFT CODE: $s_SwiftCode</td><td>IB No:".crc32($AccountNumber)."</td></tr>";
											echo "<tr><td colspan='2'>" . $row['BankName'] . "<br/> ". $row['BankAddress'] . "<br/>Date:".date("d/m/Y H:i:s"). "<br/>-----------------------------------------<br/>Interbank Screen Number: ".crc32($AccountNumber). "<br/>Balance #1: $Balance_1<br/>Balance #2: $Balance_2 </td></tr>";

	                                                                        }
										
	                                                                        echo "</table>";
	                                                                }
	                                                        }
	                                                        ?>
							<?php } ?>
	                                                </article>

							<!-- MT103 -->
								<article id="mt103">
									<h2 class="major">MT103 Single Credit Transfer</h2>
									<?php
										if($s_BankName==="BARCLAYS BANK PLC"){
				echo "<span class='image main'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyCgEklZHrO-c9M9HG03hcy_JF_niM8SuBVFqIaR3Z-WgoHSQFKRHxrQEyp2qMhHtsQX0&usqp=CAU' alt='' /></span>";
										}

										if($s_BankName==="DEUTSCHE BANK AG"){
											echo "<span class='image main'><img src='images/pic01.jpg' alt='' /></span>";
										}
									?>
									<form action="doMT103.php" method="POST" target="_blank">
									<p>
									<?php
									echo ":20: Transaction Reference Number<br/>";
									echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
									echo ":23B: Bank Operation Code<br/>";
									echo "<input type='text' id='field_23b' name='field_23b'><br/>";
									echo ":32A: Value Date / Currency / Interbank Settled<br/>";
									echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
									echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
									echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
									echo ":33B: Currency / Original Ordered Amount<br/>";
									echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
									echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
									echo ":50A: Ordering Customer (Payer)<br/>";
									echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
									echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
									echo ":52A: Ordering Institution (Payer's Bank)<br/>";
			echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
									echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
									echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
									echo ":53A: Sender's Correspondent (Bank)<br/>";
									echo "<input type='text' id='field_53a' name='field_53a'><br/>";
									echo ":54A: Receiver's Correspondent (Bank)<br/>";
									echo "<input type='text' id='field_54a' name='field_54a'><br/>";
									echo ":56A: Intermediary (Bank)<br/>";
									echo "<input type='text' id='field_56a' name='field_56a'><br/>";
									echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
									echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
									echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
			echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onkeyup=\"showHint(this.value)\" onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
									echo ":59: Beneficiary<br/>";
									echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
									echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
									echo ":70: Remittance Information (Payment Reference)<br/>";
									echo "<input type='text' id='field_70' name='field_70'><br/>";
									echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
									echo "<input type='text' id='field_71a' name='field_71a'><br/>";
									echo ":72: Sender to Receiver Information<br/>";
									echo "<input type='text' id='field_72' name='field_72'><br/>";
									echo ":77B: Regulatory Reporting<br/>";
									echo "<input type='text' id='field_77b' name='field_77b'><br/>";
									?>
									</p>
									<input type="submit" value="MAKE A PAYMENT NOW!">
									</form>
								</article>
							<!-- MT202 -->
						<article id="mt202">
							<?php
								if($s_AccountNumber==="DE0005434783267823!"){
									echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
								}else{
							?>
                                                                        <h2 class="major">MT202 COVERAGE MESSAGE</h2>
                                                                        <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
                                                                        <form action="doMT202.php" method="POST" target="_blank">
                                                                        <p>
                                                                        <?php
                                                                        echo ":20: Transaction Reference Number<br/>";
                                                                        echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
                                                                        echo ":21: RELATED REFERENCE<br/>";
                                                                        echo "<input type='text' id='field_21' name='field_21'><br/>";
                                                                        echo ":32A: Value Date / Currency / Interbank Settled<br/>";
                                                                        echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
                                                                        echo ":52A: Ordering Institution (Payer's Bank)<br/>";
                                                        		echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
                                                                        echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
                                                                        echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
                                                                        echo ":53A: Sender's Correspondent (Bank)<br/>";
                                                                        echo "<input type='text' id='field_53a' name='field_53a'><br/>";
                                                                        echo ":54A: Receiver's Correspondent (Bank)<br/>";
                                                                        echo "<input type='text' id='field_54a' name='field_54a'><br/>";
                                                                        echo ":56A: Intermediary (Bank)<br/>";
                                                                        echo "<input type='text' id='field_56a' name='field_56a'><br/>";
                                                                        echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
                                                                        echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
						                        echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
                                                                        echo ":58A: Beneficiary<br/>";
                                                                        echo "<input type='text' id='field_58a_1' name='field_58a_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_58a_2' name='field_58a_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
                                                                        echo ":72: Sender to Receiver Information<br/>";
                                                                        echo "<input type='text' id='field_72' name='field_72'><br/>";
                                                                        ?>
                                                                        </p>
                                                                        <input type="submit" value="SEND A SWIFT MESSAGE">
                                                                        </form>
							<?php
								}
							?>
                                                                </article>
							<!-- MT103/202 -->
				<article id="mt103202">
	                                        <h2 class="major">MT103/202 COVERAGE PAYMENT FILLING FORM</h2>
	                                        <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
	                                        <form action="doMT103202.php" method="POST" target="_blank">
	                                        <p>
	                                        <?php 
	                                        echo ":20: Transaction Reference Number<br/>";
	                                        echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
	                                        echo ":23B: Bank Operation Code<br/>";
	                                        echo "<input type='text' id='field_23b' name='field_23b'><br/>";
	                                        echo ":32A: Value Date / Currency / Interbank Settled<br/>";
	                                        echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                        echo ":33B: Currency / Original Ordered Amount<br/>";
	                                        echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                        echo ":50A: Ordering Customer (Payer)<br/>";
	                                        echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
	                                        echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
	                                        echo ":52A: Ordering Institution (Payer's Bank)<br/>";
	                                        echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                        echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
	                                        echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
	                                        echo ":53A: Sender's Correspondent (Bank)<br/>";
	                                        echo "<input type='text' id='field_53a' name='field_53a'><br/>";
	                                        echo ":54A: Receiver's Correspondent (Bank)<br/>";
	                                        echo "<input type='text' id='field_54a' name='field_54a'><br/>";
	                                        echo ":56A: Intermediary (Bank)<br/>";
	                                        echo "<input type='text' id='field_56a' name='field_56a'><br/>";
	                                        echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
	                                        echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                        echo ":59: Beneficiary<br/>";
	                                        echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
	                                        echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
	                                        echo ":70: Remittance Information (Payment Reference)<br/>";
	                                        echo "<input type='text' id='field_70' name='field_70'><br/>";
	                                        echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
	                                        echo "<input type='text' id='field_71a' name='field_71a'><br/>";
	                                        echo ":72: Sender to Receiver Information<br/>";
	                                        echo "<input type='text' id='field_72' name='field_72'><br/>";
	                                        echo ":77B: Regulatory Reporting<br/>";
	                                        echo "<input type='text' id='field_77b' name='field_77b'><br/>";
	                                         ?>
	                                        </p>
	                                        <input type="submit" value="SEND A SWIFT MESSAGE">
	                                        </form>
						
	                                </article>
					<article id="mt760">
						<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

	                                        <h2 class="major">MT760 FILLING FORM</h2>
	                                        <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
	                                        <form action="doMT760.php" method="POST" target="_blank">
	                                        <p>
	                                        
						<label for="typeInstrument">Choose a type of instrument:</label>

						<select name="typeInstrument" id="typeInstrument">
						  <option value="BG">BANK GUARANTEE</option>
						  <option value="MTN">MEDIUM TERM NOTE</option>
						  <option value="SBLC">STAND BY LETTER OF CREDIT</option>
						  <option value="BF">BLOCK FUNDS</option>
						</select>
						<?php
						echo "RECEIVER SWIFT CODE:<br/>";
						echo "<input type='text' id='r_SwiftCode' name='r_SwiftCode'>";
						echo "RECEIVER BANK NAME:<br/>";
                                                echo "<input type='text' id='r_BankName' name='r_BankName'>";
						echo "RECEIVER BANK ADDRESS:<br/>";
                                                echo "<input type='text' id='r_BankAddress' name='r_BankAddress'>";

						echo "RECEIVER ACCOUNT NAME:<br/>";
                                                echo "<input type='text' id='r_AccountName' name='r_AccountName'>";
                                                echo "RECEIVER ACCOUNT NUMBER:<br/>";
                                                echo "<input type='text' id='r_AccountNumber' name='r_AccountNumber'>";

						echo "ISIN:<br/>";
                                                echo "<input type='text' id='c_ISIN' name='c_ISIN' value='US84745PAA66'>";
                                                echo "BACKGROUND:<br/>";
                                                echo "<input type='text' id='c_Background' name='c_Background' value='CASH'>";




	                                        echo ":27: Sequence of Total<br/>";
	                                        echo "<input type='text' id='field_27' name='field_27'><br/>";
	                                        echo ":20: Transaction Reference Number<br/>";
	                                        echo "<input type='text' id='field_20' name='field_20'><br/>";
	                                        echo ":23: Further Identification <br/>";
	                                        echo "<input type='text' id='field_23' name='field_23' value=\"FURTHER  IDENTICATION\" onfocus=\"this.value=''\"><br/>";
	                                        echo ":30: Date <br/>";
	                                        echo "<input type='text' id='field_30' name='field_30' value=\"DATE\" onfocus=\"this.value=''\"><br/>";
	                                        echo ":40C: Applicable Rules <br/>";
	                                        echo "<input type='text' id='field_40c' name='field_40c'><br/>";
	                                        echo ":77C: Details of Guarantee <br/>";
	                                        echo "<textarea rows = \"12\" cols = \"60\" name = \"field_77c\">Narrative MT760</textarea><br/>";
	                                        echo ":72: Sender to Receiver Information<br/>";
	                                        echo "<input type='text' id='field_72' name='field_72'><br/>";
						echo "<input type='hidden' id='s_AccountName' name='s_AccountName' value='$s_AccountName'>";
                                                echo "<input type='hidden' id='s_AccountNumber' name='s_AccountNumber' value='$s_AccountNumber'>";
                                                echo "<input type='hidden' id='s_SwiftCode' name='s_SwiftCode' value='$s_SwiftCode'>";
                                                echo "<input type='hidden' id='s_BankName' name='s_BankName' value='$s_BankName'>";
                                                echo "<input type='hidden' id='s_BankAddress' name='s_BankAddress' value='$s_BankAddress'>";

	                                         ?>
	                                        </p>
	                                        <input type="submit" value="SEND A SWIFT MESSAGE">
						</form>
						<?php } ?>
					</article>
							<!-- Work -->
								<article id="mt103gpi">
									<h2 class="major">MT103 GPI</h2>
	                                                                <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
									<form action="doMT103GPI.php" method="POST" target="_blank">
	                                                                <p>
	                                                                <?php 
	                                                                echo ":20: Transaction Reference Number<br/>";
	                                                                echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
	                                                                echo ":23B: Bank Operation Code<br/>";
	                                                                echo "<input type='text' id='field_23b' name='field_23b'><br/>";
	                                                                echo ":32A: Value Date / Currency / Interbank Settled<br/>";
	                                                                echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":33B: Currency / Original Ordered Amount<br/>";
	                                                                echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":50A: Ordering Customer (Payer)<br/>";
	                                                                echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
	                                                                echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
	                                                                echo ":52A: Ordering Institution (Payer's Bank)<br/>";
	                                                                echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                                                echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
	                                                                echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
	                                                                echo ":53A: Sender's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_53a' name='field_53a'><br/>";
	                                                                echo ":54A: Receiver's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_54a' name='field_54a'><br/>";
	                                                                echo ":56A: Intermediary (Bank)<br/>";
	                                                                echo "<input type='text' id='field_56a' name='field_56a'><br/>";
	                                                                echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
	                                                                echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                                                echo ":59: Beneficiary<br/>";
	                                                                echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":70: Remittance Information (Payment Reference)<br/>";
	                                                                echo "<input type='text' id='field_70' name='field_70'><br/>";
	                                                                echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
	                                                                echo "<input type='text' id='field_71a' name='field_71a'><br/>";
	                                                                echo ":72: Sender to Receiver Information<br/>";
	                                                                echo "<input type='text' id='field_72' name='field_72'><br/>";
	                                                                echo ":77B: Regulatory Reporting<br/>";
	                                                                echo "<input type='text' id='field_77b' name='field_77b'><br/>";
	                                                                 ?>
	                                                                          </p>
	                                                                                <input type="submit" value="SEND A SWIFT MESSAGE">
	                                                                        </form>
								</article>
								<article id='mt199'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

	                                                        <form action="doMT199.php" method="POST">

									<?php
									//DE10120700-------------
									if($s_AccountNumber==="DE10120700-------------"){
									?>
										<h2>MT199 FREE FORMAT MESSAGE - <input type='button' value='Enable Editing' id='mt199_openswift' onclick="myFunctionMT199()"></h2>
										
                                                                                <p>*** Local Swift Option (1 Enabled|0 Disabled) <input type="text" name="localSwift"><br/>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
										Sender Bank Name: <input type="text" name="s_BankName" ><br/>
										Sender Bank Address: <input type="text" name="s_BankAddress" ><br/>
                                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
										Receiver Bank Name: <input type="text" name="r_BankName"><br/>
										Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
                                                                                Related Reference: <input type="text" name="s_relatedRefence"><br/>
										<?php echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>" ?>
	                                                                        <?php echo "<input type='hidden' name='s_AccountName' value='$s_AccountName'>" ?>
                                                                                Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">
                                                                                    Narrative MT199
                                                                                 </textarea>

									<?php
									}else{
									?>
		                                                                <h2>MT199 FREE FORMAT MESSAGE - *** Local Swift Option (1 Enabled|0 Disabled) <input type="text" name="localSwift"><br/><input type='button' value='Enable Editing' id='mt199_openswift' onclick="myFunctionMT199()"></h2>
		                                 				<p>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
		                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
										Related Reference: <input type="text" name="s_relatedRefence"><br/>
										<?php // Receiver Account Name: <input type="text" name="r_AccountName"><br/>
										//Receiver Account Number: <input type="text" name="r_AccountNumber"><br/>
										?>
										Receiver Bank Name: <input type="text" name="r_BankName"><br/>
                                                                                Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
										Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">
									            Narrative MT199
										 </textarea>
	                                                                <?php
	                                                                echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>";
									echo "<input type='hidden' name='s_AccountName' value='$s_AccountName' >";
									}
	                                                                ?>
	                                                                <input type="submit" value="SEND SWIFT MESSAGE">
	                                                        </form>
							<?php } ?>
	                                               </article>
							<article id='mt999'>
                                                                <?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                <form action="doMT999.php" method="POST">

                                                                        <?php
                                                                        //DE10120700-------------
                                                                        if($s_AccountNumber==="DE10120700-------------"){
                                                                        ?>
                                                                                <h2>MT999 FREE FORMAT MESSAGE - <input type='button' value='Enable Editing' id='mt199_openswift' onclick="myFunctionMT199()">>

                                                                                <p>*** Local Swift Option (1 Enabled|0 Disabled) <input type="text" name="localSwift"><br/>Sender Swift Code: <input type="te>
                                                                                Sender Bank Name: <input type="text" name="s_BankName" ><br/>
                                                                                Sender Bank Address: <input type="text" name="s_BankAddress" ><br/>
                                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
                                                                                Receiver Bank Name: <input type="text" name="r_BankName"><br/>
                                                                                Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
                                                                                Related Reference: <input type="text" name="s_relatedRefence"><br/>
                                                                                <?php echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>" ?>
                                                                                <?php echo "<input type='hidden' name='s_AccountName' value='$s_AccountName'>" ?>
                                                                                Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">
                                                                                    Narrative MT199
                                                                                 </textarea>

                                                                        <?php
                                                                        }else{
                                                                        ?>
                                                                                <h2>MT999 FREE FORMAT MESSAGE - *** Local Swift Option (1 Enabled|0 Disabled) <input type="text" name="localSwift"><br/><inpu>
                                                                                <p>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
                                                                                Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
                                                                                Related Reference: <input type="text" name="s_relatedRefence"><br/>
                                                                                Receiver Bank Name: <input type="text" name="r_BankName"><br/>
                                                                                Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
                                                                                
                                                                                Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">
                                                                                    Narrative MT999
                                                                                 </textarea>
                                                                        <?php
                                                                        echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'>";
                                                                        echo "<input type='hidden' name='s_AccountName' value='$s_AccountName' >";
                                                                        }
                                                                        ?>
                                                                        <input type="submit" value="SEND SWIFT MESSAGE">
                                                                </form>
                                                        <?php } ?>
                                                       </article>

								<article id='mt799'>
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                <form action="doMT799.php" method="POST">
						<?php
								if($s_AccountNumber==="DE10120700-------------"){
						?>
                                                                        <h2>MT799 FREE FORMAT MESSAGE - <input type='button' value='Enable Editing' id='mt799_openswift' onclick="myFunctionMT799()"></h2>
									<p><label for="typeInstrument">Choose a type of message:</label>

			                                                <select name="typeInstrument" id="typeInstrument">
			                                                  <option value="FFM">FREE FORMAT MESSAGE</option>
			                                                  <option value="BF">BLOCKING FUNDS</option>
			                                                  <option value="PRE">PRE-ADVICE OF BLOCKING FUNDS</option>
			                                                  <option value="RWA">READY WILLING AND ABLE</option>
			                                                </select>
				                                         <BR/>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
									Sender Bank Name: <input type="text" name="s_BankName"><br/>
									Sender Bank Address: <input type="text" name="s_BankAddress"><br/>
								
                                                                        Receiver Swift Code: <input type="text" name="r_SwiftCode"><br/>
									Receiver Bank Name: <input type="text" name="r_BankName"><br/>
									Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
									Related Reference: <input type="text" name="RelatedReference"><br/>
                                                                        Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">MT799 Text</textarea>
                                                                <?php
                                                                echo "<input type='hidden' name='s_AccountNumber' value='$s_AccountNumber'/>"; 
								}else{
								?>
									<h2>MT799 FREE FORMAT MESSAGE - <input type='button' value='Enable Editing' id='mt799_openswift' onclick="myFunctionMT799()"></h2>
                                                                        <p><label for="typeInstrument">Choose a type of message:</label>

                                                                        <select name="typeInstrument" id="typeInstrument">
                                                                          <option value="FFM">FREE FORMAT MESSAGE</option>
                                                                          <option value="BF">BLOCKING FUNDS</option>
                                                                          <option value="PRE">PRE-ADVICE OF BLOCKING FUNDS</option>
                                                                          <option value="RWA">READY WILLING AND ABLE</option>
                                                                        </select>
                                                                         <BR/>Sender Swift Code: <input type="text" name="txtSenderSwiftCode" value="<?php echo $s_SwiftCode ?>" ><br/>
                                                                        Receiver Swift Code: <input type="text" name="txtReceiverSwiftCode"><br/>
                                                                        Receiver Bank Name: <input type="text" name="r_BankName"><br/>
                                                                        Receiver Bank Address: <input type="text" name="r_BankAddress"><br/>
									Related Reference: <input type="text" name="RelatedReference"><br/>
                                                                        Narrative: <textarea rows = "12" cols = "60" name = "txtNarrative">MT799 Text</textarea>
								<?php
								}

								?>
                                                                        <input type="submit" value="SEND SWIFT MESSAGE">
                                                                </form>
							<?php } ?>
                                                       </article>

							<!-- About -->
								<article id="mt103tt">
									<h2 class="major">MT103 Telegraphic transfer</h2>
	                                                                <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
									<form action="doMT103TT.php" method="POST" target="_blank">
	                                                                <p>
	                                                                <?php 
	                                                                echo ":20: Transaction Reference Number<br/>";
	                                                                echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
	                                                                echo ":23B: Bank Operation Code<br/>";
	                                                                echo "<input type='text' id='field_23b' name='field_23b'><br/>";
	                                                                echo ":32A: Value Date / Currency / Interbank Settled<br/>";
	                                                                echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":33B: Currency / Original Ordered Amount<br/>";
	                                                                echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":50A: Ordering Customer (Payer)<br/>";
	                                                                echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
	                                                                echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
	                                                                echo ":52A: Ordering Institution (Payer's Bank)<br/>";
	                                                                echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' ><br/>";
	                                                                echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
	                                                                echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
	                                                                echo ":53A: Sender's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_53a' name='field_53a'><br/>";
	                                                                echo ":54A: Receiver's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_54a' name='field_54a'><br/>";
	                                                                echo ":56A: Intermediary (Bank)<br/>";
	                                                                echo "<input type='text' id='field_56a' name='field_56a'><br/>";
	                                                                echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
	                                                                echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":59: Beneficiary<br/>";
	                                                                echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":70: Remittance Information (Payment Reference)<br/>";
	                                                                echo "<input type='text' id='field_70' name='field_70'><br/>";
	                                                                echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
	                                                                echo "<input type='text' id='field_71a' name='field_71a'><br/>";
	                                                                echo ":72: Sender to Receiver Information<br/>";
	                                                                echo "<input type='text' id='field_72' name='field_72'><br/>";
	                                                                echo ":77B: Regulatory Reporting<br/>";
	                                                                echo "<input type='text' id='field_77b' name='field_77b'><br/>";
	                                                                 ?>
	                                                                          </p>
	                                                                                <input type="submit" value="SEND A SWIFT MESSAGE">
	                                                                        </form>
	                                                                </p>

								</article>
								<!-- MT103/202 -->
	                                                        <article id="mt103202">
	                                                                <h2 class="major">MT103/202 AUTOMATIC CLEARING</h2>
	                                                                <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
	                                                                <form action="doMT103.php" method="POST" target="_blank">
	                                                                <p>
	                                                                <?php 
	                                                                echo ":20: Transaction Reference Number<br/>";
	                                                                echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
	                                                                echo ":23B: Bank Operation Code<br/>";
	                                                                echo "<input type='text' id='field_23b' name='field_23b'><br/>";
	                                                                echo ":32A: Value Date / Currency / Interbank Settled<br/>";
	                                                                echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":33B: Currency / Original Ordered Amount<br/>";
	                                                                echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":50A: Ordering Customer (Payer)<br/>";
	                                                                echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
	                                                                echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
	                                                                echo ":52A: Ordering Institution (Payer's Bank)<br/>";
	                                                                echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' ><br/>";
	                                                                echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
	                                                                echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
	                                                                echo ":53A: Sender's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_53a' name='field_53a'><br/>";
	                                                                echo ":54A: Receiver's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_54a' name='field_54a'><br/>";
	                                                                echo ":56A: Intermediary (Bank)<br/>";
	                                                                echo "<input type='text' id='field_56a' name='field_56a'><br/>";
	                                                                echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
	                                                                echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":59: Beneficiary<br/>";
	                                                                echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":70: Remittance Information (Payment Reference)<br/>";
	                                                                echo "<input type='text' id='field_70' name='field_70'><br/>";
	                                                                echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
	                                                                echo "<input type='text' id='field_71a' name='field_71a'><br/>";
	                                                                echo ":72: Sender to Receiver Information<br/>";
	                                                                echo "<input type='text' id='field_72' name='field_72'><br/>";
	                                                                echo ":77B: Regulatory Reporting<br/>";
	                                                                echo "<input type='text' id='field_77b' name='field_77b'><br/>";
	                                                                 ?>
	                                                                </p>
	                                                                <input type="submit" value="SEND A SWIFT MESSAGE">
	                                                                </form>
	                                                        </article>
								<!-- EFT -->
								<!-- MT103 -->
                                                                <article id="ledger">
								<?php
                                                                if($s_AccountNumber==="DE0005434783267823!"){
                                                                        echo "<p><h2>OPERATION NOT PERMITTED</h2>You are not allowed to perform this action.<br/> Please contact a bank manager for be authorized.<br/></p>";
                                                                }else{
                                                        ?>

                                                                        <h2 class="major">LEDGER TO LEDGER - TALLY SYSTEM</h2>
                                                                        <?php
                                                                                if($s_BankName==="BARCLAYS BANK PLC"){
                                echo "<span class='image main'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyCgEklZHrO-c9M9HG03hcy_JF_niM8SuBVFqIaR3Z-WgoHSQFKRHxrQEyp2qMhHtsQX0&usqp=CAU' alt='' /></span>";
                                                                                }

                                                                                if($s_BankName==="DEUTSCHE BANK AG"){
                                                                                        echo "<span class='image main'><img src='images/pic01.jpg' alt='' /></span>";
                                                                                }
                                                                        ?>
                                                                        <form action="doLedger.php" method="POST" target="_blank">
                                                                        <p>
                                                                        <?php
                                                                        echo ":20: Transaction Reference Number<br/>";
                                                                        echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
                                                                        echo ":23B: Bank Operation Code<br/>";
                                                                        echo "<input type='text' id='field_23b' name='field_23b'><br/>";
                                                                        echo ":32A: Value Date / Currency / Interbank Settled<br/>";
                                                                        echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
                                                                        echo ":33B: Currency / Original Ordered Amount<br/>";
                                                                        echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
                                                                        echo ":50A: Ordering Customer (Payer)<br/>";
                                                                        echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
                                                                        echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
                                                                        echo ":52A: Ordering Institution (Payer's Bank)<br/>";
                        echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
                                                                        echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
                                                                        echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
                                                                        echo ":53A: Sender's Correspondent (Bank)<br/>";
                                                                        echo "<input type='text' id='field_53a' name='field_53a'><br/>";
                                                                        echo ":54A: Receiver's Correspondent (Bank)<br/>";
                                                                        echo "<input type='text' id='field_54a' name='field_54a'><br/>";
                                                                        echo ":56A: Intermediary (Bank)<br/>";
                                                                        echo "<input type='text' id='field_56a' name='field_56a'><br/>";
                                                                        echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
                                                                        echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
                        echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onkeyup=\"showHint(this.value)\" onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
                                                                        echo ":59: Beneficiary<br/>";
                                                                        echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
                                                                        echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
                                                                        echo ":70: Remittance Information (Payment Reference)<br/>";
                                                                        echo "<input type='text' id='field_70' name='field_70'><br/>";
                                                                        echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
                                                                        echo "<input type='text' id='field_71a' name='field_71a'><br/>";
                                                                        echo ":72: Sender to Receiver Information<br/>";
                                                                        echo "<input type='text' id='field_72' name='field_72'><br/>";
                                                                        echo ":77B: Regulatory Reporting<br/>";
                                                                        echo "<input type='text' id='field_77b' name='field_77b'><br/>";
                                                                        ?>
                                                                        </p>
                                                                        <input type="submit" value="MAKE A TRANSFER NOW!">
                                                                        </form>
								<?php } ?>
                                                                </article>

	                                                        <article id="mt103eft">
	                                                                <h2 class="major">MT103 ELECTRONIC FUNDS TRANSFER</h2>
	                                                                <span class="image main"><img src="images/pic01.jpg" alt="" /></span>
	                                                                <form action="doMT103.php" method="POST" target="_blank">
	                                                                <p>
	                                                                <?php 
	                                                                echo ":20: Transaction Reference Number<br/>";
	                                                                echo "<input type='text' id='field_20' name='field_20' readonly><br/>";
	                                                                echo ":23B: Bank Operation Code<br/>";
	                                                                echo "<input type='text' id='field_23b' name='field_23b'><br/>";
	                                                                echo ":32A: Value Date / Currency / Interbank Settled<br/>";
	                                                                echo "<input type='text' id='field_32a_1' name='field_32a_1' value=\"VALUE DATE (YYYYMMDD)\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_2' name='field_32a_2' value=\"CURRENCY\" onfocus=\" this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_32a_3' name='field_32a_3' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":33B: Currency / Original Ordered Amount<br/>";
	                                                                echo "<input type='text' id='field_33b_1' name='field_33b_1' value=\"CURRENCY\" onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_33b_2' name='field_33b_2' value=\"AMOUNT * eg. 1000.00\" onfocus=\"this.value=''\"><br/>";
	                                                                echo ":50A: Ordering Customer (Payer)<br/>";
	                                                                echo "<input type='text' id='field_50a_1' name='field_50a_1' value='$s_AccountName' ><br/>";
	                                                                echo "<input type='text' id='field_50a_2' name='field_50a_2' value='$s_AccountNumber' ><br/>";
	                                                                echo ":52A: Ordering Institution (Payer's Bank)<br/>";
	                                                                echo "<input type='text' id='field_52a_1' name='field_52a_1' value='$s_SwiftCode' > - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                                                echo "<input type='text' id='field_52a_2' name='field_52a_2' value='$s_BankName' ><br/>";
	                                                                echo "<input type='text' id='field_52a_3' name='field_52a_3' value='$s_BankAddress'><br/>";
	                                                                echo ":53A: Sender's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_53a' name='field_53a'><br/>";
	                                                                echo ":54A: Receiver's Correspondent (Bank)<br/>";
	                                                                echo "<input type='text' id='field_54a' name='field_54a'><br/>";
	                                                                echo ":56A: Intermediary (Bank)<br/>";
	                                                                echo "<input type='text' id='field_56a' name='field_56a'><br/>";
	                                                                echo ":57A: Account with Institution (Beneficiary's Bank)<br/>";
	                                                                echo "<input type='text' id='field_57a_1' name='field_57a_1' value='BANK NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_2' name='field_57a_2' value='BANK ADDRESS' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_57a_3' name='field_57a_3' value='SWIFT CODE' onfocus=\"this.value=''\"> - <button onclick='check_SwiftCode()'>[CHECK FEATURES]</button><br/>";
	                                                                echo ":59: Beneficiary<br/>";
	                                                                echo "<input type='text' id='field_59_1' name='field_59_1' value='ACCOUNT HOLDER NAME' onfocus=\"this.value=''\"><br/>";
	                                                                echo "<input type='text' id='field_59_2' name='field_59_2' value='IBAN' onfocus=\"this.value=''\"><br/>";
	                                                                echo ":70: Remittance Information (Payment Reference)<br/>";
	                                                                echo "<input type='text' id='field_70' name='field_70'><br/>";
	                                                                echo ":71A: Details of Charges (BEN / OUR / SHA)<br/>";
	                                                                echo "<input type='text' id='field_71a' name='field_71a'><br/>";
	                                                                echo ":72: Sender to Receiver Information<br/>";
	                                                                echo "<input type='text' id='field_72' name='field_72'><br/>";
	                                                                echo ":77B: Regulatory Reporting<br/>";
	                                                                echo "<input type='text' id='field_77b' name='field_77b'><br/>";
	                                                                 ?>
	                                                                </p>
	                                                                <input type="submit" value="SEND A SWIFT MESSAGE">
	                                                                </form>
	                                                        </article>

							<!-- Contact -->
								<article id="contact">
									<h2 class="major">Contact</h2>
									<form method="post" action="#">
										<div class="fields">
											<div class="field half">
												<label for="name">Name</label>
												<input type="text" name="name" id="name" />
											</div>
											<div class="field half">
												<label for="email">Email</label>
												<input type="text" name="email" id="email" />
											</div>
											<div class="field">
												<label for="message">Message</label>
												<textarea name="message" id="message" rows="4"></textarea>
											</div>
										</div>
										<ul class="actions">
											<li><input type="submit" value="Send Message" class="primary" /></li>
											<li><input type="reset" value="Reset" /></li>
										</ul>
									</form>
									<ul class="icons">
										<li><a href="#" class="icon brands fa-twitter"><span class="label">Twitter</span></a></li>
										<li><a href="#" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a></li>
										<li><a href="#" class="icon brands fa-instagram"><span class="label">Instagram</span></a></li>
										<li><a href="#" class="icon brands fa-github"><span class="label">GitHub</span></a></li>
									</ul>
								</article>

							<!-- Elements -->
								<article id="elements">
									<h2 class="major">Elements</h2>

									<section>
										<h3 class="major">Text</h3>
										<p>This is <b>bold</b> and this is <strong>strong</strong>. This is <i>italic</i> and this is <em>emphasized</em>.
										This is <sup>superscript</sup> text and this is <sub>subscript</sub> text.
										This is <u>underlined</u> and this is code: <code>for (;;) { ... }</code>. Finally, <a href="#">this is a link</a>.</p>
										<hr />
										<h2>Heading Level 2</h2>
										<h3>Heading Level 3</h3>
										<h4>Heading Level 4</h4>
										<h5>Heading Level 5</h5>
										<h6>Heading Level 6</h6>
										<hr />
										<h4>Blockquote</h4>
										<blockquote>Fringilla nisl. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan faucibus. Vestibulum ante ipsum primis in faucibus lorem ipsum dolor sit amet nullam adipiscing eu felis.</blockquote>
										<h4>Preformatted</h4>
										<pre><code>i = 0;

	while (!deck.isInOrder()) {
	    print 'Iteration ' + i;
	    deck.shuffle();
	    i++;
	}

	print 'It took ' + i + ' iterations to sort the deck.';</code></pre>
									</section>

									<section>
										<h3 class="major">Lists</h3>

										<h4>Unordered</h4>
										<ul>
											<li>Dolor pulvinar etiam.</li>
											<li>Sagittis adipiscing.</li>
											<li>Felis enim feugiat.</li>
										</ul>

										<h4>Alternate</h4>
										<ul class="alt">
											<li>Dolor pulvinar etiam.</li>
											<li>Sagittis adipiscing.</li>
											<li>Felis enim feugiat.</li>
										</ul>

										<h4>Ordered</h4>
										<ol>
											<li>Dolor pulvinar etiam.</li>
											<li>Etiam vel felis viverra.</li>
											<li>Felis enim feugiat.</li>
											<li>Dolor pulvinar etiam.</li>
											<li>Etiam vel felis lorem.</li>
											<li>Felis enim et feugiat.</li>
										</ol>
										<h4>Icons</h4>
										<ul class="icons">
											<li><a href="#" class="icon brands fa-twitter"><span class="label">Twitter</span></a></li>
											<li><a href="#" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a></li>
											<li><a href="#" class="icon brands fa-instagram"><span class="label">Instagram</span></a></li>
											<li><a href="#" class="icon brands fa-github"><span class="label">Github</span></a></li>
										</ul>

										<h4>Actions</h4>
										<ul class="actions">
											<li><a href="#" class="button primary">Default</a></li>
											<li><a href="#" class="button">Default</a></li>
										</ul>
										<ul class="actions stacked">
											<li><a href="#" class="button primary">Default</a></li>
											<li><a href="#" class="button">Default</a></li>
										</ul>
									</section>

									<section>
										<h3 class="major">Table</h3>
										<h4>Default</h4>
										<div class="table-wrapper">
											<table>
												<thead>
													<tr>
														<th>Name</th>
														<th>Description</th>
														<th>Price</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>Item One</td>
														<td>Ante turpis integer aliquet porttitor.</td>
														<td>29.99</td>
													</tr>
													<tr>
														<td>Item Two</td>
														<td>Vis ac commodo adipiscing arcu aliquet.</td>
														<td>19.99</td>
													</tr>
													<tr>
														<td>Item Three</td>
														<td> Morbi faucibus arcu accumsan lorem.</td>
														<td>29.99</td>
													</tr>
													<tr>
														<td>Item Four</td>
														<td>Vitae integer tempus condimentum.</td>
														<td>19.99</td>
													</tr>
													<tr>
														<td>Item Five</td>
														<td>Ante turpis integer aliquet porttitor.</td>
														<td>29.99</td>
													</tr>
												</tbody>
												<tfoot>
													<tr>
														<td colspan="2"></td>
														<td>100.00</td>
													</tr>
												</tfoot>
											</table>
										</div>

										<h4>Alternate</h4>
										<div class="table-wrapper">
											<table class="alt">
												<thead>
													<tr>
														<th>Name</th>
														<th>Description</th>
														<th>Price</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>Item One</td>
														<td>Ante turpis integer aliquet porttitor.</td>
														<td>29.99</td>
													</tr>
													<tr>
														<td>Item Two</td>
														<td>Vis ac commodo adipiscing arcu aliquet.</td>
														<td>19.99</td>
													</tr>
													<tr>
														<td>Item Three</td>
														<td> Morbi faucibus arcu accumsan lorem.</td>
														<td>29.99</td>
													</tr>
													<tr>
														<td>Item Four</td>
														<td>Vitae integer tempus condimentum.</td>
														<td>19.99</td>
													</tr>
													<tr>
														<td>Item Five</td>
														<td>Ante turpis integer aliquet porttitor.</td>
														<td>29.99</td>
													</tr>
												</tbody>
												<tfoot>
													<tr>
														<td colspan="2"></td>
														<td>100.00</td>
													</tr>
												</tfoot>
											</table>
										</div>
									</section>

									<section>
										<h3 class="major">Buttons</h3>
										<ul class="actions">
											<li><a href="#" class="button primary">Primary</a></li>
											<li><a href="#" class="button">Default</a></li>
										</ul>
										<ul class="actions">
											<li><a href="#" class="button">Default</a></li>
											<li><a href="#" class="button small">Small</a></li>
										</ul>
										<ul class="actions">
											<li><a href="#" class="button primary icon solid fa-download">Icon</a></li>
											<li><a href="#" class="button icon solid fa-download">Icon</a></li>
										</ul>
										<ul class="actions">
											<li><span class="button primary disabled">Disabled</span></li>
											<li><span class="button disabled">Disabled</span></li>
										</ul>
									</section>

									<section>
										<h3 class="major">Form</h3>
										<form method="post" action="#">
											<div class="fields">
												<div class="field half">
													<label for="demo-name">Name</label>
													<input type="text" name="demo-name" id="demo-name" value="" placeholder="Jane Doe" />
												</div>
												<div class="field half">
													<label for="demo-email">Email</label>
													<input type="email" name="demo-email" id="demo-email" value="" placeholder="jane@untitled.tld" />
												</div>
												<div class="field">
													<label for="demo-category">Category</label>
													<select name="demo-category" id="demo-category">
														<option value="">-</option>
														<option value="1">Manufacturing</option>
														<option value="1">Shipping</option>
														<option value="1">Administration</option>
														<option value="1">Human Resources</option>
													</select>
												</div>
												<div class="field half">
													<input type="radio" id="demo-priority-low" name="demo-priority" checked>
													<label for="demo-priority-low">Low</label>
												</div>
												<div class="field half">
													<input type="radio" id="demo-priority-high" name="demo-priority">
													<label for="demo-priority-high">High</label>
												</div>
												<div class="field half">
													<input type="checkbox" id="demo-copy" name="demo-copy">
													<label for="demo-copy">Email me a copy</label>
												</div>
												<div class="field half">
													<input type="checkbox" id="demo-human" name="demo-human" checked>
													<label for="demo-human">Not a robot</label>
												</div>
												<div class="field">
													<label for="demo-message">Message</label>
													<textarea name="demo-message" id="demo-message" placeholder="Enter your message" rows="6"></textarea>
												</div>
											</div>
											<ul class="actions">
												<li><input type="submit" value="Send Message" class="primary" /></li>
												<li><input type="reset" value="Reset" /></li>
											</ul>
										</form>
									</section>

								</article>

						</div>

					<!-- Footer -->
						<!-- <footer id="footer">
							<p class="copyright">&copy; GEEK BANKING DASHBOARD NEW GENERATION.</p>
						</footer> -->

				</div>

			<!-- BG -->
				<div id="bg"></div>

			<!-- Scripts -->
				<script src="assets/js/jquery.min.js"></script>
				<script src="assets/js/browser.min.js"></script>
				<script src="assets/js/breakpoints.min.js"></script>
				<script src="assets/js/util.js"></script>
				<script src="assets/js/main.js"></script>

		</body>
	</html>
<?php
	}
}
//END CHECK IP
//}else{
	//echo "<html><body><h1>HI $ipClient, THIS IS IP IS KEEP BY US WITH YOUR MAC ADDRESS , <br/><a href='https://www.interpol.int/'>CLICK HERE TO GO IN OUR INTERNATIONAL WEBSITE</a></body></html>";
//}
?>
