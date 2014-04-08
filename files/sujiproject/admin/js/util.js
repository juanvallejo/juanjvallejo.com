// JavaScript Document
  function createXmlHttpRequestObject()
  {
    var xmlHTTP;
    try
    {
      xmlHTTP=new XMLHttpRequestObject();
    }
    catch(e)
    {
      var xmlHttpVersions= new Array( "MSXML2.XMLHTTP.6.0",
                                      "MSXML2.XMLHTTP.5.0",
                                      "MSXML2.XMLHTTP.4.0",
                                      "MSXML2.XMLHTTP.3.0",
                                      "MSXML2.XMLHTTP",
                                      "Microsoft.XMLHTTP");
      for(var i=0;i<xmlHttpVersions.length && !xmlHTTP;i++)
      {
        try
        {
          xmlHTTP=new ActiveXObject(xmlHttpVersions[i]);
        }
        catch(e){}
      }
      if(!xmlHTTP){
        try{
          var xmlHTTP = new XMLHttpRequest();
        }
        catch(e){
        }
      }
        
    }
    if(!xmlHTTP)
      alert("Error creating the Object");
    else
      return xmlHTTP;
  }

 
 
