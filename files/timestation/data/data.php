<?php
$link = mysql_connect('localhost','spujet','metamorph2016');
mysql_select_db('spujet_ts',$link);
class ImgResizer {
    private $originalFile = '';
    public function __construct($originalFile = '') {
        $this -> originalFile = $originalFile;
    }
    public function resize($newWidth, $targetFile) {
        if (empty($newWidth) || empty($targetFile)) {
            return false;
        }
        $src = imagecreatefromjpeg($this -> originalFile);
        list($width, $height) = getimagesize($this -> originalFile);
        $newHeight = ($height / $width) * $newWidth;
        $tmp = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($tmp, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        if (file_exists($targetFile)) {
            unlink($targetFile);
        }
        imagejpeg($tmp, $targetFile, 85); // 85 is my choice, make it between 0 – 100 for output image quality with 100 being the most luxurious
    }
}
class Upload {
	private $completed,$error;
	public function iconize($file) {
		$size = getimagesize("images/".$file['name']);
		$width = $size[0] >= 191 ? 191 : $size[0];
		$img = new ImgResizer("images/".$file['name']);
		$img->resize($width,"thumbs/".$file['name']);
		$this->store($file);
	}
	public function load($file) {
		$n = count($file);
		for($i=0;$i<$n;$i++) {
			$size = getimagesize($file[$i]["tmp_name"]);
			if($size[0] > 700) {
				$this->resize($file[$i]);
			} else {
				$this->move($file[$i]);
			}
		}
		if($this->completed) {
			echo "success";
		} else {
			die($this->error);
		}
	}
	public function move($file) {
		if(move_uploaded_file($file["tmp_name"],"images/".$file["name"])) {
			$this->iconize($file);
		} else {
			die("Unable to move file ".$file["name"]." (32)");
		}
	}
	public function resize($file) {
		$size = getimagesize($file);
		$width = $size[0];
		$height = $size[1];
		$img = new ImgResizer($file["tmp_name"]);
		$img->resize(700,"images/".$file['name']);
		$this->iconize($file);
	}
	public function store($file) {
		$time = time();
		$src = "data/images/".$file["name"];
		$thumb = "data/thumbs/".$file["name"];
		if(mysql_query("INSERT INTO `all` (thumb,src,time,author) VALUES ('$thumb','$src','$time','Pictre')")) {
			$this->completed = true;
		} else {
			$this->completed = false;
			$this->error = mysql_error();
		}
	}
}
class Get {
	public function data($data) {
		$request = $data["request"];
		$anchor = $data["anchor"];
		$limit = $data["limit"];
		$query = "";
		if($request == "all") {
			$query = "SELECT * FROM `all` ORDER BY time DESC LIMIT $anchor,$limit";
		}
		if($results = mysql_query($query)) {
			$array = array();
			$i = 0;
			while($get = mysql_fetch_assoc($results)) {
				$array[$i] = array();
				$array[$i]["id"] = $get["id"];
				$array[$i]["thumb"] = $get["thumb"];
				$array[$i]["src"] = $get["src"];
				$array[$i]["time"] = $get["time"];
				$array[$i]["author"] = $get["author"];
				$i++;
			}
			$array["length"] = mysql_num_rows($results);
			echo json_encode($array,JSON_FORCE_OBJECT);
		} else {
			die(mysql_error());
		}
	}
}
if(isset($_FILES) && count($_FILES) > 0) {
	$up = new Upload;
	$up->load($_FILES);
} elseif(isset($_POST)) {
	$get = new Get;
	$get->data($_POST);
} else {
	die("NO_DATA");
}
?>