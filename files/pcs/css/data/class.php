<?php
class Core {
	protected $name;
	public function parseFile() {
		$name = explode(".",$_FILES['file']['name']);
		$this->name = mb_convert_case($name[0],MB_CASE_LOWER,"UTF-8");
		$ext = mb_convert_case($name[1],MB_CASE_LOWER,"UTF-8");
		if($ext == "doc" || $ext == "docx") {
			$this->handleDoc();
		} elseif($ext == "zip") {
			$this->handleZip();
		} else {
			putAlert("Error, file not supported");
		}
	}
	public function handleDoc() {
		if(!file_exists("css/data/zips/".$this->name.".zip")) {
			if(move_uploaded_file($_FILES['file']['tmp_name'],"css/data/".$_FILES['file']['name'])) {
				if(rename("css/data/".$_FILES['file']['name'],"css/data/zips/".$this->name.".zip")) {
					$this->unzipFile("css/data/zips/".$this->name.".zip",$this->name);
				} else {
					putAlert("Error converting file");
				}
			} else {
				putAlert("Unexpected error, try again");
			}
		} else {
			if(delDir("css/data/zips/".$this->name."/")) {
				if(unlink("css/data/zips/".$this->name.".zip")) {
					$this->handleDoc();
				} else {
					putAlert("Error deleting old compressed files");
				}
			} else {
				putAlert("Error deleting old files");
			}
		}
	}
	public function unzipFile($path,$name) {
		$zip = new ZipArchive;
		$res = $zip->open($path);
		if($res === true) {
			if(mkdir("css/data/zips/".$name,0775)) {
				$zip->extractTo("css/data/zips/".$name."/");
				$zip->close();
				$this->writeFile();
			} else {
				putAlert("Error creating paths");
			}
		} else {
			putAlert("Decompression error");
		}
	}
	public function compressFile() {
		if(unlink("css/data/zips/".$this->name.".zip")) {
			$zip = new ZipArchive;
			if($zip->open("css/data/zips/".$this->name.".zip",ZIPARCHIVE::CREATE) === true) {
				$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("css/data/zips/".$this->name."/"));
				foreach($iterator as $key=>$value) {
					$add = $zip->addFile(realpath($key),$key);
				}
				if($add) {
					$data = $this->name.".zip";
					if(isset($_COOKIE['saved_files'])) {
						if(setcookie("saved_files",$data.",".$_COOKIE['saved_files'],time()+86400*360,"/")) {
							putAlert("File modified successfully");
						} else {
							putAlert("Error saving data");
						}
					} else {
						if(setcookie("saved_files",$data,time()+86400*360,"/")) {
							putAlert("<a class='ui' href='".$data."'>File modified successfully, click to download</a>");
						} else {
							putAlert("Error creating a save file");
						}
					}
				} else {
					putAlert("Error compressing new files");
				}
			} else {
				putAlert("Error compressing file");
			}
		} else {
			putAlert("Error executing compression removal");
		}
	}
	public function handleZip() {
		if(!file_exists("css/data/zips/".$_FILES['file']['name'])) {
			if(move_uploaded_file($_FILES['file']['tmp_name'],"css/data/zips/".$_FILES['file']['name'])) {
				$this->unzipFile("css/data/zips/".$_FILES['file']['name'],$this->name);
			} else {
				putAlert("Error uploading file");
			}
		} else {
			if(delDir("css/data/zips/".$this->name."/")) {
				if(unlink("css/data/zips/".$this->name.".zip")) {
					$this->handleZip();
				} else {
					putAlert("Error deleting old compressed files");
				}
			} else {
				putAlert("Error deleting old files");
			}
		}
	}
	
	public function writeFile() {
		if(file_exists("css/data/zips/".$this->name."/word/media/image2.png")) {
			if(unlink("css/data/zips/".$this->name."/word/media/image2.png")) {
				if(copy("css/i/image1.png","css/data/zips/".$this->name."/word/media/image2.png")) {
					$this->compressFile();
				} else {
					putAlert("Error replacing file attributes");
				}
			} else {
				putAlert("Error deleting media");
			}
		} else {
			putAlert("File contains no data to replace");
		}
	}
}

function putAlert($text) {
	echo "<span class='ui-alert'>";
	echo 	"<div class='ui-bg'></div>";
	echo 	$text;
	echo "</span>";
}
function delDir($path) {
		if(substr($path, strlen($path)-1, 1) != "/") {
			$path .= "/";
		}
		if($handle = opendir($path)) {
			while($obj = readdir($handle)) {
				if($obj != "." && $obj != "..") {
					if(is_dir($path.$obj)) {
						if(!delDir($path.$obj)) {
							return false;
						}
					} elseif(is_file($path.$obj)) {
						if(!unlink($path.$obj)) {
							return false;
						}
					}
				}
			}
			closedir($handle);
			if(!rmdir($path))
				return false;
			return true;
		}
		return false;
}
?>