package com.msit.nsucls.api.listeners;

import com.msit.nsucls.models.ComplaintDetails;

public interface ComplaintDetailsListener {
    void onResponse(ComplaintDetails complaint);

    void onError(String e);
}
