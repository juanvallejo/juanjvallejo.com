<?php
function PageNumber($start=0,$totalrows,$link,$rowperpage,$leftpage=10,$rightpage=9,$pageClass,$CurrentpageClass)
{
        $currentpage=$start/$rowperpage;
        $pages=ceil($totalrows/$rowperpage);
        $pagemenu=$endpage="";
        if($pages<>0)
        {
                if($currentpage<=$rightpage)
                        $startpage=0;
                else
                        $startpage=$currentpage-$leftpage;
                if(($currentpage+$rightpage>$pages))
                        $endpage=$pages-1;
                else
                        $endpage=$currentpage+$rightpage;

                $cur = $currentpage + 1;
                if($currentpage>0){
                 //$pagemenu=" <a href='$link&page=$cur&start=0'>First</a>&nbsp; ";
                 $pagemenu="<a href='$link&page=$cur&start=0' title='First Page'>First</a>";
                 //$pagemenu .=" <a href='$link&page=$cur&start=".($currentpage-1)*$rowperpage."'><<</a> ";
                 $pagemenu.="<a href='$link&page=$cur&start=".($currentpage-1)*$rowperpage."' title='Previous Page'>« Previous</a>";
                }

                for($i=$startpage;$i<=$endpage;$i++)
                {
                       if($i==$currentpage)
                                //$pagemenu.=" <b>".($i+1)."</b> ";
                                $pagemenu.="<a class='".$CurrentpageClass."' title='".($i+1)."'>".($i+1)."</a>";
                        else
                               //$pagemenu.=" <a href='$link&page=$i&start=".$i*$rowperpage."'>".($i+1)."</a> ";
                               $pagemenu.="<a href='$link&page=".$i."&start=".$i*$rowperpage."' class='".$pageClass."' title='".($i+1)."'>".($i+1)."</a>";
                }
        }
        $cur = $currentpage + 1;
        if($endpage!=$currentpage){
            //$pagemenu .=" <a href='$link&page=$cur&start=".($currentpage+1)*$rowperpage."'>>></a> ";
            $pagemenu .=" <a href='$link&page=$cur&start=".($currentpage+1)*$rowperpage."' title='Next Page'>Next »</a>";
           // $pagemenu .=" <a href='$link&page=".($pages-1)."&start=".(($pages-1)*$rowperpage)."'>Last</a>&nbsp; ";
           $pagemenu .=" <a href='$link&page=".($pages-1)."&start=".(($pages-1)*$rowperpage)."' title='Last Page'>Last »</a> &nbsp; ";
        }

        return $pagemenu;
}

function generatePassword($length, $strength) {
	$vowels = 'aeuy';
	$consonants = 'bdghjmnpqrstvz';
	if ($strength & 1) {
		$consonants .= 'BDGHJLMNPQRSTVWXZ';
	}
	if ($strength & 2) {
		$vowels .= "AEUY";
	}
	if ($strength & 4) {
		$consonants .= '23456789';
	}
	if ($strength & 8) {
		$consonants .= '@#$%';
	}

	$password = '';
	$alt = time() % 2;
	for ($i = 0; $i < $length; $i++) {
		if ($alt == 1) {
			$password .= $consonants[(rand() % strlen($consonants))];
			$alt = 0;
		} else {
			$password .= $vowels[(rand() % strlen($vowels))];
			$alt = 1;
		}
	}
	return $password;
}
?>
