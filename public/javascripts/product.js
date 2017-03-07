
    function successOnProductRemove() { 
        window.location.href  = '/products'; 
    }
    
    function errorOnProductRemove() {
        console.log("Error: On AJAX call for removing product.");
    }
    
     function successOnCommentPost(data) {
        var commentHTML = 
            '<li class="list-group-item" data-comment-id="' + data.comment._id + '">' +
                '<div class="comment">' +
                    '<span class="author">' + data.user.username  + '</span>&nbsp;says:&nbsp;' +
                    '<span class="comment-body">' + data.comment.body + '</span>' +
                '</div>' + 
                '<div class="text-right">' + 
                '<button type="button" class="btn btn-xs btn-danger remove-comment" aria-label="Remove comment" data-product-id="'+ data.product._id + '" data-comment-id="' + data.comment._id + '">' +
                    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
                '</button> ' +
                '<button type="button" class="btn btn-xs btn-primary update-comment" aria-label="Update comment" data-product-id="' + data.product._id + '" data-comment-id="' + data.comment._id + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                '</button>' +
                '</div>' +
          '</li>';

        $("#comments").append(commentHTML);
        $("#body").val("");
    }

    function errorOnCommentPost() { 
        console.log("Error: On AJAX call for posting comment."); 
    }
    
    function successOnCommentRemove(cid) {
        $("li[data-comment-id=" + cid + "]").remove();
    }
    
    function successOnCommentUpdate(data) {
        $('#comments li[data-comment-id=' + data.comment._id + '] .comment .comment-body').text(data.comment.body);

        $('#comments .btn.remove-comment').toggleClass('disabled');
        $('#comments .btn.update-comment').toggleClass('disabled');
        $('#comment-update-input').remove();
    }
    
    function errorOnCommentUpdate() { 
        console.log("Error: On AJAX call for updating comment.");
    }

    function errorOnCommentRemove() { 
        console.log("Error: On AJAX call for removing comment.");
    }
    function remove(id) {
        $.ajax({
            method: 'DELETE',
            url: '/products/' + id,
            success: successOnProductRemove,
            error: errorOnProductRemove
        })
    }

    function postComment(id, body) {
        $.ajax({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: '/products/' + id + '/comments',
            data: { body: body },
            success: successOnCommentPost,
            error: errorOnCommentPost
        })
    }

    function removeComment(id, cid) {
        $.ajax({
            method: 'DELETE',
            url: '/products/' + id + '/comments/' + cid,
            success: successOnCommentRemove(cid),
            error: errorOnCommentRemove
        })
    }

    function updateComment(id, cid, body) {
        $.ajax({
            method: 'PUT',
            url: '/products/' + id + '/comments/' + cid,
            data: { body: body },
            success: successOnCommentUpdate,
            error: errorOnCommentUpdate
        })
    }

    $('#remove').on('click', function() {
        remove($(this).attr('data-product-id'));
    });
    $('#post-comment').on('click', function() {
        postComment($(this).attr('data-product-id'), $("#body").val());
    });
    $(document).on("click",".btn.remove-comment:not(.disabled)", function() {
        removeComment($(this).attr('data-product-id'), $(this).attr('data-comment-id'));
    });
    $(document).on("click",".btn.update-comment:not(.disabled)", function() {
        var productId = $(this).attr('data-product-id');
        var commentId = $(this).attr('data-comment-id');
        var commentItemsSelector = '#comments li[data-comment-id="' + commentId + '"]';
        var commentSelector = commentItemsSelector + ' .comment';
        var commentInputHTML = 
            '<div class="row" id="comment-update-input">' +
                '<div class="form-group col-xs-12">' +
                    '<textarea class="form-control" rows="3" id="comment-update-body" name="body" placeholder="Post your comment here...">' + $(commentSelector + ' .comment-body').text() + '</textarea>' +
                    '<button type="button" class="btn btn-xs btn-default" aria-label="Cancel" id="update-comment-cancel" data-product-id="' + productId + '" data-comment-id="' + commentId + '">Cancel</button> ' +
                    '<button type="button" class="btn btn-xs btn-success" aria-label="Update comment" id="update-comment-done" data-product-id="' + productId + '" data-comment-id="' + commentId + '">Done ' +
                        '<span class="glyphicon glyphicon-send" aria-hidden="true"></span>'
                    '</button>' +
                '</div>' +
            '</div>';

        $('#comments .btn.remove-comment').toggleClass('disabled');
        $('#comments .btn.update-comment').toggleClass('disabled');
        
        $(commentSelector).append(commentInputHTML);
    });
    $(document).on("click","#update-comment-done", function() {
        updateComment($(this).attr('data-product-id'), $(this).attr('data-comment-id'), $('#comment-update-body').val());
    });
    $(document).on("click","#update-comment-cancel", function() {
        $('#comments .btn.remove-comment').toggleClass('disabled');
        $('#comments .btn.update-comment').toggleClass('disabled');
        $('#comment-update-input').remove();
    });