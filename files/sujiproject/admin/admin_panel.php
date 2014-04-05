<?php
include("header.php");  
include("sidebar.php");
$_SESSION['s_name'] = isset($_GET['u']) ? $_GET['u'] : "Guest";
?>
        <div id="main-content">
            <!-- Main Content Section with everything -->
        
			 
		
            <!-- Page Head -->
            <h2>
                Welcome <?php echo $_SESSION['s_name']; ?></h2>
            
           
            <!-- End .shortcut-buttons-set -->
            <div class="clear">
	               <div class="content-box">
                <div class="content-box-content">
                    <div style="display: block;" class="tab-content default-tab" id="tab1"> 
                       <img src='login_data/Admin.bmp' alt='Administrator'>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
<?php
include("footer.php");
?>
