<?php
ob_start();
session_start();

$_SESSION['name'] = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
$_SESSION['s_ad_id']= isset($_SESSION['s_ad_id']) ? $_SESSION['s_ad_id'] : '';
$_SESSION['s_user_id']= isset($_SESSION['s_user_id']) ? $_SESSION['s_user_id'] : '';
$_SESSION['s_name'] = isset($_SESSION['s_name']) ? $_SESSION['s_name'] : '';
$_SESSION['s_email']=  isset($_SESSION['s_email']) ? $_SESSION['s_email'] : '';

$predefined_perpage=10;
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title> Admin Panel</title>
    <!--                       CSS                       -->
    <!-- Reset Stylesheet -->
    <link rel="stylesheet" href="css/reset.css" type="text/css" media="screen">
    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
    <link rel="stylesheet" type="text/css" href="calendar.css">
    <!-- Invalid Stylesheet. This makes stuff look pretty. Remove it if you want the CSS completely valid -->
 <!--   <link rel="stylesheet" href="css/invalid.css" type="text/css" media="screen">-->
 
<script src="js/jquery.js" type="text/javascript" language="javascript"></script>
<script src="js/regvalidate.js" type="text/javascript" language="javascript"></script>
<script language="JavaScript" type="text/javascript"  src="js/calendar_us.js"></script>
<script src="js/comment-reply.js" type="text/javascript"></script>  
	<script type="text/javascript" src="login_data/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="login_data/jquery-ui.min.js"></script>
<!--	<script type="text/javascript" src="login_data/jquery.tablednd_0_5.js"></script> -->
	<script src="login_data/jquery.js" type="text/javascript" language="javascript"></script>
   
</head>
<body>
<script type="text/javascript">



	
	function accordionMenu(){
		//Initialize the event
		$( "#main-nav" ).accordion({ event: 'mouseover' });
		//Get the event
		var event = $( "#main-nav" ).accordion( "option", "event" );
		//Set the event
		$( "#main-nav" ).accordion( "option", "event", 'mouseover' );
	}
	
	
	
	function styles(){			
	/*var topMsgWidth=$('.top_message').width();
	var bodyWidth=$('body').width();
	var remainWidth=bodyWidth-topMsgWidth;
	
	$('.top_message').css('margin-left',remainWidth);	
	$('.notification').css('padding-right',remainWidth);	*/
	$( ".content-box" ).draggable({ appendTo: '.main-content' });
	//getter
	var appendTo = $( ".selector" ).draggable( "option", "appendTo" );
	//setter
	$( ".content-box" ).draggable( "option", "appendTo", '.content' );
	

			 $(".content-box-header").toggle(
                                function () {
                                   $(this).next().slideUp(500);
                                },
                            function () {
                               $(this).next().slideDown(500);
            });
			
			$(".close").click(function () {
               $(this).parents('.notification').fadeOut(1000);
            });		
			
			$(".notification").click(function () {		
			var noti=$('.notification');			
			for(var i=0;i<noti.length;i++)
			{
			$(noti[i]).css('z-index', '5');
			}	
               $(this).css('z-index', '6');
            });				
			
			$(".topError").toggle(
                                function () {								
								$('.notification').hide();
								var width=$(this).width();
								var height=$(this).height();
								$(this).find('.notification').css('margin-left',0);
								$(this).find('.notification').css('width',$(window).width()-400);
                                $(this).find('.notification').show(600);							
									
                                },
                            function () {							
                                $(this).find('.notification').hide(1000);
            });
			
			
			
	}
</script>
    <div id="body-wrapper">
        <!-- Wrapper for the radial gradient background -->
        <div id="sidebar">
            <div id="sidebar-wrapper"> <!-- Sidebar with logo and menu -->
			
			<h1 id="sidebar-title"><a href="#">Admin Panel</a></h1>
		  
			<!-- Logo (221px wide) -->
			<!--<a href="#"><img id="logo" src="login_data/logo.png" style="margin-top:80px;" alt="Simple Admin logo"></a>-->
	   <a href="admin_panel.php"><img id="logo" src="login_data/logo.png" style="margin-top:80px;" alt=""></a>

		  
			<!-- Sidebar Profile links -->
			<div id="profile-links">
				Hello, <a href="#" title="Edit your profile"><?php echo $_SESSION['name']; ?></a><!--, you have <a href="#messages" rel="modal" title="3 Messages">3 Messages</a>-->
				<!--<?php include('currenttime.php');?>-->
				<!--<a href="#" title="View the Site">View the Site</a> |--><br/>		</div>
<?php ob_flush(); ?>
			
