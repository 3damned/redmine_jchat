
var chatVisible= true;
var latestId = 0;
var newMessage=0;
var justSubmittedMessage=1;
var initializer=2;
function setCookie(NameOfCookie, value, expiredays)
{

// Three variables are used to set the new cookie.
// The name of the cookie, the value to be stored,
// and finally the number of days until the cookie expires.
// The first lines in the function convert
// the number of days to a valid date.

var ExpireDate = new Date ();
ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));

// The next line stores the cookie, simply by assigning
// the values to the "document.cookie" object.
// Note the date is converted to Greenwich Mean time using
// the "toGMTstring()" function.

document.cookie = NameOfCookie + "=" + escape(value) +
((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
}
function getCookie(NameOfCookie)
{

// First we check to see if there is a cookie stored.
// Otherwise the length of document.cookie would be zero.

if (document.cookie.length > 0)
{

// Second we check to see if the cookie's name is stored in the
// "document.cookie" object for the page.

// Since more than one cookie can be set on a
// single page it is possible that our cookie
// is not present, even though the "document.cookie" object
// is not just an empty text.
// If our cookie name is not present the value -1 is stored
// in the variable called "begin".

begin = document.cookie.indexOf(NameOfCookie+"=");
if (begin != -1) // Note: != means "is not equal to"
{

// Our cookie was set.
// The value stored in the cookie is returned from the function.

begin += NameOfCookie.length+1;
end = document.cookie.indexOf(";", begin);
if (end == -1) end = document.cookie.length;
return unescape(document.cookie.substring(begin, end)); }
}
return null;

// Our cookie was not set.
// The value "null" is returned from the function.

}

function expandChat()
{
        setCookie('chatExpanded','0',21,'','','');
        chatVisible = true;
        $("#chatArea").hide();
}
function collapseChat()
{
        setCookie('chatExpanded','1',21,'','','');
        chatVisible = false;
        $("#chatArea").show();
        setTimeout('scrollChatNewest()',50);
}
function toggleChat()
{
        if (!chatVisible)  expandChat();
        else   collapseChat();
}
function scrollChatNewest()
{
$('chatMessages').scrollTop = $('chatMessages').scrollHeight;
}
function chat_init()
{
        //if (getCookie('chatExpanded') == '1') collapseChat();
        refreshChat();
        setTimeout('scrollChatNewest()',50);
        $('txtMsg').observe('keypress', function(event){
        var key = event.which || event.keyCode;
    switch (key) {
        default:
        break;
        case Event.KEY_RETURN:
            submitMsg();
        break;
    }
});

	// Event.observe('chatArea', 'mouseover', function(event) {
 //    		newMessage=0;
	// });
    $('#chatArea').bind("mouseover", function(event){
        newMessage=0;
    });


}

// $(document).keypress(function(e) {
//     if(e.which == 13) {
//         alert('You pressed enter!');
//     }
// });

$(document).on('keypress','#txtMsg',function(e){
    if(e.which == 13) {
        text=$(this).val();
          if (text=="") return;
        $(this).val("");
        $.post( redmineRootPath+'/chat/send_chat', {msg: text} , function( data ) {
            scrollChatNewest();
            justSubmittedMessage=2;
        });
    }
});
function submitMsg()
{
      text=$('txtMsg').value;
      if (text=="") return;
	$('txtMsg').value="";
 
    $.ajax({
        type: "POST",
        data: {msg: text},
        global: false,
        url: redmineRootPath+'/chat/send_chat',

    })
    .done(function( msg ) {
        scrollChatNewest();
        justSubmittedMessage=2;
    });

}
var preContent='0';
function refreshChat()
{
    preContent='0';
	initializer=2;
    window.setInterval(function() {
        
        $.ajax({
            type: "GET",
            global: false,
            url: redmineRootPath+'/chat/receive_chat',
        })
            .done(function( msg ) {
            var chatBlock = $('#chatMessages');
            chatBlock.html(msg);
            var top = chatBlock.scrollTop();
            var height = chatBlock.height();
            chatBlock.animate({scrollTop: height+76}, 100);
            
        });

    }, 3000);


}

// When a new message comes in we want the chat area to flash "New message" as well as the window title bar.
// this should occur until we get a hover even that fires on the 

(function () {

var original = document.title;
var timeout;

window.flashMsg = function (newMsg) {
    function step() {
        document.title = (document.title == original) ? newMsg : original;
	$('#chatFooter').innerHTML = ($('#chatFooter').innerHTML == "Chat") ? newMsg : "Chat";
        if (newMessage==1) {
            timeout = setTimeout(step, 1000);
        }else{
		$('#chatFooter').innerHTML = "Chat";
		document.title = original;
	};
    };


    clearTimeout(timeout);

    step();
};

window.cancelFlashTitle = function () {
    clearTimeout(timeout);
    document.title = original;
};

}());
