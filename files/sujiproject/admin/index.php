<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>admin</title>

<link href="login-box.css" rel="stylesheet" type="text/css" />
</head>

<body>

<script type="text/javascript">
function adminLoginValidate()
{
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	   if(document.admlogin.name.value=="" && document.admlogin.pass.value== ""){
			   alert("Please enter your Username and password" );
			   document.admlogin.name.focus();
			   return false;
     }
	 if(document.admlogin.name.value!="admin" && document.admlogin.pass.value!= "password"){
			   alert(" Username or password is wrong" );
			   document.admlogin.name.value=="";
			   document.admlogin.pass.value=="";
			   document.admlogin.name.focus();
			   return false;
     }
	   else if(document.admlogin.name.value==""){
			   alert("Please enter your Username" );
			   document.admlogin.name.focus();
			   return false;
     }
	   else if(document.admlogin.pass.value == ""){
			   alert("Please enter your password" );
			   document.admlogin.pass.focus();
			   return false;
     }
     else{
      if(document.admlogin.name.value!="" && document.admlogin.pass.value!= ""){
	   var address = document.admlogin.name.value;
	/*  if(reg.test(address) == false) {
		  alert('Invalid Email Address');
		  document.admlogin.name.focus();
		  return false;
	   }*/
		 var x = document.admlogin.pass.value;
     	  if (x.length< 8)  {
			   alert("Enter password greater than eight characters" );
			   document.admlogin.pass.focus();
			   return false;
			   }
			    if(document.admlogin.name.value=="admin" && document.admlogin.pass.value== "password"){
			  window.location = "admin_panel.php?u="+document.admlogin.name.value;
			  //http://184.73.239.182/chennaiworks/test/admin/admin_panel.php
			        }
            else{
            document.admlogin.submit();
            }
	}

	}

}
</script>

<div style="padding: 100px 0 0 250px;">

<form action="header.php" name="admlogin" method="post" >
<div id="login-box">
<H2>Login</H2>
<br />
<br />

<div id="login-box-name" style="margin-top:20px;">Email:</div><div id="login-box-field" style="margin-top:20px;"><input name="name" class="form-login" title="Username" value="" size="30" maxlength="2048" /></div>
<div id="login-box-name">Password:</div><div id="login-box-field"><input name="pass" type="password" class="form-login" title="Password" value="" size="30" maxlength="2048" /></div>
<br />

<br />
<a href="#"><img src="images/login-btn.png" width="103" height="42" style="margin-left:90px;" onclick="return adminLoginValidate()"/ /></a>
<span style="margin:0 0 0 20px;position:relative;top:-8px;"><a href="../" style="color:white;">Back to the quiz</a></span>

</div>

</div>

</form>











</body>
</html>
