package com.msit.nsucls.api.listeners;

import com.msit.nsucls.models.User;

public interface CommentListener {
    void onResponse(String responseMessage);

    void onError(String e);
}
