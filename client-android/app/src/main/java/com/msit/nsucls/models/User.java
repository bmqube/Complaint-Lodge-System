package com.msit.nsucls.models;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.io.IOException;
import java.time.OffsetDateTime;

public class User {
    private String token;
    private String nsuID;
    private String fullname;
    private String email;
    private String authType;
    private String userType;
    private String actorType;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    @JsonProperty("token")
    public void setToken(String value) {
        this.token = value;
    }

    @JsonProperty("nsuId")
    public String getNsuID() {
        return nsuID;
    }

    @JsonProperty("nsuId")
    public void setNsuID(String value) {
        this.nsuID = value;
    }

    @JsonProperty("fullname")
    public String getFullname() {
        return fullname;
    }

    @JsonProperty("fullname")
    public void setFullname(String value) {
        this.fullname = value;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    @JsonProperty("email")
    public void setEmail(String value) {
        this.email = value;
    }

    @JsonProperty("authType")
    public String getAuthType() {
        return authType;
    }

    @JsonProperty("authType")
    public void setAuthType(String value) {
        this.authType = value;
    }

    @JsonProperty("userType")
    public String getUserType() {
        return userType;
    }

    @JsonProperty("userType")
    public void setUserType(String value) {
        this.userType = value;
    }

    @JsonProperty("actorType")
    public String getActorType() {
        return actorType;
    }

    @JsonProperty("actorType")
    public void setActorType(String value) {
        this.actorType = value;
    }

    @JsonProperty("status")
    public String getStatus() {
        return status;
    }

    @JsonProperty("status")
    public void setStatus(String value) {
        this.status = value;
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

    @Override
    public String toString() {
        return getFullname() + " (" + getNsuID() + ")";
    }
}
