$(document).live("ready",function() {
	var pressed = false;
	var month;
	var year;
	var m;
	var y;
	$('#content').load('css/core/cal.php', function() {
		month = parseInt($('#month_id').html());
		year = parseInt($('#year_id').html());
	});
	
	$(document).keydown(function(e) {
		if(e.shiftKey) {
			pressed = true;
		}
		if(pressed && e.keyCode == 39 && year < 100) {
			var change = new Change(1);
			change.month();
		} else if(pressed && e.keyCode == 37 && year > 00) {
			var change = new Change(-1);
			change.month();
		} else if(pressed && e.keyCode == 38 && year < 99) {
			var change = new Change(1);
			change.year();
		} else if(pressed && e.keyCode == 40 && year > 00) {
			var change = new Change(-1);
			change.year();
		}
	});
	$(document).keyup(function(e) {
		pressed = false;
	});
	
	$('#calendar ul.days li.day').live("click",function(e) {
		$('#calendar ul.days li.day').removeClass('selected');
		var event = new Event("Add Event");
		if(event.isVisible()) {
			event.hide();
			delete event;
		} else {
			event.show(e);
			$(this).addClass('selected');
		}
		var ths = $(this);
		event.click(".close",function() {
			event.hide();
		});

		var day = $(this).children("span.month_id").html();
		event.setDate(month,day,year);
		event.click("#event_create",function() {
			if(event.getTitle())
				event.create();
				else alert("The event could not be parsed");
		});
	});
		
	$('#calendar ul.events li').live("click",function(e) {
		e.stopPropagation();
		var event = new Event("Edit Event");
		var title = $(this).children("span.event_title").html();
		event.defineEvent = title;
		event.buttonText = "edit event";
		if(event.isVisible()) {
			event.hide();
			$(this).parent().parent("li.day").removeClass('selected');
		} else {
			event.show(e);
			$(this).parent().parent("li.day").addClass('selected');
		}
		
		var ths = $(this);
		event.click(".close",function() {
			ths.parent().parent("li.day").removeClass('selected');
			event.hide();
		});
		
		var day = $(this).parent().parent("li.day").children("span.month_id").html();
		var id = $(this).children(".event_id").html();
		event.setDate(month,day,year);
		event.click("#event_create",function() {
			if(event.getTitle()) event.modify(id);
				else alert("Error modifying event");
		});
		event.click("#event_delete",function() {
			event.delete(id);
		});
	});
	
	function Calendar(mo,tar,yr) {
		this.month = mo;
		this.year = yr;
		this.target = tar;
	
		this.fetchData = function() {
			var target = this.target;
			if(target === undefined) target = "#content";
			$.ajax({type:'POST',url:'css/core/cal.php',data:{month:this.month,year:this.year},success:function(data) {
					$(target).html(data);
				}
			});
		}
	}
	function Change(mo,yr) {
		this.mo = mo;
		this.yr = yr;
		
		this.month = function() {
			month = month+this.mo;
			if(month > 12) {
				var div = parseInt(month / 12);
				div = (12*div);
				month = (month-div);
				if(!(month % 12)) {
					month = (month+12);
				}
				var math = parseInt(this.mo/12); 
				year = year+math;
				if(math == 0) {
					year = year+1;
				}
			} else if(month < 1) {
				var div = parseInt(month / 12);
				div = div-1;
				div = (12*div);
				month = (month-div);
				var math = parseInt(this.mo/12); 
				year = year-math;
				if(math == 0) {
					year = year-1;
				}
			}
			if(month < 10) {
				m = "0"+month;
			} else {
				m = month;
			}
			if(year < 10) {
				y = "0"+year;
			} else {
				y = year;
			}
			var cal = new Calendar(m,'#content',y);
			cal.fetchData();
		}
		this.year = function() {
			if(this.yr === undefined) {
				this.yr = this.mo;
				if(month < 10) {
					m = "0"+month;
				} else {
					m = month;
				}
			} else {
				if(this.mo < 10) {
					m = "0"+this.mo;
				} else {
					m = this.mo;
				}
			}
			year = year+this.yr;
			if(year < 10) {
				y = "0"+year;
			} else {
				y = year;
			}
			var cal = new Calendar(m,'#content',y);
			cal.fetchData();
		}
	}
	function Event(heading) {
		this.obj = $('#event');
		this.heading = heading;
		this.editing = false;
		this.date = null;
		this.error = null;
		this.buttonText = "create event";
		this.defineEvent = false;
		this.title = null;
		
		this.show = function(e) {
			var math = (e.pageX < 700 ? e.pageX/5 : e.pageX/2);
			var width = (e.pageX < 700 ? this.obj.width()/5 : this.obj.width()/2);
			var x = math+width;
			var height = $(document).height();
			var y = (e.pageY >= (height - this.obj.height()*1.2) ? e.pageY-(this.obj.height()) : e.pageY-(this.obj.height()/2));
			
			var title = this.obj.find("#event_title").children("span").children("input");
			
			this.obj.fadeIn(100).css({'left':x,'top':y});
			this.obj.children("#event_heading").html(this.heading);
			this.obj.find("#event_create").html(this.buttonText);
			title.focus();
			if(this.defineEvent) {
				this.obj.find("#event_title").children("span").children("input").val(this.defineEvent);
				this.obj.find("#event_delete").fadeIn(500);
			} else title.val("");
		}
		this.isVisible = function() {
			if(this.obj.is(':visible')) {
				return true;
			} else
				return false;
		}
		this.hide = function() {
			this.obj.fadeOut(100);
			var cal = new Calendar();
			cal.fetchData();
		}
		this.click = function(item,callback) {
			this.obj.find(item).click(function() {
				callback.call();	
			});
		}
		this.hasElement = function(button) {
			var check = this.obj.find(button).attr("class");
			if(check === undefined) {
				var checkId = this.obj.children(button).attr("id");
				if(checkId === undefined) {
					var checkHtml = this.obj.children(button).html();
					if(checkHtml === null) {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
		this.create = function() {
			$.ajax({type:'POST',url:'css/core/class.event.php',data:{title:this.title,date:this.date,id:'id1'},success:function(data) {
					if(data=="success") {
						var cal = new Calendar();
						cal.fetchData();
					} else {
						alert(data);
					}
				}
			});
		}
		this.getTitle = function() {
			var title = this.obj.find("#event_title").children("span").children("input");
			if(this.title = title.val())
				return true;
				else return false;
		}
		this.setDate = function(month,day,year) {
			year = (year < 10 ? "0"+year : year);
			var months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			this.obj.find("#event_date").children("span").html(months[month]+' '+day+', &lsquo;'+year);
			month = (month < 10 ? "0"+month : month);
			day = (day < 10 ? "0"+day : day);
			this.date = month+'/'+day+'/'+year;
		}
		this.modify = function(id) {
			$.ajax({type:'POST',url:'css/core/class.event.php',data:{title:this.title,date:this.date,eventId:id,id:'id2'},success:function(data) {
					if(data=="success") {
						var cal = new Calendar();
						cal.fetchData();
					} else alert(data);
				}
			});
		}
		this.delete = function(id) {
			$.ajax({type:'POST',url:'css/core/class.event.php',data:{eventId:id,id:'id3'},success:function(data) {
					if(data=="success") {
						var cal = new Calendar();
						cal.fetchData();
					} else alert(data);
				}
			});
		}
	}
});