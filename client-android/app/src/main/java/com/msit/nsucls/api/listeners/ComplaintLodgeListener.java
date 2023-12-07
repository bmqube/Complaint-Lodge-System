package com.msit.nsucls.api.listeners;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface ComplaintLodgeListener {
    @Multipart
    @POST("new")
    Call<ResponseBody> callMultipleUploadApi(@Header("usertoken") String userToken, @Header("usersessiontoken") String userSessionToken, @Part List<MultipartBody.Part> image);
}
