package com.msit.nsucls.api;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.msit.nsucls.api.listeners.CommentListener;
import com.msit.nsucls.api.listeners.ComplaineeListener;
import com.msit.nsucls.api.listeners.ComplaintDetailsListener;
import com.msit.nsucls.api.listeners.LoginListener;
import com.msit.nsucls.api.listeners.MyComplaintsListener;
import com.msit.nsucls.helpers.Converter;
import com.msit.nsucls.helpers.Utils;
import com.msit.nsucls.models.Complaint;
import com.msit.nsucls.models.ComplaintDetails;
import com.msit.nsucls.models.User;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class APIManagerSingleton {
    private static final String baseUrl = Utils.backendUrl;
    private static APIManagerSingleton apiManager = null;
    private final RequestQueue queue;

    private APIManagerSingleton(Context context) {
        this.queue = Volley.newRequestQueue(context);
    }

    public static APIManagerSingleton getApiManager(Context context) {
        if (apiManager == null) {
            apiManager = new APIManagerSingleton(context);
        }

        return apiManager;
    }

    public void login(String email, String password, LoginListener loginListener) {
        String url = baseUrl + "/auth/login";

        JSONObject body = new JSONObject();
        try {
            body.put("email", email);
            body.put("password", password);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        JsonObjectRequest loginRequest = new JsonObjectRequest(Request.Method.POST, url, body, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    loginListener.onError(response.getString("message"));
                    return;
                }
                JSONObject jsonObject = response.getJSONObject("data");
                String userToken = jsonObject.getString("userToken");
                String userSessionToken = jsonObject.getString("userSessionToken");
                String actorType = jsonObject.getString("actorType");
                loginListener.onResponse(userToken, userSessionToken, actorType);
            } catch (Exception e) {
                e.printStackTrace();
                loginListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            loginListener.onError(error.getMessage());
        });

        queue.add(loginRequest);
    }

    public void postComment(String userToken, String userSessionToken, String complaintToken, String comment, CommentListener commentListener) {
        String url = baseUrl + "/reviewer/new/comment";

        JSONObject body = new JSONObject();
        try {
            body.put("complaintToken", complaintToken);
            body.put("comment", comment);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        JsonObjectRequest commentRequest = new JsonObjectRequest(Request.Method.POST, url, body, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    commentListener.onError(response.getString("message"));
                    return;
                }
                String responseString = response.getString("message");

                commentListener.onResponse(responseString);
            } catch (Exception e) {
                e.printStackTrace();
                commentListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            commentListener.onError(error.getMessage());
        }){
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("usertoken", userToken);
                headers.put("usersessiontoken", userSessionToken);

                return headers;
            }
        };

        queue.add(commentRequest);
    }

    public void getListOfComplaint(String userToken, String userSessionToken, boolean isLodged, MyComplaintsListener myComplaintsListener) {
        String url;

        if (isLodged) {
            url = baseUrl + "/user/lodged/all";
        } else {
            url = baseUrl + "/user/review/all";
        }

        JsonObjectRequest myComplaintList = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    myComplaintsListener.onError(response.getString("message"));
                    return;
                }
                JSONObject jsonObject = response.getJSONObject("data");
                JSONArray jsonArray = jsonObject.getJSONArray("items");
                List<Complaint> complaintList = new ArrayList<>();
                System.out.println(jsonArray.length());
                for (int i = 0; i < jsonArray.length(); i++) {
                    complaintList.add(Converter.complaintJsonString(jsonArray.getJSONObject(i).toString()));
                }
                myComplaintsListener.onResponse(complaintList);
            } catch (Exception e) {
                e.printStackTrace();
                myComplaintsListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            myComplaintsListener.onError(error.getMessage());
        }) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("usertoken", userToken);
                headers.put("usersessiontoken", userSessionToken);

                return headers;
            }
        };

        queue.add(myComplaintList);
    }

    public void getComplaintDetails(String userToken, String userSessionToken, String complaintToken, ComplaintDetailsListener complaintDetailsListener) {
        String url= baseUrl + "/complaint/details/" + complaintToken;

        JsonObjectRequest myComplaintDetails = new JsonObjectRequest(Request.Method.GET, url, null, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    complaintDetailsListener.onError(response.getString("message"));
                    return;
                }
                JSONObject jsonObject = response.getJSONObject("data");
                ComplaintDetails complaint = Converter.complaintDetailsJsonString(jsonObject.toString());
                complaintDetailsListener.onResponse(complaint);
            } catch (Exception e) {
                e.printStackTrace();
                complaintDetailsListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            complaintDetailsListener.onError(error.getMessage());
        }) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("usertoken", userToken);
                headers.put("usersessiontoken", userSessionToken);

                return headers;
            }
        };

        queue.add(myComplaintDetails);
    }

    public void getComplainee(String userToken, String userSessionToken, String keyword, ComplaineeListener complaineeListener) {
        String url = baseUrl + "/complaint/search/all/";
        JSONObject body = new JSONObject();
        try {
            body.put("keyword", keyword);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        JsonObjectRequest myComplaintList = new JsonObjectRequest(Request.Method.POST, url, body, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    complaineeListener.onError(response.getString("message"));
                    return;
                }
                JSONObject jsonObject = response.getJSONObject("data");
                JSONArray jsonArray = jsonObject.getJSONArray("items");
                List<User> userList = new ArrayList<>();
                for (int i = 0; i < jsonArray.length(); i++) {
                    userList.add(Converter.userJsonString(jsonArray.getJSONObject(i).toString()));
                }
                complaineeListener.onResponse(userList);
            } catch (Exception e) {
                e.printStackTrace();
                complaineeListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            complaineeListener.onError(error.getMessage());
        }) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("usertoken", userToken);
                headers.put("usersessiontoken", userSessionToken);

                return headers;
            }
        };

        queue.add(myComplaintList);
    }

    public void getReviewer(String userToken, String userSessionToken, String keyword, ComplaineeListener complaineeListener) {
        String url = baseUrl + "/complaint/search/reviewer/";
        JSONObject body = new JSONObject();
        try {
            body.put("keyword", keyword);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }

        JsonObjectRequest myComplaintList = new JsonObjectRequest(Request.Method.POST, url, body, response -> {
            try {
                if (response.getString("responseCode").equals("TRY_AGAIN")) {
                    complaineeListener.onError(response.getString("message"));
                    return;
                }
                JSONObject jsonObject = response.getJSONObject("data");
                JSONArray jsonArray = jsonObject.getJSONArray("items");
                List<User> userList = new ArrayList<>();
                for (int i = 0; i < jsonArray.length(); i++) {
                    userList.add(Converter.userJsonString(jsonArray.getJSONObject(i).toString()));
                }
                complaineeListener.onResponse(userList);
            } catch (Exception e) {
                e.printStackTrace();
                complaineeListener.onError(e.getMessage());
            }
        }, error -> {
            error.printStackTrace();
            complaineeListener.onError(error.getMessage());
        }) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("usertoken", userToken);
                headers.put("usersessiontoken", userSessionToken);

                return headers;
            }
        };

        queue.add(myComplaintList);
    }
}
