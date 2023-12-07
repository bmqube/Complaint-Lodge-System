package com.msit.nsucls.api.listeners;

import com.msit.nsucls.models.User;

import java.util.List;

public interface ComplaineeListener {
    void onResponse(List<User> list);

    void onError(String e);
}
