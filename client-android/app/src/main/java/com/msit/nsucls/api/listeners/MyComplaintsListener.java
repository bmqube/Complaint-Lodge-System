package com.msit.nsucls.api.listeners;

import com.msit.nsucls.models.Complaint;

import java.util.List;

public interface MyComplaintsListener {
    void onResponse(List<Complaint> complaintList);
    void onError(String error);

}
