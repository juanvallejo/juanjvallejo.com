<?php
include('db.php');
$mi = $_POST['month'];
if(empty($mi)) {
	$mi = date('m');
}
if($mi < 10) {
	$mi = explode("0",$mi);
	$mi = $mi[1];
}
$year = $_POST['year'];
if(empty($year)) {
	$year = date('y');
}
$month = array('null','January','February','March','April','May','June','July','August','September','October','November','December');
	echo "<span id='month' class='ui'>{$month[$mi]} &lsquo;{$year}</span>";
	echo "<span class='hidden' id='month_id'>{$mi}</span>";
	echo "<span class='hidden' id='year_id'>{$year}</span>";
		
	if($mi < 9) {
		if($mi % 2 || $mi == 8) {
			$end = 31;
		} elseif($mi == 2) {
			if($year % 4) {
				$end = 28;
			} else {
				$end = 29;
			}
		} else {
			$end = 30;
		}
	} else {
		if($mi % 2) {
			$end = 30;
		} else {
			$end = 31;
		}
	}
	?>
	<div id="calendar">
		<ul class="week ui">
		<?php
		$days = array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
		for($i=0;$i<7;$i++) {
			echo "<li>".$days[$i]."</li>";
		}
		if($mi < 10) {
			$mi = "0".$mi;
		}
		?>
		</ul>
		<ul class="days">
		<?php
		if($mi == "01" || $mi == "04" || $mi == "07") {
			$l = 0;
		} elseif($mi == "02" || $mi == "08") {
			$l = 3;
		} elseif($mi == "03" || $mi == "11") {
			$l = 4;
		} elseif($mi == "05") {
			$l = 2;
		} elseif($mi == "06") {
			$l = 5;
		} elseif($mi == "09" || $mi == "12") {
			$l = 6;
		} elseif($mi == "10") {
			$l = 1;
		}
		if($year == '12') {
			$l = $l;
		} else {
			$math = ($year - 12);
			$l = $l + $math;
			if($math < 0) {
				$l = $l - 1;
				if($year % 4) {
					if($math < -4) {
						$math = intval($math / 4);
						$l = ($l + $math);
					}
					if($mi == "01" || $mi == "02") {
						$l = $l + 1;
					}
				} else {
					if($math < -4) {
						$math = intval($math / 4);
						$l = ($l + $math);
						$l = $l + 1;
					}
				}
			} else {
				if($year % 4) {
					if($mi == "01" || $mi == "02") {
						$l = $l + 1;
					}
					$math = intval($math / 4);
					$l = ($l + $math);
				} else {
					if($math > 4) {
						$l = $l-1;
						$math = intval($math / 4);
						$l = ($l+$math);
					} else {
						$l = $l+1;
					}
				}
			}
		}
		if($l < 0) {
			if($l >= -7) {
				$l = ($l + 7);
			} else {
				$h = ($l * -1);
				$div = intval($h/7);
				if($h % 7) {
					$div = ($div + 1);
				}
				$div = (7*$div);
				$l = ($l + $div);
			}
		}
		if($l > 6) {
			$div = intval($l / 7);
			$div = (7 * $div);
			$l = ($l - $div);
			
			if($year % 4) {
				$l = $l;
			} else {
				$l = ($l+1);
				if($year == "16") {
					$l = ($l-1);
				}
				if($year >= "20" && $l == "7") {
					$l = 0;
				}
			}
		}
		for($i=0;$i<$l;$i++) {
			echo "<li></li>";
		}
		$today = date('j');
		for($i=1;$i<=$end;$i++) {
			if($today == $i && $mi == date('m') && $year == date('y')) {
				$day_select = " today";
			} else {
				$day_select = "";
			}
			echo "<li class='day{$day_select}'><span class='month_id ui'>".$i."</span>
				<ul class='events'>";
				if($i < 10) {
					$e = "0".$i;
				} else {
					$e = $i;
				}
				$string = "{$mi}/{$e}/{$year}";
				$sql = mysql_query("SELECT * FROM events WHERE date='$string'");
				while($fetch = mysql_fetch_array($sql)) {
					echo "<li tabindex='-1'><span class='event_title'>{$fetch['name']}</span><span class='event_id hidden'>{$fetch['id']}</span></li>";
				}
			echo "</ul>
			</li>";
		}
		?>
		</ul>
		<div id="event">
			<div class="close">&times;</div><!--.close-->
			<span id="event_heading" class="title ui" style="text-align:center;display:block;width:100%;color:#d0d0d0;"></span>
			<div id="event_body">
				<span id="event_date" class="event">When: <span><?php  ?></span></span>
				<span id="event_title" class="event">What: <span><input type="text" id="event_title_input"/></span></span>
				<div class="button" id="event_create">create event</div><!--.button-->
				<div class="button hidden" id="event_delete">delete</div><!--.button-->
			</div><!--#event_body-->
		</div><!--#event-->
	</div><!--#calendar-->