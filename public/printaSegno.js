function PrintSegno() {

    var myNodelist = document.getElementById("segno");
    document.getElementsByName("segno").innerHtml = myNodelist;
    console.log(myNodelist.value);
    alert(myNodelist.value);


}