package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.*;
import java.time.OffsetDateTime;

public class ComplaintEvidence {
    private String token;
    private String fileName;
    private String originalFileName;
    private String status;
    private long version;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @JsonProperty("token")
    public String getToken() { return token; }
    @JsonProperty("token")
    public void setToken(String value) { this.token = value; }

    @JsonProperty("fileName")
    public String getFileName() { return fileName; }
    @JsonProperty("fileName")
    public void setFileName(String value) { this.fileName = value; }

    @JsonProperty("originalFileName")
    public String getOriginalFileName() { return originalFileName; }
    @JsonProperty("originalFileName")
    public void setOriginalFileName(String value) { this.originalFileName = value; }

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

    @Override
    public String toString() {
        return originalFileName;
    }
}

