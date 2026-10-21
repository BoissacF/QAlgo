<?php if (file_exists("compteurquantique.txt"))
{ /* ouverture du fichier en lecture */ 
$fp = fopen("compteurquantique.txt","r+");
$compteurfree = fgets($fp,255);
$compteurfree++;
fseek($fp,0);
fputs($fp,$compteurfree);
fclose($fp); 
}


?>

