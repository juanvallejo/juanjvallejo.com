<?php
class Post {
	public $err,$type,$author,$img;
	public function __construct($t) {
		$this->author = "Juan Vallejo";
		$this->type = $t;
	}
	public function push($title,$content,$tags) {
		$i = 0;
		$tags = urldecode($tags);
		$title = htmlentities($title,ENT_QUOTES);
		$content = htmlentities($content,ENT_QUOTES);
		$parseTag = explode(",",$tags);
		foreach($parseTag as $tag) {
			$comma = $i == 0 ? "" : ",";
			$parsedTags .= $comma."/".trim($tag)."/";
			$i++;
		}
		$url = $this->type == "work" ? "work" : "";
		$date = date("n/j/Y");
		$sysDate = date("Y-m-d");
		$page = $this->type == "work" ? 1 : 0;
		if(mysql_query("INSERT INTO posts(title,author,post,url,date,systemDate,pageId,tags,img) VALUES ('$title','$this->author','$content','$url','$date','$sysDate','$page','$parsedTags','$imgPath')")) {
			return true;
		} else {
			$this->err = mysql_error();
			return false;
		}
	}
	public function delete($id) {
		if(mysql_query("DELETE FROM posts WHERE id='$id'")) {
			return true;
		} else {
			$this->err = mysql_error();
			return false;
		}
	}
}
?>