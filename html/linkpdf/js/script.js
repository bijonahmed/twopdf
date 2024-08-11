$(document).ready(function(){
    $(".btn_sidebar").click(function(){
        $('.sidebar_list').toggleClass("show");
    })
})
$(document).ready(function(){
    $(".profile_card .update_btn").click(function(){
        $(".profile_card .change_form").toggleClass("show");
    })
    $(".profile_card .update_btn_mail").click(function(){
        $(".email_change").toggleClass("show");
    })
})
$(document).ready(function(){
    $(".update_btn_pass").click(function(){
        $(".pass_form").toggleClass("show");
    })
})
$(document).ready(function(){
    $(".btn_settings").click(function(){
        $(".pdf_options").toggleClass('show');
    })
})