package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public class ComplaintAgainst {
    private String token;
    private String status;
    private long version;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private ComplaintAgainstClass complaintAgainst;

    @JsonProperty("token")
    public String getToken() { return token; }
    @JsonProperty("token")
    public void setToken(String value) { this.token = value; }

    @JsonProperty("status")
    public String getStatus() { return status; }
    @JsonProperty("status")
    public void setStatus(String value) { this.status = value; }

    @JsonProperty("version")
    public long getVersion() { return version; }
    @JsonProperty("version")
    public void setVersion(long value) { this.version = value; }

    @JsonProperty("createdAt")
    public OffsetDateTime getCreatedAt() { return createdAt; }
    @JsonProperty("createdAt")
    public void setCreatedAt(OffsetDateTime value) { this.createdAt = value; }

    @JsonProperty("updatedAt")
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    @JsonProperty("updatedAt")
    public void setUpdatedAt(OffsetDateTime value) { this.updatedAt = value; }

    @JsonProperty("complaintAgainst")
    public ComplaintAgainstClass getComplaintAgainst() { return complaintAgainst; }
    @JsonProperty("complaintAgainst")
    public void setComplaintAgainst(ComplaintAgainstClass value) { this.complaintAgainst = value; }
}