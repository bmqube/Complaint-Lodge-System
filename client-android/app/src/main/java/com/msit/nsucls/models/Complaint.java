package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.io.IOException;
import java.time.OffsetDateTime;

// Complaint.java

public class Complaint {
    private String token;
    private String description;
    private String status;
    private long version;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private User reviewer;
    private User lodger;
    private ComplaintAgainst[] complaintAgainsts;

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    @JsonProperty("token")
    public void setToken(String value) {
        this.token = value;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String value) {
        this.description = value;
    }

    @JsonProperty("status")
    public String getStatus() {
        return status;
    }

    @JsonProperty("status")
    public void setStatus(String value) {
        this.status = value;
    }

    @JsonProperty("version")
    public long getVersion() {
        return version;
    }

    @JsonProperty("version")
    public void setVersion(long value) {
        this.version = value;
    }

    @JsonProperty("createdAt")
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    @JsonProperty("createdAt")
    public void setCreatedAt(OffsetDateTime value) {
        this.createdAt = value;
    }

    @JsonProperty("updatedAt")
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    @JsonProperty("updatedAt")
    public void setUpdatedAt(OffsetDateTime value) {
        this.updatedAt = value;
    }

    @JsonProperty("reviewer")
    public User getReviewer() {
        return reviewer;
    }

    @JsonProperty("reviewer")
    public void setReviewer(User value) {
        this.reviewer = value;
    }

    @JsonProperty("user")
    public User getLodger() {
        return lodger;
    }

    @JsonProperty("user")
    public void setLodger(User value) {
        this.lodger = value;
    }

    @JsonProperty("ComplaintAgainsts")
    public ComplaintAgainst[] getComplaintAgainsts() {
        return complaintAgainsts;
    }

    @JsonProperty("ComplaintAgainsts")
    public void setComplaintAgainsts(ComplaintAgainst[] value) {
        this.complaintAgainsts = value;
    }
}