package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.*;
import java.time.OffsetDateTime;

public class ComplaintDetails {
    private String token;
    private String description;
    private String status;
    private long version;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private User user;
    private User reviewer;
    private ComplaintAgainst[] complaintAgainsts;
    private ComplaintEvidence[] complaintEvidences;
    private ComplaintComment[] complaintComments;

    @JsonProperty("token")
    public String getToken() { return token; }
    @JsonProperty("token")
    public void setToken(String value) { this.token = value; }

    @JsonProperty("description")
    public String getDescription() { return description; }
    @JsonProperty("description")
    public void setDescription(String value) { this.description = value; }

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

    @JsonProperty("user")
    public User getUser() { return user; }
    @JsonProperty("user")
    public void setUser(User value) { this.user = value; }

    @JsonProperty("reviewer")
    public User getReviewer() { return reviewer; }
    @JsonProperty("reviewer")
    public void setReviewer(User value) { this.reviewer = value; }

    @JsonProperty("ComplaintAgainsts")
    public ComplaintAgainst[] getComplaintAgainsts() { return complaintAgainsts; }
    @JsonProperty("ComplaintAgainsts")
    public void setComplaintAgainsts(ComplaintAgainst[] value) { this.complaintAgainsts = value; }

    @JsonProperty("ComplaintEvidences")
    public ComplaintEvidence[] getComplaintEvidences() { return complaintEvidences; }
    @JsonProperty("ComplaintEvidences")
    public void setComplaintEvidences(ComplaintEvidence[] value) { this.complaintEvidences = value; }

    @JsonProperty("ComplaintComments")
    public ComplaintComment[] getComplaintComments() { return complaintComments; }
    @JsonProperty("ComplaintComments")
    public void setComplaintComments(ComplaintComment[] value) { this.complaintComments = value; }
}