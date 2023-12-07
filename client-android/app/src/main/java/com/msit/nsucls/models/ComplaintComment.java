package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.*;
import java.time.OffsetDateTime;

public class ComplaintComment {
    private String token;
    private String commentType;
    private String comment;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private User author;

    @JsonProperty("token")
    public String getToken() { return token; }
    @JsonProperty("token")
    public void setToken(String value) { this.token = value; }

    @JsonProperty("commentType")
    public String getCommentType() { return commentType; }
    @JsonProperty("commentType")
    public void setCommentType(String value) { this.commentType = value; }

    @JsonProperty("comment")
    public String getComment() { return comment; }
    @JsonProperty("comment")
    public void setComment(String value) { this.comment = value; }

    @JsonProperty("status")
    public String getStatus() { return status; }
    @JsonProperty("status")
    public void setStatus(String value) { this.status = value; }

    @JsonProperty("createdAt")
    public OffsetDateTime getCreatedAt() { return createdAt; }
    @JsonProperty("createdAt")
    public void setCreatedAt(OffsetDateTime value) { this.createdAt = value; }

    @JsonProperty("updatedAt")
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    @JsonProperty("updatedAt")
    public void setUpdatedAt(OffsetDateTime value) { this.updatedAt = value; }

    @JsonProperty("author")
    public User getAuthor() { return author; }
    @JsonProperty("author")
    public void setAuthor(User value) { this.author = value; }
}