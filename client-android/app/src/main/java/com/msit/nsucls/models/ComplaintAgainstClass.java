package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ComplaintAgainstClass {
    private String fullname;
    private String nsuID;

    @JsonProperty("fullname")
    public String getFullname() { return fullname; }
    @JsonProperty("fullname")
    public void setFullname(String value) { this.fullname = value; }

    @JsonProperty("nsuId")
    public String getNsuID() { return nsuID; }
    @JsonProperty("nsuId")
    public void setNsuID(String value) { this.nsuID = value; }
}