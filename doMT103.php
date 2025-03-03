<html>
<title>RESUME OF PAYMENT</title>
<body style="background-color:grey">
<center>
<div id="result" name="result" style="background-color:white;border-radius: 25px;border: 2px solid #73AD21;padding: 20px;width: 500px;height: 470px;">
<?php
include("getCHK.php");
$clearingCode = "HCX449504933";
$dateOfExecution = date("Y/m/d H:i:s");
//$TRN = $_POST['field_20'];
	$field_23b = $_POST['field_23b'];
	$field_32a_1 = $_POST['field_32a_1'];
	$field_32a_2 = $_POST['field_32a_2'];
	$field_32a_3 = $_POST['field_32a_3'];
	$field_33b_1 = $_POST['field_33b_1'];
	$field_33b_2 = $_POST['field_33b_2'];
	$field_50a_1 = $_POST['field_50a_1'];
	$field_50a_2 = $_POST['field_50a_2'];
	$field_52a_1 = $_POST['field_52a_1'];
	$field_52a_2 = $_POST['field_52a_2'];
	$field_52a_3 = $_POST['field_52a_3'];
	$field_53a = $_POST['field_53a'];
	$field_54a = $_POST['field_54a'];
	$field_56a = $_POST['field_56a'];
	$field_57a_1 = $_POST['field_57a_1'];
	$field_57a_2 = $_POST['field_57a_2'];
	$field_57a_3 = $_POST['field_57a_3'];
	$field_59_1 = $_POST['field_59_1'];
	$field_59_2 = $_POST['field_59_2'];
	$field_70 = $_POST['field_70'];
	$field_72 = $_POST['field_72'];
	$field_77b = $_POST['field_77b'];
	$field_71a = $_POST['field_71a'];
	$s_AccountName = $field_50a_1;
	$s_Account = $field_50a_2;
	$s_swiftCode = $field_52a_1;
	$s_BankName = $field_52a_2;
	$s_BankAddress = $field_52a_3;
	$r_BankName = $field_57a_1;
	$r_BankAddress = $field_57a_2;
	$r_swiftCode = $field_57a_3;
	$r_AccountName = $field_59_1;
	$r_Account = $field_59_2;
	$remittance = $field_70;
	$amount = $field_32a_3;
	$validated=true;
	$dateOfExecution = date("Y/m/d H:i:s");

        /*
                AMOUNT * eg. 1000.00
                r_SwiftCode = SWIFT CODE
                r_AccountName = ACCOUNT HOLDER NAME
                r_AccountNumber = IBAN
                r_BankName = BANK NAME

                */
                if($r_swiftCode === 'SWIFT CODE'){
                        $validated = false;
                }
                if($r_AccountName === 'ACCOUNT HOLDER NAME'){
                        $validated = false;
                }
                if($r_Account === 'IBAN'){
                        $validated = false;
                }
                if($r_BankName === 'BANK NAME'){
                        $validated = false;
                }
        if($validated){

		$xx = strpos($field_52a_1,'BARCGB');
		if($xx>=0){
			date_default_timezone_set("Europe/London");
		}
		$xx = strpos($field_52a_1,'DEUT');
		if($xx>=0){
	                date_default_timezone_set("Europe/Berlin");
	        }



		//GENERATE TRN
		$dateX = date("Y.m.d H:i:s");
		$dateY = md5($dateX);
		$TRN = substr($field_52a_1,0,2) . substr(crc32($dateX) .  crc32($dateY),1,14);
		// GENERATE ALL THE CODES
		$dateV = date("Ymd Hi");
		$MIR = $dateV . " " . $field_52a_1 . " " . crc32($dateV);
		$MOR = $dateV . " " . $r_swiftCode . " " . crc32(md5($dateV));

		$ACK = crc32($dateV . md5($dateV));
		$TRACKINGCODE = strtoupper(substr(md5($TRN),0,10));
				
		$TRN_202 = substr(crc32(sha1($TRN)) . crc32(md5($TRN)),0,14);
		$TRN_202 = "DE" . $TRN_202;
		$SWIFTCOVERAGEINTERNALNUMBER = crc32(sha1($TRN_202));
		$DEBITAUTHORIZEDNUMBER = crc32(md5($TRN_202));
		$DebitNumber = crc32($SWIFTCOVERAGEINTERNALNUMBER . $DEBITAUTHORIZEDNUMBER);

		/*
	        xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	        Where:
	            x is any lowercase hexadecimal character
	            4 – fixed value
	            y – either: 8, 9, a, b
		*/

		$uetr1 = substr(hash('ripemd160', '$TRN'),1,8);
		$uetr2 = substr(hash('whirlpool','$TRN_202'),1,4);
		$uetr3 = "4" . substr(crc32($dateX),1,3);
		$uetr4_1 = substr(crc32($TRN),1,3);
		if($uetr4_1 <=250) {
			$uetr4_1 = "8";
		}else{
			if($uetr4_1<=500){
				$uetr4_1 = "9";
			}else{
				if($uetr4_1<=750){
					$uetr4_1 = "a";
				}else{
					if($uetr4_1<=999){
						$uetr4_1 = "b";
					}
				}

			}
		}
		$uetr5 = substr(md5($TRN) . sha1($TRN_202),1,12);
		$uetr4 = $uetr4_1 . substr(md5($uetr4_1),1,3);
		$UETR = strtolower($uetr1 . "-" . $uetr2 . "-" . $uetr3 . "-" . $uetr4 . "-" . $uetr5);
		$UETR_PRIVATE_KEY = sha1($UETR);
		$v4 = shell_exec('curl https://www.uuidgenerator.net/version4');
	        $retVal = explode(PHP_EOL,$v4);
	        $UETR_V4 = str_replace('<span  id="generated-uuid">','',$retVal[61]);
	        $UETR_V4 = trim(str_replace('</span>','',$UETR_V4));

	        $UETR_PRIVATE_KEY = sha1($UETR);

	        $UETR = crc32($UETR_V4);
		$UETR = shell_exec('java -jar SwiftMessaging.jar GEN_FORM_UETR');

		$TRANSACTION_UPLOADED_IN_SWIFT = crc32($uetr5) . $s_swiftCode . crc32($UETR);

		//echo "------- SWIFT MESSAGE OUTPUT --------<br/>";
                        $SwiftGeneratorArgs = " 'EUR' '$field_32a_3' '$s_swiftCode' '$r_swiftCode' '$field_50a_1' '$field_59_1' '$field_50a_2' '$field_59_2' '$TRN'";
                        $SwiftGeneratorOutput = shell_exec('java -jar /var/www/html/dashboard/prowide/SwiftGenerator.jar ' . $SwiftGeneratorArgs);
		
		$contentTEXT_1 = "TEXT:{1:F01" . $s_swiftCode . crc32($uetr5) ."}2:I103" . $r_swiftCode . "N1}3:119:STP}}\r\n{4:$TRN}5:{MAC:00000000}{PDE:}}{S:{SAC:}}{COP:P}}";

		$output[0]= strip_tags("<table style='font-family:Courier;font-size:11px;width:51%'>") . PHP_EOL;
		$output[1]= strip_tags("<tr><td>" . "OFFICIAL RECEIPT OF MT103 - Timezone:". date_default_timezone_get() ."<br/><br/>") . PHP_EOL;
		$output[2]= strip_tags("<tr><td>" . "<b>SENDER DETAILS</b> - CLEARING CODE USED: " . $clearingCode . "<br/></td></tr>") . PHP_EOL;
		$output[3]= strip_tags("<tr><td>" . "<br/>$field_50a_1 ". PHP_EOL. "$field_50a_2". PHP_EOL . $field_52a_1 . PHP_EOL . $field_52a_2. PHP_EOL . $field_52a_3 . PHP_EOL . "</td></tr>") . PHP_EOL;
		$output[4]= strip_tags("<tr><td>" . "<b>RECEIVER DETAILS</b><br/>" . "</td></tr>") . PHP_EOL;
		$output[5]= strip_tags("<tr><td>" . "<br/>$field_59_1". PHP_EOL . "$field_59_2". PHP_EOL . PHP_EOL . $field_57a_1 . PHP_EOL . $field_57a_2. PHP_EOL . $field_57a_3. PHP_EOL . "</b>" . "</td></tr>") . PHP_EOL;
		$output[6]= strip_tags("<tr><td>" . "<b>TRANSACTION DETAILS</b><br/>" . "</td></tr>") . PHP_EOL;
		$output[7]= strip_tags("<tr><td>" . "<br/>Date of Execute: $dateX" . PHP_EOL . "Amount: $amount". PHP_EOL . "Transaction Reference Number: $TRN" . PHP_EOL . "</td></tr>") . PHP_EOL;
		$output[8]= strip_tags("</table>") . PHP_EOL;
		$output[9]= strip_tags("<th>") . PHP_EOL;
		$output[10]= strip_tags("<div style='font-family:Courier;font-size:11px'><b>INTERNAL SWIFT MESSAGE</b><br/><br/>") . PHP_EOL;
		$output[11]= strip_tags("<tr><td>" . "<table style='font-family:Courier;font-size:11px'>") . PHP_EOL;
		$output[12]= strip_tags("<tr><td>" . "INT SWIFT ACK:". crc32(hash('whirlpool',$TRN)) . "-" . crc32(hash('ripemd160', $TRN)) ."</td></tr>") . PHP_EOL;
		$output[13]= strip_tags("<tr><td>" . "TRANSACTION REFERENCE NUMBER:" . $TRN . "</td></tr>") . PHP_EOL;
		$output[14]= strip_tags("<tr><td>" . "MESSAGE INPUT REFERENCE: " . $MIR . "</td></tr>") . PHP_EOL;
		$output[15]= strip_tags("<tr><td>" . "MESSAGE OUTPUT REFERENCE: " . $MOR . "</td></tr>") . PHP_EOL;
		//$output[16]= strip_tags("<tr><td>" . "UETR CODE:" . $UETR . "</td></tr>") . PHP_EOL;
		$output[17]= strip_tags("<tr><td>" . "-----------------------------------------------------------<br/>") . PHP_EOL;
		$output[18]= strip_tags("<tr><td>" . ":20: <b>TRANSACTION REFERENCE NUMBER</b>". PHP_EOL ."$TRN". "</td></tr>") . PHP_EOL;
		$output[19]= strip_tags("<tr><td>" . ":23B: <b>BANK OPERATION CODE</b><br/>" . PHP_EOL .  $field_23b . "</td></tr>") . PHP_EOL;
		$output[20]= strip_tags("<tr><td>" . ":32A: <b>VALUE DATE/CURRENCY/INTERBANK SETTLED AMOUNT</b></td></tr>") . PHP_EOL;
		$output[21]= strip_tags("<tr><td>" . "$field_32a_1,$field_32a_2,$field_32a_3" . "</td></tr>") . PHP_EOL;
		$output[22]= strip_tags("<tr><td>" . ":33B: <b>CURRENCY / ORIGINAL ORDERED AMOUNT</b></td></tr>") . PHP_EOL;
		$output[23]= strip_tags("<tr><td>" . "$field_33b_1,$field_33b_2" . "</td></tr>") . PHP_EOL;
		$output[24]= strip_tags("<tr><td>" . ":50A: <b>ORDERING CUSTOMER-NAME AND ADDRESS</b><br/>" . PHP_EOL . $field_50a_1 . PHP_EOL . $field_50a_2 . "</td></tr>") . PHP_EOL;
		$output[25]= strip_tags("<tr><td>" . ":52A: <b>ORDERING INSTITUTION</b><br/>" . PHP_EOL . $field_52a_1 . PHP_EOL . $field_52a_2 . PHP_EOL . $field_52a_3 . "</td></tr>") . PHP_EOL;
		// CORRESPONDENT $field_53a $field_54a $field_56a
		$vCountX = 26;
		if($field_53a!=""){
			$output[$vCountX]= strip_tags("<tr><td>" . ":53A: <b>SENDER'S CORRESPONDENT</b><br/>" . PHP_EOL . $field_53a . "</td></tr>") . PHP_EOL;
			$vCountX++;
		}
		if($field_54a!=""){
			$output[$vCountX]= strip_tags("<tr><td>" . ":54A: <b>RECEIVER'S CORRESPONDENT</b><br/>" . PHP_EOL . $field_54a . "</td></tr>") . PHP_EOL;
			$vCountX++;
		}
		if($field_56a!=""){
			$output[$vCountX]= strip_tags("<tr><td>" . ":56A: <b>INTERMEDIARY </b><br/>" . PHP_EOL . $field_56a . "</td></tr>") . PHP_EOL;
			$vCountX++;
		}
		$output[$vCountX++]= strip_tags("<tr><td>" . ":57A: <b>ACCOUNT WITH INSTITUTION</b>. " . PHP_EOL . $field_57a_1 . PHP_EOL . $field_57a_2 . PHP_EOL . $field_57a_3 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":59A: <b>BENEFICIARY CUSTOMER</b>" . PHP_EOL . $field_59_1 . PHP_EOL . $field_59_2 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":70: <b>REMITTANCE INFORMATION</b>" . PHP_EOL . $field_70 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":71A: <b>DETAILS OF CHARGES</b> " . PHP_EOL . $field_71a . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":72:" . $field_72 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":77B:" . $field_77b . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "------------------------------------------------------------<br/>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "CHK:" . getCHK($TRN) . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "PKI-SIGNATURE:" . crc32($UETR) . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "TRACKING CODE:" . $TRACKINGCODE . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "DATE OF EXECUTION:" . $dateX . "</td></tr>") . PHP_EOL;
		//$output[$vCountX++]= strip_tags("<tr><td>" . "UETR CODE:" . $UETR . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "MD5:". md5(hash('ripemd160', $TRN)) . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "SESSION ID:" . strtoupper(sha1($TRN)) . "</td></tr>") . PHP_EOL;
		//$content_TEXT1 = "TEXT:{1:F01$s_swiftCode" . crc32(md5($TRN)) ."}{2:I103$r_swiftCode" . "N1}{3:119:STP}}{4:$TRN}<br/>";
		//$content_TEXT2 = "{5:{MAC:0000000000}{PDE:}}{S:{SAC:}}{COP:P}}{103:COV}{121:$UETR}<br/>" . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $contentTEXT_1 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $contentTEXT_2 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "------------------------------------------------------------") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>MT202 COV OUTPUT GENERAL FINANCIAL INSTITUTION TRANSFER</b>" . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "------------------------------------------------------------" . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":20: <b>SENDER'S REFERENCE</b> " . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $TRN_202 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":21: <b>RELATED REFERENCE</b> " . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $TRN . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":32A: <b>VALUE DATE/CURRENCY/INTERBANK SETTLED AMOUNT</b> " . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "$field_32a_1,$field_32a_2,$field_32a_3" . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":50A: <b>ORDERING CUSTOMER-NAME AND ADDRESS</b> </b></td></tr><tr><td>" . PHP_EOL . $field_50a_1 . "</td></tr><tr><td>" . PHP_EOL . $field_50a_2 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":52A: <b>ORDERING INSTITUTION</b> </b><br/>" . PHP_EOL . $field_52a_1 . "<br/>" . PHP_EOL . $field_52a_2 . PHP_EOL . "<br/>" . $field_52a_3 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":58A: <b>BENEFICIARY INSTITUTION</b> " . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_57a_1 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_57a_2 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_57a_3 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . ":59A: <b>BENEFICIARY CUSTOMER</b> " . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_59_1 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_59_2 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . $field_59_3 . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>Swift Message:</b>  MT103" . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>Swift Coverage:</b>  YES" . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>Swift Coverage Internal No:</b>  ". $SWIFTCOVERAGEINTERNALNUMBER . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>CONFIRMED ACK:</b>" . crc32($dateOfExecution) . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>DEBIT AUTHORIZED NO:</b>  ". $DEBITAUTHORIZEDNUMBER . "</td></tr>") . PHP_EOL;
		$output[$vCountX++]= strip_tags("<tr><td>" . "<b>Account Debited:</b> ". $DebitNumber . "</td></tr>") . PHP_EOL; //458654789511/DEUTDEFFXXX
		$output[$vCountX++]= strip_tags("<tr><td>" . "HTML GENERATED [OK]") . PHP_EOL;

		$output[$vCountX++]= "[SWIFT DIGITAL CERTIFICATE]";

		$outputX = shell_exec('openssl s_client -connect www2.swift.com:443');
		$retVal = explode(PHP_EOL,$outputX);
		
		for($i=0;$i<=(count($retVal)-1);$i++){
			$output[$vCountX++] = $retVal[$i] . PHP_EOL;
		}
		
		$output[$vCountX++] = "TRANSACTION STATUS: APPROVED" . PHP_EOL;
		$output[$vCountX++] = "AMOUNT TRANSFERED: $amount" . PHP_EOL;
		//$output[$vCountX++] = "SWIFT ACK: " . crc32($SWIFTCOVERAGEINTERNALNUMBER) . PHP_EOL;
		$output[$vCountX++] = "DATE OF EXECUTION: " . date("Y/m/d H:i:s") . PHP_EOL;
		//$output[$vCountX++] =  "UETR CODE: $UETR ". PHP_EOL;
		
		$output[$vCountX++] =  "------------------------------------------------------------------" . PHP_EOL;
		$output[$vCountX++] =  "SETTLEMENTS SECTION" . PHP_EOL;
		$output[$vCountX++] =  "------------------------------------------------------------------" . PHP_EOL;
		$output[$vCountX++] =  "1. COVERAGE STATUS: 100%" . PHP_EOL;
		$output[$vCountX++] =  "2. MAIN ACCOUNT: LOCATED" . PHP_EOL;
		$output[$vCountX++] =  "3. COVERAGE FUNDS: TRANSFERED" . PHP_EOL;
		$output[$vCountX++] =  "4. AUTO SWIFT NOTIFICATION MESSAGING: DELIVERED" . PHP_EOL;
		$output[$vCountX++] =  "5. SWIFT MESSAGE (MT202 COV): UPLOADED" . PHP_EOL;
		$output[$vCountX++] =  "6. SETTLEMENTS TRANSACTION: DONE" . PHP_EOL;
		$output[$vCountX++] =  "7. TRANSACTION UPLOADED IN SWIFT.COM WITH COVERAGE M0 SERIAL DEBIT NUMBER:" . PHP_EOL;
		$output[$vCountX++] =  "   $TRANSACTION_UPLOADED_IN_SWIFT" . PHP_EOL;
		$output[$vCountX++] =  "8. TRANSACTION AUTHORIZED WITH COVERAGE M0 SERIAL DEBIT NUMBER:" . crc32($TRANSACTION_UPLOADED_IN_SWIFT) . PHP_EOL;

		include('connect.php');
		//select Website from BanksFullDetails where SwiftCode LIKE '%BARCGB22%';
		$receiverFinded = 0;
		$sql_01= "select Website from BanksFullDetails where SwiftCode LIKE '%" . $r_swiftCode . "%'";
			if ($result = $conn->query($sql_01)) {
			        if($result->num_rows > 0){
			                while($row = $result->fetch_assoc()) {
			                        $websiteReceiver = $row["Website"];
						break;
			                }
			                $ipReceiver = gethostbyname($websiteReceiver);
					$receiverFinded = 1;
			        }
			}
			if($receiverFinded===0){
				$r_swiftCodeTemp = str_replace('XXX','',$r_swiftCode);
				$sql_02= "select Website from BanksFullDetails where SwiftCode LIKE '%" . $r_swiftCodeTemp . "%'";

				if ($result = $conn->query($sql_02)) {
	                                if($result->num_rows > 0){
	                                        while($row = $result->fetch_assoc()) {
	                                                $websiteReceiver = $row["Website"];
	                                                break;
	                                        }
	                                        $ipReceiver = gethostbyname($websiteReceiver);
	                                        $receiverFinded = 1;
	                                }
	                        }

			}
			if($receiverFinded===0){
				$websiteReceiver = "www.ecb.europa.eu";
				$ipReceiver = "185.5.82.138";
			}

			$output[$vCountX++] =  "--------------------------------------------------------------------" . PHP_EOL;
			$output[$vCountX++] =  "DIGITAL CERTIFICATE EXCHANGED" . PHP_EOL;
			$output[$vCountX++] =  "--------------------------------------------------------------------" . PHP_EOL;
			$output[$vCountX++] =  "[SENDER CERTIFICATE]" . PHP_EOL;
			$output[$vCountX++] =  "IP: 160.83.8.143 " . PHP_EOL;
			$output[$vCountX++] =  "DOMAIN: www.db.com" . PHP_EOL;
			$outputSender = shell_exec('openssl s_client -connect www.db.com:443');
                        $retVal = explode(PHP_EOL,$outputSender);

                        for($i=0;$i<=(count($retVal)-1);$i++){
                                $output[$vCountX++] = $retVal[$i] . PHP_EOL;
                        }
			$outputY = shell_exec('openssl s_client -connect ' . $ipReceiver . ':443');
                        $retValY = explode(PHP_EOL,$outputY);
			$output[$vCountX++] =  "[RECEIVER CERTIFICATE]" . PHP_EOL;
                        $output[$vCountX++] =  "IP: $ipReceiver" . PHP_EOL;
                        $output[$vCountX++] =  "DOMAIN: $websiteReceiver" . PHP_EOL;

                        for($i=0;$i<=(count($retValY)-1);$i++){
                                $output[$vCountX++] = $retValY[$i] . PHP_EOL;
                        }


		$filename = '/var/www/html/unitedmatrix.org/dashboard/logs/' . $TRN . '.txt';
		$retX = file_put_contents($filename,$output);

			echo "<h2>TRANSACTION SUCCESSFULLY<br/>";
			echo "TRANSACTION RECEIPT:</h2><a href='http://unitedmatrix.org/logs/" . $TRN . ".txt' target='_blank'>Customer Copy (Text Version)</a><br/>";
			
			$contentTEXT_1 = str_replace("\r\n","<tr><td>",$contentTEXT_1);


			// HTML OUTPUT
			$outputHTML[0]= "<p><img src='https://www.fefcars.it/wp-content/uploads/2019/08/Color-Deutsche-Bank-Logo-1024x275.jpg' width='150px'/></p>" . "<table style='font-family:Courier;font-size:11px;width:51%'>". PHP_EOL;
			$outputHTML[1]= "<tr><td>" . "OFFICIAL RECEIPT OF MT103 - Timezone:". date_default_timezone_get() ."<br/><br/>". PHP_EOL;
			$outputHTML[2]= "<tr><td>" . "<b>SENDER DETAILS</b> - CLEARING CODE USED: ". $clearingCode . "<br/></td></tr>". PHP_EOL;
			$outputHTML[3]= "<tr><td>" . "<br/>$field_50a_1 ". PHP_EOL. " $field_50a_2". PHP_EOL . $field_52a_1 . PHP_EOL . $field_52a_2. PHP_EOL . $field_52a_3 . PHP_EOL . "</td></tr>". PHP_EOL;
			$outputHTML[4]= "<tr><td>" . "<b>RECEIVER DETAILS</b><br/>" . "</td></tr>". PHP_EOL;
			$outputHTML[5]= "<tr><td>" . "<br/>$field_59_1". PHP_EOL . "$field_59_2". PHP_EOL . PHP_EOL . $field_57a_1 . PHP_EOL . $field_57a_2. PHP_EOL . $field_57a_3. PHP_EOL . "</b>" . "</td></tr>". PHP_EOL;
			$outputHTML[6]= "<tr><td>" . "<b>TRANSACTION DETAILS</b><br/>" . "</td></tr>". PHP_EOL;
			$outputHTML[7]= "<tr><td>" . "<br/>Date of Execute: $dateX<br/>" . PHP_EOL . "Amount: $amount<br/>". PHP_EOL . "Transaction Reference Number: $TRN<br/>" . PHP_EOL . "</td></tr>". PHP_EOL;
			$outputHTML[8]= "</table>". PHP_EOL;
			$outputHTML[9]= "<th>". PHP_EOL;
			$outputHTML[10]= "<div style='font-family:Courier;font-size:11px'><b>INTERNAL SWIFT MESSAGE</b><br/><br/>". PHP_EOL;
			$outputHTML[11]= "<tr><td>" . "<table style='font-family:Courier;font-size:11px'>". PHP_EOL;
			$outputHTML[12]= "<tr><td>" . "<b>INT SWIFT ACK</b>:". crc32(hash('whirlpool',$TRN)) . "-" . crc32(hash('ripemd160', $TRN)) . "</td></tr>" . PHP_EOL;
			$outputHTML[13]= "<tr><td>" . "TRANSACTION REFERENCE NUMBER:" . $TRN . "</td></tr>". PHP_EOL;
			$outputHTML[14]= "<tr><td>" . "MESSAGE INPUT REFERENCE: " . $MIR . "</td></tr>". PHP_EOL;
			$outputHTML[15]= "<tr><td>" . "MESSAGE OUTPUT REFERENCE: " . $MOR . "</td></tr>". PHP_EOL;
			//$outputHTML[16]= "<tr><td>" . "<b>UETR CODE:" . $UETR . "</td></tr>" . PHP_EOL;
			$outputHTML[17]= "<tr><td>" . "-----------------------------------------------------------<br/>". PHP_EOL;
			$outputHTML[18]= "<tr><td>" . ":20: <b>TRANSACTION REFERENCE NUMBER</b>". PHP_EOL ."$TRN". "</td><td rowspan='5'><img src='http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=example' width='100px'/></td></tr>". PHP_EOL;
			$outputHTML[19]= "<tr><td>" . ":23B: <b>BANK OPERATION CODE</b><br/>" . $field_23b . "</td></tr>". PHP_EOL;
			$outputHTML[20]= "<tr><td>" . ":32A: <b>VALUE DATE/CURRENCY/INTERBANK SETTLED AMOUNT</b></td></tr>". PHP_EOL;
			$outputHTML[21]= "<tr><td>" . "$field_32a_1,$field_32a_2,$field_32a_3" . "</td></tr>". PHP_EOL;
			$outputHTML[22]= "<tr><td>" . ":33B: <b>CURRENCY / ORIGINAL ORDERED AMOUNT</b></td></tr>". PHP_EOL;
			$outputHTML[23]= "<tr><td>" . "$field_33b_1,$field_33b_2" . "</td></tr>". PHP_EOL;
			$outputHTML[24]= "<tr><td>" . ":50A: <b>ORDERING CUSTOMER-NAME AND ADDRESS</b><br/>" . PHP_EOL . $field_50a_1 . PHP_EOL . $field_50a_2 . "</td></tr>". PHP_EOL;
			$outputHTML[25]= "<tr><td>" . ":52A: <b>ORDERING INSTITUTION</b><br/>" . PHP_EOL . $field_52a_1 . PHP_EOL . $field_52a_2 . PHP_EOL . $field_52a_3 . "</td></tr>". PHP_EOL;
                        $outputHTML[26]= "<tr><td>" . ":53A: <b>SENDER'S CORRESPONDENT</b><br/>" . $field_53a . "</td></tr>". PHP_EOL;
                        $outputHTML[27]= "<tr><td>" . ":54A: <b>RECEIVER'S CORRESPONDENT</b><br/>" . $field_54a . "</td></tr>". PHP_EOL;
                        $outputHTML[28]= "<tr><td>" . ":56A: <b>INTERMEDIARY</b><br/>" . $field_56a . "</td></tr>". PHP_EOL;
			$outputHTML[29]= "<tr><td>" . ":57A: <b>ACCOUNT WITH INSTITUTION</b>. " . PHP_EOL . $field_57a_1 . PHP_EOL . $field_57a_2 . PHP_EOL . $field_57a_3 . "</td></tr>". PHP_EOL;
			$outputHTML[30]= "<tr><td>" . ":59A: <b>BENEFICIARY CUSTOMER</b>" . PHP_EOL . $field_59_1 . PHP_EOL . $field_59_2 . "</td></tr>". PHP_EOL;
			$outputHTML[31]= "<tr><td>" . ":70: <b>REMITTANCE INFORMATION</b>" . PHP_EOL . $field_70 . "</td></tr>". PHP_EOL;
			$outputHTML[32]= "<tr><td>" . ":71A: <b>DETAILS OF CHARGES</b> " . PHP_EOL . $field_71a . "</td></tr>". PHP_EOL;
			$outputHTML[33]= "<tr><td>" . ":72:" . $field_72 . "</td></tr>". PHP_EOL;
			$outputHTML[34]= "<tr><td>" . ":77B:" . $field_77b . "</td></tr>". PHP_EOL;
			$outputHTML[35]= "<tr><td>" . "------------------------------------------------------------<br/>". PHP_EOL;
			$outputHTML[36]= "<tr><td>" . "CHK:" . getCHK($TRN) . "</td></tr>" . PHP_EOL;
			$outputHTML[37]= "<tr><td>" . "PKI-Signature:" . crc32($UETR) . "</td></tr>" . PHP_EOL;
			$outputHTML[38]= "<tr><td>" . "TRACKING CODE:" . $TRACKINGCODE . "</td></tr>". PHP_EOL;
			$outputHTML[39]= "<tr><td>" . "DATE OF EXECUTION:" . $dateX . "</td></tr>". PHP_EOL;
			//$outputHTML[40]= "<tr><td>" . "UETR CODE:" . $UETR . "</td></tr>". PHP_EOL;
			$outputHTML[41]= "<tr><td>" . "MD5:". md5(hash('ripemd160', $TRN)) ."<br/>" . PHP_EOL;
			$outputHTML[42]= "<tr><td>" . "SESSION ID:" . strtoupper(sha1($TRN)). "</td></tr>". PHP_EOL;
			$outputHTML[43]= "<tr><td>" . $contentTEXT_1 . "</td></tr>" . PHP_EOL;
			$outputHTML[44]= "<tr><td>" . $contentTEXT_2 . "</td></tr>" . PHP_EOL;
			$outputHTML[45]= "<tr><td>" . "------------------------------------------------------------". PHP_EOL;
			$outputHTML[46]= "<tr><td>" . "<b>MT202 COVERAGE OUTPUT GENERAL FINANCIAL INSTITUTION TRANSFER</b>" . "</td></tr>". PHP_EOL;
			$outputHTML[47]= "<tr><td>" . "------------------------------------------------------------" . "</td></tr>". PHP_EOL;
			$outputHTML[48]= "<tr><td>" . ":20: <b>SENDER'S REFERENCE</b> " . "</td></tr>". PHP_EOL;
			$outputHTML[49]= "<tr><td>" . $TRN_202 . "</td></tr>". PHP_EOL;
			$outputHTML[50]= "<tr><td>" . ":21: <b>RELATED REFERENCE</b> " . "</td></tr>". PHP_EOL;
			$outputHTML[51]= "<tr><td>" . $TRN . "</td></tr>". PHP_EOL;
			$outputHTML[52]= "<tr><td>" . ":32A: <b>VALUE DATE/CURRENCY/INTERBANK SETTLED AMOUNT</b> " . "</td></tr>". PHP_EOL;
			$outputHTML[53]= "<tr><td>" . "$field_32a_1,$field_32a_2,$field_32a_3" . "</td></tr>". PHP_EOL;
			$outputHTML[54]= "<tr><td>" . ":50A: <b>ORDERING CUSTOMER-NAME AND ADDRESS</b> </b></td></tr><tr><td>" . PHP_EOL . $field_50a_1 . "</td></tr><tr><td>" . $field_50a_2 . "</td></tr>". PHP_EOL;
			$outputHTML[55]= "<tr><td>" . ":52A: <b>ORDERING INSTITUTION</b> </b><br/>" . $field_52a_1 . "<br/>" . PHP_EOL . $field_52a_2 . "<br/>" . $field_52a_3 . "</td></tr>". PHP_EOL;
			$outputHTML[56]= "<tr><td>" . ":58A: <b>BENEFICIARY INSTITUTION</b> " . "</td></tr>". PHP_EOL;
			$outputHTML[57]= "<tr><td>" . $field_57a_1 . "</td></tr>". PHP_EOL;
			$outputHTML[58]= "<tr><td>" . $field_57a_2 . "</td></tr>". PHP_EOL;
			$outputHTML[59]= "<tr><td>" . $field_57a_3 . "</td></tr>". PHP_EOL;
			$outputHTML[60]= "<tr><td>" . ":59A: <b>BENEFICIARY CUSTOMER</b> " . "</td></tr>". PHP_EOL;
			$outputHTML[61]= "<tr><td>" . $field_59_1 . "</td></tr>". PHP_EOL;
			$outputHTML[62]= "<tr><td>" . $field_59_2 . "</td></tr>". PHP_EOL;
			$outputHTML[63]= "<tr><td>" . $field_59_3 . "</td></tr>". PHP_EOL;
			$outputHTML[64]= "<tr><td>" . "<b>Swift Message:</b>  MT103" . "</td></tr>". PHP_EOL;
			$outputHTML[65]= "<tr><td>" . "<b>Swift Coverage:</b>  YES" . "</td></tr>". PHP_EOL;
			$outputHTML[66]= "<tr><td>" . "<b>PKI-Signature:</b>" .crc32(sha1($TRN . $SWIFTCOVERAGEINTERNALNUMBER))."</td></tr>" . PHP_EOL;
			$outputHTML[67]= "<tr><td>" . "<b>DATE OF CREATION:</b>$dateOfExecution</td></tr>" . PHP_EOL;
			$outputHTML[68]= "<tr><td>" . "<b>CONFIRMED ACK:</b>" . crc32($dateOfExecution) . "</td></tr>" . PHP_EOL;
			$outputHTML[69]= "<tr><td>" . "<b>MD5 :</b>" . md5(hash('ripemd160', $TRN)) . "</td></tr>" . PHP_EOL;
			$outputHTML[70]= "<tr><td>" . "<b>TRN :</b>" . $TRN. "</td></tr>" . PHP_EOL;
			$outputHTML[71]= "<tr><td>" . "<b>TYPE:</b>" . "MT103+FUNDS REMITTANCE". "</td></tr>" . PHP_EOL;
			//$outputHTML[72]= "<tr><td>" . "<b>UETR CODE:" . $UETR . "</td></tr>" . PHP_EOL;
			$outputHTML[73]= "<tr><td>" . "<b>DASHBOARD STATUS:</b> CONNECTED". "</td></tr>" . PHP_EOL;
			$outputHTML[74]= "<tr><td>" . "<b>QR CODE:</b> See Below". "</td></tr>" . PHP_EOL;
			$outputHTML[75]= "<tr><td>" . "<b>DIGITAL CERTIFICATE:</b> SEE BELOW". "</td></tr>" . PHP_EOL;
			$outputHTML[76]="";	//$outputHTML[67]= "<tr><td>" . "<b>UETR PRIVATE KEY:</b> $UETR_PRIVATE_KEY</td></tr>" . PHP_EOL;
			$outputHTML[77]= "<tr><td>" . "<b>Swift Coverage Internal No:</b>  ". $SWIFTCOVERAGEINTERNALNUMBER . "</td></tr>". PHP_EOL;
			$outputHTML[78]= "<tr><td>" . "<b>DEBIT AUTHORIZED NO:</b>  ". $DEBITAUTHORIZEDNUMBER . "</td></tr>". PHP_EOL;
			$outputHTML[79]= "<tr><td>" . "<b>Account Debited:</b> ". $DebitNumber . "</td></tr>". PHP_EOL; //458654789511/DEUTDEFFXXX
			$outputHTML[80]= "<tr><td>" . "HTML GENERATED [OK]". PHP_EOL;
			$outputHTML[81]= "[SWIFT DIGITAL CERTIFICATE]";
			$outputHTML[82] = "<tr><td><img src=\"http://unitedmatrix.org/q1.php?t=$TRN\" title='UETR CODE' /></td></tr>". PHP_EOL;
			$outputSwift = shell_exec('openssl s_client -connect www2.swift.com:443');
			$vCountQ = 83;
			$retValZ = explode(PHP_EOL,$outputSwift);

			for($i=0;$i<=(count($retValZ)-1);$i++){
				$outputHTML[$vCountQ++] = $retValZ[$i] . "<br/>";
			}

			$outputHTML[$vCountQ++] = "<br/>TRANSACTION STATUS: APPROVED" . PHP_EOL . "<br/>";
			$outputHTML[$vCountQ++] = "AMOUNT TRANSFERED: $field_32a_3" . PHP_EOL. "<br/>";
			//$outputHTML[$vCountQ++] = "SWIFT ACK: " . crc32($SWIFTCOVERAGEINTERNALNUMBER). PHP_EOL. "<br/>";
			$outputHTML[$vCountQ++] = "DATE OF EXECUTION: $dateOfExecution </td></tr>". PHP_EOL. "<br/>";
			$outputHTML[$vCountQ++] =  "CONFIRMED ACK: " . crc32($dateOfExecution) . "<br/>" .PHP_EOL;
			
			

			$outputHTML[$vCountQ++] =  "--------------------------------------------------------------------" . "<br/>" . PHP_EOL;
                        $outputHTML[$vCountQ++] =  "DIGITAL CERTIFICATE EXCHANGED" . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "--------------------------------------------------------------------" . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "[SENDER CERTIFICATE]" . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "IP: 160.83.8.143 " . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "DOMAIN: www.db.com" . "<br/>" .PHP_EOL;
                        $outputHTMLSender = shell_exec('openssl s_client -connect www.db.com:443');
                        $retVal = explode(PHP_EOL,$outputHTMLSender);

                        for($i=0;$i<=(count($retVal)-1);$i++){
                                $outputHTML[$vCountQ++] = $retVal[$i] . "<br/>" .PHP_EOL;
                        }
                        $outputHTML[$vCountQ++] =  "[RECEIVER CERTIFICATE]" . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "IP: $ipReceiver" . "<br/>" .PHP_EOL;
                        $outputHTML[$vCountQ++] =  "DOMAIN: $websiteReceiver" . "<br/>" .PHP_EOL;
                        $outputHTMLY = shell_exec('openssl s_client -connect ' . $ipReceiver . ':443');
                        $retValY = explode(PHP_EOL,$outputHTMLY);

                        for($i=0;$i<=(count($retValY)-1);$i++){
                                $outputHTML[$vCountQ++] = $retValY[$i] . "<br/>" .PHP_EOL;
                        }


			$filename = '/var/www/html//dashboard/logs/' . $TRN . '.html';
			$retX = file_put_contents($filename,$outputHTML);
			echo "<a href='http://unitedmatrix.org/logs/" . $TRN . ".html' target='_blank'>Customer Copy (HTML Version)</a><br/>";

			echo "<a href='http://unitedmatrix.org/logs/receipt_" . $TRN . ".png' target='_blank'>Debit Note picture (PNG Format)</a>";
			echo "<p style='font-family:Courier;font-size:11px'><b>Sender Name:</b>$field_50a_1<br/><b>Receiver Name:</b>$field_59_1<br/><b>Amount:</b>$field_32a_3<br/><b>Currency:</b>$field_33b_1<br/><b>TRN:</b>$TRN<br/><b>Date Of Execution:</b> $dateX</p>";
			$iCount=0;

			//include ('connect.php');
			$s_AccountName = $field_50a_1;
			$s_Account = $field_50a_2;
			$s_swiftCode = $field_52a_1;
			$s_BankName = $field_52a_2;
			$s_BankAddress = $field_52a_3;
			$r_BankName = $field_57a_1;
			$r_BankAddress = $field_57a_2;
			$r_swiftCode = $field_57a_3;
			$r_AccountName = $field_59_1;
			$r_Account = $field_59_2;
			$remittance = $field_70;
			$amount = $field_32a_3;


			$iCount = 0;
			if ($result = $conn->query("SELECT MAX(id) FROM Transactions")) {
			                if($result->num_rows > 0){
			                                while($row = $result->fetch_assoc()) {
			                                        $iCount = $row['MAX(id)'];
			                                }
			                }
			}
			$iCount++;

			//if ($result = $conn->query("SELECT * FROM Transactions")) {
			//        $iCount= $result->num_rows;
			//        $iCount++;
/*
+-----------------+---------------+------+-----+-------------------+-----------------------------------------------+
| Field           | Type          | Null | Key | Default           | Extra                                         |
+-----------------+---------------+------+-----+-------------------+-----------------------------------------------+
| id              | int unsigned  | NO   | PRI | NULL              | auto_increment                                |
| TransactionType | varchar(10)   | YES  |     | NULL              |                                               |
| s_BankName      | varchar(50)   | NO   |     | NULL              |                                               |
| s_BankAddress   | varchar(300)  | YES  |     | NULL              |                                               |
| s_SwiftCode     | varchar(30)   | YES  |     | NULL              |                                               |
| s_AccountName   | varchar(300)  | YES  |     | NULL              |                                               |
| s_AccountNumber | varchar(40)   | YES  |     | NULL              |                                               |
| r_BankName      | varchar(300)  | YES  |     | NULL              |                                               |
| r_BankAddress   | varchar(300)  | YES  |     | NULL              |                                               |
| r_SwiftCode     | varchar(30)   | YES  |     | NULL              |                                               |
| r_AccountName   | varchar(300)  | YES  |     | NULL              |                                               |
| r_AccountNumber | varchar(240)  | YES  |     | NULL              |                                               |
| TRN             | varchar(50)   | YES  |     | NULL              |                                               |
| UETR            | varchar(60)   | YES  |     | NULL              |                                               |
| Subject         | varchar(2000) | YES  |     | NULL              |                                               |
| Amount          | varchar(30)   | YES  |     | NULL              |                                               |
| Currency        | varchar(10)   | YES  |     | NULL              |                                               |
| DateOfExecution | varchar(220)  | YES  |     | NULL              |                                               |
| Status_1        | varchar(5)    | YES  |     | NULL              |                                               |
| Status_2        | varchar(5)    | YES  |     | NULL              |                                               |
| Status_3        | varchar(5)    | YES  |     | NULL              |                                               |
| Status_4        | varchar(5)    | YES  |     | NULL              |                                               |
| Status_5        | varchar(5)    | YES  |     | NULL              |                                               |
| reg_date        | timestamp     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| isDirect        | varchar(20)   | YES  |     | NULL              |                                               |
| TypeOfCoverage  | varchar(50)   | YES  |     | NULL              |                                               |
+-----------------+---------------+------+-----+-------------------+-----------------------------------------------+

*/
			        $sql = "INSERT INTO Transactions VALUES ('$iCount','MT103','$s_BankName','$s_BankAddress','$s_swiftCode','$s_AccountName','$s_Account','$r_BankName','$r_BankAddress','$r_swiftCode','$r_AccountName','$r_Account','$TRN','$UETR','$remittance','$amount','$currency','$dateX','YES','YES','','','',NOW(),'YES','M0')";
			        echo "<h3>TRANSACTION UPLOADED IN SWIFT.COM WITH COVERAGE M0 <br/> SERIAL DEBIT NUMBER: $TRANSACTION_UPLOADED_IN_SWIFT</h3>";
				$res = $conn->query($sql);

				if(!$res)
				{
				    echo "<h1 color='red'>" . mysqli_error($conn) . "</h1>";
				    die();
				}else{
				    echo "<h2>TRANSACTION REGISTERED IN SWIFT.COM SUCCESSFULLY!</h2>";
				} 

			//}
			//echo "------- SWIFT MESSAGE OUTPUT --------<br/>";
			$SwiftGeneratorArgs = " 'EUR' '$field_32a_3' '$s_swiftCode' '$r_swiftCode' '$field_50a_1' '$field_59_1' '$field_50a_2' '$field_59_2' '$TRN'";
			$SwiftGeneratorOutput = shell_exec('java -jar /var/www/html/dashboard/prowide/SwiftGenerator.jar ' . $SwiftGeneratorArgs);
			//echo "<pre>$SwiftGeneratorutput</pre>";


			$resultMessages = $conn->query("SELECT * FROM SwiftRKMessage");
                        $iCountSwift= $resultMessages->num_rows;
			$iCountSwift++;

			$SwiftGeneratorOutput = str_replace("Command Line Arguments: CURRENCY AMOUNT SWIFTSENDER SWIFTRECEIVER ACCOUNTNAMESENDER ACCOUNTNAMERECEIVER ACCOUNTNUMBERSENDER ACCOUNTNUMBERRECEIVER","",$SwiftGeneratorOutput);
			$sql_Swift = "INSERT INTO SwiftRKMessage VALUES ('$iCountSwift','$TRN','$s_swiftCode','$r_swiftCode','$SwiftGeneratorOutput','unitedmatrix Order')";
			$res = $conn->query($sql_Swift);
			// PREPARE IMAGE OF DEBIT NOTE

			$cmd = "wkhtmltoimage 'http://unitedmatrix.org/debitReceipt.php?TRN=$TRN' /var/www/html//dashboard/logs/receipt_$TRN.png";
			$retValDebitImage = shell_exec($cmd);
			//echo "<p>$cmd</p>";
			        if ($result = $conn->query("SELECT MAX(id) FROM AuthorizedTransaction")) {
			                if($result->num_rows > 0){
                                                        while($row = $result->fetch_assoc()) {
                                                                $iCountTransactionAuth = $row['MAX(id)'];
                                                        }
                                        }
			                
			        }
			        $iCountTransactionAuth++;

			        $sql = "INSERT INTO AuthorizedTransaction VALUES ('$iCountTransactionAuth','$TRN','$UETR','','','','','Web Operator')";
			        echo "<img src='https://www.authorized.by/wp-content/uploads/2021/04/authorized-siegel.png' width='150px'/>";
			        echo "<h3>TRANSACTION AUTHORIZED WITH COVERAGE M0<br/>SERIAL DEBIT NUMBER: ". crc32($TRANSACTION_UPLOADED_IN_SWIFT);
			        echo "<h2>DEBIT NOTE LINK: <a href='http://unitedmatrix.org/debitReceipt.php?TRN=$TRN' target='_blank' style='font-size:18px'>Here</a></h2>";
				$res = $conn->query($sql);
				if(!$res)
                                {
                                    echo "<h1 color='red'>" . mysqli_error($conn) . "</h1>";
                                    die();
                                }else{
                                    echo "<h2>TRANSACTION AUTHORIZED SUCCESSFULLY!</h2>";
                                }

			        echo "<h2>ACCOUNT DEBITED SUCCESSFULLY!</h2>";


	}else{
		echo "<img src='https://banner2.cleanpng.com/20171218/dd2/sign-stop-png-5a375e2a416ea6.046638191513578026268.jpg' width='400px' />";
		echo "<h1 style='color:red;font-size:36px'>DETAILS NO VALID</h1>";
	}
	// PREPARE CONTENT PDF
        for($f=0;$f<=(count($output)-1);$f++){
                $contentX .= $output[$f] . "|";
        }
        $outputSwift = explode(PHP_EOL,$SwiftGeneratorOutput);
        for($f=0;$f<=(count($outputSwift)-1);$f++){
                $contentY .= $outputSwift[$f] . "|";
        }


                echo "<form action='./generatepdfMT103.php' method='POST'>";
                echo "<input type='hidden' name='swiftContent' value='$contentY' />";
                echo "<input type='hidden' name='slipCopy' value='$contentX' />";
		echo "<input type='hidden' name='TRN' value='$TRN' />";
                echo "<input type='submit' value='GENERATE SLIP COPY PDF' />";
                echo "</form>";

?>
</body>
</html>
