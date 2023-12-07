package com.msit.nsucls.api.listeners;

public interface LoginListener {
    void onResponse(String userToken, String userSessionToken, String actorType);

    void onError(String e);
}
